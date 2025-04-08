import type { Document, Model, Query as MongooseQuery } from 'mongoose';


/*
	{{origin}}/api/products
		?_page=2
		&_limit=3
		&_sort=-createdAt,user
		&_search= riajul,email,name 																		// find text 'riajul' in email, or name or ... any of  field
		&_fields=name,price,createdAt
		&_filter[color]=blue 																						// to find product by it's property as key, and value

		&_filter[price]=300 																						// find price with exact value
		&_range[price]=700&_range[price]=800 														// find by price range 	
		&_range[createdAt]=2025-02-07&_range[createdAt]=2025-02-08 			// find by date range 	: year-month-date



  const { query, total } = await apiFeatures(Category, req.query, filter)
  const categories = await query

  res.status(200).json({
    status: 'success',
    count: categories.length,
    total,
    data: categories,
	})
*/

type Query = {
  _page?: string;
  _limit?: string;
  _sort?: string;
  _fields?: string;
  _search?: string;
  _filter?: Record<string, any>;
  _range?: Record<string, string | string[]>;
};

type ApiFeaturesResponse<T extends Document> = {
  query: MongooseQuery<T[], T>;
  total: number;
};

type ApiFeatures<T extends Document> = {
  (Model: Model<T>, query: Query, newFilter?: Record<string, any>): Promise<ApiFeaturesResponse<T>>;
};

export const apiFeatures: ApiFeatures<any> = async (Model, query, newFilter = {}) => {
  const page = +(query._page || 1);
  const limit = +(query._limit || 20);
  const skip = page <= 0 ? 0 : (page - 1) * limit;

  const sort = query._sort?.toString().trim().split(',').join(' ') || 'createdAt';
  const select = query._fields?.toString().trim().split(',').join(' ') || '-_v';

  // Search functionality
  const search = query._search?.toString().trim().split(',') || ['', ''];
  const [searchValue, ...searchFields] = search;
  let searchObj: Record<string, any> = {
    "$or": searchFields.map((field: string) => ({
      [field]: { "$regex": searchValue, "$options": "i" }
    }))
  };
  searchObj = search[1] ? searchObj : {};

  const _filter = { ...query._filter, ...newFilter };

  // Handle dynamic range filters (price, date, etc.)
  const rangeFilters: Record<string, any> = {};

  if (query._range) {
    Object.entries(query._range).forEach(([key, value]) => {
      const values = Array.isArray(value) ? value : [value]; // Ensure it's always an array

      if (key === "createdAt") {
        // Ensure start and end of the day for date filtering
        const dateValues = values.map((v) => {
          const date = new Date(v);
          return {
            start: new Date(date.setUTCHours(0, 0, 0, 0)),  // Start of the day
            end: new Date(date.setUTCHours(23, 59, 59, 999)) // End of the day
          };
        });

        const minDate = dateValues[0]?.start;
        const maxDate = dateValues[1]?.end;

        if (minDate && maxDate) rangeFilters[key] = { "$gte": minDate, "$lte": maxDate };
        else if (minDate) rangeFilters[key] = { "$gte": minDate };
        else if (maxDate) rangeFilters[key] = { "$lte": maxDate };
      } else {
        // Handle numeric range (e.g., price)
        const numericValues = values.map(Number);
        const minNum = numericValues[0] ?? null;
        const maxNum = numericValues[1] ?? null;

        if (minNum !== null && maxNum !== null) rangeFilters[key] = { "$gte": minNum, "$lte": maxNum };
        else if (minNum !== null) rangeFilters[key] = { "$gte": minNum };
        else if (maxNum !== null) rangeFilters[key] = { "$lte": maxNum };
      }
    });
  }

  // Merge all filters
  const filter = { ...searchObj, ..._filter, ...rangeFilters };

  // Calculate the total count
  const total = await Model.countDocuments(filter);

  // Return the Mongoose query object and the total count
  const queryObj = Model.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(select);

  return { query: queryObj, total };
}


/* Example: GET /api/categories

export const getCategories: RequestHandler = catchAsync(async (req, res, next) => {
  let filter = {};
  const { query, total } = await apiFeatures(Category, req.query, filter);

  const categories = await query;

  const responseData: ResponseData<CategoryDocument[]> = {
    status: 'success',
    count: categories.length,
    total,
    data: categories,
  };

  res.status(200).json(responseData);
});
*/