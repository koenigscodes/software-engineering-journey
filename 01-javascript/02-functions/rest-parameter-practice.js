function printNames(...names) {
  console.log(names);
}

printNames("John", "Andrew", "Peter");

function multiplyAll(...numbers) {
  let result = 1;
  for (const num of numbers) {
    result *= num;
    console.log(result);
  }
  return result;
}

multiplyAll(2,3,3);

function introduce(greeting, ...names) {
  console.log(`${greeting}, welcome to the intercontinental ${names.join(", ")}`)
}

introduce("Good Evening", "Andrew", "Peter", "John");