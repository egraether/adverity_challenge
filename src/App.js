import React from 'react';
import _ from 'lodash'
import { csv } from 'd3'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Chip, Container, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import './App.css';

// Utilities ------------------------------------

function toTwoDigitString(number)
{
  return number < 10 ? '0' + number : number
}

function stringToDate(string)
{
  let parts = _.split(string, '.');
  return new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]));
}

function dateToString(date)
{
  return toTwoDigitString(date.getDate()) + '.' + toTwoDigitString((date.getMonth() + 1)) + '.' + date.getFullYear()
}

function AxisLabel({ axisType, x, y, width, height, rotation, stroke, children })
{
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

// Components -----------------------------------

class FilterSelect extends React.Component
{
  render()
  {
    return (
      <FormControl style={{maxWidth: 'md'}}>
        <InputLabel id="label">{this.props.name}</InputLabel>
        <Select
          labelId="label"
          id="select"
          multiple
          style={{minWidth: '250px'}}
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

  onChange(event, child)
  {
    this.props.onChange(
      child.props.value === "All" ? [] : _.remove(event.target.value, d => { return d !== "All" })
    )
  }
}

class DoubleLineChart extends React.Component
{
  render()
  {
    return (
      <LineChart
        width={this.props.width}
        height={this.props.height}
        data={this.props.data}
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
            y={this.props.height / 2 - 25}
            width={0}
            height={0}
            rotation={270}
          >{this.props.key1}</AxisLabel>
        } />
        <YAxis yAxisId="right" orientation="right" label={
          <AxisLabel
            axisType="yAxis"
            x={this.props.width - 20}
            y={this.props.height / 2 - 25}
            width={0}
            height={0}
            rotation={90}
          >{this.props.key2}</AxisLabel>
        } />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" isAnimationActive={false} dataKey={this.props.key1} stroke="#EC6A2D" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" isAnimationActive={false} dataKey={this.props.key2} stroke="#404E55" strokeWidth={2} />
      </LineChart>
    )
  }
}

// App ------------------------------------------

// returns a map of all Dates between first and last entry in the data
// this assumes that the data is in chronological order by Date
function createDatesMap(data)
{
  let dates = {}

  if (!data.length)
  {
    return dates;
  }

  let currentDate = stringToDate(_.first(data).Date)
  let lastDateString = stringToDate(_.last(data).Date).toString()

  const addDate = (date) => {
    const dateString = dateToString(date)
    dates[dateString] = { name: dateString }
  }

  addDate(currentDate)

  while (currentDate.toString() !== lastDateString)
  {
    currentDate.setDate(currentDate.getDate() + 1)
    addDate(currentDate)
  }

  return dates
}

// returns an array of all Dates with 'Clicks' and 'Impressions' property if available for each Date
function createChartData(data, currentDataSources, currentCampaigns)
{
  let filteredData = data

  if (currentDataSources.length)
  {
    filteredData = _.filter(filteredData, d => _.includes(currentDataSources, d.Datasource))
  }

  if (currentCampaigns.length)
  {
    filteredData = _.filter(filteredData, d => _.includes(currentCampaigns, d.Campaign))
  }

  return _.map(_.reduce(
    filteredData,
    (dates, value, key) => {
      let date = dates[value.Date]

      if (value.Clicks.length)
      {
        if (!date.Clicks)
        {
          date.Clicks = 0;
        }

        date.Clicks += Number.parseInt(value.Clicks)
      }

      if (value.Impressions.length)
      {
        if (!date.Impressions)
        {
          date.Impressions = 0;
        }

        date.Impressions += Number.parseInt(value.Impressions)
      }

      return dates
    },
    createDatesMap(data)
  ), d => d)
}

function App()
{
  const [data, setData] = React.useState([])
  const [currentDataSources, setCurrentDataSources] = React.useState([])
  const [currentCampaigns, setCurrentCampaigns] = React.useState([])

  React.useEffect(
    () => {
      csv("data.csv").then(data => { setData(data) })
    },
    []
  )

  // filter data by selected Datasources and Campaigns
  const chartData = React.useMemo(
    () => {
      return createChartData(data, currentDataSources, currentCampaigns)
    },
    [data, currentDataSources, currentCampaigns]
  )

  // only show Datasources for selection that are present in the selected Campaigns
  const availableDataSources = React.useMemo(
    () => {
      return _.uniq(_.map(
        currentCampaigns.length ? _.filter(data, d => _.includes(currentCampaigns, d.Campaign)) : data,
        d => d.Datasource
      )).sort()
    },
    [data, currentCampaigns]
  )

  // only show Campaigns for selection that are present in the selected Datasources
  const availableCampaigns = React.useMemo(
    () => {
      return _.uniq(_.map(
        currentDataSources.length ? _.filter(data, d => _.includes(currentDataSources, d.Datasource)) : data,
        d => d.Campaign
      )).sort()
    },
    [data, currentDataSources]
  )

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item md={12}>
          <h1><span>Adverity</span> Advertising Data ETL-V Challenge</h1>
        </Grid>

        <Grid item md={12}>
          <DoubleLineChart data={chartData} key1="Clicks" key2="Impressions" width={960} height={400} />
        </Grid>

        <Grid item md={6}>
          <FilterSelect
            name="Datasource"
            select={currentDataSources}
            items={availableDataSources}
            onChange={values => setCurrentDataSources(values)}
          />
        </Grid>

        <Grid item md={6}>
          <FilterSelect
            name="Campaign"
            select={currentCampaigns}
            items={availableCampaigns}
            onChange={values => setCurrentCampaigns(values)}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default App;
