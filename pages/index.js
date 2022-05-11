import React,{useEffect,useState} from 'react'
import factory from '../ethereum/factory';
import Layout from '../components/Layout'
import { Container } from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Button, Card, CardActions, CardContent, Grid, Paper } from '@mui/material'
import {Link as RouterLink,Router} from '../routes';
const compiledCampaign = require('../ethereum/build/Campaign.json');
import web3 from '../ethereum/web3';


function CampaignIndex({campaigns}) {

console.log(campaigns)

const getCampaignInstance = async(camp)=>{
    let campInstance = await new web3.eth.Contract(
       compiledCampaign.abi,
        camp
    );

    return campInstance;
}

    return (
    
        <Layout>
        <h3>
               Open Campaigns
           </h3>
           <Grid container spacing={2}>
               <Grid item lg={10} sm={9}>
                   {
                       campaigns && campaigns.map((camp,index)=>{

                        // let  campaignInstance =getCampaignInstance(camp);

                           return  <Card style={{marginBottom:"25px"}}>
                           <CardContent>
                           {/* <p>
                            Title : <b>{ campaignInstance.methods && campaignInstance.methods.campaignTitle().call()}</b>
                           </p> */}
                                <p style={{fontSize:"1.25rem",fontWeight:"600",margin:"0 0 1rem 0"}}>Campaign {index+1}</p>
                           Address : <b>{camp}</b>
                           </CardContent>
       
                           <CardActions>
                           <RouterLink route={`/campaigns/${camp}`}>
                           <a style={{textDecoration:"none"}}>

                           
                           <Button variant="outlined" size="small" color="primary" >
                 View Details
                            </Button>
                            </a>
                            </RouterLink>
             </CardActions>
       
                           </Card>

                       })
                   }
                   
               </Grid>
               <Grid item lg={2} sm={3}>
               <RouterLink route="/campaigns/new">
                <Button variant="contained" startIcon={<AddCircleOutlinedIcon />}>
        Add Campaign
      </Button>
      </RouterLink>
               </Grid>
           </Grid>

        </Layout>
      
    )
}

export async function getStaticProps(){
    let campaigns = await factory.methods.getDeployedCampaigns().call();
    
    return {
        props:{
            campaigns

        }
       
    }
}

export default CampaignIndex
