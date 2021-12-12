import fs from 'fs';

const input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n")
  .filter(x => x).map(x => x.split('-'));
const isLowercase = (str) => str.toLowerCase() === str;

const buildMap = () => {
  const map = {};
  input.forEach((row) => {
    const [from, to] = row;
    map[from] = (map[from] || []).concat(to);
    map[to] = (map[to] || []).concat(from);
  });
  return map;
};

const findRoutes = (map, pathsFound, jokerCave, path, visited) => {
  path = path || ['start'];
  visited = (visited || path).filter(isLowercase);

  const [lastStep] = path.slice(-1);
  if (lastStep === 'end') {
    pathsFound[path.join(',')] = true;
    return; // DONE
  }
  const nextSteps = map[lastStep].filter(s => !visited.includes(s));
  nextSteps.forEach((next) => {
    if (next === jokerCave) { // use joker, don't add cave to visited
      findRoutes(map, pathsFound, undefined, [...path, next], visited);
    }
    findRoutes(map, pathsFound, jokerCave, [...path, next], [...visited, next]);
  });
};

const part1 = () => {
  const map = buildMap();
  const pathsFound = {};
  findRoutes(map, pathsFound, false);
  return Object.keys(pathsFound).length;
};

const part2 = () => {
  const map = buildMap();
  const smallCaves = Object.keys(map).filter(isLowercase).filter(x => !['end', 'start'].includes(x));

  const totalPaths = smallCaves.reduce((acc, jokerCave) => {
    const pathsFound = {};
    findRoutes(map, pathsFound, jokerCave);
    return {...acc, ...pathsFound};
  }, {});

  return Object.keys(totalPaths).length;
};

console.log(part1());
console.log(part2());
