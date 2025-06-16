import { useState, useEffect, useCallback } from 'react';

const useWebSocket = (url = 'ws://localhost:5000/progress-updates') => {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState({
    quizzes: [],
    interviews: []
  });
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);
      
      setData(prevData => {
        if (message.type === 'QUIZ_COMPLETED') {
          return {
            ...prevData,
            quizzes: [message.payload, ...prevData.quizzes]
          };
        } else if (message.type === 'INTERVIEW_COMPLETED') {
          return {
            ...prevData,
            interviews: [message.payload, ...prevData.interviews]
          };
        }
        return prevData;
      });
    };
    
    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };
    
    setSocket(ws);
    
    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  // Function to send data through WebSocket
  const sendData = useCallback((data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, [socket]);

  return { 
    data, 
    isConnected, 
    sendData 
  };
};

export { useWebSocket };
