const Blockchain = require ('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(3123, '8fh6dsh', '3dsh8jk');


bitcoin.createTransaction(100, 'alexfh8yf2', 'jenn23jjs');

console.log(bitcoin);
