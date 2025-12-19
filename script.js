// ================================
// Global variables to track totals
// ================================
let runningIncome = 0;
let runningExpenses = 0;

let totalAmount = document.getElementsByClassName('input-field-transaction-amount');
let transactionDate = document.getElementsByClassName('input-field-date');
let transactionType = document.getElementsByClassName('input-field-transaction-type');
let incomeInput = document.getElementsByClassName('input-field-income');

let addTransactionBtn = document.getElementsByClassName('add-btn');
let transactionTable = document.getElementsByClassName('Transaction-table');

let totalIncome = document.getElementsByClassName('total-income-value');
let totalExpense = document.getElementsByClassName('total-expense-value');
let balanceAmount = document.getElementsByClassName('total-balance-value');

let c_u = JSON.parse(localStorage.getItem('currentUser'));
let users = JSON.parse(localStorage.getItem('users')) || {};

// let existingUser = users.find(user => user.userName === c_u.userName && user.password === c_u.password);

let existingUser = users[c_u.userName];


// ================================
// Initialize table on page load
// ================================
tableCreate();
updateTotals();


// ================================
// Add transaction button click
// ================================
addTransactionBtn[0].addEventListener('click', function() {

    // Get values when button is clicked
    let incomeValue = parseFloat(incomeInput[0].value) || 0;
    let spendingValue = parseFloat(totalAmount[0].value) || 0;
    let date = transactionDate[0].value;
    let type = transactionType[0].value;

    // Validate inputs
    if (!incomeValue || !spendingValue || !date || !type || type === 'Transaction Type') {
        alert('Please fill in all fields');
        return;
    }

    // Add new transaction
    c_u.transactions.push({
        income: incomeValue,
        expense: spendingValue,
        date: date,
        type: type
    });

    tableCreate();

    // Save to localStorage
    if (existingUser) {
        existingUser.transactions = c_u.transactions;
    }
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.setItem('currentUser', JSON.stringify(c_u));

    // Clear input fields
    incomeInput[0].value = '';
    totalAmount[0].value = '';
    transactionDate[0].value = '';
    transactionType[0].selectedIndex = 0;
});


// ================================
// Function: Create table
// ================================
function tableCreate() {
    // Clear existing table rows
    transactionTable[0].innerHTML = `
        <tr id="header-row">
            <th>Amount</th>
            <th>Transaction Type</th>
            <th>Transaction Date</th>
            <th>Action</th>
        </tr>
    `;

    runningIncome = 0;
    runningExpenses = 0;

    // Populate table
    c_u.transactions.forEach(transaction => {
        let newTransaction = document.createElement('tr');
        newTransaction.classList.add('transaction-item');

        newTransaction.innerHTML = `
            <td class="table-rows">${transaction.expense}</td>
            <td class="table-rows">${transaction.type}</td>
            <td class="table-rows">${transaction.date}</td>
            <td>
                <button class="delete-btn" 
                        data-income="${transaction.income}" 
                        data-expense="${transaction.expense}">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                         height="24px" 
                         viewBox="0 -960 960 960" 
                         width="24px" 
                         fill="#e3e3e3">
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40
                                 h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280
                                 v520h400v-520ZM360-280h80v-360h-80v360Zm160
                                 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                </button>
            </td>
        `;

        transactionTable[0].appendChild(newTransaction);

        runningIncome += transaction.income;
        runningExpenses += transaction.expense;

        updateTotals();
    });
}


// ================================
// Function: Update totals
// ================================
function updateTotals() {
    if (totalIncome[0]) {
        totalIncome[0].innerText = runningIncome.toFixed(2);
    }
    if (totalExpense[0]) {
        totalExpense[0].innerText = runningExpenses.toFixed(2);
    }

    let currentBalance = runningIncome - runningExpenses;
    console.log('Calculated Balance:', currentBalance);

    if (balanceAmount[0]) {
        balanceAmount[0].innerText = currentBalance.toFixed(2);
        console.log('Balance updated to:', currentBalance.toFixed(2));
    } else {
        console.error('Balance element not found!');
    }
}


// ================================
// Event Listener: Delete transaction
// ================================
transactionTable[0].addEventListener('click', function(e) {
    // Check if clicked element is delete button or inside delete button
    let deleteButton = e.target.closest('.delete-btn');

    if (deleteButton) {
        // Find the transaction row
        let rowToDelete = deleteButton.closest('tr');
        let rowIndex = Array.from(transactionTable[0].querySelectorAll('.transaction-item')).indexOf(rowToDelete);

        // Remove transaction from array
        if (rowIndex !== -1) {
            c_u.transactions.splice(rowIndex, 1);
        }

        // Save updated list to localStorage
        if (existingUser) {
            existingUser.transactions = c_u.transactions;
        }
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(c_u));

        // Refresh table and totals
        tableCreate();
        updateTotals();
    }
});
