import type { Application } from 'express'
import 'dotenv/config'
import { connection } from 'mongoose'
import os from 'os'
import { DB } from '@/config'


export const appLogs = (app: Application, PORT: number) => {

	console.log('\nSERVER LOGS:\n')
	console.log(`  ➜  LOCAL      : http://localhost:${PORT}`)

	const networkInterfaces = getNetworkInterfaces()
	networkInterfaces.forEach((ip) => console.log(`  ➜  DOCKER     : http://${ip}:${PORT}`))

	setTimeout(() => { 																								// to show latter after host logs
		logDatabaseConnection() 																				// Log database connection details
	}, 10)
}


const logDatabaseConnection = () => { 															// Function to log database connection details
	const DB_NAME = connection.name
	const DB_HOST = connection.host 
	const DB_PORT = connection.port || DB.HOST_PORT  									// Default MongoDB port
	const DB_MOUNTED_PORT = DB.MOUNTED_PORT || null 									// Custom/mounted port (if any)

  const dbConnectionUrl = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
  const dbMountedUrl = DB_MOUNTED_PORT ? `mongodb://${DB_HOST}:${DB_MOUNTED_PORT}/${DB_NAME}` : null

  console.log(`  ➜  DB_HOST    : ${dbConnectionUrl}`)
  if (dbMountedUrl) console.log(`  ➜  DB_MOUNT   : ${dbMountedUrl} \n\n`)
}

const getNetworkInterfaces = () => { 																// Function to get network interfaces
  const interfaces = os.networkInterfaces()
  const results = []

  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName] as any) {
      if (iface.internal || iface.family !== 'IPv4') continue 			// Skip internal (loopback) and non-IPv4 addresses
      results.push(iface.address) 
    }
  }

  return results
}
