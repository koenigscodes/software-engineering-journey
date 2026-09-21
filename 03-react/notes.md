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


<!-- Deleting a user -->
The flow we want is:

User clicks Delete
        ↓
handleDelete(id)
        ↓
deleteUser(id)
        ↓
DELETE /users/id
        ↓
Server confirms deletion
        ↓
Remove user from React state
        ↓
UI updates immediately
1. API function

Inside your api/users.js, add:

export async function deleteUser(id) {
  const response = await fetch(`/users/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(`Request Failed: ${response.status}`);
  }
}

Notice that with a typical DELETE request, we don't necessarily need:

return response.json();

The important thing for us here is that the request succeeded.


<!-- What is a custom hook? -->
A custom hook is simply a function that uses React hooks.




If three components independently call useUsers():
Users.jsx       → fetch users
AdminUsers.jsx  → fetch users
UserStats.jsx   → fetch users

you could end up making the same API request multiple times. That's inefficient.
But imagine something more important:

Users.jsx
   ↓
users = [Jordan, Alex]

Then AdminUsers.jsx deletes Alex:
AdminUsers.jsx
   ↓
users = [Jordan]

But Users.jsx still has:
users = [Jordan, Alex]

Now you have two different versions of the truth inside the same application. 😬
That's the deeper problem.
This leads to a fundamental engineering concept:
Single source of truth.

For data that needs to be shared across multiple parts of an application, we generally want one authoritative place where that state lives.
And this is where Redux starts becoming relevant.

If Users, AdminUsers, and UserStats all need the same users data, what would you ideally want them to read from?

Client state → state your application itself needs to manage.
Is the sidebar open?
Which user is selected?
Is a modal open?
What is currently typed into a form?
Server state → data your application fetches from and synchronizes with a server.
Users
Orders
Products
Messages

The key phrase is source of truth.


                        <!-- REDUX -->

Redux gives us a centralized store where shared client/application state can live.

But remember our other distinction:
Client state  → Redux can manage
Server state  → RTK Query is designed to manage

The flow is:
Component
    │
    │ dispatch(action)
    ↓
  Action
    │
    ↓
 Reducer
    │
    │ calculates the new state
    ↓
  Store
    │
    ↓
 Components re-render

For example:
dispatch({ type: "sidebarOpened" });

The action only says:
“The sidebar was opened.”

The reducer might define:
if (action.type === "sidebarOpened") {
  return {
    ...state,
    sidebarOpen: true
  };
}

So remember this mental model:
Actions describe. Reducers decide. Store holds. Components request.

                        Action vs Action Creator
  An action is the actual object describing what happened:
{
  type: "ui/sidebarOpened"
}

An action creator is a function that creates that action:
sidebarOpened()
dispatch(sidebarOpened());
the flow is:

sidebarOpened()
      ↓
creates an action object
      ↓
dispatch(action)
      ↓
Redux receives it
      ↓
matching reducer runs

Redux Toolkit's createSlice conveniently generates those action creators for us from the reducer names.

So:
reducers: {
  sidebarOpened(state) {
    state.sidebarOpen = true;
  }
}

gives us an action creator we can use as:
dispatch(sidebarOpened());

reducers: {
  toggleSidebar(state) {
    state.sidebarOpen = !state.sidebarOpen;
  }
}

dispatch(toggleSidebar()) sends the action created by toggleSidebar() to Redux. Redux then runs the relevant reducer, which performs the state transition.

So we now have the complete chain:

toggleSidebar()
      ↓
Action creator
      ↓
creates an action
      ↓
dispatch(action)
      ↓
Redux Store
      ↓
Reducer
      ↓
State changes
      ↓
React re-renders

                    Creating a Slice

Conceptually, a slice needs three things:
UI Slice
├── name
├── initialState
└── reducers


import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",

  initialState: {
    sidebarOpen: false
  },

  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    }
  }
});

export const { toggleSidebar } = uiSlice.actions;

export default uiSlice.reducer;

The action creator is what the component needs:
import { toggleSidebar } from "./uiSlice";
dispatch(toggleSidebar());
It creates the action that gets sent into Redux.

Now the other export:
export default uiSlice.reducer;
is needed by the Redux store.

Think of the two exports as having different jobs:
toggleSidebar
     ↓
Component needs it
     ↓
dispatch(toggleSidebar())

while:
uiSlice.reducer
     ↓
Store needs it
     ↓
"Here's the logic for handling UI actions"

So:
Action creator → used by components to dispatch actions.
Reducer → registered with the store so Redux knows how to update that slice of state.

reducer: {
  ui: uiReducer
}
The ui on the left becomes the key in our Redux state.
So eventually our state will look conceptually like:

{
  ui: {
    sidebarOpen: false
  }
}
That's important because later we'll access it with a selector:
            <!-- UseSelector -->
The React-Redux hook for reading state is:
useSelector()
const sidebarOpen = useSelector(state => state.ui.sidebarOpen);

useSelector(...)
      ↓
gets the Redux state
      ↓
state.ui
      ↓
state.ui.sidebarOpen
      ↓
false.
useSelector doesn't change the state. It only reads a value from the store.

One important thing to notice
The state parameter isn't something you created yourself. React-Redux passes the current Redux state into your selector function.

So:
useSelector(state => state.users.selectedUser)

means:
"Give me the current Redux state, and from that state, I want users.selectedUser."

useSelector → read Redux state
useDispatch → tell Redux something happened

Component
   ↓
dispatch(action)
   ↓
Redux Store
   ↓
Reducer
   ↓
State changes
   ↓
Component re-renders


dispatch(toggleSidebar());
There are actually two things happening here:

1. toggleSidebar()
This calls the action creator.
Remember:
export const { toggleSidebar } = uiSlice.actions;
Calling it creates an action object that describes what happened.

Conceptually:
toggleSidebar()
produces something like:

{
  type: "ui/toggleSidebar"
}

2. dispatch(...)
Then dispatch sends that action to the Redux store:
dispatch(toggleSidebar());
Redux receives it and essentially says:
"Okay, I have an action saying ui/toggleSidebar. Which reducer handles that?"

Your uiSlice reducer handles it:

toggleSidebar(state) {
  state.sidebarOpen = !state.sidebarOpen;
}

so then:
dispatch(toggleSidebar())
        ↓
Redux store updates state
        ↓
useSelector notices the selected value changed
        ↓
React-Redux tells React the component needs to update
        ↓
React re-renders the component
        ↓
UI reflects the new state

So useSelector isn't just a one-time read. It subscribes the component to the part of the Redux state that it selected.

For example:

const sidebarOpen = useSelector(
  state => state.ui.sidebarOpen
);

If sidebarOpen changes:

false → true

the component using that selector gets updated.

But here's an important optimization you'll want to understand:

If some other part of Redux changes, like:

state.orders.filter

your component selecting only:

state.ui.sidebarOpen

doesn't need to re-render because of that unrelated change.

That's one of the useful things useSelector handles for you.

finally thisis the mental model:
Provider
   ↓
makes store available

useSelector
   ↓
reads/subscribes to state

useDispatch
   ↓
sends actions

Reducer
   ↓
decides how state changes

Store
   ↓
holds the state

React
   ↓
updates the UI

              <!-- Payload -->
We might eventually have an action like:
selectUser(42)

That action would need to carry the 42 with it.
So we'd get something conceptually like:

{
  type: "users/selectUser",
  payload: 42
}

That payload is simply the data the action carries along with it.


For example:
dispatch(selectUser(42));

could create:
{
  type: "users/selectUser",
  payload: 42
}

Then the reducer can use that payload:
selectUser(state, action) {
  state.selectedUser = action.payload;
}

Component
   │
   │ dispatch(selectUser(42))
   ↓
Action
   │
   ├── type: "users/selectUser"
   └── payload: 42
          ↓
       Reducer
          ↓
 selectedUser = 42

dispatch(selectUser(42));

creates something conceptually like:

{
  type: "users/selectUser",
  payload: 42
}

Then Redux gives the current state and the action to the reducer:

selectUser(state, action) {
  state.selectedUser = action.payload;
}

So the full picture is:
Component
   │
   │ dispatch(selectUser(42))
   ↓
Action
 ┌───────────────┐
 │ type          │
 │ payload: 42   │
 └───────────────┘
        ↓
     Reducer
   state + action
        ↓
   updated state
Payload carries the information the reducer needs to perform the requested state change.
And payload doesn't have to be an ID. It can be anything the reducer needs:

dispatch(setFilter("delivered"));
dispatch(selectUser(42));
dispatch(setTheme("dark"));
dispatch(setSearchTerm("Jordan")); 


Action = what happened + any information needed about it.
State = the data Redux currently holds.
Reducer = receives both state and action, then determines the new state.
And importantly, not every action needs a payload.


understand the three key ideas:
RTK reducers can use mutation-looking syntax.
Immer handles the immutable update internally.
Only the parts that actually change are updated; unchanged data stays unchanged.

The reducer is responsible for changing Redux state, while the selector is responsible for reading/deriving data from that state.
A useful mental model is:
Action
  ↓
dispatch()
  ↓
Reducer → changes state
  ↓
Redux Store
  ↓
Selector → reads/derives data
  ↓
Component

For example:
// reducer
selectUser(state, action) {
  state.selectedUser = action.payload;
}

versus:

// selector
export const selectSelectedUser = state =>
  state.users.selectedUser;
One changes state; the other reads state.

                        <!-- createSelector -->
A component doesn't necessarily re-render only because Redux state changed. It can re-render for other reasons too—like its own state changing or its parent rendering.
And that's exactly where selector memoization becomes important.

For our selector:
const selectDevelopers = state =>
  state.users.users.filter(user => user.role === "Developer");

Every time this selector runs, .filter() creates a new array.
That can matter because React-Redux compares the selector's result using reference equality (===).

So even if the developers haven't actually changed:
oldArray === newArray // false

because they're two different array objects.
This is why Redux has tools such as memoized selectors (commonly with createSelector) that can reuse the previous result when the relevant input hasn't changed.


Imagine we have:
const users = [
  { id: 1, name: "Ada", role: "Developer" },
  { id: 2, name: "Sam", role: "Designer" }
];

And we want:
const developers = users.filter(user => user.role === "Developer");

The problem is that .filter() creates a new array every time.
A memoized selector essentially remembers:
Previous input → Previous result

Then when you ask it again:
Has the input changed?
       │
   ┌───┴───┐
   No      Yes
   ↓        ↓
reuse     calculate
old       new result
result

So createSelector isn't primarily about making .filter() faster. It's about avoiding unnecessary recalculation and preserving the previous result reference when the relevant input hasn't changed.

const selectUsers = state => state.users.users;
This is the input selector.

Then:
const selectDevelopers = createSelector(
  [selectUsers],
  users => users.filter(user => user.role === "Developer")
);

Think of createSelector as:
INPUT SELECTOR
     ↓
  gets users
     ↓
MEMOIZED CALCULATION
     ↓
filters developers
     ↓
RESULT

The important distinction is:
selectUsers → gets the input
users => users.filter(...) → calculates the result
createSelector → remembers the previous input/result



The important distinction is that the selector doesn't decide which user is selected. Some user interaction supplies the ID, usually a click.

Think of the complete flow as:
User clicks Jordan
       ↓
Component gets Jordan's ID (7)
       ↓
dispatch(selectUser(7))
       ↓
Redux reducer updates selectedUser
       ↓
Redux state now knows: selectedUser = 7
       ↓
Selector can use that ID
       ↓
UserProfile displays Jordan

For example, your list might have:

function UserList() {
  const users = useSelector(selectUsers);

  return (
    <div>
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => dispatch(selectUser(user.id))}
        >
          {user.name}
        </button>
      ))}
    </div>
  );
}

If Jordan has id: 7, clicking Jordan causes:

dispatch(selectUser(7));

Your reducer then does something like:

selectUser(state, action) {
  state.selectedUser = action.payload;
}

Now the Redux state contains:

{
  users: {
    users: [...],
    selectedUser: 7
  }
}

Then a selector could read that selected ID and find the actual user.
One subtle distinction. There are actually two different IDs involved in our examples:

1. ID supplied directly to a parameterized selector

selectUserById(state, 7)

2. ID stored in Redux as the currently selected user

state.users.selectedUser // 7

The click is what can connect these two ideas.
So your intuition is right:
The click tells the application which user's ID is relevant; Redux can store that selection, and selectors can use it to retrieve the corresponding user.

If we have:
const selectSelectedProduct = createSelector(
  [selectProducts, selectSelectedProductId],
  (products, productId) =>
    products.find(product => product.id === productId)
);

createSelector watches the references returned by its input selectors:

selectProducts ─────────┐
                        ├──> createSelector ──> selectedProduct
selectProductId ────────┘

If neither input changes:
products reference: same
productId:          same

➡️ the .find() doesn't run again. The previous result is reused.

If either changes:
products reference: changed
       OR
productId: changed

➡️ the result function runs again.


<!-- Normalized State -->
The main difference is how we organize the data.

1. The array approach

Suppose we have:

const products = [
  { id: 1, name: "Laptop", price: 500000 },
  { id: 2, name: "Phone", price: 300000 },
  { id: 3, name: "Tablet", price: 200000 }
];

If I ask:

"Give me product with ID 3."

You have to search the array:

products.find(product => product.id === 3);
2. The normalized approach

Instead, we can organize the products by their IDs:

const products = {
  1: { id: 1, name: "Laptop", price: 500000 },
  2: { id: 2, name: "Phone", price: 300000 },
  3: { id: 3, name: "Tablet", price: 200000 }
};

Now ID 3 is essentially being used as a key.

So you can do:

products[3];

and get:

{ id: 3, name: "Tablet", price: 200000 }

No .find() is necessary.

Think of it like a filing cabinet

An array is like:

📁 Products
├── Product
├── Product
├── Product
├── Product
├── ...
└── Product 2847

You may need to search through them.

Normalized state is more like:

📁 Products
├── 🏷️ ID 1
├── 🏷️ ID 2
├── 🏷️ ID 3
└── 🏷️ ID 2847

You know the ID, so you can go straight to the record.

One important clarification

Normalized state isn't simply "use an object instead of an array."

It's a way of structuring related data so that each entity has one canonical copy, usually indexed by ID.

For example, Redux Toolkit has a tool called createEntityAdapter specifically designed to help with this.

Why this becomes useful

Imagine you have:

10,000 products
multiple components displaying those products
orders that reference products by ID
carts that reference products by ID

You don't want five different copies of the same product scattered throughout your state.
Instead, you can have one canonical product record, and other parts of your state simply reference its ID.

For example:
{
  products: {
    2: { id: 2, name: "Phone", price: 300000 }
  },

  cart: {
    productIds: [2]
  }
}

The cart doesn't need to store another complete copy of the phone. It just says:
"Product 2 is in the cart."
Then a selector can combine the two pieces of information.


Suppose our normalized state looks like:
{
  products: {
    1: { id: 1, name: "Laptop", price: 500000 },
    2: { id: 2, name: "Phone", price: 300000 }
  },

  cart: {
    productIds: [2]
  }
}

The cart only knows that product 2 is in the cart.
If CartItem needs to display:
Phone
₦300,000
where should CartItem get the actual product information from?

You'd keep the source data separate:
{
  products: {
    1: { id: 1, name: "Laptop", price: 500000 },
    2: { id: 2, name: "Phone", price: 300000 }
  },

  cart: {
    productIds: [2]
  }
}

Then a selector derives what the component needs:
const selectCartProducts = createSelector(
  [selectProducts, selectCartProductIds],
  (products, productIds) =>
    productIds.map(id => products[id])
);

So the flow becomes:
Stored state
    ↓
products + productIds
    ↓
   selector
    ↓
derived cart products
    ↓
 CartItem / Cart

This follows several principles you've already learned:
Single source of truth → product information exists once.
Normalized state → other parts reference products by ID.
Selectors → combine/derive the data components need.
Memoization → createSelector can avoid recalculating when its inputs haven't changed.
Separation of concerns → components don't need to know how products are retrieved from the normalized structure.

And importantly, if product 2 changes from ₦300,000 to ₦250,000, the selector gets the updated products[2]. You don't have to manually synchronize a second copy inside the cart.

One more reasoning step

Now let's introduce quantity, because this is where the simple [2, 5, 109] structure starts to break down.

Suppose the customer wants:
2 × Phone (ID 2)
1 × Laptop (ID 1)

Would this be a good cart?
cart: {
  productIds: [2, 2, 1]
}

We need to represent:

Product 2 → quantity 2
Product 1 → quantity 1

So instead of just storing IDs:

productIds: [2, 2, 1]

we need somewhere to associate an ID with a quantity.
For example, imagine something like:
cart: {
  items: {
    2: ???,
    1: ???
  }
}
The key already tells us which product we're talking about.

You don't want:
productIds: [2, 2, 1]

because repeating the ID is being used to represent quantity.
Instead, you can represent each cart item with its product ID + quantity:
cart: {
  items: {
    2: {
      quantity: 2
    },
    1: {
      quantity: 1
    }
  }
}

Now:
2 → quantity 2
1 → quantity 1

And the actual product information still lives in products:
products: {
  1: { id: 1, name: "Laptop", price: 500000 },
  2: { id: 2, name: "Phone", price: 300000 }
}

So the selector can combine them:
Cart item
   │
   ├── productId: 2
   └── quantity: 2
          │
          ▼
     products[2]
          │
          ▼
   Phone, ₦300,000

Then your + / − buttons would update the quantity in the cart state, while the product's name and price continue to come from the single product record.

That's a very important distinction:
Cart state stores what is specific to the cart (quantity). Product state stores what is specific to the product (name, price, etc.).

The cart owns:
{
  productId: 2,
  quantity: 2
}

The products state owns:
{
  id: 2,
  name: "Phone",
  price: 250000
}

And a selector combines them:
cart item
   │
   ├── productId ──────┐
   └── quantity        │
                       ▼
                  products[2]
                       │
                       ▼
              current product data

So the cart doesn't own the product's price. It only owns information about the product's relationship to the cart — in this case, its quantity.

This gives us a very clean rule:
Each piece of state should have one clear owner.
Product name → products
Product price → products
Cart quantity → cart
Selected product ID → wherever the selection belongs
Cart total → derived by a selector

The cart total is completely determined by existing state:
products + cart quantities
          ↓
       selector
          ↓
      cart total

So storing:
cartTotal: 550000

would create another piece of state that could become stale.

Instead, the selector calculates it:
const selectCartTotal = createSelector(
  [selectCartItems, selectProducts],
  (cartItems, products) =>
    cartItems.reduce((total, item) => {
      const product = products[item.productId];

      return total + product.price * item.quantity;
    }, 0)
);

So if:
Phone:  ₦250,000 × 2 = ₦500,000
Mouse:   ₦50,000 × 1 =  ₦50,000
                         ─────────
                         ₦550,000

you don't need to manually update cartTotal.
If the quantity changes, the selector recalculates.
If the product price changes, the selector recalculates.
If neither relevant input changes, a memoized selector can reuse the previous result.

Don't store data that can be reliably derived from other state.
Store the facts:
products
cart items
quantities
selected IDs

Derive the answers:
selected product
cart products
cart total
developer count
filtered products

That's the core idea behind derived state and normalized state working together.


<!-- createEntityAdapter -->
If we have to manually maintain:
products: {
  1: {...},
  2: {...},
  3: {...}
}

stale data is one possible problem, especially if we duplicate or manually synchronize data incorrectly. But there's a slightly bigger point I want you to notice.

With a normalized collection, the data itself doesn't have to become stale. The problem is that managing the normalized structure manually can become repetitive and error-prone.

For example, we'd have to repeatedly write logic for:

Add product
Remove product
Update product
Find product
Get all products
Get product IDs

And make sure all of those operations preserve the normalized structure correctly.

That's where Redux Toolkit's createEntityAdapter comes in.

It essentially gives us a standardized way to manage collections of entities:

const productsAdapter = createEntityAdapter();

It can help manage a state structure like:

{
  ids: [1, 2, 3],
  entities: {
    1: { id: 1, name: "Laptop" },
    2: { id: 2, name: "Phone" },
    3: { id: 3, name: "Tablet" }
  }
}

Notice something interesting:
ids
 ↓
[1, 2, 3]

entities
 ↓
1 → Laptop
2 → Phone
3 → Tablet

So you don't have to manually invent and maintain your own normalized structure.
Think of the two pieces as serving different jobs:
{
  ids: [1, 2, 3],

  entities: {
    1: { id: 1, name: "Laptop" },
    2: { id: 2, name: "Phone" },
    3: { id: 3, name: "Tablet" }
  }
}
entities → fast lookup

If I need product 2:
entities[2]

I can go directly to it.
ids → collection/order

If I need to know which products are in the collection:

ids
// [1, 2, 3]

And because it's an array, it can also preserve an ordering.
So you can think of it as:
ids
 ↓
[1, 2, 3]
 ↓
"These are the entities I have"

entities
 ↓
1 → Laptop
2 → Phone
3 → Tablet
 ↓
"Here's the actual data for each entity"
The important mental model

ids tells you WHAT entities exist.
entities tells you WHAT each entity contains.
And this is why createEntityAdapter is useful: it manages this normalized structure for you instead of making you manually maintain it.

entities gives you the actual product objects, so your instinct is right. But there's one subtle distinction worth catching.

If you want to render all products, you can't directly do:

entities.map(...)

because entities is an object, not an array.
You'd typically use the ids array to walk through the entities:

ids.map(id => entities[id])

Conceptually:
ids
[1, 2, 3]
 │  │  │
 ▼  ▼  ▼
entities[1] → Laptop
entities[2] → Phone
entities[3] → Tablet

That gives you the array of actual products that React can .map() over.

And this is exactly one of the jobs createEntityAdapter can simplify for us — it provides selectors such as selectAll, selectById, and selectIds.

So instead of manually doing:
ids.map(id => entities[id])

you can eventually use an adapter-generated selector like:
selectAllProducts(state)

But don't memorize that API yet. The important thing is that you now understand why ids and entities exist together.

ids
→ useful when you need the collection / ordering

entities
→ useful when you need direct lookup

And that leads naturally into createEntityAdapter.
Here's the bigger picture
Without an adapter, we'd manually maintain:
{
  ids: [1, 2, 109],

  entities: {
    1: {...},
    2: {...},
    109: {...}
  }
}

Then we'd write our own logic for:
adding an entity
removing an entity
updating an entity
finding one entity
getting all entities
getting all IDs

createEntityAdapter gives Redux Toolkit a standardized way to manage all of that.

createEntityAdapter() mainly helps you manage a collection like:
{
  ids: [1, 2, 3],
  entities: {
    1: { id: 1, name: "Laptop" },
    2: { id: 2, name: "Phone" },
    3: { id: 3, name: "Tablet" }
  }
}

It gives you three big things:
Normalized structure — ids + entities
CRUD reducers — add, update, remove, etc.
Selectors — selectAll, selectById, selectIds, etc.

And importantly, it does not make API requests. That's RTK Query/API logic's job.

If we write:
const productsAdapter = createEntityAdapter();

and then:
const initialState = productsAdapter.getInitialState();

getInitialState() gives you the normalized structure:

{
  ids: [],
  entities: {}
}

So:
ids starts empty because we haven't added any entities.
entities starts empty because there are no entities yet.

Then the adapter can manage that structure for us.
For example, if we later add:

productsAdapter.addOne(state, {
  id: 1,
  name: "Laptop",
  price: 500000
});

the state becomes conceptually:
{
  ids: [1],
  entities: {
    1: {
      id: 1,
      name: "Laptop",
      price: 500000
    }
  }
}

Notice something important: we didn't manually write the ids and entities updates. The adapter handled both.


addMany() is an adapter reducer function. It needs to be used inside a Redux reducer, where Redux Toolkit/Immer manages the state.

For example:
const productsSlice = createSlice({
  name: "products",

  initialState: productsAdapter.getInitialState(),

  reducers: {
    productsLoaded(state, action) {
      productsAdapter.addMany(state, action.payload);
    }
  }
});

Then createSlice generates the action creator:
export const { productsLoaded } = productsSlice.actions;

Now a component could dispatch:
dispatch(productsLoaded(products));

The flow is:
Component
   ↓
dispatch(productsLoaded(products))
   ↓
Redux action
   ↓
productsLoaded reducer
   ↓
productsAdapter.addMany(state, action.payload)
   ↓
Normalized Redux state updated

So the component dispatches the action, while the reducer calls addMany().

And this distinction is worth remembering:
productsLoaded() = action creator
dispatch() = sends the action
productsLoaded reducer = handles the action
addMany() = performs the normalized state update


 SERVER
                 │
                 │ GET /products
                 ↓
          ┌──────────────┐
          │   RTK Query  │
          └──────┬───────┘
                 │
                 │ data
                 ↓
          ProductList
                 │
                 │ dispatch(productsLoaded(products))
                 ↓
          ┌──────────────┐
          │ Redux Reducer│
          └──────┬───────┘
                 │
                 │ action.payload
                 ↓
       productsAdapter.addMany()
                 │
                 ↓
       ┌──────────────────┐
       │ Normalized State │
       │                  │
       │ ids: [...]       │
       │ entities: {...}  │
       └────────┬─────────┘
                │
                │ useSelector
                ↓
            Component
                │
                ↓
               UI

So when the component executes:

const { data: products } = useGetProductsQuery();

RTK Query gives the component the server data.

Then:

dispatch(productsLoaded(products));

turns that data into an action.

The action looks conceptually like:

{
  type: "products/productsLoaded",
  payload: [
    { id: 1, name: "Laptop", price: 500000 },
    { id: 2, name: "Phone", price: 300000 },
    { id: 3, name: "Mouse", price: 25000 }
  ]
}

The reducer receives that action:
productsLoaded(state, action) {
  productsAdapter.addMany(state, action.payload);
}

And the adapter manages:
state.ids

and:
state.entities for us.
But there's something I want you to notice

The component currently has to do this:

useEffect(() => {
  if (products) {
    dispatch(productsLoaded(products));
  }
}, [products, dispatch]);

That's a little awkward.

And there's an even bigger architectural question:

Do we actually need to copy RTK Query's server data into another Redux state just to normalize it?

The previous example worked, but we created two copies of the same server data:
RTK Query cache
      ↓
   products
      ↓
Redux products slice
      ↓
normalized products

That can be unnecessary.
A cleaner approach is to let RTK Query own the server data, while using createEntityAdapter to transform the API response into a normalized form inside the RTK Query cache.

The key tool: transformResponse
RTK Query gives us a transformResponse option.

Conceptually:
getProducts: builder.query({
  query: () => "/products",

  transformResponse: (response) => {
    // normalize response here
    return response;
  }
})

And this is where our adapter can come in.
const productsAdapter = createEntityAdapter();

const initialState = productsAdapter.getInitialState();

Then:
getProducts: builder.query({
  query: () => "/products",

  transformResponse: (response) => {
    return productsAdapter.setAll(
      initialState,
      response
    );
  }
})

Now suppose the API gives us:
[
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Mouse" }
]

transformResponse turns that into:
{
  ids: [1, 2, 3],

  entities: {
    1: { id: 1, name: "Laptop" },
    2: { id: 2, name: "Phone" },
    3: { id: 3, name: "Mouse" }
  }
}

before RTK Query stores the result in its cache.

So now we have:
SERVER
   ↓
RTK Query
   ↓
transformResponse
   ↓
createEntityAdapter
   ↓
normalized data
   ↓
RTK Query cache
   ↓
Component

No separate productsSlice is required just to hold another copy.

Starting state:
{
  ids: [1, 2, 3],
  entities: {
    1: {...},
    2: {...},
    3: {...}
  }
}
addMany()
productsAdapter.addMany(state, [product4, product5]);

Result:
{
  ids: [1, 2, 3, 4, 5],
  entities: {
    1: {...},
    2: {...},
    3: {...},
    4: {...},
    5: {...}
  }
}

It adds to what's already there.

setAll()
productsAdapter.setAll(state, [product4, product5]);

Result:
{
  ids: [4, 5],
  entities: {
    4: {...},
    5: {...}
  }
}

It replaces the collection.
That's an important distinction to keep:
addMany = add these to the existing collection.
setAll = make these the entire collection.


<!-- React Context -->

Imagine your entire application needs:
theme
current user
language

and many components need access to them.

You could pass:
App
 ↓
Layout
 ↓
Header
 ↓
Button

just to get theme to the Button.

That's prop drilling.
React Context gives another way to make certain values available to a subtree without passing them through every intermediate component.


Context isn't a replacement for Redux or a universal state-management solution.
A useful mental model is:
Local component concern
        ↓
useState

Shared behavior
        ↓
Custom hook

Shared value needed by a subtree
        ↓
Context

Complex shared client state
        ↓
Redux Toolkit

Server-owned data
        ↓
RTK Query

For example, theme, authentication context, or localization can be reasonable Context use cases.

But you wouldn't create:
AppContext
  ├── orders
  ├── products
  ├── cart
  ├── filters
  ├── sidebar
  ├── modals
  └── everything else

just to avoid prop drilling. That can turn Context into a giant state container.


<!-- React performance -->

The fundamental question is:
When does a React component re-render?

If you understand that, React.memo, useMemo, and useCallback become much easier.
Suppose:
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>

      <Child />
    </>
  );
}

When count changes, Parent re-renders. Does that automatically mean Child must also re-render?

Child will normally re-render when Parent re-renders, even though Child doesn't use count.
The key distinction is:
Component re-render ≠ DOM update.

When count changes:
Parent re-renders.
React reaches <Child /> while rendering the parent.
Child normally renders again.
React compares the new result with the previous result.
If the actual UI output hasn't changed, React may avoid changing the DOM.

So the fact that Child doesn't depend on count doesn't automatically prevent its render.

Now the important optimization,
What if we write:
const Child = React.memo(function Child() {
  return <p>Hello</p>;
});

Now React can say:
"Parent rendered again, but Child's props haven't changed, so I can skip rendering Child."

Because React.memo does a shallow comparison of the props. If:
<Child name="Jordan" />
was previously:
{ name: "Jordan" }
and is still effectively the same prop value, React can skip rendering Child even though Parent rendered again.

So the mental model is:
Parent state changes
        ↓
Parent re-renders
        ↓
React checks Child
        ↓
Child NOT memoized → renders
Child memoized + props unchanged → skips render

One important catch
Consider:
<Child user={{ name: "Jordan" }} />

Every time Parent renders, that object literal creates a new object reference.
So even though the contents are still { name: "Jordan" }, the reference changed.

For React.memo, the object being "the same" by content isn't enough.

<Child user={{ name: "Jordan" }} />

Every time Parent renders, this:
{ name: "Jordan" }

creates a new object in memory.
So:
{ name: "Jordan" } === { name: "Jordan" } is false.

Therefore, React.memo sees the user prop as changed and Child re-renders.
Think of it this way
Same primitive value:
"Jordan" → "Jordan"       ✅ same

Same object contents:
{name: "Jordan"} → {name: "Jordan"}  ❌ different references

This is why useMemo can sometimes matter:
const user = useMemo(() => ({ name: "Jordan" }), []);

Now the same object reference can be reused between renders.

React can check:
oldUser === newUser

which is essentially a quick reference identity check, rather than recursively comparing every property.

That's why this:
const user = { name: "Jordan" };

is different from creating another identical-looking object:
const anotherUser = { name: "Jordan" };

user === anotherUser // false

Even though their contents match.
The practical React lesson
Don't think:
"The data looks the same, so React knows it's the same."

Think:
"Is it the same reference?"
This becomes especially important with:
React.memo
useMemo
useCallback
dependency arrays
Redux selectors

Consider:
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("clicked");
  };

  return <Child onClick={handleClick} />;
}

Suppose Child is wrapped in React.memo.

Every time Parent renders, this line:
const handleClick = () => {
  console.log("clicked");
};

creates a new function object.
So even though the function does exactly the same thing:
Previous render: handleClick → reference A
New render:      handleClick → reference B
                              ↑
                         different reference

React.memo sees the onClick prop as changed, so Child re-renders.

That's one of the main reasons useCallback exists:
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
Now React can preserve the function reference between renders.

Use useCallback when a stable function reference actually matters, usually because you're passing the function to a memoized child or using it in a dependency array.
Don't use it simply because "functions should be optimized."

For example:
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);

If Child isn't memoized and there's no other reason to preserve the function reference, useCallback may provide little or no benefit.

Tool:	          Main purpose:
React.memo	    Skip a component render when its props haven't changed
useMemo	        Reuse an expensive calculated value
useCallback	    Reuse a function reference

One more step on performance:
const filteredOrders = orders.filter(order =>
  order.status === "pending"
);

Imagine orders contains 10,000 orders, and this filtering is expensive. The component re-renders because an unrelated piece of state changes.
What could we use to avoid recalculating filteredOrders unnecessarily?

const filteredOrders = useMemo(() => {
  return orders.filter(order =>
    order.status === "pending"
  );
}, [orders]);

Now React can reuse the previous calculated result when orders hasn't changed.

The important distinction is:

useMemo → caches a value/result
useCallback → caches a function reference
React.memo → can skip a component render.

the important performance mental model:
Parent re-renders
      ↓
React normally renders children
      ↓
React.memo → can skip child if props are unchanged
      ↓
useMemo → can skip expensive recalculation if dependencies unchanged
      ↓
useCallback → can preserve function reference if dependencies unchanged

And importantly: these are tools, not defaults. We use them when there is a demonstrated reason.