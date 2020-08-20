// SOCKET IO
const socket = io();
// SELECT ELEMENTS
const labelRam = document.querySelector('.ram-label');
const progRam = document.querySelector('.ram-bar');
const labelCpu = document.querySelector('.cpu-label');
const progCpu = document.querySelector('.cpu-bar');
const user = document.querySelector('.user');
const os = document.querySelector('.os');

// ON CONNECT EVENT
socket.on('connect', () => {
    console.log('Connected');
});
// ON RAM USAGE EVENT
socket.on('ram-usage', ({ ram, cpu, username, osInfo }) => {
    // SHOW OS USER INFO
    user.innerHTML = `<span>Hello ${username}</span>`;
    os.innerHTML = `<span>OS type: ${osInfo === 'Windows_NT' ? 'Microsoft Windows' : osInfo}</span>`
        // Set ram label
    labelRam.innerHTML = `<span>RAM ${ram} % </span>`;
    // Set Ram bar
    progRam.value = ram;
    // Set cpu label
    labelCpu.innerHTML = `<span>CPU ${cpu} %</span>`
        // Set cpu bar
    progCpu.value = cpu;
    // Check
    if (cpu > 90) {
        notify(cpu)
    }
});

// NOTIFICATION FUNCTION
let notify = (info) => {
    // If granted
    if (Notification.permission === 'granted') {
        new Notification('Title', {
            body: `CPU over ${info} %`
        });
    }
    // If denied
    if (Notification.permission !== 'denied') {
        Notification.requestPermission()
            .then((permission) => {
                if (permission === 'granted') {
                    new Notification('Title', {
                        body: `CPU over ${info} %`
                    });
                };
            });
    };

};