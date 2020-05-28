import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
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
    this.twitterKey = config.twitterKey || ""
    this.twitterSecret = config.twitterSecret || ""
    /*******************/
  }

  /*Twitter******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve trends for a given location
  twitter_trends(){
    console.log("slack_sendMessage: NO ARGUMENT NEEDED")
    /**
    * Example of using Twitter Application-only authentication from Google Ads Scripts
    * Application-only authentication is used where the aspects of the API being
    * used do not require impersonating a given Twitter user.
    *
    * Example usage:
    *   initializeOAuthClient();
    *   // Get trends using a woeId to specify location. See:
    *   // https://developer.yahoo.com/geo/geoplanet/guide/concepts.html
    *   var results = getTrendsForLocation(44418);
    *
    * See https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#client_credentials_grant
    * for details on configuring this script.
    *
    * NOTE: This script also requires the OAuth2 library to be pasted at the end,
    * as obtained from https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
    */
    // Consumer Key for your application set up at https://apps.twitter.com. See
    // 'Keys and Access Tokens' for generating your consumer key.
    var TWITTER_CONSUMER_KEY = this.twitterKey
    var TWITTER_CONSUMER_SECRET = this.twitterSecret

    var authUrlFetch;

    // Call this function just once, to initialize the OAuth client.
    function initializeOAuthClient() {
      if (typeof OAuth2 === 'undefined') {
        var libUrl = 'https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library';
        throw Error('OAuth2 library not found. Please take a copy of the OAuth2 ' +
            'library from ' + libUrl + ' and append to the bottom of this script.');
      }
      var tokenUrl = 'https://api.twitter.com/oauth2/token';
      authUrlFetch = OAuth2.withClientCredentials(
          tokenUrl, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
    }

    /**
     * Retrieves a list of trending topics for a given geographic area of interest.
     * @param {string} woeId Geographic location specified in Yahoo! Where On Earth
     *     format. See https://developer.yahoo.com/geo/geoplanet/guide/concepts.html
     * @return {Object} The Trends results object, see:
     *     https://dev.twitter.com/rest/reference/get/trends/place for details.
     */
    function getTrendsForLocation(woeId) {
      var url = 'https://api.twitter.com/1.1/trends/place.json?id=' + woeId;
      var response = authUrlFetch.fetch(url);
      return JSON.parse(response.getContentText());
    }

    // Paste in OAuth2 library here, from:
    // https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
  }
  //Retrieve tweets for a given search query
  twitter_getTweets(){
    console.log("slack_sendMessage: NO ARGUMENT NEEDED")
    /**
    * Example of using Twitter Application-only authentication from Google Ads Scripts
    * Application-only authentication is used where the aspects of the API being
    * used do not require impersonating a given Twitter user.
    *
    * Example usage:
    *   initializeOAuthClient();
    *   var results = getTweetsForSearch('Olympics 2016');
    *   var localResults = getTweetsForSearch('Euro 2016',
    *       '51.5085300,-0.1257400,10mi');
    *
    * See https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#client_credentials_grant
    * for details on configuring this script.
    *
    * NOTE: This script also requires the OAuth2 library to be pasted at the end,
    * as obtained from https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
    */
    // Consumer Key for your application set up at https://apps.twitter.com. See
    // 'Keys and Access Tokens' for generating your consumer key.
    var TWITTER_CONSUMER_KEY = this.twitterKey;
    var TWITTER_CONSUMER_SECRET = this.twitterSecret

    var authUrlFetch;

    // Call this function just once, to initialize the OAuth client.
    function initializeOAuthClient() {
      if (typeof OAuth2 === 'undefined') {
        var libUrl = 'https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library';
        throw Error('OAuth2 library not found. Please take a copy of the OAuth2 ' +
            'library from ' + libUrl + ' and append to the bottom of this script.');
      }
      var tokenUrl = 'https://api.twitter.com/oauth2/token';
      authUrlFetch = OAuth2.withClientCredentials(
          tokenUrl, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
    }

    /**
     * Retrieves Tweets for a specific search term.
     * @param {string} searchTerm The search term to look for.
     * @param {string=} opt_geocode Limit returned Tweets to those from users in a
     *     location. Specified in the form "latitude,longitude,radius", where radius
     *     is in either "km" or "mi". e.g. 37.781157,-122.398720,1mi
     * @param {string=} opt_mode Optional preference for recent, popular or mixed
     *     results. Defaults to 'mixed', other options are 'recent' and 'popular'.
     * @return {Object} The statuses results object, see:
     *     https://dev.twitter.com/rest/reference/get/search/tweets for details.
     */
    function getTweetsForSearch(searchTerm, opt_geocode, opt_mode) {
      var mode = opt_mode || 'mixed';
      var url = 'https://api.twitter.com/1.1/search/tweets.json?q=' +
          encodeURIComponent(searchTerm) + '&result_type=' + mode;
      if (opt_geocode) {
        url += 'geocode=' + opt_geocode;
      }
      var response = authUrlFetch.fetch(url);
      return JSON.parse(response.getContentText());
    }

    // Paste in OAuth2 library here, from:
    // https://developers.google.com/google-ads/scripts/docs/examples/oauth20-library
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
