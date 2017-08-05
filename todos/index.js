"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var mainWindow;
var popupWindow;
var menuTemplate = [
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
                click: function () {
                    mainWindow.close();
                }
            }
        ]
    }
];
var popupTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command + Q" : "Ctrl + Q",
                click: function () {
                    popupWindow.close();
                }
            }
        ]
    }
];
if (process.env.NODE_ENV !== "production") {
    var inspector = {
        label: "Debug",
        submenu: [
            {
                role: "reload"
            },
            {
                label: "Inspect",
                accelerator: process.platform === "darwin" ? "Command + Alt + I" : "Ctrl + Shift + I",
                click: function (item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    };
    menuTemplate.push(inspector);
    popupTemplate.push(inspector);
}
var popupMenu = electron_1.Menu.buildFromTemplate(popupTemplate);
var mainMenu = electron_1.Menu.buildFromTemplate(menuTemplate);
if (process.platform === "darwin") {
    menuTemplate.unshift({});
}
electron_1.ipcMain.on("todo:add", function (event, data) {
    mainWindow.webContents.send("todo:display", data);
    mainWindow.focus();
    popupWindow.close();
});
electron_1.app.on("ready", function () {
    mainWindow = new electron_1.BrowserWindow({});
    mainWindow.loadURL("file://" + __dirname + "/main.html");
    mainWindow.on("closed", function () {
        electron_1.app.quit();
    });
    mainWindow.setMenu(mainMenu);
});
function createAddNewWindow() {
    if (!popupWindow) {
        popupWindow = new electron_1.BrowserWindow({
            width: 300,
            height: 200,
            title: "Add New Todo"
        });
        popupWindow.loadURL("file://" + __dirname + "/popup.html");
        popupWindow.setMenu(popupMenu);
        popupWindow.on('closed', function () { return popupWindow = null; });
    }
}
