import fs from 'fs';

const input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n").filter(x => x);
const lines = input.map(line => {
  const parts = line.split(' | ');
  return {signalPatterns: parts[0].split(' '), outputValues: parts[1].split(' ')}
});
const intersection = (str1, str2) => str1.split('').filter(x => str2.split('').includes(x));
const sortAZ = (str) => str.split('').sort().join('');

const simpleDigitLengths = [2, 3, 4, 7];

part1();
part2();

function part1() {
  const count = lines.reduce((acc, curr) => acc + curr.outputValues.filter(v => simpleDigitLengths.includes(v.length)).length, 0);
  console.log(count)
}

function calculateOutput(line) {
  const findByLength = (length) => sortAZ(line.signalPatterns.find(p => p.length === length));
  const digitPatterns = {
    1: findByLength(2),
    4: findByLength(4),
    7: findByLength(3),
    8: findByLength(7),
  };

  for (const pattern of line.signalPatterns) {
    const sortedPattern = sortAZ(pattern);
    // check for 2, 3 or 5
    if (pattern.length === 5) {
      if (intersection(sortedPattern, digitPatterns[4]).length === 2) {
        digitPatterns[2] = sortedPattern;
      } else if (intersection(sortedPattern, digitPatterns[1]).length === 2) {
        digitPatterns[3] = sortedPattern;
      } else if (intersection(sortedPattern, digitPatterns[4]).length === 3) {
        digitPatterns[5] = sortedPattern;
      }
    }
    // check for 0, 6 or 9
    if (pattern.length === 6) {
      if (intersection(pattern, digitPatterns[1]).length === 1) {
        digitPatterns[6] = sortedPattern;
      } else if (intersection(pattern, digitPatterns[4]).length === 3) {
        digitPatterns[0] = sortedPattern;
      } else if (intersection(pattern, digitPatterns[4]).length === 4) {
        digitPatterns[9] = sortedPattern;
      }
    }
  }

  const patternToValue = (pattern) => Object.keys(digitPatterns).find(key => digitPatterns[key] === pattern);

  return parseInt(line.outputValues.reduce((acc, pattern) => acc + patternToValue(sortAZ(pattern)), 0));
}

function part2() {
  const sum = lines.reduce((acc, curr) => acc + calculateOutput(curr), 0);
  console.log(sum);
}
