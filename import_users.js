#!/usr/bin/env node
//To make command like scripts more comfortable to work with
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

//To read excel sheets
const xlsx = require('xlsx');
//Test if file path command line argument was passed
if(argv.filePath) {
    // const workbook = xlsx.readFile(argv.filePath);
    // const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log("File Path: " + argv.filePath);
}else {
    console.log("Usage: ./import_users.js --file-path=<path>");
}
