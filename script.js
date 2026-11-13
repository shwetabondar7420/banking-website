
// Get saved bank account
function getAccount() {
    return JSON.parse(localStorage.getItem("smartBankAccount"));
}

// Save bank account
function saveAccount(account) {
    localStorage.setItem("smartBankAccount", JSON.stringify(account));
}

// Display messages
function showMessage(text, color = "green") {
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.color = color;
}

// Generate account number
function generateAccountNumber() {
    return "SB" + Date.now().toString().slice(-8);
}

// Register new customer
function register() {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pin = document.getElementById("regPin").value;

    if (!name || !email || !pin) {
        showMessage("Please fill all registration fields.", "red");
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showMessage("Enter a valid email address.", "red");
        return;
    }

    if (!/^\d{4}$/.test(pin)) {
        showMessage("PIN must contain exactly 4 digits.", "red");
        return;
    }

    if (getAccount()) {
        showMessage("An account is already registered.", "red");
        return;
    }

    const account = {
        name: name,
        email: email,
        pin: pin,
        accountNumber: generateAccountNumber(),
        balance: 1000,
        transactions: [
            {
                type: "Opening Balance",
                amount: 1000,
                date: new Date().toLocaleString()
            }
        ]
    };

    saveAccount(account);

    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPin").value = "";

    document.getElementById("registerSection").hidden = true;
    document.getElementById("loginSection").hidden = false;

    showMessage(
        "Account created successfully! Your Account Number: " +
        account.accountNumber
    );
}

// Customer login
function login() {
    const accountNumber =
        document.getElementById("loginAccount").value.trim();

    const pin =
        document.getElementById("loginPin").value;

    const account = getAccount();

    if (!account) {
        showMessage("Please register an account first.", "red");
        return;
    }

    if (account.accountNumber !== accountNumber ||
        account.pin !== pin) {
        showMessage("Invalid account number or PIN.", "red");
        return;
    }

    document.getElementById("loginSection").hidden = true;
    document.getElementById("registerSection").hidden = true;
    document.getElementById("dashboard").hidden = false;

    document.getElementById("loginAccount").value = "";
    document.getElementById("loginPin").value = "";

    updateDashboard();
    showMessage("Login successful!");
}

// Update dashboard
function updateDashboard() {
    const account = getAccount();

    document.getElementById("customerName").textContent =
        account.name;

    document.getElementById("accountNumber").textContent =
        account.accountNumber;

    document.getElementById("balance").textContent =
        account.balance.toFixed(2);
}

// Get transaction amount
function getAmount() {
    const amount = Number(
        document.getElementById("amount").value
    );

    if (!Number.isFinite(amount) || amount <= 0) {
        showMessage("Enter a valid amount.", "red");
        return null;
    }

    if (Math.round(amount * 100) !== amount * 100) {
        showMessage("Enter maximum 2 decimal places.", "red");
        return null;
    }

    return amount;
}

// Deposit money
function deposit() {
    const amount = getAmount();

    if (amount === null) return;

    const account = getAccount();

    account.balance += amount;

    addTransaction(account, "Deposit", amount);

    saveAccount(account);
    updateDashboard();

    document.getElementById("amount").value = "";

    showMessage("Money deposited successfully!");
}

// Withdraw money
function withdraw() {
    const amount = getAmount();

    if (amount === null) return;

    const account = getAccount();

    if (amount > account.balance) {
        showMessage("Insufficient balance!", "red");
        return;
    }

    account.balance -= amount;

    addTransaction(account, "Withdrawal", amount);

    saveAccount(account);
    updateDashboard();

    document.getElementById("amount").value = "";

    showMessage("Money withdrawn successfully!");
}

// Add transaction
function addTransaction(account, type, amount) {
    account.transactions.unshift({
        type: type,
        amount: amount,
        date: new Date().toLocaleString()
    });
}

// Show transaction history
function showHistory() {
    const account = getAccount();
    const list = document.getElementById("transactionList");
    const history = document.getElementById("history");

    list.replaceChildren();

    account.transactions.forEach(function(transaction) {
        const item = document.createElement("li");

        item.textContent =
            transaction.type + " - ₹" +
            transaction.amount.toFixed(2) +
            " | " + transaction.date;

        list.appendChild(item);
    });

    history.hidden = !history.hidden;
}

// Logout
function logout() {
    document.getElementById("dashboard").hidden = true;
    document.getElementById("loginSection").hidden = false;
    document.getElementById("history").hidden = true;
    document.getElementById("amount").value = "";

    showMessage("You have logged out successfully!");
}

// Initial page setup
window.onload = function() {
    const account = getAccount();

    if (account) {
        document.getElementById("registerSection").hidden = true;
    } else {
        document.getElementById("loginSection").hidden = true;
    }
};
