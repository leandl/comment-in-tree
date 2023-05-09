const characters ='ABCDEFGH     IJKLMNOPQRSTUVWXY       Zabcdefghij      klmnopqrstuvwx     yz0123456789';

export function generateString(length: number) {
  let result = '';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}