import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class API_Slack extends Own{
  constructor(config){
    Logger.log("'googleads' app:\nCoordonnées par défaut du compte cyril.mindfruits:\nhttps://console.cloud.google.com/apis/credentials/oauthclient/318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com?folder=&organizationId=&project=iconic-strategy-262610")

    this.emailAccount = config.emailAccount || "webdev.archist@gmail.com"
    this.phoneAccount = config.phoneAccount || "00787730503"
    /*******************/
    this.clientID = config.clientID || "318651980223-u79baf4om96ohtfsgstldrnq9hq0meua.apps.googleusercontent.com"
    this.clientSecret = config.clientSecret || "I-M2gjyjmGIh4gzpWanR9Z59"
    this.scopes = config.scopes || "https://www.googleapis.com/auth/drive"
    this.authUrl = config.authUrl || "'https://accounts.google.com/o/oauth2/auth'"
    this.tokenUrl = config.tokenUrl || "'https://accounts.google.com/o/oauth2/token'"
    this.refreshToken = config.refreshToken || this.generateRefreshToken()
    /*******************/
    this.twilioSID = config.twilioSID || ""
    this.twilioAuthToken = config.twilioAuthToken || ""
    /*******************/
  }

  /*Twilio******************************************************************************************/
  /************************************************************************************************************************/
  twilio_sendSMS(){
    /**
     * An example of sending SMS messages from Google Ads Scripts using Twilio.
     * See: https://developers.google.com/google-ads/scripts/docs/features/third-party-apis#basic_authentication_samples
     * for full details on configuration.
     */

    // Supply an email address: If for some reason your Twilio account
    // details become invalid or change, this will be used to make sure
    // you are notified of failure.
    var EMAIL_ADDRESS = this.emailAccount;

    // The Twilio phone number or short code, as per the Phone Numbers Dashboard
    // https://www.twilio.com/console/phone-numbers/incoming
    var TWILIO_SRC_PHONE_NUMBER = this.phoneAccount;

    // Your Twilio Account SID, see: https://www.twilio.com/console
    var TWILIO_ACCOUNT_SID = this.twilioSID

    // Your Twilio API Auth Token, see: https://www.twilio.com/console
    var TWILIO_ACCOUNT_AUTHTOKEN = this.twilioAuthToken

    /**
     * Builds an SMS message for sending with Twilio and sends the message.
     * @param {string} dstPhoneNumber The destination number. This is a string as
     *     telephone numbers may contain '+'s or be prefixed with '00' etc.
     * @param {string} message The text message to send.
     */
    function sendTwilioSms(dstPhoneNumber, message) {
      var request =
          buildTwilioMessageRequest(dstPhoneNumber, message);
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
     * Builds a SMS request object specific for the Twilio service.
     * @param {string} recipientPhoneNumber Destination number including country
     *     code.
     * @param {string} textMessage The message to send.
     * @return {SmsRequest}
     */
    function buildTwilioMessageRequest(recipientPhoneNumber, textMessage) {
      if (!recipientPhoneNumber) {
        throw Error('No "recipientPhoneNumber" specified in call to ' +
            'buildTwilioMessageRequest. "recipientPhoneNumber" cannot be empty');
      }
      if (!textMessage) {
        throw Error('No "textMessage" specified in call to ' +
            'buildTwilioMessageRequest. "textMessage" cannot be empty');
      }
      var twilioUri = 'https://api.twilio.com/2010-04-01/Accounts/' +
          TWILIO_ACCOUNT_SID + '/Messages';
      var authHeader = 'Basic ' +
          Utilities.base64Encode(
              TWILIO_ACCOUNT_SID + ':' + TWILIO_ACCOUNT_AUTHTOKEN);
      var options = {
        muteHttpExceptions: true,
        method: 'POST',
        headers: {Authorization: authHeader},
        payload: {
          From: TWILIO_SRC_PHONE_NUMBER,
          To: recipientPhoneNumber,
          // Twilio only accepts up to 1600 characters
          Body: textMessage.substr(0, 1600)
        }
      };
      return {url: twilioUri, options: options};
    }
  }
}
