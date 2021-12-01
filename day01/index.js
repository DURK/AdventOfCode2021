import fs from 'fs';

// Load input
let input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n");
const measures = input.map(x => parseInt(x)).filter(x => x); // filter out NaN

const countIncreases = values => values.reduce((acc, curr, index) => values[index] > values[index - 1] ? ++acc : acc, 0);

// Part 1
console.log(countIncreases(measures));

// Part 2
const summedArray = measures.map((nextMeasure, i) => measures[i] + measures[i - 1] + measures[i - 2]);

console.log(countIncreases(summedArray));
