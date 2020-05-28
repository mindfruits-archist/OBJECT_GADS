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
  //Create a text report
  function runReport(config) {
    console.log("runReport:needed: !config.query||(!config.select!, !config.from!, !config.where!, !config.rest!)!");
    // Google Ads reports return data faster than campaign management methods
    //   and can be used to retrieve basic structural information on
    //   your Account, Campaigns, AdGroups, Ads, Keywords, etc. You can refer to
    //   https://developers.google.com/adwords/api/docs/guides/structure-reports
    //   for more details.

    // See https://developers.google.com/adwords/api/docs/appendix/reports
    //   for all the supported report types.
    // See https://developers.google.com/adwords/api/docs/guides/awql for
    //   details on how to use AWQL.
    // See https://developers.google.com/adwords/api/docs/guides/uireports
    //   for details on how to map an Google Ads UI feature to the corresponding
    //   reporting API feature.
    var query = this.getQuery(config)
    var report = AdsApp.report(query);
    /*
    var report = AdsApp.report(
        'SELECT CampaignName, Clicks, Impressions, Cost ' +
        'FROM   CAMPAIGN_PERFORMANCE_REPORT ' +
        'WHERE  Impressions < 10 ' +
        'DURING LAST_30_DAYS');
        */

    return report.rows();
  }
  //Create a spreadsheet report
  function exportReportToSpreadsheet(config) {
    console.log("exportReportToSpreadsheet:needed: !config.report{name:,}!, !config.query||(!config.select!, !config.from!, !config.where!, !config.rest!)!");
    var spreadsheet = SpreadsheetApp.create(config.report.name);
    var query = this.getQuery(config)
    var report = AdsApp.report(query);
    report.exportToSheet(spreadsheet.getActiveSheet());
  }
  //Filter entities by label
  function filterReportByLabelIds(config) {
    console.log("filterReportByLabelIds:needed: !config.condition''|[]!, !config.dateRange!, !config.query||(!config.select!, !config.from!, !config.rest!)!");
    var labelArr = [], labelIte = this.addCondition(AdsApp.labels(), config)
    while(labelIte.hasNext())
      labelArr.push(labelIte.next())
    config.where = 'Labels CONTAINS_ANY ' + '[' + labelArr.join(',') + '] during '+config.datRange;
    if(config.query)
      config.query = config.query.substring(0, config.query.toLowerCase().indexOf(('where'))) + 'WHERE '+config.where
    var query = this.getQuery(config)
    var report = AdsApp.report(query);

    return report.rows();
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
