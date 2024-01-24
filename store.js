import { create } from "zustand";

const useStore = create((set) => ({
  data: [],
  dataByDiv: [],
  filteredData: [],
  filteredDataByDiv: [],
  mean: 0,
  standardDeviation: 0,
  upperControlLimit: 0,
  lowerControlLimit: 0,
  minValue: 0,
  maxValue: 0,
  startYear: 2014,
  endYear: 2023,
  location: "All",
  CostCodePre: "505",
  chartType: "Bar Chart",
  filterType: "By Job",
  setMean: (mean) => set({ mean }),
  setStandardDeviation: (standardDeviation) => set({ standardDeviation }),
  setUpperControlLimit: (upperControlLimit) => set({ upperControlLimit }),
  setLowerControlLimit: (lowerControlLimit) => set({ lowerControlLimit }),
  setMinValue: (minValue) => set({ minValue }),
  setMaxValue: (maxValue) => set({ maxValue }),
  setStartYear: (startYear) => set({ startYear }),
  setEndYear: (endYear) => set({ endYear }),
  setLocation: (location) => set({ location }),
  setCostCodePre: (CostCodePre) => set({ CostCodePre }),
  setChartType: (chartType) => set({ chartType }),
  setFilterType: (filterType) => set({ filterType }),
  setData: (data) => set((state) => ({ data, filteredData: data })),
  setDataByDiv: (dataByDiv) =>
    set((state) => ({ dataByDiv, filteredDataByDiv: dataByDiv })),
  filterData: (filterType) =>
    set((state) => {
      let filteredData = state.data;
      // Apply your filtering logic here based on filterType
      return { filteredData };
    }),
  filterDataByDiv: (filterType) =>
    set((state) => {
      let filteredDataByDiv = state.dataByDiv;
      // Apply your filtering logic here based on filterType
      return { filteredDataByDiv };
    }),
}));

export default useStore;
