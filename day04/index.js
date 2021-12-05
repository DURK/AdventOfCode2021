import fs from 'fs';

// Load input
let input = fs.readFileSync(new URL('input.txt', import.meta.url), {encoding: "utf-8"}).split("\n");
const arrayColumn = (arr, n) => arr.map(x => x[n]);
const arrayOf = (size) => [...Array(size).keys()];

const bingoSize = 5;
const drawnNumbers = input[0].split(',');

const bingoCards = input.reduce((acc, curr, index) => {
  const firstOrLastLine = index === 0 || index === input.length - 1;
  if (firstOrLastLine) return acc;
  if (curr === '') { // start of bingo card
    const lines = arrayOf(bingoSize).map(row => input[index + 1 + row]).map(line => line.split(' ').filter(v => v));
    const newCard = {
      rows: lines,
      cols: arrayOf(bingoSize).map((i) => arrayColumn(lines, i))
    }
    return [...acc, newCard];
  }
  return acc;
}, []);

const markBingoCards = (cards, drawn) =>
  cards.map(card => ({
    rows: card.rows.map(row => row.filter(val => val !== drawn)),
    cols: card.cols.map(col => col.filter(val => val !== drawn)),
  }));

const doBingo = (cards, numbers, stopOnFirstBingo) => {
  let markedCards = [...cards];
  let winners = [];
  for (let i = 0; i < numbers.length; i++) {
    const drawn = numbers[i];
    markedCards = markBingoCards(markedCards, drawn);

    if (i < bingoSize) {
      continue; // can't have bingo yet
    }

    const bingoCards = markedCards.filter(card => card.rows.find(row => !row.length) || card.cols.find(col => !col.length));
    if (bingoCards.length > 0) {
      bingoCards.forEach((card) => {
        winners.push({card, drawn});
        markedCards = markedCards.filter(c => c !== card); // eliminate winning card
      })
      if (stopOnFirstBingo) {
        return winners;
      }
    }
  }
  return winners;
}

part1();
part2();

function part1() {
  const {card, drawn} = doBingo(bingoCards, drawnNumbers, true)[0];
  const totalUnmarked = card.rows.flat().reduce((acc, curr) => acc + Number(curr), 0);
  console.log(totalUnmarked * drawn);
}

function part2() {
  const winners = doBingo(bingoCards, drawnNumbers, false);
  const lastWinner = winners[winners.length - 1];
  const {card, drawn} = lastWinner;

  const totalUnmarked = card.rows.flat().reduce((acc, curr) => acc + Number(curr), 0);
  console.log(totalUnmarked * drawn);
}
