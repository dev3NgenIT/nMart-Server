import 'module-alias/register'
import 'tsconfig-paths/register'
import 'dotenv/config'

import { dbConnect } from '@/models/dbConnect'
import { app } from '@/app'
import { appLogs } from '@/lib/utils'
import * as errorController from '@/controllers/errorController'

const PORT = parseInt(process.env.PORT!) || 5000
const httpServer = app.listen(PORT, async () => {
	await dbConnect() 		// also add dotenv.config()
	// logger.info(`server running on : ${server.origin}`)

	appLogs(app, PORT)
})

errorController.promiseErrorHandler(httpServer) 	// put it very end
