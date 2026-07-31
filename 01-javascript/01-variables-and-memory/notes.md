a variable binds a value
Primitive values
let age = 25;
let otherAge = age;

The values behave independently when assigned.

Objects
const user = { name: "Jordan" };
const person = user;
Both bindings refer to the same object.

person.name = "Peter";
console.log(user.name); // Peter

#STACK#
  is a pile of info JS uses while executing code. it follows the order "Last In First Out"

When a function is called:

  function called
      ↓
  execution context created
      ↓
  placed on call stack
      ↓
  function executes
      ↓
  function finishes
      ↓
  execution context removed

  Call stack → tracks active execution contexts/function calls.
Objects → are managed through memory that we commonly visualize as the heap.
Variables/bindings → provide names through which your code accesses values.

#SCOPE#
When looking for a variable, JavaScript starts in the current scope and searches outward through its lexical scope chain.

Think:

inner
  ↓
outer
  ↓
global

It searches outward until it finds the binding.

If it reaches the end and can't find it:

ReferenceError


#HOISTING#
console.log(name);

var name = "Jordan";
Conceptually, JavaScript treats the declaration somewhat like:

var name;

console.log(name);

name = "Jordan";

So the output is:

undefined

This behavior is commonly described as hoisting.

The declaration is processed before the code executes.

But let and const are different

console.log(name);

let name = "Jordan";

This doesn't produce undefined.
It produces:
ReferenceError
And:
console.log(name);
const name = "Jordan";
also produces: ReferenceError

Temporal Dead Zone (TDZ)
Between entering the scope and reaching the actual declaration:

let name = "Jordan";

the variable exists in the scope, but you cannot access it yet.

That period is called the Temporal Dead Zone.

Conceptually:

Scope begins
     │
     ▼
┌─────────────────────┐
│ Temporal Dead Zone  │
│                     │
│ name exists, but    │
│ cannot be accessed  │
└─────────────────────┘
     │
     ▼
let name = "Jordan"
     │
     ▼
name can now be accessed

console.log(name); // ❌ TDZ

let name = "Jordan";

The issue isn't that JavaScript doesn't know name exists.

The issue is:
name cannot be accessed before its declaration is reached.

#Functions are First-class Citizens#
  funccction are values.

  "return" Gives a value back to the code that called the function.

  <!-- callback -->
  A callback is simply: A function passed into another function so that the receiving function can decide when to execute it.