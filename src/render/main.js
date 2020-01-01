tippy('[data-tippy-content]', {
    theme: 'dark',
    arrow: false
})

window.onload = () => {
    setTimeout(() => {
        $('.inputarea').focus()
    }, 500)
}