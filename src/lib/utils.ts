import 'dotenv/config'
import { Buffer } from 'node:buffer'
import crypto from 'node:crypto'
export * from '@/lib/apiFeatures'
export * from '@/lib/logger'
export * from '@/lib/customTranform'
export * from '@/lib/nodemailer'
export * from '@/lib/appLogs'
export * from '@/lib/logger'


type CustomIdProps = {
	projectName?: string, 
	categoryName: string, 
	// countDocuments?: number
}
type TempObj = {
	[key: string]: unknown
}





export const getDataUrlSize = (dataUrl: string) => {
	if( !dataUrl?.startsWith('data') ) throw new Error(`'${dataUrl}' is not valid dataUrl`) 
	
	const base64 = dataUrl.split(';base64,').pop()
	if(!base64) throw new Error(`base64: ${base64} is empty`)

	const buffer = Buffer.from(base64, 'base64')
	return buffer.byteLength
}



/*
	{{origin}}/api/reviews
		?_page=2
		&_limit=3
		&_sort=-createdAt,user
		&_search= riajul,email,name 					// find text 'riajul' in email, or name or ... any of  field
		&_fields=review,user,createdAt
		&_filter[color]=blue 									// to find product by it's property as key, and value

	const reviews = await apiFeatures(Review, req.query)
*/
// export const apiFeatures = (Model:any, query:any, newFilter={}) => {
// 	/* make sure use app.use( hpp() ), to prevent multiple params: 
// 				?_page=1&_page=3 				=> { _page: [1,3] } 			: without hpp() middleware
// 				?_page=1&_page=3 				=> { _page: 3 } 					: applied hpp() middleware
// 	*/ 

// 	const page = +query._page || 1
// 	const limit = +query._limit || 20
// 	const skip = page <= 0 ? 0 : (page - 1) * limit 

// 	const sort = query._sort?.toString().trim().split(',').join(' ') || 'createdAt'
// 	const select = query._fields?.toString().trim().split(',').join(' ') || '-_v'

// 	const search = query._search?.toString().trim().split(',') || ['', '']
// 	const [ searchValue, ...searchFields ] = search
// 	let searchObj:any = {
// 		"$or" : searchFields.map( (field: any) => ({ [field]: { "$regex": searchValue, "$options": "i" } }))
// 	}
// 	searchObj = search[1] ? searchObj : {}

// 	// const _filter = query._filter || newFilter 				// it bypass newFilter, so 
// 	const _filter = { ...query._filter, ...newFilter } 		// we need merge both filter
// 	const filter = { ...searchObj, ..._filter }

// 	return Model.find(filter) 					// => Searching
// 		.skip(skip).limit(limit) 					// => Pagination
// 		.sort( sort ) 										// => Sorting
// 		.select(select) 									// => Filtering

// 	/*
// 		const searchObj = { firstName: { $regex: 'name', $options: 'i'} } 		// single field
// 		const searchObj = { 																									// multi field
// 			$or: [
// 				{ firstName: { $regex: req.query.search, $options: 'i'} },
// 				{ lastName : { $regex: req.query.search, $options: 'i'} },
// 				{ username : { $regex: req.query.search, $options: 'i'} },
// 			]
// 		} 		
// 	*/
// }


export const filterObjectByArray = (body={}, allowedFields=['']) => {
	const tempObj:TempObj = {}

	Object.entries(body).forEach(([key, value]) => {
		if(allowedFields.includes(key)) tempObj[key] = value
	})

	return tempObj
}














/*
const currentDocuments = await Product.countDocuments()
const vendorId = generateRandomVendorId('babur hat', 'electronics', currentDocuments) 			// => BHE00000001
*/
export const generateRandomVendorId = (projectName: string, categoryName: string, countDocuments: number) => {
	
	const productCode = projectName.split(' ').map( (item: string) => item[0]).join('').toUpperCase()
	const categoryCode = categoryName[0].toUpperCase()
	const sequentialDecimalValue = String(countDocuments + 1).padStart(8, '0')

	const vendorId = `${productCode}${categoryCode}${sequentialDecimalValue}`
	return vendorId
}


// 	req.body.code = generateSequentialCustomId({ projectName: 'code canyon', categoryName: 'coupon'}) 			: => CCC-085c838a-2ab5-4255-89d2-2d757ad9be36
export const generateSequentialCustomId = (props: CustomIdProps) => {
	const {
		projectName='Code Canyon',
		categoryName,
	} = props
	
	const productCode = projectName.split(' ').map( (item: string) => item[0]).join('').toUpperCase()
	const categoryCode = categoryName[0].toUpperCase()
	const sequentialDecimalValue = crypto.randomUUID()

	return `${productCode}${categoryCode}-${sequentialDecimalValue}`
}



// Recursive function to replace _id with id in any object/array
export const transformId = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map(transformId) as T; // Recursively process array elements
  } else if (data !== null && typeof data === "object") {
    const transformed: Record<string, unknown> = {};

    for (const key in data) {
      if (key === "_id") {
        transformed["id"] = (data as Record<string, unknown>)[key]; // Rename _id to id
      } else {
        transformed[key] = transformId((data as Record<string, unknown>)[key]); // Recursively process objects
      }
    }
    return transformed as T;
  }
  return data;
};




/*
  - Uses a closure to maintain lastDate and counter persistently.
  - Formats the date as YYYYMMDD using toISOString().
  - Resets counter when the date changes.
  - Increments counter if the function is called multiple times on the same day.

		// console.log(generateNMCode()); 	// => NM2025031811
		// console.log(generateNMCode()); 	// => NM2025031812 		*/
// export const generateNMCode = (() => {
//   let lastDate: string = "";
//   let counter: number = 1;

//   return (): string => {
//     const now: Date = new Date();
//     const formattedDate: string = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

//     if (formattedDate !== lastDate) {
//       lastDate = formattedDate;
//       counter = 1;
//     } else {
//       counter++;
//     }

//     return `NM${formattedDate}${counter}`;
//   };
// })();


export const generateNMCode = (() => {
  let lastDate: string = "";
  let counter: number = 1;

  return (label: string = 'NM'): string => {
    const now: Date = new Date();
    const formattedDate: string = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD

    if (formattedDate !== lastDate) {
      lastDate = formattedDate;
      counter = 1;
    } else {
      counter++;
    }

    return `${label}${formattedDate}${counter}`;
  };
})()

