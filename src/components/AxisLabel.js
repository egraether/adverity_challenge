import React from "react";

export const AxisLabel = ({
  axisType,
  x,
  y,
  width,
  height,
  rotation,
  stroke,
  children
}) => {
  const isVert = axisType === "yAxis";
  const cx = isVert ? x : x + width / 2;
  const cy = isVert ? height / 2 + y : y + height + 10;
  const rot = rotation ? `${rotation} ${cx} ${cy}` : 0;
  return (
    <text
      x={cx}
      y={cy}
      transform={`rotate(${rot})`}
      textAnchor="middle"
      stroke={stroke}
      fill="#404E55"
    >
      {children}
    </text>
  );
};
