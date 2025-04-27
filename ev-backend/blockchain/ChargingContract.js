class ChargingContract {
    constructor(parties, terms) {
      this.parties = parties; // [userAddress, stationAddress]
      this.terms = terms; // { ratePerKwh, minDuration, maxDuration }
      this.status = 'pending'; // pending, active, completed, cancelled
      this.startTime = null;
      this.endTime = null;
      this.energyDelivered = 0;
      this.payments = [];
    }
  
    startCharging(startTime) {
      if (this.status !== 'pending') {
        throw new Error('Contract cannot be started in current state');
      }
      this.status = 'active';
      this.startTime = startTime;
    }
  
    recordEnergy(energy) {
      if (this.status !== 'active') {
        throw new Error('Energy can only be recorded during active charging');
      }
      this.energyDelivered += energy;
    }
  
    makePayment(amount, txHash) {
      this.payments.push({ amount, txHash, timestamp: Date.now() });
    }
  
    endCharging(endTime) {
      if (this.status !== 'active') {
        throw new Error('Charging can only be ended when active');
      }
      this.status = 'completed';
      this.endTime = endTime;
    }
  
    cancel() {
      this.status = 'cancelled';
      this.endTime = Date.now();
    }
  
    getContractState() {
      return {
        parties: this.parties,
        terms: this.terms,
        status: this.status,
        startTime: this.startTime,
        endTime: this.endTime,
        energyDelivered: this.energyDelivered,
        payments: this.payments
      };
    }
  }
  
  module.exports = ChargingContract;