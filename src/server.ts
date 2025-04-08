// import 'module-alias/register'
// import 'tsconfig-paths/register'
// import 'dotenv/config'

// import { dbConnect } from '@/models/dbConnect'
// import { app } from '@/app'
// import { appLogs } from '@/lib/utils'
// import * as errorController from '@/controllers/errorController'

// const PORT = parseInt(process.env.PORT!) || 5000
// const httpServer = app.listen(PORT, async () => {
// 	await dbConnect() 		// also add dotenv.config()
// 	// logger.info(`server running on : ${server.origin}`)

// 	appLogs(app, PORT)
// })

// errorController.promiseErrorHandler(httpServer) 	// put it very end


// Import necessary modules
import 'module-alias/register'
import 'tsconfig-paths/register'
import 'dotenv/config'

import { dbConnect } from '@/models/dbConnect'
import { app } from '@/app'
import { appLogs } from '@/lib/utils'
import * as errorController from '@/controllers/errorController'

// Read environment variables and set default PORT
const PORT = parseInt(process.env.PORT!) || 5000

// Start the HTTP server
const httpServer = app.listen(PORT, async () => {
  try {
    // Initialize DB connection and log
    await dbConnect()  // Connect to database
    
    // Log the server is up and running
    appLogs(app, PORT)  // Log server info

  } catch (error) {
    // If there's an error in starting, log it
    console.error("Error starting the server:", error)
    process.exit(1) // Exit if DB connection fails
  }
})

// Attach the error handler at the very end of the file
errorController.promiseErrorHandler(httpServer)

