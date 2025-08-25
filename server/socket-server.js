const { createServer } = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/wilsons';

io.on('connection', socket => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Function to emit new meow event
function emitNewMeow() {
  io.emit('newMeow');
}

// Export the function so it can be called from API routes
module.exports = { io, emitNewMeow };

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
