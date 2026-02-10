// Chart of Accounts
let accounts = [
  { name: "Cash", type: "Asset" },
  { name: "Bank", type: "Asset" },
  { name: "Capital", type: "Equity" },
  { name: "Loan", type: "Liability" },
  { name: "Sales", type: "Revenue" },
  { name: "Rent Expense", type: "Expense" }
];

// Load journal from localStorage
let journal = JSON.parse(localStorage.getItem("journal")) || [];

// Populate account dropdowns
function loadAccounts() {
  const debit = document.getElementById("debit");
  const credit = document.getElementById("credit");

  accounts.forEach(acc => {
    let option1 = document.createElement("option");
    option1.value = acc.name;
    option1.text = acc.name;
    debit.appendChild(option1);

    let option2 = document.createElement("option");
    option2.value = acc.name;
    option2.text = acc.name;
    credit.appendChild(option2);
  });
}

loadAccounts();

// Add Journal Entry
function addEntry() {
  const date = document.getElementById("date").value;
  const debit = document.getElementById("debit").value;
  const credit = document.getElementById("credit").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (!date || !amount) {
    alert("Fill all fields");
    return;
  }

  journal.push({ date, debit, credit, amount });
  localStorage.setItem("journal", JSON.stringify(journal));

  alert("Entry added!");
}

// Generate Trial Balance
function showTrialBalance() {
  let balances = {};

  accounts.forEach(acc => {
    balances[acc.name] = 0;
  });

  journal.forEach(entry => {
    balances[entry.debit] += entry.amount;
    balances[entry.credit] -= entry.amount;
  });

  let html = "<table><tr><th>Account</th><th>Debit</th><th>Credit</th></tr>";
  let totalDebit = 0;
  let totalCredit = 0;

  for (let acc in balances) {
    if (balances[acc] > 0) {
      html += `<tr><td>${acc}</td><td>${balances[acc]}</td><td></td></tr>`;
      totalDebit += balances[acc];
    } else if (balances[acc] < 0) {
      html += `<tr><td>${acc}</td><td></td><td>${Math.abs(balances[acc])}</td></tr>`;
      totalCredit += Math.abs(balances[acc]);
    }
  }

  html += `<tr><th>Total</th><th>${totalDebit}</th><th>${totalCredit}</th></tr>`;
  html += "</table>";

  document.getElementById("trial").innerHTML = html;
}

// Generate Balance Sheet
function showBalanceSheet() {
  let balances = {};

  accounts.forEach(acc => {
    balances[acc.name] = 0;
  });

  journal.forEach(entry => {
    balances[entry.debit] += entry.amount;
    balances[entry.credit] -= entry.amount;
  });

  let assets = 0;
  let liabilities = 0;
  let equity = 0;

  accounts.forEach(acc => {
    let value = balances[acc.name];

    if (acc.type === "Asset") assets += value;
    if (acc.type === "Liability") liabilities += Math.abs(value);
    if (acc.type === "Equity") equity += Math.abs(value);
  });

  let html = "<table>";
  html += `<tr><th>Assets</th><td>${assets}</td></tr>`;
  html += `<tr><th>Liabilities</th><td>${liabilities}</td></tr>`;
  html += `<tr><th>Equity</th><td>${equity}</td></tr>`;
  html += "</table>";

  document.getElementById("balanceSheet").innerHTML = html;
}