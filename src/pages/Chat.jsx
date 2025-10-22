import React, {useEffect, useState, useRef} from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Chat(){
  const [messages,setMessages]=useState([])
  const [text,setText]=useState('')
  const socketRef = useRef(null)
  const nav = useNavigate()
  const username = localStorage.getItem('username')
  const token = localStorage.getItem('token')
  const messagesRef = useRef()

  useEffect(()=>{
    if(!token) return nav('/login')
    // fetch existing messages
    axios.get(API + '/messages').then(r=>setMessages(r.data)).catch(()=>{})
    // connect socket with auth token
    const socket = io(API, { auth: { token }})
    socketRef.current = socket
    socket.on('connect_error', (err)=> {
      console.error('socket connect error', err.message)
      if(err.message.includes('invalid') || err.message.includes('no token')) {
        alert('Неавторизованный сокет — пожалуйста, войдите снова')
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        nav('/login')
      }
    })
    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg])
      // scroll
      setTimeout(()=> messagesRef.current && (messagesRef.current.scrollTop = messagesRef.current.scrollHeight),50)
    })
    return ()=> socket.disconnect()
  }, [])

  async function send(){
    if(!text.trim()) return
    socketRef.current.emit('send_message', { content: text })
    setText('')
  }

  function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    nav('/login')
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div className="container" style={{maxWidth:1000}}>
        <div className="sidebar">
          <div className="brand">Minimal Messenger</div>
          <div className="small">Пользователь: <b>{username}</b></div>
          <div style={{height:12}}></div>
          <div className="users">
            <div className="user">Общий чат — все друзья</div>
          </div>
          <button className="btn" onClick={logout}>Выйти</button>
        </div>

        <div className="main">
          <div className="header">
            <div>Общий чат</div>
            <div className="small">Лёгкий и приватный</div>
          </div>

          <div className="messages" ref={messagesRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={'message ' + (m.sender === username ? 'me' : 'other')}>
                <div style={{fontWeight:600, marginBottom:6, fontSize:13}}>{m.sender}</div>
                <div>{m.content}</div>
                <div className="message-time">{new Date(m.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="input-area">
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Напиши сообщение..." onKeyDown={e=>{ if(e.key==='Enter') send() }} />
            <button className="btn" onClick={send}>Отправить</button>
          </div>
        </div>
      </div>
    </div>
  )
}
