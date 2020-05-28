import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class GoogleAdsEntities extends Own{
  constructor(){

  }
  /*Bulk upload******************************************************************************************/
  /************************************************************************************************************************/
  //Create an account label
  function bulkUploadFromGoogleDrive(config) {
    console.log("bulkUploadFromGoogleDrive:needed: !config.getFilesByName|url(.csv)!");
    // See https://developers.google.com/google-ads/scripts/docs/features/bulk-upload
    // for the list of supported bulk upload templates.
    // You can upload a CSV file, or an EXCEL sheet.
    var file = DriveApp.getFilesByName(config.getFilesByName || config.url).next();
    var upload = AdsApp.bulkUploads().newFileUpload(file);
    upload.forCampaignManagement();

    // Use upload.apply() to make changes without previewing.
    upload.preview();
  }
  //Bulk upload from remote server
  function bulkUploadFromRemoteServer(config) {
    console.log("bulkUploadFromRemoteServer:needed: !config.fetch|url(.csv)!");
    // See https://developers.google.com/google-ads/scripts/docs/features/bulk-upload
    // for the list of supported bulk upload templates.
    var dataUrl = config.fetch || config.url;

    var blob = UrlFetchApp.fetch(dataUrl)
        .getBlob()
        .getAs(MimeType.CSV);

    var upload = AdsApp.bulkUploads().newFileUpload(blob);
    upload.forCampaignManagement();

    // Use upload.apply() to make changes without previewing.
    upload.preview();
  }
  //Bulk upload from Google Sheets
  function bulkUploadFromGoogleSpreadsheet(config) {
    console.log("bulkUploadFromGoogleSpreadsheet:needed: !config.openByUrl|url!");
    // The format of this spreadsheet should match a valid bulk upload template.
    // See https://developers.google.com/google-ads/scripts/docs/features/bulk-upload
    // for the list of supported bulk upload templates.
    var SPREADSHEET_URL = config.openByUrl || config.url;
    var spreadSheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var sheet = spreadSheet.getActiveSheet();

    var upload = AdsApp.bulkUploads().newFileUpload(sheet);
    upload.forCampaignManagement();

    // Use upload.apply() to make changes without previewing.
    upload.preview();
  }
  //Bulk upload from Google Ads reports
  function bulkUploadFromGoogleAdsReports(config) {
    console.log("bulkUploadFromGoogleAdsReports:needed: !config.query||(!config.select!, !config.from!, !config.where!, !config.rest!)!\noptionnally: config.preview(true)");
    // Run a report to fetch all campaigns that spent more than $1000
    // this month.
    var a, columnHeaders = []
    var query = this.getQuery(config)
    var report = AdsApp.report(query);

    columnHeaders = this.getColumnHeader(config)

    var upload = this.newCsvUpload(columnHeaders, {forCampaignManagement:true})

    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      // Pause the campaigns.
      for(a in config.actions){
        row[a] = config.actions[a];
        //row.CampaignStatus = 'paused';
      }

      // Convert the report row into an upload row.
      upload.append(row.formatForUpload());
    }

    // Use upload.apply() to make changes without previewing.
    if(config.preview)upload.preview();
    else upload.apply();
  }
  //Create/update campaigns
  function createOrUpdateCampaigns(config) {
    console.log("createOrUpdateCampaigns:needed: !config.append{}!\noptionnally: config.preview(true), config.moneyMicros(true)");
    // See https://developers.google.com/google-ads/scripts/docs/features/bulk-upload
    // for the list of supported bulk upload templates and their column names.
    var columns = []
    for(a in config.append)columns.push(a)
    //var columns = ['Campaign', 'Budget', 'Bid Strategy type', 'Campaign type']

    var upload = AdsApp.bulkUploads().newCsvUpload(
        columns, {moneyInMicros: config.moneyMicros || false});

    // Google Ads identify existing campaigns using its name. To create a new
    // campaign, use a campaign name that doesn't exist in your account.
    upload.append(config.append);
    /*upload.append({
      'Campaign': 'Test Campaign 1',
      'Budget': 234,
      'Bid Strategy type': 'cpc',
      'Campaign type': 'Search Only'
    });*/

    // Use upload.apply() to make changes without previewing.
    if(config.preview)upload.preview();
    else upload.apply();
  }
  //Retrieve column names in reports
  function getColumnsFromReport(config) {
    console.log("getColumnsFromReport:needed: !config.query||(!config.select!, !config.from!, !config.where!, !config.rest!)!");
    var a, columnHeaders = []
    var query = this.getQuery(config)
    var report = AdsApp.report(query);
    var columnHeaders = this.getColumnHeader(config)
    return columnHeaders
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
