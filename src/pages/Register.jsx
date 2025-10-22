import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Register(){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    try{
      await axios.post(API + '/register',{username,password})
      nav('/login')
    }catch(err){
      setError(err.response?.data?.error || 'Ошибка')
    }
  }

  return (
    <div className="center-screen">
      <div className="form-center">
        <h2>Регистрация</h2>
        <form onSubmit={submit}>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Имя пользователя" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль" />
          <button className="btn" type="submit">Зарегистрироваться</button>
          <div className="small">Есть аккаунт? <Link to="/login">Войти</Link></div>
          {error && <div style={{color:'crimson'}}>{error}</div>}
        </form>
      </div>
    </div>
  )
}
