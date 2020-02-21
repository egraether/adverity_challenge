export const toTwoDigitString = number =>
  number >= 0 && number < 10 ? "0" + String(number) : String(number);
