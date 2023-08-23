import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useState } from 'react'

const BirthYearForm = () => {
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => console.log(error)
  })

  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')

  const submit = (event) => {
    event.preventDefault()

    editAuthor({ variables: { name: author, birthYear: parseInt(year) } })

    setAuthor('')
    setYear('')
  }

  return (
    <form onSubmit={submit}>
      <div>
        name <input value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        born <input value={year} onChange={({ target }) => setYear(target.value)} />
      </div>
      <button type="submit">update author</button>
    </form>
  )
}

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>loading authors...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br/>
      <h2>Set birthyear</h2>
      <BirthYearForm />
    </div>
  )
}

export default Authors
