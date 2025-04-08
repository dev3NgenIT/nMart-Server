import 'module-alias/register'
import 'tsconfig-paths/register'

import 'dotenv/config'
import { dbConnect } from '@/models/dbConnect'

import { seederDelete, seederImport, seederRead } from '@/seeder'


const seederMain = async () => {
	await dbConnect()

	const arg = process.argv[2]

	switch (arg) {
		case '--import'	: seederImport(); break;
		case '--delete'	: seederDelete(); break;
		case '--read' 	: seederRead(); 	break;
	}

	// process.exit(0) // close process
}
seederMain()