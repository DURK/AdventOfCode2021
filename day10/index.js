import fs from 'fs';

let input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n").filter(x => x);

const CLOSE_TAGS = {"(": ")", "[": "]", "{": "}", "<": ">"};
const ERROR_SCORES = {")": 3, "]": 57, "}": 1197, ">": 25137};
const AUTO_SCORES = {")": 1, "]": 2, "}": 3, ">": 4};

const calculateScore = (errors) => errors.reduce((acc, curr) => curr.found ? acc + ERROR_SCORES[curr.found] : acc, 0)
const removePairs = str => str.replace(/\(\)/g, '').replace(/\[]/g, '').replace(/{}/g, '').replace(/<>/g, '');
const invertTags = line => line.split('').reverse().map(tag => CLOSE_TAGS[tag]).join('');
const getAutocompleteLineScore = line => line.split('').reduce((acc, curr) => acc * 5 + AUTO_SCORES[curr], 0);

const calculateAutoCompleteScore = (errors) => errors
  .reduce((acc, curr) => [...acc, getAutocompleteLineScore(curr.completionString)], [])
  .sort((a, b) => a - b)[(errors.length - 1) / 2];

const findError = (line) => {
  let remainingLine = line;
  while (line.length > 0) {
    const updatedLine = removePairs(remainingLine);
    if (remainingLine !== updatedLine) { // next round of replacements
      remainingLine = updatedLine;
    } else { // no more replacements possible
      const firstClosingTag = remainingLine.split('').find(tag => [')', ']', '}', '>'].indexOf(tag) !== -1);
      if (!firstClosingTag) {
        return [{completionString: invertTags(remainingLine)}]; // incomplete, no error but completion string
      }
      const beforeLastChar = remainingLine[remainingLine.indexOf(firstClosingTag) - 1];
      const expectedTag = CLOSE_TAGS[beforeLastChar];
      return [{expectedTag, found: firstClosingTag}];
    }
  }
  return []; // valid
};

const findErrors = (lines) => lines.reduce((acc, curr) => [...acc, ...findError(curr)], []);

part1();
part2();

function part1() {
  const score = calculateScore(findErrors(input));
  console.log(score);
}

function part2() {
  const score = calculateAutoCompleteScore(findErrors(input).filter(e => e.completionString));
  console.log(score);
}
