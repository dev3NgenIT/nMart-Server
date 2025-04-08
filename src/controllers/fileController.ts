import type { RequestHandler } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { appError } from '@/controllers/errorController'
import mimeType from 'mime-types'

// // GET /upload/*
// export const getUserFile: RequestHandler = (req, res, next) => {
// 	try {
// 		const file = path.join(process.cwd(), req.originalUrl)

// 		if( !fs.existsSync(file) ) return next(appError('file not exists'))
// 		// res.sendFile( file )

// 		const readStream = fs.createReadStream(file)
// 		readStream.pipe(res)

// 	} catch (err: unknown) {
// 		if(err instanceof Error) return next( appError(`Read uploaded file: ${err.message}`)	)
// 		if(typeof err === 'string') return next(appError(err))
// 		next(err)
// 	}
// }




// GET /upload/* 				: Example bellow
export const getUserFile: RequestHandler = (req, res, next) => {
	try {
		const file = path.join(process.cwd(), req.originalUrl)
		if (!fs.existsSync(file)) return next(appError('File does not exist'))

		// Get file stats for size and other metadata
		const stat = fs.statSync(file)
		const totalSize = stat.size

		const range = req.headers.range

		// If no range is provided by the client, serve the entire file
		if (!range) {
			res.status(200).header({
				'Content-Length': totalSize,
				'X-Total-Size': totalSize, 								// To set custom header for Content-Length
				'Content-Type': mimeType.lookup(file),
				'Accept-Ranges': 'bytes'
			})
			const readStream = fs.createReadStream(file)
			readStream.pipe(res)

			// Catch any errors that occur during streaming
			readStream.on('error', (err) => {
				return next(appError(`Error reading file: ${err.message}`))
			})

		} else {
			// If the range is provided, serve the requested chunk
			const parts = range.replace(/bytes=/, '').split('-')
			const start = parseInt(parts[0], 10)
			const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1
			const chunkSize = end - start + 1

			// Ensure the requested range is valid
			if (start >= totalSize || end >= totalSize) {
				return next(appError(`Requested range not satisfiable:`, 406))
				// return res.status(416).send('Requested range not satisfiable')
			}

			// Set headers for partial content
			res.status(206).header({
				'Content-Range': `bytes ${start}-${end}/${totalSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunkSize,
				'X-Total-Size': totalSize, 								// To set custom header for Content-Length
				'Content-Type': mimeType.lookup(file),
			})

			// Create a stream for the requested range and pipe it to the response
			const readStream = fs.createReadStream(file, { start, end })
			readStream.pipe(res)

			// Handle stream errors gracefully
			readStream.on('error', (err) => {
				return next(appError(`Error reading file: ${err.message}`))
			})
		}
	} catch (err: unknown) {
		if (err instanceof Error) return next(appError(`Read uploaded file: ${err.message}`))
		if (typeof err === 'string') return next(appError(err))
		next(err)
	}
}

// 			// const url = `${req.protocol}://${req.get('host')}/auth/validate/${authToken}`










/*

Modern media player (video tag), handle Range requests for you automatically: we don't need to get chunks one by one.

			<video controls>
			  <source src="/upload/sample.mp4" type="video/mp4" />
			</video>


To Download files: chunk by chunk

const fetchFileInChunks = async ( url: string, chunkSize: number): Promise<void> => {
  try {
    const headResponse = await fetch(url, { method: 'HEAD', }) 		// Fetch the file size first using a HEAD request

    const totalSize = parseInt( headResponse.headers.get('content-length') || '0', 10)

    if (isNaN(totalSize)) throw new Error('Unable to determine file size.')

    console.log(`Total File Size: ${totalSize} bytes`)


    let start = 0
    let end = chunkSize - 1
    const fileChunks: ArrayBuffer[] = []  					// Store each chunk

    // Fetch chunks until the entire file is downloaded
    while (start < totalSize) {
      console.log(`Fetching bytes ${start} - ${end}...`)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Range: `bytes=${start}-${end}`, 					// Request specific byte range
        },
				credentials: 'include',
      })

      if (response.status === 206) {
        const chunk = await response.arrayBuffer()
        fileChunks.push(chunk) 											// Add the chunk to the array
      } else {
        throw new Error(`Unexpected response status: ${response.status}`)
      }

      // Update start and end for the next chunk
      start = end + 1
      end = Math.min(start + chunkSize - 1, totalSize - 1) 			// Avoid exceeding total size
    }

    console.log('All chunks fetched!')

    // Combine all chunks into a single Blob
    const fileBlob = new Blob(fileChunks)

    // Create a download link
    const downloadUrl = URL.createObjectURL(fileBlob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = 'downloaded-file.mp4' 							// Update with appropriate file name and extension
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error fetching file in chunks:', error)
  }
}

// Example Usage: Fetch a file in 1 MB chunks
fetchFileInChunks('/upload/sample.mp4', 1024 * 1024)  				// 1 MB chunk size


*/
