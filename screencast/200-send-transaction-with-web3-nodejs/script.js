const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const MyContract = require('./build/contracts/MyContract.json');
const address = '0x4033e8AEB8DFE4A51661553070e002457DbABC29';
const privateKey =
   '8866e91519f0b243f5e4da06c425038d27b1e62f24f43d5fb296cb43c8639572';
const infuraUrl =
   'https://ropsten.infura.io/v3/dac6b55872f34b2fb12c842a26b346ba';

const init1 = async () => {
   const web3 = new Web3(infuraUrl);
   const networkId = await web3.eth.net.getId();
   const myContract = new web3.eth.Contract(
      MyContract.abi,
      MyContract.networks[networkId].address
   );

   const tx = myContract.methods.setData(1);
   const gas = await tx.estimateGas({ from: address });
   const gasPrice = await web3.eth.getGasPrice();
   const data = tx.encodeABI();
   const nonce = await web3.eth.getTransactionCount(address);

   const signedTx = await web3.eth.accounts.signTransaction(
      {
         to: myContract.options.address,
         data,
         gas,
         gasPrice,
         nonce,
         chainId: networkId,
      },
      privateKey
   );
   console.log(`Old data value: ${await myContract.methods.data().call()}`);
   const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
   );
   console.log(`Transaction hash: ${receipt.transactionHash}`);
   console.log(`New data value: ${await myContract.methods.data().call()}`);
};

// init1();

const init2 = async () => {
   const web3 = new Web3(infuraUrl);
   const networkId = await web3.eth.net.getId();
   const myContract = new web3.eth.Contract(
      MyContract.abi,
      MyContract.networks[networkId].address
   );
   web3.eth.accounts.wallet.add(privateKey);

   const tx = myContract.methods.setData(2);
   const gas = await tx.estimateGas({ from: address });
   const gasPrice = await web3.eth.getGasPrice();
   const data = tx.encodeABI();
   const nonce = await web3.eth.getTransactionCount(address);

   const txData = {
      from: address,
      to: myContract.options.address,
      data,
      gas,
      gasPrice,
      nonce,
      chain: 'ropsten',
      hardfork: 'london',
   };

   console.log(`Old data value: ${await myContract.methods.data().call()}`);
   const receipt = await web3.eth.sendTransaction(txData);
   console.log(`Transaction hash: ${receipt.transactionHash}`);
   console.log(`New data value: ${await myContract.methods.data().call()}`);
};

// init2();

const init3 = async () => {
   const provider = new Provider(privateKey, infuraUrl);
   const web3 = new Web3(provider);
   const networkId = await web3.eth.net.getId();
   const myContract = new web3.eth.Contract(
      MyContract.abi,
      MyContract.networks[networkId].address
   );

   console.log(`Old data value: ${await myContract.methods.data().call()}`);
   const receipt = await myContract.methods.setData(3).send({ from: address });
   console.log(`Transaction hash: ${receipt.transactionHash}`);
   console.log(`New data value: ${await myContract.methods.data().call()}`);
};

init3();
