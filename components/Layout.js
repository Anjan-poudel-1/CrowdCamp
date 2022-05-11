import { Container } from '@mui/material';
import React from 'react'
import Header from './Header.js';
function Layout(props) {
    return (
        <Container>
        <Header/>
        <div style={{marginTop:"30px"}}>
        {props.children}
        </div>
          
        </Container>
    )
}

export default Layout
