//imports
import {useEffect, useState, useReducer} from 'react'
import Gun from 'gun'
import faker from '@faker-js/faker'
import './App.css'

//remember the port number!
//init gun
const gun = Gun({
  peers: [
    'http://localhost:3000/gun'
  ]
})

//allows to hold messages
const initialState = {
  messages: []
}

//reducer edits the messages array
function reducer(state,message){
  return{
    messages: [message, ...state.messages]
  }
}

export default function App() {
  const [formState, setForm] = useState({
    user: '', 
    message: ''
  })
  //init reducer and initial state
  const[state, dispatch] = useReducer(reducer, initialState)
  
  useEffect(()=>{
    const messageStream = gun.get('messages')
    messageStream.map().on(m=>{
      dispatch({
        user: m.user,
        avatar: m.avatar,
        message: m.message,
        createdAt: m.createdAt
      })
    })
  },[])

  //duplicate message cleaning
  const newMessagesArray = () => {
    const formMessages = state.messages.filter((value, index) => {
      const _value = JSON.stringify(value)
      return(
        index ===
        state.messages.findIndex(item => JSON.stringify(item) === _value)
      )
    })
    return formMessages
  }

  //updates form state as you type
  function onChange(e){
    setForm({...formState, [e.target.user]: e.target.value})
  }

  function sendMessage() {
    const messages = gun.get('messages')
    //what's being sent:
    const messageObject = {
      user: faker.name.firstName(),
      avatar: faker.image.avatar(),
      message: formState.message,
      createdAt: Date().substring(16, 21)
    }
    messages.set(messageObject)
    setForm({ ...formState, message: '' })
  }

return(
  <div style={{padding:30}}>
    <input>
      onChange={onChange}
      placeholder="User"
      user="user"
      value={formState.name}
    </input>
    <input>
      onChange={onChange}
      placeholder="Message"
      user="message"
      value={formState.message}
    </input>
    <button onClick={sendMessage}>Send Message</button>
    {
      state.messages.map(message=>(
        <div key={message.createdAt}>
          <img src={message.avatar} alt="avatar" style={{width: 30, height: 30, borderRadius: '50%'}}/>
          <p>{message.user}: {message.message}</p>
          <small>{message.createdAt}</small>
        </div>
      ))
    }
  </div>
)
}