import { Button } from '@mui/material'
import React from 'react'
import Layout from '../../../components/Layout'
import {Link as RouterLink,Router} from '../../../routes';
import web3 from '../../../ethereum/web3';
const compiledCampaign = require('../../../ethereum/build/Campaign.json');


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function ViewRequests(props) {
  
   


     console.log(props)
    return (
        <Layout>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <h2>
                Requests List
            </h2>
            
            <RouterLink route={`/campaigns/${props.address}/requests/add`}>
            <Button variant="contained" >
                Add new
            </Button>
            </RouterLink>
            
            </div>
            <div>
            Total Requests - {props.requestCount}
            </div>

            <TableContainer component={Paper} style={{marginTop:"25px"}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell>Request Description</TableCell>
            <TableCell >Receipient</TableCell>
            <TableCell >Amount(ether)</TableCell>
            <TableCell >Approval Count</TableCell>
            <TableCell align="right">Approve</TableCell>
            <TableCell align="right">Finalize</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.requests.map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                {/* {row.id} */}
                {index+1}
              </TableCell>
              <TableCell component="th" scope="row">
                {/* {row.description} */}
                {row[0]}
              </TableCell>
              <TableCell >
                  {/* {row.receipient} */}
                  {row[2]}
                  </TableCell>
              <TableCell >
                  {/* {row.amount} */}
                  {web3.utils.fromWei(row[1],'ether')}
                  </TableCell>
              <TableCell >
                  {/* {row.approval_count} */}
                  {row[4]}
                  </TableCell>
              <TableCell ><Button>Approve</Button></TableCell>
              <TableCell ><Button>Finalize</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

            
        </Layout>
    )
}

ViewRequests.getInitialProps = async (props) => {
    const address = props.query.address;
    console.log(address);
    const campaign= new web3.eth.Contract(
        compiledCampaign.abi,
        address
     );
     const requestCount =await campaign.methods.numRequests().call();
    
        // const requests = await campaign.methods.fetchRequest(0).call();

        const requests = await Promise.all(
            Array(Number(requestCount)).fill().map((element,index)=>{
                return campaign.methods.fetchRequest(index).call();
            })
        );
    


    return {
   address:address,
   requestCount:requestCount,
   requests:requests
     };
  }

export default ViewRequests
