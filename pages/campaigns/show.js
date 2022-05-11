import { Button, Paper, TextField } from '@mui/material';
import React,{useState} from 'react'
import Layout from '../../components/Layout'
import web3 from '../../ethereum/web3';
import {Router,Link as RouterLink} from '../../routes';

const compiledCampaign = require('../../ethereum/build/Campaign.json');
function Show(props) {
  // console.log(props);

  const [inputValue,setInputValue] = useState('');
  const [inputErr,setInputErr] = useState('');
  const [loading,setLoading] = useState(false);
  const [transactionStatus,setTransactionStatus] = useState('');

  const confirmSubmission = async()=>{
    let tempErr = '';
    let accounts = await web3.eth.getAccounts();
    setTransactionStatus('Pending...');
    if(!inputValue){
      tempErr='Required';
    }
    if(inputValue && web3.utils.toWei(inputValue,'ether')<props.minimumContribution){
      tempErr='Contribution should be greater than minimum contribution';
    }
  
    if(tempErr.length==0){
      setLoading(true);
     
      const campaign= new web3.eth.Contract(
        compiledCampaign.abi,
        props.address
     );
     console.log(campaign)
      await campaign.methods.contribute().send({
        from:accounts[0],
        value:web3.utils.toWei(inputValue,'ether')
      }).then(res=>{
        console.log("Senddinggg..........",web3.utils.toWei(inputValue,'ether'))
        setTransactionStatus("Thank you for your contribution");
        Router.replaceRoute(`/campaigns/${props.address}`)
      }).catch(err=>{
        console.log("Error",err)
        setTransactionStatus(err.message);
      });

      setLoading(false);
    }

    setInputErr(tempErr);
  }

    return (
        <Layout>
          <h2>
                    {props.campaignTitle}
          </h2>
          <div style={{display:"flex",gap:"5rem",flexWrap:"wrap"}}>
          <div style={{maxWidth:"1000px"}}>
          <div style={{marginTop:"10px"}}> 
                <Paper style={{padding:"0.05rem 0.5rem 0.5rem 0.5rem",width:"fit-content"}}>
                    <h4 >
                      Manager
                    </h4>
                    <div>
                    {props.manager}
                    </div>
                </Paper>
                
          </div>
          <div style={{marginTop:"20px"}}> 
                <Paper style={{padding:"0.05rem 0.5rem 0.5rem 0.5rem",width:"fit-content"}}>
                    <h4 >
                     Campaign Description
                    </h4>
                    <div>
                    {props.campaignDescription}
                    </div>
                </Paper>
                
          </div>
          <div style={{marginTop:"20px",display:"flex",gap:"2rem"}}> 
                <Paper style={{padding:"0.05rem 0.5rem 0.5rem 0.5rem",width:"fit-content"}}>
                    <h4 >
                      Minimum Contribution
                    </h4>
                    <div>
                    {props.minimumContribution} wei  <b> ({web3.utils.fromWei(props.minimumContribution,'ether')} ether) </b>
                    </div>
                </Paper>
                <Paper style={{padding:"0.05rem 0.5rem 0.5rem 0.5rem",width:"fit-content"}}>
                    <h4 >
                      Number of Contributors
                    </h4>
                    <div>
                    {props.approversCount}
                    </div>
                </Paper>
                <Paper style={{padding:"0.05rem 0.5rem 0.5rem 0.5rem",width:"fit-content"}}>
                    <h4 >
                      Campaign Balance
                    </h4>
                    <div>
                    {web3.utils.fromWei(props.balance,'ether')} ether
                    </div>
                </Paper>
                
          </div>
          <div style={{marginTop:"20px",display:"flex",gap:"2rem"}}> 
           
              <RouterLink route={`/campaigns/${props.address}/requests`}>
              <Button variant="contained" >
              View Requests
              </Button>
              </RouterLink>
           
          </div>
          </div>
          <div>
              <h3>
                Contribute to the project
              </h3>

              <TextField
          error={inputErr && inputErr}
          id="outlined-error-helper-text"
          label="Contribute (Ether)"
          style={{width:"250px"}}
          type="number"
          
          onChange={e=>setInputValue(e.target.value)}
          value={inputValue}
          helperText={inputErr &&  inputErr }
        />
        <br/><br/>
        <Button disabled={loading} variant="contained" onClick={confirmSubmission}>
          Contribute
        </Button>
        <div style={{marginTop:"1rem"}}>
        {transactionStatus && transactionStatus}
        </div>
          </div>
          </div>
        </Layout>
    )
}

Show.getInitialProps = async (props) => {
  const address = props.query.address;
  console.log(address);
  let campaign = new web3.eth.Contract(
    compiledCampaign.abi,
    address
 );
 const summary = await campaign.methods.getSummary().call();
  return {
 address:address,
    campaignTitle:summary[1],
    manager:summary[0],
    campaignDescription:summary[2],
    minimumContribution:summary[3],
    approversCount:summary[4],
    numRequests:summary[5],
    balance:summary[6]

   };
}

export default Show
