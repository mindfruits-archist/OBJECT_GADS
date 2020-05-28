import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class GoogleAdsEntities extends Own{
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
    this.keyFromJSON = config.keyFromJSON || ""
    /*******************/
    this.scriptID = config.scriptID || ""
    this.plivoID = config.plivoID || ""
    this.plivoAuthToken = config.plivoAuthToken || ""
    this.slackID = config.slackID || ""
    this.slackUrl = config.slackUrl || ""
    this.twilioSID = config.twilioSID || ""
    this.twilioAuthToken = config.twilioAuthToken || ""
    /*******************/
  }

  /*Sportradar******************************************************************************************/
  /************************************************************************************************************************/
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
