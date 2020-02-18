export const stringToDate = (string) => {
  const parts = string.split('.')
  return new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
}
