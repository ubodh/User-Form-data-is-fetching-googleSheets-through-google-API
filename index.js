const express = require('express');

const path = require('path');
const { google } = require('googleapis');
const bodyParser=require('body-parser');
const credentialsPath = path.join(__dirname, 'credentials.json'); // Correct the path to your credentials file
const app = express();

// it it googleSheets is below
//https://docs.google.com/spreadsheets/d/1JdB6rqBibz2pfoikOtwN8gRh6CRqFuR7q9ApE-jfDSo/edit#gid=0


// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define the absolute path to your views directory
const viewsPath = path.join(__dirname, 'views');

// Set the views directory to the absolute path
app.set('views', viewsPath);

// Define a route to render the EJS template
app.get('/', (req, res) => {
    res.render('index.ejs'); // Assuming 'form.ejs' is in the 'views' directory
});

// handle form submission
app.post('/', async (req, res) => {
    // load credentials file
    const auth = new google.auth.GoogleAuth({
        keyFilename: credentialsPath, // Use keyFilename instead of keyFile
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // authenticate the client
    const client = await auth.getClient();

    // create an instance of Google Sheets
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // define the Google Sheets ID
    const spreadsheetId = '1JdB6rqBibz2pfoikOtwN8gRh6CRqFuR7q9ApE-jfDSo';

    const { name, email, phone } = req.body;
    console.log(req.body);
    const valueToAppend = [[name, email, phone]];

    // post data when data is coming from form data
    await googleSheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A:C", // Specify the sheet name and desired range
        valueInputOption: "USER_ENTERED",
        resource: {
            values: valueToAppend,
        },
    });

    return res.redirect('/');
});

app.listen(3600, () => {
    console.log("Server is running at port 3600");
});
