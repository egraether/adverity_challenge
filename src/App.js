import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { csv } from 'd3'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Chip, Container, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

const csvFile = "data.csv"

const AxisLabel = ({ axisType, x, y, width, height, rotation, stroke, children }) => {
  const isVert = axisType === 'yAxis';
  const cx = isVert ? x : x + (width / 2);
  const cy = isVert ? (height / 2) + y : y + height + 10;
  const rot = rotation ? `${rotation} ${cx} ${cy}` : 0;
  return (
    <text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke} fill='#404E55'>
      {children}
    </text>
  );
};

class DataSelect extends React.Component {
  render() {
    return (
      <FormControl style={{maxWidth: 'sm'}}>
        <InputLabel id="label">{this.props.name}</InputLabel>
        <Select
          labelId="label"
          id="select"
          multiple
          style={{minWidth: '200px'}}
          value={this.props.select.length ? this.props.select : ["All"]}
          onChange={(e, c) => this.onChange(e, c)}
          renderValue={selected => (
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
              {selected.map(value => (
                <Chip key={value} label={value} style={{margin: 2}} />
              ))}
            </div>
          )}
        >
          <MenuItem value="All">All</MenuItem>
          {_.map(this.props.items, d => {
            return (
              <MenuItem value={d} key={d}>{d}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    )
  }

  onChange(event, child) {
    this.props.onChange(
      child.props.value === "All" ? [] : _.remove(event.target.value, d => { return d !== "All" })
    )
  }
}

export default () => {
  const [data, setData] = useState([])

  useEffect(() => {
    csv(csvFile).then(data => { setData(data) })
  }, [])

  const [currentDataSources, setCurrentDataSources] = useState([])
  const [currentCampaigns, setCurrentCampaigns] = useState([])

  const chartData = React.useMemo(
    () => {
      let chartData = data

      if (currentDataSources.length)
      {
        chartData = _.filter(chartData, d => _.includes(currentDataSources, d.Datasource))
      }

      if (currentCampaigns.length)
      {
        chartData = _.filter(chartData, d => _.includes(currentCampaigns, d.Campaign))
      }

      // Assumes that the data is in chronological order according to Date
      chartData = _.map(_.reduce(chartData, function(result, value, key) {
        if (!result[value.Date])
        {
          result[value.Date] = {
            name: value.Date,
            Clicks: 0,
            Impressions: 0
          }
        }

        if (value.Clicks.length)
        {
          result[value.Date].Clicks += Number.parseInt(value.Clicks)
        }

        if (value.Impressions.length)
        {
          result[value.Date].Impressions += Number.parseInt(value.Impressions)
        }

        return result
      }, {}), d => d)

      return chartData
    },
    [data, currentDataSources, currentCampaigns]
  )

  console.log(data)
  console.log(chartData)

  const availableDataSources = _.uniq(_.map(data, d => d.Datasource))
  const availableCampaigns = _.uniq(_.map(data, d => d.Campaign))

  let updateDataSources = values => {
    setCurrentDataSources(values)
  }

  let updateCampaigns = values => {
    setCurrentCampaigns(values)
  }

  return (
    <Container maxWidth="sm">
      <h1>Adverity Advertising Data ETL-V Challenge</h1>
      <LineChart
        width={600}
        height={400}
        data={chartData}
        margin={{
          top: 20, right: 50, left: 30, bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" label={
          <AxisLabel axisType="yAxis" x={25} y={175} width={0} height={0} rotation={270}>Clicks</AxisLabel>
        } />
        <YAxis yAxisId="right" orientation="right" label={
          <AxisLabel axisType="yAxis" x={580} y={175} width={0} height={0} rotation={90}>Impressions</AxisLabel>
        } />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" isAnimationActive={false} dataKey="Clicks" stroke="#EC6A2D" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" isAnimationActive={false} dataKey="Impressions" stroke="#404E55" strokeWidth={2} />
      </LineChart>

      <div style={{padding:'20px'}}>
        <DataSelect name="DataSource" select={currentDataSources} items={availableDataSources} onChange={values => updateDataSources(values)} />
      </div>
      <div style={{padding:'20px'}}>
        <DataSelect name="Campaign" select={currentCampaigns} items={availableCampaigns} onChange={values => updateCampaigns(values)} />
      </div>
    </Container>
  )
}
