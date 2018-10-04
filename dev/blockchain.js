const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');

function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];
	this.pendingChits = [];

	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];

	this.createNewBlock(100, '0', '0');
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		chits : this.pendingChits,

		nonce: nonce,
		hash: hash,
		/* chitAmount : chitAmount,
		chitTime : chitTime, */
		previousBlockHash: previousBlockHash
	};

	this.pendingTransactions = [];

	this.pendingChits = [];
	this.chain.push(newBlock);

	return newBlock;
};


Blockchain.prototype.getLastBlock = function() {
	return this.chain[this.chain.length - 1];
};


Blockchain.prototype.createNewTransaction = function(amount, sender, chitId) {
	const newTransaction = {
		amount: amount,
		sender: sender,
		chitId: chitId,
		transactionId: uuid().split('-').join('')
	};

	return newTransaction;
};




Blockchain.prototype.createNewChit = function (chitAmount, sender, chitTime) {
	const newChit = {
		chitAmount: chitAmount,
		sender: sender,
		chitTime: chitTime,
		chitMon: chitAmount / chitTime,
		ChitId: uuid().split('-').join('')
	};

	return newChit;
};







Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};



Blockchain.prototype.addChitToPendingChits = function (chitObj) {
	this.pendingChits.push(chitObj);
	return this.getLastBlock()['index'] + 1;
};


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};


Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 4) !== '0000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
};



Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;

	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'], chits: currentBlock['chits'] }, currentBlock['nonce']);
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;
	const correctChits = genesisBlock['chits'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions || !correctChits) validChain = false;

	return validChain;
};


Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};


Blockchain.prototype.getTransaction = function(transactionId) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.transactionId === transactionId) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};



Blockchain.prototype.getChit = function (chitId) {
	let correctChit = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.chits.forEach(chit => {
			if (chit.ChitId === chitId) {
				correctChit = chit;
				correctBlock = block;
			};
		});
	});

	return {
		chit: correctChit,
		block: correctBlock
	};
};






Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	
	let chitID  = null ;
	let balance = null;
	
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.sender === address) {
				addressTransactions.push(transaction);
				chitID = transaction.chitId;
			};
		});
		block.chits.forEach(chit => {
			if (chit.ChitId === chitID) {
				balance = chit.chitAmount ;
			};
		});
	});

	
	/* let RemainAmt = transaction.chitAmount; */ 
	addressTransactions.forEach(transaction => {
		if (transaction.sender === address) {
			balance -= transaction.amount;/*  RemainAmt -= transaction.amount; */ }
		/* else if (transaction.sender === address) amountPayed += transaction.amount; */
	});
	return {
		addressTransactions: addressTransactions,
		addressBalance: balance 
		/* addressRemain : RemainAmt */
	};
};




/* 
Blockchain.prototype.getChitData = function (address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.sender === address || transaction.chitId === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	let chitAmount = chit.chitAmount;
	
	addressTransactions.forEach(transaction => {
		if (transaction.sender === address && chit.chitId === transaction.chitId) {
			chitAmount += transaction.amount;
		}
	
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
		
	};
};
 */




module.exports = Blockchain;














