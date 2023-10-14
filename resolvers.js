const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      const query = Book.find({})

      if (args.author) {
        const author = await Author.findOne({ name: args.author})
        query.find({ 'author': author?.id })
      }
      
      if (args.genre) {
        query.find({ genres: args.genre })
      }
      
      return query.populate('author')
    },
    allAuthors: async (parent, args, context, info) => {
      const selectedFields = info.fieldNodes[0]?.selectionSet
      const includeBooks = selectedFields.selections.find(({ name }) => {
        return name.value === 'bookCount' || name.value === 'books'
      })

      const query = Author.find({})

      if (includeBooks) {
        query.populate('books')
      }

      return query
    },
    allGenres: async () => {
      const books = await Book.find({})
      const genreSet = new Set()

      books.forEach(b => {
        b.genres.forEach(g => genreSet.add(g))
      })

      return genreSet
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: (author) => {
      return author.books?.length
    }
  },
  Mutation: {
    addBook: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const author = await Author.findById(args.author)
      if (!author) {
        throw new GraphQLError('Saving book failed - author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        })
      }

      const book = new Book({ ...args })
      
      try {
        await book.save()
        author.books.push(book._id)
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      await book.populate('author')

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    deleteBook: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const result = await Book.deleteOne({ _id: args.id })

      return result.deletedCount === 1
    },
    editAuthor: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ 
        username: args.username, 
        favouriteGenre: args.favouriteGenre 
      })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extension: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extension: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers