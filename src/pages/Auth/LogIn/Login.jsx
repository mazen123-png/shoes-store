import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../../components/Input/PasswordInput'
import { validateEmail } from '../../../utils/helper'
import axiosInstance from '../../../utils/axiosInstance'
import NavBar2 from '../../../components/NavBar/NavBar2'

const Login = () => {
  const navigate = useNavigate()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState(null)
  const handleLogin = async (e)=>{
    e.preventDefault()
    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!password){
      setError("Please enter the password");
      return;
    }
    setError("")
    // Login API Call

    try{
      const response = await axiosInstance.post('/login',{
        email:email,
        password:password
      })
      if(response.data && response.data.data.token && response.data.data.role === "ADMIN"){
        localStorage.setItem("token",response.data.data.token)
        localStorage.setItem("userId",response.data.data.userId)
        navigate('/admin/dashboard')
        return
      }
      if(!response.data.data.emailVerified){
        setError(`email verification sent! Please verify your email.`)
      }
      
      if(response.data && response.data.data.token && response.data.data.emailVerified){
        
        localStorage.setItem("token",response.data.data.token);
        localStorage.setItem("userId",response.data.data.userId)
        navigate('/dashboard')
        return;
      }
    }  
    catch(error){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("An unexpected error occurred. Please try again.")
      }
    } 
  };
  useEffect(()=>{
    localStorage.clear()
  },[])
  return (
    <>
      <NavBar2 />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form action="" onSubmit={handleLogin}>
            <h4 className='text-2xl mb-7 text-center'>Login</h4>
            <input 
              type="text" 
              placeholder='Email' 
              className='input-box'
              value={email}
              onChange={(e)=>setEmail(e.target.value)} 
            />
            <PasswordInput
              value={password}
              onChange={(e)=>setPassword(e.target.value)} 
            />
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button type='submit' className='btn-primary'>Login</button>

            <p className="text-sm text-center mt-4">
              Not registered yet? {" "}
              <Link to='/signup' className='font-medium text-blue-500 underline'>Create an Account</Link>
            </p>
            <p className="text-sm text-center mt-4">
              Forget Password? {" "}
              <Link to='/forgot-password' className='font-medium text-blue-500 underline'>Reset Now!</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
