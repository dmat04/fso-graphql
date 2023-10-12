import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommendations = ({ user }) => {
  const result = useQuery(ALL_BOOKS, { variables: { genre: user.favouriteGenre } })

  if (result.loading) {
    return <div>loading books...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>Recommendations</h2>
      <div>
        Books in your favourite genre <strong>{user.favouriteGenre}</strong>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {
            books.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
