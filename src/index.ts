import './pre-start'; // Must be the first import
import logger from 'jet-logger';
import app from './server';

import http from "http";
const httpServer = http.createServer(app);

// Constants
const serverStartMsg = 'Express server started on port: ',
port = (process.env.PORT || 8080);

// Start server
httpServer.listen(port, () => {
    logger.info(serverStartMsg + port);
});
