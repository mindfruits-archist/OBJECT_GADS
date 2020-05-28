import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class API_Plivo extends Own{
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

  /*Plivo******************************************************************************************/
  /************************************************************************************************************************/
  //Send a SMS message
  plivo_sendSMS(){
    console.log("getAllAccountLabels: NO ARGUMENT NEEDED")
    /**
    * An example of sending SMS messages from Google Ads Scripts using Plivo.
    * See: https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#basic_authentication_samples
    * for full details on configuration.
    */

    // Supply an email address: If for some reason your Plivo account
    // details become invalid or change, this will be used to make sure
    // you are notified of failure.
    var EMAIL_ADDRESS = this.emailAccount;

    // The number you wish messages to appear to originate from. Must be registered
    // with Plivo.
    var PLIVO_SRC_PHONE_NUMBER = this.phoneAccount;

    // Account details, see: https://manage.plivo.com/dashboard/
    var PLIVO_ACCOUNT_AUTHID = this.plivoID;
    var PLIVO_ACCOUNT_AUTHTOKEN = this.plivoAuthToken;

    /**
     * Builds an SMS message for sending with Plivo and sends the message.
     * @param {string} dstPhoneNumber The destination number. This is a string as
     *     telephone numbers may contain '+'s or be prefixed with '00' etc.
     * @param {string} message The text message to send.
     */
    function sendPlivoSms(dstPhoneNumber, message) {
      var request =
          buildPlivoMessageRequest(dstPhoneNumber, message);
      sendSms(request);
    }

    /**
     * Send an SMS message
     * @param {!SmsRequest} request The request object to send
     */
    function sendSms(request) {
      var retriableErrors = [429, 500, 503];

      for (var attempts = 0; attempts < 3; attempts++) {
        var response = UrlFetchApp.fetch(request.url, request.options);
        var responseCode = response.getResponseCode();

        if (responseCode < 400 || retriableErrors.indexOf(responseCode) === -1) {
          break;
        }
        Utilities.sleep(2000 * Math.pow(2, attempts));
      }

      if (responseCode >= 400 && EMAIL_ADDRESS) {
        MailApp.sendEmail(
            EMAIL_ADDRESS, 'Error sending SMS Message from Google Ads Scripts',
            response.getContentText());
      }
    }

    /**
     * Builds a SMS request object specific for the Plivo service.
     * @param {string} recipientPhoneNumber Destination number including country
     *     code.
     * @param {string} textMessage The message to send.
     * @return {SmsRequest}
     */
    function buildPlivoMessageRequest(recipientPhoneNumber, textMessage) {
      if (!recipientPhoneNumber) {
        throw Error('No "recipientPhoneNumber" specified in call to ' +
            'buildPlivoMessageRequest. "recipientPhoneNumber" cannot be empty');
      }
      if (!textMessage) {
        throw Error('No "textMessage" specified in call to ' +
            'buildPlivoMessageRequest. "textMessage" cannot be empty');
      }
      var plivoUri =
          'https://api.plivo.com/v1/Account/' + PLIVO_ACCOUNT_AUTHID + '/Message/';

      var authHeader = 'Basic ' +
          Utilities.base64Encode(
              PLIVO_ACCOUNT_AUTHID + ':' + PLIVO_ACCOUNT_AUTHTOKEN);
      var options = {
        muteHttpExceptions: true,
        method: 'POST',
        headers: {'Authorization': authHeader, 'Content-Type': 'application/json'},
        payload: JSON.stringify({
          src: PLIVO_SRC_PHONE_NUMBER,
          dst: recipientPhoneNumber,
          text: textMessage
        })
      };
      return {url: plivoUri, options: options};
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
