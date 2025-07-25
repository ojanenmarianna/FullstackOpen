const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { mongoose } = require('mongoose')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message))

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
    Author: {
      bookCount: async (root) => {
        return Book.countDocuments({ author: root._id })
      }
    },

    Query: {
      bookCount: async () => Book.countDocuments({}),
      authorCount: async () => Author.countDocuments({}),
      allBooks: async (root, args) => {
        let filter = {}
        if (args.genre) {
          filter.genres = { $in: [args.genre] }
        }
    
        let books = await Book.find(filter).populate('author')
    
        if (args.author) {
          books = books.filter(b => b.author.name === args.author)
        }
    
        return books
      },
      allAuthors: async () => Author.find({}),
      me: (root, args, context) => context.currentUser
    },
  
    Mutation: {
      createUser: async (root, args) => {
        const user = new User({ ...args })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
        }

        return user
      },

      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })

        if (!user || args.password !== 'secret') {
            throw new GraphQLError('Wrong credentials', {
            extensions: {
                code: 'BAD_USER_INPUT'
            }
            })
        }

        const userForToken = {
            username: user.username,
            id: user._id,
        }

        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      },

      addBook: async (root, args, context) => {
        console.log('addBook called with args:', args)
        console.log('currentUser:', context.currentUser)
        if (!context.currentUser) {
          throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
          })
        }
        let author = await Author.findOne({ name: args.author })
        
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
        
        const book = new Book({ ...args, author: author._id })
        await book.save()
        return book.populate('author')
      },

      editAuthor: async (root, args, context) => {
        if (!context.currentUser) {
          throw new GraphQLError('Not authenticated', {
            extensions: { code: 'UNAUTHENTICATED' }
          })
        }
        const author = await Author.findOne({ name: args.name })
        if (!author) return null
    
        author.born = args.setBornTo
        await author.save()
        return author
      },
    }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req?.headers?.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})
