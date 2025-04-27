const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const crypto = require('crypto');
const Transaction = require('./transaction');

class Wallet {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic('hex');
    this.privateKey = this.keyPair.getPrivate('hex');
    this.balance = 0;
  }

  createTransaction(toAddress, amount, data = {}) {
    if (amount > this.balance) {
      throw new Error('Not enough balance');
    }

    const transaction = new Transaction(
      this.publicKey,
      toAddress,
      amount,
      data
    );
    transaction.signTransaction(this.keyPair);

    return transaction;
  }

  sign(data) {
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    const signature = this.keyPair.sign(hash, 'base64');
    return signature.toDER('hex');
  }

  static verifySignature(publicKey, data, signature) {
    const ec = new EC('secp256k1');
    const key = ec.keyFromPublic(publicKey, 'hex');
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return key.verify(hash, signature);
  }
}

module.exports = Wallet;