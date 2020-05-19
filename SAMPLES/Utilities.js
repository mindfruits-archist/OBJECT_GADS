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
  createFileOnDrive(config) {
    console.log("createFileOnDrive:needed: config.filename, config.content\noptionally: config.contentType");
    if(!config.content||!config.filename)this.throwerr("config.content && config.filename")
    // Create an HTML file with the content "Hello, world!"
    var file = DriveApp.createFile(config.filename ? config.filename : "Aucun titre", config.content, config.contentType ? config.contentType : MimeType.HTML);
    return file
  }
  //Get a file from Drive
  getFileFromDrive(config) {
    var filesIterator, arr = []
    console.log("getFileFromDrive:needed: config.filename\noptionally: config.contentType");
    if(config.fileName || config.fileId)
      filesIterator = config.fileId ? DriveApp.getFileById(config.fileId) : config.fileName ? DriveApp.getFilesByName(config.fileName) : this.throwerr("config.fileId/config.fileName");
    while (filesIterator.hasNext()) {
      var file = filesIterator.next();
      arr.push(file.getAs(config.contentType ? config.contentType : MimeType.HTML).getDataAsString())
      Logger.log(file.getAs(config.contentType ? config.contentType : MimeType.HTML).getDataAsString());
    }
    return arr
  }
  //List of files on a user's Drive
  listAllFiles() {
    console.log("listAllFiles:needed: NOTHING!");
    // Log the name of every file in the user's Drive.
    var files = DriveApp.getFiles(), arr = [];
    while (files.hasNext()) {
      var file = files.next();
      arr.push(file)
      Logger.log(file.getName());
    }
    return arr
  }
  //List of files in a folder
  listAllFilesInFolder(config) {
    console.log("listAllFilesInFolder:needed: config.folderId");
    var folderId = config.folderId;
    // Log the name of every file in the folder.
    var files = DriveApp.getFolderById(folderId).getFiles(), arr = [];
    while (files.hasNext()) {
      var file = files.next();
      arr.push(file)
      Logger.log(file.getName());
    }
    return arr
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*MailApp******************************************************************************************/
  /************************************************************************************************************************/
  //Send an email
  sendEmail(config) {
    console.log("sendEmail:needed: config.to, config.subject, config.htmlBody, config.name, config.attachments, config.inlineImages{name:url}, ");
    var object = {options: {}}, inlineImages
    object.to = config.to
    object.subject = config.subject
    object.htmlBody = config.htmlBody
    if(config.attachments)object.options.attachments = this.getAttachments(config)
    if(config.name)object.name = config.name
    if(config.inlineImages)inlineImages = this.getInlineImage(config)
    MailApp.sendEmail(object);
  }
  //Send a simple email
  sendSimpleTextEmail(config) {
    console.log("sendSimpleTextEmail:needed: config.to, config.subject, config.htmlBody");
    MailApp.sendEmail(config.to,
                      config.subject,
                      config.htmlBody);
  }
  //Send email with attachments
  getAttachments(config) {
    console.log("getAttachments:needed: !config.fileId/config.fileName OR config.blob{data,contentType,name}!, !config.subject!, !config.htmlBody!, !config.contentType!, ");
    var attachments = this.getFileFromDrive(config)
    // Send an email with two attachments: a file from Google Drive (as a PDF)
    // and an HTML file.
    if(config.blob){
      var blob = Utilities.newBlob(config.blob.data, config.blob.contentType, config.blob.name);
      attachments.push(blob)
    }
    return attachments
  }
  //Send HTML email with images
  getInlineImage(config) {
    console.log("getInlineImage:needed: !config.inlineImages{name: url}!");
    if(!config.inlineImages)this.throwerr("config.inlineImages")
    var images = []
    for(a in config.inlineImages)
      images.push(UrlFetchApp
        .fetch(config.inlineImages[a])
        .getBlob()
        .setName(a)
      )
    return images
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Miscellaneous******************************************************************************************/
  /************************************************************************************************************************/
  //Download and upload a file
  sendHttpPost(config) {
    console.log("sendHttpPost:needed: !config.downloadUrl''!, !config.uploadUrl''!");
    var a, i = 0, files = [], response, fileBlob, payload = {}
    // Download a file now (GET), so we can upload it in the HTTP POST below.
    if(typeof config.downloadUrl == 'string')config.downloadUrl = [config.downloadUrl]
    for(a in config.downloadUrl){i++
      var response = UrlFetchApp.fetch(config.downloadUrl[a]);
      var fileBlob = response.getBlob();

      payload['fileAttachment_'+i] = fileBlob
    }
    // Because payload is a JavaScript object, it will be interpreted as
    // an HTML form. (We do not need to specify contentType; it will
    // automatically default to either 'application/x-www-form-urlencoded'
    // or 'multipart/form-data')

    var options = {
        'method' : 'post',
        'payload' : payload
    };

    UrlFetchApp.fetch(config.uploadUrl, options);
  }
  //Zip (a) file(s)
  zipFile(config) {
    console.log("zipFile:needed: !config.urls[]!,config.fileName");
    var a
    // Fetch the Google favicon.ico file and get the Blob data.
    for(a in config.urls)
      config.urls[a] = UrlFetchApp.fetch(config.urls[a]).getBlob()

    // zip now references a blob containing an archive of both faviconBlob and
    // logoBlob.
    var zip = Utilities.zip(config.urls, config.fileName+".zip" || 'google_images.zip');
  }
  //Unzip a file
  unzipFile(config) {
    console.log("unzipFile:needed: !config.unzip!");
    // This will now unzip the blobs.
    return Utilities.unzip(zip);

  }
  //Parse a csv file
  parseCsv(config) {
    // This will create a 2 dimensional array of the format
    // [[a, b, c], [d, e, f]]
    var csvString = config.csv
    var data = Utilities.parseCsv(csvString);
    Logger.log(data);
    return data
  }
/********/
/********/
/********/
      //Format a string
      formatString() {
        // You can use sprintf-like string formatting using '%'-style format
        // strings.

        // will be: '123.456000'
        Utilities.formatString('%11.6f', 123.456);

        // will be: '   abc'
        Utilities.formatString('%6s', 'abc');
      }
      //Get a string with the date in the account timezone
      getDateStringInTimeZone(config.format) {
        // Default to the current date and time. For a particular date, pass a
        // date string to new Date() such as
        // "February 17, 2016 13:00:00 -0500". Always include a timezone
        // specifier in the date string, or the date string may be interpreted
        // using a different timezone than you intend.
        var date = config.date || new Date();

        // Default to the account timezone. To customize, see
        // https://developers.google.com/adwords/api/docs/appendix/timezones
        // e.g. var timezone = "Europe/Berlin"
        var timeZone = config.timeZone || AdsApp.currentAccount().getTimeZone();

        // For other formats, see
        // https://developers.google.com/apps-script/reference/utilities/utilities#formatdatedate-timezone-format
        // If constructing a new date from the returned date string, be sure the
        // format includes the time zone letter 'Z', or the date string may be
        // interpreted using a different timezone than you intend.
        var format = config.format || 'MMM dd, yyyy HH:mm:ss Z';
        return Utilities.formatDate(date, timeZone, format);
      }
/********/
/********/
/********/
  //base64 encode and decode a string
  base64Encoding(config) {
    console.log("unzipFile:needed: !config.data!");
    // base64 encoding is used to encode binary data to a text format
    // you may need to do this if your transfer method can't handle spaces,
    // non-English characters, etc.

    // We'll instantiate a blob here for clarity.
    var blob = Utilities.newBlob(config.data);

    // Let's return the blob data as a byte[].
    var encoded = Utilities.base64Encode(blob.getBytes());

    // This will log 'QSBzdHJpbmcgaGVyZQ=='
    Logger.log(encoded);
    return blob
  }
  //base64 encode and decode a string
  base64Decoding(config) {
    console.log("unzipFile:needed: !config.data!");
    // base64 encoding is used to encode binary data to a text format
    // you may need to do this if your transfer method can't handle spaces,
    // non-English characters, etc.

    var decoded = Utilities.base64Decode(config.data);

    // This will log the original string.
    Logger.log(Utilities.newBlob(decoded).getDataAsString());
    return Utilities.newBlob(decoded).getDataAsString()
  }
  //Get date in the past
  getDateInThePast(config) {
    console.log("unzipFile:needed: config.numDays");
    // Number of milliseconds in a day.
    var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

    // Default to the current date and time. For a particular date, pass a
    // date string to new Date() such as
    // "February 17, 2016 13:00:00 -0500". Always include a timezone
    // specifier in the date string, or the date string may be interpreted
    // using a different timezone than you intend.
    var date = config.date || new Date();

    // Number of days in the past.
    var numDays = config.numDays || 3;

    return new Date(date.getTime() - numDays * MILLIS_PER_DAY);
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*SpreadsheetApp******************************************************************************************/
  /************************************************************************************************************************/
  //Open a spreadsheet
  openSpreadsheet(config) {
    if(config.url)
      return SpreadsheetApp.openByUrl(config.url)
    console.log("Aucun paramètre config.url, renvoie activespreadsheet");
    return SpreadsheetApp.getActiveSpreadsheet()
  }
  //Add data validation rule
  createValidationRule(config) {

    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    var cell = sheet.getRange(config.getRange);
    var rule = SpreadsheetApp.newDataValidation()
    if(config.requireNumberBetween)rule.requireNumberBetween(config.newDataValidation.from, config.newDataValidation.to)
    if(config.setAllowInvalid)rule.requireNumberBetween(config.setAllowInvalid)
    if(config.setHelpText)rule.setHelpText(config.setHelpText)

    rule.build();
    cell.setDataValidation(rule);
  }
  //Append rows to a spreadsheet
  appendARow(config) {
    console.log("appendARow:needed: !config.url!, !config.sheetName!, !config.row!");

    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    // Appends a new row with 3 columns to the bottom of the
    // spreadsheet containing the values in the array.
    sheet.appendRow(config.row);
  }
  //Add a line chart
  addNewChart(config) {
    console.log("addNewChart:needed: !config.url!, !config.sheetName!, !config.getRange!\noptionnally: config.title, config.setChartType");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    // Creates a line chart for values in range A2:B8.
    var range = sheet.getRange(config.getRange);

    var chartBuilder = sheet.newChart();
    chartBuilder.addRange(range)
       .setChartType(config.setChartType || Charts.ChartType.LINE)
       .setOption('title', config.title || 'Titre par défaut!');
    sheet.insertChart(chartBuilder.build());
  }
  //Clear spreadsheet content while preserving any formatting
  clearSheetData(config) {
    console.log("clearSheetData:needed: !config.url!, !config.sheetName!");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);
    sheet.clearContents();
  }
  //Clear spreadsheet formatting while preserving any data
  clearSheetFormatting(config) {
    console.log("clearSheetFormatting:needed: !config.url!, !config.sheetName!");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    sheet.clearFormats();
  }
  //Copy data to cell range
  copyData(config) {
    var ss = openSpreadsheet(config.url);
    console.log("copyData:needed: !config.url!, !config.sheetName!,!copyTo!\noptionnally: config.col, config.getRange");
    var sheet = ss.getSheetByName(config.sheetName);

    // The code below will copy the first 5 columns over to the 6th column.
    var rangeToCopy = config.getRange ? sheet.getRange(config.getRange)
      : config.col ? sheet.getRange(config.startRow ? config.startRow : 1, config.startCol ? config.startCol : 1, sheet.getMaxRows(), config.col)
      : sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumn())
    rangeToCopy.copyTo(sheet.getRange(copyTo));
  }
  //Copy formatting to cell range
  copyFormatting(config) {
    console.log("copyFormatting:needed: !config.url!, !config.sheetName!, !config.getRange!, !sheetNameDestination!, !dateRangeDestination{rowStart,colStart,rows,cols}!");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);
    var destinationSheet = ss.getSheetByName(config.sheetNameDestination);

    var range = sourceSheet.getRange(config.getRange);

    // This copies the formatting in B2:D4 in the source sheet to
    // D4:F6 in the destination sheet.
    range.copyFormatToRange(destinationSheet, config.dateRangeDestination.rowStart, config.dateRangeDestination.colStart, config.dateRangeDestination.rows, config.dateRangeDestination.cols);
  }
  //Get the last cell on a spreadsheet in which data is present
  getLastCellWithData(config) {
    console.log("getLastCellWithData:needed: !config.url!, !config.sheetName!");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    // Log the last cell with data in it, and its co-ordinates.
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    var lastCell = sheet.getRange(lastRow, lastColumn);
    Logger.log('Last cell is at (%s,%s) and has value "%s".', lastRow, lastColumn,
        lastCell.getValue());
    return lastCell.getValue());
  }
  //Insert image in a spreadsheet
  insertImageOnSpreadsheet(config) {
    console.log("insertImageOnSpreadsheet:needed: !config.url!, !config.sheetName!, !config.imgUrl!\noptionnally: config.rowStart,config.colStart");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    var response = UrlFetchApp.fetch(config.imgUrl);
    var binaryData = response.getContent();

    // Insert the image in cell A1.
    var blob = Utilities.newBlob(binaryData, config.contentType || 'image/png', config.name || 'MyImageName');
    sheet.insertImage(blob, config.rowStart || 1, config.colStart || 1);
  }
  //Make a copy of a spreadsheet
  copyASpreadsheet(config) {
    console.log("copyASpreadsheet:needed: !config.url!, !config.sheetName!, !config.imgUrl!\noptionnally: config.newName");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    var newSpreadsheet = ss.copy(config.newName || 'Copy of ' + ss.getName());
    Logger.log('New spreadsheet URL: %s.', newSpreadsheet.getUrl());
    return newSpreadsheet
  }
  //get all the data of a spreadsheet
  getAllValuesOnSpreadsheet(config) {
    console.log("getAllValuesOnSpreadsheet:needed: !config.url!, !config.sheetName!, !config.imgUrl!\noptionnally: config.rowStart,config.colStart");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    // This represents ALL the data.
    var range = sheet.getDataRange();
    var values = range.getValues();

    return values
  }
  //get csv representation of all the data of a spreadsheet
  getAllValuesOnSpreadsheetInCSV(config) {
    console.log("getAllValuesOnSpreadsheetInCSV:needed: !config.url!, !config.sheetName!");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    // This represents ALL the data.
    var range = sheet.getDataRange();
    var values = range.getValues();

    var csv = []
    // This logs the spreadsheet in CSV format.
    for (var i = 0; i < values.length; i++)
      csv.push(values[i].join(','))

    return csv
  }
  //Retrieve a named range from a spreadsheet
  getNamedRange(config) {
    console.log("getNamedRange:needed: !config.url!, !config.rangeName!, config.sheetName");
    var ss = openSpreadsheet(config.url);

    // Log the number of columns for the range named 'TaxRates' in the
    // spreadsheet.
    var range = ss.getRangeByName((config.sheetName+"!"||"")+config.rangeName);
    if (range) {
      Logger.log(range.getNumColumns());
    }
    return range
  }
  //Set cell formula
  setCellFormula(config) {
    console.log("setCellFormula:needed: !config.url!, !config.sheetName!, !config.getRange!, !config.formula!");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    // Sets formula for cell B5 to be sum of values in cells B3 and B4.
    var cell = sheet.getRange(config.getRange);
    cell.setFormula(config.formula);
  }
  //Set cell number format
  setNumberFormats(config) {
    console.log("setCellFormula:needed: !config.url!, !config.sheetName!, !config.getRange!\noptionnally: config.numberFormat");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    var cell = sheet.getRange(config.getRange);

    // Always show 3 decimal points.
    cell.setNumberFormat(config.numberFormat || '0.000');
  }
  //Set a range's values
  setCellValues(config) {
    console.log("setCellFormula:needed: !config.url!, !config.sheetName!, !config.getRange!, !config.value[]");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    // The size of the two-dimensional array must match the size of the range.
    var values = [
      config.values
    ];

    var range = sheet.getRange(config.getRange);
    range.setValues(values);
  }
  //Sort a range of values by multiple columns
  sortARangeOfValues(config) {
    console.log("setCellFormula:needed: !config.url!, !config.sheetName!, !config.getRange!, !config.value[], !sort[{column(int), ascending(boolean)}]!");
    if(!config.sort)this.throwerr("config.sort")
    else
      for(a in config.sort)
        if(!config.sort[a].column || !config.sort[a].ascending)
          this.throwerr("config.sort is an array containing objects of to key('column', 'ascending')")
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    var range = sheet.getRange(config.getRange);

    // Sorts descending by column B, then ascending by column A
    // Note the use of an array
    for(a in config.sort)
      range.sort(config.sort);
      //range.sort([{column: 2, ascending: false}, {column: 1, ascending: true}]);
  }
  //Sort a spreadsheet by a specified column
  sortSheet(config) {
    console.log("setCellFormula:needed: !config.url!, !config.sheetName! (Sorts the sheet by the first column, descending)");
    var ss = openSpreadsheet(config.url);
    var sheet = ss.getSheetByName(config.sheetName);

    // Sorts the sheet by the first column, descending.
    sheet.sort(1, false);
  }
/********/
/********/
/********/
      //Update data validation rules
      updateDataValidationRules(config) {
        console.log("setCellFormula:needed: !config.url!, !config.sheetName!, !config.getRange!, !config.value[], !sort[{column(int), ascending(boolean)}]!");
        var ss = openSpreadsheet(config.url);
        var sheet = ss.getSheetByName(config.sheetName);

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
/********/
/********/
/********/
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*XML******************************************************************************************/
  /************************************************************************************************************************/
  //Parse XML
  parseXml() {
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
  createXml() {
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
