import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';



//Exporting the factory instance
const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    "0x52fbDC59F9Fe1a89FF0582459E713DD5567F6869"

);

export default instance;