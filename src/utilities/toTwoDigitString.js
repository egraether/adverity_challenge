export const toTwoDigitString = number => {
  return number >= 0 && number < 10 ? "0" + String(number) : String(number);
};
