const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1'); // getting unique transactions ids
const rp = require('request-promise'); //allow us to make req to all the nodes in our network


const port = process.argv[2];


const nodeAddress = uuid().split('-').join('');

const bitcoin = new Blockchain();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/blockchain', function (req, res) {
    res.send(bitcoin);

});


//create new transactions
app.post('/transaction', function (req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);
    res.json({note: `Transaction will be added in block ${blockIndex}`});
});


//create transaction and broadcast it to network
app.post('/transaction/broadcast', function (req, res) {
    const amount = req.body.amount;
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient);
    bitcoin.addTransactionToPendingTransaction(newTransaction);
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises)
        .then(data => {
            res.json({note: 'Transaction Created And Broadcast Successfully'});
        });
});

//mine new block
app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transaction: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockhash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockhash);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {newBlock: newBlock},
            json: true
        }
        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises)
        .then(data => {
            const requestOptions = {
                uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true
            };
            return rp(requestOptions);
        })
        .then(data => {
            res.json({
                note: "new block mined and broadcast successfully",
                block: newBlock
            });
        });
});
app.post('/receive-new-block', function (req, res) {
    console.log('fofofofo');
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockchainHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    if (correctHash && correctIndex) {
        console.log('in reciecve new block');
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: 'new block received successfully',
            newBlock: newBlock
        });
    }
    else {
        res.json({
            note: 'New Block Rejected.',
            newBlock: newBlock
        });
    }
});


//register a node and broadcast to the whole network
app.post('/register-and-broadcast-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bitcoin.networkNodes.push(newNodeUrl);
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl},
            json: true
        };
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
                method: 'POST',
                json: true
            };
            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({note: 'new node registered with network successfully'});
        });
});

//register a node with network
app.post('/register-node', function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({note: 'New node registered successfully with node '});
});

//register multiple node at once
app.post('/register-nodes-bulk', function (req, res) {

    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentUrl = bitcoin.currentNodeUrl != networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentUrl) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({note: 'Bulk registration  successfull.'});
});


app.get('/consensus', function (req, res) {
    const requestPromise = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromise.push(rp(requestOptions));
    });
    Promise.all(requestPromise)
        .then(blockchains => {
            const currentChainLength = bitcoin.chain.length;
            let maxChainlength = currentChainLength;
            let newlongestChain = null;
            let newPendingTransactions = null;
            blockchains.forEach(blockchain => {
                if (blockchain.chain.length > maxChainlength) {
                    maxChainlength = blockchain.chain.length;
                    newlongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions;
                }
            });
            if (!newlongestChain || (newlongestChain && !bitcoin.chainIsValid(newlongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced',
                    chain: bitcoin.chain
                });
            }
            else if (newlongestChain && bitcoin.chainIsValid(newlongestChain)) {
                bitcoin.chain = newlongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'The chain has been replaced.',
                    chain: bitcoin.chain
                });
            }

        })

});


app.get('/block/:blockHash', function (req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);
    res.json({block: correctBlock});
});

app.get('/transaction/:transactionId', function (req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);
    res.json({
        transaction:transactionData.transaction,
        block:transactionData.block
    });
});

app.get('/address/:address',function(req,res){
    const address=req.params.address;
    const addressData=bitcoin.getAddressData(address);
    res.json ({
        addressTransactions:addressData.addressTransaction,
        addressBalance:addressData.balance
    });
});
app.get('/block-explorer',function(req,res){
   res.sendFile('./block-explorer/index.html',{root: __dirname });
});

app.listen(port, function () {
    console.log(`listening on ${port}s...`);
});