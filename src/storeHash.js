import web3 from './Web3';
const address = "0xa80c12fc7ff54d97bc1b70fdf34db7bdb85e42a7";
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_x",
				"type": "string"
			}
		],
		"name": "sendHash",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getHash",
		"outputs": [
			{
				"name": "_x",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

export default new web3.eth.Contract(abi,address);