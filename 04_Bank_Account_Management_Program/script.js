class BankAccount {
    constructor(name, initialBalance = 0) {
        this.name = name;
        this.balance = parseFloat(initialBalance);
        this.history = [];
        this.recordTransaction('Account Created', this.balance);
    }

    deposit(amount) {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return "Invalid deposit amount.";
        
        this.balance += val;
        this.recordTransaction('Deposit', val);
        return "Success";
    }

    withdraw(amount) {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return "Invalid withdrawal amount.";
        if (val > this.balance) return "Insufficient funds.";

        this.balance -= val;
        this.recordTransaction('Withdrawal', -Math.abs(val));
        return "Success";
    }

    recordTransaction(type, amount) {
        const date = new Date().toLocaleString();
        this.history.unshift({ type, amount, date });
    }

    getBalance() {
        return this.balance;
    }
}

let currentAccount = null;

const createCard = document.getElementById('create-account-card');
const transactionCard = document.getElementById('transaction-card');
const dashboardPanel = document.getElementById('dashboard-panel');
const historyContainer = document.getElementById('history-container');
const systemMessage = document.getElementById('system-message');

const accNameInput = document.getElementById('account-name');
const initDepInput = document.getElementById('initial-deposit');
const createBtn = document.getElementById('create-btn');

const transAmountInput = document.getElementById('transaction-amount');
const depositBtn = document.getElementById('deposit-btn');
const withdrawBtn = document.getElementById('withdraw-btn');

const displayName = document.getElementById('display-name');
const displayBalance = document.getElementById('display-balance');

const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

const updateDashboard = () => {
    displayName.textContent = currentAccount.name;
    displayBalance.textContent = formatCurrency(currentAccount.getBalance());
    
    historyContainer.innerHTML = '';
    
    currentAccount.history.forEach(tx => {
        const div = document.createElement('div');
        div.className = `history-item ${tx.amount >= 0 ? 'deposit' : 'withdraw'}`;
        
        const typeSpan = document.createElement('span');
        typeSpan.textContent = tx.type;
        
        const amountSpan = document.createElement('span');
        amountSpan.textContent = tx.amount >= 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount);
        amountSpan.style.color = tx.amount >= 0 ? 'var(--success)' : 'var(--danger)';
        
        div.appendChild(typeSpan);
        div.appendChild(amountSpan);
        historyContainer.appendChild(div);
    });
};

const showMessage = (msg) => {
    if (msg === "Success") {
        systemMessage.textContent = "";
        transAmountInput.value = "";
    } else {
        systemMessage.textContent = msg;
    }
};

createBtn.addEventListener('click', () => {
    const name = accNameInput.value.trim();
    const initialDeposit = initDepInput.value || 0;

    if (!name) return;

    currentAccount = new BankAccount(name, initialDeposit);
    
    createCard.classList.add('hidden');
    transactionCard.classList.remove('hidden');
    dashboardPanel.classList.remove('hidden');
    
    updateDashboard();
});

depositBtn.addEventListener('click', () => {
    const amount = transAmountInput.value;
    const result = currentAccount.deposit(amount);
    showMessage(result);
    if (result === "Success") updateDashboard();
});

withdrawBtn.addEventListener('click', () => {
    const amount = transAmountInput.value;
    const result = currentAccount.withdraw(amount);
    showMessage(result);
    if (result === "Success") updateDashboard();
});