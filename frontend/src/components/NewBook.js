import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS, ALL_GENRES } from '../queries'
import { useNavigate } from 'react-router-dom'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const navigate = useNavigate()

  const [ addBook ] = useMutation(ADD_BOOK, {
    onError: (error) => console.log(error),
    onCompleted: () => navigate('/books')
  })

  const authorsQuery = useQuery(ALL_AUTHORS)
  if (authorsQuery.loading) {
    return <div>loading authors...</div>
  }

  const authors = authorsQuery.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    const authorObject = authors.find(a => a.name === author)

    addBook({ variables: { title, author: authorObject.id, published: parseInt(published), genres }})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook