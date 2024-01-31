import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authActions } from '../store'

const Login = () => {
  const dispatch = useDispatch();
    const history = useNavigate()
    const [inputs,setInputs] = useState({
        email:"",
        password:""
    })
    const handleChange = (e) =>{
        setInputs(prev =>({
            ...prev,
            [e.target.name] : e.target.value
        }))
        // console.log([e.target.name],"value" ,[e.target.value]) //to check whether it changing values or not
    }

    const sendRequest = async() =>{
        const res = await axios.post("http://localhost:5000/api/login",{
            email : inputs.email,
            password : inputs.password
        }).then(async res=>{alert(res.data.message)
          const data = await res.data
          return data
        })
        
        .catch(err=>console.log(err))
        
    }

    const handledSubmit = (e) =>{
        e.preventDefault();
        console.log(inputs)
        //post details to backend using axios
        sendRequest()
        .then(()=>dispatch(authActions.login()))
        .then(()=>history('/user'))
    }
  return (
    <div>
      <form onSubmit={handledSubmit} method='POST'>
        <Box marginLeft={"auto"} marginRight={"auto"} width={300} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
            <Typography variant='h2'>Login</Typography>
            <TextField onChange={handleChange} value={inputs.email} name="email" type='email' variant='outlined' placeholder='Email' margin='normal' autoComplete='on'/>
            <TextField onChange={handleChange} value={inputs.password} name="password" type='password' variant='outlined' placeholder='Password' margin='normal' autoComplete='on'/>
            <Button type='submit' variant='contained'>Login</Button>
        </Box>
      </form>
    </div>
  )
}

export default Login

