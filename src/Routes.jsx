import React, { useContext } from 'react'
import { Register } from './RegisterAndLoginForm'
import { UserContext } from './UserContext';
import Chat from './Chat';

const Routes = () => {

    const {username}=useContext(UserContext);
  console.log("this is username",username)
  if(username) return <Chat/>
  return (
    <Register/>
   
  )
}

export default Routes