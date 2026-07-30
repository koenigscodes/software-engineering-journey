// Tracing call stack
// const username = "Jordan";

// function first() {
//   const message = "Hello";

//   function second() {
//     const greeting = "Welcome";
//     console.log(greeting);
//   }

//   second();

//   console.log(message);
// }

// first();

// console.log(username);

// // Trace the call stack
// const x = 10;

// function outer() {
//   const y = 20;

//   function inner() {
//     const z = 30;
//     console.log(x);
//     console.log(y);
//     console.log(z);
//   }

//   inner();

//   console.log(y);
// }

// outer();

// console.log(x);
// // Answer
// 10

// 20

// 30

// 20

// 10

// // SCOPE
// const a = 10;

// function outer() {
//   const b = 20;

//   function inner() {
//     const c = 30;

//     console.log(a);
//     console.log(b);
//     console.log(c);
//   }

//   console.log(a);
//   console.log(b);

//   inner();
// }

// outer();

// console.log(a);

// Exercises
// #Reassignment
let score = 50;
score = 75;
console.log(score);
// let allows variable binding to be reassigned

// #const and mutation
const user = {
  name: "Jordan",
  age: 25
};

user.age = 26;
console.log(user);

let a = 10;
let b = a; 
b = 20; 
console.log(a);
console.log(b);

const user1 = {
  name: "Jordan"
};
const person = user1;
person.name = "Alex";
console.log(user1.name);
console.log(person.name);

const globalValue = "global";

function outer() {
  const outerValue = "outer";

  function inner() {
    const innerValue = "inner";

    console.log(globalValue);
    console.log(outerValue);
    console.log(innerValue);
  }
  // console.log(innervalue)
  inner();
}

outer();

function createCounter() {
  let count = 0;
  return (function counter() {
    count++;
    console.log(count);
  })
  counter();
  counter();
  counter();
};

const counterA = createCounter();
const counterB = createCounter();

counterA();
counterA();
counterB();
counterA();
counterB();
