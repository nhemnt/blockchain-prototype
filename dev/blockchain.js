const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {
    this.chain = [];
    // this.newTransactions=[];
    this.pendingTransactions = [];
    this.networkNodes = [];
    this.currentNodeUrl = currentNodeUrl;

    this.createNewBlock(100, '0', '0');
}


Blockchain.prototype.createNewBlock = function (nonce, previousBlockchainHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        // transactions:this.newTransactions,
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockchainHash: previousBlockchainHash
    }
    // this.newTransactions=[];
    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];

}

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    };
    return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransaction = function (transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function (previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    // console.log(hash);
    return hash;
}

Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;

}

Blockchain.prototype.chainIsValid = function (blockchain) {
    let validChain = true;
    for (var i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1];
        const blockHash = this.hashBlock(prevBlock['hash'], {
            transaction: currentBlock['transactions'],
            index: currentBlock['index']
        }, currentBlock['nonce']);
        if (blockHash.substring(0, 4) !== '0000') validChain = false;
        if (currentBlock['previousBlockchainHash'] !== prevBlock['hash']) validChain = false;

    }
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctHash = genesisBlock['hash'] === '0';
    const correctPrevBlockHash = genesisBlock['previousBlockchainHash'] === '0';
    const correctTransaction = genesisBlock['transactions'].length === 0;
    if (!correctNonce || !correctHash || !correctPrevBlockHash || !correctTransaction) validChain = false;

    return validChain;
}

Blockchain.prototype.getBlock = function (blockhash) {
    let correctblock = null;
    this.chain.forEach(block => {
        if (block.hash === blockhash)
            correctblock = block;
        // console.log(correctblock);
    });
    return correctblock;
};

Blockchain.prototype.getTransaction = function (transactionId) {
    let correctTransaction = null;
    let correctBlock = null;
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.transactionId === transactionId) {
                correctTransaction = transaction;
                correctBlock = block;
            }
        })
    })
    return {
        transaction: correctTransaction,
        block:correctBlock
    }
};

Blockchain.prototype.getAddressData=function(address){
    const addressTransaction=[];
    this.chain.forEach(block =>{
        block.transactions.forEach(transaction => {
            if(transaction.sender===address || transaction.recipient===address){
                addressTransaction.push(transaction);
            }
        })
    });
    let balance=0;
    addressTransaction.forEach(transaction=>{
        if(transaction.recipient===address) balance +=transaction.amount;

        else if(transaction.sender===address) balance -=transaction.amount;
    });

    return {
        addressTransaction:addressTransaction,
        balance:balance
    }
};

module.exports = Blockchain;