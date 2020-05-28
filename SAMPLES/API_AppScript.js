import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class API_AppsScripts extends Own{
  constructor(config){
    Logger.log("API_AppsScripts Class:needed: !config.clientID''!, !config.clientSecret'!, !config.scopes'!, !config.authUrl'!, !config.tokenUrl'!");
    Logger.log("'googleads' app:\nCoordonnées par défaut du compte cyril.mindfruits:\nhttps://console.cloud.google.com/apis/credentials/oauthclient/318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com?folder=&organizationId=&project=iconic-strategy-262610")
    this.clientID = config.clientID || "318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com"
    this.clientSecret = config.clientSecret || "I-M2gjyjmGIh4gzpWanR9Z59"
    this.scopes = config.scopes || "https://www.googleapis.com/auth/drive"
    this.authUrl = config.authUrl || "'https://accounts.google.com/o/oauth2/auth'"
    this.tokenUrl = config.tokenUrl || "'https://accounts.google.com/o/oauth2/token'"
    this.refreshToken = config.refreshToken || this.generateRefreshToken()
    /*******************/
    this.scriptID = config.scriptID || ""
    /*******************/
  }

  /*Apps Scripts execution******************************************************************************************/
  /************************************************************************************************************************/
  appsScriptsExecution(config){
    console.log("getAllAccountLabels: NO ARGUMENT NEEDED")
    //Execute a function
    /**
    * Executes an Apps Script function in a remote Apps Script.
    * See: https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#refresh_token_grant
    * for details on configuring this script.
    *
    * NOTE: This script also requires the OAuth2 library to be pasted at the end,
    * as obtained from https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
    */
    var CLIENT_ID = this.clientID
    var CLIENT_SECRET = this.clientSecret
    var REFRESH_TOKEN = this.refreshToken
    // Enter scopes which should match scopes in File > Project properties
    // For this project, e.g.: https://www.googleapis.com/auth/drive
    var SCOPES = this.scopes
    // Script ID taken from 'File > Project Properties'
    var SCRIPT_ID = this.scriptID

    var authUrlFetch;

    // Call this function just once, to initialize the OAuth client.
    function initializeOAuthClient() {
      if (typeof OAuth2 === 'undefined') {
        var libUrl = 'https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library';
        throw Error('OAuth2 library not found. Please take a copy of the OAuth2 ' +
            'library from ' + libUrl + ' and append to the bottom of this script.');
      }
      var tokenUrl = 'https://accounts.google.com/o/oauth2/token';
      authUrlFetch = OAuth2.withRefreshToken(tokenUrl, CLIENT_ID, CLIENT_SECRET,
        REFRESH_TOKEN, SCOPES);
    }

    /**
     * Execute a remote function.
     * @param {string} remoteFunctionName The name of the function to execute.
     * @param {Object[]} functionParams An array of JSON objects to pass to the
     *     remote function.
     * @return {?Object} The return value from the function.
     */
    function executeRemoteFunction(remoteFunctionName, functionParams) {
      var apiParams = {
        'function': remoteFunctionName,
        'parameters': functionParams
      };
      var httpOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify(apiParams)
      };
      var url = 'https://script.googleapis.com/v1/scripts/' + SCRIPT_ID + ':run';
      var response = authUrlFetch.fetch(url, httpOptions);
      var data = JSON.parse(response.getContentText());
      // Retrieve the value that has been returned from the execution.
      if (data.error) {
        throw Error('There was an error: ' + response.getContentText());
      }
      return data.response.result;
    }
    // Paste in OAuth2 library here, from:
    // https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
