/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Schema } from 'mongoose'
import sanitizeHtml from 'sanitize-html'


// Recursively sanitize object
export const sanitizeObject = (obj: any, visited = new Set(), depth = 0, maxDepth = 5): void  => {
  // Prevent infinite recursion due to circular references
  if (visited.has(obj)) return;
  visited.add(obj)

  // Prevent excessive recursion depth
  if (depth > maxDepth) return;

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeHtml(obj[key], {
        allowedTags: [], // Remove all HTML tags
        allowedAttributes: {}, // Remove all HTML attributes
      }).trim()
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item: string | null, index: string | number) => {
        if (typeof item === 'string') {
          obj[key][index] = sanitizeHtml(item, {
            allowedTags: [], // Remove all HTML tags
            allowedAttributes: {}, // Remove all HTML attributes
          }).trim()
        } else if (typeof item === 'object' && item !== null) {
          sanitizeObject(item, visited, depth + 1, maxDepth)
        }
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key], visited, depth + 1, maxDepth)
    }
  })
}

// Apply sanitization as a pre-save hook for Mongoose schema
export const sanitizeSchema = (schema: Schema): void => {
  schema.pre('save', function (next) {
    sanitizeObject(this._doc)  							// `this._doc` is the raw document object
    next()
  })
}
