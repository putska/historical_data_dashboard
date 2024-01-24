// pages/api/fetchData.js
import { fetchData } from "../../utils/serverData"; // Import the fetchData function

export default async function handler(req, res) {
  try {
    const data = await fetchData();
    console.log("Data fetched successfully", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
