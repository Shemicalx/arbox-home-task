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
//Test if file path command line arguments were passed
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
                //Check that the email is unique, and abort script if it isn't
                if(customers.every( c => worksheet[cell].v !== c.email)){
                    customer.email = worksheet[cell].v;
                } else {
                    console.log(`${worksheet[cell].v} is not a unique email! All emails must be unique.`);
                    process.exit(1);
                };
            }
            if (cellAsString[0] === 'D') {
                customer.phone = worksheet[cell].v;
            }
            if (cellAsString[0] === 'E') {
                customer.joined_at = worksheet[cell].v;
                customer.club_id = argv.clubId;
                //push new customer to the customers array and reset it for the next one
                customers.push(customer);
                customer = {};
            }
        }
    }
    
    /*Insert all customers from the array.
    Alternatively, could be done in a single command like so - 
        console.log(`
            INSERT INTO ar_db (${Object.keys(customers[0])})
            VALUES ${customers.map( customer => {
                return `(${Object.values(customer)})`
            })}`
        )
    */
    for (let customerToInsert in customers) {
        console.log(`INSERT INTO ar_db (${Object.keys(customers[0])}) VALUES (${Object.values(customers[customerToInsert])})`);
    }

} else {
    console.log("Usage: ./import_users.js --file-path=<path> --club-id=<id>");
}
