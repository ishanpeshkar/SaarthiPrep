const pdf = require('pdf-parse');
const natural = require('natural');
const { WordTokenizer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();
const fs = require('fs');
const path = require('path');

// ATS scoring configuration
const ATS_SCORING = {
  keywords: { weight: 0.35, maxScore: 100 },
  skills: { weight: 0.25, maxScore: 100 },
  experience: { weight: 0.2, maxScore: 100 },
  education: { weight: 0.1, maxScore: 100 },
  format: { weight: 0.1, maxScore: 100 },
  // Industry-specific keywords that are valuable
  industryKeywords: [
    // General professional skills
    'leadership', 'teamwork', 'communication', 'problem-solving', 'critical thinking',
    'project management', 'time management', 'adaptability', 'creativity', 'collaboration',
    // Technical skills
    'agile', 'scrum', 'devops', 'ci/cd', 'machine learning', 'data analysis',
    'cloud computing', 'cybersecurity', 'blockchain', 'iot', 'ai', 'big data'
  ]
};

// Enhanced keywords to identify different sections in resume
const SECTION_KEYWORDS = {
  skills: ['skill', 'technical', 'technology', 'programming', 'framework', 'library', 'language', 'tool', 'platform'],
  experience: ['experience', 'work', 'employment', 'professional', 'internship', 'job'],
  education: ['education', 'academic', 'qualification', 'degree', 'university', 'college', 'school'],
  projects: ['project', 'portfolio', 'work sample', 'github', 'gitlab', 'contribution'],
  certifications: ['certification', 'certificate', 'course', 'training', 'workshop', 'seminar'],
  achievements: ['achievement', 'award', 'recognition', 'honor', 'publication', 'research']
};

// Context-aware question templates
const QUESTION_TEMPLATES = {
  // Skill-related questions
  skills: [
    { 
      question: "Can you walk me through a project where you used {skill}? What was your specific contribution?",
      followUp: "How did using {skill} impact the project's success?"
    },
    {
      question: "How do you stay updated with the latest developments in {skill}?",
      followUp: "Can you share a recent challenge you faced with {skill} and how you resolved it?"
    },
    {
      question: "What's your approach to learning a new technology like {skill}?",
      followUp: "How would you apply {skill} to solve [related problem]?"
    }
  ],
  
  // Experience-related questions
  experience: [
    {
      question: "At {company}, what was the most significant project you worked on and what was your role?",
      followUp: "What would you do differently if you had to do it again?"
    },
    {
      question: "What were the key challenges you faced during your time at {company} and how did you overcome them?",
      followUp: "What were the measurable outcomes of your contributions?"
    },
    {
      question: "How did your role at {company} evolve over time?",
      followUp: "What skills did you develop that you didn't expect to?"
    }
  ],
  
  // Project-related questions
  projects: [
    {
      question: "Tell me about the {project} project. What problem were you trying to solve?",
      followUp: "How did you measure the success of this project?"
    },
    {
      question: "What technical challenges did you face while working on {project}?",
      followUp: "How did you ensure the quality and maintainability of the code?"
    },
    {
      question: "How did you collaborate with your team on the {project} project?",
      followUp: "What would you do differently if you started this project today?"
    }
  ],
  
  // Education-related questions
  education: [
    {
      question: "How has your education at {institution} prepared you for your current career path?",
      followUp: "What was your favorite subject and why?"
    },
    {
      question: "What was your most challenging academic project or course at {institution}?",
      followUp: "How did you approach overcoming those challenges?"
    }
  ]
};

// Technical terms that might appear in resumes
const TECHNICAL_TERMS = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'TypeScript',
  'Rust', 'Scala', 'Dart', 'R', 'MATLAB', 'Perl', 'Haskell', 'Erlang', 'Elixir', 'Clojure', 'Lua',
  
  // Web Technologies
  'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
  'ASP.NET', 'Ruby on Rails', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Sass', 'Less', 'Webpack', 'Babel',
  'GraphQL', 'REST', 'gRPC', 'WebSockets', 'WebRTC',
  
  // Databases
  'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Oracle', 'SQL Server', 'Redis', 'Elasticsearch', 'DynamoDB',
  'Cassandra', 'Neo4j', 'Firebase', 'Cosmos DB', 'MariaDB', 'CouchDB', 'InfluxDB',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI',
  'GitHub Actions', 'CircleCI', 'Travis CI', 'Prometheus', 'Grafana', 'Kibana', 'ELK Stack', 'Istio',
  'Kong', 'Nginx', 'Apache',
  
  // Mobile Development
  'React Native', 'Flutter', 'Ionic', 'Xamarin', 'SwiftUI', 'Kotlin Multiplatform',
  
  // Data Science & AI/ML
  'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'OpenCV',
  'NLTK', 'spaCy', 'Hugging Face', 'Transformers', 'LangChain', 'LlamaIndex',
  
  // Other Technologies
  'Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts', 'Web3', 'IPFS', 'Arduino', 'Raspberry Pi',
  'Computer Vision', 'Natural Language Processing', 'Machine Learning', 'Deep Learning', 'Reinforcement Learning',
  'Big Data', 'Hadoop', 'Spark', 'Kafka', 'RabbitMQ', 'Microservices', 'Serverless', 'JWT', 'OAuth'
];

// Extract text from PDF buffer
async function extractTextFromPdf(buffer) {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error('Empty or invalid PDF buffer provided');
    }
    
    // Check if the buffer looks like a PDF (starts with '%PDF-')
    const header = buffer.toString('utf8', 0, 5);
    if (!header.includes('%PDF-')) {
      console.error('Invalid PDF header. File may be corrupted or not a PDF.');
      console.error('File header:', header);
      throw new Error('Invalid PDF file. The file may be corrupted or not a valid PDF.');
    }
    
    const data = await pdf(buffer);
    
    if (!data || !data.text) {
      throw new Error('PDF parsed successfully but no text was extracted');
    }
    
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    
    // Provide more specific error messages for common issues
    if (error.message.includes('Invalid PDF structure')) {
      throw new Error('Invalid PDF structure. The file may be corrupted.');
    } else if (error.message.includes('Failed to load PDF document')) {
      throw new Error('Failed to load PDF. The file may be corrupted or not a valid PDF.');
    } else if (error.message.includes('password protected')) {
      throw new Error('The PDF is password protected. Please remove the password and try again.');
    }
    
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Enhanced skill extraction with technical terms and context
function extractSkills(text) {
  const lines = text.split('\n');
  const skills = new Set();
  
  // First, look for explicit skill sections
  const skillSections = [];
  let currentSection = null;
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase().trim();
    
    // Check for section headers
    if (lowerLine.endsWith(':')) {
      const sectionType = Object.keys(SECTION_KEYWORDS).find(section => 
        SECTION_KEYWORDS[section].some(keyword => 
          lowerLine.includes(keyword)
        )
      );
      
      if (sectionType) {
        currentSection = sectionType;
        if (sectionType === 'skills') {
          skillSections.push(line.split(':')[0].trim());
        }
      } else {
        currentSection = null;
      }
    }
    
    // If we're in a skills section, look for technical terms
    if (currentSection === 'skills' || skillSections.some(section => line.includes(section))) {
      // Look for technical terms in the line
      TECHNICAL_TERMS.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'i');
        if (regex.test(line)) {
          skills.add(term);
        }
      });
    }
  });
  
  // Also scan the entire text for technical terms
  TECHNICAL_TERMS.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(text)) {
      skills.add(term);
    }
  });
  
  return Array.from(skills);
}

// Enhanced experience extraction
function extractExperience(text) {
  const lines = text.split('\n');
  const experiences = [];
  let currentExp = null;
  
  // Common job title indicators
  const titleIndicators = ['engineer', 'developer', 'designer', 'manager', 'analyst', 'specialist', 'consultant'];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Look for company names and positions
    const companyRegex = /(?:at|@|,)\s*([A-Z][A-Za-z0-9&.,\s-]+?)(?:\s*(?:\(|\||\n|$))/;
    const companyMatch = trimmedLine.match(companyRegex);
    
    // Look for date ranges (e.g., Jan 2020 - Present)
    const dateRangeRegex = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+\d{4})?)\s*-\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+\d{4})?|Present|Current|Now)/i;
    const dateMatch = trimmedLine.match(dateRangeRegex);
    
    // If we find a company and the line looks like a job title
    if (companyMatch && (titleIndicators.some(t => trimmedLine.toLowerCase().includes(t)) || dateMatch)) {
      const company = companyMatch[1].trim();
      let position = trimmedLine.split(/at|@/)[0].trim();
      
      // If there's a date range, try to separate it from the position
      if (dateMatch) {
        position = position.replace(dateMatch[0], '').trim();
      }
      
      // If we already have an experience, save it
      if (currentExp) {
        experiences.push(currentExp);
      }
      
      currentExp = {
        company: company,
        position: position,
        duration: dateMatch ? dateMatch[0] : null,
        description: []
      };
    } 
    // If we're in an experience block, collect the description
    else if (currentExp && trimmedLine && !trimmedLine.match(/^\s*$/)) {
      currentExp.description.push(trimmedLine);
    }
  });
  
  // Add the last experience if it exists
  if (currentExp) {
    experiences.push(currentExp);
  }
  
  return experiences;
}

// Extract projects from resume
function extractProjects(text) {
  const lines = text.split('\n');
  const projects = [];
  let inProjectSection = false;
  let currentProject = null;
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase().trim();
    
    // Check for project section
    if (lowerLine.includes('project') && lowerLine.length < 30) {
      inProjectSection = true;
      return;
    }
    
    // Look for project names (usually bold or followed by a colon)
    const projectMatch = line.match(/^\s*([A-Z][A-Za-z0-9\s-]+):?/);
    
    if (inProjectSection && projectMatch) {
      if (currentProject) {
        projects.push(currentProject);
      }
      currentProject = {
        name: projectMatch[1].trim(),
        description: []
      };
    } else if (currentProject && line.trim()) {
      currentProject.description.push(line.trim());
    }
  });
  
  if (currentProject) {
    projects.push(currentProject);
  }
  
  return projects;
}

// Generate contextual follow-up questions
function generateFollowUpQuestions(context, answer) {
  // This is a simplified version - in a real app, you'd use NLP to analyze the answer
  const followUps = [
    "Can you elaborate on that?",
    "What was the impact of that decision?",
    "How did you measure success in that situation?",
    "What would you do differently next time?",
    "How did you handle any challenges that came up?"
  ];
  
  // Simple keyword matching for context-aware follow-ups
  if (answer.toLowerCase().includes('challenge')) {
    followUps.push("How did you overcome that challenge?");
  }
  
  if (answer.toLowerCase().includes('team')) {
    followUps.push("How did you collaborate with your team in this situation?");
  }
  
  if (answer.toLowerCase().includes('learn')) {
    followUps.push("How have you applied what you learned since then?");
  }
  
  return followUps[Math.floor(Math.random() * followUps.length)];
}

// Generate interactive questions based on resume content
function generateQuestions(resumeText) {
  const skills = extractSkills(resumeText);
  const experiences = extractExperience(resumeText);
  const projects = extractProjects(resumeText);
  
  const questions = [];
  
  // Generate questions about skills
  skills.slice(0, 5).forEach(skill => {
    const template = QUESTION_TEMPLATES.skills[
      Math.floor(Math.random() * QUESTION_TEMPLATES.skills.length)
    ];
    
    questions.push({
      type: 'skill',
      skill: skill,
      question: template.question.replace('{skill}', skill),
      followUp: template.followUp.replace('{skill}', skill)
    });
  });
  
  // Generate questions about experience
  experiences.slice(0, 3).forEach(exp => {
    const template = QUESTION_TEMPLATES.experience[
      Math.floor(Math.random() * QUESTION_TEMPLATES.experience.length)
    ];
    
    let question = template.question
      .replace('{company}', exp.company || 'your previous company')
      .replace('{position}', exp.position || 'your role');
      
    let followUp = template.followUp
      .replace('{company}', exp.company || 'your previous company')
      .replace('{position}', exp.position || 'your role');
    
    questions.push({
      type: 'experience',
      company: exp.company,
      position: exp.position,
      question: question,
      followUp: followUp
    });
  });
  
  // Generate questions about projects
  projects.slice(0, 2).forEach(project => {
    const template = QUESTION_TEMPLATES.projects[
      Math.floor(Math.random() * QUESTION_TEMPLATES.projects.length)
    ];
    
    questions.push({
      type: 'project',
      project: project.name,
      question: template.question.replace('{project}', project.name),
      followUp: template.followUp.replace('{project}', project.name)
    });
  });
  
  // Add some general questions
  const generalTemplates = [
    "Walk me through your resume and highlight your most relevant experience.",
    "What are your greatest strengths that make you a good fit for this role?",
    "Can you describe a challenging situation you faced at work and how you handled it?",
    "What are you looking for in your next role?",
    "Where do you see yourself in 3-5 years?",
    "What's your approach to learning new technologies?",
    "How do you stay updated with industry trends?",
    "Can you describe your ideal work environment?"
  ];
  
  // Add 2-3 general questions
  const numGeneral = 2 + Math.floor(Math.random() * 2);
  const selectedGenerals = [];
  
  while (selectedGenerals.length < numGeneral && generalTemplates.length > 0) {
    const index = Math.floor(Math.random() * generalTemplates.length);
    selectedGenerals.push(generalTemplates.splice(index, 1)[0]);
  }
  
  selectedGenerals.forEach(question => {
    questions.push({
      type: 'general',
      question: question,
      followUp: generateFollowUpQuestions('general', '')
    });
  });
  
  // Shuffle questions
  return questions.sort(() => Math.random() - 0.5);
}

// Calculate ATS score for a resume
function calculateATSScore(resumeText, jobDescription = '') {
  // Convert to lowercase for case-insensitive matching
  const text = resumeText.toLowerCase();
  
  // Calculate keyword score
  const keywordMatches = ATS_SCORING.industryKeywords.filter(keyword => 
    text.includes(keyword.toLowerCase())
  ).length;
  const keywordScore = Math.min(
    (keywordMatches / ATS_SCORING.industryKeywords.length) * 100,
    ATS_SCORING.keywords.maxScore
  );
  
  // Calculate skills score (assuming skills are already extracted)
  const skills = extractSkills(resumeText);
  const skillsScore = Math.min(
    (skills.length / 10) * 100, // Assuming 10 is a good number of skills
    ATS_SCORING.skills.maxScore
  );
  
  // Calculate experience score
  const experience = extractExperience(resumeText);
  let experienceScore = 0;
  if (experience.length > 0) {
    const totalMonths = experience.reduce((total, exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      return total + Math.max(0, months);
    }, 0);
    
    // More experience = higher score, capped at maxScore
    experienceScore = Math.min(
      (Math.log(totalMonths + 1) / Math.log(60)) * 100, // Logarithmic scale
      ATS_SCORING.experience.maxScore
    );
  }
  
  // Calculate education score
  const educationScore = text.includes('bachelor') || text.includes('bs ') || 
                        text.includes('b.s.') || text.includes('b.a.') || 
                        text.includes('master') || text.includes('phd') ? 
                        ATS_SCORING.education.maxScore : 0;
  
  // Calculate format score (simple check for common sections)
  let formatScore = 0;
  const hasSections = Object.keys(SECTION_KEYWORDS).some(section => 
    SECTION_KEYWORDS[section].some(keyword => 
      text.includes(keyword)
    )
  );
  formatScore = hasSections ? ATS_SCORING.format.maxScore : ATS_SCORING.format.maxScore * 0.5;
  
  // Calculate weighted score
  const totalScore = 
    (keywordScore * ATS_SCORING.keywords.weight) +
    (skillsScore * ATS_SCORING.skills.weight) +
    (experienceScore * ATS_SCORING.experience.weight) +
    (educationScore * ATS_SCORING.education.weight) +
    (formatScore * ATS_SCORING.format.weight);
  
  return {
    ats: Math.round(totalScore),
    keywords: Math.round(keywordScore),
    skills: Math.round(skillsScore),
    experience: Math.round(experienceScore),
    education: Math.round(educationScore),
    format: Math.round(formatScore),
    keywordMatches: keywordMatches,
    totalKeywords: ATS_SCORING.industryKeywords.length
  };
}

// Generate AI questions based on resume and job description
async function generateAIQuestions(resumeText, jobDescription = '') {
  const questions = [];
  const skills = extractSkills(resumeText);
  const experience = extractExperience(resumeText);
  
  // Add skill-based questions
  skills.slice(0, 3).forEach(skill => {
    questions.push({
      type: 'skill',
      question: `Can you elaborate on your experience with ${skill}?`,
      context: { skill }
    });
  });
  
  // Add experience-based questions
  if (experience.length > 0) {
    const latestExp = experience[0];
    questions.push({
      type: 'experience',
      question: `What were your key achievements in your role at ${latestExp.company}?`,
      context: { company: latestExp.company, role: latestExp.title }
    });
  }
  
  // Add job-description specific questions if provided
  if (jobDescription) {
    const jdSkills = extractSkills(jobDescription);
    jdSkills.forEach(skill => {
      if (!skills.includes(skill)) {
        questions.push({
          type: 'skill_gap',
          question: `The job requires ${skill}. How would you approach learning this skill if needed?`,
          context: { missingSkill: skill }
        });
      }
    });
  }
  
  return questions;
}

module.exports = {
  extractTextFromPdf,
  extractSkills,
  extractExperience,
  extractProjects,
  generateQuestions,
  generateFollowUpQuestions,
  calculateATSScore,
  generateAIQuestions
};
