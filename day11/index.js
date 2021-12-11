import fs from 'fs';

let input;
const loadInput = () => input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n")
  .filter(x => x).map(l => l.split('').map(Number));

const ADJACENT_CELLS = [
  {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}, // top
  {x: -1, y: 0}, {x: 1, y: 0}, // middle
  {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, // bottom
];
const cellExists = (y, x) => input[y] && input[y][x] !== undefined;
const synchronized = () => input.reduce((acc, row) => acc && row.every((val) => val === row[0]), true);
const incrementEachCell = () => input.forEach((row, y) => row.forEach((col, x) => input[y][x]++));

const flash = (y, x, flashed) => {
  if (flashed[[y, x]]) {
    return; // skip, already flashed this step
  }
  flashed[[y, x]] = true;

  // increment adjacent cells
  ADJACENT_CELLS.forEach(({y: offY, x: offX}) => {
    if (cellExists(y + offY, x + offX)) {
      input[y + offY][x + offX]++;
    }
  });

  // run flashes
  ADJACENT_CELLS.forEach(({y: offY, x: offX}) => {
    if (cellExists(y + offY, x + offX) && input[y + offY][x + offX] > 9) {
      flash(y + offY, x + offX, flashed);
    }
  });
};

const runStep = () => {
  const flashed = {};

  incrementEachCell();

  // run flashes
  input.forEach((row, y) => row.forEach((col, x) => input[y][x] > 9 && flash(y, x, flashed)));

  // reset flashed cells
  Object.keys(flashed).forEach((cell) => {
    const [y, x] = cell.split(',');
    input[y][x] = 0;
  });

  return Object.keys(flashed).length;
}

const part1 = () => {
  loadInput();
  const steps = 100;
  return [...Array(steps).keys()].reduce((acc) => acc + runStep(), 0);
};

const part2 = () => {
  loadInput();
  let step = 0;
  while (!synchronized()) {
    runStep();
    step++;
  }
  return step;
};

console.log(part1());
console.log(part2());
