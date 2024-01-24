// pages/api/fetchData.js
import { fetchDataByDiv } from "../../utils/databaseByDiv"; // Import the fetchData function

export default async function handler(req, res) {
  try {
    const data = await fetchDataByDiv();
    console.log("Data by Division fetched successfully", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data by division:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
