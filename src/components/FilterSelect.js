import React from "react";
import _ from "lodash";
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@material-ui/core";

export const FilterSelect = ({ name, items, selectedItems, onChange }) => {
  return (
    <FormControl style={{ maxWidth: "md" }}>
      <InputLabel id="label">{name}</InputLabel>
      <Select
        labelId="label"
        id="select"
        multiple
        style={{ minWidth: "250px" }}
        value={selectedItems.length ? selectedItems : ["All"]}
        onChange={(event, child) => {
          onChange(
            child.props.value === "All"
              ? []
              : _.remove(event.target.value, d => {
                  return d !== "All";
                })
          );
        }}
        renderValue={selectedItems => (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {selectedItems.map(value => (
              <Chip key={value} label={value} style={{ margin: 2 }} />
            ))}
          </div>
        )}
      >
        <MenuItem value="All">All</MenuItem>
        {items.map(d => {
          return (
            <MenuItem value={d} key={d}>
              {d}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
