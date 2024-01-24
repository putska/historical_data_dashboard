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
          data={store.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 150 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Job_Name" angle={-60} textAnchor="end" />
          <YAxis
            tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
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
