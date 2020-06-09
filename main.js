//App: manages the lifecycle of the app
//Browser window creates windows
const path = require('path');
const os = require('os');
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, shell } = require('electron');



//Set env
process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'SysTop',
        width: isDev ? 700 : 355,
        height: 500,
        icon: `${__dirname}/app/icons/win/icon.ico`,
        resizable: isDev ? true : false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('./app/index.html');
}



app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

 


    mainWindow.on('closed', () => mainWindow = null);
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