import { createChartData } from './createChartData.js'

test("creates chart data with 'name', 'Clicks' and 'Impressions' for each 'Date'", () => {
  expect(createChartData(
    [
      { Date: "30.12.2020", Clicks: "20", Impressions: "5" },
      { Date: "30.12.2020", Clicks: "3" },
      { Date: "02.01.2021", Clicks: "9", Impressions: "29" },
      { Date: "05.01.2021", Impressions: "13" },
    ],
  )).toStrictEqual(
    [
      {"Clicks": 23, "Impressions": 5, "name": "30.12.2020"},
      {"name": "31.12.2020"},
      {"name": "01.01.2021"},
      {"Clicks": 9, "Impressions": 29, "name": "02.01.2021"},
      {"name": "03.01.2021"},
      {"name": "04.01.2021"},
      {"Clicks": NaN, "Impressions": 13, "name": "05.01.2021"}
    ]
  );
});

test("returns empty with empty data", () => {
  expect(createChartData(
    [],
  )).toStrictEqual(
    []
  );
});
