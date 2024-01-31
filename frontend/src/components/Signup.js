import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [inputs,setInputs] = useState({
        name:"",
        email:"",
        password:""
    })
    const history = useNavigate()
    const handleChange = (e) =>{
        setInputs(prev =>({
            ...prev,
            [e.target.name] : e.target.value
        }))
        // console.log([e.target.name],"value" ,[e.target.value]) //to check whether it changing values or not
    }

    const sendRequest = async() =>{
        const res = await axios.post("http://localhost:5000/api/signup",{
            name: inputs.name,
            email : inputs.email,
            password : inputs.password
        })
        .catch(err=>console.log(err))
        const data = await res.data
        return data
    }

    const handledSubmit = (e) =>{
        e.preventDefault();
        console.log(inputs)
        //post details to backend using axios
        sendRequest()
        .then(()=>history('/login'))
    }
  return (
    <div>
      <form onSubmit={handledSubmit} method='POST'>
        <Box marginLeft={"auto"} marginRight={"auto"} width={300} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
            <Typography variant='h2'>Signup</Typography>
            <TextField onChange={handleChange} value={inputs.name} name='name' type='text' variant='outlined' placeholder='Name' margin='normal' autoComplete='on'/>
            <TextField onChange={handleChange} value={inputs.email} name="email" type='email' variant='outlined' placeholder='Email' margin='normal' autoComplete='on'/>
            <TextField onChange={handleChange} value={inputs.password} name="password" type='password' variant='outlined' placeholder='Password' margin='normal' autoComplete='on'/>
            <Button type='submit' variant='contained'>Signup</Button>
        </Box>
      </form>
    </div>
  )
}

export default Signup
