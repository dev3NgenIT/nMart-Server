

// To get from frontend side files chunk bu chunk
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


// // Example Usage: Fetch a file in 1 MB chunks
// fetchFileInChunks('/upload/sample.mp4', 1024 * 1024)  				// 1 MB chunk size
