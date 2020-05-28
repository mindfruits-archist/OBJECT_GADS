import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************third Party API************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class API_Slack extends Own{
  constructor(config){
    Logger.log("'googleads' app:\nCoordonnées par défaut du compte cyril.mindfruits:\nhttps://console.cloud.google.com/apis/credentials/oauthclient/318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com?folder=&organizationId=&project=iconic-strategy-262610")
    this.clientID = config.clientID || "318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com"
    this.clientSecret = config.clientSecret || "I-M2gjyjmGIh4gzpWanR9Z59"
    this.scopes = config.scopes || "https://www.googleapis.com/auth/drive"
    this.authUrl = config.authUrl || "'https://accounts.google.com/o/oauth2/auth'"
    this.tokenUrl = config.tokenUrl || "'https://accounts.google.com/o/oauth2/token'"
    this.refreshToken = config.refreshToken || this.generateRefreshToken()
    /*******************/
    this.slackID = config.slackID || ""
    this.slackUrl = config.slackUrl || ""
    /*******************/
  }

  /*Slack******************************************************************************************/
  /************************************************************************************************************************/
  //Post a message to a user or group
  slack_sendMessage(){
    console.log("slack_sendMessage: NO ARGUMENT NEEDED")
    /**
    * An example of sending messages into Slack. See:
    * https://developers.google.com/google-ads/scripts/docs/features/third-party-apis
    *
    * Webhook set up at: https://api.slack.com/custom-integrations >
    * 'Set up an incoming webhook', follow the steps then click 'Add Incoming
    * WebHooks Integration'. This will create the URL needed for below, e.g:
    * 'https://hooks.slack.com/services/TXXXXXXX/BXXXXXXX/AAAAAAAAABBBBBBBBBBCCCC';
    */
    var SLACK_URL = this.slackUrl;

    // An example of retrieving an Google Ads Report and sending it in a slack message.
    function sendReportToSlack() {
      var report = AdsApp.report(
          'SELECT CampaignName, Impressions, Clicks FROM ' +
          'CAMPAIGN_PERFORMANCE_REPORT DURING YESTERDAY');
      var spreadsheet = SpreadsheetApp.create('Report');
      report.exportToSheet(spreadsheet.getActiveSheet());

      // See https://api.slack.com/docs/message-formatting for message formatting.
      var message = 'Your *Google Ads Report* is ready! <' + spreadsheet.getUrl() +
          '|Click here>';
      sendSlackMessage(message);
    }

    /**
     * Sends a message to Slack
     * @param {string} text The message to send in slack formatting. See:
     *     https://api.slack.com/docs/message-formatting.
     * @param {string=} opt_channel An optional channel, which can be channel e.g.
     *     '#google-ads' or a direct message e.g. '@sundar'. Defaults to '#general'.
     */
    function sendSlackMessage(text, opt_channel) {
      var slackMessage = {
        text: text,
        icon_url:
            'https://www.gstatic.com/images/icons/material/product/1x/adwords_64dp.png',
        username: 'Google Ads Scripts',
        channel: opt_channel || '#general'
      };

      var options = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(slackMessage)
      };
      UrlFetchApp.fetch(SLACK_URL, options);
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
