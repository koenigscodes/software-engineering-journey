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