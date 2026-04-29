function wordColoring(word: string, target: string): number {
  let letterCount = new Uint8Array(26);
  let colors = new Uint8Array(5);
  for (let i = 0; i < 5; i++) {
    if (word[i] === target[i]) {
      colors[i] = 2;
    } else {
      const idx = target.charCodeAt(i) - 97;
      letterCount[idx]++;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (colors[i] == 0) {
      const idx = word.charCodeAt(i) - 97;
      if (letterCount[idx] > 0) {
        colors[i] = 1;
        letterCount[idx]--;
      }
    }
  }

  return colors.reduce((acc, v) => acc * 3 + v, 0);
}

export class Solver {
  fullList: string[];
  remaining: string[];

  constructor() {
    this.fullList = [];
    this.remaining = [];
  }

  load(text: string) {
    const words = text.split("\n");
    if (words.at(-1) === "") {
      words.pop();
    }
    this.fullList = words;
    this.remaining = [];
  }

  newGame() {
    this.remaining = [...this.fullList];
  }

  filter(word: string, coloring: number[]) {
    let color = coloring.reduce((acc, c) => 3 * acc + c);
    this.remaining = this.remaining.filter(w => wordColoring(word, w) === color);
  }

  #suggestionScore(suggestion: string) {
    const scores = new Uint16Array(343);
    const n = this.remaining.length;
    for (let i = 0; i < n; i++) {
      const color = wordColoring(suggestion, this.remaining[i]);
      scores[color]++;
    }
    return Math.max(...scores);
  }

  suggestion() {
    if (this.remaining.length <= 2) {
      return this.remaining[0];
    }
    const n = this.fullList.length;
    let bestScore = 10000000;
    let bestWord = "";
    for (let i = 0; i < n; i++) {
      const word = this.fullList[i];
      const score = this.#suggestionScore(word);
      if (score < bestScore) {
        bestScore = score;
        bestWord = word;
      }
    }
    return bestWord;
  }
}