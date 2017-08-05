import { app, BrowserWindow, Menu, ipcMain } from "electron";

let mainWindow: any;
let popupWindow: any;
const menuTemplate: {
    label?: string,
    submenu?: {
        label?: string,
        role?: any,
        accelerator?: any,
        click?: any
    }[]
}[] = [
    {
        label: "File",
        submenu: [
            {
                label: "New Todo",
                accelerator: process.platform === "darwin" ? "Command + N" : "Ctrl + N",
                click: createAddNewWindow
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command + Q" : "Ctrl + Q",
                click() {
                    mainWindow.close();
                }
            }
        ]
    }
];

const popupTemplate: {
    label?: string,
    submenu?: {
        label?: string,
        role?: any,
        accelerator?: any,
        click?: any
    }[]
}[] = [
    {
        label: "File",
        submenu: [
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command + Q" : "Ctrl + Q",
                click() {
                    popupWindow.close();
                }
            }
        ]
    }
];

if (process.env.NODE_ENV !== "production") {
    const inspector: any = {
        label: "Debug",
        submenu: [
            {
                role: "reload"
            },
            {
                label: "Inspect",
                accelerator: process.platform === "darwin" ? "Command + Alt + I" : "Ctrl + Shift + I",
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    };

    menuTemplate.push(inspector);
    popupTemplate.push(inspector);
}

const popupMenu: any = Menu.buildFromTemplate(popupTemplate);
const mainMenu: any = Menu.buildFromTemplate(menuTemplate);

if (process.platform === "darwin") {
    menuTemplate.unshift({});
}

ipcMain.on("todo:add", (event, data) => {
    mainWindow.webContents.send("todo:display", data);
    mainWindow.focus();
    popupWindow.close();
});

app.on("ready", (): void => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on("closed", () => {
        app.quit();
    });
    mainWindow.setMenu(mainMenu);
});

function createAddNewWindow(): void {
    if (!popupWindow) {
        popupWindow = new BrowserWindow({
            width: 300,
            height: 200,
            title: "Add New Todo"
        });
        popupWindow.loadURL(`file://${__dirname}/popup.html`);
        popupWindow.setMenu(popupMenu);
        popupWindow.on('closed', () => popupWindow = null);
    }
}