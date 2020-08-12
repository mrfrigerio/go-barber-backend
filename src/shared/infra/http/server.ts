import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import AppError from '@shared/errors/AppError'
import routes from '@shared/infra/http/routes'
import uploadConfig from '@config/multer'
import '@shared/infra/typeorm'
import '@shared/container'

const port = 3333
const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use('/files', express.static(uploadConfig.tmpFolder))

// Routes
app.use(routes)

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    console.log('Erro de sistema! ', err)
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  console.log('Erro no servidor! ', err)
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(port, () => console.log(`🚀 Server listening on port ${port}`))
