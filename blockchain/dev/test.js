const Blockchain = require ('./blockchain');

const bitcoin = new Blockchain();

const previousBlockHash = '8dbcnjsdnmvsd';
const currentBlockData = [
  {
    amount: 10,
    sender: 'N90dsadasdh',
    recipient:'Bs7mdshds'
  },
  {
    amount: 20,
    sender: 'b90dsadasdh',
    recipient:'Qs7mdshds'

  },
  {
    amount: 30,
    sender: 'b9DS0dsadasdh',
    recipient:'QsF7mdshds'

  },
];

const nonce = 100;

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce));
