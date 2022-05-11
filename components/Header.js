
import { AppBar, Button, Link, Toolbar, Typography } from '@mui/material'
import React from 'react'
import {Link as RouterLink,Router} from '../routes';

function Header() {
    return (
        <AppBar position="static" >
        <Toolbar>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Crowd Funding
          </Typography>
          <Typography variant="h6" component="div">
           
            <RouterLink route="/">
            
            <a style={{textDecoration:"none",color:"white",marginRight:"20px"}}>
            Campaigns
            </a>
            </RouterLink>
  

          </Typography>
          <RouterLink route="/campaigns/new">
          <Button color="inherit" size="small" variant="outlined">ADD</Button>
          </RouterLink>        
        </Toolbar>
      </AppBar>
    )
}

export default Header
