// /seeder/backup_and_restore/export.ts

import 'module-alias/register'
import 'tsconfig-paths/register'
import 'dotenv/config'

import fs from 'node:fs' 																							
import path from 'node:path' 																							
import mongoose from 'mongoose'
import { parse } from 'json2csv' 																			// $ npm install mongoose json2csv
import { dbConnect } from '@/models/dbConnect'


export const exportDb = async (): Promise<void> => {
	try {
		await dbConnect()

		const db = mongoose.connection.db 																		// => Get the database instance
		if(!db) throw console.log('db not found')

		const collections = await db.listCollections().toArray() 							// => Get all collections in the database
		const dirPath = path.join(__dirname, '_data', new Date().toLocaleDateString() ) // create directory if not exists

		for (const collectionInfo of collections) { 													// => Iterate through each collection
			const collectionName = collectionInfo.name

			if (collectionName.startsWith('system.')) continue 									// => Skip system collections (e.g., `system.indexes`)
			

			const collection = db.collection( collectionName ) 									// => Get the collection data
			const docs = await collection.find({}).toArray()

			if (!docs.length) continue 																								// => skip else parse throw error
			const csv = parse( docs ) 																					// => Convert JSON docs to CSV

			const filePath = path.join(dirPath, `${collectionName}.csv`) 			// => Write CSV to a file

			if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })

			fs.writeFileSync( filePath, csv )

			console.log(`✅ Export ${docs.length} records into "${collectionName}"`);
		}


		await mongoose.connection.close()
		await mongoose.disconnect()
		console.log('🎉 Database export complete!');

	} catch (err) {
		await mongoose.connection.close()
		await mongoose.disconnect()
		console.log(err)
	}
}

exportDb()


// $ ts-node /seeder/export.ts 																							// => 