const Blockchain= require ('./blockchain');

const bitcoin =new Blockchain();
// bitcoin.createNewBlock(12314,'GHJGFHFGCSDFDB','FGDGJXCVXCGHFGHCVB');

tra=bitcoin.createNewTransaction(502,'HASRASFI43NKSDFSFD','SSDFKFNSDKJF34DSF');
console.log(tra);
// bitcoin.createNewTransaction(503,'HASRASFI43NKSDDDFSVF','SDFSKFNSDKJF34DSF');
// bitcoin.createNewTransaction(504,'HASRASFI4SDA3NKSDF','SSDFKFNSDKJF34DSF');
// const block=bitcoin.createNewTransaction(500,'HASRASFI43NKDSFSDF','SDFSKFNSDKJF34DSF');
// console.log(block);
// console.log(bitcoin);
// bitcoin.createNewBlock(314,'chupa','ysdfesasdheissocooldude233');
// bitcoin.createNewBlock(1232314,'hesdfasadmndftcoolbo','sdfyesasdheissocooldude233');
// bitcoin.createNewBlock(1231234,'heasagfhfsfdmntcoolbo','fdgfyesasdheissocooldude233');
// console.log(bitcoin);
// const previousBlockHash='SDFSDSDAS98SDFBSDHFBSD';
const currentBlockData=[{
    amount:500,
    sender:'sender1',
    to:'sender24'
},
    {
        amount:360,
        sender:'sender12',
        to:'sender2'
    },{
        amount:8009,
        sender:'sender1',
        to:'sender12'
    }]
// console.log(bitcoin.hashBlock(previousBlockHash,currentBlockData,'52631'));
// console.log(JSON.stringify(currentBlockData))
// console.log(bitcoin.proofOfWork(previousBlockHash,currentBlockData));
// console.log(bitcoin);
// console.log(bitcoin.getLastBlock());