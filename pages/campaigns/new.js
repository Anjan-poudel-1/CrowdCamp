import { Button, TextField } from '@mui/material'
import React,{useState} from 'react'
import Layout from '../../components/Layout';
 import factory from '../../ethereum/factory';
 import web3 from '../../ethereum/web3';

 import {Link,Router} from '../../routes';


function NewCampaign() {

const [errorText,setErrorText] = useState({
    minContribution:'',
    title:'',
    description:''
});
const [loading,setLoading] = useState(false);
const [inputValue,setInputValue] = useState({
    minContribution:'',
    title:'',
    description:''
});
const [errorDelivery,setErrorDelivery] = useState('');


const formSubmit = async()=>{

    let errCount = 0; 
    let tempErr = {...errorText}

    if(inputValue.minContribution<=0){
        errCount++;
        tempErr= {
            ...tempErr,
            minContribution:"Minimum contribution should be a positive number"
            }
    }
    else{
         tempErr= {
            ...tempErr,
            minContribution:""
            }
    }
    if(inputValue.title.length<=0){
        errCount++;
        tempErr= {
            ...tempErr,
            title:"Title should be provided"
            }
    }
    else{
         tempErr= {
            ...tempErr,
            title:""
            }
    }

    if( inputValue.description.length<=0){
        errCount++;
        tempErr= {
            ...tempErr,
            description:"Description should be provided"
            }
    }
    else{
         tempErr= {
            ...tempErr,
            description:""
            }
    }
    if(errCount>0){
        console.log(tempErr)
        setErrorText({
            ...tempErr
        })
    }
    else{
        setErrorText({
             minContribution:'',
    title:'',
    description:''
        })
        console.log("input---",inputValue);
        console.log("typof", typeof(inputValue))
        setLoading(true);
        const accounts = await web3.eth.getAccounts();
        const deployedCampaign = await factory.methods.createCampaign(inputValue.title,inputValue.description,web3.utils.toWei(inputValue.minContribution))
        .send({
            from:accounts[0]

        })
        .then(res=>{
            console.log("Successfully deployed");
            setErrorDelivery('');
            Router.pushRoute('/');
        }).catch(err=>{
            console.log("Could not deploy");
            setErrorDelivery(err);
        });
        setLoading(false);
        setErrorText('');
    }
};



    return (
        <Layout>
        <div>
            <h3>

            Create new Campaign
            </h3>

           
        <TextField
          error={errorText && errorText.title.length>0}
          id="outlined-error-helper-text"
          label="Campaign Title"
          style={{width:"390px"}}
          onChange={e=>setInputValue({
              ...inputValue,
             title: e.target.value})}
          value={inputValue.title}
          helperText={errorText && errorText.title.length>0 && errorText.title }
        />
        <br/><br/>
        <TextField
         error={errorText && errorText.description.length>0}
          id="outlined-error-helper-text"
          label="Campaign Description"
          style={{width:"390px"}}
          onChange={e=>setInputValue({
              ...inputValue,
             description: e.target.value})}
          value={inputValue.description}
          helperText={errorText && errorText.description.length>0 && errorText.description }
        />
        <br/><br/>
        <TextField
          error={errorText && errorText.minContribution.length>0}
          id="outlined-error-helper-text"
          label="Minimum ether to contribute"
          style={{width:"390px"}}
           onChange={e=>setInputValue({
              ...inputValue,
             minContribution: e.target.value})}
          defaultValue={0}
          value={inputValue.minContribution}
          type="number"
          helperText={errorText && errorText.minContribution.length>0 && errorText.minContribution }
        />
        <br/><br/>
        <div style={{marginTop:"12px"}}>
        <Button disabled={loading} variant="contained"
         onClick={formSubmit}
         
         >Create</Button>
        </div>

        {
            <div style={{marginTop:"15px",color:"red"}}>
{ errorDelivery && errorDelivery.message}
            </div>
           
        }

        </div>
        </Layout>
        
    )
}

export default NewCampaign
