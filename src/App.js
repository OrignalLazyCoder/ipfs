import React, { Component } from 'react';
import './App.css';
import web3 from './Web3';
import ipfs from  './Ipfs';
import storehash from './storeHash';
import { Button } from 'react-bootstrap';

class App extends Component {
  state = {
    ipfsHash:null,      
    buffer:'',      
    ethAddress:'',      
    transactionHash:'',      
    txReceipt: ''
  }

  File =(event) => {        
    event.stopPropagation()        
    event.preventDefault()        
    const file = event.target.files[0]        
    let reader = new window.FileReader()        
    reader.readAsArrayBuffer(file)  
    console.log(reader);      
    reader.onloadend = () => this.convertToBuffer(reader)      
  };

  convertToBuffer = async (reader) => {      
    //file is converted to a buffer for upload to IPFS        
    const buffer = await Buffer.from(reader.result);      
    //set this buffer-using es6 syntax  
    console.log(buffer);      
    this.setState({buffer});    
  };

  functiononClick = async () => {
    try{        
      this.setState({blockNumber:"waiting.."});        
      this.setState({gasUsed:"waiting..."});
      await web3.eth.getTransactionReceipt(this.state.transactionHash, (err, txReceipt)=>{          
        console.log(err,txReceipt);          
        this.setState({txReceipt});        
      });      
    }catch(error){      
      console.log(error);    
    }
  }

  onSubmit = async (event) => {      
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const ethAddress= await storehash.options.address;      
    this.setState({ethAddress});    
    //save document to IPFS,return its hash#, and set hash# to state      
    await ipfs.add(this.state.buffer, (err, ipfsHash) => {       
       console.log(err,ipfsHash);        
       //setState by setting ipfsHash to ipfsHash[0].hash        
       this.setState({ 
         ipfsHash:ipfsHash[0].hash 
        });        
       // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract        
       //return the transaction hash from the ethereum contract        
       storehash.methods.sendHash(this.state.ipfsHash).send({          
         from: accounts[0]        
        }, (error, transactionHash) => {          
          console.log(transactionHash);          
          this.setState({
            transactionHash
          });        
        });      
      })   
    };

  render() {
    return (
      <div className="App">
        <header className="App-header">            
        <h1>Ethereum and IPFS using Infura</h1>          
        </header>
        <hr/><grid>          
          <h3> Choose file to send to IPFS </h3>          
          <form onSubmit={this.onSubmit}>            
          <input type = "file" onChange = {this.captureFile} />             
          <Button bsStyle="primary" type="submit">
              Send it             
          </Button>          
          </form><hr/> 
          <Button onClick = {this.onClick}> 
          Get Transaction Receipt </Button> 
          <hr/>  
          <table bordered responsive>                
          <thead>                  
            <tr>                    
              <th>Tx Receipt Category</th>                    
              <th> </th>                    
              <th>Values</th>                  
              </tr>                
          </thead>
        <tbody>                  
          <tr>                    
            <td>IPFS Hash stored on Ethereum</td>                    
            <td> : </td>                    
            <td>{this.state.ipfsHash}</td>                  
            </tr>                  
            <tr>                    
              <td>Ethereum Contract Address</td>                    
              <td> : </td>                    
              <td>{this.state.ethAddress}</td>                  
              </tr>                  
              <tr>                    
                <td>Tx # </td>                    
                <td> : </td>                    
                <td>{this.state.transactionHash}</td>                  
                </tr>                
                </tbody>            
                </table>        
                </grid>
      </div>
    );
  }
}

export default App;
