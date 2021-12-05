import fs from 'fs';

// Load input
let input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n");
const inputLines = input
  .filter(i => i) // remove empty
  .map(line => line.split(' -> '))
  .map(coords => ({from: coords[0].split(',').map(Number), to: coords[1].split(',').map(Number)}));

const detectOverlap = (lines, options) => {
  const points = {};
  const overlapPoints = [];

  const markPoint = (x, y) => {
    if (points[[x, y]]) {
      points[[x, y]]++;
      overlapPoints[[x, y]] = points[[x, y]];
    } else {
      points[[x, y]] = 1;
    }
  };

  lines.forEach(line => {
    const [x1, x2, y1, y2] = [line.from[0], line.to[0], line.from[1], line.to[1]];
    const [fromX, fromY, toY, toX] = [Math.min(x1, x2), Math.min(y1, y2), Math.max(y1, y2), Math.max(x1, x2)];

    if (x1 === x2) { // vertical
      for (let y = fromY; y <= toY; y++) {
        markPoint(x1, y);
      }
    } else if (y1 === y2) { // horizontal
      for (let x = fromX; x <= toX; x++) {
        markPoint(x, y1);
      }
    } else if (options.includeDiagonal) { // diagonal
      const forward = fromX === x1;
      const up = fromY === y1;
      for (let x = x1, y = y1; forward ? x <= x2 : x >= x2; forward ? x++ : x--, up ? y++ : y--) {
        markPoint(x, y);
      }
    }
  });

  return overlapPoints;
};

part1();
part2();

function part1() {
  let overlapPoints = detectOverlap(inputLines, {includeDiagonal: false});
  console.log(Object.keys(overlapPoints).length);
}

function part2() {
  let overlapPoints = detectOverlap(inputLines, {includeDiagonal: true});
  console.log(Object.keys(overlapPoints).length);
}
