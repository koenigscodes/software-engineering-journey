React components are functions
A component is basically a function that returns UI:

function Welcome() {
  return <h1>Hello Jordan</h1>;
}

function App() {
  return (
    <div>
      <Welcome />
    </div>
  );
}

React calls Welcome() and uses the returned JSX to determine what should appear on the screen.

So you can think:

Component
   ↓
JavaScript function
   ↓
returns JSX
   ↓
React renders UI
2. Components need data

Hard-coding this:

function Welcome() {
  return <h1>Hello Jordan</h1>;
}

isn't very useful.

We want:

<Welcome name="Jordan" />
<Welcome name="Alex" />

That's where props come in.

function Welcome({ name }) {
  return <h1>Hello {name}</h1>;
}

Now:

function App() {
  return (
    <>
      <Welcome name="Jordan" />
      <Welcome name="Alex" />
    </>
  );
}

React gives the component:

{
  name: "Jordan"
}

and destructuring:
function Welcome({ name }) {

pulls name out. This is something you already know from JavaScript.

function App() {
  const [count, setCount] = useState(0);

  return <Counter count={count} setCount={setCount} />;
}

and:

function Counter({ count, setCount }) {
  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      {count}
    </button>
  );
}

App owns the state.

The key is where useState() is called:

const [count, setCount] = useState(0);

That happens inside App, so App owns count.

Counter merely receives the state and its setter:

<Counter count={count} setCount={setCount} />

Think of it as:
App
├── owns count
├── owns setCount
│
└── passes them down
        ↓
     Counter
     ├── reads count
     └── calls setCount()

This is called lifting state up when we move state to the closest common parent that needs to coordinate it.

And there's an important React principle here:
Data flows down through props; 
events/actions flow back up through callback functions.

App
 ↓ count
Counter
 ↓ user clicks
setCount()
 ↓
App's state updates
 ↓
App re-renders
 ↓
new count flows down

Parent
├── quantity
├── setQuantity
└── product
      ↓
   ProductCard
   ├── displays product
   ├── displays quantity
   └── calls setQuantity()



If we had 3 products, we could technically do:
const [quantities, setQuantities] = useState({
  1: 1,
  2: 1,
  3: 1
});

But imagine your API gives us 500 products.
We absolutely do not want to manually write:

1: 1,
2: 1,
3: 1,
4: 1,
5: 1,
...
500: 1

That's not scalable.
So where should the quantities come from?

Usually, the product data itself gives us the IDs, and we create the quantity state dynamically.

For example, if the API gives:

const products = [
  { id: 101, name: "Laptop", price: 1200 },
  { id: 205, name: "Phone", price: 800 },
  { id: 309, name: "Mouse", price: 30 }
];

We can initialize quantities based on those products:

const initialQuantities = products.reduce((quantities, product) => {
  quantities[product.id] = 1;

  return quantities;
}, {});

Result:
{
  101: 1,
  205: 1,
  309: 1
}

Notice that we didn't manually create the IDs.
JavaScript created them from the actual product data.
Then:
const [quantities, setQuantities] = useState(initialQuantities);
Now if tomorrow the API returns 1,000 products, the same logic handles them.


<!-- useEffect + API requests -->
Component renders
      ↓
useEffect runs
      ↓
fetch products
      ↓
response
      ↓
setProducts()
      ↓
React renders products

What does useEffect actually mean?

Think of it as:
"After React renders this component, run this side effect."
Fetching data is a side effect because you're interacting with something outside the component's rendering process.

Other examples include:
API requests
Timers
Subscriptions
Browser APIs
Event listeners

Why the []?

This:

useEffect(() => {
  // ...
}, []);

means:
Run this effect after the component's initial render.
So approximately:

Products renders
      ↓
products = []
      ↓
UI initially renders
      ↓
useEffect runs
      ↓
fetch()
      ↓
data arrives
      ↓
setProducts(data)
      ↓
Products renders again
      ↓
products now contains data


Don't do this:

useEffect(async () => {
  const response = await fetch("/products");
}, []);

You'll sometimes see people try it, but useEffect expects the callback to either return nothing or a cleanup function.
Instead, define the async function inside the effect:

useEffect(() => {
  async function getProducts() {
    const response = await fetch("/products");
    // ...
  }

  getProducts();
}, []);

Or call an existing async function:
useEffect(() => {
  getProducts();
}, []);

From now on, whenever you write a React component, think in this order:
1. Imports
2. State
3. Effects
4. Event handlers
5. Early returns (loading/error/empty)
6. JSX

You can think of your component as having four UI states:
if (loading) return <Loading />;
if (error) return <Error />;
if (users.length === 0) return <EmptyState />;

return <Users />;

<!-- Extracting the API logic -->
We want to separate the API logic from the UI logic

1. Create an API function

Create a file such as:

src/
├── api/
│   └── users.js
└── components/
    └── Users.jsx

Inside users.js:

export async function getUsers() {
  const response = await fetch("/users");

  if (!response.ok) {
    throw new Error(`Request Failed: ${response.status}`);
  }

  return response.json();
}

Notice something important, We don't need:

const data = await response.json();
return data;

We can simply:

return response.json();

because the function itself is async.
The returned promise eventually fulfills with the parsed users.

2. Import it into React

Now your component can do:

import { getUsers } from "../api/users";

And your effect becomes:

useEffect(() => {
  async function loadUsers() {
    try {
      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  loadUsers();
}, []);

Notice what's happened.

Your React component no longer cares about:

fetch("/users")

or:

response.ok

or:

response.json()

That's now the responsibility of the API function.

3. Think about the responsibilities

We now have:

users.js
"How do I communicate with the users API?"
Users.jsx
"How do I display users?"
"Am I loading?"
"Did something fail?"
"Is the list empty?"

That's separation of concerns.

And this becomes extremely important as your project grows.