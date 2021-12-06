import fs from 'fs';

// Load input
let input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split(",").map(Number);

const runFishSimulation = (timers, days) => {
  const countByTick = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  input.forEach(tick => countByTick[tick]++);   // set initial counters

  for (let i = 0; i < days; i++) {
    countByTick[7] += countByTick[0];           // move first number to 7
    const newGeneration = countByTick.shift();  // get new generation
    countByTick.push(newGeneration);            // and add to end
  }

  return countByTick.reduce((acc, curr) => acc + curr); // sum fish in each tick
};

part1();
part2();

function part1() {
  const timers = runFishSimulation(input, 80);
  console.log(timers);
}

function part2() {
  const timers = runFishSimulation(input, 256);
  console.log(timers);
}
