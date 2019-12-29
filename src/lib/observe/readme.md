# Observe JS
> (By Phoenix Arts)

## Instruction

Create variables which can be observed with functions that get called \
everytime value of the variable changes.

## Usage
```js

// Init variable
let age = new Variable(18)

// Get value of the variable
age.val 

// Set trigger (observation)
age.trigger('some-id', () => {}) // With ID
age.trigger(() => {}) // Annonymous
age.trigger({
    id: 'some-id'
    fun: () => {}
})  // Expressed as object

// Set value of the variable
age.val = 24

// Unset trigger of certain ID
age.untrigger('some-id')
```