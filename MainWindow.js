const { BrowserWindow } = require('electron');

class MainWindow extends BrowserWindow {
    constructor(file, isDev){
        super({
            title: 'SysTop',
            width: isDev ? 700 : 355,
            height: 500,
            icon: `${__dirname}/app/icons/win/icon.ico`,
            resizable: isDev ? true : false,
            webPreferences: {
                nodeIntegration: true
            }
        })

        this.loadFile(file)
    }
}

module.exports = MainWindow;