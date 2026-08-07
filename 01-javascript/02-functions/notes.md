#Functions are First-class Citizens#
  funccction are values.

  "return" Gives a value back to the code that called the function.

  <!-- callback -->
  A callback is simply: A function passed into another function so that the receiving function can decide when to execute it.

  #Function Declarations vs Function Expressions#
    <!-- Function Declaration -->
    function greet() {
      console.log("Hello");
    }
    <!-- Function Expression -->
    const greet = function () {
      console.log("Hello");
    };

  <!-- #Parameter -->
  A parameter is a variable that belongs to the function definition.
  function greet(name) {
    // name is a parameter
  }
  <!-- #Argument -->
  An argument is the actual value you pass into the function.

  // Too few arguments
  function greet(name) {}
  greet();

  JavaScript says: "Missing argument? I'll use undefined."

  // Too many arguments
  function greet(name) {}

  greet("Jordan", 25, true);

  JavaScript says: "Extra arguments? I'll ignore them."

  <!-- Rest Params -->
  function sum(...numbers) {
    console.log(numbers);
  }

  sum(10, 20, 30, 40);

  The rest operator (...) collects any number of arguments into a single array, allowing a function to accept a variable number of arguments.
  Rest parameters collect arguments into an array so you can immediately use all the powerful array methods on them.

  The Rule
  The rest parameter must always be last. This is valid:
  function show(first, second, ...rest) {}

  *This is NOT valid:
  function show(...rest, last) {}
  Why? Because JavaScript wouldn't know where to stop collecting arguments for rest.

  A return inside a loop ends both the loop and the entire function immediately.

  <!-- Array Methods & Higher-Order Functions -->
  A higher-order function is a function that:
  Accepts one or more functions as arguments, or
  Returns a function.

  <!-- map() -->
  numbers = [2, 4, 6]
  const result = numbers.map(num => num + 1);
  result  = [3, 5, 7]
The original array is untouched.
That's one of the reasons map() is so popular in modern JavaScript and React—it creates a new array instead of modifying the existing one.
map() doesn't care what type it returns.
It can transform:
String → Number ✅
Number → String ✅
Object → String ✅
Number → Boolean ✅
Anything → Anything ✅

That's why it's incredibly powerful.

<!-- find() -->
const product = products.find(item => item.id === 2);
console.log(product);

find() stops when the callback returns true for the first time, and it returns the corresponding element.

<!-- some() -->
Think of some() as asking:
"Does ANYONE qualify?"
The moment it finds one match..

<!-- every() -->
every() keeps checking until it finds one failure.

const scores = [80, 95, 72, 88];
const passed = scores.every(score => score >= 50);
console.log(passed);

<!-- reduce() -->
const numbers = [10, 20, 30, 40];
const total = numbers.reduce((sum, num) => sum + num, 0);
That 0 is the starting value of sum. sum is the running total (or accumulator). It stores the result from the previous iteration and carries it into the next one.


map()	Transform every element	New array
filter()	Keep matching elements	New array
find()	Get the first matching element	Element or undefined
some()	Check if at least one matches	Boolean
every()	Check if all match	Boolean
reduce()	Combine many values into one	Any value (number, string, object, array, etc.)

<!-- Destructuring -->
const car = {
  brand: "Toyota",
  year: 2022,
  color: "Black"
};
const { brand, year } = car;
console.log(brand);
console.log(year);

const car = {
  brand: "Toyota"
};
const {
  brand,
  year = 2024,
  color = "Black"
} = car;
brand → "Toyota"
year → 2024   (default used)
color → "Black" (default used)

const user = {
  name: "Jordan",
  age: 25
};
const { name: userName } = user;
console.log(userName);
It means:

"Take the name property and store it in a variable called userName."
It's equivalent to writing:
const userName = user.name;

/
<!-- Array destructuring -->
const fruits = ["Apple", "Banana", "Orange"];
const [first, second] = fruits;
console.log(first);
console.log(second);
console.log(fruits[2]);

<!-- Rest operator with Array destructuring -->
const numbers = [10, 20, 30, 40, 50];
const [first, ...rest] = numbers;
console.log(first);
console.log(rest);

<!-- spread operator -->
Is it collecting values or spreading them?
That's the entire difference between rest and spread

const a = [1, 2, 3];
const b = [...a];
b.push(4);
console.log(a);
still prints:
[1, 2, 3]
because b is a copy.

<!-- spreading object -->
Notice the pattern?

For arrays:
const newArray = [...oldArray, newItem];
For objects:
const newObject = {
  ...oldObject,
  newProperty: value
};
Same operator.
Same idea.
Create a new value while keeping the existing contents.

<!-- Async JS -->
Whenever you see:
setTimeout(callback, 0);
don't think: "Run this immediately."
Think:
"Run this later, after the current synchronous work is finished."

That's a very important distinction.

Rule 1:
Synchronous code runs before asynchronous callbacks
console.log("A");
setTimeout(() => {
  console.log("B");
}, 0);
console.log("C");

Output:
A
C
B

Rule 2:
Among timers that are ready, the callback whose timer becomes ready first gets a chance to execute first.
That's why:
setTimeout(..., 1000); // "2"
setTimeout(..., 0);    // "3"
produces:
3
2

<!-- Promise -->
Promise callbacks get priority over timer callbacks once the current synchronous code finishes.
Synchronous code
↓
Microtasks (Promises)
↓
Tasks / timer callbacks

          JavaScript starts
                │
                ▼
        ┌───────────────┐
        │ Synchronous   │
        │     code      │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Microtasks    │
        │  Promise.then │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │ Tasks         │
        │ setTimeout    │
        └───────────────┘

        A JavaScript Promise can be in one of the three states;
        Pending
         ↓
       ┌───────────┐
       ▼           ▼
      Fulfilled   Rejected

const promise = new Promise((resolve, reject) => {
  resolve("Success!");
});

resolve() means: "The operation succeeded, and here's the result."
So this Promise becomes:
fulfilled
   ↓
"Success!"

We can retrieve that result using .then():
promise.then((result) => {
  console.log(result);
});
Output: Success!
.then() doesn't exactly "retrieve" the value from the Promise like accessing a property. It registers a callback that will receive the fulfilled value when the Promise fulfills.

const promise = new Promise((resolve, reject) => {
  resolve("Hello Jordan");
});

There are three important things here.

1. new Promise(...)
Creates a Promise.
Initially, conceptually:
Promise
   ↓
Pending
2. resolve("Hello Jordan")
This changes the Promise to:
Pending
   ↓
Fulfilled
   ↓
"Hello Jordan"
The value "Hello Jordan" becomes the fulfillment value.

3. .then()
promise.then((result) => {
  console.log(result);
});

The callback receives:
result
   ↓
"Hello Jordan"

So:
resolve("Hello Jordan")
          ↓
    Promise fulfills
          ↓
      .then(...)
          ↓
result = "Hello Jordan"


const promise = new Promise((resolve, reject) => {
  reject("Something went wrong!");
});
Now the Promise becomes:
Pending
   ↓
Rejected
   ↓
"Something went wrong!"
To handle the rejection, we use .catch():
promise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
If the Promise fulfills: then() runs
If it rejects: catch() runs

<!-- promise chaining -->
Promise.resolve(10)
  .then((num) => {
    return num + 5;
  })
  .then((result) => {
    return result * 2;
  })
  .then((finalResult) => {
    console.log(finalResult);
  });


  Whenever you see:
promise
  .then((value) => {
    return something;
  })
  .then((value) => {
    return somethingElse;
  })
  .then((value) => {
    // ...
  });
Think:
Promise
  ↓
value
  ↓
.then()
  ↓
return new value
  ↓
new Promise
  ↓
.then()
  ↓
return another value
  ↓
new Promise

Each .then() passes its returned value to the next .then().

A catch() can recover from an error and continue the Promise chain.
That's a very important concept because real API requests can fail, and you often want to handle the failure and then decide what should happen next.