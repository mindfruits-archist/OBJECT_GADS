import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class API_GenerateOAuth2 extends Own{
  constructor(config){
    Logger.log("'googleads' app:\nCoordonnées par défaut du compte cyril.mindfruits:\nhttps://console.cloud.google.com/apis/credentials/oauthclient/318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com?folder=&organizationId=&project=iconic-strategy-262610")
    this.clientID = config.clientID || "318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com"
    this.clientSecret = config.clientSecret || "I-M2gjyjmGIh4gzpWanR9Z59"
    this.scopes = config.scopes || "https://www.googleapis.com/auth/drive"
    this.authUrl = config.authUrl || "'https://accounts.google.com/o/oauth2/auth'"
    this.tokenUrl = config.tokenUrl || "'https://accounts.google.com/o/oauth2/token'"
    this.refreshToken = config.refreshToken || this.generateRefreshToken()
    this.slackID = config.slackID || ""
    this.slackUrl = config.slackUrl || ""
  }

  /*GenerateOAuth2.0RefreshToken******************************************************************************************/
  /************************************************************************************************************************/
  //Generate an OAuth2 refresh token
  generateRefreshToken(){
    console.log("getAllAccountLabels: NO ARGUMENT NEEDED")
    /**
    * This script allows the stepping through of the Authorization Code Grant in
    * order to obtain a refresh token.
    *
    * This script uses the out-of-band redirect URI, which is not part of the
    * OAuth2 standard, to allow not redirecting the user. If this does not work
    * with your API, try instead the OAuth playground:
    * https://developers.google.com/oauthplayground/
    *
    * Execute script twice:
    * Execution 1: will result in a URL, which when placed in the browser will
    * issue a code.
    * Execution 2: place the code in "CODE" below and execute. If successful a
    * refresh token will be printed to the console.
    */
    var CLIENT_ID = this.clientID
    var CLIENT_SECRET = this.clientSecret

    // Enter required scopes, e.g. ['https://www.googleapis.com/auth/drive']
    var SCOPES = this.scopes || "https://www.googleapis.com/auth/drive"

    // Auth URL, e.g. https://accounts.google.com/o/oauth2/auth
    var AUTH_URL = this.authUrl || 'https://accounts.google.com/o/oauth2/auth';
    // Token URL, e.g. https://accounts.google.com/o/oauth2/token
    var TOKEN_URL = this.tokenUrl || 'https://accounts.google.com/o/oauth2/token';

    // After execution 1, enter the OAuth code inside the quotes below:
    var CODE = '1';

    function main() {
      if (CODE) {
        this.generateRefreshToken();
      } else {
        this.generateAuthUrl();
      }
    }

    /**
     * Creates the URL for pasting in the browser, which will generate the code
     * to be placed in the CODE variable.
     */
    function generateAuthUrl() {
      var payload = {
        scope: SCOPES.join(' '),
        // Specify that no redirection should take place
        // This is Google-specific and not part of the OAuth2 specification.
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
        response_type: 'code',
        access_type: 'offline',
        client_id: CLIENT_ID
      };
      var options = {payload: payload};
      var request = UrlFetchApp.getRequest(AUTH_URL, options);
      Logger.log(
          'Browse to the following URL: ' + AUTH_URL + '?' + request.payload);
    }

    /**
     * Generates a refresh token given the authorization code.
     */
    function generateRefreshToken() {
      var payload = {
        code: CODE,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        // Specify that no redirection should take place
        // This is Google-specific and not part of the OAuth2 specification.
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
        grant_type: 'authorization_code'
      };
      var options = {method: 'POST', payload: payload};
      var response = UrlFetchApp.fetch(TOKEN_URL, options);
      var data = JSON.parse(response.getContentText());
      if (data.refresh_token) {
        var msg = 'Success! Refresh token: ' + data.refresh_token +
          '\n\nThe following may also be a useful format for pasting into your ' +
          'script:\n\n' +
          'var CLIENT_ID = \'' + CLIENT_ID + '\';\n' +
          'var CLIENT_SECRET = \'' + CLIENT_SECRET + '\';\n' +
          'var REFRESH_TOKEN = \'' + data.refresh_token + '\';';
        Logger.log(msg);
      } else {
        Logger.log(
            'Error, failed to generate Refresh token: ' +
            response.getContentText());
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
