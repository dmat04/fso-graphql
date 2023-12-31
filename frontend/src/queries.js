import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    id
    name
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query allBooks($genre: String) {
  allBooks(genre: $genre) {
    id
    title
    author {
      id
      born
      name
    }
    published
    genres
  }
}
`

export const ALL_GENRES = gql`
query {
  allGenres
}
`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    id
    title
    author {
      id
      name
      born
    }
    published
    genres
  }
}
`

export const DELETE_BOOK = gql`
mutation deleteBook($id: ID!) {
  deleteBook(id: $id)
}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $birthYear: Int!) {
  editAuthor(name: $name, setBornTo: $birthYear) {
    id
    name
    born
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

export const ME = gql`
query {
  me {
    id
    username
    favouriteGenre
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    id
    title
    author {
      id
      name
      born
    }
    published
    genres
  }
}
`