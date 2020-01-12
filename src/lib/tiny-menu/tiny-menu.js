/*
Model:
[
    {
        name: 'click me',
        action: e => {},
        icon: url,
        condition: new Variable()
    },
    {
        name: 'click second',
        action: e => {},
        icon: null
    }
]
*/

const TinyMenu = (() => {

    let style = document.createElement('style')
    style.innerHTML =  `
        .tiny-menu {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 5;
            background-color: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(5px);
            border-radius: 5px;
            box-shadow: 0 0 10px #111;
            visibility: hidden;
            min-width: 100px;
            color: #333;
            font-weight: 600;
        }
        .tiny-menu-icon {
            display: inline-block;
            vertical-align: middle;
            width: 20px;
            height: 20px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        .tiny-menu-name {
            display: inline-block;
            vertical-align: middle;
            font-family: Lato, Verdana, sans-serif;
            padding: 3px;
        }
        .tiny-menu-item {
            border-radius: inherit;
            cursor: pointer;
            padding: 2px 5px;
        }
        .tiny-menu-item:hover {
            background-color: rgba(30, 30, 30, 0.5);
        }
    `
    document.head.appendChild(style)

    // Main class for TinyMenu
    class Menu {
        /**
         * @param {String/HTMLElement} target Set a target element
         * @param {Array} model Set a model
         */
        constructor(target, model) {
            if (typeof target === 'string') {
                target = document.querySelector(target)
            }

            this.model = model
            this.element = target


            // Create Entity
            if (!window.TINY_MENU_ENTITY) {
                let entity = document.createElement('div')
                entity.className = 'tiny-menu'
                document.body.appendChild(entity)
                window.TINY_MENU_ENTITY = entity
            }
            
            // Setup the rest of the class
            this.entity = window.TINY_MENU_ENTITY
            this.asm = this.assemble.bind(this)
            this.element.addEventListener('contextmenu', this.asm)
            document.documentElement.addEventListener('click', () => {
                this.entity.style.visibility = 'hidden'
            })
            window.addEventListener('keydown', e => {
                if (e.key === 'Escape')
                    this.entity.style.visibility = 'hidden'
            })
        }

        // Menu assembling method
        assemble(e) {
            e.stopPropagation()
            
            // Get Position
            let x = e.clientX
            let y = e.clientY

            // Set Position and enable
            this.entity.innerHTML = ''
            this.entity.style.visibility = 'visible'
            this.entity.style.transform = `translate(${x}px, ${y}px)`

            // Main loop
            for (const item of this.model) {
                // Create list item
                let select = document.createElement('div')
                select.className = 'tiny-menu-item'

                // Set icon
                if (item.icon) {
                    select.innerHTML += `<div class="tiny-menu-icon" style="background-image: url('${item.icon}')"></div>`
                }
                
                // Set name of the item
                select.innerHTML += `<div class="tiny-menu-name">${item.name}</div>`
                this.entity.appendChild(select)

                // Disable if observable condition proves wrong
                if (item.cond) {
                    if (!item.cond._observable) throw 'Passed datatype must be observable. Check package "observable-type" on NPM.'
                    if (!item.cond.val) {
                        select.className = 'tiny-menu-item disabled'    
                        return
                    }
                }

                // Add action on click to the item
                select.addEventListener('click', item.action)
            }
        }
    }

    return Menu
})()