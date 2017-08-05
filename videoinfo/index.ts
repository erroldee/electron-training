import { app, BrowserWindow, ipcMain } from "electron";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    ipcMain.on("video:submit", (event, path) => {
        mainWindow.webContents.send(
            "video:metadata",
            30
        );
    });
});