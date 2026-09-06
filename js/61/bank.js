const checking = {
    balance: 100,
    performTransaction(amount) {
        this.balance += amount;
        console.log('Transaction of ${amount} performed. New balance: ${this.balance}');
    }
}

const savings = {
    balance: 100,
    performTransaction(amount) {
        this.balance += amount;
        console.log('Transaction of ${amount} performed. New balance: ${this.balance}');
    }
}

console.log('Initial checking balance: ${checking.balance}');
checking.performTransaction(50);
console.log('Checking balance after deposit: ${checking.balance}');


console.log('Initial savings balance: ${savings.balance}');
savings.performTransaction(-30);
console.log('Savings balance after withdrawal: ${savings.balance}');