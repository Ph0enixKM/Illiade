// DNA open (Button)
$('#dna-button').addEventListener('click', e => {
    dna.on()
})

new Shortcut('ALT S', e => {
    dna.on()
})

// DNA open (keyboard shortcut)
window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() == 'd' && e.altKey) {
        dna.on()
    }
})

$('#dna .back').addEventListener('click', e => {
    dna.off()
})