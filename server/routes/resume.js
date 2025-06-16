const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { 
  extractTextFromPdf, 
  generateQuestions, 
  generateFollowUpQuestions, 
  calculateATSScore,
  generateAIQuestions
} = require('../utils/resumeParser');

const router = express.Router();

// In-memory store for interview sessions
const interviewSessions = new Map();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Generate a unique session ID
function generateSessionId() {
  return 'session-' + Math.random().toString(36).substr(2, 9);
}

// Start a new interview session
router.post('/start-interview', upload.single('resume'), async (req, res, next) => {
  console.log('Received request to /start-interview');
  
  if (!req.file) {
    console.error('No file was uploaded or file type is invalid');
    return res.status(400).json({ 
      success: false,
      message: 'No file uploaded or invalid file type' 
    });
  }

  const filePath = req.file.path;
  const jobDescription = req.body.jobDescription || '';
  console.log(`Processing file: ${filePath}, size: ${req.file.size} bytes`);
  
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    console.log(`Successfully read ${fileBuffer.length} bytes from file`);
    
    // Extract text from PDF
    console.log('Extracting text from PDF...');
    const resumeText = await extractTextFromPdf(fileBuffer);
    console.log(`Successfully extracted ${resumeText.length} characters from PDF`);
    
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('Extracted resume text is empty');
    }
    
    // Calculate ATS score
    console.log('Calculating ATS score...');
    const atsScore = calculateATSScore(resumeText, jobDescription);
    console.log(`ATS score calculated: ${atsScore}`);
    
    // Generate questions based on resume content and job description
    console.log('Generating questions...');
    const questions = generateQuestions(resumeText);
    console.log(`Generated ${questions.length} standard questions`);
    
    const aiQuestions = await generateAIQuestions(resumeText, jobDescription);
    console.log(`Generated ${aiQuestions.length} AI questions`);
    
    // Combine both sets of questions
    const allQuestions = [...questions, ...aiQuestions];
    
    // Create a new interview session
    const sessionId = generateSessionId();
    const session = {
      id: sessionId,
      resumeText: resumeText,
      questions: allQuestions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date(),
      completed: false,
      atsScore: atsScore,
      jobDescription: jobDescription
    };
    
    interviewSessions.set(sessionId, session);
    
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    
    // Get the first question
    const currentQuestion = allQuestions[0];
    
    res.json({
      success: true,
      sessionId: sessionId,
      atsScore: atsScore,
      question: currentQuestion.question,
      questionType: currentQuestion.type,
      context: {
        skill: currentQuestion.skill || currentQuestion.context?.skill,
        company: currentQuestion.company || currentQuestion.context?.company,
        position: currentQuestion.position || currentQuestion.context?.role,
        project: currentQuestion.project
      },
      progress: {
        current: 1,
        total: allQuestions.length
      },
      questions: allQuestions
    });
    
  } catch (error) {
    console.error('Error processing resume:', error);
    
    // Clean up the file if it exists
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up file after error: ${filePath}`);
      } catch (cleanupError) {
        console.error('Error cleaning up file after error:', cleanupError);
      }
    }
    
    next(error); // Pass error to the error handling middleware
  }
});

// Error handling middleware for this router
router.use((err, req, res, next) => {
  console.error('Resume route error:', err);
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.'
    });
  }
  
  // Handle file type errors
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only PDF files are allowed'
    });
  }
  
  // Default error response
  res.status(500).json({
    success: false,
    message: 'Error processing resume',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;
