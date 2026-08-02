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