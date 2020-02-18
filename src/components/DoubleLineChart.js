import React from 'react';
import { AxisLabel } from './AxisLabel.js'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const DoubleLineChart = ({ data, key1, key2, width, height }) => {
  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{
        top: 20, right: 50, left: 30, bottom: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" label={
        <AxisLabel
          axisType="yAxis"
          x={25}
          y={height / 2 - 25}
          width={0}
          height={0}
          rotation={270}
        >{key1}</AxisLabel>
      } />
      <YAxis yAxisId="right" orientation="right" label={
        <AxisLabel
          axisType="yAxis"
          x={width - 20}
          y={height / 2 - 25}
          width={0}
          height={0}
          rotation={90}
        >{key2}</AxisLabel>
      } />
      <Tooltip />
      <Legend />
      <Line yAxisId="left" type="monotone" isAnimationActive={false} dataKey={key1} stroke="#EC6A2D" strokeWidth={2} />
      <Line yAxisId="right" type="monotone" isAnimationActive={false} dataKey={key2} stroke="#404E55" strokeWidth={2} />
    </LineChart>
  )
}
