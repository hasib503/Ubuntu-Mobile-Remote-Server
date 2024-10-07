const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle commands from the client
    socket.on('command', (data) => {
        console.log(`Command received: ${data}`);
        // Add logic to handle commands
        switch (data) {
            case 'play':
                // Logic to play media
                break;
            case 'pause':
                // Logic to pause media
                break;
            // Add more cases for different commands
            default:
                console.log('Unknown command');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];
        for (const address of addresses) {
            if (address.family === 'IPv4' && !address.internal) {
                console.log(`Server IP address: ${address.address}`);
            }
        }
    }
});