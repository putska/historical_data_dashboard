// database.js
const ADODB = require("node-adodb");
const connection = ADODB.open(
  //"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\wwdatahq\\operations\\drafting\\stevew\\ServerDatax.accdb;"
  "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=c:\\users\\swatts\\Documents\\historical_data.accdb;"
);

function fetchData() {
  return connection.query(
    "SELECT CostCodePre, Job_Year, Job_Name, Location, Remaining FROM eoy_est_vs_act order by job_year"
  );
}

module.exports = { fetchData };
