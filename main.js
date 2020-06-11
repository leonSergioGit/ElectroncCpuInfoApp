//App: manages the lifecycle of the app
//Browser window creates windows
const path = require('path');
const os = require('os');
const MainWindow = require('./MainWIndow');
const Store = require('./Store');
const AppTray = require('./AppTray')

const { app, Menu, globalShortcut, ipcMain, shell, Tray} = require('electron');



//Set env
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let tray;

const store = new Store({
    configName: 'user-settings',
    defaults: {
        settings: {
            cpuOverload: 80,
            alertFrequency: 5
        },
    },
})

function createMainWindow() {
    mainWindow = new MainWindow('./app/index.html');
}



app.on('ready', () => {
    createMainWindow();

    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.webContents.send('settings:get', store.get('settings'))
    })

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

 
    mainWindow.on('close', e => {
        if(!app.isQuitting) {
            e.preventDefault();
            mainWindow.hide();
        }

        return true;
    })

    const icon = path.join(__dirname, 'app', 'icons', 'tray_icon.png');


    tray = new AppTray(icon, mainWindow);

   
   

});

const menu = [
    ...(isMac ? [{ role: 'appMenu'}] : []),
    {
        role: 'fileMenu'
    },
    ...(isDev ? [
        {
            label: 'Developer',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'separator' },
                { role: 'toggledevtools' },
            ]
        }
    ] : [])
];

//Set settings
ipcMain.on('settings:set', (e, value) => {
    store.set('settings', value);
    mainWindow.webContents.send('settings:get', store.get('settings'))

})



app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
})

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
})

app.allowRendererProcessReuse = true;