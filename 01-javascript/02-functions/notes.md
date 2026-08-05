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
