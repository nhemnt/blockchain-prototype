const uuid =require('uuid/v1');

const nodeAddress=uuid().split('-').join('');
console.log(nodeAddress);


const port=process.argv[2];
console.log(port);