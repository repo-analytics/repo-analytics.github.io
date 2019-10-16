const countries = require('./countries.json');

const guess = (address) => {
  const lowerCaseAddr = address.toLowerCase();
  let guess = null;
  for(let i = 0; i < countries.length; i++) {
    const country = countries[i];
    if (lowerCaseAddr.includes(country.country)) {
      guess = country.country;
      break;
    }

    for(let j = 0; j < country.alias.length; j++) {
      if (lowerCaseAddr.includes(country.alias[j])) {
        guess = country.country;
        break;
      }
    }

    for(let j = 0; j < country.cities.length; j++) {
      if (lowerCaseAddr.includes(country.cities[j])) {
        guess = country.country;
        break;
      }
    }

    if (guess) break;
  }
  return guess;
}

module.exports = guess;

// // test
// console.log(guess('China'));
// console.log(guess('beijing, china'));
// console.log(guess('USA'));
// console.log(guess('new york'));
console.log(guess('inia'))