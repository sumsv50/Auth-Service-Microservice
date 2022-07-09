import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import app from './server';

import { Server } from "socket.io";
import http from "http";
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});


// Constants
const serverStartMsg = 'Express server started on port: ',
        port = (process.env.PORT || 8080);

// Start server
httpServer.listen(port, () => {
    logger.info(serverStartMsg + port);
});

io.on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

export default io;
