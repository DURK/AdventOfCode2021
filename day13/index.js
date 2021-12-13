import fs from 'fs';

const input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n")
  .filter(x => x);
const inputDots = input.filter(i => !i.startsWith('fold')).map(i => {
  const [x, y] = i.split(',').map(Number);
  return {x, y};
});
const inputFolds = input.filter(i => i.startsWith('fold')).map(x => x.split('='));
const getDimensions = (dots) => ({
  x: Math.max(...dots.map(dot => dot.x)),
  y: Math.max(...dots.map(dot => dot.y))
})
const uniqueDots = (value, index, self) => self.findIndex(t => (t.x === value.x && t.y === value.y)) === index;

const doFold = (dots, fold) => {
  const direction = fold[0].split('fold along ')[1];
  const foldAt = parseInt(fold[1]);
  const dimensions = getDimensions(dots);

  return dots.map(dot => ({
    x: direction === 'x' && dot.x > foldAt ? dimensions[direction] - dot.x : dot.x,
    y: direction === 'y' && dot.y > foldAt ? dimensions[direction] - dot.y : dot.y
  })).filter(uniqueDots);
};

const printDots = (dots) => {
  const dimensions = getDimensions(dots);
  for (let y = 0; y <= dimensions.y; y++) {
    const line = [];
    for (let x = 0; x <= dimensions.x; x++) {
      const dotFound = dots.find(d => d.x === x && d.y === y);
      line.push(dotFound ? '#' : ' ');
    }
    console.log(line.join(' ')); // print row
  }
};

const part1 = () => doFold(inputDots, inputFolds[0]).length;
const part2 = () => inputFolds.reduce((acc, fold) => doFold(acc, fold), inputDots);

console.log(part1());
printDots(part2());
