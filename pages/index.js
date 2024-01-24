import ControlChart from "./ControlChart";
import LineChart from "./LineChart";
import ControlChartByDiv from "./ControlChartByDiv";
import LineChartByDiv from "./LineChartByDiv";
import { useState, useEffect } from "react";
import useStore from "@/store";
import axios from "axios"; // Import axios

export default function Home() {
  const store = useStore();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data and store it in Zustand
  useEffect(() => {
    setIsLoading(true);

    axios
      .get(
        "https://historical-data-42810-default-rtdb.firebaseio.com/serverDataByDiv.json"
      )
      // .get(
      //   "http://wwweb/portal/desktopmodules/ww_Global/API/Misc/GetEstVActByDiv"
      // )
      .then((response) => {
        // Filter and transform the data based on the filters
        const filteredDataByDiv = response.data
          .filter(
            (item) =>
              item.Job_Year >= store.startYear && item.Job_Year <= store.endYear
          )
          .filter(
            (item) =>
              store.location === "All" || item.Location === store.location
          )
          .filter(
            (item) =>
              store.CostCodePre === "All" ||
              item.CostCodePre === store.CostCodePre
          )
          .reduce((acc, item) => {
            const existing = acc.find(
              (element) => element.Job_Year === item.Job_Year
            );
            if (existing) {
              existing.Remaining += item.Remaining;
            } else {
              acc.push(item);
            }
            return acc;
          }, [])
          .map((item) => {
            if (store.chartType === "Control Chart") {
              return {
                Job_Year: item.Job_Year,
                PositiveRemaining: item.Remaining,
              };
            } else {
              return {
                Job_Year: item.Job_Year,
                //Job_Name: item.Job_Name,
                PositiveRemaining: item.Remaining >= 0 ? item.Remaining : 0,
                NegativeRemaining: item.Remaining < 0 ? item.Remaining : 0,
              };
            }
          });

        store.setDataByDiv(filteredDataByDiv);

        if (
          (store.chartType === "Control Chart") &
          (store.filterType === "By Year")
        ) {
          calculateControlLimits(filteredDataByDiv);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    //} else {
    axios
      .get(
        "https://historical-data-42810-default-rtdb.firebaseio.com/serverData.json"
      )
      // .get("http://wwweb/portal/desktopmodules/ww_Global/API/Misc/GetEstVAct")
      .then((response) => {
        // Filter and transform the data based on the filters
        const filteredData = response.data
          .filter(
            (item) =>
              item.Job_Year >= store.startYear && item.Job_Year <= store.endYear
          )
          .filter(
            (item) =>
              store.location === "All" || item.Location === store.location
          )
          .filter(
            (item) =>
              store.CostCodePre === "All" ||
              item.CostCodePre === store.CostCodePre
          )
          .reduce((acc, item) => {
            const existing = acc.find(
              (element) => element.Job_Name === item.Job_Name
            );
            if (existing) {
              existing.Remaining += item.Remaining;
            } else {
              acc.push(item);
            }
            return acc;
          }, [])
          .map((item) => {
            if (store.chartType === "Control Chart") {
              return {
                Job_Year: item.Job_Year,
                Job_Name: item.Job_Name,
                PositiveRemaining: item.Remaining,
              };
            } else {
              return {
                Job_Year: item.Job_Year,
                Job_Name: item.Job_Name,
                PositiveRemaining: item.Remaining >= 0 ? item.Remaining : 0,
                NegativeRemaining: item.Remaining < 0 ? item.Remaining : 0,
              };
            }
          });
        store.setData(filteredData);
        if (
          (store.chartType === "Control Chart") &
          (store.filterType === "By Job")
        ) {
          calculateControlLimits(filteredData);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    //}
  }, [
    store.startYear,
    store.endYear,
    store.location,
    store.CostCodePre,
    store.chartType,
    store.filterType,
  ]);

  // Define the function outside the useEffect hook
  const calculateControlLimits = (data) => {
    // Calculate the mean of the data
    const mean =
      data.reduce((sum, item) => sum + item.PositiveRemaining, 0) / data.length;
    store.setMean(mean);
    console.log("mean: ", mean);
    // Calculate the standard deviation of the data
    const standardDeviation = Math.sqrt(
      data.reduce(
        (sum, item) => sum + Math.pow(item.PositiveRemaining - store.mean, 2),
        0
      ) / data.length
    );
    store.setStandardDeviation(standardDeviation);
    console.log("standardDeviation: ", store.standardDeviation);

    // Calculate the control limits
    const upperControlLimit = store.mean + 3 * standardDeviation;
    const lowerControlLimit = store.mean - 3 * standardDeviation;

    // Set the control limits
    store.setUpperControlLimit(upperControlLimit);
    store.setLowerControlLimit(lowerControlLimit);

    const minValue = Math.min(
      store.lowerControlLimit,
      Math.min(...store.data.map((item) => item.PositiveRemaining))
    );
    const maxValue = Math.max(
      store.upperControlLimit,
      Math.max(...store.data.map((item) => item.PositiveRemaining))
    );
    store.setMinValue(minValue);
    store.setMaxValue(maxValue);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">
        <div className="bg-blue-400 text-white p-4 rounded-lg shadow-lg">
          <h1 className="text-2xl mb-4">Chart Type</h1>
          <label className="flex items-center">
            <input
              type="radio"
              value="Control Chart"
              checked={store.chartType === "Control Chart"}
              onChange={(e) => store.setChartType(e.target.value)}
            />
            Control Chart
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="Bar Chart"
              checked={store.chartType === "Bar Chart"}
              onChange={(e) => store.setChartType(e.target.value)}
            />
            Bar Chart
          </label>
        </div>
        <div className="bg-blue-400 text-white p-4 rounded-lg shadow-lg">
          <h1 className="text-2xl mb-4">Job or Year</h1>
          <label className="flex items-center">
            <input
              type="radio"
              value="By Job"
              checked={store.filterType === "By Job"}
              onChange={(e) => store.setFilterType(e.target.value)}
            />
            By Job
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="By Year"
              checked={store.filterType === "By Year"}
              onChange={(e) => store.setFilterType(e.target.value)}
            />
            By Year
          </label>
        </div>
        <div className="bg-blue-400 text-white p-4 rounded-lg shadow-lg">
          <h1 className="text-2xl mb-4">Filters</h1>
          <label className="flex items-center mb-4">
            Start Year:
            <select
              value={store.startYear}
              onChange={(e) => store.setStartYear(Number(e.target.value))}
              className="text-black ml-2"
            >
              {/* Generate options for years */}
              {[...Array(10)].map((_, i) => (
                <option key={i} value={2014 + i}>
                  {2014 + i}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center mb-4">
            End Year:
            <select
              value={store.endYear}
              onChange={(e) => store.setEndYear(Number(e.target.value))}
              className="text-black ml-2"
            >
              {/* Generate options for years */}
              {[...Array(10)].map((_, i) => (
                <option key={i} value={2014 + i}>
                  {2014 + i}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center mb-4">
            Location:
            <select
              value={store.location}
              onChange={(e) => store.setLocation(e.target.value)}
              className="text-black ml-2"
            >
              <option value="All">All</option>
              <option value="Fremont">Fremont</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Las Vegas">Las Vegas</option>
            </select>
          </label>
          <label className="flex items-center mb-4">
            Cost Code:
            <select
              value={store.CostCodePre}
              onChange={(e) => store.setCostCodePre(e.target.value)}
              className="text-black ml-2"
            >
              <option value="All">All</option>
              {/* Add options for CostCodePre here */}
              <option value="474">474 - Insulated Glass Units</option>
              <option value="493">493 - Dies</option>
              <option value="505">505 - Stock Length Metal</option>
              <option value="511">511 - Aluminum Panels</option>
              <option value="516">516 - Equipment</option>
              <option value="550">550 - Shop Labor</option>
              <option value="551">551 - Field Labor</option>
              <option value="565">565 - Subcontractors</option>
              {/* ... */}
            </select>
          </label>
        </div>

        {store.chartType === "Control Chart" &&
          store.filterType === "By Job" && (
            <div className="col-span-full md:col-span-3">
              <ControlChart />
            </div>
          )}
        {store.chartType === "Control Chart" &&
          store.filterType === "By Year" && (
            <div className="col-span-full md:col-span-3">
              <ControlChartByDiv />
            </div>
          )}
        {store.chartType === "Bar Chart" && store.filterType === "By Job" && (
          <div className="col-span-full md:col-span-3">
            <LineChart />
          </div>
        )}
        {store.chartType === "Bar Chart" && store.filterType === "By Year" && (
          <div className="col-span-full md:col-span-3">
            <LineChartByDiv />
          </div>
        )}
      </div>
    );
  }
}
