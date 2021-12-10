import fs from 'fs';

const input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n").filter(x => x)
  .map(line => line.split('').map(Number));

const getLeft = (row, col) => input[row][col - 1] ?? Infinity;
const getRight = (row, col) => input[row][col + 1] ?? Infinity;
const getUp = (row, col) => input[row - 1] ? input[row - 1][col] : Infinity;
const getDown = (row, col) => input[row + 1] ? input[row + 1][col] : Infinity;
const isWallOrNine = (p) => p === 9 || p === Infinity;

const findLowestPoints = (rows) => rows.reduce((acc, curr, row) => {
  const lowPoints = curr.reduce((res, level, col) => {
    const higherPoints = findAdjacentHigherPoints(level, row, col);
    return higherPoints.length === 4 ? [...res, {row, col, level}] : res;
  }, []);
  return [...acc, ...lowPoints];
}, []);

const findAdjacentHigherPoints = (currentLevel, row, col) => {
  const left = getLeft(row, col);
  const right = getRight(row, col);
  const up = getUp(row, col);
  const down = getDown(row, col);
  const isHigher = (p) => p > currentLevel;
  return [
    ...(isHigher(left) ? [{row, col: col - 1, level: left}] : []),
    ...(isHigher(right) ? [{row, col: col + 1, level: right}] : []),
    ...(isHigher(up) ? [{row: row - 1, col: col, level: up}] : []),
    ...(isHigher(down) ? [{row: row + 1, col: col, level: down}] : []),
  ];
}

const findAdjacentBasinPoints = (row, col) => {
  const left = getLeft(row, col);
  const right = getRight(row, col);
  const up = getUp(row, col);
  const down = getDown(row, col);
  return [
    ...(!isWallOrNine(left) ? [{row, col: col - 1, level: left}] : []),
    ...(!isWallOrNine(right) ? [{row, col: col + 1, level: right}] : []),
    ...(!isWallOrNine(up) ? [{row: row - 1, col, level: up}] : []),
    ...(!isWallOrNine(down) ? [{row: row + 1, col, level: down}] : []),
  ];
}

const findRecursiveLowerPoints = (point, pointsMet) => {
  pointsMet = pointsMet || {};
  const adjacent = findAdjacentBasinPoints(point.row, point.col).filter(p => !pointsMet[`${p.row}-${p.col}`]);

  adjacent.forEach((p => {
    const newPointsMet = {...pointsMet, [`${p.row}-${p.col}`]: true}
    pointsMet = findRecursiveLowerPoints(p, newPointsMet);
  }));

  return pointsMet;
}

part1();
part2();

function part1() {
  const lowestPoints = findLowestPoints(input);
  const totalRisk = lowestPoints.reduce((acc, curr) => acc + curr.level + 1, 0);
  console.log(totalRisk);
}

function part2() {
  const lowestPoints = findLowestPoints(input);
  const basinSizes = lowestPoints.map(point => Object.keys(findRecursiveLowerPoints(point)).length).sort(((a, b) => b - a));
  const threeBiggest = basinSizes.slice(0, 3);
  const multipliedBasins = threeBiggest.reduce((acc, curr) => acc * curr, 1);
  console.log(multipliedBasins);
}
