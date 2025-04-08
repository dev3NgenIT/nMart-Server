enum PostType {
  POST = 'post',
  PAGE = 'page',
  STORY = 'story',
  SERIES = 'series',
}

console.log(PostType.POST) 							// => 'post'
console.log(Object.values(PostType)) 		// => ['post', 'page', 'story', 'series']
