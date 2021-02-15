'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Alex Parashkevov',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1337,
  sex: 'male',
  honorific: 'Mr.',
};

const account2 = {
  owner: 'Denitsa Raykova',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  sex: 'female',
  honorific: 'Ms.',
};

const account3 = {
  owner: 'Ivan Parashkevov',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  sex: 'male',
  honorific: 'Mr',
};

const account4 = {
  owner: 'Kristyan Popov',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  sex: 'male',
  honorific: 'Mr.',
};
const account5 = {
  owner: 'Pavlin Stefanov',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 5555,
  sex: 'male',
  honorific: 'Dr.',
};
const account6 = {
  owner: 'Lina Stefanova',
  movements: [4305, 10000, 7500, -5000, -90],
  interestRate: 1,
  pin: 1506,
  sex: 'female',
  honorific: 'Mrs.',
};

const accounts = [account1, account2, account3, account4, account5, account6];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContent = 0
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (move, i) {
    const type = move > 0 ? 'deposit' : 'withdrawal';
    //template literal
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${move}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, move) {
    return acc + move;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const caldDisplaySumm = function (account) {
  const incomes = account.movements
    .filter(move => move > 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = account.movements
    .filter(move => move < 0)
    .reduce((acc, move) => acc + move, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter(move => move > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.trunc(interest)}€`;
};

/////////////////////////////////////////////////
//create usernames
const createUsernames = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

//same thing with for of
// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     console.log(acc);
//   }
// }
const upDateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  caldDisplaySumm(acc);
};
//EVENT HANDLER
let currAcc;
btnLogin.addEventListener('click', function (event) {
  //prevents form from submitting
  event.preventDefault();
  currAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currAcc);
  if (currAcc?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currAcc.honorific} ${
      currAcc.owner.split(' ')[1]
    }`;
    //display movements
    //balance
    //summary
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //loose focus
    inputLoginPin.blur();
    console.log('LOGIN');
    containerApp.style.opacity = 100;
    //update ui
    upDateUI(currAcc);
  }
});
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    currAcc.balance >= amount &&
    recieverAcc?.username !== currAcc.username
  ) {
    currAcc.movements.push(-amount);
    recieverAcc.movements.push(amount);
    //update ui
    upDateUI(currAcc);
  }
});
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currAcc.movements.some(move => move >= amount * 0.1)) {
    //add movement
    currAcc.movements.push(amount);
    upDateUI(currAcc);
  }
  inputLoanAmount.value = '';
});
//closing account with findindex
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currAcc.username &&
    Number(inputClosePin.value) === currAcc.pin
  ) {
    const index = accounts.findIndex(acc => acc.username === currAcc.username);
    console.log(index);
    //delete account
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
//sorting
let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currAcc.movements, !sorted);
  sorted = !sorted;
});
