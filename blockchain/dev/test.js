const Blockchain = require ('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(3123, '8fh6dsh', '3dsh8jk');


bitcoin.createNewTransaction(100, 'alexfh8yf2', 'jenn23jjs');

bitcoin.createNewBlock(31123, '23fh6dsh', '57dsh8jk');

bitcoin.createNewTransaction(10, 'alexfh8yf2', 'jenn23jjs');
bitcoin.createNewTransaction(200, 'alexfh8yf2', 'jenn23jjs');
bitcoin.createNewTransaction(2000, 'alexfh8yf2', 'jenn23jjs');

bitcoin.createNewBlock(3112, '23dsfh6dsh', '56hgdsh8jk');

console.log(bitcoin.chain[2]);
