// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;
 
contract CampaignFactory {
    Campaign[] public deployedCampaigns;
    
    function createCampaign(string calldata campaignTitle,string calldata description,uint minimum) public {
        Campaign newCampaign = new Campaign(campaignTitle,description,minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}
 
contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping (address => bool) approvals;
        uint approvalCount;
    }
    
    address public manager;
    string public campaignTitle;
    string public campaignDescription;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    uint public numRequests;
    mapping (uint => Request) requests;
    
    
    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(string memory title,string memory description,uint minimum, address creator) {
        campaignTitle= title;
        campaignDescription = description;
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount ++;
    }
    
    function createRequest(string calldata description, uint value, address payable recipient) public restrictedToManager {
        // get last index of requests from storage
       Request storage newRequest = requests[numRequests];
       // increase requests counter
       numRequests ++;
       // add information about new request
       newRequest.description = description;
       newRequest.value = value;
       newRequest.recipient = recipient;
       newRequest.approvalCount = 0;
    }

    function fetchRequest(uint index) public view 
    returns(string memory,uint,address,bool, uint) {
        // string description;
        // uint value;
        // address payable recipient;
        // bool complete;
        // uint approvalCount;

        Request storage data = requests[index];

        return(
            data.description,
             data.value,
             data.recipient,
             data.complete,
             data.approvalCount
        );

    }
    
    function approveRequest(uint index) public {
        // get request at provided index from storage
        Request storage request = requests[index];
        // sender needs to have contributed to Campaign
        require(approvers[msg.sender]);
        // sender must not have voted yet
        require(!request.approvals[msg.sender]);
        
        // add sender to addresses who have voted
        request.approvals[msg.sender] = true;
        // increment approval count
        request.approvalCount ++;
    }
    
    function finalizeRequest(uint index) public restrictedToManager {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(
        address,string memory,string memory,uint,uint,uint,uint
    ){
        return (manager,
    campaignTitle,
    campaignDescription,
    minimumContribution,
    approversCount,
    numRequests,
    address(this).balance

        );
    }
}