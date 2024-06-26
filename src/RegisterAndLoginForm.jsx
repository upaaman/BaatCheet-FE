import { useContext, useState } from "react"
import axios from "axios";
import { UserContext } from "./UserContext";


export const Register = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [isLoginOrRegister, setIsloginOrRegister] = useState('login');


  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);



  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';
    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  }
  return (
    <div className="bg-blue-50 flex items-center h-screen">

      {/* --------login form --------- */}
      <form action=""
        onSubmit={handleSubmit}
        className="w-64 mx-auto mb-12 flex flex-col space-y-3">
          <h1 className=" mx-auto mb-6  text-blue-400 font-medium text-2xl">{isLoginOrRegister.toLocaleUpperCase()}</h1>
        <input type="text"
          required 
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full rounded p-2 mb-2 border" />

        <input type="password"
          value={password}
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded p-2 mb-2 border" />

        <button
          className="bg-blue-500 text-white block w-full rounded-sm p-2 "
          type="submit">
          {
            isLoginOrRegister === 'register' ? "Register" : "Login"
          }
        </button>
        {
          isLoginOrRegister === 'register' ?
            <div className="space-x-3 mt-2 text-md flex items-center justify-center">
              <span>Already a member? </span>
              <button className="text-blue-400 cursor-pointer"
              onClick={()=>setIsloginOrRegister('login')}>
                Login
              </button>

            </div> :
            <div className="space-x-3 mt-2 text-md flex items-center justify-center">
              <span>Our new member? </span>
              <button className="text-blue-400 cursor-pointer"
              onClick={()=>setIsloginOrRegister('register')}>
                Register
              </button>

            </div>
        }

      </form>
    </div>
  )
}
