// Core of Directory and File
class FileCore {
    constructor(element) {
        this.element = element
        new TinyMenu(this.element, [
            {
                name: 'delete',
                action: () => console.log('deleted', element)
            }
        ])
    }    
}