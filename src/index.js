import 'dotenv/config'
import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import { createStream } from 'rotating-file-stream'
import routes from './routes'
import config from '../config'
import models, { sequelize } from './models'

const app = express()
const accessLogStream = createStream('access.log', { interval: '1d', path: path.join(__dirname, 'log')})

app.use(compression())
app.use(cors({ origin: '*' }))
app.use(morgan('combined', { stream: accessLogStream }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))

app.use(express.static('./upload'))
app.use(express.static(config.DIR + '/Q8expo-admin'))
app.use(async (req, res, next) => {req.context = { models};next();})

app.use('/api', routes)
app.get('*', (req, res) => {res.sendFile(config.DIR + '/Q8expo-admin/index.html')}) 

const eraseDatabaseOnSync = false
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  app.listen(process.env.PORT, () =>
    console.log(`app listening on port ${process.env.PORT}!`),
  )
})