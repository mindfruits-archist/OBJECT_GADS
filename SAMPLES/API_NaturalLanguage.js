import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class API_NaturalLanguage extends Own{
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

  /*Natural Language******************************************************************************************/
  /************************************************************************************************************************/
  //Calculate the sentiment of a piece of text
  naturalLanguage(){
    console.log("getAllAccountLabels: NO ARGUMENT NEEDED")
    /**
    * Calculates a measure of sentiment for supplied ad text.
    * See: https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#refresh_token_grant
    * for details on configuring this script.
    *
    * e.g:
    *   initializeOAuthClient();
    *   var sentiment = getAdTextSentiment('Buy our cakes today!');
    *
    * NOTE: This script also requires the OAuth2 library to be pasted at the end,
    * as obtained from https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
    */
    // Service account email, e.g. 'yyyy@yyyy-1234.iam.gserviceaccount.com'
    var SERVICE_ACCOUNT = this.emailAccount;
    // Key taken from downloaded JSON key file
    var KEY = this.keyFromJSON
    //var KEY = '-----BEGIN ..... KEY-----\n';

    var authUrlFetch;

    // Call this function just once, to initialize the OAuth client.
    function initializeOAuthClient() {
      if (typeof OAuth2 === 'undefined') {
        var libUrl = 'https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library';
        throw Error('OAuth2 library not found. Please take a copy of the OAuth2 ' +
            'library from ' + libUrl + ' and append to the bottom of this script.');
      }
      var tokenUrl = 'https://accounts.google.com/o/oauth2/token';
      var scope = 'https://www.googleapis.com/auth/cloud-platform';
      authUrlFetchApp =
          OAuth2.withServiceAccount(tokenUrl, SERVICE_ACCOUNT, KEY, scope);
    }

    /**
     * Retrieve the sentiment for a given piece of text.
     * @param {string} adText The text to analyze.
     * @return {Object} The results of the analysis.
     */
    function getAdTextSentiment(adText, config) {
      var body = {
        document:{
          type: config.type || 'PLAIN_TEXT',
          content: adText
        },
        encodingType: config.encodingType || 'UTF8'
      };

      // Natural Language API Sentiment URL
      var url =
          'https://language.googleapis.com/v1beta1/documents:analyzeSentiment';
      var options = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(body)
      };
      var response = authUrlFetchApp.fetch(url, options);
      var result = JSON.parse(response.getContentText());
      if (result.documentSentiment) {
        // return an object with 'polarity' and 'magnitude' properties.
        return result.documentSentiment;
      }
      throw Error('No sentiment response returned');
    }

    // Paste in OAuth2 library here, from:
    // https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
  }
  //Extract the entities from a piece of text
  naturalLanguageExtractEntities(){
    console.log("getAllAccountLabels: NO ARGUMENT NEEDED")
    /**
    * Extracts entities for a piece of text.
    * See: https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#refresh_token_grant
    * for details on configuring this script.
    *
    * e.g:
    *   initializeOAuthClient();
    *   var entities = getAdTextEntities('Football stadiums in London');
    *
    * NOTE: This script also requires the OAuth2 library to be pasted at the end,
    * as obtained from https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
    */
    // Service account email, e.g. 'yyyy@yyyy-1234.iam.gserviceaccount.com'
    var SERVICE_ACCOUNT = this.emailAccount;
    // Key taken from downloaded JSON key file
    var KEY = this.keyFromJSON

    var authUrlFetch;

    // Call this function just once, to initialize the OAuth client.
    function initializeOAuthClient() {
      if (typeof OAuth2 === 'undefined') {
        var libUrl = 'https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library';
        throw Error('OAuth2 library not found. Please take a copy of the OAuth2 ' +
            'library from ' + libUrl + ' and append to the bottom of this script.');
      }
      var tokenUrl = 'https://accounts.google.com/o/oauth2/token';
      var scope = 'https://www.googleapis.com/auth/cloud-platform';
      authUrlFetchApp =
          OAuth2.withServiceAccount(tokenUrl, SERVICE_ACCOUNT, KEY, scope);
    }

    /**
     * Extracts entities for a given piece of text.
     * @param {string} adText The text to analyze.
     * @return {Object} The list of extracted entities.
     */
    function getAdTextEntities(adText) {
      var body = {
        document:{
          type: config.type || 'PLAIN_TEXT',
          content: adText
        },
        encodingType: config.encodingType || 'UTF8'
      };

      // Natural Language API Sentiment URL
      var url =
          'https://language.googleapis.com/v1beta1/documents:analyzeEntities';
      var options = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(body)
      };
      var response = authUrlFetchApp.fetch(url, options);
      var result = JSON.parse(response.getContentText());
      Logger.log(result);
      if (result.entities) {
        // return a list of identified entities
        return result.entities;
      }
      throw Error('No entities response returned');
    }

    // Paste in OAuth2 library here, from:
    // https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
  }
}
