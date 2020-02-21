import { accumulatedNumberOrNaN } from "./accumulatedNumberOrNaN.js";

test("accumulates values parsed to numbers of provided key", () => {
  expect(
    accumulatedNumberOrNaN(
      [
        { Clicks: "20", Impressions: "5" },
        { Clicks: "3" },
        { Clicks: "9", Impressions: "29" },
        { Impressions: "13" }
      ],
      "Clicks"
    )
  ).toStrictEqual(32);
});

test("returns NaN for non-existent key", () => {
  expect(
    accumulatedNumberOrNaN(
      [
        { Clicks: "20", Impressions: "5" },
        { Clicks: "3" },
        { Clicks: "9", Impressions: "29" },
        { Impressions: "13" }
      ],
      "Income"
    )
  ).toStrictEqual(NaN);
});
