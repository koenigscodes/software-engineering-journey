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