class Ads{
  constructor(id){
    this.id = id
    this._ = this.getAccountsFromAccountId()
  }
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  getAccountsFromAccountId(){
    let id = this.id
    var array = []
    Logger.log(id)
    var accounts = AdsManagerApp.accounts().withIds(id).get()

    while (accounts.hasNext()){
      array.push(accounts.next())
    }
    Logger.log("---this.getAccountsFromAccountId say: this ads id contain %s accounts", array.length)
    return array
  }
  /*********************************************************************************************************************************************/
  getCampaignsFromAccountId(doReturnObject){
    var tmp
    var array = []
    var array_ = []
    var bool = false
    if(typeof doReturnObject == "undefined")bool=false;else bool=true

    var accounts = this._
    AdsManagerApp.select(accounts[0]);
    var sel = AdsApp.campaigns()
    var ite = sel.get()
    while(ite.hasNext()){
      tmp = ite.next()
      array.push({campaignId:tmp.getId(), campaignName:tmp.getName(), enabled: tmp.isEnabled()})
      array_.push(tmp)
    }
    Logger.log("---getCampaignsFromAccountId say: this ads id contain %s campaigns", array.length)
    if(bool)  return {details: array, objects: array_}
    else                return array
  }
  getAdGroupsFromCampaignObt(obj, doReturnObject){
    var tmp
    var array = []
    var array_ = []
    var bool = false
    if(typeof doReturnObject == "undefined")bool=false;else bool=true

    var sel = obj.adGroups()
    var ite = sel.get();
    while(ite.hasNext()){
      tmp = ite.next();
      array.push({adGroupId:tmp.getId(), adGroupName:tmp.getName(), enabled: tmp.isEnabled()})
      array_.push(tmp)
    }
    Logger.log("---getAdGroupsFromCampaignObt say: this campaign object contain %s adGroups", array.length)
    if(bool)  return {details: array, objects: array_}
    else                return array
  }
  /*********************************************************************************************************************************************/
  getAdsFromAdGroupsObj(obj, doReturnObject){
    var tmp, tmpbis
    var array = []
    var array_ = []
    var bool = false
    if(typeof doReturnObject == "undefined")bool=false;else bool=true

    var sel = obj.ads()
    var ite = sel.get()
    while(ite.hasNext()){
      tmp = ite.next()
      array.push({adId:tmp.getId(), title:"je ne sais pas comment trouver le titre d'une ad...", description:tmp.getDescription1(), urls: [tmp.urls().getFinalUrl(), tmp.urls().getMobileFinalUrl(), tmp.urls().getFinalUrlSuffix(), tmp.urls().getTrackingTemplate()], adAdGroup:tmp.getAdGroup(), adCampaign:tmp.getCampaign(), enabled: tmp.isEnabled()})
      array_.push(tmp)
    }
    Logger.log("---getAdsFromAdGroupsObj say: this adGroup object contain %s ads", array.length)
    if(bool)  return {details: array, objects: array_}
    else                return array
  }
  getAdsFromDifferentCampaignsFromAccountId(id, nbr){

  }
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  getAllLabelsFromAccountId(){
    var accounts = this._
    AdsManagerApp.select(accounts[0]);

    var labelSelector = AdsApp.labels()

    var labelIterator = labelSelector.get();
    var array = []
    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      array.push({labelId: label.getId(), labelName: label.getName(), labelColor: label.getColor(), labelDescription: label.getDescription()})
    }
    return array
  }
  getLabelMatchFromAccountId(name){
    var accounts = this._
    AdsManagerApp.select(accounts[0]);

    var labelSelector = AdsApp.labels()
       .withCondition("Name CONTAINS '"+name+"'")
    var bool = false
    var labelIterator = labelSelector.get();
    var i = 0
    while (labelIterator.hasNext()) {
      Logger.log("---getLabelMatchFromAccountId dit: %s", "tour n°"+i)
      var label = labelIterator.next();
      bool = true
    }
    Logger.log("---getLabelMatchFromAccountId dit: bool = %s", bool)
    return bool
  }
  createLabel(name){
    var accounts = this._
    AdsManagerApp.select(accounts[0]);
    AdsApp.createLabel(name);
  }
  removeLabel(name){
    var accounts = this._
    AdsManagerApp.select(accounts[0]);

    var labelSelector = AdsApp.labels()
    .withCondition("Name CONTAINS '"+name+"'")

    var labelIterator = labelSelector.get();
    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      label.removes()
    }
  }
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  undoPausedCampaigns(listAdsId, arr, label){
    if(typeof label == "unefined")label = "erreur_auto_veille"

    for(var a in listAdsId){
      var account = this.getAccountsFromAccountId(listAdsId[a])[0]
      AdsManagerApp.select(account);
      var campaignSelector = AdsApp
       .campaigns()
       .withCondition("LabelNames CONTAINS_ANY ['"+label+"']")

      var campaignIterator = campaignSelector.get();
      while (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        campaign.enable()
      }
      this.removeLabel(listAdsId[a], label)
    }
  }
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
}
