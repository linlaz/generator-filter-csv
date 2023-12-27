#! /usr/bin/env node
const fs = require("fs");
const path = require("path");

function printError(err) {
  console.log(`unable to filter the data: ${err}`);
  process.exit(1);
}
function generateCsv(filteredData) {
  try {
    const outputFilePath = path.join(process.cwd(), "filtered_data.csv");
    fs.writeFileSync(outputFilePath, filteredData.join("\n"));
    console.log(
      `“successfully filter the data`
    );
    process.exit(1);
  } catch (error) {
    printError(error.message);
  }
}

function processCsvDirectory(directory, startTime, endTime) {
  try {
    const filteredData = [];
    fs.readdirSync(directory).forEach((file, index) => {
      if (path.extname(file).toLowerCase() === ".csv") {
        const filePath = path.join(directory, file);
        const data = fs.readFileSync(filePath, "utf8").split("\n");
        data.forEach((line) => {
          if (line.trim() !== "") {
            const [id, timestamp, trasaction, amount] = line.split(",");
            const transactionTime = new Date(timestamp);
            if (transactionTime >= startTime && transactionTime < endTime) {
              filteredData.push(line);
            }
          }
        });
      }
    });
    generateCsv(filteredData);
  } catch (error) {
    printError(error.message);
  }
}

const args = process.argv.slice(2);
const directoryIndex = args.indexOf("-d");
const startTimeIndex = args.indexOf("-s");
const endTimeIndex = args.indexOf("-e");

if (directoryIndex === -1 || startTimeIndex === -1 || endTimeIndex === -1) {
  printError(
    "Invalid arguments. Usage: filter -d <directory> -s <start_time> -e <end_time>"
  );
}

const directory = args[directoryIndex + 1];
const startTime = new Date(args[startTimeIndex + 1]);
const endTime = new Date(args[endTimeIndex + 1]);
if (!directory || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
  printError(
    "Invalid argument values. Please provide valid values for directory, start time, and end time."
  );
}

if (endTime <= startTime) {
  printError("EndTime must be greater than or equal to startTime");
}

processCsvDirectory(directory, startTime, endTime);
