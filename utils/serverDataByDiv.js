// database.js
const ADODB = require("node-adodb");
const connection = ADODB.open(
  //"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\wwdatahq\\operations\\drafting\\stevew\\ServerDatax.accdb;"
  "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=c:\\users\\swatts\\Documents\\historical_data.accdb;"
);

function fetchServerDataByDiv() {
  return connection.query(
    "SELECT * FROM eoy_est_vs_act_by_div order by Job_Year"
  );
}

module.exports = { fetchServerDataByDiv };
