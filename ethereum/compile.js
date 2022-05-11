const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


//writing the build path 

//__dirname is the current working directory, ani folder
const buildPath = path.resolve(__dirname,'build');
fs.removeSync(buildPath);
//REmoving the build folder;

const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');

const source = fs.readFileSync(campaignPath,'utf8');

// console.log(source)

//Now we compile everything we pulled out f file


// compile contracts and get contracts
let input = {
    language: "Solidity",
    sources: {
      "Campaign.sol": {
        content: source,
      },
    },
    settings: {
      metadata: {
      useLiteralContent: true
    },
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };
  // const output = solc.compile(output, 1);
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  console.log(output)
  const contracts = output.contracts["Campaign.sol"];


// const output = solc.compile(source,1).contracts;
// //It consist of 2 diff obj , contains compiledCampaign and contractFactory. So, we loop and save

//First create build folder, 

console.log(output)

fs.ensureDirSync(buildPath);
//It checks if a directory exists, if not will create.




// for (let contract in output){
//     fs.outputJSONSync(
//         path.resolve(buildPath,contract.replace(':',"")+'.json'),
//         output[contract]
//     )
// }

// loop over output and write each contract to different file in build directory
console.log(output);
for (let contract in contracts) {
  if (contracts.hasOwnProperty(contract)) {
    fs.outputJsonSync(
    	path.resolve(buildPath, `${contract}.json`), 
    	contracts[contract]
    );
  }
}

