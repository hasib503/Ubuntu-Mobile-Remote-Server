const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const os = require('os');
const { exec } = require('child_process');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const { spawn } = require('child_process');

app.get('/test', (req, res) => {
    
    const pythonProcess = spawn('python3', ['mouse_move.py']);


    // Capture output from Python script
    pythonProcess.stdout.on('data', (data) => {
        res.send(`Python output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send('Error running Python script.');
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python script finished with code ${code}`);
    });


});




io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('command', (data) => {
        console.log(`Command received: ${data}`);
        switch (data) {
            case 'play':
                exec('xdotool key k', handleExec);
                break;
            case 'pause':
                exec('xdotool key space', handleExec);
                break;
            default:
                console.log('Unknown command');
        }
    });

    socket.on('move', (data) => {
        console.log(`Move command received`);
        const { dx, dy } = data;



    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const handleExec = (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
};

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