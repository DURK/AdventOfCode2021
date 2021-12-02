import fs from 'fs';

// Load input
let input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n");

// part 1
const result = input.map(i => i.split(" ")).reduce((acc, curr) => {
  const value = parseInt(curr[1]);
  switch (curr[0]) {
    case "forward":
      return {...acc, position: acc.position + value}
    case "down":
      return {...acc, depth: acc.depth + value}
    case "up":
      return {...acc, depth: acc.depth - value}
    default:
      return acc;
  }
}, {position: 0, depth: 0, aim: 0});

console.log(result.position * result.depth);

// part 2
const result2 = input.map(i => i.split(" ")).reduce((acc, curr) => {
  const value = parseInt(curr[1]);
  switch (curr[0]) {
    case "forward":
      return {...acc, position: acc.position + value, depth: acc.depth + acc.aim * value}
    case "down":
      return {...acc, aim: acc.aim + value}
    case "up":
      return {...acc, aim: acc.aim - value}
    default:
      return acc;
  }
}, {position: 0, depth: 0, aim: 0});

console.log(result2.position * result2.depth);
