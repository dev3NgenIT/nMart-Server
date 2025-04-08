import type { RequestHandler } from 'express'
import type { ResponseData } from '@/types/common'
import type { BlogDocument } from '@/types/blog'
import { appError, catchAsync } from '@/controllers/errorController'
import { apiFeatures } from '@/lib/utils'
import { promisify } from 'node:util'
import * as fileService from '@/services/fileService'
import * as blogDtos from '@/dtos/blogDtos'
import Blog from '@/models/blogModel'
import { isValidObjectId } from 'mongoose'


// GET /api/blogs
export const getBlogs: RequestHandler = catchAsync( async (req, res, next) => {
	let filter = {}
	const { query, total } = await apiFeatures(Blog, req.query, filter)
	const blogs = await query
	
	const responseData: ResponseData<BlogDocument[]> = {
		status: 'success',
		count: blogs.length,
		total,
		data: blogs,
	}
	res.status(200).json( responseData )
})


// POST 	/api/blogs
export const addBlog: RequestHandler =  async (req, res, next) => {
	try {
		if(req.body.banner) {
			const { error, image: banner } = await fileService.uploadFile(req.body.banner, '/blogs')
			if(error) return next(appError(`blog logo upload error: ${error}`))

			req.body.banner = banner
		}

		const filteredBody = blogDtos.filterBodyForCreateBlog(req.body)
		const blog = await Blog.create(filteredBody)
		if(!blog) return next(appError('blog not found'))


		const responseData: ResponseData = {
			status: 'success',
			data: blog,
		}
		res.status(201).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.banner?.secure_url) promisify(fileService.removeFile)(req.body.banner.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
}

// GET /api/blogs/:blogId
export const getBlogByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const blogId = req.params.blogId
	// const filter = { _id: blogId }
	const filter = (isValidObjectId(blogId)) ?  { _id: blogId } : { slug: blogId }

	const blog = await Blog.findOne(filter)
	if(!blog) return next(appError('blog not found'))
	
	const responseData: ResponseData<BlogDocument> = {
		status: 'success',
		data: blog
	}
	res.status(200).json( responseData )
})


// PATCH /api/blogs/:blogId
export const updateBlogByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	try {
		const blogId = req.params.blogId
		// const blog = await Blog.findById(blogId)
		// const filter = { _id: blogId }
		const filter = (isValidObjectId(blogId)) ?  { _id: blogId } : { slug: blogId }

		const blog = await Blog.findOne(filter)
		if(!blog) return next(appError('blog not found'))


		if(req.body.banner) {
			const { error, image: banner } = await fileService.uploadFile(req.body.banner, '/blogs')
			if(error) return next(appError(`blog banner upload error: ${error}`))

			req.body.banner = banner
		}

		const filteredBody = blogDtos.filterBodyForUpdateBlog(req.body)
		const updatedCategory = await Blog.findByIdAndUpdate(blogId, filteredBody, { new: true })
		if(!updatedCategory) return next(appError('blog update failed'))


		if(req.body.banner) {
			req.body.banner = blog.banner 	
			
			setTimeout(() => {
				if(blog.banner?.secure_url) promisify(fileService.removeFile)(blog.banner.secure_url)
			}, 1000)
		}

		const responseData: ResponseData<BlogDocument> = {
			status: 'success',
			data: updatedCategory
		}

		res.status(200).json( responseData )

	} catch (err: unknown) {
		setTimeout(() => {
			if(req.body.banner?.secure_url) promisify(fileService.removeFile)(req.body.banner.secure_url)
		}, 1000)

		if(err instanceof Error) next(appError(err.message, 400, 'error'))
		if(typeof err === 'string') next(appError(err, 400, 'error'))
	}
})


// DELETE /api/blogs/:blogId
export const deleteBlogByIdOrSlug:RequestHandler = catchAsync(async (req, res, next) => {
	const blogId = req.params.blogId
		const filter = (isValidObjectId(blogId)) ?  { _id: blogId } : { slug: blogId }

	const blog = await Blog.findOneAndDelete(filter)
	if(!blog) return next(appError('blog not found'))

	// delete existing image if have
	setTimeout(() => {
		if(blog.banner?.secure_url) promisify(fileService.removeFile)(blog.banner.secure_url)
	}, 1000)


	const responseData: ResponseData<BlogDocument> = {
		status: 'success',
		data: blog
	}
	res.status(200).json( responseData )
})