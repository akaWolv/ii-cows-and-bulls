export type Guess = {
  id: number,
  number: number,
  answer: {c: number, b: number}
}

export type GuessList = Guess[]
