// Header Module
export default class {

    private exit: HTMLElement
    private min: HTMLElement
    private max: HTMLElement
    private win: Electron.BrowserWindow

    constructor(remote: Electron.Remote) {
        this.exit = document.querySelector('.btn#exit')
        this.min = document.querySelector('.btn#min')
        this.max = document.querySelector('.btn#max')
        this.win = remote.getCurrentWindow()

        // Exit
        this.exit.addEventListener('click', () => {
            this.win.close()
        })

        // Maximize
        this.max.addEventListener('click', () => {
            if (this.win.isMaximized()) {
                return this.win.unmaximize()
            }
            this.win.maximize()
        })

        // Minimalize
        this.min.addEventListener('click', () => {
            this.win.minimize()
        })


    }


}