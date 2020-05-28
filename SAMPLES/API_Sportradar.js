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
    /*******************/
  }

  /*Sportradar******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve a list of fixtures for the English Premier League
  sportRadar(){
    /**
    * @fileoverview Example of using Sportsradar API to get English Premier League
    * soccer schedules, to use in adjusting campaigns.
    * The principles of this example could easily be reused against any of the
    * sports feeds available from Sportradar.
    *
    * Example: Get fixtures on 1st Oct 2016
    * var schedule = getSoccerSchedule(2016, 10, 1);
    *
    * See https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#working_with_api_responses
    * See http://developer.sportradar.us/
    */

    // Replace with the API Key found on your Sportradar API Application page.
    var API_KEY = 'ENTER_API_KEY';

    // Insert your email address here for notification of API request failures.
    var EMAIL_ADDRESS = 'ENTER_EMAIL_ADDRESS';

    var VERSION = 2;
    var LEAGUE = 'eu';

    // Set to false when no longer in trial mode.
    var TRIAL_MODE = true;

    /**
     * Retrieves a list of fixtures from the Soccer Schedule API.
     * @param {number} year The year for which to get matches, in the form yyyy.
     * @param {number} month The month for which to get matches, in range 1-12.
     * @param {number} day The day for which to get matches, in range 1-31.
     * @return {!Array.<!Object>} An array of object containing fixture info or
     *     null if the request was unsuccessful.
     */
    function getSoccerSchedule(year, month, day) {
      var urlTemplate =
          'https://api.sportradar.us/soccer-%s%d/%s/matches/%d/%02d/%02d/schedule.xml?api_key=%s';
      var accessLevel = TRIAL_MODE ? 't' : 'p';
      var url = Utilities.formatString(
          urlTemplate, accessLevel, VERSION, LEAGUE, year, month, day, API_KEY);
      var response = UrlFetchApp.fetch(url);
      return parseScheduleXml(response.getContentText());
    }

    /**
     * Converts the date format returned from the XML feed into a Date object.
     * @param {string} scheduleDate A date from the feed e.g. 2016-07-11T17:00:00Z
     * @return {!Date} The resulting Date object.
     */
    function parseScheduleDate(scheduleDate) {
      return new Date(
          scheduleDate.replace(/-/g, '/').replace('T', ' ').replace('Z', ' GMT'));
    }

    /**
     * Parses the schedule XML, identifying only English Premier League Soccer
     * matches, as an example of selecting events on which to make Google Ads
     * changes.
     * @param {string} xmlText XML response body from a call to the soccer schedule
     *    API.
     * @return {!Array.<!Object>} An array of object containing fixture info.
     */
    function parseScheduleXml(xmlText) {
      var fixtures = [];
      var scheduleElement = XmlService.parse(xmlText).getRootElement();
      // The namespace is required for accessing child elements in the schema.
      var namespace = scheduleElement.getNamespace();
      var matchesElement = scheduleElement.getChild('matches', namespace);

      var matchElements = matchesElement.getChildren();
      for (var i = 0, matchElement; matchElement = matchElements[i]; i++) {
        var status = matchElement.getAttribute('status').getValue();

        var scheduled = matchElement.getAttribute('scheduled').getValue();
        var scheduledDate = parseScheduleDate(scheduled);
        var categoryElement = matchElement.getChild('category', namespace);
        var country = categoryElement.getAttribute('country').getValue();
        var tournamentElement = matchElement.getChild('tournament', namespace);
        var tournamentName = tournamentElement.getAttribute('name').getValue();
        if (tournamentName === 'Premier League' && country === 'England') {
          var homeElement = matchElement.getChild('home', namespace);
          var awayElement = matchElement.getChild('away', namespace);

          var homeTeamName = homeElement.getAttribute('name').getValue();
          var awayTeamName = awayElement.getAttribute('name').getValue();

          fixtures.push({
            date: scheduledDate,
            homeTeam: homeTeamName,
            awayTeam: awayTeamName
          });
        }
      }
      return fixtures;
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
