// REQUIRE NPM PACKAGES
const http = require('http');
const express = require('express');
const app = express();
const httpServer = http.createServer(app);
const osUtils = require('node-os-utils');
const os = require('os');
const io = require('socket.io')(httpServer);
// View Engine ans static public folder
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// Route
app.get('/', (req, res) => {
    res.render('index.ejs');
});
// CPU USAGE
const cpu = osUtils.cpu;
// USER and OS
const username = os.userInfo([{ encoding: 'buffer' }]).username;
const osInfo = os.type();
// SOCKET IO
io.on('connection', socket => {
    console.log(`${socket.id} connected`);
    // USE SET INTERVAL TO CHECK RAM USAGE EVERY SECOND
    setInterval(() => {
        // RAM USED tot - free
        let ramUsed = Math.round(os.totalmem()) - Math.round(os.freemem());
        // RAM percentage
        let ram = (ramUsed * 100 / Math.round(os.totalmem())).toFixed(0);
        // console.log(ram + '%')
        // CPU USAGE PERCENTAGE
        cpu.usage().then(cpu => socket.emit('ram-usage', { ram, cpu, username, osInfo }))
    }, 1000);
});

// Run the server
let PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Server beating 💓 on port: ${PORT}`)
});