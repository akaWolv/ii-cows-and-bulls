import { generate } from 'randomstring';

const generateRandomKey = (): string => String(generate({
  length: 6,
  readable: true
})).toUpperCase()

export default generateRandomKey
