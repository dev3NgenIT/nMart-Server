import type { Model } from 'mongoose'
import type { ProductDocument } from '@/types/product'
import type { Image } from '@/types/common'
import { model, Schema } from 'mongoose'
import { Collection } from '@/types/constants'
import { sanitizeSchema } from '@/services/sanitizeService'
import slugify from 'slugify'
import { customTransform } from '@/lib/utils'

/*
{
  "user": "67986c8660c5024225bf3e76",
  "brand": "27986c8660c5024225bf3e56",
  "childCategory": "67986d9860c5024225bf3e8a",
  "name": "product with category 241, which is 3 images url + dataUrl",
  "skuCode" : "bt-h2ls3",
  "manufacturerCode" : "brand-name-h2ls3",
  
  "price": 800,
  "discount": "20",
  "vat" : "2",
  "tax" : "5",
  
	"coverPhoto": "https://...",
	"thumbnail": "https://...",
	"images": [
		"https://...",
		"data:image/jpg;...",
		"data:image/jpg;..."
	],
  
  "color" : "blue",
  "size" : "lg",
  "specification": "product details goes here...",
  "metadata": {
		"title": "title goes here",
		"description": "description goes here",
		"keywords": ["keyword1", "keyword2"]
  }
}
*/


const imageSchema = new Schema<Image>({
	public_id: {
		type: String,
		required: true,
	},
	secure_url: {
		type: String,
		required: true,
	}
})
imageSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
		customTransform(ret, ['images'] )
  },
})


const productSchema = new Schema<ProductDocument>({
	user: {
		type: Schema.Types.ObjectId,
		ref: Collection.User,
		required: true
	},
	brand: {
		type: Schema.Types.ObjectId,
		ref: Collection.Brand,
		required: true
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: Collection.Category,
		// required: true
	},
	subCategory: {
		type: Schema.Types.ObjectId,
		ref: Collection.SubCategory,
		// required: true
	},
	childCategory: {
		type: Schema.Types.ObjectId,
		ref: Collection.ChildCategory,
		required: true
	},

	skuCode: {
		type: String,
		required: true,
		trim: true,
		// lowercase: true,
		minlength: 3,
		maxlength: 30,
		unique: true,
	},
	manufacturerCode: {
		type: String,
		// required: true,
		trim: true,
		// lowercase: true,
		minlength: 3,
		maxlength: 30,
		unique: true,
	},
	name: {
		type: String,
		required: true,
		trim: true,
		// lowercase: true,
		minlength: 4,
		maxlength: 255,
		unique: true,
	},
	slug: { 							// create from name property via pre('save') hook 
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		default: '',
		set: function (slug: string) { return slugify(slug, { lower: true }) }
	},

	price: {
		type: Number,
		required: true,
		min: 0,
		max: 99999999
	},
	discount: {
		type: Number,
		min: 0,
		max: 99999999,
		default: 0,
		// validate: function (this: ProductDocument, discount: number) {
		// 	return discount <= this.price  		// discount greater than or equal, than failed
		// },

		validate: {
			validator: function (this: ProductDocument, discount: number) {
				return discount <= this.price  		// discount greater than or equal, than failed
			},
			// message: `discount price can't be more than origin price`
			message: (props) => `${props.path} price (${props.value}) can't be more than origin price`
		}
	},
	quantity: {
		type: Number,
		min: 0,
		// max: 99,
	},
	vat: {
		type: Number,
		minlength: 0,
		maxlength: 90,
		default: 0,
		validate: {
			validator: function (this: ProductDocument, vat: number) { return vat <= this.price },
			message: (props) => `${props.path} price (${props.value}) can't be more than origin price`
		}
	},
	tax: {
		type: Number,
		minlength: 0,
		maxlength: 90,
		default: 0,
		validate: {
			validator: function (this: ProductDocument, tax: number) { return tax <= this.price },
			message: (props) => `${props.path} price (${props.value}) can't be more than origin price`
		}
	},

	coverPhoto: {
		public_id: String,
		secure_url: String,
	},
	thumbnail: {
		public_id: String,
		secure_url: String,
	},
	images: [imageSchema],

	stock: {
		type: Number,
		min: 0
	},

  color: {
    type: String,
    trim: true,
		lowercase: true
  },

  // // Array of available colors
  // colors: [{
  //   type: String,
  //   required: true,
  //   trim: true,
	// 	lowercase: true
  // }],

  // // Array of price variations based on color
  // colorsPrice: [{
  //   color: {
  //     type: String,
  //     required: true,
  //     trim: true,
  //     // Ensure the color exists in the colors array
  //     // validate: {
  //     //   validator: function(value) {
  //     //     return this.colors.includes(value)
  //     //   },
  //     //   message: 'Color must be one of the available colors'
  //     // },
  //   },
  //   price: {
  //     type: Number,
  //     required: true,
  //     min: 0
  //   },
  // }],

  colors: [{
    color: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
  }],

	size: {
		type: String,
		trim: true,
		lowercase: true,
		minlength: 1,
		maxlength: 30,
		// unique: true,
	},

	description: {
		type: String,
		trim: true,
		lowercase: true,
		// minlength: 3,
		maxlength: 100000,
		// unique: true,
	},
	specification: {
		type: String,
		// required: true,
		trim: true,
		lowercase: true,
		// minlength: 3,
		// maxlength: 30,
		// unique: true,
	},
	metadata: {
		title: {
			type: String,
			trim: true,
			lowercase: true,
			// minlength: 3,
			// maxlength: 300,
		},
		description: {
			type: String,
			trim: true,
			// lowercase: true,
			// minlength: 3,
			// maxlength: 600,
			// unique: true,
		},
		keywords: [{
			type: String,
			trim: true,
			lowercase: true,
			// minlength: 3,
			// maxlength: 30,
			// unique: true,
		}],
	},

	flashSale: {
		discount: {
			type: String,
			// required: true,
			trim: true,
		},
		label: {
			type: String,
			trim: true,
			lowercase: true,
			maxlength: 100,
			default: 'sale'
		}
	}

}, {
	timestamps: true,
	toJSON: {
		// virtuals: true, 										

		transform(_doc, ret, _options) {
			const images = ['coverPhoto', 'thumbnail', 'images']
			customTransform(ret, images )
		},
	}
})


productSchema.plugin(sanitizeSchema)

productSchema.pre('save', function(next) {
	this.price = +this.price 								// convert to number
	this.discount = +this.discount
	this.vat = +this.vat
	this.tax = +this.tax

	const slugString = this.slug.trim() ? this.slug : this.name
	this.slug = slugify(slugString, { lower: true })

	next()
})


// => use constansts
const Product = model<ProductDocument, Model<ProductDocument>>(Collection.Product, productSchema)
export default Product

