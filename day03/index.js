import fs from 'fs';

// Load input
let input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n");
const bitLength = input[0].length;
const toDecimal = (binary) => parseInt(binary, 2);

// part 1
const getBinaryRate = (array, useMostCommon) =>
  [...Array(bitLength).keys()].map(index => {
    const values = array.map(val => val[index]);
    const amountZero = values.filter(val => Number(val) === 0).length;
    const zeroMostCommon = amountZero > array.length / 2;
    return zeroMostCommon ? (useMostCommon ? 0 : 1) : (useMostCommon ? 1 : 0);
  }).join('');

const gammaRate = toDecimal(getBinaryRate(input, true));
const epsilonRate = toDecimal(getBinaryRate(input, false));
console.log(gammaRate * epsilonRate);

// part 2
const getBinaryRating = (array, useMostCommon, useWhenEqual) => {
  let remainingArray = [...array];
  for (const index of [...Array(bitLength).keys()]) {
    const values = remainingArray.map(val => val[index]);
    const amountZero = values.filter(val => Number(val) === 0).length;
    let bitToKeep;
    if (amountZero === remainingArray.length / 2) {
      bitToKeep = useWhenEqual;
    } else {
      const zeroMostCommon = amountZero > remainingArray.length / 2;
      bitToKeep = zeroMostCommon ? (useMostCommon ? 0 : 1) : (useMostCommon ? 1 : 0);
    }
    remainingArray = remainingArray.filter(val => Number(val[index]) === bitToKeep);
    if (remainingArray.length === 1) {
      return remainingArray[0];
    }
  }
};

const oxygenRating = toDecimal(getBinaryRating(input, true, 1));
const co2Rating = toDecimal(getBinaryRating(input, false, 0));
console.log(oxygenRating * co2Rating);
