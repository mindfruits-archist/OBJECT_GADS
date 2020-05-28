import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class API_DoubleClickSearch extends Own{
  constructor(config){
    Logger.log("'googleads' app:\nCoordonnées par défaut du compte cyril.mindfruits:\nhttps://console.cloud.google.com/apis/credentials/oauthclient/318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com?folder=&organizationId=&project=iconic-strategy-262610")
    this.clientID = config.clientID || "318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com"
    this.clientSecret = config.clientSecret || "I-M2gjyjmGIh4gzpWanR9Z59"
    this.scopes = config.scopes || "https://www.googleapis.com/auth/drive"
    this.authUrl = config.authUrl || "'https://accounts.google.com/o/oauth2/auth'"
    this.tokenUrl = config.tokenUrl || "'https://accounts.google.com/o/oauth2/token'"
    this.refreshToken = config.refreshToken || this.generateRefreshToken()
    /*******************/
    /*******************/
  }

  /*DoubleClick Search******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve account's list of agency and advertiser IDs
  doubleClickSearch(config){
    /**
    * Retrieves a list of all the agency and advertiser IDs that the Google Account
    * has permission to view.
    * See: https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#refresh_token_grant
    * for details on configuring this script.
    *
    * NOTE: This script also requires the OAuth2 library to be pasted at the end,
    * as obtained from https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
    */
    var CLIENT_ID = this.clientID
    var CLIENT_SECRET = this.clientSecret
    var REFRESH_TOKEN = this.refreshToken

    var authUrlFetch;

    // Call this function just once, to initialize the OAuth client.
    function initializeOAuthClient() {
      if (typeof OAuth2 === 'undefined') {
        var libUrl = 'https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library';
        throw Error('OAuth2 library not found. Please take a copy of the OAuth2 ' +
            'library from ' + libUrl + ' and append to the bottom of this script.');
      }
      var tokenUrl = 'https://accounts.google.com/o/oauth2/token';
      var scope = 'https://www.googleapis.com/auth/doubleclicksearch';

      authUrlFetch = OAuth2.withRefreshToken(
          tokenUrl, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, scope);
    }

    // An example DS request - taken from
    // https://developers.google.com/doubleclick-search/v2/how-tos/reporting/faq
    var body = {
      reportType: 'advertiser',
      columns: [
        {columnName: 'agency'}, {columnName: 'agencyId'},
        {columnName: 'advertiser'}, {columnName: 'advertiserId'}
      ],
      statisticsCurrency: 'usd'
    };

    // Request an Advertiser report and return the resulting report object.
    function generateDoubleClickAdvertiserReport() {
      var url = 'https://www.googleapis.com/doubleclicksearch/v2/reports/generate';
      var options = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(body)
      };
      var response = authUrlFetch.fetch(url, options);

      // For now, just log the generated report response.
      return JSON.parse(response.getContentText());
    }

    // Paste in OAuth2 library here, from:
    // https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
