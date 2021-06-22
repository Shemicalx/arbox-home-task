#!/usr/bin/env node

/*======== USAGE ========
    <script-path> --file-path=<path> --club-id=<id>
    
    e.g - 
    ./import_users.js --file-path=./assets/jimalaya.xlsx --club-id=2400
  =======================*/

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
    //Iterate over the excel sheet and create a new customers array
    //At the moment, it does not check for the name of the column, rather it is
    //hardcoded, assuming column 'A' is always 'first_name' and so on,
    //just like in the jimalaya.xlsx file I received
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
                console.log(
                    `INSERT INTO ar_db (${Object.keys(customer)}) VALUES (${Object.values(customer)})`
                );
                customer = {};
            }
        }
    }

} else {
    console.log("Usage: ./import_users.js --file-path=<path> --club-id=<id>");
}
