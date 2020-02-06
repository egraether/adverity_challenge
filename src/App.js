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
    <text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke}>
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
      child.props.value === "All" ? [] : _.remove(event.target.value, d => { return d != "All" })
    )
  }
}

export default () => {
  const [data, setData] = useState([])

  useEffect(() => {
    csv(csvFile).then(data => { setData(_.take(data, 1000)) })
  }, [])

  console.log(data);

  const chartData = React.useMemo(
    () => {
      let a = 0;

      return _.map(_.take(data, 15), d => {
        return {
          name: String(a++),
          Clicks: Number.parseInt(d.Clicks),
          Impressions: Number.parseInt(d.Impressions)
        }
      })
    },
    [data]
  )

  const [dataSelect, setDataSelect] = useState([])
  const [campaignSelect, setCampaignSelect] = useState([])

  const datasources = _.uniq(_.map(data, d => d.Datasource))
  const campaigns = _.uniq(_.map(data, d => d.Campaign))

  let updateDataSource = values => {
    console.log("set", values)
    setDataSelect(values)
  }

  let updateCampaign = values => {
    setCampaignSelect(values)
  }

  return (
    <div>
      <Container maxWidth="sm">
        <LineChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 20, right: 40, left: 20, bottom: 20,
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
          <Line yAxisId="left" type="monotone" isAnimationActive={false} dataKey="Clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" isAnimationActive={false} dataKey="Impressions" stroke="#82ca9d" />
        </LineChart>

        <div style={{padding:'20px'}}>
          <DataSelect name="DataSource" select={dataSelect} items={datasources} onChange={values => updateDataSource(values)} />
          <br />
          <DataSelect name="Campaign" select={campaignSelect} items={campaigns} onChange={values => updateCampaign(values)} />
        </div>
      </Container>
    </div>
  )
}
