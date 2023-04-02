// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-03-30T17:01:17.194Z",
    "2023-04-01T23:36:17.929Z",
    "2023-04-02T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
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


// 1=timeout clear
window.addEventListener('click',()=>{
  clearInterval(timer);
  timer = startLogOutTimer();

})
// 2=dates
const formatMovementDate=function(date,locale){

  const calcDaysPassed = (date1, date2) =>
   Math.round( Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  
  const daysPassed=calcDaysPassed(new Date(),date)
  
  if(daysPassed===0) return 'Today';
  if(daysPassed===1) return 'Yesterday';
  if(daysPassed<=7) return `${daysPassed} days ago`
  else{
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }  
}

const formatCur=function(value,locale,currency){
  return new Intl.NumberFormat(locale,{
    style:'currency',
    currency:currency,
  }).format(value)
}

// 3=Display movemenets
const displayMovements=function(acc,sort=false){
  containerMovements.innerHTML='';
  // sort
  const movs=sort?acc.movements.slice().sort((a,b)=>a-b):acc.movements
  movs.forEach((mov,i) => {
    const type=mov>0?'deposit':'withdrawal'

    const date = new Date(acc.movementsDates[i]);
    const displayDate=formatMovementDate(date,acc.locale);     

    const formattedMov=formatCur(mov,acc.locale,acc.currency) 

    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
   </div>`; 
   containerMovements.insertAdjacentHTML("afterbegin", html);   
  });  
}

// 4=Balance calculation

// const calcPrintBalance=function(accs){
// accs.forEach((acc)=>{
//   acc.balance=acc.movements.reduce((acc,cur)=>acc+cur,0);
//   labelBalance.textContent=accounts[0].balance
// })
// }
// calcPrintBalance(accounts)
// console.log(account1);
const calcDisplayBalance=function(acc){
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency); ;
}

// 5=display summary calculation
const calcDisplaySummary=function(acc){
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);


  // const interest=movements
  // .filter(mov=>mov>0)
  // .reduce((acc,mov)=>acc+mov,0)*account1.interestRate/100

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov, i, arr) => {
      // console.log(mov,arr,i)
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(
    interest,
    acc.locale,
    acc.currency
  );
}

// 6=create user names
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

// 7=update UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
  };

// 8=timer
  const startLogOutTimer = function () {
    const tick=function(){
      const min=String(Math.trunc(time/60)).padStart(2,0);
      const sec=String(time%60).padStart(2,0);
      labelTimer.textContent =`${min}:${sec}`
      
      if(time===0){
        clearInterval(timer);
      labelWelcome.textContent='Log in to get started';
      containerApp.style.opacity=0;
      }
      time--;
    }
    let time = 30;
    tick();
    const timer=setInterval(tick,1000);
    return timer
  };
  
// Event handler
// fake always logged in
// currentAccount=account1;
// updateUI(currentAccount);
// containerApp.style.opacity=100;

// experiment date API

// const now=new Date();
// const options = {
//   hour: "numeric",
//   minute: "numeric",
//   day: "numeric",
//   month: "numeric",
//   year: "numeric",
//   // weekday: "long",
// };

// labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale, options).format(now)
// iso language code table

// 9=login
let currentAccount, timer;

btnLogin.addEventListener('click',function(e){
e.preventDefault();
currentAccount=accounts
.find(acc=>acc.username===inputLoginUsername.value)

if(currentAccount?.pin===Number(inputLoginPin.value)){
  //  display Ui and message
  labelWelcome.textContent = `Welcome Back ${
    currentAccount.owner.split(" ")[0]
  }`;
  containerApp.style.opacity = 100;

  // create current DATES

  // date API

  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    // weekday: "long",
  };
  const local = navigator.language;
  
  labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);
  // iso language code table

  // DATE biz yaptik
  // const now = new Date();
  // const day = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const min = `${now.getMinutes()}`.padStart(2, 0);
  // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
  // clear input fields
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();

  if(timer)clearInterval(timer)

  timer=startLogOutTimer();

  // UPDATE UI
  updateUI(currentAccount);
}
})

// 10=transfer money
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
      // add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      // UPDATE UI
      updateUI(currentAccount);
      // resettimer
      clearInterval(timer);
      timer=startLogOutTimer();
    }
});

//11= LOAN
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Math.floor(inputLoanAmount.value);
  if(amount>0 &&
    currentAccount.movements.some(mov=>mov>=amount*0.1)){
      setTimeout(() => {
        currentAccount.movements.push(amount);
        // add loan date
        currentAccount.movementsDates.push(new Date().toISOString());

        // update UI
        updateUI(currentAccount);
        // resettimer
        clearInterval(timer);
        timer = startLogOutTimer();
      }, 2000);

  }
  inputLoanAmount.value='';
})

// 12=close account
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

//13= SORTING
let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount,!sorted);
  sorted=!sorted
})

/////////////////////////////////////////////////
// STUDY

// settimeout
// const ingredients = ["olives", "spinach"];
// const pizzaTimer=setTimeout(
//   (ing1, ing2) => console.log(`here you pizze ${ing1} and ${ing2}`),
//   1000,
//   ...ingredients
// );

// console.log('waiting')

// if(ingredients.includes('spinach')) clearTimeout(pizzaTimer)

// // set interval
// setInterval(()=>{
// // console.log(new Date());
// },1000)
// intl number format

// const num=3884764.23;
// const options={
//   style:'unit',
//   unit:'mile-per-hour'
// }

// console.log("US:", new Intl.NumberFormat("en-US",options).format(num));
// console.log("Germany:", new Intl.NumberFormat("de-DE",options).format(num));
// console.log("Syria:", new Intl.NumberFormat("ar-SY",options).format(num));

// dates

// const future=new Date(2037,10,19,15,23)

// console.log(+future);

// const calc=(date1,date2)=>(Math.abs(date2-date1))/(1000*60*60*24)

// const days1=calc(new Date(2037,03,4),new Date(2037,03,14))
// console.log(days1);
// remainder operator %

// document.querySelector(".movements").addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (mov, i) {
//     if (i % 2 === 0) {
//       mov.style.backgroundColor = "orangered";
//     }
//   });
// });

// 1=example
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(bankDepositSum);

// 2=example
// const numDeposits1000 = accounts
//   .flatMap((acc) => acc.movements)
//   // .filter((mov) => mov >= 1000);
//   .reduce((count,cur)=>cur>=1000?++count:count,0)

// console.log(numDeposits1000);

// prefixed ++ operator
// let count=10;
// count++

// console.log(++count);

// 3=example

// const sum = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sum, cur) => {
//       cur > 0 ? (sum.deposits += cur) : (sum.withdrawals += cur);
//       return sum;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );


// console.log(sum);
// const { deposits, withdrawals} = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sum, cur) => {
//       // cur > 0 ? (sum.deposits += cur) : (sum.withdrawals += cur);
//       sum[cur>0?'deposits':'withdrawals']+=cur;
//       return sum;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// 4=example

// const convertTitleCase=function(title){
//   const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
//   const exeptions=[ 'a','an','and','the','but','or','on','in','with']
//   const titleCase = title
//     .toLowerCase()
//     .split(" ")
//     .map((word) => (exeptions.includes(word) ? word : capitalize(word)))
//     .join(" ");
//   return capitalize(titleCase)
// }
// console.log(convertTitleCase("this is a nice title"));
// console.log(convertTitleCase("this is a LONG title but not too long"));
// console.log(convertTitleCase("and here is another title with an EXAMPLE"));





// FILL METHOD

// const arr=[1,2,3,4,5,6,7];
// console.log(arr);
// console.log(new Array(1,2,3,4,5,6,7));
// const x=new Array(7)
// console.log(x);
// x.fill(1, 3,5)

// console.log(x);
// arr.fill(23, 4,6)
// console.log(arr);

// // Array.from
// const y=Array.from({length:7},(_,i)=>i+1)

// console.log(y);

// const k=Array.from({length:100},(curr,i)=>Math.trunc(Math.random()*6+1))

// console.log(k);

// labelBalance.addEventListener('click',function(){

//   const movemenetsUI=Array.from(document.querySelectorAll('.movements__value'),(el) => Number(el.textContent.replace("€", "")));
//   // const moves = movemenetsUI.map((el) => Number(el.textContent.replace("€", "")));

//   const movemenetsUI2=[...document.querySelectorAll('.movements__value')]

//   console.log(movemenetsUI.reduce((acc, cur) => acc + cur, 0));
//   console.log(movemenetsUI2);
// })
// SORTING

// ascending
// account1.movements.sort((a,b)=>{
//   // if(a>b) return 1
//   // if(a<b) return -1
//   a-b
// })
// account1.movements.sort((a, b) => b - a);

// console.log(account1.movements);


// // descending
// // account1.movements.sort((a, b) => {
// //   // if (a > b) return -1;
// //   // if (a < b) return 1;

// // });
// account1.movements.sort((a,b)=>a-b)
// console.log(account1.movements);


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


