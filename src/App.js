import React from 'react'
import { Chart } from 'react-charts'
import _ from 'lodash'

let lodash = () => {
  let a = _.chunk(['a', 'b', 'c', 'd'], 2);
  console.log(a);
}

export default () => {

  lodash();

  const data = React.useMemo(
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

  return (
    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart data={data} axes={axes} />
    </div>
  )
}