import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import Template from './../template'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compress())
app.use(cors())
app.get('/', (req, res) => {
    res.status(200).send(Template())
})

export default app