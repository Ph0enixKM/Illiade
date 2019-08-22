const MagmaScript = require('magma-script')

let mg = new MagmaScript({
    input : __dirname + '/src/main.mg'
})

eval(mg.result)
