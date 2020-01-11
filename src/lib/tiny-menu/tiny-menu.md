# Tiny Menu JS
> (By Phoenix Arts)

## Instruction

Create simple context menus that can observe state of items \
with low memory cost and no spaghetti code.

> **IMPORTANT** TinyMenu must be initialized once DOM has loaded \
> Use: `window.onload` or `window.addEventListener('DOMContentLoaded')` if needed

## Usage
```js


// Create an instance passing a query
new TinyMenu('#click-on-this-element', [
    {
        name: 'click me',
        icon: 'path/to/icon', // (optional)
        condition: new Variable(), // (optional)
        action: event => {}
    }
])

// or use existing element
new TinyMenu(document.body, [])
```

### First parameter
It's a `String` query or `HTMLElement` object.

### Second Parameter
It's a structure model `Array` of the context menu. \
The array contains objects that represent list items.

### Attributes of object in array structure model

**Attribute: name**\
It's the label `String` that is to be displayed.

**Attribute: icon**\
It's `String` url or Base64 of icon.

**Attribute: condition**\
It's an observable `Variable` which is a special type\
that helps with observing state of the variable.
> More information about Observale Type in NPM package: 'observable-type'

**Attribute: action**\
It's a `Function` which is being run when\
user clicks the menu item.