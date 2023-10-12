import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import Logout from './components/Logout'
import { useLazyQuery } from '@apollo/client'
import { ME } from './queries'
import Recommendations from './components/Recommendations'

const linkStyle = {
  padding: '5px',
  margin: '5px',
  border: '1px solid black',
  borderRadius: '5px',
  textDecoration: 'none',
  color: 'black',
}

const App = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [getUser, status] = useLazyQuery(ME)

  useEffect(() => {
    setToken(localStorage.getItem(LOCALSTORAGE_TOKEN))
  }, [])

  useEffect(() => {
    if (token !== null && status.called === false) {
      getUser()
    }

    if (status.data) {
      setUser(status.data.me)
    }
  }, [token, status])

  return (
    <div>
      <div>
        <Link style={linkStyle} to='/authors'>Authors</Link>
        <Link style={linkStyle} to='/books'>Books</Link>
        {
          token &&
          <>
            <Link style={linkStyle} to='/recommendations'>Recommend</Link>
            <Link style={linkStyle} to='/add'>Add book</Link>
            <Link style={linkStyle} to='/logout'>Logout</Link>
          </>
        }
        {
          !token &&
          <Link style={linkStyle} to='/login'>Login</Link>
        }
      </div>
      <br />
      <Routes>
        <Route path='/' element={<Navigate replace to='/books' />} />
        <Route path='/authors' element={<Authors showForm={token !== null} />} />
        <Route path='/books' element={<Books />} />
        <Route path='/recommendations' element={<Recommendations user={user} />} />
        <Route path='/add' element={<NewBook />} />
        <Route path='/login' element={<LoginForm setToken={setToken} tokenStorageKey={LOCALSTORAGE_TOKEN} />} />
        <Route path='/logout' element={<Logout setToken={setToken} tokenStorageKey={LOCALSTORAGE_TOKEN} />} />
      </Routes>
    </div>
  )
}

export const LOCALSTORAGE_TOKEN = 'LIBRARYAPP_KEY_USER_TOKEN'
export default App
