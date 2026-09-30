                                TYPESCRIPT

JavaScript allows:

let age = 25;
age = "twenty-five";

That can become a problem in larger applications because the mistake may only show up when the code runs.

TypeScript lets us describe what a variable is allowed to contain:
let age: number = 25;

Now:
age = "twenty-five";

is a type error.

Look at these:
let username: string = "Jordan";
let age: number = 25;
let isLoggedIn: boolean = true;

Why do you think TypeScript needs the : string, : number, and : boolean parts when JavaScript already knows what values those variables currently contain.

The important distinction is that TypeScript isn't mainly telling JavaScript what the value currently is. It's defining a contract for what that variable is allowed to be.

let age: number = 25;
means:
age is expected to always contain a number.

So this becomes an error:
age = "25"; // ❌
But here's something important
TypeScript can often figure out the type without you explicitly writing it:
let age = 25;

TypeScript infers:
age → number
So you don't need to write:
let age: number = 25;
everywhere.
This is called type inference.

More precisely, TypeScript infers:
const name = "Jordan";       // string
const age = 25;              // number
const isAdmin = false;       // boolean
const scores = [80, 90, 75]; // number[]
That last one is worth noticing:
number[]
means:
an array containing numbers.
So TypeScript can also understand the type of the elements inside a collection.
For example:
const names = ["Jordan", "Alex", "Sam"];
TypeScript infers:
string[]

With TypeScript, we can define exactly what an order must look like.
For example:
type Order = {
  id: number;
  customerName: string;
  amount: number;
  delivered: boolean;
};

Then we can tell React:
function OrderCard({ order }: { order: Order }) {
  return <h2>{order.customerName}</h2>;
}
Now TypeScript knows the contract.

                        TypeScript: reusable object types

We defined:
type Order = {
  id: number;
  customerName: string;
  amount: number;
  delivered: boolean;
};

Now we can reuse Order anywhere we need that same structure:
const order1: Order = {
  id: 101,
  customerName: "Jordan",
  amount: 25000,
  delivered: false
};

const order2: Order = {
  id: 102,
  customerName: "Alex",
  amount: 18000,
  delivered: true
};

And arrays:
const orders: Order[] = [order1, order2];

Read Order[] as:
"An array where every element must be an Order."

So this would be invalid:
const orders: Order[] = [
  order1,
  "hello"
];
because "hello" isn't an Order.


Typing function parameters

Suppose we have:
type Product = {
  id: number;
  name: string;
  price: number;
};

And we write:
function getProductName(product: Product) {
  return product.name;
}

The product: Product means:
The product parameter must be an object that matches the Product type.

So:
getProductName({
  id: 1,
  name: "Laptop",
  price: 500000
});
✅ Valid.
But:
getProductName("Laptop");
❌ Type error.

What do you think this function's return type is?
function getProductName(product: Product) {
  return product.name;
}

And how could we explicitly tell TypeScript what the return type should be?

You can explicitly specify it like this:

function getProductName(product: Product): string {
  return product.name;
}

Notice where : string goes:

function getProductName(
    product: Product
                 ↑
            parameter type
): string {
   ↑
return type

So there are two different type annotations here:
function getProductName(product: Product): string
//                         ↑              ↑
//                    argument type    return type
Why is this useful?

Imagine you accidentally change the function:
function getProductName(product: Product): string {
  return product.price;
}

TypeScript catches it because product.price is a number, but the function promises to return a string.
This gives you a useful mental model:
Parameters describe what goes INTO a function. 
Return types describe what comes OUT.

function getOrderAmount(order: Order): number {
  return order.amount; // ✅
}

Notice how the types line up:
order: Order
     ↓
order.amount
     ↓
number
     ↓
: number

So:
function getOrderAmount(order: Order): number
means:
"Give me an Order, and I promise to return a number."

One important TypeScript habit
You don't always need to explicitly write the return type:

function getOrderAmount(order: Order) {
  return order.amount;
}

TypeScript already knows the result is number.
Explicit return types become particularly useful when you want to make a function's contract clear or catch an accidental wrong return.


//                 <!-- React state -->

const [count, setCount] = useState(0);

What do you think TypeScript infers for count here?
const [count, setCount] = useState(0);

And what do you think happens if we try:
setCount("hello");

const [count, setCount] = useState(0);

TypeScript infers:
count → number
setCount → accepts number

So:
setCount(10);      // ✅
setCount("hello"); // ❌ Type error

This is type inference working for React state.


const [user, setUser] = useState(null);

TypeScript does not normally infer this as any.
It infers the state as essentially:
null

So setUser expects null.
Therefore:
setUser(null); // ✅

but:
setUser({
  id: 1,
  name: "Jordan"
}); // ❌
would be a type error.

How do we solve the real-world situation?
Usually, we tell TypeScript that the state can be either null or a User.

type User = {
  id: number;
  name: string;
};

const [user, setUser] = useState<User | null>(null);

Read this:
User | null
   ↑     ↑
either  or

So now both are valid:
setUser(null);                    // ✅
setUser({ id: 1, name: "Jordan" }); // ✅
This | is called a union type.


const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
what do you think TypeScript will complain about here?
console.log(selectedOrder.amount);

Order | null
means:
selectedOrder might be an Order, or it might currently be null.

Therefore:
console.log(selectedOrder.amount);
is unsafe.

TypeScript is essentially saying:
"What if selectedOrder is still null? null.amount doesn't exist."

So we need to narrow the type first
if (selectedOrder) {
  console.log(selectedOrder.amount);
}

Inside that if, TypeScript knows:
selectedOrder → Order
because the null possibility has been eliminated.

This concept is called type narrowing.
And it's extremely important in React because you'll constantly deal with states like:

User | null
Product | undefined
Order | null
especially while waiting for API data.


//        Optional Properties

Suppose some orders don't have a discount:

type Order = {
  id: number;
  customerName: string;
  amount: number;
  discount?: number;
};

The ? means:

discount may exist, but it may also be undefined.

So:

order.discount

has the type:

number | undefined


const discount = order.discount;
console.log(discount + 100);

TypeScript sees:
discount // number | undefined

So it won't let you safely do:
discount + 100 // ❌

because undefined + 100 isn't valid.

You can narrow it:
if (discount !== undefined) {
  console.log(discount + 100);
}

Now inside the block:
discount → number

Consider:
discount = 0;

0 is falsy, but it's still a perfectly valid number.

So this:
if (discount) {
  // ...
}
would incorrectly treat 0 as missing.

Prefer:
if (discount !== undefined) {
when your actual concern is specifically whether the value exists.
This distinction—truthiness vs existence—will save you bugs in real applications.


//              typing API data

Suppose:
type Product = {
  id: number;
  name: string;
  price: number;
};

And your API returns:
[
  { "id": 1, "name": "Laptop", "price": 500000 },
  { "id": 2, "name": "Mouse", "price": 15000 }
]

If you have:
const products: Product[] = responseData;

what protection does TypeScript give you when you later write:
products.map(product => product.name)

and what happens if you accidentally write:
products.map(product => product.customerName)


products.map(product => product.name)
is valid because name is defined in Product:
type Product = {
  id: number;
  name: string;
  price: number;
};

So TypeScript knows:
product.name → string

But:
products.map(product => product.customerName)
doesn't necessarily "throw undefined."

TypeScript itself catches the mistake before your code runs:
Property 'customerName' does not exist on type 'Product'.

That's one of the major benefits of TypeScript: it can catch incorrect assumptions about data structures during development rather than waiting for runtime.


One important caveat
This:
const products: Product[] = responseData;
doesn't magically validate the API response at runtime.
TypeScript's types disappear when the code runs. If the backend sends bad data, TypeScript can't physically stop the server from doing that.

That's why in real applications we distinguish between:
TypeScript → compile-time safety
Runtime validation → actual data safety

// TypeScript + arrays of API data

Now imagine a function that receives those products:
function getExpensiveProducts(products: Product[]) {
  return products.filter(product => product.price > 100000);
}

products is:
Product[]
And .filter() returns another array containing the same element type.

So TypeScript infers:
getExpensiveProducts → Product[]

We're returning the filtered products:
Product[] 
   ↓ filter()
Product[]

So we could explicitly write:
function getExpensiveProducts(products: Product[]): Product[] {
  return products.filter(product => product.price > 100000);
}

Quick mental rule
For array methods:
map()    → usually transforms the element type
filter() → keeps the same element type
find()   → returns one element or undefined
some()   → boolean
every()  → boolean
reduce() → depends on the accumulator


//                      TypeScript + React props

<OrderCard order={order} />

In JavaScript/React, we'd write:
function OrderCard({ order }) {
  return <h2>{order.customerName}</h2>;
}

Now we want TypeScript to know exactly what props OrderCard expects.

We already have:
type Order = {
  id: number;
  customerName: string;
  amount: number;
  delivered: boolean;
};

So we can write:
type OrderCardProps = {
  order: Order;
};

function OrderCard({ order }: OrderCardProps) {
  return <h2>{order.customerName}</h2>;
}

Notice the architecture:
OrderCardProps
      ↓
describes the props object

order
      ↓
must be an Order

This is essentially the same thing we saw earlier:
function OrderCard({ order }: { order: Order })

but we've extracted the props shape into a named type:
type OrderCardProps = {
  order: Order;
};

That's generally much easier to maintain once a component has several props.


//  function props

Suppose:
<ProductCard
  product={product}
  showPrice={true}
  onAddToCart={() => addToCart(product)}
/>

What type do you think onAddToCart should have?
Look at what we're passing:
onAddToCart={() => addToCart(product)}

The value being passed to onAddToCart is a function.

So think about two things:
What does the function receive as arguments?
What does the function return?

In this particular example:
() => addToCart(product)
It receives nothing.

For a function that takes no arguments and returns nothing:
onAddToCart: () => void;
Why not undefined?

The function has no parameters, so we don't put undefined there. We simply leave the parameter list empty:
() => void
() → receives no arguments
void → doesn't return a useful value

So our props become:
type ProductCardProps = {
  product: Product;
  showPrice: boolean;
  onAddToCart: () => void;
};

One subtle but important TypeScript distinction:
() => void       // function returns nothing
() => undefined  // function specifically returns undefined

For React event handlers and callback props, void is the usual type when the callback doesn't need to return anything.
Now let's make it slightly more realistic.

What if we had:
onAddToCart={(product) => addToCart(product)}
and the parent passes a Product into the callback?
How would you type onAddToCart now?

//                TypeScript + React concept: optional props

type ProductCardProps = {
  product: Product;
  showPrice: boolean;
  onAddToCart: (product: Product) => void;
};
We'll look at what happens when a prop isn't always required, and how TypeScript handles that.

type ProductCardProps = {
  product: Product;
  showPrice?: boolean;
  onAddToCart: (product: Product) => void;
};

Now there's one important TypeScript detail.

Because showPrice is optional:
showPrice?: boolean;

TypeScript treats it as essentially:
boolean | undefined

So if the parent doesn't provide it:
<ProductCard
  product={product}
  onAddToCart={addToCart}
/>

then inside the component:
{showPrice && <p>₦{product.price}</p>}
works nicely because undefined is falsy.
But here's the practical React pattern

Often you'll give an optional prop a default value:
function ProductCard({
  product,
  showPrice = true,
  onAddToCart,
}: ProductCardProps) {
  // ...
}

Now:
<ProductCard
  product={product}
  onAddToCart={addToCart}
/>
means showPrice becomes true.

But:
<ProductCard
  product={product}
  showPrice={false}
  onAddToCart={addToCart}
/>
means showPrice remains false.

So the distinction is:
showPrice?: boolean
        ↓
Parent is allowed to omit it

and:
showPrice = true

means:
If the parent omits it, use true.
This is a pattern you'll see a lot in reusable React components.

//typing React events(onClick, onChange, form events)

<button onClick={() => onAddToCart(product)}>
  Add to Cart
</button>

Now suppose we have an input:
function SearchBox() {
  return (
    <input
      onChange={(event) => {
        console.log(event.target.value);
      }}
    />
  );
}

React gives the callback an event object.
TypeScript can tell us exactly what kind of event that is.

For a normal text <input>, the event type is:
React.ChangeEvent<HTMLInputElement>

So we can explicitly write:
function SearchBox() {
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    console.log(event.target.value);
  }

  return <input onChange={handleChange} />;
}
But here's something important
You don't always need to explicitly type the event.

This:
<input
  onChange={(event) => {
    console.log(event.target.value);
  }}
/>

usually gets the event type inferred automatically because TypeScript knows that onChange belongs to an <input>.

So you might see both styles:
// TypeScript infers it
<input onChange={(event) => ...} />

and:
// Explicit type — useful when extracting the handler
function handleChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  ...
}

//typing useState

const [user, setUser] = useState<User | null>(null);
Let's see why the | null is necessary and when you'd use it.

Imagine:
type User = {
  id: number;
  name: string;
};

And initially there is no user selected:
const [selectedUser, setSelectedUser] = useState(null);

Later you want to do:
setSelectedUser({
  id: 1,
  name: "Jordan"
});

With:
const [selectedUser, setSelectedUser] = useState(null);

TypeScript sees the initial value as null, so it infers the state as essentially:
selectedUser: null

Therefore this:
setSelectedUser({
  id: 1,
  name: "Jordan"
});

would produce a type error because you're trying to put a User into state that TypeScript believes can only contain null.

The correct version
Tell TypeScript about both possible states:
const [selectedUser, setSelectedUser] = useState<User | null>(null);

Now the state can be:
User
  OR
null

So this works:
setSelectedUser({
  id: 1,
  name: "Jordan"
});

And later this also works:
setSelectedUser(null);
Why this matters

This is extremely common with data that starts empty and gets populated later:
Initial render
    ↓
selectedUser = null
    ↓
fetch/select user
    ↓
selectedUser = User

And it connects directly to the type narrowing we already learned.

Because TypeScript knows:
User | null

you'll need to narrow it before accessing properties:
if (selectedUser) {
  console.log(selectedUser.name);
}

Inside that if, TypeScript knows:
"selectedUser cannot be null here, so it must be a User."

That's the whole reason for the union:
User | null

You're describing the actual lifecycle of the data rather than pretending the user exists from the beginning.


//typing children

Suppose we create:
function Card() {
  return (
    <div className="card">
      ...
    </div>
  );
}

We want to use it like:
<Card>
  <h2>Nike Air Max</h2>
  <p>₦50,000</p>
</Card>

The content between <Card> and </Card> is called children

For React children, the common type is:
React.ReactNode

So:
type CardProps = {
  children: React.ReactNode;
};

Why React.ReactNode?

Because children can be much more than a string.

For example, all of these can be children:
<Card>
  Hello
</Card>
<Card>
  <h2>Nike Air Max</h2>
</Card>
<Card>
  <p>₦50,000</p>
  <button>Add to cart</button>
</Card>

Even arrays of elements, numbers, fragments, etc. can be valid React children.

So React.ReactNode essentially tells TypeScript:
"This prop can contain something React can render as children."

Then the component can be:
type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

And:
<Card>
  <h2>Nike Air Max</h2>
  <p>₦50,000</p>
</Card>
works.

//  typing forms and controlled inputs

Suppose we have:

function SearchBox() {
  const [search, setSearch] = useState("");

  return (
    <input
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  );
}

User types
   ↓
onChange fires
   ↓
event.target.value
   ↓
setSearch(...)
   ↓
state changes
   ↓
input re-renders

And because this is an <input>, TypeScript knows the event is:

React.ChangeEvent<HTMLInputElement>

So if we extract the handler:

function SearchBox() {
  const [search, setSearch] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setSearch(event.target.value);
  }

  return (
    <input
      value={search}
      onChange={handleChange}
    />
  );
}


Suppose we have:
const [form, setForm] = useState<LoginForm>({
  email: "",
  password: "",
});

We can update the state that changes only the password while preserving the email.

setForm(prev => ({
  ...prev,
  password: "working",
}));

That's the correct pattern.
So if the state was:
{
  email: "jordan@example.com",
  password: ""
}

it becomes:
{
  email: "jordan@example.com",
  password: "working"
}

Now let's connect this to the form event instead of hardcoding:
password: "working"

we want whatever the user actually typed:
function handlePasswordChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setForm(prev => ({
    ...prev,
    password: event.target.value,
  }));
}

And the input:
<input
  type="password"
  value={form.password}
  onChange={handlePasswordChange}
/>

So your full flow is now:
User types
    ↓
onChange
    ↓
React.ChangeEvent<HTMLInputElement>
    ↓
event.target.value
    ↓
setForm(prev => ...)
    ↓
...prev preserves email
    ↓
password gets updated
    ↓
React re-renders

This is a very real React pattern. You should recognize it immediately when you see it in a codebase.

Instead of:
function handleEmailChange(...) { ... }

function handlePasswordChange(...) { ... }

we can use one handler.
The idea is that each input tells us which field changed.

<input
  name="email"
  value={form.email}
  onChange={handleChange}
/>

<input
  name="password"
  value={form.password}
  onChange={handleChange}
/>

Then:
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = event.target;

  setForm(prev => ({
    ...prev,
    [name]: value,
  }));
}

The interesting part is:
[name]: value
This is a computed property name.

If:
name === "email"

then:
[name]: value

becomes:

email: value

If:

name === "password"

it becomes:
password: value

So one handler can handle both fields.
But there's a TypeScript issue hiding here

Our LoginForm says:
type LoginForm = {
  email: string;
  password: string;
};

But event.target.name is just a general string.

TypeScript doesn't automatically know that:
name
can only be "email" or "password".

//TypeScript typing for the single-handler form pattern.

Here’s the situation:
type LoginForm = {
  email: string;
  password: string;
};

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = event.target;

  setForm(prev => ({
    ...prev,
    [name]: value,
  }));
}

The problem TypeScript sees is:
name // string

But our LoginForm only has these valid keys:
"email" | "password"

TypeScript doesn't automatically know that the HTML name must be one of those two.

Given:
type LoginForm = {
  email: string;
  password: string;
};

When we write:
type LoginField = keyof LoginForm;

keyof extracts the property names (keys) of that type.

So:
LoginField

becomes:
"email" | "password"

It does not contain key-value pairs.

Think of it like:
LoginForm
// {
//   email: string,
//   password: string
// }

keyof LoginForm
// "email" | "password"

And this is useful because now we can tell TypeScript:
"This variable must be the name of one of the fields in LoginForm."

For example:
const field: LoginField = "email";     // ✅
const field: LoginField = "password";  // ✅
const field: LoginField = "username";  // ❌

We have:
const { name, value } = event.target;

The browser gives us:
name // string
value // string

But our form only accepts these field names:
type LoginField = keyof LoginForm;
// "email" | "password"

So we're essentially telling TypeScript:
"name represents one of the valid keys of LoginForm."

Then our update:
setForm(prev => ({
  ...prev,
  [name]: value,
}));

means:
name = "email"
        ↓
[ name ] → [ "email" ]
        ↓
form.email = value

or:
name = "password"
        ↓
[ name ] → [ "password" ]
        ↓
form.password = value

That's why the computed property:
[name]: value

is so useful here—it lets the same handler update whichever field triggered the event.

Now one small TypeScript detail
The browser still tells TypeScript that name is just a string.

So we need to bridge:
string

to:
keyof LoginForm

One common way is:
const field = name as keyof LoginForm;

Then:

setForm(prev => ({
  ...prev,
  [field]: value,
}));


For our current form:
type LoginForm = {
  email: string;
  password: string;
};

Then:
const [form, setForm] = useState<LoginForm>({
  email: "",
  password: "",
});

And when using one handler for multiple inputs, we use the keys of that form:
type LoginField = keyof LoginForm;
// "email" | "password"

Then the handler can bridge the browser's general string with our known form keys:

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = event.target;

  const field = name as keyof LoginForm;

  setForm(prev => ({
    ...prev,
    [field]: value,
  }));
}

So the overall mental model is:
Form shape
   ↓
type LoginForm
   ↓
useState<LoginForm>
   ↓
Inputs correspond to the keys
   ↓
keyof LoginForm
   ↓
One handler can update the appropriate field
But there's an important distinction

If you have a simple form with separate handlers, you don't necessarily need keyof.

For example:

function handleEmailChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setEmail(event.target.value);
}

That's already properly typed.


//                    form validation

Suppose we have:
type LoginForm = {
  email: string;
  password: string;
};

const [form, setForm] = useState<LoginForm>({
  email: "",
  password: "",
});

Before submitting, we want to know:
Is the email empty?
Is the password empty?
Is the password long enough?


const emailInvalid = form.email.length <= 0;

This gives us a boolean:
form.email = ""       → true
form.email = "abc"    → false

So we could use it in the UI:
{emailInvalid && <p>Email is required</p>}
One small improvement

You could also write:
const emailInvalid = form.email.length === 0;

Because we're specifically asking:
"Does the email have zero characters?"
Both work here, but === 0 communicates the intention a little more clearly.

Now let's extend the same thinking.
Suppose the password must contain at least 8 characters.
You could also express the same rule as:
const passwordInvalid = form.password.length < 8;

Why do you think it would be better to have:
emailInvalid
and
touched.email
as two separate pieces of information, rather than just having something like:
showEmailError


Right now we have:
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (formInvalid) {
    return;
  }

  console.log("Submitting:", form);
}

That's enough for local validation, but in a real app the submit usually becomes:
User submits
    ↓
Validate
    ↓
Send data to API
    ↓
Loading state
    ↓
Success OR server error
    ↓
Update UI
First piece: loading state

Imagine the login request takes 2 seconds.

We don't want the user clicking Login five times while we're waiting.

So we'd have something like:
const [isSubmitting, setIsSubmitting] = useState(false);

Then the submit flow might eventually look like:
async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (formInvalid) {
    return;
  }

  setIsSubmitting(true);

  // API request...

  setIsSubmitting(false);
}


A form can absolutely be:
formInvalid = false
isSubmitting = false

The data is valid, but the user hasn't submitted yet.

Then:
formInvalid = false
isSubmitting = true

The user has submitted and we're waiting for the server.

And eventually:
formInvalid = false
isSubmitting = false

The request has finished.

That's exactly why we don't combine unrelated facts into one state variable.

Now let's make the submit flow realistic

We could have:
<button
  type="submit"
  disabled={formInvalid || isSubmitting}
>
  {isSubmitting ? "Logging in..." : "Login"}
</button>

Now the button is disabled for two different reasons:
The form data is invalid.
A submission is already in progress.

And the text tells the user what's happening.

The actual submit could then be:
async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (formInvalid) {
    return;
  }

  setIsSubmitting(true);

  try {
    // API request goes here
  } finally {
    setIsSubmitting(false);
  }
}


Server errors are different from validation errors
We now have two kinds of errors:
Client-side validation

id="client"
emailInvalid
passwordInvalid
formInvalid

These are problems we can detect before contacting the server.

Examples:
empty email
password too short

Then there's:
Server/API error

User submits valid form
        ↓
API request
        ↓
Server rejects it
        ↓
"Invalid email or password"

The form can be perfectly valid according to our frontend rules and the server can still reject it.

So we'd introduce another piece of state:
const [serverError, setServerError] = useState("");

Then:
async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (formInvalid) {
    return;
  }

  setIsSubmitting(true);
  setServerError("");

  try {
    await loginUser(form);
  } catch (error) {
    setServerError("Invalid email or password");
  } finally {
    setIsSubmitting(false);
  }
}

And the UI could display it:
{serverError && (
  <p>{serverError}</p>
)}

Notice the flow:

                    FORM
                     │
             Is frontend valid?
                /          \
              NO            YES
              │              │
          Don't submit    Submit API
                             │
                       /             \
                    Success         Error
                       │              │
                       │         serverError
                       │              │
                       └──────┬───────┘
                              ↓
                         finally
                              ↓
                    isSubmitting = false
One thing I want you to notice

We now have three different pieces of state:
form
touched
isSubmitting
serverError

And each represents a different fact.

We're not putting everything into one giant object just because it's one form.

That's the same state-design principle you've already learned with Redux.

You previously learned that components shouldn't become responsible for all the server communication.

A clean structure could be:
LoginForm.tsx
     │
     │ calls
     ▼
useLogin.ts
     │
     │ calls
     ▼
authApi.ts
     │
     │ fetch()
     ▼
Server
authApi.ts

This layer knows how to communicate with the server:
type LoginData = {
  email: string;
  password: string;
};

export async function loginUser(data: LoginData) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

The API function doesn't care about:
isSubmitting
touched
displaying error messages
disabling buttons

Its job is basically:
Send the login data and return the result—or throw if the request fails.

That's the separation we want:
Component
→ UI + user interaction
API function
→ server communication

So instead of:
LoginForm
 ├── render UI
 ├── manage form state
 ├── validate
 ├── fetch()
 ├── parse response
 ├── handle HTTP errors
 └── display result

we aim for:
LoginForm
 ├── render UI
 ├── manage form state
 ├── validate
 └── call loginUser()
          ↓
      authApi.ts
          ↓
        fetch()
          ↓
       Server

That's a much cleaner boundary.

The distinction is:
The component shouldn't own the details of server communication.

That's why authApi.ts owns things like:
fetch()
method
headers
body
response.ok
response.json()

while the component owns things like:
form
touched
isSubmitting
validation
what the user sees

We can introduce the custom hook layer:
LoginForm
    ↓
useLogin()
    ↓
loginUser()
    ↓
API

We've already established that:

LoginForm
    ↓
useLogin()
    ↓
loginUser()
    ↓
Server

The API function handles communication.

The hook can coordinate the React-side state around that operation.

For example:

import { useState } from "react";
import { loginUser } from "./authApi";

export function useLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function login(data: LoginData) {
    setIsSubmitting(true);
    setServerError("");

    try {
      const result = await loginUser(data);
      return result;
    } catch (error) {
      setServerError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    login,
    isSubmitting,
    serverError,
  };
}

Then the component becomes simpler:

const {
  login,
  isSubmitting,
  serverError,
} = useLogin();

And submission becomes:

async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (formInvalid) {
    return;
  }

  await login(form);
}
Notice the division

The component knows:
"The user submitted the form."

The hook knows:
"When login happens, I need loading/error state."

The API function knows:
"Here's how I communicate with the server."

UI / Component
      ↓
Behavior / Custom Hook
      ↓
Server Communication / API

useLogin() is responsible for the login operation and everything that belongs to that operation:
LoginForm
   ↓
login(form)
   ↓
useLogin()
   ↓
loginUser(form)
   ↓
Server

So while loginUser() is being awaited:
try {
  const result = await loginUser(data);
  return result;
}

the hook controls:
isSubmitting
serverError

because those states describe the status of the login operation.

The component then doesn't need to know how login works. It only needs to know:
const { login, isSubmitting, serverError } = useLogin();

and display the appropriate UI.

The reason for putting them in useLogin() is separation and reusable behavior:
LoginForm manages the form.
useLogin() manages the login operation.

If another component later needs to perform login, it can reuse:
const { login, isSubmitting, serverError } = useLogin();

without copying the API/loading/error logic.



//                        Authentication

Suppose the server successfully returns:

{
  user: {
    id: 7,
    name: "Jordan"
  },
  token: "abc123"
}

user

The frontend may need the user information for UI:

"Welcome, Jordan"
Show profile
Check user role
Display account information

So the frontend needs access to it.

token

The token is also returned by the server, but its main purpose is authentication.

The frontend uses it when making protected requests:

Login
  ↓
Server returns token
  ↓
Frontend stores/retains authentication credential
  ↓
Protected API request
  ↓
Server verifies token

So don't think:
token = server state, user = frontend state

Instead think:
Both originate from the server, but the token is an authentication credential that the frontend must retain/use, while user information can be consumed as application data.
And this distinction becomes important when we decide where/how to store the token.

What happens to that variable when the component that created it unmounts or the page is refreshed?

1. Component lifetime
If you do:
function LoginForm() {
  const token = "abc123";
}

token belongs to that component's execution. Once that component is gone, that variable is gone too.

So another component can't simply access it.

2. Page refresh
Even if you put it somewhere outside the component:

let token = "abc123";

a browser refresh reloads the JavaScript application from scratch, so that in-memory variable is lost.

That's why authentication needs some form of persistence.

Common approaches include:

In-memory state
    ↓
lost on refresh

localStorage
    ↓
survives refresh
    ↓
but has security considerations

sessionStorage
    ↓
survives refresh
    ↓
cleared when the browsing session ends

HttpOnly cookie
    ↓
stored by browser
    ↓
JavaScript cannot directly read it
    ↓
commonly used for authentication credentials

If the browser refreshes and our JavaScript state is completely reset, what problem does persistent authentication storage need to solve?

Here, the problem is losing authentication state after a page refresh.

Think about the sequence:

User logs in
    ↓
Server gives authentication credential
    ↓
User refreshes page
    ↓
React/JavaScript state resets
    ↓
How does the app know the user is still authenticated?

So persistent authentication storage needs to solve:
How can the app retain/re-establish the user's authenticated session after JavaScript state is reset?

And that's why authentication storage is different from ordinary state persistence.

What should the frontend do when it starts up again if the user's authentication session is still valid?

the app needs to re-establish or verify the authenticated session when it starts.

A common flow is:
Page loads
   ↓
Frontend checks available auth credential/session
   ↓
Frontend requests something like /me
   ↓
Server verifies authentication
   ↓
Valid → return current user
Invalid → user is unauthenticated

So you can think of /me as:
"Server, who is currently authenticated with this session?"

This also explains why the frontend shouldn't blindly assume:
isLoggedIn = true;

just because it previously had authentication information. The server is ultimately the authority on whether the session/credential is still valid.

Next important concept

Now imagine the /me request returns:
{
  id: 7,
  name: "Jordan",
  role: "admin"
}

That user information is needed by many unrelated components — Navbar, Dashboard, Profile, AdminPanel, etc.

Where would you put that user information so those components can access it without passing it through many layers of props?

A custom hook is great for encapsulating the behavior of getting the current user:

const { user, isLoading } = useCurrentUser();

But if many unrelated components need the same user value, simply calling the hook doesn't automatically give them the same state.

For example:

Navbar
  ↓
useCurrentUser() → user A

Dashboard
  ↓
useCurrentUser() → user B

Those are separate hook instances unless the hook itself is backed by shared state/cache.

Since you already learned Redux and RTK Query, this is where those concepts become useful:

Server
  ↓
/me
  ↓
RTK Query cache
  ↓
useGetCurrentUserQuery()
  ↓
Navbar
Dashboard
Profile
AdminPanel

Now multiple components can subscribe to the same server-state cache rather than each independently managing their own copy.

So the stronger answer is:

Use a custom hook to expose the current-user behavior cleanly, while shared state/cache such as RTK Query can hold the actual server data.

For example:

function useCurrentUser() {
  return useGetCurrentUserQuery();
}

Then:

const { data: user } = useCurrentUser();

This is a nice combination of the things you've already learned: custom hooks + server state + RTK Query.

Both components can simply say:

const { data: user } = useCurrentUser();

and neither component needs to care about:

how /me is requested
whether the data is already cached
whether another component is already subscribed
loading/error handling
when the cache should refetch

RTK Query handles that server-state machinery.

                 /me
                  ↓
              RTK Query
             shared cache
             ↙         ↘
         Navbar      Dashboard
            ↓            ↓
          user          user

And notice how this connects several things you've already learned:

API layer → communicates with server
RTK Query → manages server state/cache
Custom hook → exposes behavior cleanly
Components → consume the data and render UI

That's a solid frontend architecture pattern.

A 401 Unauthorized from /me means the server did not accept the authentication credentials/session, so the frontend should treat the user as unauthenticated.

The flow becomes:

App starts
   ↓
GET /me
   ↓
┌───────────────┬──────────────────┐
│ 200 OK        │ 401 Unauthorized │
│       ↓       │        ↓         │
│ authenticated │ unauthenticated  │
│       ↓       │        ↓         │
│ show app      │ show login       │
└───────────────┴──────────────────┘

This gives you a very useful distinction:

401 → authentication is missing/invalid/expired.
403 → the server understood who you are but you don't have permission for that resource/action.

So if an authenticated user tries to access an admin-only page and gets 403, that's an authorization problem, not an authentication problem.


//  Routing + authentication guards

The problem we're solving is simple:
Unauthenticated user
        ↓
     /login

Authenticated user
        ↓
     /dashboard

And if someone manually types:
/dashboard

without being authenticated, we don't want them seeing the dashboard.

First concept: the route guard

Imagine we have:

<Route path="/dashboard" element={<Dashboard />} />

Right now, anyone can access /dashboard.

We want something conceptually like:
<Route
  path="/dashboard"
  element={
    isAuthenticated
      ? <Dashboard />
      : <Navigate to="/login" />
  }
/>

The guard's responsibility is basically:
"Before rendering this protected page, determine whether the user is authenticated."

But here's the architecture question

We already established that authentication status comes from something like /me.

So imagine:

const { data: user, isLoading } = useCurrentUser();

At the moment the application starts, user might be:
undefined

because /me hasn't finished yet.

That means we have three states, not two:
1. Loading → we don't know yet
2. User exists → authenticated
3. No user / 401 → unauthenticated

While /me is running:

isLoading = true
user = undefined

We don't know the answer yet.

So the guard should effectively be:

             /me
              ↓
          isLoading?
         ↙        ↘
       YES         NO
        ↓           ↓
   Loading page   user exists?
                  ↙       ↘
                YES        NO
                 ↓          ↓
             Dashboard    /login

And the React code becomes conceptually:

function ProtectedRoute() {
  const {
    data: user,
    isLoading,
  } = useCurrentUser();

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

<Outlet /> is important here because it means:

"The authentication check passed, so render whichever protected route is nested here."

For example:

<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/orders" element={<Orders />} />
</Route>

Now one guard can protect several pages.

One subtle point

We're currently simplifying the authentication result to:

user exists → authenticated
user doesn't exist → unauthenticated

In a real application, RTK Query gives us more information such as isLoading, isError, and the actual error status. We'd use that to distinguish things like a 401 from a genuine server/network failure.

When dealing with asynchronous state:

Don't interpret "not available yet" as "negative result."

You saw the same idea earlier with find():

const product = products.find(...);
// Product | undefined

undefined can mean different things depending on the context.

Here:

isLoading = true + user = undefined
→ result not known yet

isLoading = false + user = undefined
→ no authenticated user

That's a very useful pattern to recognize in real applications.

Suppose the user is authenticated and visits:
/dashboard
Then they click Logout.

We end the authenticated session and clear/re-establish the auth state.

A typical flow is:
User clicks Logout
       ↓
Frontend sends logout request
       ↓
Server ends/invalidates the session
       ↓
Auth state/cache is cleared
       ↓
User is no longer authenticated
       ↓
Redirect to /login

For example, if we're using a cookie-based session:
POST /logout
      ↓
Server clears/invalidate session cookie
      ↓
GET /me
      ↓
401 Unauthorized
      ↓
user = unauthenticated

And because our protected route already does:
if (!user) {
  return <Navigate to="/login" />;
}

the protected UI naturally disappears.

One important architecture point

Logout isn't simply:
setUser(null);

That would only change the frontend's belief about authentication.

The server also needs to know that the session is no longer valid.

So we have:
Server authentication state → actually ends the session
Frontend auth state/cache → reflects that change

This is the same server-state principle you've already learned with RTK Query.

what happens if RTK Query still has:
user = { id: 7, name: "Jordan", role: "admin" }

cached after the server has logged the user out.

The cache could still contain:

user = {
  id: 7,
  name: "Jordan",
  role: "admin"
}

even though the server session is now gone.

So we need to make sure RTK Query doesn't continue treating that cached user as authenticated.

There are two common approaches:

1. Invalidate the current-user cache

Conceptually:

Logout succeeds
      ↓
Invalidate /me cache
      ↓
RTK Query knows the cached user is stale
      ↓
If /me is requested again
      ↓
Server returns 401
      ↓
Frontend knows user is logged out

This fits directly with what you already learned about tags and cache invalidation.

2. Remove/reset the auth cache

For logout, you may also explicitly remove the cached /me data because you already know the session has ended.

So don't memorize a single method yet. The important mental model is:

When authentication changes, the frontend's cached authentication data must be brought back into agreement with the server.

And this is exactly the kind of situation where your earlier RTK Query knowledge becomes useful.

Let's connect the whole flow now

You can think of the application as:

LOGIN
  ↓
Server establishes session
  ↓
GET /me
  ↓
RTK Query caches current user
  ↓
ProtectedRoute
  ↓
Dashboard


LOGOUT
  ↓
Server ends session
  ↓
Clear/invalidate current-user cache
  ↓
ProtectedRoute sees unauthenticated state
  ↓
/login


//  React Router + RTK Query

Step 1 — Set up the routes

Assume we're using React Router.

We want this structure:

/login
/dashboard
/profile
/orders

But /dashboard, /profile, and /orders should be protected.

First, without worrying about authentication yet:

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

Right now, all four routes are accessible.

The architecture question

We don't want to write this repeatedly:

<Route
  path="/dashboard"
  element={
    isAuthenticated
      ? <Dashboard />
      : <Navigate to="/login" />
  }
/>

and then repeat the same logic for Profile and Orders.

Instead, we can create:

<ProtectedRoute>
   ...
</ProtectedRoute>

that handles the authentication check once.

Before we write it, where do you think ProtectedRoute should get the authentication information from?

ProtectedRoute gets the current user through the RTK Query hook, which reads from/updates the RTK Query cache.

Server
  ↓
GET /me
  ↓
RTK Query
  ↓
useGetCurrentUserQuery()
  ↓
ProtectedRoute

So let's write that piece.

Step 2 — Current-user endpoint

Our auth API could have:

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => "/me",
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
} = authApi;

The important part is:

useGetCurrentUserQuery()

When ProtectedRoute calls it, RTK Query handles whether the data is already cached, whether a request needs to happen, loading/error state, etc.

Then our guard can use:

function ProtectedRoute() {
  const {
    data: user,
    isLoading,
  } = useGetCurrentUserQuery();

  // ...
}

And now we reach the exact logic you already reasoned through:

if (isLoading) {
  return <Loading />;
}

if (!user) {
  return <Navigate to="/login" />;
}

return <Outlet />;
One thing I want you to notice

ProtectedRoute doesn't ask RTK Query for "isAuthenticated."

It asks for the current user.

Then it derives authentication:

user exists
    ↓
authenticated

user doesn't exist
    ↓
unauthenticated

That's another example of derived state — something you've already learned in Redux.

Step 3 — Put it together

Now our routing can look like:

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

And the guard:

function ProtectedRoute() {
  const {
    data: user,
    isLoading,
  } = useGetCurrentUserQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

The replace is a small but useful detail: when an unauthenticated user is redirected to /login, we generally don't want the blocked /dashboard URL sitting in browser history as a previous page.

The whole flow now
User visits /dashboard
        ↓
React Router matches protected route
        ↓
ProtectedRoute renders
        ↓
useGetCurrentUserQuery()
        ↓
      /me
        ↓
   ┌────┴─────┐
   ↓          ↓
Loading      Result
   ↓          ↓
Loading    user exists?
            ↙    ↘
          yes     no
           ↓       ↓
        Outlet   /login
           ↓
      Dashboard

You now have the core of a real protected-route architecture.

Step 4 — Successful login

We already have:

LoginForm
   ↓
useLogin()
   ↓
POST /login
   ↓
Server establishes session

Suppose the server responds successfully.

The important thing is that the login form doesn't need to manually set isAuthenticated = true.

Instead, after the server establishes the session, /me becomes the source of truth.

Login flow
User submits LoginForm
        ↓
     useLogin()
        ↓
    POST /login
        ↓
Server establishes session
        ↓
   login succeeds
        ↓
      /me
        ↓
   current user exists
        ↓
ProtectedRoute allows access
        ↓
     Dashboard

This is important because we're avoiding duplicate authentication state.

We don't want:

const [isAuthenticated, setIsAuthenticated] = useState(false);

while also having:

const { data: user } = useGetCurrentUserQuery();

because now we have two sources of truth that can disagree.

How do we make /me update?

Since RTK Query owns the /me request, after login we can tell RTK Query that its current-user data needs to be refreshed.

Conceptually:

await loginUser(form);

dispatch(
  authApi.util.invalidateTags([
    { type: "Auth", id: "CURRENT_USER" }
  ])
);

And our endpoint would provide that tag:

getCurrentUser: builder.query<User, void>({
  query: () => "/me",
  providesTags: [
    { type: "Auth", id: "CURRENT_USER" }
  ],
}),

Then RTK Query knows:

"The authentication-related data has changed. The /me cache should be considered stale."

If the protected route is subscribed to that query, it can refetch and receive the newly authenticated user.

But here's something I want you to reason through

Imagine this sequence:

1. User is on /login
2. /me currently returns 401
3. User submits valid credentials
4. POST /login succeeds
5. Server establishes the session
6. /me is invalidated/refetched
7. /me now returns the User

At step 2, the user is unauthenticated.

At step 7, they're authenticated.

What  happens to ProtectedRoute when /me changes from "no user" to a real User?

Before login:

/me → 401
  ↓
user = undefined
  ↓
ProtectedRoute
  ↓
/login


After successful login:

POST /login → success
  ↓
session established
  ↓
invalidate/refetch /me
  ↓
/me → User
  ↓
user = User
  ↓
ProtectedRoute
  ↓
<Outlet />
  ↓
Dashboard

Suppose we're on /dashboard:

user = Jordan

The user clicks Logout.

We call:

await logoutUser();

The server ends the session.

Then we need RTK Query to stop treating the old /me result as valid.

Conceptually:

dispatch(
  authApi.util.invalidateTags([
    { type: "Auth", id: "CURRENT_USER" }
  ])
);

Then /me is checked again, returns 401, and:

user → undefined

The protected route sees:

if (!user) {
  return <Navigate to="/login" replace />;
}

and the user is redirected.

So you've now got the complete authentication cycle:

             LOGIN
               ↓
        session established
               ↓
              /me
               ↓
        current user cached
               ↓
        ProtectedRoute
               ↓
           Dashboard
               ↓
            LOGOUT
               ↓
        session terminated
               ↓
          /me invalidated
               ↓
           401 / no user
               ↓
            /login

//                      API error handling

You've already handled a basic server error:
try {
  await login(form);
} catch {
  setServerError("Invalid email or password");
}

But real applications don't just have one kind of error.

For example:
400 → Bad request
401 → Not authenticated
403 → Not allowed
404 → Resource doesn't exist
500 → Server error
Network failure → Server couldn't be reached

The frontend shouldn't necessarily show the same message for all of them.

A 404 here means the requested resource doesn't exist at that endpoint — in our case, order 42 wasn't found.

So the UI could show something like:

Order not found

rather than something vague like:

Something went wrong

That distinction matters because the user can actually understand what happened.

Now let's separate two kinds of failure

Suppose instead the request fails because the server is completely unreachable:

GET /orders/42
       ↓
Network error

There isn't a valid HTTP status like 404 because the request didn't successfully receive an HTTP response.

So these are different:

HTTP error
→ Server responded
→ We know what status it gave us

Network error
→ We couldn't communicate with the server
→ No HTTP response was received

A simple mapping:

Situation	Meaning	Possible UI
400	Request was invalid	Check the information entered
401	Not authenticated	Log in
403	Authenticated but not permitted	Access denied
404	Resource not found	Order not found
500	Server-side failure	Something went wrong; try again
Network error	Couldn't reach server	Check connection / try again

You don't need to memorize every status code. The important ones you'll repeatedly encounter are 400, 401, 403, 404, 409, and 500.

So we now have the basic request-state pattern:

isLoading
   ↓
Loading UI

request succeeds
   ↓
Data UI

request fails
   ↓
Error UI

For the order page:

const {
  data: order,
  error,
  isLoading,
} = useGetOrderByIdQuery(id);

if (isLoading) {
  return <p>Loading...</p>;
}

if (error) {
  return <p>Something went wrong.</p>;
}

return <OrderDetails order={order} />;

But there's one more state that is easy to overlook:

Empty state

Imagine the request succeeds:

200 OK

but there are no orders.

That's not an error.

It's a valid result:

Request succeeded
       ↓
No data to display
       ↓
Empty state

For example:

No orders found.

This gives you a very useful UI-state model:

             Request
                ↓
        ┌───────┴────────┐
        ↓                ↓
     Loading           Finished
                         ↓
                 ┌───────┴───────┐
                 ↓               ↓
              Error           Success
                                 ↓
                          ┌───────┴───────┐
                          ↓               ↓
                       Empty            Data

This is a pattern you'll use constantly in real frontend work.

Empty: the request succeeded, and the server legitimately returned no matching data.
Error: the request itself failed or the server returned an error response.

So:

GET /orders
   ↓
200 OK + []
   → "No orders found"

GET /orders
   ↓
500 / network failure
   → "Failed to load orders"

And notice that empty doesn't necessarily mean the server "can't find" orders. It could simply mean there genuinely aren't any orders matching the current search/filter.

This matters a lot for UX because the two states should usually give the user different actions:

Empty
→ "No orders found"
→ maybe "Create your first order"

Error
→ "Failed to load orders"
→ "Try again"


//  retry

Suppose /orders fails because of a temporary network problem.

Instead of forcing the user to refresh the entire page, we'd usually give them:

<button onClick={refetch}>
  Try again
</button>

RTK Query gives query hooks a refetch() function.

So:

const {
  data,
  isLoading,
  isError,
  refetch,
} = useGetOrdersQuery();

and:

{isError && (
  <div>
    <p>Failed to load orders.</p>
    <button onClick={refetch}>
      Try again
    </button>
  </div>
)}

The important thing isn't memorizing refetch.

It's recognizing:

An error state should often provide a recovery action rather than leaving the user stuck.

For an initial load, a full loading state makes sense:

Loading orders...

But after the user already has a page and clicks Try again, you often don't want to wipe everything and show a blank loading screen.

You could instead show:

Failed to load orders.
[ Try again ]

↓ click

Retrying...

while keeping the existing UI around if there is existing data.

RTK Query gives you enough state to distinguish these situations. One useful distinction is:

isLoading
→ initial request; no data yet

isFetching
→ a request is currently happening, including refetches

So conceptually:

if (isLoading) {
  return <FullPageLoading />;
}

if (isError) {
  return <ErrorWithRetry />;
}

return (
  <>
    {isFetching && <p>Updating...</p>}
    <OrderList orders={data} />
  </>
);

That distinction is very useful in real applications.

But notice what we're doing

We're not just learning RTK Query API properties.

We're developing the frontend engineering mindset:

What state is the user actually in, and what UI best communicates that state?

That's much more valuable than memorizing isLoading vs isFetching.


//  search, filtering, and debounce

Suppose we have:

<input
  value={search}
  onChange={e => setSearch(e.target.value)}
/>

and every change immediately triggers:
J
↓
API request

Jo
↓
API request

Jor
↓
API request

Jord
↓
API request

Jorda
↓
API request

Jordan
↓
API request

That's potentially six requests for one search.

Without debounce
J       → request
Jo      → request
Jor     → request
Jord    → request
Jorda   → request
Jordan  → request
With debounce
J
  ↓ wait
Jo
  ↓ wait
Jor
  ↓ wait
Jordan
  ↓ user stops typing
      ↓
   request

The timer effectively keeps getting reset every time the user types.

A simplified version:
useEffect(() => {
  const timer = setTimeout(() => {
    searchProducts(search);
  }, 500);

  return () => {
    clearTimeout(timer);
  };
}, [search]);

The important part is:
return () => clearTimeout(timer);

When search changes, React cleans up the previous effect, cancelling its timer before creating a new one.

So if the user types:
J → Jo → Jor → Jord

the previous timers are continually cancelled.

Only after the user stops typing for 500ms does the latest timer complete and call the search.

The effect:
useEffect(() => {
  const timer = setTimeout(() => {
    searchProducts(search);
  }, 500);

  return () => {
    clearTimeout(timer);
  };
}, [search]);

runs again whenever search changes.

React essentially does:
old effect
   ↓
cleanup old timer
   ↓
new effect
   ↓
new timer

That is what creates the debounce behavior.

If an empty search means "show everything", there's usually no reason to send a search request such as:

GET /products?search=

You can handle it locally:

useEffect(() => {
  if (search.trim() === "") {
    return;
  }

  const timer = setTimeout(() => {
    searchProducts(search);
  }, 500);

  return () => {
    clearTimeout(timer);
  };
}, [search]);

But there's an important UX detail here.

If the user previously searched:

Jordan

and then deletes the search:

""

you probably don't want the UI to remain showing the Jordan results forever.

You might instead reset the results to the normal unfiltered list:

search = "Jordan"
      ↓
Jordan results

search = ""
      ↓
clear search/filter
      ↓
show normal product list

That's a product decision rather than a TypeScript/React rule.

//Debounce vs throttle

There's another technique you'll encounter: throttling.

They sound similar but solve different problems.

Debounce:
"Wait until the activity stops."

Useful for:
Search input
Autocomplete
Validation after typing

Throttle:
"Allow the action at most once within a time window."

Useful for things like:
Scroll events
Resize events
Mouse movement

//   pagination & infinite scrolling

Suppose the API has 1,000 products, but the UI should display only 20 at a time.

Why is it generally better to request 20 products from the server rather than request all 1,000 and use JavaScript to display only 20?

both the server and client do unnecessary work if we fetch all 1,000.

Request all 1,000
      ↓
Server prepares 1,000
      ↓
Network transfers 1,000
      ↓
Browser receives 1,000
      ↓
JavaScript keeps only 20
      ↓
9980-ish? No — 980 were unnecessary

Whereas pagination:

Request page 1
      ↓
Server returns 20
      ↓
Browser receives 20
      ↓
Render 20

Benefits include:

less data transferred
less memory used by the browser
less parsing/processing
faster initial response
less rendering work
better scalability as the dataset grows
One important distinction

Pagination isn't primarily a React optimization.

It's usually an API/data-fetching design:
GET /products?page=1&limit=20

The server decides which 20 records to return.

Your frontend then manages things like:
current page
loading
next/previous controls

And this connects directly to your RTK Query knowledge:
useGetProductsQuery(page)

Each different page becomes a different query argument/cache entry.

When page changes from 3 → 4:
useGetProductsQuery(4)

RTK Query treats 4 as a different query argument, so it looks for a separate cache entry for page 4.

Page 3 → cache entry for getProducts(3)
Page 4 → cache entry for getProducts(4)
If page 4 isn't cached → request page 4 from the server
Page 3's cache can remain available for reuse, depending on cache retention.

When you go:

Page 3 → Page 4 → Page 5 → Page 4

RTK Query checks whether the getProducts(4) cache entry still exists.

If the page 4 cache is still retained → it can use that cached data.
If the cache was removed because it exceeded keepUnusedDataFor → it makes a new request.
If something caused the cache to become stale/refetch, it may request again.
Simply changing from page 5 back to page 4 does not inherently mean a refetch.

So the key idea is:
Query argument determines the cache entry; cache lifetime and refetch rules determine whether another request happens.

RTK Query doesn't continuously watch the server. It has the cached result, but it doesn't automatically know that the server changed.

A refetch can happen because of things like:
invalidatesTags
refetchOnMountOrArgChange
polling
manually calling refetch()
other configured refetch behavior

So the mental model is:

Server changes
      ↓
RTK Query doesn't automatically know
      ↓
Something triggers refetch/invalidation/polling
      ↓
Server is requested again
      ↓
Cache is updated
      ↓
UI receives new data


// infinite scrolling

Suppose a product page initially loads:

Products 1–20

Then the user scrolls near the bottom and the app loads:

Products 21–40

The important distinction is:

Pagination: page 1 can be replaced by page 2 because you're viewing one page at a time.
Infinite scroll: page 2 is appended to page 1, so the list becomes:
1–20
↓
21–40
↓
41–60
↓
...

One important RTK Query point

With infinite scrolling, the frontend needs to combine the results:

Cache:
page 1 → products 1–20
page 2 → products 21–40
page 3 → products 41–60

UI:
[page 1] + [page 2] + [page 3]

This is slightly different from ordinary pagination because the user expects previous results to remain visible.

//Testing

Three levels you'll encounter

1. Unit tests
Test a small piece of logic in isolation.

function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}

You could test:
calculateTotal(500, 3) → 1500

2. Component/integration tests
Test how UI pieces behave together.

For the login button:
click Login
   ↓
login handler runs
   ↓
loading state appears

3. End-to-end (E2E) tests
Test a realistic user journey through the application:
Open login page
   ↓
Enter email/password
   ↓
Click Login
   ↓
API succeeds
   ↓
Dashboard appears


1. Your actual code
Suppose you have:
src/
  utils/
    pricing.ts

Inside pricing.ts:

export function getDiscountedPrice(
  price: number,
  discount: number
) {
  return price - (price * discount) / 100;
}
2. Create a test file

Usually you put the test beside the file:

src/
  utils/
    pricing.ts
    pricing.test.ts

Then:

import { describe, expect, it } from "vitest";
import { getDiscountedPrice } from "./pricing";

describe("getDiscountedPrice", () => {
  it("calculates a 25% discount correctly", () => {
    expect(getDiscountedPrice(200, 25)).toBe(150);
  });
});

Notice that we're calling the function inside the test:

getDiscountedPrice(200, 25)

But we're not manually calling the test itself.

3. Tell Vitest to run

In package.json, you'd have a script such as:
"scripts": {
  "test": "vitest"
}

Then from your project terminal:
npm test

Vitest searches for files such as:

*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx

and executes the tests.

You'd see something roughly like:

✓ src/utils/pricing.test.ts
  ✓ calculates a 25% discount correctly

Test Files  1 passed
Tests       1 passed
The complete relationship
Your application code
        ↓
   pricing.ts
        ↓
getDiscountedPrice()


Your test code
        ↓
pricing.test.ts
        ↓
getDiscountedPrice(200, 25)
        ↓
expect(...).toBe(150)


Terminal
        ↓
npm test
        ↓
Vitest discovers pricing.test.ts
        ↓
runs the test
        ↓
PASS / FAIL

So think of a test file as a separate program whose job is to exercise your application code and check whether the results match your expectations.

