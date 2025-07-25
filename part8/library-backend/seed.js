// Run once to populate the mongo database
require('dotenv').config()
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  await Author.deleteMany({})
  await Book.deleteMany({})

  const authors = [
    { name: 'Robert Martin', born: 1952 },
    { name: 'Martin Fowler', born: 1963 },
    { name: 'Fyodor Dostoevsky', born: 1821 },
    { name: 'Joshua Kerievsky' },
    { name: 'Sandi Metz' }
  ]

  const savedAuthors = {}
  for (const authorData of authors) {
    const author = new Author(authorData)
    const saved = await author.save()
    savedAuthors[saved.name] = saved
  }

  const books = [
    {
      title: 'Clean Code',
      published: 2008,
      author: 'Robert Martin',
      genres: ['refactoring']
    },
    {
      title: 'Agile software development',
      published: 2002,
      author: 'Robert Martin',
      genres: ['agile', 'patterns', 'design']
    },
    {
      title: 'Refactoring, edition 2',
      published: 2018,
      author: 'Martin Fowler',
      genres: ['refactoring']
    },
    {
      title: 'Crime and punishment',
      published: 1866,
      author: 'Fyodor Dostoevsky',
      genres: ['classic', 'crime']
    },
    {
      title: 'The Demon',
      published: 1872,
      author: 'Fyodor Dostoevsky',
      genres: ['classic', 'revolution']
    },
    {
      title: 'Refactoring to patterns',
      published: 2008,
      author: 'Joshua Kerievsky',
      genres: ['refactoring', 'patterns']
    },
    {
      title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
      published: 2012,
      author: 'Sandi Metz',
      genres: ['refactoring', 'design']
    }
  ]

  for (const bookData of books) {
    const author = savedAuthors[bookData.author]
    const book = new Book({ ...bookData, author: author._id })
    await book.save()
  }

  console.log('✅ Seeding complete')
  mongoose.connection.close()
}

seed()
