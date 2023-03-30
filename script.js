// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// 1=Display movemenets
const displayMovements=function(movements){
  containerMovements.innerHTML='';
  movements.forEach((mov,i) => {
    const type=mov>0?'deposit':'withdrawal'
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
   </div>`; 
   containerMovements.insertAdjacentHTML("afterbegin", html);   
  });  
}

// 2=Balance calculation

// const calcPrintBalance=function(accs){
// accs.forEach((acc)=>{
//   acc.balance=acc.movements.reduce((acc,cur)=>acc+cur,0);
//   labelBalance.textContent=accounts[0].balance
// })
// }
// calcPrintBalance(accounts)
// console.log(account1);
const calcDisplayBalance=function(acc){
  acc.balance=acc.movements.reduce((acc,mov)=>acc+mov,0);
  labelBalance.textContent = `${acc.balance}€`;
}


// display summary calculation
const calcDisplaySummary=function(acc){
  const incomes=acc.movements
  .filter(mov=>mov>0)
  .reduce((acc,mov)=>acc+mov,0)
  labelSumIn.textContent = `${incomes}€`;

  const out=acc.movements
  .filter(mov=>mov<0)
  .reduce((acc,cur)=>acc+cur,0)
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // const interest=movements
  // .filter(mov=>mov>0) 
  // .reduce((acc,mov)=>acc+mov,0)*account1.interestRate/100
  
  const interest=acc.movements
  .filter(mov=>mov>0)
  .map(mov=>mov*acc.interestRate/100)
  .filter((mov,i,arr)=>{
    // console.log(mov,arr,i)
    return mov>=1
  })
  .reduce((acc,mov)=>acc+mov,0);
  labelSumInterest.textContent = `${interest}€`;
 }

// 3=create user names
const createUsernames=function(accs){
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
    
  });
};
createUsernames(accounts);

// update UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};

// Event handler
// login
let currentAccount;

btnLogin.addEventListener('click',function(e){
e.preventDefault();
currentAccount=accounts
.find(acc=>acc.username===inputLoginUsername.value)

if(currentAccount?.pin===Number(inputLoginPin.value)){
//  display Ui and message
labelWelcome.textContent=`Welcome Back ${currentAccount.owner.split(' ')[0]}`
containerApp.style.opacity=100;
// clear input fields
inputLoginUsername.value=inputLoginPin.value='';
inputLoginPin.blur();

// UPDATE UI
updateUI(currentAccount)
}
})

// transfer money

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value);
  const receiverAcc=accounts.find(acc=>acc.username===inputTransferTo.value);
 
  inputTransferAmount.value=inputTransferTo.value='';
  if(amount>0 &&
    receiverAcc&&
    currentAccount.balance>=amount &&
    receiverAcc?.username!==currentAccount.username){
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      // UPDATE UI
      updateUI(currentAccount);
    }else {
     alert('Transaction is not valid')
    }
});

// LOAN

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value);
  if(amount>0 &&
    currentAccount.movements.some(mov=>mov>=amount*0.1)){
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount)
  }else{
    alert("Amount is too much");
  }
  inputLoanAmount.value='';
})

// close account

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  
  if(currentAccount.username===inputCloseUsername.value&&
     currentAccount.pin===Number(inputClosePin.value)){
      const index=accounts.
      findIndex(acc=>acc.username===currentAccount.username)
      
      // delete account
      accounts.splice(index,1);
      // hide UI
      containerApp.style.opacity=0;
     }
     inputCloseUsername.value = inputClosePin.value = "";
})

/////////////////////////////////////////////////
// STUDY



// const euroToUsd=1.1;
// const movements= [200, 450, -400, 3000, -650, -130, 70, 1300];

// FLAT METHOD

// const arr=[[1,2,3],[4,5,6],7,8]
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];

// console.log(arr.flat());
// console.log(arrDeep.flat());
// console.log(arrDeep.flat(2));

// const accMov=accounts.map(acc=>acc.movements)
// console.log(accMov);
// console.log(accMov.flat());
// console.log(accMov.flat().reduce((acc, cur) => acc + cur, 0));

// const overalBalance=accounts
// .map(acc=>acc.movements)
// .flat()
// .reduce((acc,cur)=>acc+cur,0)
// console.log(overalBalance);

// const overAll=accounts
// .flatMap(acc=>acc.movements)
// .reduce((acc,cur)=>acc+cur,0);

// console.log(overAll);

// EVERY METHOD

// console.log(movements.every((mov) => mov > 0));
// console.log(account4.movements.every((mov) => mov > 0));
// const deposit=mov=>mov>0;
// console.log(movements.some(deposit));


// some method
// quality checks
// console.log(movements.includes(200));
// // condition checks
// console.log(movements.some(mov=>mov>0));

// find method  ilki doner array yapmaz
// const firstW=movements.find(mov=>mov<0)
// console.log(firstW);

// const account = accounts.find((acc) => acc.owner === 'Jessica Davis');

// let customer=[];
// for( const account of accounts){
//   if(account.owner === "Jessica Davis"){
//     customer=account
//   };
// }
// console.log(customer);

// // chain methods
// const totalDepUsd=movements
// .filter(mov=>mov>0)
// .map((mov,i,arr)=>{
//   console.log(arr,i);
//   return mov*euroToUsd
// })
// // .map(mov=>mov*euroToUsd)
// .reduce((acc,mov)=>acc+mov,0)

// console.log(totalDepUsd);

// REDUCE METHOD

// max value
// const max1=movements.reduce((acc,mov)=>{
//   if(acc>mov){
//     return acc
//   }else{
//     return mov
//   }
// },movements[0])
// console.log(max1);
// const max=movements.reduce((acc,mov)=>acc>mov?acc:mov)
// console.log(max);



// const balance=movements.reduce(function(acc,cur,i,arr){
//   console.log(`iteration ${i}:${acc}`);
// return acc+cur

// },0);

// const balance=movements.reduce((acc,cur)=>acc+cur,0)
// console.log(balance);

// let sum=0;
// for (const mov of movements){
//   sum+=mov
// }
// console.log(sum);

// filter METHOD

// const deposit=movements.filter(function(mov){
//   return mov>0
//   // mov=>mov>0
// })
// const deposit=movements.filter(mov=>mov>0)

// const dep=[];
// for(const mov of movements){
//   if(mov>0){dep.push(mov)}
//   } 

// console.log(movements);
// console.log(deposit);
// console.log(dep);

// const euroToUsd = 1.1;
// const movementsUsd = account1.movements.map(mov => mov * euroToUsd);
// console.log(movements);
// console.log(movementsUsd);

// const movUsd = [];
// for (const mov of movements) {
//   movUsd.push(mov * euroToUsd);
// }
// console.log(movUsd);

// const movDesc=movements.map((mov,i)=>
//   // const type=mov>0?'deposit':'withdrawal'
//   // if(mov>0){
//   //   return `Movement ${i+1}: You ${type} ${mov} `
//   // }else{
//   //   return `Movement ${i+1}: You ${type} ${Math.abs(mov)}`
//   // }
//   `Movement ${i + 1}: You ${
//     mov > 0 ? "deposit" : "withdrawal"
//   } ${Math.abs(mov)}`
// )

// console.log(movDesc);

// let arr=['a','b','c','d','e']

// slice method orjinal degismez
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1,-2));
// console.log(arr.slice())
// // ; copy creates
// console.log([...arr]);

// splice method orjinal degisir
// arr.splice(-1)
// console.log(arr.splice(1,2));
// // ikinci parametre kac elemen silinecek gosteryor index degil
// console.log(arr);

// REVERSE
// arr = ["a", "b", "c", "d", "e"];
// const arr2=[ 'j','i','h','g','f']
// console.log(arr2.reverse())
// console.log(arr2);
// mutate original array

// CONCAT
// const letters=arr.concat(arr2)
// console.log(letters);
// console.log([...arr,...arr2]);
// SPREAD operator
// does not mutate the original arrays

// JOIN 
// console.log(letters.join('-'));
// convert string yani normal harfler

// AT METHOD
// const arr=[23,11,64]
// console.log(arr[0]);
// console.log(arr.at(0));

// unutma index 0 dan baslar yani saymaya 0 dan baslarsin
// ama length lazim ise saymak 1 den baslar

// console.log(arr[arr.length-1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// at works for both array and string
// console.log('jonas'.at(-1));

// FOR of METHOD
// const movements=[200, 450, -400, 3000, -650, -130, 70, 1300];

// for(const movement of movements){
//   if(movement>0){
//     console.log(`you deposited ${movement}`);
//   }else{
//     console.log(`you withdraw ${movement}`);
//   }
// }

// for(const [i,movement] of movements.entries()){
//   if(movement>0){
//     console.log(`Movement ${i+1} : you deposited ${movement}`);
//   }else{
//     console.log(`Movement ${i+1} : you withdraw ${movement}`);
//   }
// }

// FOREACH METHOD

// movements.forEach((movement,i)=>{
//   if (movement > 0) {
//     console.log(` ${i+1} : you deposited ${movement}`);
//   } else {
//     console.log(` ${i + 1} :you withdraw ${movement}`);
//   }
// })

// movements.forEach((movement,i) => {
//   movement > 0
//     ? console.log(`${i + 1} :you deposited ${movement}`)
//     : console.log(`${i + 1} :you withdraw ${movement}`);  
// });

///////////////////////////////////////
// forEach With Maps and Sets
// Map
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach((value,key,map)=>{
//   console.log(`${key} : ${value}`);
// })

// set
// const currUnic = new Set(["USD", "USD", "USD", "EUR", "EUR", "GBP", "GBP",'u']);
// console.log(currUnic);
// currUnic.forEach((value,_,set)=>{
//   console.log(`${value} : ${value}`)
// })


