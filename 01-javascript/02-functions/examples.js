// Function Declaration And Expression

sayHello();
function sayHello() {
    console.log("Hello");
}

sayHi();
const sayHi = function () {
    console.log("Hi");
};
// default params
function greet(name = "Guest") {
    return `Hello ${name}`;
}

console.log(greet());
console.log(greet("Jordan"));

// find()
const users = [
  { name: "Jordan", active: false },
  { name: "Peter", active: false },
  { name: "Mary", active: true },
  { name: "Alex", active: true }
];
const result = users.find(user => user.active);
console.log(result);

// some()
const numbers = [1, 3, 5, 8, 9];
const result = numbers.some(num => num % 2 === 0);
console.log(result);

// reduce()
const numbers = [2, 4, 6];

const result = numbers.reduce(
  (sum, num) => sum + num,
  0
);

const words = ["I", "love", "JavaScript"];
const sentence = words.reduce(
  (text, word) => text + " " + word,
  ""
);
console.log(sentence);