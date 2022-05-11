const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

//Bringing in the compiled version
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts; 
let factory; 
let campaignAddress; 
let campaign; 

beforeEach(async()=>{
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:compiledFactory.bytecode})
    .send({from:accounts[0],gas:'1000000'});

    await factory.methods.createCampaign('100').send({
        from:accounts[0],
        gas:'1000000'
    });


    campaignAddress = await factory.methods.getDeployedCampaigns().call();

    //We need to create js instance that has the address of mathi ko contract

    //Since the contract has already been deployed and we are just making instance of already deployed address, no need to send gas
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress[0]
    )


});

describe('Campaign', () => {

        // it('Is campaign created',()=>{
        //     assert.ok(campaign.options.address)
        // });

        // it('Mark the caller as manager',async()=>{
          
        //     const manager = await campaign.methods.manager().call();
        //     assert.strictEqual(manager,accounts[0])
        // });

        // it('Check the donation, contribution',async()=>{

        //     await campaign.methods.contribute().send({
        //         from:accounts[1],
        //         value:'200'
        //     });

        //     let isContributorAdded = await campaign.methods.approvers(accounts[1]).call();
        //     assert(isContributorAdded);
        //     let approversCount = await campaign.methods.approversCount().call();
        //     assert.strictEqual(Number(approversCount),1);
        // });

        // it('Check minimum contribution',async()=>{
        //     await campaign.methods.contribute().send({
        //         from:accounts[2],
        //         value:'10'
        //     }).then(res=>{
        //         assert(false);
        //     }).catch(err=>{
        //         console.log("Minimum contribution wala error")
        //         assert(true);
        //     })
        // });

        // it('Allows manager to make a payment request',async()=>{
        //     await campaign.methods.createRequest("This is the description",100000000,accounts[3]).send({
        //         from:accounts[0],
        //         gas:'1000000'
        //     });

        //     let providedRequests = await campaign.methods.requests(0).call();



        //     assert.strictEqual('This is the description',providedRequests.description)

        // });

        it("End to end test",async()=>{

            //checking if contracact is deployed... 

            let contractDeployedAddress = factory.options.address;

            assert.ok(contractDeployedAddress);
            //checking if campaign is created... 

            assert.ok(campaign.options.address)


            //checking if client can donate to the campaign ... 

            await campaign.methods.contribute().send({
                from:accounts[1],
                value:'10000'
            });
            await campaign.methods.contribute().send({
                from:accounts[2],
                value:'10000'
            });
            let approversCount = await campaign.methods.approversCount().call();
            assert.strictEqual(Number(approversCount),2);

            //creating a financial request 

            let financialRequest = await campaign.methods.createRequest("description",10000,accounts[3]);

            let totalRequests = await campaign.methods.getRequests().call();

            console.log(totalRequests);

            assert.ok(totalRequests);
            assert.strictEqual(totalRequests.length,1);



//approvers can approve to the request ... voting

             await campaign.methods.approveRequest(0).send({
                 from:accounts[1]
             });

             assert.strictEqual(campaign.requests[0].approvalCount,1);



            //normal people who didnt donate cannot approve the request


            //also no replica of approving


            //manager can finalize the request 

            //see if the person/vendor has got the money

        })
});




