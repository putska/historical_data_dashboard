// LineChart.js
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import axios from "axios"; // Import axios or another HTTP library
import useStore from "@/store";
function LineChart() {
  const store = useStore();

  return (
    <div>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={store.dataByDiv}
          margin={{ top: 20, right: 30, left: 30, bottom: 150 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Job_Year" angle={-90} textAnchor="end" />
          <YAxis
            tickFormatter={(value) => {
              if (store.CostCodePre !== "550" && store.CostCodePre !== "551") {
                return `$${Math.round(value).toLocaleString()}`;
              } else {
                return `${Math.round(value).toLocaleString()} Hours`;
              }
            }}
          />
          <Tooltip
            formatter={(value) => `$${Math.round(value).toLocaleString()}`}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="PositiveRemaining" fill="green" stackId="stack" />
          <Bar dataKey="NegativeRemaining" fill="red" stackId="stack" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;
