function multiply(a, b) {
    console.log(a * b);
}

const answer = multiply(5, 8);

console.log(answer);

// Rest params
  function sum(...numbers) {
    console.log(numbers);

    let total = 0;

    for (const num of numbers) {
        total += num;
    }

    return total;
}

  console.log(sum(10, 20, 30, 40));

  // Higher Order Functions
  function greet() {
    console.log("Hello");
  }

  function execute(fn) {
    fn();
  }

  execute(greet);

  // map()
  const numbers = [2, 4, 6];
  const result = numbers.map(num => num + 1);
  console.log(result);

  const numbers = [1, 2, 3];
  const result = numbers.map(num => num * 10);
  console.log(result);

  const numbers = [1, 2, 3, 4, 5];

const result = numbers
  .filter(num => num % 2 === 1)
  .map(num => num * 10);

  console.log(result);

  const users = [
  { name: "Jordan", active: true },
  { name: "Peter", active: false },
  { name: "Mary", active: true },
  { name: "Alex", active: false }
];

const result = users
  .filter(user => user.active)
  .map(user => user.name);

console.log(result);

const numbers = [5, 10, 15, 20, 25];
const result = numbers.find(num => num > 12);
console.log(result);

const ages = [22, 19, 17, 25];
const result = ages.every(age => age >= 18);
console.log(result);

// reduce()
const words = ["I", "love", "JavaScript"];
const sentence = words.reduce(
  (text, word) => text + " " + word,
  ""
);
console.log(sentence);

const orders = [
  { total: 100 },
  { total: 250 },
  { total: 75 }
];
const revenue = orders.reduce(
  (sum, order) => sum + order.total,
  0
);
console.log(revenue);

// Destructing
const person = {
  name: "Jordan",
  age: 25
};
const { name, age, country } = person;
console.log(country);

const student = {
  name: "Jordan",
  course: "Computer Science"
};
const {
  name: fullName,
  age = 22,
  course
} = student;
console.log(fullName);
console.log(age);
console.log(course);

// Array destructuring


// spread operator
const first = [1, 2];
const second = [3, 4];
const combined = [...first, ...second];
console.log(combined);

const user = {
  name: "Jordan",
  age: 25
};
const updatedUser = {
  ...user,
  country: "Nigeria"
};
console.log(user);
console.log(updatedUser);