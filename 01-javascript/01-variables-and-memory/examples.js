// SCOPE

const country = "Nigeria";

function outer() {
  const city = "Lagos";

  function inner() {
    const street = "Allen Avenue";

    console.log(country);
    console.log(city);
    console.log(street);
  }

  inner();
}
// The inner scope can look outward.
// So inner() can access:

// street  → own scope
// city    → outer scope
// country → global scope

// But the reverse isn't true.
// Global cannot simply access street.
function outer() {
  const secret = "hello";
}

console.log(secret);