const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function readProjectsFromCsv() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.resolve(process.env.CSV_FILE_PATH);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

module.exports = { readProjectsFromCsv };