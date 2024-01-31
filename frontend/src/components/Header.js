import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Box, Tabs, Tab } from "@mui/material"
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { authActions } from '../store'
axios.defaults.withCredentials = true
const Header = () => {
  const [value, setValue] = useState()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  const sendLogoutReq = async () => {
    const res = await axios.post("http://localhost:5000/api/logout", null, {
      withCredentials: true
    })
    if (res.status === 200) {
      return res
    }
    return new Error("Unable to Logout,Please try again")
  }
  const handleLogout = () => {
    sendLogoutReq()
      .then(() => dispatch(authActions.logout()))
  }
  return (
    <div>
      <AppBar position='sticky'>
        <Toolbar>
          <Typography variant='h3'>Mern Auth</Typography>
          <Box sx={{ marginLeft: 'auto' }}>
            <Tabs textColor='inherit' value={value} onChange={(e, val) => setValue(val)} indicatorColor='secondary'>
              {!isLoggedIn && <>
              <Tab to="/login" LinkComponent={Link} label="Login" />
              <Tab to="/signup" LinkComponent={Link} label="Signup" />
              </>} 
              {isLoggedIn && (
                <Tab onClick={handleLogout} to="/login" LinkComponent={Link} label="Logout" />
              )}{" "}
            </Tabs>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
