const path = require('path');
const { ipcRenderer } = require('electron');
const notifier = require('node-notifier')
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload;
let alertFrequency;

//Get settings & values
ipcRenderer.on('settings:get', (e, settings) => {
    cpuOverload = +settings.cpuOverload;
    alertFrequency = +settings.alertFrequency;
})

notifyUser({
    title: 'CPU Overload',
    message: `CPU is over ${cpuOverload}`
})

//Run every 2 seconds
setInterval(() => {
    //CPU usage
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').innerText  = info + '%';

        document.getElementById('cpu-progress').style.width = info + '%';

        //Make progress bar red if overload
        if(info > cpuOverload){
            document.getElementById('cpu-progress').style.background = 'red'
        } else {
            document.getElementById('cpu-progress').style.background = '#30c88b';
        }

                    //Check overload
        if(info >= cpuOverload && runNotify(alertFrequency)){
            notifyUser({
                title: 'CPU Overload',
                message: `CPU is over ${cpuOverload}`
            })
        
            localStorage.setItem('lastNotify', +new Date())
        } 
    });



    //CPU FREE
    cpu.free().then(info => {
        document.getElementById('cpu-free').innerText = info + '%';
    });

    //UP time
    document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());
}, 2000)


//Set model
document.getElementById('cpu-model').innerText = cpu.model();

//Computer name
document.getElementById('comp-name').innerText = os.hostname();

//OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

//Total mem
mem.info().then(info => {
    document.getElementById('mem-total').innerText = info.totalMemMb;
})


//Show days, hours, mins, sec
function secondsToDhms(seconds){
    seconds = +seconds;
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d, ${h}h, ${m}m, ${s}`;
}

//Send notifications
function notifyUser(options){
    notifier.notify({
        title: options.title,
        message: options.message
    });

    console.log(options)
}

//Check how much time has passed since notification
function runNotify(frequency){
    if(localStorage.getItem('lastNotify') === null){
        //Store timestamp
        localStorage.setItem('lastNotify', +new Date())
        return true;
    }

    const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')));
    const now = new Date();
    const diffTime = Math.abs(now - notifyTime);
    const minutesPassed = Math.ceil(diffTime / (1000 * 60));

    if(minutesPassed > frequency){
        return true;
    } else {
        return false;
    }
}