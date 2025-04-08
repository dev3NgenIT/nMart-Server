
import { RequestHandler, Router } from 'express'
import * as fileController from '@/controllers/fileController'

// => /upload/*
export const router = Router()



router.get('/*', fileController.getUserFile)

