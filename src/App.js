import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { Link, Navigate, Route, Routes } from 'react-router-dom'

const linkStyle = {
  padding: '5px',
  margin: '5px',
  border: '1px solid black',
  borderRadius: '5px',
  textDecoration: 'none',
  color: 'black',
}

const App = () => {
  return (
    <div>
      <div>
        <Link style={linkStyle} to='/authors'>Authors</Link>
        <Link style={linkStyle} to='/books'>Books</Link>
        <Link style={linkStyle} to='/add'>Add book</Link>
      </div>
      <br/>
      <Routes>
        <Route path='/' element={<Navigate replace to='/authors' />} />
        <Route path='/authors' element={<Authors />} />
        <Route path='/books' element={<Books />} />
        <Route path='/add' element={<NewBook />} />
      </Routes>
    </div>
  )
}

export default App
