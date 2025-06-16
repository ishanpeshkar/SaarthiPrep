const WebSocket = require('ws');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    // Send initial data to the client
    const initialData = {
      type: 'INITIAL_DATA',
      payload: {
        message: 'Connected to progress updates',
        timestamp: new Date().toISOString()
      }
    };
    ws.send(JSON.stringify(initialData));

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received:', data);
        
        // Handle different types of messages
        switch (data.type) {
          case 'PING':
            ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
            break;
          // Add more message types as needed
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });


  // Function to broadcast updates to all connected clients
  const broadcastUpdate = (type, payload) => {
    const message = JSON.stringify({ type, payload });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Simulate some updates for demo purposes
  const simulateUpdates = () => {
    const quizTopics = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'];
    const interviewTypes = ['Technical', 'Behavioral', 'System Design', 'Coding Challenge'];
    const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer'];

    // Simulate a quiz completion every 30 seconds
    setInterval(() => {
      const topic = quizTopics[Math.floor(Math.random() * quizTopics.length)];
      const score = Math.floor(Math.random() * 5) + 6; // Score between 6-10
      const total = 10;
      
      const quizData = {
        id: Date.now(),
        topic,
        score,
        total,
        date: new Date().toISOString()
      };

      broadcastUpdate('QUIZ_COMPLETED', quizData);
    }, 30000);

    // Simulate an interview completion every 2 minutes
    setInterval(() => {
      const type = interviewTypes[Math.floor(Math.random() * interviewTypes.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const score = Math.floor(Math.random() * 30) + 70; // Score between 70-100
      
      const interviewData = {
        id: Date.now(),
        type,
        role,
        score,
        date: new Date().toISOString()
      };

      broadcastUpdate('INTERVIEW_COMPLETED', interviewData);
    }, 120000);
  };

  // Start simulating updates (only in development)
  if (process.env.NODE_ENV !== 'production') {
    simulateUpdates();
  }

  return wss;
};

module.exports = setupWebSocket;
