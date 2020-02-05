import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { csv } from 'd3'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const csvFile = "data.csv"

const AxisLabel = ({ axisType, x, y, width, height, rotation, stroke, children }) => {
  const isVert = axisType === 'yAxis';
  const cx = isVert ? x : x + (width / 2);
  const cy = isVert ? (height / 2) + y : y + height + 10;
  const rot = rotation ? `${rotation} ${cx} ${cy}` : 0;
  return (
    <text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke}>
      {children}
    </text>
  );
};

export default () => {

  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  })

  const [data, setData] = useState([])

  useEffect(() => {
    csv(csvFile).then(data => { setData(_.take(data, 15)) })
  }, [])

  console.log(data);

  const chartData = React.useMemo(
    () => {
      let a = 0;

      return _.map(data, d => {
        return {
          name: String(a++),
          Clicks: Number.parseInt(d.Clicks),
          Impressions: Number.parseInt(d.Impressions)
        }
      })
    },
    [data]
  )

  return (
    <div>
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5, right: 40, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" label={
          <AxisLabel axisType="yAxis" x={25} y={125} width={0} height={0} rotation={270}>Clicks</AxisLabel>
        } />
        <YAxis yAxisId="right" orientation="right" label={
          <AxisLabel axisType="yAxis" x={480} y={125} width={0} height={0} rotation={90}>Impressions</AxisLabel>
        } />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="Clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="Impressions" stroke="#82ca9d" />
      </LineChart>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
