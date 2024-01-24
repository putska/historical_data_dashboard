// LineChart.js
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import axios from "axios"; // Import axios or another HTTP library
import useStore from "@/store";

function ControlChart() {
  const store = useStore();

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={store.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Job_Name" />
          <YAxis
            domain={[
              Math.round(store.lowerControlLimit * 1.15),
              Math.round(store.upperControlLimit * 1.15),
            ]}
            tickFormatter={(value) => `$${Math.round(value).toLocaleString()}`}
          />
          ;
          <Tooltip
            formatter={(value) => `$${Math.round(value).toLocaleString()}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="PositiveRemaining"
            stroke="blue"
            strokeWidth={3}
          />
          <ReferenceLine
            y={store.mean}
            stroke="purple"
            label="Mean"
            strokeWidth={3}
          />
          <ReferenceLine
            y={0}
            stroke="green"
            strokeWidth={6}
            label="Money Line"
          />
          <ReferenceLine
            y={store.upperControlLimit}
            stroke="red"
            strokeDasharray="3 3"
            label="Upper CL"
          />
          <ReferenceLine
            y={store.lowerControlLimit}
            stroke="red"
            strokeDasharray="3 3"
            label="Lower CL"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ControlChart;
