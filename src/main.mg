import express from 'express'

const app = express()
const port = 7000

app.get('/', fun (req, res) {
    res.send('Illiade - The Online Notebook!')
})

app.listen(port, fun () {
    log('Listenning on port ${port}')
})
