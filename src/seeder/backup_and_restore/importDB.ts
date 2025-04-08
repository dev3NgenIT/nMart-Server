import 'module-alias/register'
import 'tsconfig-paths/register'
import 'dotenv/config'

import fs from 'node:fs'
import path from 'node:path'
import mongoose from 'mongoose'
import { dbConnect } from '@/models/dbConnect'

// @ts-ignore
import { parse } from 'csv-parse/sync' 								// Ignore types for this library

export const importDb = async (): Promise<void> => {
	try {
		await dbConnect()

		const db = mongoose.connection.db
		if (!db) throw console.log('db not found')

		await db.dropDatabase()

		const dirPath = path.join(__dirname, '_data', new Date().toLocaleDateString()) 		// Path to the _data directory
		if (!fs.existsSync(dirPath)) throw console.log('No exported CSV files found') 		// Ensure the directory exists
		const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.csv')) 			// Read all CSV files in the directory

		for (const file of files) {
			const collectionName = path.basename(file, '.csv') 				// Extract collection name
			const filePath = path.join(dirPath, file) 

			const csvData = fs.readFileSync(filePath, 'utf8') 				// Read CSV file

			const docs = parse(csvData, { columns: true, skip_empty_lines: true }) 		// Convert CSV to JSON
			if (!docs.length) continue 													// Skip empty files

			// Insert data into MongoDB collection
			const collection = db.collection(collectionName)
			await collection.insertMany(docs)

			console.log(`✅ Imported ${docs.length} records into "${collectionName}"`)
		}

		await mongoose.connection.close();
		await mongoose.disconnect();
		console.log('🎉 Database import complete!')

	} catch (err) {
		await mongoose.connection.close()
		await mongoose.disconnect()
		console.error(err)
	}
}

importDb()
