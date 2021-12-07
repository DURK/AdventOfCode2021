import fs from 'fs';

let input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split(",").map(Number);

const sum = arr => arr.reduce((a, c) => a + c, 0);
const avg = arr => sum(arr) / arr.length;
const median = numbers => {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
};

const getFuelSpent = (targetPosition) => input.reduce((acc, curr) => {
  const distance = Math.abs(targetPosition - curr);
  const costs = [...Array(distance + 1).keys()];
  costs.shift();
  return acc + sum(costs);
}, 0);

part1();
part2();

function part1() {
  const fuelSpent = input.reduce((acc, curr) => acc + Math.abs(median(input) - curr), 0);
  console.log(fuelSpent)
}

function part2() {
  let position = Math.ceil(avg(input));
  let spent = getFuelSpent(position);
  let spent1Down = getFuelSpent(position - 1);
  let spent1Up = getFuelSpent(position + 1);

  if (spent1Down < spent) {
    spent = spent1Down;
  } else if (spent1Up < spent) {
    spent = spent1Up;
  }

  console.log(spent);
}
