class Storage {
    constructor(cargodb) {
        this.hash = '$'
        this.token = 'PHX-TKN'
        this.cargo = cargodb
        if (cargodb == null) this.cargo = window.localStorage
        setTimeout(() => {
            EDITOR_LOAD.trigger(() => console.log(
                `%cstorage-mode: ${cargodb ? 'CargoDB' : 'LocalStorage'}`, DEBUGGER_STYLE.val
            ))
        }, 300)
    }

    // Gets value
    get(id) {
        let raw = this.cargo.getItem(`${this.hash}-${id}`)
        if (raw === null) return null
        return JSON.parse(raw).value
    }

    // Creates if non-existant
    create(id, value) {
        let raw = this.cargo.getItem(`${this.hash}-${id}`)
        const record = { 
            name: 'Phoenix Storage', 
            version: '1.0.0', 
            token: this.token, 
            value 
        }
        
        if (raw == null) {
            this.cargo.setItem(`${this.hash}-${id}`, JSON.stringify(record))
            return true
        }
        return false
    }

    // Overwrites value
    set(id, value) {
        const record = { 
            name: 'Phoenix Storage', 
            version: '1.0.0', 
            token: this.token, 
            value 
        }
        this.cargo.setItem(`${this.hash}-${id}`, JSON.stringify(record))
    }

}