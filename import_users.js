#!/usr/bin/env node
//To make command like scripts more comfortable to work with
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

//To read excel sheets
const xlsx = require('xlsx');
//Test if file path command line argument was passed
if(argv.filePath && argv.clubId) {
    const workbook = xlsx.readFile(argv.filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    let customers = [];
    let customer = {};

    for (let cell in worksheet) {
        const cellAsString = cell.toString();
        if (cellAsString[1] !== 'r' && cellAsString[1] !== 'm' && cellAsString[1] > 1) {
            if (cellAsString[0] === 'A') {
                customer.first_name = worksheet[cell].v;
            }
            if (cellAsString[0] === 'B') {
                customer.last_name = worksheet[cell].v;
            }
            if (cellAsString[0] === 'C') {
                customer.email = worksheet[cell].v;
            }
            if (cellAsString[0] === 'D') {
                customer.phone = worksheet[cell].v;
            }
            if (cellAsString[0] === 'E') {
                customer.joined_at = worksheet[cell].v;
                customer.club_id = argv.clubId;
                customers.push(customer);
                customer = {};
            }
        }
    }

    console.log(customers);
} else {
    console.log("Usage: ./import_users.js --file-path=<path> --club-id=<id>");
}
