const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const { spawn} = require('child_process')

const log = require('electron-log')

const path = require("path")

// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'NMap Scanner',
    width: isDev ? 800 : 500,
    height: 600,
    icon: './assets/icons/icon.png',
    resizable: isDev ? true : false,
    backgroundColor: 'white',
    webPreferences: {     
      nodeIntegration: false,
      contextIsolation: false,
    },
  })

  //if (isDev) {
  //  mainWindow.webContents.openDevTools()
 // }

  mainWindow.loadFile('./app/index.html')
}

app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  {
    label: 'Social media',
    submenu:[
      {
        label: 'Instagram',
        click: async ()=>{
          const{ shell } = require ('electron')
          await shell.openExternal('https://www.instagram.com/accounts/login/')
        }
      },
      {
        label: 'Facebook',
        click: async ()=>{
          const{ shell } = require ('electron')
          await shell.openExternal('https://www.facebook.com/')
        }
      },
    ]
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            //{ role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})


ipcMain.on('get:webpage', (event,args) =>{
  console.log(args);
  getWebPage()
 
})


app.allowRendererProcessReuse = true
