a variable binds a value

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

