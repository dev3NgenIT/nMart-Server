## NGen IT

<!-- ![absolutePath_vs_relativePath.png](https://github.com/JavaScriptForEverything/nodejs-typescript-project-with-import-alias/blob/main/public/absolutePath_vs_relativePath.png) -->

###### Method-1: (Regular) Project Setup
```
# make sure mongodb is running on (default) port 27017
$ sudo systemctl status mongod 	                        # on Linux Check database status

$ git clone https://github.com/JavaScriptForEverything/ngenit.git

$ yarn install
$ yarn dev

$ yarn build
$ yarn start
```

###### Method-2: (Docker) Project Setup
```
# make sure docker and docker socket deamon running
$ sudo systemctl status docker docker.socket 	

$ docker compose build
$ docker compose up --detach                            # 
$ docker compose stop
$ docker compose start

$ docker compose config --services 	                # => backend ...
$ docker compose logs --follow backend                  # See backend logs continuously
```




## Document Section:

##### Convert Image to `dataURL`
```
export const readAsDataURL = (file, { type='image' } = {}) => {
	return new Promise((resolve, reject) => {

		if(type === 'image') {
			const isImage = file?.type.match('image/*')
			if(!isImage) return reject(new Error('Please select an image') )
		}

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.addEventListener('load', () => {
			if(reader.readyState === 2) {
				resolve(reader.result)
			}
		})
		reader.addEventListener('error', reject)
	})
}

const dataUrl = await readAsDataURL(evt.target.files[0]) 	: => data:image/gif;base64,R0lGODlh...
```


### API Features 

- limit                                 : ?_limit=4
- pagination                            : ?_limit=4&_page=2
- filtering fields (limited fields)     : ?_fields=name,user,...
- sorting                               : ?_sort=-price                 : Search by price field   [ - means decending order ]
- searching                             : ?_search=my product,name      : Search 'my product' on `name` field
- filter by fields                      : ?_filter[color]='red'      		: filter product by `color` field
- filter by price range                 : ?_range[price]=500&_range[price]=800
- filter by date range                  : ?_range[createdAt]=2025-02-07&_range[createdAt]=2025-02-08


NB. `API Features` will work on every routes's **GET** request

- GET {{origin}}/api/products
- GET {{origin}}/api/users
- ...


```
{{origin}}/api/products
	?_page=2                                                : 
	&_limit=3                                               : 
	&_sort=-createdAt,price 				: field1,field2,...
	&_search=awesome product,name,summary,description 	: find text 'awesome product' in name, or summary or description any of  field
	&_fields=name,summary,price 			        : only get those 3 fields + populated + build-in fields

	&_filter[color]=blue 					: to find product by it's property as key, and value
	&_filter[childCategory]=pant                            : 


{{origin}}/api/products?_limit=3&_page=2&_search=awesome product,name,summary,description&_sort=-createdAt,price&-fields=name,summary,price

```


##### Limits of products

```
Syntax:
        _limit = N
```

```
GET     {{origin}}/api/products?_limit=2

{
  "status": "success",
  "total": 5,
  "count": 2,
  "data": [
    {
      "_id": "67887e591bfa38d2b563a5c9",
      "name": "product-1",
      "slug": "",
      "price": 650,
      "coverPhoto": {
        "public_id": "4a622cdd-cb37-45aa-971e-927d52b6edcd",
        "secure_url": "/upload/products/251088bd-36a3-4381-b00d-40c7a806ff6e.gif"
      },
      ...
    },
    { ...  }
  ]
}
```

##### Pagination

```
Syntax:
        _limit  = N
        _page   = N                     : To use pagination must have _limit    [ default _limit = 10 ]
```

```
GET     {{origin}}/api/products?_limit=2&_page=3

{
  "status": "success",
  "total": 5,
  "count": 1,
  "data": [
    {
      "coverPhoto": {
        "public_id": "7dff6bad-f677-475e-80c5-2ac2ecb7f2eb",
        "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png"
      },
      "_id": "67888c0f6dd724cbcbc82ed8",
      "user": "67888b616dd724cbcbc82ed1",
      "name": "product created by fiaz, which is one updated one",
      "slug": "product-created-by-fiaz-which-is-one-updated-one",
      "price": 800,
      "__v": 0
    }
  ]
}
```



##### filtering (limited fields)

NB:
- Negetive means remove fields,
- No Negetive `(Positive)` means only fetch fields,
- Mixture both Negetive  & Positive not allowed, [ use only one at a time ]     :ex. _fields=-name,user        : mixtured not allowed


```
Syntax:
        _fields = field_name_1,field_name_2,...
```

```
GET     {{origin}}/api/products?_fields=name,user

{
  "status": "success",
  "total": 5,
  "count": 5,
  "data": [
    {
      "_id": "67887e591bfa38d2b563a5c9",
      "name": "product-1"
    },
    {
      "_id": "678884021bfa38d2b563a5d7",
      "name": "product-2"
    },
    {
      "_id": "678887c14ee156faebc47ddb",
      "user": "67887eb31bfa38d2b563a5ce",
      "name": "this product is using this unique slug"
    },
    {
      "_id": "67888bee6dd724cbcbc82ed6",
      "user": "67888b616dd724cbcbc82ed1",
      "name": "product created by riaz, which is one"
    },
    {
      "_id": "67888c0f6dd724cbcbc82ed8",
      "user": "67888b616dd724cbcbc82ed1",
      "name": "product created by fiaz, which is one updated one"
    }
  ]
}



GET     {{origin}}/api/products/678887c14ee156faebc47ddb
GET     {{origin}}/api/products/678887c14ee156faebc47ddb?_fields=-coverPhoto

{
  "status": "success",
  "data": {
    "_id": "678887c14ee156faebc47ddb",
    "user": "67887eb31bfa38d2b563a5ce",
    "name": "this product is using this unique slug",
    "slug": "this-product-is-using-this-unique-slug",
    "price": 300,
    "__v": 0
  }
}
```





##### Sorting By any field name

NB:
- Negetive means remove fields,
- No Negetive `(Positive)` means only fetch fields,
- Mixture both Negetive  & Positive not allowed, [ use only one at a time ]     :ex. _fields=-name,user        : mixtured not allowed


```
Syntax:
        _sort = field_name_1                    : Positive sort A-Z order
        _sort = -field_name_1                   : Negetive prefix (-) sort Z-A order
```

```
GET     {{origin}}/api/products?_fields=name,user,price&_sort=-price

{
  "status": "success",
  "total": 5,
  "count": 5,
  "data": [
    {
      "_id": "67888c0f6dd724cbcbc82ed8",
      "user": "67888b616dd724cbcbc82ed1",
      "name": "product created by fiaz, which is one updated one",
      "price": 800
    },
    {
      "_id": "67887e591bfa38d2b563a5c9",
      "name": "product-1",
      "price": 650
    },
    {
      "_id": "678884021bfa38d2b563a5d7",
      "name": "product-2",
      "price": 300
    },
    {
      "_id": "678887c14ee156faebc47ddb",
      "user": "67887eb31bfa38d2b563a5ce",
      "name": "this product is using this unique slug",
      "price": 300
    },
    {
      "_id": "67888bee6dd724cbcbc82ed6",
      "user": "67888b616dd724cbcbc82ed1",
      "name": "product created by riaz, which is one",
      "price": 200
    }
  ]
}
```



##### search with fields

```
Syntax:
        _search = search_value,field_name_to_search_on                          : 

NB: No space between 2 arguments, just seperate by comma but search value can use space
```


```
GET     {{origin}}/api/products?_search=product 1,name                          : search on `name` field
GET     {{origin}}/api/products?_search=product 1,slug                          : search on `slug` field
...
GET     {{origin}}/api/products?_search=product 1,slug&_fields=-coverPhoto      : search & filter       [ Negetive means remove fields ]
```




##### Filter by `property` and it's `value`

```
Syntax:
        _filter[ propertyName ] = propertyValue
```

```
GET     {{origin}}/api/products?_filter[color]=red

{
  "status": "success",
  "total": 5,
  "count": 2,
  "data": [
    {
      "_id": "67887e591bfa38d2b563a5c9",
      "name": "product-1",
      "slug": "",
      "price": 650,
      "color": 'red',
      "coverPhoto": {
        "public_id": "4a622cdd-cb37-45aa-971e-927d52b6edcd",
        "secure_url": "/upload/products/251088bd-36a3-4381-b00d-40c7a806ff6e.gif"
      },
      ...
    },
    { ...  }
  ]
}
```


##### Filter by range `price` or date `createdAt` field

```
Syntax:
        _range[ propertyName ] = propertyValue
        _range[price] = number                                  : first price value act as min value
        _range[price] = number                                  : 2nd price value act as max value

        _range[createdAt] = string  or Date                     : 1st date format : year-month-day
        _range[createdAt] = string  or Date                     : 2nd date format : year-month-day
```

```
GET     {{origin}}/api/products?_filter[price]=500              : Get all products with price = 500
GET     {{origin}}/api/products?_price=300&_price=500           : Get specific products with price 

GET     {{origin}}/api/products?_range[price]=500&_range[price]=800     : Get products by ranges
GET     {{origin}}/api/products?_range[createdAt]=2025-02-07&_range[createdAt]=2025-02-08
```


##### Nested fields filter or search

We can search nested object or array Object:

```
/api/products?_range[quantity]=1 					: >= 1 		: available in stock
/api/products?_filter[quantity]=0 				        :  	        : out of stock

/api/products?_filter[coverPhoto.public_id] = idValue 		        : Find in nested object
/api/products?_filter[colors.0.color]=orange 				: Find in nested array object


{{origin}}/api/products?colors[color]=orange                            : Only for `product routes`
```

















### Common 4 type of Error Handling
1. Nodejs Error
2. Express Error
3. MongoDB Error
4. JsonWebToken Error

#### Nodejs Error
- Handled Node.js has 2 type of error:
	- Synchronous Error (Globally):
		- **code**: *throw 'Test synchronous error handler'*
		- **code**: *throw new Error('Test synchronous error handler')*

	- ASynchronous Error (Globally)
		- **code**: *Promise.reject('Test Asynchronous Error handler')*
		- **code**: *Promise.reject(new Error('Test Asynchronous Error handler'))*
	



### Express Error
Express has it's own built-in Global Error handler
- Uses Express Global Error handler
- Handled Route NotFound error

### Database Error
Database has common 4 type of errors 
- DBConnection Error 				: handled
- Invalid Id Error 		(CastError)	: provide simple message instead of technical mesage
- Duplicate Error 		(11000) 	: 	" 			" ....
- Validation Error 	       (ValidationError):  	" 			" ....


### Routes

- /api/auth                                     : 
- /api/users
- /api/brands
- /api/blogs
- /api/categories
- /api/sub-categories
- /api/child-categories
- /api/blog-categories
- /api/products
- /api/reviews
- /api/sites
- /api/offers
- /api/faqs
- /api/faq-questions
- /api/policies
- /api/wishlists
- /api/coupons
- /api/product-review-likes
- /api/homes
- /api/subscribes
- /api/about-us
- /api/contact-us
- /api/shipping-info
- /api/billing-info
- /api/orders

		



### Login and Registration
We can login multiple ways:
- Local Login: 
- Google Login: 
- Facebook Login: 



### Auth Routes
- POST 	{{origin}}/api/auth/register                            : Allowed Origin: `http://localhost:3000 | http://localhost:5173`
- POST 	{{origin}}/api/auth/login                                         
- POST 	{{origin}}/api/auth/logout                                        
- GET 	{{origin}}/api/auth/google                                        
- GET 	{{origin}}/api/auth/success
- GET 	{{origin}}/api/auth/failure                                        


- POST {{origin}}/api/auth/verify-request                       : Send Retuest verify logedInUser: Get OTP, via mail and others as response
- POST {{origin}}/api/auth/verify-user                          : To verify verified user request.

- POST    {{origin}}/api/auth/forgot-password                   : To Change forgoten password to get details
- PATCH   {{origin}}/api/auth/reset-password                    : handle password reset

- PATCH   {{origin}}/api/auth/update-password                   : update logedIn User password 



##### Send `cookie` with every request: (smaple code)
```
const body = {...}

try {
	const res = await fetch(`${origin}/api/auth/register`, {
		method: 'POST',                             (*)
                credentials: 'include',                     (*) : for CORS must need
		body: JSON.stringify( body ),
		headers: {
			'content-type': 'application/json', (*) :   
			'accept': 'application/json',
		}
	})
	if( !res.ok ) throw await res.json()

	const data = await res.json()
	console.log(data)

} catch( err ) {
	console.log(err)
}
```


##### Accessing `protected` routes

In production `cookie` automatically sends via browser, in development mode different `origin` block cookie, so we have to send cookie with request as `Bearer ${authToken}` like bellow example


```
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjQ1ZTJmZTM5MGE0YzgyYzBjNDEwZCIsImlhdCI6MTc0MDIxNDQzNywiZXhwIjoxNzQyODA2NDM3fQ.sHg0arVBUI-hEcZojTqiDjaK4igE2DWkC9lDh8W38GY`

const response = await fetch( `http://dev6.ngenit.com/api/orders`, { 
	credentials: 'include' ,
	headers: {
		"Authorization": `Bearer ${token}`, // Attach the token here
		"Content-Type": "application/json",
	}
})

const json = await response.json()
console.log(json)
```




##### Google Login 
```
GET 	{{origin}}/api/auth/google   	                                : 
```

##### Google Login success Response
```
{
  "status": "success",
  "message": "login successfully!!!",
  "data": {
    "userId": "67b57da9af5c64caef0e4027",
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.y2rXEqGCVP4NaIlZJssBiTymKTPCRm_w8SGBHV_w"
  }
}
```


##### Login 
```
{
  "email" : "riajul@gmail.com",
  "password": "your-pass"
}

POST 	{{origin}}/api/auth/login   	                                : 
```

##### Login Response
```
{
  "status": "success",
  "message": "login successfully!!!",
  "data": {
    "userId": "67b57da9af5c64caef0e4027",
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.y2rXEqGCVP4NaIlZJssBiTymKTPCRm_w8SGBHV_w"
  }
}
```






##### Register User 
```
body {
  "fname" : "Riajul",                                              (*)  : 
  "lname" : "Islam",                                               (*)  : 
  "username": "username.delete3",                                       : Must be Unique
  "email" : "riajul.delete3@gmai.com",                             (*)  : 
  "password": "{{pass}}",                                          (*)  : 
  "confirmPassword": "{{pass}}",                                   (*)  : 

  "phone" : "+8801957500605",
  "gender" : "male",                                                    : male | female | null
  "bio" : "my bio goes here...",

  "dateOfBirth" : "1995-03-08",
  "address" : {
    "street" : "315 hazipara badda",
    "city": "Dhaka",
    "state": "Dhaka",
    "postCode": 1212,
    "country": "Bangladesh"
  },


  "coverPhoto": "https://.../dockarize-nodejs-application.png",         : Method-1: url image
  "avatar" : "data:image/gif;base64,R/XBs/fNwfjZ0frl"                   : Method-2: image as dataUrl
}

POST 	{{origin}}/api/auth/register   	                                : 
```


##### Register Response
- If need verification badge on immediatley after register then use bellow `credentials` else `redirect` user to login page.

```
{
  "status": "success",
  "message": "an otp message is send to you via email to you",
  "data": {
    "phoneOrEmail": "+8801957500605",
    "hash": "TH5JXq0spbkCGExrarypy8SB0GARn1mPN/P7R/jMVM4=.1740671730201"
  }
}
```



##### To verify existing user
```
body {
  "phone": "+8801957500605",                                    : Phone or (Phone his higher priority)
  "email": "riajul@gmail.com"                                   : Email
}

POST {{origin}}/api/auth/verify-request
```

###### For Verified Request's Success Response:
```
{
  "status": "success",
  "message": "an otp message is send to you via email to you",
  "data": {
    "phoneOrEmail": "+8801957500605",
    "hash": "yBhyTVOMOifLuV3rijcjAzX9W2zIgSYMRO/AQ2Z4X5U=.1740150582486"
  }
}
```

###### Already Verified Request's Error Response:
```
{
  "message": "You are already varified user",
  "status": "error",
  "stack": "Error: You are already varified user..."
}
```


##### To verify existing user
```
{
  "otp": "9315",                                                : Will come from Email  ( or SMS later)
  "phoneOrEmail": "+8801957500605",                             : Will come from Request's success Response
  "hash": "wo8ZiOmzr0Sts+mlDqzeC/ANVZ9+HKxo4=.1740149721115"    : Will come from Request's success Response
}

POST {{origin}}/api/auth/verify-user
```

###### verification's Success Response:
```
{
  "status": "success",
  "message": "user verification successfull !!!, please relogin again"
}
```


###### Already Verified user's Re-verification's Error Response:
```
{
  "message": "please retry with your new otp",
  "status": "error",
  "stack": "Error: please retry with your new otp ..."
}
```


##### ForgotPassword 
```
body {
  "email": "riajul.delete3@gmai.com"
}

POST    {{origin}}/api/auth/forgot-password
```

###### ForgotPassword Response
```
{
  "status": "success",
  "message": "token sent to riajul.delete3@gmai.com"
}
```


##### ResetPassword 
```
body {
  "password": "new-password",                                   : New Password
  "confirmPassword": "new-password",                            : ConfirmPassword for newPassword
  "resetToken": "reset-password-token"                          : Token get by email
}

PATCH   {{origin}}/api/auth/reset-password
```

###### ResetPassword Response
```
{
  "status": "success",
  "data": "password update successfull, please re-login with new password"
}
```


##### UpdatePassword 
```
body {
  "currentPassword": "asdfasdff",                               : Current existing password
  "password": "new-password",                                   : New Password
  "confirmPassword": "new-password",                            : ConfirmPassword for newPassword
}

PATCH   {{origin}}/api/auth/update-password
```

###### UpdatePassword Response
```
{
  "status": "success",
  "data": "password update successfull, please re-login with new password"

If Error:
  "message": "your currentPassword is incorrect, did you forgot your password?",
}
```



### User Routes
- GET 	{{origin}}/api/users                                    : `protected` and `restricted` routes
- GET 	{{origin}}/api/users/:userId                            : Get user By userId
- GET 	{{origin}}/api/users/me                                 : Get LogedIn User 

- PATCH {{origin}}/api/users/:userId                            : Update user By userId
- PATCH {{origin}}/api/users/me                                 : Update LogedIn User 

- DELETE {{origin}}/api/users/:userId                           : Delete user By userId
- DELETE {{origin}}/api/users/me                                : Delete LogedIn User 


##### Get Users 
```
{
  "status": "success",
  "count": 2,
  "total": 29,
  "data": [
    {
      "address": {
        "street": "315 hazipara badda",
        "city": "dhaka",
        "state": "dhaka",
        "postCode": "1212",
        "country": "bangladesh"
      },
      "avatar": {
        "public_id": "ad40fe42-cd42-451d-943f-0c4384f4a669",
        "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png"
      },
      "isVisible": true,
      "email": "riajul@gmail.com",
      "role": "admin",
      "isActive": false,
      "isVerified": true,
      "gender": "male",
      "createdAt": "2025-01-28T05:35:02.432Z",
      "updatedAt": "2025-02-27T09:43:36.303Z",
      "fname": "riajul ",
      "lname": "islam",
      "phone": "+8801957500605",
      "fullName": "riajul  islam",
      "id": "67986c8660c5024225bf3e76"
    },
    {
      "avatar": {
        "public_id": "e143879b-710b-4fc5-9b93-9001c90b0aa5",
        "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png"
      },
      "isVisible": true,
      "email": "robitops@gmail.com",
      "role": "user",
      "isActive": false,
      "isVerified": false,
      "gender": "male",
      "createdAt": "2025-01-28T05:35:39.985Z",
      "updatedAt": "2025-02-18T11:58:54.578Z",
      "fname": "robitops",
      "lname": "me",
      "passwordResetToken": "e5a847e0adcdf676f0e5102f47cd926b8b563e6fcee6e52c255b95226bacf95b",
      "fullName": "robitops me",
      "id": "67986cab60c5024225bf3e79"
    }
  ]
}
```

##### `super-admin` user can create any user with ROLE 
```
body {
  "fname": "riajul",
  "lname": "islam",
  "email": "riajul.admin@gmail.com",
  "password": "{{pass}}",
  "confirmPassword": "{{pass}}",
  "role": "admin"                                               : 'super_admin' | 'site_setting' | 'admin' | 'user' (default)
}

POST 	{{origin}}/api/users      	                        : Create Admin user by `super-admin`
```



##### Update User 
```
body {
  "name": "riajul islam",
  "avatar": "https://.../dockarize-nodejs-application.png",     : Method-1: url image
  "avatar" : "data:image/gif;base64,R/XBs/fNwfjZ0frl"           : Method-2: image as dataUrl
}

PATCH 	{{origin}}/api/users/678ccafec4c838b7feae04c6   	: Update User by id
PATCH 	{{origin}}/api/users/me   	                        : Update logedIn User
```




### Product Routes
- GET 	{{origin}}/api/products                                 : Get all products
- GET 	{{origin}}/api/users/me/products                        : Get all products of LogedIn User 
- GET 	{{origin}}/api/users/:userId/products                   : Get all products of given User's products

- GET 	{{origin}}/api/products/:productId                      : Get product by `product.id`
- GET 	{{origin}}/api/products/product-using-unique-slug       : Get product by `product.slug` for **SEO** and **Clean URL**

- POST 	{{origin}}/api/products                                 : Add product

- PATCH {{origin}}/api/products/:productId                      : Update product by `product.id`
- PATCH {{origin}}/api/products/product-using-unique-slug       : Update product by `product.slug` 

- DELETE {{origin}}/api/products/:productId                     : Delete product by `product.id`
- DELETE {{origin}}/api/products/product-using-unique-slug      : Delete product by `product.slug` 

- GET 	{{origin}}/api/products/random-products                 : Get random products [ default _limit=12 ]
- GET 	{{origin}}/api/products/random-products?_limit=3        : Get random 3 products 

- GET 	{{origin}}/api/products/popular-products                : Get random products [ default _limit=12 ]
- GET 	{{origin}}/api/products/popular-products?_limit=10      : 

- DELETE {{origin}}/api/products/many                           : To delete multiple products by `productIds` field

- GET {{origin}}/api/products/un-reviewed-products              : Get those products are order not revied by user


##### Get Products
```
{
  "status": "success",
  "total": 11,
  "count": 2,
  "data": [
    {
      "coverPhoto": {
        "public_id": "2ef48499-1543-43ef-bbf2-2ae18292d0c1",
        "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png"
      },
      "metadata": {
        "keywords": []
      },
      "discount": 0,
      "quantity": 1,
      "vat": 0,
      "tax": 0,
      "user": "67986c8660c5024225bf3e76",
      "category": "67986d3d60c5024225bf3e81",
      "subCategory": "67c41cd392fa9d0f76642bc3",                    : 
      "name": "product with category 1, which is 3 images url + dataurl",
      "slug": "product-with-category-1-which-is-3-images-url-dataurl",
      "price": 800,
      "images": [
        {
          "public_id": "5a0c19eb-e26a-4c55-8183-5583c0421e9b",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "id": "67986d5360c5024225bf3e84"
        },
        {
          "public_id": "22cf54fb-c0a0-4100-84ff-8f6534e8b4cf",
          "secure_url": "/upload/products/2b0659ee-05fb-4146-b98a-896966583ef4.gif",
          "id": "67986d5360c5024225bf3e85"
        },
        {
          "public_id": "8b5a8f14-347b-42df-957c-d181b45e9a1d",
          "secure_url": "/upload/products/82527f86-1c30-4049-abfa-c59604af8975.gif",
          "id": "67986d5360c5024225bf3e86"
        }
      ],
      "createdAt": "2025-01-28T05:38:27.058Z",
      "updatedAt": "2025-01-28T05:38:27.058Z",
      "colors": [],
      "id": "67986d5360c5024225bf3e83"
    },
    {
      "coverPhoto": {
        "public_id": "921ea0c8-3a35-483e-8241-428af177dfbe",
        "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png"
      },
      "metadata": {
        "keywords": []
      },
      "discount": 0,
      "vat": 0,
      "tax": 0,
      "user": "67986c8660c5024225bf3e76",
      "category": "67986d3d60c5024225bf3e81",
      "name": "product with category 2222, which is 3 images url + dataurl",
      "slug": "product-with-category-2222-which-is-3-images-url-dataurl",
      "price": 700,
      "images": [
        {
          "public_id": "d5c9a741-0cb4-4387-b662-e69f3b9cf282",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "id": "679b18c7c90f8e1a1452743b"
        },
        {
          "public_id": "dc1d418a-84ed-4384-97e0-4e5ffb7bbf88",
          "secure_url": "/upload/products/82af10fa-bfa4-464b-9190-7b1899899733.gif",
          "id": "679b18c7c90f8e1a1452743c"
        },
        {
          "public_id": "4e8b722e-0707-47b9-a405-e5a7a8ba663d",
          "secure_url": "/upload/products/390f57bc-c7c2-4515-a740-ecc3bad311bd.gif",
          "id": "679b18c7c90f8e1a1452743d"
        }
      ],
      "createdAt": "2025-01-30T06:14:31.349Z",
      "updatedAt": "2025-02-06T08:21:14.865Z",
      "colors": [],
      "id": "679b18c7c90f8e1a1452743a"
    }
  ]
}
```

##### Add Product
```
body {
  "user": "67888b616dd724cbcbc82ed1",                           : (*)
  "category": "67a2e0779dc1e9e619633215", 	                : 	
  "subCategory": "67c41cd392fa9d0f76642bc3",                    : 
  "childCategory": "27888b616dd724cbcbc82ed2",                  : (*)
  "name": "product created by fiaz, which is one updated one",  : (*)
  "skuCode": 'BT-0001',                                         : (*)
  "manufacturerCode": 'BPT-0001',                               :    

  "price": 800,                                                 : (*)
  "discount": 0,                                                : 
  "quantity": 1,                                                : 
  "vat": 0,                                                     : 
  "tax": 0,                                                     : 

  "coverPhoto": "https://yourdomain/myimage.png", 		: Method-1: to upload image with url 	[ make sure has cors origin allowed ]
  
  // "coverPhoto" : "data:image/gif;base64,R0lGODlh..." 	: Method-2: to upload image as dataURL

  "thumbnail": "https://yourdomain/myimage.png", 		: 
  "images" : [
    "https://yourdomain/myimage.png", 		                : to upload images with url 	[ make sure has cors origin allowed ]
    "data:image/gif;base64,R0lGODlh...", 		        : to upload images as dataURL
    "data:image/gif;base64,R0lGODlh...", 		        : 
  ],

  "color" : "red",
  "colors" : [
    { 
      "color": "red",
      "price": 400
    },
    { 
      "color": "blue",
      "price": 500
    }
  ],
  "size" : "xl",
  "specification": "product details goes here...",

  "metadata": {
     "title": "title goes here",
     "description": "description goes here",
     "keywords": ["keyword1", "keyword2"],
  },

  "flashSale": {
     "discount": "50%",
     "label": "sale"                                            : label 'sale' will be used for filter
  }
}

POST 	{{origin}}/api/products    			        : 
```

##### Get flsshSale Products by filter `?_filter[flashSale.label]=sale`
```
{
  "status": "success",
  "total": 2,
  "count": 2,
  "data": [
    {
      "flashSale": {
        "discount": "50%",
        "label": "sale"
      },
      "name": "falashsale product 1",
      "id": "67c92aec925be82a4a2a280f"
    },
    {
      "flashSale": {
        "discount": "20%",
        "label": "sale"
      },
      "name": "falashsale product 2",
      "id": "67c92b13925be82a4a2a284e"
    }
  ]
}

GET     {{origin}}/api/products?_filter[flashSale.label]=sale&_fields=name,flashSale
GET     {{origin}}/api/products?_filter[flashSale.label]=sale
```

##### Update Product
```
body {
  "name": "product created by fiaz, which is one updated one",  :    

  "price": 800,                                                 :    
  "discount": 0,                                                : 
  "vat": 0,                                                     : 
  "tax": 0,                                                     : 

  "coverPhoto": "https://yourdomain/myimage.png", 		: Method-1: to upload image with url 	[ make sure has cors origin allowed ]
  
  // "coverPhoto" : "data:image/gif;base64,R0lGODlh..." 	: Method-2: to upload image as dataURL

  "thumbnail": "https://yourdomain/myimage.png", 		: 
  "images" : [
    "https://yourdomain/myimage.png", 		                : to upload images with url 	[ make sure has cors origin allowed ]
    "data:image/gif;base64,R0lGODlh...", 		        : to upload images as dataURL
    "data:image/gif;base64,R0lGODlh...", 		        : 
  ],

  "color" : "red",
  "size" : "xl",
  "specification": "product details goes here...",

  "metadata": {
        "title": "title goes here",
        "description": "description goes here",
        "keywords": ["keyword1", "keyword2"],
  }
}

PATCH 	{{origin}}/api/products/67a835bfd1785272888c9572                : Update by product Id
PATCH 	{{origin}}/api/products/it-is-an-awesome-product                : Update by product slug
```

##### DELETE Multiple Products by `productIds`
```
body {
  "productIds": [
    "67a8371cd1785272888c958b",
    "67a835bfd1785272888c9572"
  ]
}

DELETE 	{{origin}}/api/products/many    			        : 
```







##### Update Product
```
body {
  "user": "67888b616dd724cbcbc82ed1", 			        : can't be updated or removed

  "name": "product created by fiaz updated ",                   : Remember this field is `unique`, so choose unique name.
  "price": 800,
  "coverPhoto": "https://yourdomain/myimage.png", 	        : Method-1: to upload image with url 	[ make sure has cors origin allowed ]
  
  "coverPhoto" : "data:image/gif;base64,R0lGODlh..." 	        : Method-2: to upload image as dataURL

  "images" : [
    "https://yourdomain/myimage.png", 		                : to upload images with url 	[ make sure has cors origin allowed ]
    "data:image/gif;base64,R0lGODlh...", 		        : to upload images as dataURL
    "data:image/gif;base64,R0lGODlh...", 		        : 
  ],
}

PATCH 	{{origin}}/api/products/product-id-or-slug    	        : 
```




### Review Routes
- GET 	{{origin}}/api/reviews                                  : Get all reviews
- GET 	{{origin}}/api/users/:userId/reviews                    : Get all reviews of given User's
- GET 	{{origin}}/api/users/me/reviews                         : Get all reviews of LogedIn User 
- GET 	{{origin}}/api/products/:productId/reviews              : Get all reviews of a products

- POST 	{{origin}}/api/reviews                                  : Add reviews

- POST 	{{origin}}/api/products                                 : Add product
- GET 	{{origin}}/api/reviews/:reviewId                        : Get review by `review.id`
- PATCH {{origin}}/api/reviews/:reviewId                        : Update review by `review.id`
- DELETE {{origin}}/api/reviews/:reviewId                       : Delete review by `review.id`

- GET   {{origin}}/api/reviews?_fields=-image                   : Get reviews without images : apply all the `apiFeatures`
- GET   {{origin}}/api/reviews?_filter[rating]=5                : Get reviews which has `rating` 5


##### Get Reviews
```
{
  "status": "success",
  "count": 4,
  "total": 4,
  "average": "4.25",
  "ratings": {
    "3": 1,
    "4": 1,
    "5": 2
  },
  "data": [
    {
      "user": "67986c8660c5024225bf3e76",
      "product": "679b49e922d4b32980c9749c",
      "review": "this is my review 1",
      "images": [
        {
          "public_id": "94b3fb64-053a-4795-9b4d-a8dfee6fc6f4",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "_id": "67ac65760706de3453864c42"
        },
        {
          "public_id": "43f9776a-e020-4dbd-b250-5fbbad3d959d",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "_id": "67ac65760706de3453864c43"
        }
      ],
      "rating": 5,
      "like": 0,
      "createdAt": "2025-02-12T09:10:14.369Z",
      "updatedAt": "2025-02-12T09:10:14.369Z",
      "id": "67ac65760706de3453864c41"
    },
    {
      "user": "67986c8660c5024225bf3e76",
      "product": "679b49e922d4b32980c9749c",
      "review": "this is my review 2",
      "images": [
        {
          "public_id": "e35249e8-f688-49b3-8a9a-ee18e4961fef",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "_id": "67ac65c00706de3453864c46"
        },
        {
          "public_id": "7d3214fc-17a9-4631-b38c-c81472742712",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "_id": "67ac65c00706de3453864c47"
        },
        {
          "public_id": "9e463479-72e3-4a1e-a049-8f7327f6107b",
          "secure_url": "/upload/reviews/b49d4e35-67ee-453a-9fe4-8d472ff33b8c.gif",
          "_id": "67ac65c00706de3453864c48"
        }
      ],
      "rating": 5,
      "like": 0,
      "createdAt": "2025-02-12T09:11:28.262Z",
      "updatedAt": "2025-02-12T09:11:28.262Z",
      "id": "67ac65c00706de3453864c45"
    },
    {
      "user": "67986c8660c5024225bf3e76",
      "product": "679b49e922d4b32980c9749c",
      "review": "this is my review 3",
      "images": [
        {
          "public_id": "8062c110-14a7-4b8a-bbf9-aee142cca508",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "_id": "67ac65e50706de3453864c4b"
        },
        {
          "public_id": "05b2d00d-1aa2-4717-9018-5f28a6cd6fb8",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "_id": "67ac65e50706de3453864c4c"
        },
        {
          "public_id": "9f83592f-99c2-4062-8671-2d5c804390ef",
          "secure_url": "/upload/reviews/2a4b6084-02b1-4dcf-8730-7c6a8f94f684.gif",
          "_id": "67ac65e50706de3453864c4d"
        }
      ],
      "rating": 3,
      "like": 0,
      "createdAt": "2025-02-12T09:12:05.242Z",
      "updatedAt": "2025-02-12T09:12:05.242Z",
      "id": "67ac65e50706de3453864c4a"
    },
    {
      "user": "67986c8660c5024225bf3e76",
      "product": "679b49e922d4b32980c9749c",
      "review": "this is my review 4",
      "images": [
        {
          "public_id": "8291b38a-9d30-4af8-b784-1ef765d30fff",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "_id": "67ac65f00706de3453864c50"
        },
        {
          "public_id": "90c5910b-7f3e-402d-8f8d-dbd122a0712d",
          "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
          "_id": "67ac65f00706de3453864c51"
        },
        {
          "public_id": "d2132cd5-4551-4f14-b6e3-0d14fdc052b1",
          "secure_url": "/upload/reviews/e13e008f-0e21-42b2-a7bf-eb6fe666a497.gif",
          "_id": "67ac65f00706de3453864c52"
        }
      ],
      "rating": 4,
      "like": 0,
      "createdAt": "2025-02-12T09:12:16.270Z",
      "updatedAt": "2025-02-12T09:12:16.270Z",
      "id": "67ac65f00706de3453864c4f"
    }
  ]
}

```

##### Add Review
```
body {
  "user": "67888b616dd724cbcbc82ed1",                           : (*)
  "product": "27888b616dd724cbcbc82ed2",                  	: (*)
  "review": "review 1",                                         : (*)
  "rating": 0,                                                  : 
  "like": 0,                                                    : 
  "images": [
	"https://yourdomain/myimage.png", 		        : 
	"https://yourdomain/myimage.png", 		        : 
	"data:image/gif;base64,R0lGODlhEAAQAMQAAOR" 	        : 
  ]
}

POST 	{{origin}}/api/reviews    			        : 
```



##### Update Product
```
body {
  "review": "review 1",                                         : 
  "rating": 5,                                                  : 
  "like": 2,                                                    : 
  "images": [
	"https://yourdomain/myimage.png", 		        : 
	"https://yourdomain/myimage.png", 		        : 
	"data:image/gif;base64,R0lGODlhEAAQAMQAAOR" 	        : 
  ]
}

PATCH 	{{origin}}/api/reviews/reviewId    			: 
```



### Brand Routes
- GET 	{{origin}}/api/brands                                   : Has Full API Features available
- POST 	{{origin}}/api/brands                                   : Add brands
- GET 	{{origin}}/api/brands/:brandIdOrSlug                    : Get Brand By brandId Or Slug
- PATCH {{origin}}/api/brands/:brandIdOrSlug                    : Update Brand By brandId Or Slug
- DELETE {{origin}}/api/brands/:brandIdOrSlug                   : Delete Brand By brandId or Slug

- DELETE {{origin}}/api/brands/many                             : To delete multiple brands by `brandIds` field


##### Get Brands
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
      "image": {
        "public_id": "82904774-f338-4822-8596-845e3cb34c97",
        "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png"
      },
      "name": "brand delete 2",
      "slug": "brand-delete-2",
      "isVisible": true,
      "createdAt": "2025-02-10T05:24:19.541Z",
      "updatedAt": "2025-02-10T05:24:19.541Z",
      "id": "67a98d834632880b34c7eec6"
    },
    {
      "image": {
        "public_id": "f69c5fb9-341e-4863-8563-78ba6c8e10a0",
        "secure_url": "/upload/brands/9d70443a-c752-4096-aa46-50ccf1731486.png"
      },
      "name": "brand name",
      "slug": "brand-name",
      "description": "brand description",
      "isVisible": true,
      "createdAt": "2025-02-11T05:14:02.850Z",
      "updatedAt": "2025-02-11T05:14:02.850Z",
      "id": "67aadc9aff1ef78a2569a871"
    }
  ]
}
```

##### Create Brand 
```
body {
  "name": "brand name",                                                         : (*)
  "slug": "Electronics",                                                        :  
  "description": "brand description ",
  "isVisible": true,

  "image": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
  "logo": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png",
  "thumbnail": "https://via.placeholder.com/100x100?text=Electronics",
  
  "banner" : "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"
}

POST 	{{origin}}/api/brands
```


##### Update Brand 
```
body {
  "name": "brand name",
  "description": "brand description ",
  "isVisible": true,

  "image": "https://.../dockarize-nodejs-application.png",                      : Method-1: url image
  "logo" : "data:image/gif;base64,R/XBs/fNwfjZ0frl"                             : Method-2: image as dataUrl
  "thumbnail": "https://via.placeholder.com/100x100?text=Electronics",
}

PATCH 	{{origin}}/api/brands/678ccafec4c838b7feae04c6   	                : Update brand by id
```


##### DELETE Multiple Brands by `brandIds`
```
body {
  "brandIds": [
    "67a8371cd1785272888c958b",
    "67a835bfd1785272888c9572"
  ]
}

DELETE 	{{origin}}/api/brands/many    			                        : 
```




### Blog Routes
- GET 	{{origin}}/api/blogs                                                    : Has Full API Features available
- POST 	{{origin}}/api/blogs                                                    : Add blogs
- GET 	{{origin}}/api/blogs/:brandIdOrSlug                                     : Get Blog By brandId or slug
- PATCH {{origin}}/api/blogs/:brandIdOrSlug                                     : Update Blog By brandId or slug
- DELETE {{origin}}/api/blogs/:brandIdOrSlug                                    : Delete Blog By brandId or slug


##### Get Blogs
```
{
  "status": "success",
  "data": {
    "author": "67986c8660c5024225bf3e76",
    "category": "67986d3d60c5024225bf3e81",
    "name": "the future of ai in everyday life 4",
    "slug": "the-future-of-ai-in-everyday-life-4",
    "summary": "artificial intelligence is revolutionizing industries and daily life.",
    "content": "ai technology is growing rapidly, influencing businesses, healthcare, and consumer applications...",
    "isVisible": true,
    "additionalUrl": "https://example.com/tech-blog",
    "banner": {
      "public_id": "5615718e-35d1-4182-b90b-dc580a876ff8",
      "secure_url": "https://via.placeholder.com/150x150?text=Logo"
    },
    "tags": [
      "tag1",
      "tag2"
    ],
    "createdAt": "2025-02-23T06:31:11.003Z",
    "updatedAt": "2025-02-23T06:31:11.003Z",
    "id": "67bac0aed5782a5958e82481"
  }
}
```

##### Create Blog 
```
body {
  "category": "67986d3d60c5024225bf3e81", 					: (*)
  "author": "67986c8660c5024225bf3e76", 					: (*)

  "name": "The Future of AI in Everyday Life", 					: (*)
  "slug": "The-Future-of-AI-in-Everyday-Life",
  "summary": "short summary growing rapidly, ...",                              : 
  "content": "AI technology is growing rapidly, ...",                           : 

  "isVisible": true,
  "tags": ["tag1", "tag2"]

  "additionalUrl": "https://example.com/tech-blog",
  "banner": "https://via.placeholder.com/600x200?text=Banner",
}

POST 	{{origin}}/api/blogs
```


##### Update Blog 
```
body {
  "slug": "update-this-slug-The-Future-of-AI-in-Everyday-Life",
}

PATCH 	{{origin}}/api/blogs/678ccafec4c838b7feae04c6   	                : Update blog by id
PATCH 	{{origin}}/api/blogs/it-is-an-awesome-block   	                        : Update blog by slug
```




### Category Routes
- GET 	{{origin}}/api/categories                                               : Has Full API Features available
- POST 	{{origin}}/api/categories                                               : Add categories
- GET 	{{origin}}/api/categories/:categoryIdOrSlug                             : Get Category By categoryId Or Slug
- PATCH {{origin}}/api/categories/:categoryIdOrSlug                             : Update Category By categoryId Or Slug
- DELETE {{origin}}/api/categories/:categoryIdOrSlug                            : Delete Category By categoryId Or Slug

- DELETE {{origin}}/api/categories/many                                         : To delete multiple categories by `categoryIds` field


##### Get Categories
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
      "slug": "",
      "isVisible": true,
      "isCategoryShownOnFrontend": true,                                            : 
      "name": "category 4",
      "image": {
        "public_id": "28db5064-5109-429f-b5e0-40dfdc8a27e2",
        "secure_url": "/upload/categories/893689fe-1a4e-4672-a0aa-e7d0e5015d6d.gif"
      },
      "createdAt": "2025-01-28T05:38:05.002Z",
      "updatedAt": "2025-01-28T05:38:05.002Z",
      "id": "67986d3d60c5024225bf3e81"
    },
    {
      "slug": "",
      "user": "67986c8660c5024225bf3e76",
      "name": "electronics",
      "description": "find the latest and greatest in electronics, from smartphones to smart home devices.",
      "isVisible": true,
      "createdAt": "2025-02-05T03:54:44.571Z",
      "updatedAt": "2025-02-05T03:54:44.571Z",
      "id": "67a2e1049dc1e9e61963321d"
    }
  ]
}
```

##### Create Category 
```
body {
  "user": "67986c8660c5024225bf3e76",                                           : (*)
  "name": "Electronics",                                                        : (*)
  "slug": "Electronics",                                                        :    
  "description": "Find the latest and greatest in electr...",                   : 
  "isVisible": true,                                                            : 
  "isCategoryShownOnFrontend": true,                                            : 
  "icon": "https://via.placeholder.com/50x50?text=Electronics",
  "thumbnail": "https://via.placeholder.com/100x100?text=Electronics",
  "banner": "https://via.placeholder.com/600x200?text=Electronics+Banner"
}

POST 	{{origin}}/api/categories
```


##### Update Category 
```
body {
  "name": "updated category name",
  "icon": "https://.../dockarize-nodejs-application.png",                       : Method-1: url image
  "banner" : "data:image/gif;base64,R/XBs/fNwfjZ0frl"                           : Method-2: image as dataUrl
}

PATCH 	{{origin}}/api/categories/678ccafec4c838b7feae04c6   	                : Update category by id
```


##### DELETE Multiple Category by `categoryIds`
```
body {
  "categoryIds": [
    "67a8371cd1785272888c958b",
    "67a835bfd1785272888c9572"
  ]
}

DELETE 	{{origin}}/api/categories/many    			                : 
```

### Sub-Category Routes
- GET 	{{origin}}/api/sub-categories                                           : Has Full API Features available
- POST 	{{origin}}/api/sub-categories                                           : Add sub-categories
- GET 	{{origin}}/api/sub-categories/:subCategoryIdOrSlug                      : Get SubCategory By subCategoryId Or Slug
- PATCH {{origin}}/api/sub-categories/:subCategoryIdOrSlug                      : Update SubCategory By subCategoryId Or Slug
- DELETE {{origin}}/api/sub-categories/:subCategoryIdOrSlug                     : Delete SubCategory By subCategoryId Or Slug

- DELETE {{origin}}/api/sub-categories/many                                     : To delete multiple subCategories by `subCategoryIds` field


##### Get Sub-Categories
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
      "slug": "",
      "isVisible": true,
      "category": "67986d3d60c5024225bf3e81",
      "name": "sub-category 2",
      "image": {
        "public_id": "08cc5e90-9f16-42b1-a474-aa653ad290ec",
        "secure_url": "https://raw.githubusercontent.com/JavaScriptForEverything/babur-hat/refs/heads/main/public/images/dockarize-nodejs-application.png"
      },
      "createdAt": "2025-01-28T05:38:49.992Z",
      "updatedAt": "2025-01-28T05:38:49.992Z",
      "id": "67986d6960c5024225bf3e88"
    },
    {
      "icon": {
        "public_id": "70f1de2d-807f-4a38-980e-ebac720bf1b4",
        "secure_url": "https://via.placeholder.com/50x50?text=Electronics"
      },
      "thumbnail": {
        "public_id": "b54de534-f77c-4108-85ef-dd825a514069",
        "secure_url": "https://via.placeholder.com/100x100?text=Electronics"
      },
      "banner": {
        "public_id": "0f8f5e45-2c2f-4a92-beee-2df8a8161858",
        "secure_url": "https://via.placeholder.com/600x200?text=Electronics+Banner"
      },
      "slug": "",
      "category": "679211f4c537d2d2537c04af",
      "user": "67986c8660c5024225bf3e76",
      "name": "sub-electronics",
      "description": "find the latest and greatest in electronics, from smartphones to smart home devices.",
      "isVisible": true,
      "createdAt": "2025-02-05T04:20:55.658Z",
      "updatedAt": "2025-02-05T04:20:55.658Z",
      "id": "67a2e727789c4432b93b057c"
    }
  ]
}
```

##### Create Sub-Category 
```
body {
  "category": "category.id",
  "user": "67986c8660c5024225bf3e76",                                           : (*)
  "name": "Electronics",                                                        : (*)
  "slug": "Electronics",                                                        :    
  "description": "Find the latest and greatest in electr...",                   : 
  "isVisible": true,
  "icon": "https://via.placeholder.com/50x50?text=Electronics",
  "thumbnail": "https://via.placeholder.com/100x100?text=Electronics",
  "banner": "https://via.placeholder.com/600x200?text=Electronics+Banner"
}

POST 	{{origin}}/api/sub-categories
```


##### Update Sub-Category 
```
body {
  "name": "updated category name",
  "icon": "https://.../dockarize-nodejs-application.png",                       : Method-1: url image
  "banner" : "data:image/gif;base64,R/XBs/fNwfjZ0frl"                           : Method-2: image as dataUrl
}

PATCH 	{{origin}}/api/sub-categories/678ccafec4c838b7feae04c6                  : Update subCategoryId
PATCH 	{{origin}}/api/sub-categories/super-cook-sub-category                   : Update by slug
```


##### DELETE Multiple SubCategory by `subCategoryIds`
```
body {
  "subCategoryIds": [
    "67a8371cd1785272888c958b",
    "67a835bfd1785272888c9572"
  ]
}

DELETE 	{{origin}}/api/sub-categories/many    			                : 
```


### Child-Category Routes
- GET 	{{origin}}/api/child-categories                                         : Has Full API Features available
- POST 	{{origin}}/api/child-categories                                         : Add child-categories
- GET 	{{origin}}/api/child-categories/:childCategoryId                        : Get ChildCategory By childCategoryId
- PATCH {{origin}}/api/child-categories/:childCategoryId                        : Update ChildCategory By childCategoryId
- DELETE {{origin}}/api/child-categories/:childCategoryId                       : Delete ChildCategory By childCategoryId


##### Get Child-Categories
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
      "slug": "",
      "isVisible": true,
      "category": "67986d3d60c5024225bf3e81",
      "subCategory": "67986d6960c5024225bf3e88",
      "name": "delete child 3 for sub-category 1",
      "image": {
        "public_id": "c026f017-ed3b-4a51-b7c3-2736066441df",
        "secure_url": "/upload/childCategories/732d3b9d-dd7b-40b3-a69e-68212c91df6b.gif"
      },
      "createdAt": "2025-01-28T05:39:36.108Z",
      "updatedAt": "2025-01-28T05:39:36.108Z",
      "id": "67986d9860c5024225bf3e8a"
    },
    {
      "icon": {
        "public_id": "680586b1-9ba5-40b9-8e45-0aaf325e702b",
        "secure_url": "https://via.placeholder.com/50x50?text=Electronics"
      },
      "thumbnail": {
        "public_id": "7a9916c4-fd00-4aca-8ad9-6dbac0a50fe2",
        "secure_url": "https://via.placeholder.com/100x100?text=Electronics"
      },
      "banner": {
        "public_id": "21d57c1f-6f1c-4cb8-9c91-0db98d0d6ae5",
        "secure_url": "https://via.placeholder.com/600x200?text=Electronics+Banner"
      },
      "slug": "",
      "subCategory": "67986d6960c5024225bf3e88",
      "user": "67986c8660c5024225bf3e76",
      "name": "child-electronics",
      "description": "find the latest and greatest in electronics, from smartphones to smart home devices.",
      "isVisible": true,
      "createdAt": "2025-02-05T04:22:05.685Z",
      "updatedAt": "2025-02-05T04:22:05.685Z",
      "id": "67a2e76d789c4432b93b057e"
    }
  ]
}
```


##### Create Child-Category 
```
body {
  "category": "category.id",
  "user": "67986c8660c5024225bf3e76",                                           : (*)
  "name": "Electronics",                                                        : (*)
  "slug": "Electronics",                                                        :    
  "description": "Find the latest and greatest in electr...",                   : 
  "isVisible": true,
  "icon": "https://via.placeholder.com/50x50?text=Electronics",
  "thumbnail": "https://via.placeholder.com/100x100?text=Electronics",
  "banner": "https://via.placeholder.com/600x200?text=Electronics+Banner"
}


POST 	{{origin}}/api/child-categories
```


##### Update Child-Category 
```
body {
  "name": "updated category name",
  "icon": "https://.../dockarize-nodejs-application.png",                       : Method-1: url image
  "banner" : "data:image/gif;base64,R/XBs/fNwfjZ0frl"                           : Method-2: image as dataUrl
}


PATCH 	{{origin}}/api/child-categories/678ccafec4c838b7feae04c6  : Update childCategoryId
```









### Blog-Category Routes
- GET 	{{origin}}/api/blog-categories                                         : Has Full API Features available
- POST 	{{origin}}/api/blog-categories                                         : Add blog-categories
- GET 	{{origin}}/api/blog-categories/:blogCategoryIdOrSlug                   : Get ChildCategory By blogCategoryIdOrSlug
- PATCH {{origin}}/api/blog-categories/:blogCategoryIdOrSlug                   : Update ChildCategory By blogCategoryIdOrSlug
- DELETE {{origin}}/api/blog-categories/:blogCategoryIdOrSlug                  : Delete ChildCategory By blogCategoryIdOrSlug


##### Get Blog-Categories
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
      "user": "67986c8660c5024225bf3e76",
      "name": "technology",
      "slug": "technology",
      "description": "stay updated with the latest advancements in technology and gadgets.",
      "isVisible": true,
      "createdAt": "2025-02-09T11:54:30.181Z",
      "updatedAt": "2025-02-09T11:54:30.181Z",
      "id": "67a89776fe652c30f34428ce"
    },
    {
      "user": "67986c8660c5024225bf3e76",
      "name": "technology3",
      "slug": "technology3",
      "description": "stay updated with the latest advancements in technology and gadgets.",
      "isVisible": true,
      "createdAt": "2025-02-09T11:54:54.473Z",
      "updatedAt": "2025-02-09T11:54:54.473Z",
      "id": "67a8978efe652c30f34428d4"
    }
  ]
}
```

##### Create Blog-Category 
```
body {
  "user": "67986c8660c5024225bf3e76",                                           : (*)
  "name": "Technology",                                                         : (*)
  "slug": "Technology",
  "title": "Latest Tech Trends & Innovations",
  "description": "Stay updated with the latest advancements in technology and gadgets."
  "isVisible": true,
  "image": "https://via.placeholder.com/300x200?text=Technology+Blog",
}

POST 	{{origin}}/api/blog-categories
```


##### Update blog-Category 
```
body {
  "name": "updated category name",
  "image" : "data:image/gif;base64,R/XBs/fNwfjZ0frl"                            : Method-2: image as dataUrl
}


PATCH 	{{origin}}/api/blog-categories/678ccafec4c838b7feae04c6                 : Update blogCategoyId
PATCH 	{{origin}}/api/blog-categories/super-cool-blog-category                 : Update by blog slug 
```









### Site Routes
- GET 	{{origin}}/api/sites                                                    : 
- GET 	{{origin}}/api/sites/first                                              : To get first one
- POST 	{{origin}}/api/sites                                                    : Add sites
- GET 	{{origin}}/api/sites/:siteId                                            : Get single site
- PATCH {{origin}}/api/sites/:siteId                                            : Update Site
- PATCH {{origin}}/api/sites/:siteId/change-active                              : Make specific one as active and others inactive
- DELETE {{origin}}/api/sites/:siteId                                           : Delete Site

##### Get sites
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
        "isActive": true,
	"status": "success",
	"data": {
		"updateBy": "67986c8660c5024225bf3e76",
		"siteMotto": "sites moto",
		"siteUrl": "site url",
		"salesEmail": "salesemail",
		"primaryPhone": "primaryphone",
		"alternativePhone": "alternativephone",
		"googleAnalytics": "googleanalytics",
		"googleAbsense": "googleabsense",
		"companyName": "ngen it",
		"maintenanceMode": false,
		"socialMediaLinks": {
			"website": "https://ngenitltd.com",
			"facebook": "facebook",
			"instagram": "instagram",
			"linkedIn": "linkedIn",
			"whatsApp": "whatsApp",
			"twitter": "twitter",
			"youTube": "youTube",
			"reddit": "reddit",
			"tumblr": "tumblr",
			"tiktok": "tiktok"
		},
		"name": "n-mart 3",
		"slug": "n-mart-3",
		"phoneOne": "+1-800-123-4567",
		"phoneTwo": "+1-800-987-6543",
		"whatsappNumber": "+1-800-555-7890",
		"infoEmail": "info@nmart.com",
		"contactEmail": "contact@nmart.com",
		"supportEmail": "support@nmart.com",
		"about": "example store is your go-to destination for high-quality experience with exceptional customer service.",
		"addressOne": "123 main street",
		"addressTwo": "suite 400, cityville, ca 90210",
		"defaultCurrency": "usd",
		"defaultLanguage": "en",
		"copyrightUrl": "https://www.example.com",
		"copyrightTitle": "© 2024 example store. all rights reserved.",
		"metaKeyword": "ecommerce, online store, best deals, shopping",
		"metaDescription": "welcome to example store, your go-to destination for the best products at unbeatable prices.",
		"favicon": {
			"public_id": "dc804a2d-ff45-49cf-b4d4-280e6a4c25d3",
			"secure_url": "https://via.placeholder.com/100x100?text=Site+Icon"
		},
		"systemLogoWhite": {
			"public_id": "58d2f554-1758-4145-9054-34c8261cd7cf",
			"secure_url": "https://via.placeholder.com/300x100?text=System+Logo+White"
		},
		"systemLogoBlack": {
			"public_id": "0ee4b8d0-385c-49b5-bab8-c4401469fa2c",
			"secure_url": "https://via.placeholder.com/300x100?text=System+Logo+Black"
		},
		"metaImage": {
			"public_id": "afdb5c7b-753e-46f5-b07d-edc91bc0c650",
			"secure_url": "http://192.168.0.222:5000/upload/sites/e00ff37e-49bf-47ee-9989-23c91119ffa8.gif"
		},
		"createdAt": "2025-02-19T11:21:06.976Z",
		"updatedAt": "2025-02-19T11:21:06.976Z",
		"id": "67b5bea28537d9d0119da0f4"
	}
  }
]
}
```

##### Create site
```
body {
  "updateBy": "67986c8660c5024225bf3e76",

  "siteMotto": "sites moto",
  "siteUrl": "site url",
  "salesEmail": "salesEmail",
  "primaryPhone": "primaryPhone",
  "alternativePhone": "alternativePhone",
  "googleAnalytics": "googleAnalytics",
  "googleAbsense": "googleAbsense",
  "maintenanceMode": false,
  "companyName": "NGen IT",
  "socialMediaLinks": {
    "website": "https://ngenitltd.com",
    "facebook": "facebook",
    "instagram": "instagram",
    "linkedIn": "linkedIn",
    "whatsApp": "whatsApp",
    "twitter": "twitter",
    "youTube": "youTube",
    "reddit": "reddit",
    "tumblr": "tumblr",
    "tiktok": "tiktok"
  },

  "name"           : "N Mart 2",
  "slug"           : "N-Mart-2",                                                : 
  "phoneOne"       : "+1-800-123-4567",
  "phoneTwo"       : "+1-800-987-6543",
  "whatsappNumber": "+1-800-555-7890",
  "contactEmail"   : "contact@nmart.com",
  "supportEmail"   : "support@nmart.com",
  "infoEmail"     : "info@nmart.com",
  "about"         : "Example Store is your go-to destination for high-quality experience with exceptional customer service.",
  "addressOne"     : "123 Main Street",
  "addressTwo"     : "Suite 400, Cityville, CA 90210",

  "defaultLanguage": "en",
  "defaultCurrency": "USD",
  "copyrightUrl"   : "https://www.example.com",
  "copyrightTitle": "© 2024 Example Store. All Rights Reserved.",

  "metaKeyword"   : "ecommerce, online store, best deals, shopping",
  "metaDescription": "Welcome to Example Store, your go-to destination for the best products at unbeatable prices.",

  "favicon"       : "https://via.placeholder.com/100x100?text=Site+Icon",
  "systemLogoWhite": "https://via.placeholder.com/300x100?text=System+Logo+White",
  "systemLogoBlack": "https://via.placeholder.com/300x100?text=System+Logo+Black",
  "metaImage"     : "https://via.placeholder.com/300x300?text=Meta+Image"
}

POST 	{{origin}}/api/sites
```


##### Update Site
```
body {
  "name": "updated site name"
}
PATCH 	{{origin}}/api/sites/:siteId
```


##### Make only one as active: isActive
```
PATCH 	{{origin}}/api/sites/:siteId/change-active
```






### Offer Routes
- GET 	{{origin}}/api/offers                                                   : 
- POST 	{{origin}}/api/offers                                                   : Add offers
- GET 	{{origin}}/api/offers/:offerIdOrSlug                                    : Get single Offer
- PATCH {{origin}}/api/offers/:offerIdOrSlug                                    : Update Offer
- DELETE {{origin}}/api/offers/:offerIdOrSlug                                   : Delete Offer

##### Get Offers
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
      "image": {
        "public_id": "52dc544d-5246-45be-a6a3-7ccf9a6e734d",
        "secure_url": "https://via.placeholder.com/300x300?text=Product+Image"
      },
      "thumbnail": {
        "public_id": "80db91d6-a505-4f6c-937d-1e6432559c32",
        "secure_url": "https://via.placeholder.com/100x100?text=Thumbnail"
      },
      "banner": {
        "public_id": "d35a85d8-383f-4b85-b815-6267d9d7f073",
        "secure_url": "https://via.placeholder.com/600x200?text=Banner"
      },
      "footerBanner": {
        "public_id": "0f1efb6e-5f82-4529-b685-1d91ff759ab9",
        "secure_url": "https://via.placeholder.com/600x100?text=Footer+Banner"
      },
      "product": "67986d5360c5024225bf3e83",
      "name": "limited time offer",
      "slug": "limited-time-offer",
      "buttonName": "buy now",
      "headerSlogan": "get the best deal on smartphone x!",
      "isSelecte": false,
      "startDate": "2024-02-05T00:00:00.000Z",
      "endDate": "2024-02-20T00:00:00.000Z",
      "createdAt": "2025-02-09T03:45:07.117Z",
      "updatedAt": "2025-02-09T03:45:07.117Z",
      "id": "67a824c359dc8cdeeb7e8f11"
    },
    {
      "image": {
        "public_id": "ae443549-b763-4b07-8492-bfaa164db46b",
        "secure_url": "https://via.placeholder.com/300x300?text=Product+Image"
      },
      "thumbnail": {
        "public_id": "669e30c0-c747-4954-8841-05c1e4a02e22",
        "secure_url": "https://via.placeholder.com/100x100?text=Thumbnail"
      },
      "banner": {
        "public_id": "979bb43e-81a2-4246-8d75-2629763c0ba3",
        "secure_url": "https://via.placeholder.com/600x200?text=Banner"
      },
      "footerBanner": {
        "public_id": "931c632d-3c7f-465c-abaf-80c40e71e7a6",
        "secure_url": "https://via.placeholder.com/600x100?text=Footer+Banner"
      },
      "product": "67986d5360c5024225bf3e83",
      "name": "updated ofer name 3",
      "slug": "limited-time-offer-2",
      "buttonName": "buy now",
      "headerSlogan": "get the best deal on smartphone x!",
      "isSelecte": false,
      "startDate": "2024-02-05T00:00:00.000Z",
      "endDate": "2024-02-20T00:00:00.000Z",
      "createdAt": "2025-02-09T03:45:43.331Z",
      "updatedAt": "2025-02-09T03:46:20.177Z",
      "id": "67a824e759dc8cdeeb7e8f14"
    }
  ]
}
```

##### Create Offer
```
body {
  "product": "67986d5360c5024225bf3e83",
  "name": "Limited Time Offer 5",
  "buttonName": "Buy Now",
  "isSelecte": false,
  "headerSlogan": "Get the best deal on Smartphone X!",

  "startDate": "2024-02-05",                                                    : Date Format: year-month-day
  "endDate": "2024-02-20",

  "image": "https://via.placeholder.com/300x300?text=Product+Image",
  "thumbnail": "https://via.placeholder.com/100x100?text=Thumbnail",
  "banner": "https://via.placeholder.com/600x200?text=Banner",
  "footerBanner": "https://via.placeholder.com/600x100?text=Footer+Banner"
}

POST 	{{origin}}/api/offers
```


##### Update Offer
```
body {
  "name": "updated offer name"
}

PATCH 	{{origin}}/api/offers/:offerIdOrSlug
```






### WishList Routes
- GET 	{{origin}}/api/wishlists                                                 	: 
- POST 	{{origin}}/api/wishlists                                                        : Add wishlists
- GET 	{{origin}}/api/wishlists/:wishListId                                    	: Get single wishList
- PATCH {{origin}}/api/wishlists/:wishListId                                    	: Update wishList
- DELETE {{origin}}/api/wishlists/:wishListId                                   	: Delete wishList


##### Get WishLists
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
      "product": "67986d5360c5024225bf3e83",
      "user": "67986cab60c5024225bf3e79",
      "createdAt": "2025-02-12T06:00:22.272Z",
      "updatedAt": "2025-02-12T06:00:22.272Z",
      "id": "67ac38f61309d20ff67202da"
    },
    {
      "product": "67986d5360c5024225bf3e83",
      "user": "67986c8660c5024225bf3e76",
      "createdAt": "2025-02-12T06:25:01.173Z",
      "updatedAt": "2025-02-12T06:25:01.173Z",
      "id": "67ac3ebd1309d20ff67202e6"
    }
  ]
}
```

##### Create WishList
```
body {
  "product": "67986d5360c5024225bf3e83",
  "user": "67986d5360c5024225bf3e83"
}

POST 	{{origin}}/api/wishlists
```


##### Update WishList
```
body {
  "product": "67986d5360c5024225bf3e83",
  "user": "67986d5360c5024225bf3e83"
}

PATCH 	{{origin}}/api/wishlists/:wishListsId
```







### Product Review Like Routes
- GET 	{{origin}}/api/product-review-likes                                             : 
- POST 	{{origin}}/api/product-review-likes                                             : Add product-review-likes
- GET 	{{origin}}/api/product-review-likes/:productReviewLikeId                        : Get single productReviewLikeId
- PATCH {{origin}}/api/product-review-likes/:productReviewLikeId                        : Update productReviewLikeId
- DELETE {{origin}}/api/product-review-likes/:productReviewLikeId                       : Delete productReviewLikeId

- GET 	{{origin}}/api/products/:productId/product-review-likes 			: all review likes of a product
- GET 	{{origin}}/api/users/:userId/product-review-likes 				: all review likes of a user
- GET 	{{origin}}/api/reviews/:reviewId/product-review-likes 				: all review likes of a specific review




##### Get ProductReviewLikes
```
{
  "status": "success",
  "count": 3,
  "total": 3,
  "data": [
    {
      "review": "67ac65760706de3453864c41",
      "user": "67986cab60c5024225bf3e79",
      "createdAt": "2025-02-13T06:19:46.361Z",
      "updatedAt": "2025-02-13T06:19:46.361Z",
      "id": "67ad8f02966e8142044feedc"
    },
    {
      "review": "67ac65c00706de3453864c45",
      "user": "67986cab60c5024225bf3e79",
      "createdAt": "2025-02-13T06:20:05.176Z",
      "updatedAt": "2025-02-13T06:20:05.176Z",
      "id": "67ad8f15966e8142044feee0"
    },
    {
      "review": "67ac65e50706de3453864c4a",
      "user": "67986cab60c5024225bf3e79",
      "createdAt": "2025-02-13T06:20:12.008Z",
      "updatedAt": "2025-02-13T06:20:12.008Z",
      "id": "67ad8f1c966e8142044feee2"
    }
  ]
}
```

##### Create ProductReviewLike
```
body {
  "review": "67986d5360c5024225bf3e83",
  "user": "67986d5360c5024225bf3e82",
  "product": "67986d5360c5024225bf3e81"
}

POST 	{{origin}}/api/product-review-likes
```


##### Update ProductReviewLike
```
body {
  "review": "67986d5360c5024225bf3e83",
  "user": "67986d5360c5024225bf3e83",
  "product": "67986d5360c5024225bf3e81"
}

PATCH 	{{origin}}/api/product-review-likes/:productReviewLikeId
```







### Coupons Routes
- GET 	{{origin}}/api/coupons                                                 	: Get Coupons
- POST 	{{origin}}/api/coupons                                                 	: Add Coupone
- GET 	{{origin}}/api/coupons/:couponIdOrCouponCode                            : Get single couponId
- PATCH {{origin}}/api/coupons/:couponId                                    	: Update couponId
- DELETE {{origin}}/api/coupons/:couponId                                   	: Delete couponId

- GET 	{{origin}}/api/coupons/:couponCode/verify 				: To verify coupon


##### Get Coupons
```
{
  "status": "success",
  "count": 1,
  "total": 4,
  "data": [
    {
      "rightBanner": {
        "public_id": "6081ed69-157b-4f38-ac4f-ec6f6f101ffd",
        "secure_url": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg"
      },
      "name": "coupon title 5",
      "description": "lorem description goes here",
      "code": "NMC202503234",
      "discount": "50",
      "isUsed": false,
      "isVisible": true,
      "endDate": "2025-02-15T00:00:00.000Z",
      "banners": [
        {
          "public_id": "b62b7305-bcb8-43f8-bbe9-ea826bf04bb6",
          "secure_url": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg",
          "id": "67df8d2cb38c3331bce479d4"
        }
      ],
      "createdAt": "2025-03-23T04:25:16.632Z",
      "updatedAt": "2025-03-23T04:25:16.632Z",
      "id": "67df8d2cb38c3331bce479d3"
    }
  ]
}
```


##### Create Coupon
```
body {
  "type": "coupon type",
  "title": " coupon title 3",
  "description": "lorem description goes here",
  "code": "COUPON-CODE",
  "discount": "50",
  "quantity": 2,
  "isUsed": false,
  "isVisible": true,
  "startAt": "2025-02-12",
  "endDate": "2025-02-15",
  
  "rightBanner": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg",
  "banners": [
    "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg"
  ]
}

POST 	{{origin}}/api/coupons
```

###### Coupon Create Response
```
{
  "status": "success",
  "data": {
    "name": "coupon title 5",
    "description": "lorem description goes here",
    "code": "NMC202503234",
    "coupon": "$2a$12$kjhto.pq.DuhoossYkn7m.orP5OxCD/utnfmcv3ijqSFXZ/k.uG4.",
    "discount": "50",
    "isUsed": false,
    "isVisible": true,
    "endDate": "2025-02-15T00:00:00.000Z",
    "rightBanner": {
      "public_id": "6081ed69-157b-4f38-ac4f-ec6f6f101ffd",
      "secure_url": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg"
    },
    "banners": [
      {
        "public_id": "b62b7305-bcb8-43f8-bbe9-ea826bf04bb6",
        "secure_url": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg",
        "id": "67df8d2cb38c3331bce479d4"
      }
    ],
    "createdAt": "2025-03-23T04:25:16.632Z",
    "updatedAt": "2025-03-23T04:25:16.632Z",
    "id": "67df8d2cb38c3331bce479d3"
  }
}
```


##### Update Coupon
```
body {
  "isUsed": true,
}

PATCH 	{{origin}}/api/coupons/:couponId
```





### Faq Routes
- GET 	{{origin}}/api/faqs                                                     : 
- POST 	{{origin}}/api/faqs                                                     : Add faqs
- GET 	{{origin}}/api/faqs/:faqId                                    	        : Get single faq
- PATCH {{origin}}/api/faqs/:faqId                                    	        : Update faq
- DELETE {{origin}}/api/faqs/:faqId                                   	        : Delete faq


##### Get faqs
```
{
  "status": "success",
  "count": 1,
  "total": 1,
  "data": [
    {
      "category": "returns & refunds",
      "question": "what is your return policy?",
      "answer": "you can return any item within 30 days of purchase for a full refund.",
      "listOrder": 1,
      "isVisible": true,
      "createdAt": "2025-02-13T09:50:06.972Z",
      "updatedAt": "2025-02-13T09:50:06.972Z",
      "id": "67adc04e6ad3e2465ef68984"
    }
  ]
}
```

##### Create Faq
```
body {
  "category": "Returns & Refunds",
  "question": "What is your return policy?",
  "answer": "You can return any item within 30 days of purchase for a full refund.",
  "listOrder": 1,
  "isVisible": true
}

POST 	{{origin}}/api/faqs
```


##### Update Faq
```
body {
  "category": "Returns & Refunds",
  "question": "What is your return policy?",
}

PATCH 	{{origin}}/api/faqs/:faqId
```







### FaqCategory Routes
- GET 	{{origin}}/api/faq-categories                                                   : 
- POST 	{{origin}}/api/faq-categories                                                   : Add faqCategories
- GET 	{{origin}}/api/faq-categories/:faqCategoryId                                    : Get single faqCategory  
- PATCH {{origin}}/api/faq-categories/:faqCategoryId                                    : Update faqCategory
- DELETE {{origin}}/api/faq-categories/:faqCategoryId                                   : Delete faqCategory


##### Get faqCategories
```
{
  "status": "success",
  "count": 1,
  "total": 1,
  "data": [
    {
      "name": "returns & refunds",
      "createdAt": "2025-04-05T06:59:29.274Z",
      "updatedAt": "2025-04-05T06:59:29.274Z",
      "id": "67f0d4d1e27be961949caf5a"
    }
  ]
}
```

##### Create FaqCategory
```
body {
  "name": "Returns & Refunds"
}

POST 	{{origin}}/api/faq-categories
```


##### Update Faq
```
body {
  "name": "Returns & Refunds update",
}

PATCH 	{{origin}}/api/faq-categories/:faqCategoryId
```







### FaqQuestion Routes
- GET 	{{origin}}/api/faq-questions                                            : 
- POST 	{{origin}}/api/faq-questions                                            : Add faqQuestion
- GET 	{{origin}}/api/faq-questions/:faqQuestionId                             : Get single faqQuestion
- PATCH {{origin}}/api/faq-questions/:faqQuestionId                             : Update faqQuestion
- DELETE {{origin}}/api/faq-questions/:faqQuestionId                            : Delete faqQuestion


##### Get faq-questions
```
{
  "status": "success",
  "count": 2,
  "total": 2,
  "data": [
    {
      "user": "67bee8e437b3c07d457b0b11",
      "name": "riajul islam",
      "email": "riajul2@gmai.com",
      "message": "your message goes here",
      "createdAt": "2025-03-03T07:33:54.729Z",
      "updatedAt": "2025-03-03T07:33:54.729Z",
      "id": "67c55b620a9a5b140eab3339"
    },
    {
      "user": "67bee8e437b3c07d457b0b11",
      "name": "riajul islam",
      "email": "riajul2@gmai.com",
      "message": "updated faq question",
      "createdAt": "2025-03-03T07:34:23.230Z",
      "updatedAt": "2025-03-03T07:45:08.142Z",
      "id": "67c55b7f0a9a5b140eab333b"
    }
  ]
}
```

##### Create FaqQuestion
```
body {
  "name": "riajul islam",                                               (*) : 
  "email": "riajul2@gmai.com",                                          (*) : 
  "message": "your message goes here 2"                                 (*) : 
}

POST 	{{origin}}/api/faq-questions
```


##### Update FaqQuestion
```
body {
  "message": "What is your updated question?",
}

PATCH 	{{origin}}/api/faq-questions/:faqQuestionId
```







### Policy Routes
- GET 	{{origin}}/api/policies                                                 	: 
- POST 	{{origin}}/api/policies                                                         : Add policies
- GET 	{{origin}}/api/policies/:policyId                                    	        : Get single policy
- PATCH {{origin}}/api/policies/:policyId                                    	        : Update policy
- DELETE {{origin}}/api/policies/:policyId                                   	        : Delete policy


##### Get Policies
```
{
  "status": "success",
  "count": 1,
  "total": 1,
  "data": [
    {
      "type": "faq",
      "title": "privacy policy",
      "description": "this policy explains how we collect, use, and protect your personal data.",
      "effectiveDate": "2024-01-01T00:00:00.000Z",
      "expireDate": "2026-01-01T00:00:00.000Z",
      "isVisible": true,
      "createdAt": "2025-02-13T09:52:33.340Z",
      "updatedAt": "2025-02-13T09:52:33.340Z",
      "id": "67adc0e13ac596893078854c"
    }
  ]
}
```

##### Create Policy
```
body {
  "type": "faq",                                        : 'faq' | 'privacy' | 'refund' | 'terms-and-condition'
  "title": "Privacy Policy",
  "description": "This policy explains how we collect, use, and protect your personal data.",
  "effectiveDate": "2024-01-01",
  "expireDate": "2026-01-01",
  "isVisible": true
}

POST 	{{origin}}/api/policies
```


##### Update Policy
```
body {
  "type": "faq",
  "title": "Privacy Policy",
}

PATCH 	{{origin}}/api/policies/:policyId
```








### Home Routes for Home Banners
- GET 	{{origin}}/api/homes                                                 	        : 
- POST 	{{origin}}/api/homes                                                            : Add home
- GET 	{{origin}}/api/homes/:homeId                                    	        : Get single home
- PATCH {{origin}}/api/homes/:homeId                                    	        : Update home
- PATCH {{origin}}/api/homes/:homeId/change-active                                      : Make specific one as active and others inactive
- DELETE {{origin}}/api/homes/:homeId                                   	        : Delete home


##### Get Home Banners
```
{
  "status": "success",
  "count": 1,
  "data": [
    {
      "isActive": true,

      "mainBanner": {
        "public_id": "dcbc9ce2-0916-4a6d-82a1-ffa0dacab139",
        "secure_url": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg"
      },
      "flashSaleBanner": {
        "public_id": "5d99f6d4-0c93-4dbf-ab60-c56674ceba0d",
        "secure_url": "http://192.168.0.222:5000/upload/homes/2e713d09-5352-44ce-ba6e-ebf5c744bdd9.jpg"
      },
      "middleBanners1": [
        {
          "public_id": "b7d756f1-53b3-4bd8-bdab-df247ce0b9a1",
          "secure_url": "http://192.168.0.222:5000/upload/homes/801d730e-c98a-4ce5-83e7-7a8aee7fa02d.jpg",
          "_id": "67b1a16a1c06959a9abb1d6a"
        },
        {
          "public_id": "835754a4-d277-4147-a869-62c756842d83",
          "secure_url": "http://192.168.0.222:5000/upload/homes/9af809fb-bb7e-4462-9dd0-1fa290923af2.jpg",
          "_id": "67b1a16a1c06959a9abb1d6b"
        }
      ],
      "middleBanners2": [
        {
          "public_id": "7933a53b-0f8c-4e2e-b6af-5de76645c340",
          "secure_url": "http://192.168.0.222:5000/upload/homes/02b19d2b-1363-4530-882b-e6e4ebe02496.jpg",
          "_id": "67b1a1e41c06959a9abb1d76"
        },
        {
          "public_id": "f35f8d6e-8e9e-4b99-8de3-0c9d4c48a519",
          "secure_url": "http://192.168.0.222:5000/upload/homes/5e89c56d-e3bb-4d72-b5e8-7112a1e782b9.jpg",
          "_id": "67b1a1e41c06959a9abb1d77"
        }
      ],
      "middleBanners3": [
        {
          "public_id": "2b57e82b-d745-4694-8a7d-69e88e1bc4ab",
          "secure_url": "http://192.168.0.222:5000/upload/homes/ed63b7a1-e8dc-4d54-b3b0-b6bffdc02902.jpg",
          "_id": "67b1a2341c06959a9abb1d84"
        }
      ],
      "giftCardBanners": [
        {
          "public_id": "2b57e82b-d745-4694-8a7d-69e88e1bc4ab",
          "secure_url": "http://192.168.0.222:5000/upload/homes/ed63b7a1-e8dc-4d54-b3b0-b6bffdc02902.jpg",
          "_id": "67b1a2341c06959a9abb1d84"
        }
      ],
      "createdAt": "2025-02-16T08:08:59.423Z",
      "updatedAt": "2025-02-16T08:30:44.740Z",
      "id": "67b19d1b4ce8dab529a25dc6"
    }
  ]
}
```

##### Create Home Banners
```
body {
  "mainBanner": "https://lh3.googleusercontent.com/-0DdrDC0_szs/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknHp3l4PERohfcOSRie-GCbBEzPGw/photo.jpg?sz=46",
  "flashSaleBanner": "https://lh3.googleusercontent.com/-0DdrDC0_szs/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknHp3l4PERohfcOSRie-GCbBEzPGw/photo.jpg?sz=46",

  "middleBanners1": [
    "https://lh3.googleusercontent.com/-0DdrDC0_szs/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknHp3l4PERohfcOSRie-GCbBEzPGw/photo.jpg?sz=46"
  ],
  "middleBanners2": [
    "https://lh3.googleusercontent.com/-0DdrDC0_szs/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknHp3l4PERohfcOSRie-GCbBEzPGw/photo.jpg?sz=46"
  ],
  "middleBanners3": [
    "https://lh3.googleusercontent.com/-0DdrDC0_szs/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknHp3l4PERohfcOSRie-GCbBEzPGw/photo.jpg?sz=46"
  ]

}

POST 	{{origin}}/api/homes
```


##### Update Home Banner
```
body {
  "mainBanner": "https://lh3.googleusercontent.com/-0DdrDC0_szs/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfknHp3l4PERohfcOSRie-GCbBEzPGw/photo.jpg?sz=46",
}

PATCH 	{{origin}}/api/homes/:homeId
```

##### Make only one as active: isActive
```
PATCH 	{{origin}}/api/homes/:homeId/change-active
```








### About Us Routes 
- GET 	{{origin}}/api/about-us                                                 	        : 
- POST 	{{origin}}/api/about-us                                                                 : Add aboutUsId
- GET 	{{origin}}/api/about-us/:aboutUsId                                    	                : Get single aboutUsId
- PATCH {{origin}}/api/about-us/:aboutUsId                                    	                : Update aboutUsId
- PATCH {{origin}}/api/about-us/:aboutUsId/change-active                                    	: Make specific one as active and others inactive
- DELETE {{origin}}/api/about-us/:aboutUsId                                   	                : Delete aboutUsId


##### Get About Us
```
{
  "status": "success",
  "count": 1,
  "data": [
    {
      "isActive": true,

      "topBanner": {
        "public_id": "5ce716be-0387-4b8f-885d-762b2f1ed24a",
        "secure_url": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg"
      },
      "column1Image": {
        "public_id": "760dfea9-b8e1-493d-8560-c4717acd22fc",
        "secure_url": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg"
      },
      "column3Image": {
        "public_id": "b5b671c6-e784-459a-994c-9631ef0d3f4a",
        "secure_url": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg"
      },
      "header": "about us",
      "slogan": "discover our story, mission and value",
      "column1Badge": "our service",
      "column1Title": "we offer fast and secure home delivery services.",
      "column1Description": "at welcome to [your ecommerce website name], your one-stop destination for [your product niche, e.g., fashion, tech gadgets,home essentials, etc.]. founded on the principles of quality, affordability, and customer satisfaction, we are committed to .",
      "column2Badge": "why choose us",
      "column2Title": "we offer fast and secure..",
      "column2Description": "at welcome to [your ecommerce website name], your one-stop destination for [your product niche, e.g., fashion, tech gadgets, home essentials, etc.]. founded on the principles of quality, affordability, and customer satisfaction, we are committed to delivering an exceptional shopping experience for everyone.",
      "column3Badge": "what we offer",
      "column3Title": "we offer fast and secure home delivery services.",
      "column3Description": "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "createdAt": "2025-02-16T09:29:35.309Z",
      "updatedAt": "2025-02-16T09:29:35.309Z",
      "id": "67b1afff018943078149a691"
    }
  ]
}
```

##### Create About Us 
```
body {
  "header": "About Us",
  "slogan": "Discover our Story, Mission and Value",

  "topBanner": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg",

  "column1Badge": "Our Service",
  "column1Title": "We offer fast and secure home delivery services.",
  "column1Description": "At Welcome to [Your eCommerce Website Name], your one-stop destination for [your product niche, e.g., fashion, tech gadgets,home essentials, etc.]. Founded on the principles of quality, affordability, and customer satisfaction, we are committed to .",
  "column1Image": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg",

  "column2Badge": "Why choose Us",
  "column2Title": "We offer fast and secure..",
  "column2Description": "At Welcome to [Your eCommerce Website Name], your one-stop destination for [your product niche, e.g., fashion, tech gadgets, home essentials, etc.]. Founded on the principles of quality, affordability, and customer satisfaction, we are committed to delivering an exceptional shopping experience for everyone.",

  "column3Badge": "What we offer",
  "column3Title": "We offer fast and secure home delivery services.",
  "column3Description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "column3Image": "http://192.168.0.222:5000/upload/homes/985a736f-5446-433d-8b1c-bce175759812.jpg"
}

POST 	{{origin}}/api/about-us
```


##### Update About Us
```
body {
  "slogan": "Discover our Story, Mission and Value",
}

PATCH 	{{origin}}/api/about-us/:aboutUsId
```


##### Make only one as active: isActive
```
PATCH 	{{origin}}/api/about-us/:aboutUsId/change-active
```








### Contact Us Routes 
- GET 	{{origin}}/api/contact-us                                               : 
- POST 	{{origin}}/api/contact-us                                               : Add aboutUsId
- GET 	{{origin}}/api/contact-us/:contactUsId                                  : Get single contactUsId
- PATCH {{origin}}/api/contact-us/:contactUsId                                  : Update contactUsId
- PATCH {{origin}}/api/contact-us/:contactUsId/change-active                    : Make specific one as active and others inactive
- DELETE {{origin}}/api/contact-us/:contactUsId                                 : Delete contactUsId


##### Get Contact Us
```
{
  "status": "success",
  "count": 1,
  "total": 1,
  "data": [
    {
      "isActive": true,
      "fname": "riajul",
      "lname": "islam",
      "email": "riajul@gmail.com",
      "phone": "+8801957500605",
      "subject": "inform you",
      "message": "testing messaging by contact up",
      "createdAt": "2025-02-23T06:11:05.982Z",
      "updatedAt": "2025-02-23T06:11:05.982Z",
      "id": "67babbf93f974c8e9843b099"
    }
  ]
}
```

##### Create Contact Us 
```
body {
  "fname": "riajul",
  "lname": "islam",
  "phone": "+8801957500605",
  "email": "riajul@gmail.com",
  "subject": "inform you",
  "message": "testing messaging by contact up"
}

POST 	{{origin}}/api/contact-us
```


##### Update Contact Us
```
body {
  "message": "kindly handle my request",
}

PATCH 	{{origin}}/api/contact-us/:contactUsId
```

##### Make only one as active: isActive
```
PATCH 	{{origin}}/api/contact-us/:contactUsId/change-active
```







### Shipping Info
- GET 	{{origin}}/api/shipping-info                                                    : Get all 
- POST 	{{origin}}/api/shipping-info/                                            	: Create
- GET   {{origin}}/api/shipping-info/:shippingInfoId                                    : Get single one 
- PATCH {{origin}}/api/shipping-info/:shippingInfoId                                    : Update 
- DELETE {{origin}}/api/shipping-info/:shippingInfoId                                   : Delete 


##### Get Shipping Info
```
{
  "status": "success",
  "count": 1,
  "total": 5,
  "data": [
    {
      "user": "67986d5360c5024225bf3e52",
      "fname": "riajul 2",
      "lname": "islam",
      "email": "riajul@gmail.com",
      "phone": "+8801957500605",
      "street": "mahfuza tower",
      "postCode": "52542",
      "region": "dhaka",
      "city": "dhaka",
      "country": "bangladesh",
      "createdAt": "2025-02-22T11:26:05.626Z",
      "updatedAt": "2025-02-22T11:28:04.267Z",
      "id": "67b9b44d8e849295ea593d09"
    }
  ]
}
```

##### Add Shipping Info
```
body {
  "user": "67986d5360c5024225bf3e53",                                           (*)     :
  "fname": "riajul",                                                            (*)     :
  "lname": "islam",                                                             (*)     :
  "email": "riajul2@gmail.com",                                                 (*)     :
  "phone": "+8801957500605",
  "street": "mahfuza tower",                                                    (*)     :
  "postCode": "52542",                                                          (*)     :
  "region": "dhaka",                                                            (*)     :
  "city": "dhaka",                                                              (*)     :
  "country": "bangladesh"                                                       (*)     :
}

POST    {{origin}}/api/shipping-info
```


### Billing Info
- GET 	{{origin}}/api/billing-info                                                     : Get all 
- POST 	{{origin}}/api/billing-info/                                            	: Create
- GET   {{origin}}/api/billing-info/:billingInfoId                                      : Get single one 
- PATCH {{origin}}/api/billing-info/:billingInfoId                                      : Update 
- DELETE {{origin}}/api/billing-info/:billingInfoId                                     : Delete 


##### Get Billing Info
```
{
  "status": "success",
  "count": 1,
  "total": 1,
  "data": [
    {
      "user": "67986d5360c5024225bf3e53",
      "email": "riajul2@gmail.com",
      "phone": "+8801957500605",
      "street": "mahfuza tower",
      "postCode": "52542",
      "region": "dhaka",
      "city": "dhaka",
      "country": "bangladesh",
      "createdAt": "2025-02-22T11:31:30.852Z",
      "updatedAt": "2025-02-22T11:33:09.941Z",
      "id": "67b9b5928e849295ea593d1d"
    }
  ]
}
```

##### Add Billing Info
```
{
  "user": "67de7951f65a3ef2edf000bf",                                           (*)     :
  "email": "riajul4@gmail.com",                                                 (*)     :
  "phone": "+8801957500605",                                                    (*)     :
  "street": "mahfuza tower",                                                    (*)     :
  "postCode": "52542",                                                          (*)     :
  "region": "dhaka",                                                            (*)     :
  "city": "dhaka",                                                              (*)     :
  "country": "bangladesh"                                                       (*)     :
}

POST    {{origin}}/api/billing-info
```



### Order Routes
- GET 	{{origin}}/api/orders                                                           : Get all orders
- GET   {{origin}}/api/users/67986c8660c5024225bf3e76/orders                            : Get all orders of Single user
- GET   {{origin}}/api/users/me/orders                                                  : Get all orders of logedIn user

- POST 	{{origin}}/api/orders/cash-on-delivery                                          : To handle Cash On Delivery Order
- PATCH {{origin}}/api/orders/cash-on-delivery/:orderId                                 : Update cash-on-delivery order's status

- POST 	{{origin}}/api/orders/stripe-checkout                                          : To handle Stripe Order
- PATCH {{origin}}/api/orders/stripe-checkout/:orderId                                 : Update Stripe order's status

- POST 	{{origin}}/api/orders/sslcommerz/checkout                                       : To handle SSLCommerz Order
- PATCH {{origin}}/api/orders/sslcommerz/checkout/:orderId                              : Update SSLCommerz order's status


- GET 	{{origin}}/api/orders/:orderId                                    	        : Get single order
- PATCH {{origin}}/api/orders/:orderId                                    	        : Update order  : update any fields 
- DELETE {{origin}}/api/orders/:orderId                                   	        : Delete order  : 


##### Get Orders
```
{
  "status": "success",
  "total": 1,
  "count": 1,
  "data": [
    {
      "user": {
        "id": "67dcc58eb95576a3f75552b6",
        "name": "riajul islam",
        "email": "riajul@gmail.com",
        "phone": "01957500605",
        "_id": "67ecca1938e13412b77140a3"
      },
      "shippingInfo": {
        "id": "67e4fe760dffd77627618a40",
        "street": "mahfuza tower",
        "city": "dhaka",
        "country": "bangladesh",
        "_id": "67ecca1938e13412b77140a4"
      },
      "billingInfo": {
        "id": "67e4fe4a0dffd77627618a3e",
        "name": "riajul islam",
        "phone": "+8801957500605",
        "email": "riajul@gmail.com",
        "street": "mahfuza tower",
        "_id": "67ecca1938e13412b77140a5"
      },
      "products": [
        {
          "thumbnail": {
            "public_id": "8ce0f4ba-7430-4fdd-9bf8-a9e9e0d77929",
            "secure_url": "http://localhost:5000/upload/orders/71d821ea-f2ce-40d6-82f6-46df2e3e3d2e.png"
          },
          "id": "67ecca1938e13412b77140a6",
          "name": "test product 1",
          "skuCode": "asdfasdfafa24",
          "description": "description goes here",
          "quantity": 1,
          "price": 255,
          "vat": 0,
          "tax": 0,
          "color": "#3584e4",
          "size": "sm"
        },
        {
          "thumbnail": {
            "public_id": "8d0497af-40e8-4f82-b589-19aa8150517d",
            "secure_url": "http://localhost:5000/upload/orders/244e4ec8-e799-4971-a490-cf7102b65c77.png"
          },
          "id": "67ecca1938e13412b77140a7",
          "name": "blog name 2",
          "skuCode": "asdfasdfafa",
          "description": "<p>description <u>goes</u> <strong>here</strong></p>",
          "quantity": 10,
          "price": 255,
          "vat": 0,
          "tax": 0,
          "color": "#e66100",
          "size": "xl"
        }
      ],
      "paymentType": "cash_on_delivery",
      "nmCode": "NM202504021.1743571481002",
      "transactionId": "67ecca1938e13412b77140a1",
      "totalAmount": 715,
      "currency": "bdt",
      "status": "processing",
      "isPaid": false,
      "shippingCharge": 50,
      "discount": 50,
      "couponCode": "67e4fd17e696e9f54e16b214",
      "couponDiscount": 50,
      "createdAt": "2025-04-02T05:24:41.030Z",
      "updatedAt": "2025-04-02T05:25:21.072Z",
      "id": "67ecca1938e13412b77140a2"
    }
  ]
}
```

##### Create Cash-on-delivery

Cash On Delivery completed in 4 steps:

- Step-1: Customer create Order with details  => status: 'pending'
- Step-2: Admin make  => status: 'processing' 	and check products available: my communicate with saller
- Step-3: saller send product to courier and make  => status: 'shifted'
- Step-4: after delivery to customer courier-man will make  => status: 'deliveried'


###### Step-1: Customer create Order  
```
body {
  "products" : [
    {
      "product": "67e6782372a2e2bed010dc46",
      "quantity": 1,
      "color": "#3584e4",
      "size": "sm"
    },   
    {
      "product": "67e6787572a2e2bed010dc8d",
      "quantity": 2,
      "color": "#e66100",
      "size": "xl"
    }
  ],
  
  "currency" : "bdt",
  "shippingCharge": 50,
  "discount": 50,
  "couponCode": "67e4fd17e696e9f54e16b214",
  "shippingInfo" : "67e4fe760dffd77627618a40",
  "billingInfo" : "67e4fe4a0dffd77627618a3e"
}

POST 	{{origin}}/api/orders/cash-on-delivery 
```


###### Cash-on-delivery Response
```
{
  "status": "success",
  "data": {
    "user": {
      "id": "67dcc58eb95576a3f75552b6",
      "name": "riajul islam",
      "email": "riajul@gmail.com",
      "phone": "01957500605",
      "_id": "67ecca1938e13412b77140a3"
    },
    "shippingInfo": {
      "id": "67e4fe760dffd77627618a40",
      "street": "mahfuza tower",
      "city": "dhaka",
      "country": "bangladesh",
      "_id": "67ecca1938e13412b77140a4"
    },
    "billingInfo": {
      "id": "67e4fe4a0dffd77627618a3e",
      "name": "riajul islam",
      "phone": "+8801957500605",
      "email": "riajul@gmail.com",
      "street": "mahfuza tower",
      "_id": "67ecca1938e13412b77140a5"
    },
    "products": [
      {
        "id": "67ecca1938e13412b77140a6",
        "name": "test product 1",
        "skuCode": "asdfasdfafa24",
        "description": "description goes here",
        "quantity": 1,
        "price": 255,
        "color": "#3584e4",
        "size": "sm",
        "thumbnail": {
          "public_id": "8ce0f4ba-7430-4fdd-9bf8-a9e9e0d77929",
          "secure_url": "http://localhost:5000/upload/orders/71d821ea-f2ce-40d6-82f6-46df2e3e3d2e.png"
        }
      },
      {
        "id": "67ecca1938e13412b77140a7",
        "name": "blog name 2",
        "skuCode": "asdfasdfafa",
        "description": "<p>description <u>goes</u> <strong>here</strong></p>",
        "quantity": 10,
        "price": 255,
        "color": "#e66100",
        "size": "xl",
        "thumbnail": {
          "public_id": "8d0497af-40e8-4f82-b589-19aa8150517d",
          "secure_url": "http://localhost:5000/upload/orders/244e4ec8-e799-4971-a490-cf7102b65c77.png"
        }
      }
    ],
    "paymentType": "cash_on_delivery",
    "nmCode": "NM202504021.1743571481002",
    "transactionId": "67ecca1938e13412b77140a1",
    "totalAmount": 715,
    "currency": "bdt",
    "status": "pending",
    "isPaid": false,
    "shippingCharge": 50,
    "discount": 50,
    "couponCode": "67e4fd17e696e9f54e16b214",
    "couponDiscount": 50,
    "createdAt": "2025-04-02T05:24:41.030Z",
    "updatedAt": "2025-04-02T05:24:41.030Z",
    "id": "67ecca1938e13412b77140a2"
  }
}
```

##### Update order status
###### Step-2: Admin make => status: 'processing' and check products available: my communicate with saller  
###### Step-3: saller send product to courier and make  => status: 'shifted'  
###### Step-4: after delivery to customer courier-man will make  => status: 'deliveried'
```
PATCH   {{origin}}/api/orders/cash-on-delivery/:orderId
```


##### Stripe Payment Method

Stripe payment method will follow exactly 4 steps as cash-on-delivery method, just need stripe payment dialog in between.

- Step-1: Send payment details : same as Cash-on-delivery Step-1
- Step-2: Get stripe payment url as response 
- Step-3: Go throw that link to pay via `stripe checkout` url
- Step-4: Then update delivery process via `status` status 


###### Step-1: Send payment details : same as Cash-on-delivery Step-1
```
body {
  "products" : [
    {
      "product": "67e6782372a2e2bed010dc46",
      "quantity": 1,
      "color": "#3584e4",
      "size": "sm"
    },   
    {
      "product": "67e6787572a2e2bed010dc8d",
      "quantity": 2,
      "color": "#e66100",
      "size": "xl"
    }
  ],
  
  "currency" : "bdt",
  "shippingCharge": 50,
  "discount": 50,
  "couponCode": "67e4fd17e696e9f54e16b214",
  "shippingInfo" : "67e4fe760dffd77627618a40",
  "billingInfo" : "67e4fe4a0dffd77627618a3e"
}

POST 	{{origin}}/api/orders/stripe-checkout
```




###### Stripe Payment Success Response
```
{
  "status": "success",
  "message": "use stripe url to pay via stripe",
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_test_b1da4wmrm8V5HfYFIL5KY1K28Ow0DSJOW7lMUQLSM9DaWneDP4InxBYUyp#fidkdWxOYHwnPyd1blpxYHZxWjA0S2dnPDZCT049d2FrQ0JHfTNvSzN8U1dWYzBTdVFiPEtWTTxnMlNKR2lHQ0NKTn9SRklxNDFIMFdGdFQ9dWYyQ3BVXHc0fWJUVmxAVn82S2N3UTJoTGtANTVtaElicDI1TScpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPydocGlxbFpscWBoJyknYGtkZ2lgVWlkZmBtamlhYHd2Jz9xd3BgeCUl"
  }
}
```


###### Stripe Payment Cancel Response
```
{
  "status":"fialed",
  "message":"order cancelled"
}
```


###### Stripe Payment Success Response
```
{
  "status": "success",
  "message": "stripe payment transaction successfull!!!",
  "data": {
    "user": {
      "id": "67dcc58eb95576a3f75552b6",
      "name": "riajul islam",
      "email": "riajul@gmail.com",
      "phone": "01957500605",
      "_id": "67ecbd2b4ea85a8e16bb2cce"
    },
    "shippingInfo": {
      "id": "67e4fe760dffd77627618a40",
      "street": "mahfuza tower",
      "city": "dhaka",
      "country": "bangladesh",
      "_id": "67ecbd2b4ea85a8e16bb2ccf"
    },
    "billingInfo": {
      "id": "67e4fe4a0dffd77627618a3e",
      "name": "riajul islam",
      "phone": "+8801957500605",
      "email": "riajul@gmail.com",
      "street": "mahfuza tower",
      "_id": "67ecbd2b4ea85a8e16bb2cd0"
    },
    "products": [
      {
        "thumbnail": {
          "public_id": "8ce0f4ba-7430-4fdd-9bf8-a9e9e0d77929",
          "secure_url": "http://localhost:5000/upload/orders/2b37aa6b-78c7-41cf-9fb0-d49665ca8d37.png"
        },
        "id": "67ecbd2b4ea85a8e16bb2cd1",
        "name": "test product 1",
        "skuCode": "asdfasdfafa24",
        "description": "description goes here",
        "quantity": 1,
        "price": 255,
        "color": "#3584e4",
        "size": "sm"
      },
      {
        "thumbnail": {
          "public_id": "8d0497af-40e8-4f82-b589-19aa8150517d",
          "secure_url": "http://localhost:5000/upload/orders/dae2cea5-5cf4-43f8-8f58-e8538fa344f7.png"
        },
        "id": "67ecbd2b4ea85a8e16bb2cd2",
        "name": "blog name 2",
        "skuCode": "asdfasdfafa",
        "description": "<p>description <u>goes</u> <strong>here</strong></p>",
        "quantity": 10,
        "price": 255,
        "color": "#e66100",
        "size": "xl"
      }
    ],
    "paymentType": "STRIPE",
    "nmCode": "NM202504022.1743568169500",
    "transactionId": "67ecbd294ea85a8e16bb2ccc",
    "totalAmount": 715,
    "currency": "bdt",
    "status": "pending",
    "isPaid": true,
    "shippingCharge": 50,
    "discount": 50,
    "couponCode": "67e4fd17e696e9f54e16b214",
    "couponDiscount": 0,
    "createdAt": "2025-04-02T04:29:31.891Z",
    "updatedAt": "2025-04-02T04:30:17.544Z",
    "id": "67ecbd2b4ea85a8e16bb2ccd"
  }
}
```


##### Update checkout order's status
###### Step-2: Admin make => status: 'processing' and check products available: my communicate with saller  
###### Step-3: saller send product to courier and make  => status: 'shifted'  
###### Step-4: after delivery to customer courier-man will make  => status: 'deliveried'
```
PATCH   {{origin}}/api/orders/stripe-checkout/:orderId
```


##### SSLCommerz Payment Method

SSLCommerz payment method will follow exactly 4 steps as cash-on-delivery method, just need stripe payment dialog in between.

- Step-1: Send payment details : same as Cash-on-delivery Step-1
- Step-2: Get stripe payment url as response 
- Step-3: Go throw that link to pay via `SSLCommerz checkout` url
- Step-4: Then update delivery process via `status` status 


###### Step-1: Send payment details : same as Cash-on-delivery Step-1
```
body {
  "products" : [
    {
      "product": "67e6782372a2e2bed010dc46",
      "quantity": 1,
      "color": "#3584e4",
      "size": "sm"
    },   
    {
      "product": "67e6787572a2e2bed010dc8d",
      "quantity": 2,
      "color": "#e66100",
      "size": "xl"
    }
  ],
  
  "currency" : "bdt",
  "shippingCharge": 50,
  "discount": 50,
  "couponCode": "67e4fd17e696e9f54e16b214",
  "shippingInfo" : "67e4fe760dffd77627618a40",
  "billingInfo" : "67e4fe4a0dffd77627618a3e"
}

POST 	{{origin}}/api/orders/sslcommerz/checkout
```


###### SSLCommerz Payment Success Response
```
{
  "status": "success",
  "message": 'use sslCommerz url to pay via sslCommerz',
  "data": {
    "url": "https://sandbox.sslcommerz.com/EasyCheckOut/testcdef0c824b8d2d5c11c4d849829b2c730c4"
  }
}
```


###### SSLCommerz Payment Cancel Response
```
{
  "status":"fialed",
  "message":"order cancelled"
}
```


###### SSLCommerz Payment Success Response
```
{
  "status": "success",
  "message": "sslcommerz payment transaction successfull!!!",
  "data": {
    "user": {
      "id": "67dcc58eb95576a3f75552b6",
      "name": "riajul islam",
      "email": "riajul@gmail.com",
      "phone": "01957500605",
      "_id": "67ecc81349b8b9d0263b7fc0"
    },
    "shippingInfo": {
      "id": "67e4fe760dffd77627618a40",
      "street": "mahfuza tower",
      "city": "dhaka",
      "country": "bangladesh",
      "_id": "67ecc81349b8b9d0263b7fc1"
    },
    "billingInfo": {
      "id": "67e4fe4a0dffd77627618a3e",
      "name": "riajul islam",
      "phone": "+8801957500605",
      "email": "riajul@gmail.com",
      "street": "mahfuza tower",
      "_id": "67ecc81349b8b9d0263b7fc2"
    },
    "products": [
      {
        "thumbnail": {
          "public_id": "8ce0f4ba-7430-4fdd-9bf8-a9e9e0d77929",
          "secure_url": "http://localhost:5000/upload/orders/20f4b8eb-b8df-4b8c-9f73-3367e8f43184.png"
        },
        "id": "67ecc81349b8b9d0263b7fc3",
        "name": "test product 1",
        "skuCode": "asdfasdfafa24",
        "description": "description goes here",
        "quantity": 1,
        "price": 255,
        "color": "#3584e4",
        "size": "sm"
      },
      {
        "thumbnail": {
          "public_id": "8d0497af-40e8-4f82-b589-19aa8150517d",
          "secure_url": "http://localhost:5000/upload/orders/05e62c54-2f83-4f5f-a764-7bbe5b0e9c9e.png"
        },
        "id": "67ecc81349b8b9d0263b7fc4",
        "name": "blog name 2",
        "skuCode": "asdfasdfafa",
        "description": "<p>description <u>goes</u> <strong>here</strong></p>",
        "quantity": 10,
        "price": 255,
        "color": "#e66100",
        "size": "xl"
      }
    ],
    "paymentType": "SSLCOMMERZ",
    "nmCode": "NM202504021.1743570962878",
    "transactionId": "67ecc81249b8b9d0263b7fbe",
    "totalAmount": 715,
    "currency": "bdt",
    "status": "pending",
    "isPaid": true,
    "shippingCharge": 50,
    "discount": 50,
    "couponCode": "67e4fd17e696e9f54e16b214",
    "couponDiscount": 0,
    "createdAt": "2025-04-02T05:16:03.111Z",
    "updatedAt": "2025-04-02T05:16:23.076Z",
    "card_brand": "MOBILEBANKING",
    "card_type": "BKASH-BKash",
    "currency_amount": "715.00",
    "currency_type": "BDT",
    "store_amount": "697.13",
    "tran_date": "2025-04-02 11:16:03",
    "tran_id": "67ecc81249b8b9d0263b7fbe",
    "id": "67ecc81349b8b9d0263b7fbf"
  }
}
```


##### Update checkout order's status
###### Step-2: Admin make => status: 'processing' and check products available: my communicate with saller  
###### Step-3: saller send product to courier and make  => status: 'shifted'  
###### Step-4: after delivery to customer courier-man will make  => status: 'deliveried'
```
PATCH   {{origin}}/api/orders/sslcommerz/checkout/:orderId
```












### Subscribe Routes
- GET 	{{origin}}/api/subscribes                                                 	: 
- POST 	{{origin}}/api/subscribes                                                       : Add subscribe
- GET 	{{origin}}/api/subscribes/:subscribeId                                    	: Get single subscribeId
- PATCH {{origin}}/api/subscribes/:subscribeId                                    	: Update subscribeId
- DELETE {{origin}}/api/subscribes/:subscribeId                                   	: Delete subscribeId


##### Get Subscribes
```
{
  "status": "success",
  "count": 1,
  "total": 1,
  "data": [
    {
      "user": "67986cab60c5024225bf3e79",
      "email": "abc@gmail.com",
      "createdAt": "2025-02-22T08:44:03.846Z",
      "updatedAt": "2025-02-22T08:44:03.846Z",
      "id": "67b98e533bc78fa7f2965d0f"
    }
  ]
}
```

##### Create Subscribe
```
body {
  "email": "abc@gmail.com"                                          (*) :  
}

POST 	{{origin}}/api/subscribes
```


##### Update Subscribe
```
body {
  "email": "abc2@gmail.com"
}

PATCH 	{{origin}}/api/subscribes/:subscribeId
```






