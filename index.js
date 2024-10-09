const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const os = require('os');
const { exec } = require('child_process');

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
                exec('xdotool key k', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing command: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });

                break;
            case 'pause':
                // Logic to pause media
                exec('xdotool key space', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing command: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });


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