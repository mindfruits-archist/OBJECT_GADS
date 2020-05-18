import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class Utilities extends Own{
  constructor(){


  }
  /*DriveApp******************************************************************************************/
  /************************************************************************************************************************/
  //Create a new Drive file
  function createFileOnDrive() {
    // Create an HTML file with the content "Hello, world!"
    DriveApp.createFile('New HTML File', '<b>Hello, world!</b>', MimeType.HTML);
  }
  //Get a file from Drive
  function getFileFromDrive() {
    var filesIterator = DriveApp.getFilesByName('New HTML File');
    while (filesIterator.hasNext()) {
      var file = filesIterator.next();
      Logger.log(file.getAs(MimeType.HTML).getDataAsString());
    }
  }
  //List of files on a user's Drive
  function listAllFiles() {
    // Log the name of every file in the user's Drive.
    var files = DriveApp.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      Logger.log(file.getName());
    }
  }
  //List of files in a folder
  function listAllFilesInFolder() {
    var folderId = 'INSERT_FOLDER_ID_HERE';
    // Log the name of every file in the folder.
    var files = DriveApp.getFolderById(folderId).getFiles();
    while (files.hasNext()) {
      var file = files.next();
      Logger.log(file.getName());
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*MailApp******************************************************************************************/
  /************************************************************************************************************************/
  //Send a simple email
  function sendSimpleTextEmail() {
    MailApp.sendEmail('INSERT_EMAIL_HERE',
                      'TPS reports',
                      'Where are the TPS reports?');
  }
  //Send email with attachments
  function sendEmailWithAttachments() {
    var fileId = '0B41tKrRQJmxeQXlsQUVkMzNxN28';
    // Send an email with two attachments: a file from Google Drive (as a PDF)
    // and an HTML file.
    var file = DriveApp.getFileById(fileId);
    var blob = Utilities.newBlob('Insert any HTML content here', 'text/html',
                                 'my_document.html');
    MailApp.sendEmail('INSERT_EMAIL_HERE', 'Attachment example',
                      'Two files are attached.',
                      {
                          name: 'Automatic Emailer Script',
                          attachments: [file.getAs(MimeType.PDF), blob]
                      });
  }
  //Send HTML email with images
  function sendHtmlEmailWithInlineImage() {
    var googleLogoUrl =
        'http://www.google.com/intl/en_com/images/srpr/logo3w.png';
    var youtubeLogoUrl =
        'https://developers.google.com/youtube/images/YouTube_logo_standard_white.png';
    var googleLogoBlob = UrlFetchApp
          .fetch(googleLogoUrl)
          .getBlob()
          .setName('googleLogoBlob');
    var youtubeLogoBlob = UrlFetchApp
          .fetch(youtubeLogoUrl)
          .getBlob()
          .setName('youtubeLogoBlob');
    MailApp.sendEmail({
      to: 'INSERT_EMAIL_HERE',
      subject: 'Logos',
      htmlBody: "inline Google Logo<img src='cid:googleLogo'> images! <br>" +
                "inline YouTube Logo <img src='cid:youtubeLogo'>",
      inlineImages:
        {
          googleLogo: googleLogoBlob,
          youtubeLogo: youtubeLogoBlob
        }
    });
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Miscellaneous******************************************************************************************/
  /************************************************************************************************************************/
  //Download and upload a file
  function sendHttpPost() {
    // Download a file now (GET), so we can upload it in the HTTP POST below.
    var response = UrlFetchApp.fetch('https://www.google.com/favicon.ico');
    var fileBlob = response.getBlob();

    var payload = {
        'fieldOne' : 'value for field one',
        'fieldTwo' : 'value for field two',
        'fileAttachment': fileBlob
    };

    // Because payload is a JavaScript object, it will be interpreted as
    // an HTML form. (We do not need to specify contentType; it will
    // automatically default to either 'application/x-www-form-urlencoded'
    // or 'multipart/form-data')

    var options = {
        'method' : 'post',
        'payload' : payload
    };

    UrlFetchApp.fetch('http://example.com/upload_form.cgi', options);
  }
  //Zip and unzip a file
  function zipUnzip() {
    var googleFavIconUrl = 'https://www.google.com/favicon.ico';
    var googleLogoUrl = 'https://www.google.com/images/srpr/logo3w.png';

    // Fetch the Google favicon.ico file and get the Blob data.
    var faviconBlob = UrlFetchApp.fetch(googleFavIconUrl).getBlob();
    var logoBlob = UrlFetchApp.fetch(googleLogoUrl).getBlob();

    // zip now references a blob containing an archive of both faviconBlob and
    // logoBlob.
    var zip = Utilities.zip([faviconBlob, logoBlob], 'google_images.zip');

    // This will now unzip the blobs.
    var files = Utilities.unzip(zip);
  }
  //Parse a csv file
  function parseCsv() {
    // This will create a 2 dimensional array of the format
    // [[a, b, c], [d, e, f]]
    var csvString = 'a,b,c\nd,e,f';
    var data = Utilities.parseCsv(csvString);
    Logger.log(data);
  }
  //Format a string
  function formatString() {
    // You can use sprintf-like string formatting using '%'-style format
    // strings.

    // will be: '123.456000'
    Utilities.formatString('%11.6f', 123.456);

    // will be: '   abc'
    Utilities.formatString('%6s', 'abc');
  }
  //base64 encode and decode a string
  function base64Encoding() {
    // base64 encoding is used to encode binary data to a text format
    // you may need to do this if your transfer method can't handle spaces,
    // non-English characters, etc.

    // We'll instantiate a blob here for clarity.
    var blob = Utilities.newBlob('A string here');

    // Let's return the blob data as a byte[].
    var encoded = Utilities.base64Encode(blob.getBytes());

    // This will log 'QSBzdHJpbmcgaGVyZQ=='
    Logger.log(encoded);

    var decoded = Utilities.base64Decode(encoded);

    // This will log the original string.
    Logger.log(Utilities.newBlob(decoded).getDataAsString());
  }
  //Get a string with the date in the account timezone
  function getDateStringInTimeZone() {
    // Default to the current date and time. For a particular date, pass a
    // date string to new Date() such as
    // "February 17, 2016 13:00:00 -0500". Always include a timezone
    // specifier in the date string, or the date string may be interpreted
    // using a different timezone than you intend.
    var date = new Date();

    // Default to the account timezone. To customize, see
    // https://developers.google.com/adwords/api/docs/appendix/timezones
    // e.g. var timezone = "Europe/Berlin"
    var timeZone = AdsApp.currentAccount().getTimeZone();

    // For other formats, see
    // https://developers.google.com/apps-script/reference/utilities/utilities#formatdatedate-timezone-format
    // If constructing a new date from the returned date string, be sure the
    // format includes the time zone letter 'Z', or the date string may be
    // interpreted using a different timezone than you intend.
    var format = 'MMM dd, yyyy HH:mm:ss Z';
    return Utilities.formatDate(date, timeZone, format);
  }
  //Get date in the past
  function getDateInThePast() {
    // Number of milliseconds in a day.
    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

    // Default to the current date and time. For a particular date, pass a
    // date string to new Date() such as
    // "February 17, 2016 13:00:00 -0500". Always include a timezone
    // specifier in the date string, or the date string may be interpreted
    // using a different timezone than you intend.
    var date = new Date();

    // Number of days in the past.
    var numDays = 3;

    return new Date(date.getTime() - numDays * MILLIS_PER_DAY);
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*SpreadsheetApp******************************************************************************************/
  /************************************************************************************************************************/
  //Open a spreadsheet
  function openSpreadsheet() {
    // The code below opens a spreadsheet using its URL and logs the name for it.
    // Note that the spreadsheet is NOT physically opened on the client side.
    // It is opened on the server only (for modification by the script).
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    Logger.log(ss.getName());
  }
  //Add data validation rule
  function createValidationRule() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    var cell = sheet.getRange('A1');
    var rule = SpreadsheetApp.newDataValidation()
       .requireNumberBetween(1, 100)
       .setAllowInvalid(false)
       .setHelpText('Number must be between 1 and 100.')
       .build();
    cell.setDataValidation(rule);
  }
  //Append rows to a spreadsheet
  function appendARow() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Appends a new row with 3 columns to the bottom of the
    // spreadsheet containing the values in the array.
    sheet.appendRow(['a man', 'a plan', 'panama']);
  }
  //Add a line chart
  function addNewChart() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Creates a line chart for values in range A2:B8.
    var range = sheet.getRange('A2:B8');

    var chartBuilder = sheet.newChart();
    chartBuilder.addRange(range)
       .setChartType(Charts.ChartType.LINE)
       .setOption('title', 'My Line Chart!');
    sheet.insertChart(chartBuilder.build());
  }
  //Clear spreadsheet content while preserving any formatting
  function clearSheetData() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);
    sheet.clearContents();
  }
  //Clear spreadsheet formatting while preserving any data
  function clearSheetFormatting() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    sheet.clearFormats();
  }
  //Copy data to cell range
  function copyData() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // The code below will copy the first 5 columns over to the 6th column.
    var rangeToCopy = sheet.getRange(1, 1, sheet.getMaxRows(), 5);
    rangeToCopy.copyTo(sheet.getRange(1, 6));
  }
  //Copy formatting to cell range
  function copyFormatting() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    var SOURCE_SHEET_NAME = 'INSERT_SHEET_NAME_HERE';
    var DESTINATION_SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sourceSheet = ss.getSheetByName(SOURCE_SHEET_NAME);
    var destinationSheet = ss.getSheetByName(DESTINATION_SHEET_NAME);

    var range = sourceSheet.getRange('B2:D4');

    // This copies the formatting in B2:D4 in the source sheet to
    // D4:F6 in the destination sheet.
    range.copyFormatToRange(destinationSheet, 4, 6, 4, 6);
  }
  //Get the last cell on a spreadsheet in which data is present
  function getLastCellWithData() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Log the last cell with data in it, and its co-ordinates.
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    var lastCell = sheet.getRange(lastRow, lastColumn);
    Logger.log('Last cell is at (%s,%s) and has value "%s".', lastRow, lastColumn,
        lastCell.getValue());
  }
  //Insert image in a spreadsheet
  function insertImageOnSpreadsheet() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    var response = UrlFetchApp.fetch(
        'https://developers.google.com/google-ads/scripts/images/reports.png');
    var binaryData = response.getContent();

    // Insert the image in cell A1.
    var blob = Utilities.newBlob(binaryData, 'image/png', 'MyImageName');
    sheet.insertImage(blob, 1, 1);
  }
  //Make a copy of a spreadsheet
  function copyASpreadsheet() {
    // This code makes a copy of the current spreadsheet and names it
    // appropriately.
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);

    var newSpreadsheet = ss.copy('Copy of ' + ss.getName());
    Logger.log('New spreadsheet URL: %s.', newSpreadsheet.getUrl());
  }
  //Log the data of a spreadsheet
  function getAllValuesOnSpreadsheet() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // This represents ALL the data.
    var range = sheet.getDataRange();
    var values = range.getValues();

    // This logs the spreadsheet in CSV format.
    for (var i = 0; i < values.length; i++) {
      Logger.log(values[i].join(','));
    }
  }
  //Retrieve a named range from a spreadsheet
  function getNamedRange() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);

    // Log the number of columns for the range named 'TaxRates' in the
    // spreadsheet.
    var range = ss.getRangeByName('TaxRates');
    if (range) {
      Logger.log(range.getNumColumns());
    }
  }
  //Set cell formula
  function setCellFormula() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Sets formula for cell B5 to be sum of values in cells B3 and B4.
    var cell = sheet.getRange('B5');
    cell.setFormula('=SUM(B3:B4)');
  }
  //Set cell number format
  function setNumberFormats() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    var cell = sheet.getRange('B2');

    // Always show 3 decimal points.
    cell.setNumberFormat('0.000');
  }
  //Set a range's values
  function setCellValues() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // The size of the two-dimensional array must match the size of the range.
    var values = [
      ['2.000', '1,000,000', '$2.99']
    ];

    var range = sheet.getRange('B2:D2');
    range.setValues(values);
  }
  //Sort a range of values by multiple columns
  function sortARangeOfValues() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    var range = sheet.getRange('A1:C7');

    // Sorts descending by column B, then ascending by column A
    // Note the use of an array
    range.sort([{column: 2, ascending: false}, {column: 1, ascending: true}]);
  }
  //Sort a spreadsheet by a specified column
  function sortSheet() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Sorts the sheet by the first column, descending.
    sheet.sort(1, false);
  }
  //Update data validation rules
  function updateDataValidationRules() {
    var SPREADSHEET_URL = 'INSERT_SPREADSHEET_URL_HERE';
    // Name of the specific sheet in the spreadsheet.
    var SHEET_NAME = 'INSERT_SHEET_NAME_HERE';

    var ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Change existing data-validation rules that require a date in 2013 to
    // require a date in 2014.
    var oldDates = [new Date('1/1/2013'), new Date('12/31/2013')];
    var newDates = [new Date('1/1/2014'), new Date('12/31/2014')];

    var range = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
    var rules = range.getDataValidations();

    for (var i = 0; i < rules.length; i++) {
      for (var j = 0; j < rules[i].length; j++) {
        var rule = rules[i][j];

        if (rule) {
          var criteria = rule.getCriteriaType();
          var args = rule.getCriteriaValues();

          if (criteria == SpreadsheetApp.DataValidationCriteria.DATE_BETWEEN &&
              args[0].getTime() == oldDates[0].getTime() &&
              args[1].getTime() == oldDates[1].getTime()) {
            // Create a builder from the existing rule, then change the dates.
            rules[i][j] = rule.copy().withCriteria(criteria, newDates).build();
          }
        }
      }
    }
    range.setDataValidations(rules);
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*XML******************************************************************************************/
  /************************************************************************************************************************/
  //Parse XML
  function parseXml() {
    // Load an XML representation of your campaigns.
    var xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<campaigns>',
          '<campaign id="28632346">Placement Campaign 1</campaign>',
          '<campaign id="28780216">Campaign #14</campaign>',
          '<campaign id="29606506">LotsOfExclusion</campaign>',
        '</campaigns>'
    ].join('');

    var document = XmlService.parse(xml);
    var root = document.getRootElement();

    var entries = document.getRootElement().getChildren('campaign');
    for (var i = 0; i < entries.length; i++) {
      var id = entries[i].getAttribute('id').getValue();
      var name = entries[i].getText();
      Logger.log('%s) %s (%s)', (i + 1).toFixed(), name, id);
    }
  }
  //Create XML
  function createXml() {
    // Create and log an XML representation of your campaigns.
    var root = XmlService.createElement('campaigns');
    var campaignIterator = AdsApp.campaigns().get();

    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();

      var child = XmlService.createElement('campaign')
          .setAttribute('id', campaign.getId().toFixed(0))
          .setText(campaign.getName());
      root.addContent(child);
    }
    var document = XmlService.createDocument(root);
    var xml = XmlService.getPrettyFormat().format(document);
    Logger.log(xml);
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Excluded Locations******************************************************************************************/
  /************************************************************************************************************************/
