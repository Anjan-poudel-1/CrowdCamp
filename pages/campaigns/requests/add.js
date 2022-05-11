
import Layout from '../../../components/Layout'
import { Button, TextField } from '@mui/material'
import React,{useState} from 'react'
 import factory from '../../../ethereum/factory';
 import web3 from '../../../ethereum/web3';
 import {Link,Router} from '../../../routes';
 const compiledCampaign = require('../../../ethereum/build/Campaign.json');

 function AddRequest(props) {


    const [errorText,setErrorText] = useState({
        transactionAmount:'',
        Receiver:'',
        description:''
    });
    const [loading,setLoading] = useState(false);
    const [inputValue,setInputValue] = useState({
        transactionAmount:'',
        Receiver:'',
        description:''
    });
    const [errorDelivery,setErrorDelivery] = useState('');
    const formSubmit = async()=>{

        let errCount = 0; 
        let tempErr = {...errorText}
    
        if(inputValue.transactionAmount<=0){
            errCount++;
            tempErr= {
                ...tempErr,
                transactionAmount:"Transaction amount sent should be a positive number"
                }
        }
        else{
             tempErr= {
                ...tempErr,
                transactionAmount:""
                }
        }
        if(inputValue.Receiver.length<=0){
            errCount++;
            tempErr= {
                ...tempErr,
                Receiver:"Receiver should be provided"
                }
        }
        else{
             tempErr= {
                ...tempErr,
                Receiver:""
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
        transactionAmount:'',
        Receiver:'',
        description:''
            })
            console.log("input---",inputValue);
            console.log("typof", typeof(inputValue))
            setLoading(true);
            const accounts = await web3.eth.getAccounts();
            const campaign= new web3.eth.Contract(
                compiledCampaign.abi,
                props.address
             );

            const addedRequest = await campaign.methods.createRequest(inputValue.description,web3.utils.toWei(inputValue.transactionAmount),inputValue.Receiver)
            .send({
                from:accounts[0]
    
            })
            .then(res=>{
                console.log("Successfully Added");
                setErrorDelivery('');
                Router.pushRoute(`/campaigns/${props.address}/requests`);
            }).catch(err=>{
                console.log("Could not Add Request");
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

           Add Request
            </h3>

           
        <TextField
          error={errorText && errorText.Receiver.length>0}
          id="outlined-error-helper-text"
          label="Campaign Receiver"
          style={{width:"390px"}}
          onChange={e=>setInputValue({
              ...inputValue,
             Receiver: e.target.value})}
          value={inputValue.Receiver}
          helperText={errorText && errorText.Receiver.length>0 && errorText.Receiver }
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
          error={errorText && errorText.transactionAmount.length>0}
          id="outlined-error-helper-text"
          label="Transaction Amount"
          style={{width:"390px"}}
           onChange={e=>setInputValue({
              ...inputValue,
             transactionAmount: e.target.value})}
          defaultValue={0}
          value={inputValue.transactionAmount}
          type="number"
          helperText={errorText && errorText.transactionAmount.length>0 && errorText.transactionAmount }
        />
        <br/><br/>
        <div style={{marginTop:"12px"}}>
        <Button disabled={loading} variant="contained"
         onClick={formSubmit}
         
         >Create Request</Button>
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





AddRequest.getInitialProps = async (props) => {
    const address = props.query.address;
    console.log(address);
    
 
    return {
   address:address
     };
  }



export default AddRequest
