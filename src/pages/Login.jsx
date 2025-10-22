import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Login(){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    try{
      const res = await axios.post(API + '/login',{username,password})
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('username', user.username)
      nav('/chat')
    }catch(err){
      setError(err.response?.data?.error || 'Ошибка сети')
    }
  }

  return (
    <div className="center-screen">
      <div className="form-center">
        <h2>Вход</h2>
        <form onSubmit={submit}>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Имя пользователя" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль" />
          <button className="btn" type="submit">Войти</button>
          <div className="small">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></div>
          {error && <div style={{color:'crimson'}}>{error}</div>}
        </form>
      </div>
    </div>
  )
}
