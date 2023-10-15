import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


const Logout = ({ setToken, tokenStorageKey }) => {
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem(tokenStorageKey)
    setToken(null)
    navigate('/', { replace: true })
  }, [])

  return null
}

export default Logout