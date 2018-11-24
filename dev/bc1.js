const  Blockchain =require('./blockchain');
const bitcoin=new Blockchain();


const bc1={
    chain: [
        {
            index: 1,
            timestamp: 1532273258893,
            transactions: [ ],
            nonce: 100,
            hash: "0",
            previousBlockchainHash: "0"
        },
        {
            index: 2,
            timestamp: 1532283626674,
            transactions: [ ],
            nonce: 16441,
            hash: "00009b2ef664890dbcd795344f8145bac1710db47cea457183f41c9ca24c3285",
            previousBlockchainHash: "0"
        },
        {
            index: 3,
            timestamp: 1532283628826,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "c46850b08dc311e8ae7c698ceb4e0bd5",
                    transactionId: "e828eab08ddb11e8ae7c698ceb4e0bd5"
                }
            ],
            nonce: 18075,
            hash: "0000592e3a4a749274940e92de69ed1c8a326a0a6123bc71938d57bab6dafebc",
            previousBlockchainHash: "00009b2ef664890dbcd795344f8145bac1710db47cea457183f41c9ca24c3285"
        },
        {
            index: 4,
            timestamp: 1532283629636,
            transactions: [ ],
            nonce: 26056,
            hash: "0000d360cab864e03e43b79c1196465cc4fc240228ae7bb6aa750ca906151d19",
            previousBlockchainHash: "0000592e3a4a749274940e92de69ed1c8a326a0a6123bc71938d57bab6dafebc"
        },
        {
            index: 5,
            timestamp: 1532283629846,
            transactions: [ ],
            nonce: 9898,
            hash: "0000df59e437ec652efff1960ff8a3c3ee227c3909c97b21f686efd4bf851a6c",
            previousBlockchainHash: "0000d360cab864e03e43b79c1196465cc4fc240228ae7bb6aa750ca906151d19"
        },
        {
            index: 6,
            timestamp: 1532283630877,
            transactions: [ ],
            nonce: 33669,
            hash: "00007446b902cf55a9c0cf81f4f964ca81e334b8b2f96d8f83b8f5da2d60dfa6",
            previousBlockchainHash: "0000df59e437ec652efff1960ff8a3c3ee227c3909c97b21f686efd4bf851a6c"
        },
        {
            index: 7,
            timestamp: 1532283631207,
            transactions: [ ],
            nonce: 14464,
            hash: "0000804ba8769a2a56b6fb286d6c848b82721e01493bf02342aff9f309ed7343",
            previousBlockchainHash: "00007446b902cf55a9c0cf81f4f964ca81e334b8b2f96d8f83b8f5da2d60dfa6"
        },
        {
            index: 8,
            timestamp: 1532283633291,
            transactions: [ ],
            nonce: 114242,
            hash: "00007a8c56bd4d87b1384f420a8ba9a7ea88ddaf4a9a72c791fec0dd75b5ad4b",
            previousBlockchainHash: "0000804ba8769a2a56b6fb286d6c848b82721e01493bf02342aff9f309ed7343"
        },
        {
            index: 9,
            timestamp: 1532283635941,
            transactions: [ ],
            nonce: 161620,
            hash: "0000725ee3520bf43d4835a780ce869bc4640ba9529da7accb496041f0d83b24",
            previousBlockchainHash: "00007a8c56bd4d87b1384f420a8ba9a7ea88ddaf4a9a72c791fec0dd75b5ad4b"
        },
        {
            index: 10,
            timestamp: 1532283637878,
            transactions: [ ],
            nonce: 115116,
            hash: "0000a1395cd9ba4c75febb10540d527a061b14422f84645100d9f3270af51919",
            previousBlockchainHash: "0000725ee3520bf43d4835a780ce869bc4640ba9529da7accb496041f0d83b24"
        },
        {
            index: 11,
            timestamp: 1532283640690,
            transactions: [ ],
            nonce: 113922,
            hash: "00000ea4ec78a7622998ccb44b4a7ec8b78e9b834b2ebfdb122f8e8a3b973aa8",
            previousBlockchainHash: "0000a1395cd9ba4c75febb10540d527a061b14422f84645100d9f3270af51919"
        },
        {
            index: 12,
            timestamp: 1532283642849,
            transactions: [
                {
                    amount: 12.5,
                    sender: "00",
                    recipient: "c46850b08dc311e8ae7c698ceb4e0bd5",
                    transactionId: "f08544608ddb11e8ae7c698ceb4e0bd5"
                }
            ],
            nonce: 68340,
            hash: "0000c978a5d3f868bd051bd05cc767547419fc382d2fca3af60743d684aa9135",
            previousBlockchainHash: "00000ea4ec78a7622998ccb44b4a7ec8b78e9b834b2ebfdb122f8e8a3b973aa8"
        },
        {
            index: 13,
            timestamp: 1532283644514,
            transactions: [ ],
            nonce: 89189,
            hash: "0000c510b15d2e22d6bdda020ce67016b44f4362e2eae8e523e68da36a1d6c5e",
            previousBlockchainHash: "0000c978a5d3f868bd051bd05cc767547419fc382d2fca3af60743d684aa9135"
        }
    ],
    pendingTransactions: [ ],
    networkNodes: [ ],
    currentNodeUrl: "http://localhost:3001"
};

console.log('VALID:'+ bitcoin.chainIsValid(bc1.chain));