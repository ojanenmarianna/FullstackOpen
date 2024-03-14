const _ = require('lodash')

const dummy = (blogs) => {
    if (blogs.length === 0) return 1

    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    const favorite = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })
  
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const blogsByAuthor = _.groupBy(blogs, 'author')
    const authorWithMostBlogs = _.maxBy(_.keys(blogsByAuthor), author => blogsByAuthor[author].length)

    return {
        author: authorWithMostBlogs,
        blogs: blogsByAuthor[authorWithMostBlogs].length
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const likesByAuthor = _.mapValues(_.groupBy(blogs, 'author'), authorBlogs =>
        _.sumBy(authorBlogs, 'likes')
    )
    const authorWithMostLikes = _.maxBy(_.keys(likesByAuthor), author => likesByAuthor[author])

    return {
        author: authorWithMostLikes,
        likes: likesByAuthor[authorWithMostLikes]
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}