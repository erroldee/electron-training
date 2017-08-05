"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.app.on("ready", function () {
    var mainWindow = new electron_1.BrowserWindow({});
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    electron_1.ipcMain.on("video:submit", function (event, path) {
        mainWindow.webContents.send("video:metadata", 30);
    });
});
