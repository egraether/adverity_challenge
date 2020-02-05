import React, { useState, useEffect } from 'react';
import { Chart } from 'react-charts'
import _ from 'lodash'
import { csv } from 'd3'

const csvFile = "data.csv"

let lodash = () => {
  let a = _.chunk(['a', 'b', 'c', 'd'], 2);
  console.log(a);
}

export default () => {

  lodash();

  const testData = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]],
        secondaryAxisID: 'First Metric'
      },
      {
        label: 'Series 2',
        data: [[0, 300], [1, 100], [2, 500], [3, 600], [4, 400]],
        secondaryAxisID: 'Second Metric'
      }
    ],
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'time', position: 'bottom' },
      {
        type: 'linear',
        id: 'First Metric',
        min: 0,
        position: 'left'
      },
      {
        type: 'linear',
        id: 'Second Metric',
        min: 0,
        position: 'right',
        format: d => `$${d}`
      }
    ],
    []
  )

  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [data, setData] = useState([])

  useEffect(() => {
    csv(csvFile).then(data => { setData(data) })
  }, [])

  console.log(data);

  return (
    <div
      style={{
        width: '400px',
        height: '300px',
        margin: '20px'
      }}
    >
      <Chart data={testData} axes={axes} />
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}