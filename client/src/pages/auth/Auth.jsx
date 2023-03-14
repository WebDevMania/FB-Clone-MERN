import React from 'react'
import classes from './auth.module.css'
import { useState } from 'react'
import { request } from '../../util/request'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../../redux/authSlice'

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()


    try{

        if(isRegister){
            if(username === '' || email === '' || password === '') {
                setError("Fill all fields!")
                setTimeout(() => {
                    setError(false)
                }, 2500)
                return
            }
            
            const headers = {'Content-Type': 'application/json'}
            const body = {username, email, password}
            const data = await request('/auth/register', 'POST', headers, body)
            
            console.log(data)
            dispatch(register(data))
            navigate('/')
        } else {
            if(email === '' || password === '') {
                setError("Fill all fields!")
                setTimeout(() => {
                    setError(false)
                }, 2500)
                return
            }
            
            const headers = {'Content-Type': 'application/json'}
            const body = {email, password}
            const data = await request('/auth/login', 'POST', headers, body)
            dispatch(login(data))
            navigate('/')
        }
    } catch(error){
        console.error(error)
    }
  }

  return (
    <div className={classes.container}>
        <div className={classes.wrapper}>
            <div className={classes.left}>
                <h1>WebDevMania</h1>
                <p>Connect with your close friends and relatives now</p>
            </div>
            <form onSubmit={handleSubmit} className={classes.right}>
                {isRegister && <input type="text" placeholder='Type username...' onChange={(e) =>setUsername(e.target.value)}/>}
                <input type="email" placeholder='Type email...' onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder='Type password...' onChange={(e) => setPassword(e.target.value)}/>
                <button className={classes.submitBtn} type="submit">
                    {isRegister ? 'Register' : 'Login'}
                </button>
                {
                 isRegister 
                   ? <p onClick={() => setIsRegister(prev => !prev)}>Already have an account? Login</p> 
                   : <p onClick={() => setIsRegister(prev => !prev)}>Don't have an account? Register</p>
                }
            </form>
            {error && (
                <div className={classes.error}>
                    {error}
                </div>
            )}
        </div>
    </div>
  )
}

export default Auth