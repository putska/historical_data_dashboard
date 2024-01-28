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
          .filter((item) => {
            if (store.CostCodePre === "Materials") {
              // Filter for all material cost codes
              return [
                "456",
                "468",
                "470",
                "471",
                "472",
                "473",
                "474",
                "475",
                "476",
                "478",
                "481",
                "489",
                "490",
                "491",
                "492",
                "493",
                "495",
                "496",
                "497",
                "498",
                "501",
                "503",
                "504",
                "505",
                "506",
                "507",
                "508",
                "509",
                "510",
                "511",
                "512",
                "513",
                "514",
                "515",
                "516",
                "517",
                "520",
                "523",
                "526",
              ].includes(item.CostCodePre);
            } else {
              // Filter based on the selected CostCodePre
              return (
                item.CostCodePre === store.CostCodePre ||
                (store.CostCodePre === "PMD&E" &&
                  [
                    "488",
                    "494",
                    "497",
                    "544",
                    "568",
                    "569",
                    "570",
                    "584",
                  ].includes(item.CostCodePre))
              );
            }
          })
          .map((item) => {
            let Remaining = item.Remaining;

            // Check if it's cost code 568, 569, or 570 and apply the 30% increase
            if (
              store.CostCodePre === "PMD&E" &&
              ["568", "569", "570"].includes(item.CostCodePre)
            ) {
              Remaining = item.Budget - item.to_date * 1.3;
            }

            return {
              Job_Year: item.Job_Year,
              Remaining,
            };
          })
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
            const PositiveRemaining = item.Remaining >= 0 ? item.Remaining : 0;
            const NegativeRemaining = item.Remaining < 0 ? item.Remaining : 0;
            const Remaining = item.Remaining;
            return {
              Job_Year: item.Job_Year,
              PositiveRemaining,
              NegativeRemaining,
              Remaining,
            };
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
          .filter((item) => {
            if (store.CostCodePre === "Materials") {
              // Filter for all material cost codes
              return [
                "456",
                "468",
                "470",
                "471",
                "472",
                "473",
                "474",
                "475",
                "476",
                "478",
                "481",
                "489",
                "490",
                "491",
                "492",
                "493",
                "495",
                "496",
                "497",
                "498",
                "501",
                "503",
                "504",
                "505",
                "506",
                "507",
                "508",
                "509",
                "510",
                "511",
                "512",
                "513",
                "514",
                "515",
                "516",
                "517",
                "520",
                "523",
                "526",
              ].includes(item.CostCodePre);
            } else {
              // Filter based on the selected CostCodePre
              return (
                item.CostCodePre === store.CostCodePre ||
                (store.CostCodePre === "PMD&E" &&
                  [
                    "488",
                    "494",
                    "497",
                    "544",
                    "568",
                    "569",
                    "570",
                    "584",
                  ].includes(item.CostCodePre))
              );
            }
          })
          .map((item) => {
            let Remaining = item.Remaining;

            // Check if it's cost code 568, 569, or 570 and apply the 30% increase
            if (
              store.CostCodePre === "PMD&E" &&
              ["568", "569", "570"].includes(item.CostCodePre)
            ) {
              Remaining = item.Budget - item.to_date * 1.3;
            }

            return {
              Job_Year: item.Job_Year,
              Job_Name: item.Job_Name,
              Remaining,
            };
          })
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
            const PositiveRemaining = item.Remaining >= 0 ? item.Remaining : 0;
            const NegativeRemaining = item.Remaining < 0 ? item.Remaining : 0;
            const Remaining = item.Remaining;
            return {
              Job_Year: item.Job_Year,
              Job_Name: item.Job_Name,
              PositiveRemaining,
              NegativeRemaining,
              Remaining,
            };
          });

        store.setData(filteredData);
        if (
          store.chartType === "Control Chart" &&
          store.filterType === "By Job"
        ) {
          calculateControlLimits(filteredData);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
      data.reduce((sum, item) => sum + item.Remaining, 0) / data.length;

    // Calculate the standard deviation of the data
    const standardDeviation = Math.sqrt(
      data.reduce((sum, item) => sum + Math.pow(item.Remaining - mean, 2), 0) /
        data.length
    );

    // Calculate the control limits
    const upperControlLimit = mean + 3 * standardDeviation;
    const lowerControlLimit = mean - 3 * standardDeviation;

    const minValue = Math.min(
      lowerControlLimit,
      Math.min(...data.map((item) => item.Remaining))
    );
    const maxValue = Math.max(
      upperControlLimit,
      Math.max(...data.map((item) => item.Remaining))
    );

    // Set the state variables at the end
    store.setMean(mean);
    store.setStandardDeviation(standardDeviation);
    store.setUpperControlLimit(upperControlLimit);
    store.setLowerControlLimit(lowerControlLimit);
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
              {/* Add options for CostCodePre here */}
              <option value="PMD&E">PMD&E</option>
              <option value="Materials">All Materials</option>
              <option value="474">474 - Insulated Glass Units</option>
              <option value="489">489 - Angles/Kickers/Reinforcement</option>
              <option value="490">490 - Embeds</option>
              <option value="491">491 - Packaged Buy-outs</option>
              <option value="492">492 - Mock-ups</option>
              <option value="493">493 - Dies</option>
              <option value="505">505 - Stock Length Metal</option>
              <option value="507">507 - Door Hardware</option>
              <option value="508">508 - Sealants</option>
              <option value="509">509 - Gaskets</option>
              <option value="510">508 - Fasteners</option>
              <option value="511">511 - Aluminum Panels</option>
              <option value="516">516 - Equipment Rental</option>
              <option value="517">517 - Composite Panels</option>
              <option value="550">550 - Shop Labor</option>
              <option value="551">551 - Field Labor</option>
              <option value="565">565 - Subcontractors</option>
              <option value="568">568 - Takeoff</option>
              <option value="569">569 - PMs</option>
              <option value="570">570 - Drafting</option>
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
