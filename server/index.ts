import { Request } from 'express'
import * as path from 'path'

const express = require('express')
    , app = express()
    , wsExpress = require('express-ws')(app)

app.ws('/connect', (ws, req: Request) => {
    ws.on('message', (msg) => {
        ws.send(msg)
    })
    console.log('received WebSocket connection request')
})

app.use('/lib', express.static(path.join(__dirname, '../node_modules')))
app.use('/', express.static(path.join(__dirname, '../dist')))

app.listen(3000, () => console.log('listening...'))