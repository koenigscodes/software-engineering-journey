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
