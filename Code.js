class Ads{
  constructor(id){
    this._alert = []
    this.id = id || "error: id account manquant an argument"
    this._alert.push("this.id: "+this.id);
    this.ids = {_: "accounts"}
    this.accounts = this.getClients()
    this.ids[this.id] = {_: "campaigns"}
    this._accounts = this.getAccountsFromAccountId()
    this._account = this._ = this.getAccountsFromAccountId()[0]
    this._campaigns = this.getCampaignsFromAccountId();
    this._adgroups = this.getAdGroupsFromCampaignsObt();
    this._ads = this.getAdsFromAdGroupsObj();

  }
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  getClients(){
    var accountSelector = AdsManagerApp
         .accounts()
         .orderBy("Name DESC");
    var tmp
    var accounts = {}
    var objects = []
    var ids = []

     var accountIterator = accountSelector.get();
     while (accountIterator.hasNext()) {
       tmp = accountIterator.next()
       ids.push(tmp.getCustomerId())
       objects.push(tmp)
       accounts[tmp.getCustomerId()] = tmp
       this.ids[this.id] = {_: "campaigns"}
       if(this.id == tmp.getCustomerId())this._alert.push("Ads::getClients: ("+tmp.Name+"), account.getCustomerId="+this.id+" à été entré dans le contructeur")
     }
     return {accounts,ids,objects}
  }
  getAccountsFromAccountId(){
    let id = [this.id]
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
  getCampaignsFromIds(id){
    if(typeof id == "string")id = [id]
    var arr = []
    var sel = AdsApp.campaigns().withIds(id)
    var ite = sel.get()
    while(ite.hasNext())arr.push(ite.next())
    return arr
  }
  getCampaignsFromAccountId(doReturnObject){
    var tmp
    var campaigns = {}
    var objects = []
    var ids = []
    var bool = true
    if(typeof doReturnObject !== "undefined")bool=false;

    AdsManagerApp.select(this._);
    var sel = AdsApp.campaigns()
    var ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      tmp = ite.next()
      ids.push(tmp.getId())
      objects.push(tmp)
      campaigns[tmp.getId()] = tmp
      this.ids[this.id][tmp.getId()] = {_: "adGroups"}
    }
    Logger.log("---getCampaignsFromAccountId say: this account ("+this._.Name+") id contain %s campaigns", ids.length)
    if(bool)  return {_:campaigns,ids,objects}
    else      return campaigns
  }
  getAdGroupsFromIds(id){
    if(typeof id == "string")id = [id]
    var arr = []
    var sel = AdsApp.adGroups().withIds(id)
    var ite = sel.get()
    while(ite.hasNext())arr.push(ite.next())
    return arr
  }
  getAdGroupsFromCampaignsObt(){
    var obj = {}
    for(a in this._campaigns.objects)
      obj[this._campaigns.ids[a]] = this.getAdGroupsFromCampaignObt(this._campaigns.objects[a]);
    return obj
  }
  getAdGroupsFromCampaignObt(obj, doReturnObject){
    var tmp
    var adGroups = {}
    var objects = []
    var ids = []
    var bool = true
    if(typeof doReturnObject !== "undefined")bool=false;

    var sel = obj.adGroups()
    var ite = sel.withCondition("Status = ENABLED").get();
    while(ite.hasNext()){
      tmp = ite.next();
      ids.push(tmp.getId())
      objects.push(tmp)
      adGroups[tmp.getId()] = tmp
      this.ids[this.id][obj.getId()][tmp.getId()] = {_: "ads"}
    }
    Logger.log("---getAdGroupsFromCampaignObt say: this campaign object contain %s adGroups", ids.length)
    if(bool)  return {_:adGroups,ids,objects}
    else      return adGroups
  }
  /*********************************************************************************************************************************************/
  getAdsFromAdGroupsObj(){
    var obj = {}
    for(a in this._campaigns.objects)
      for(aa in this._adgroups[this._campaigns.ids[a]].objects)
        obj[this._adgroups[this._campaigns.ids[a]].ids[aa]] = this.getAdsFromAdGroupObj(this._adgroups[this._campaigns.ids[a]].objects[aa]);
    return obj
  }
  getAdsFromAdGroupObj(obj, doReturnObject){
    var tmp, tmpbis
    var ads = {}
    var objects = []
    var ids = []
    var bool = true
    if(typeof doReturnObject !== "undefined")bool=false;

    var sel = obj.ads()
    var ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      tmp = ite.next()
      ids.push(tmp.getId())
      objects.push(tmp)
      ads[tmp.getId()] = tmp
      this.ids[this.id][obj.getCampaign().getId()][obj.getId()][tmp.getId()] = {_: "adLabels", labelSelector: tmp.labels}
    }
    Logger.log("---getAdsFromAdGroupsObj say: this adGroup object contain %s ads", ids.length)
    if(bool)  return {_:ads,ids,objects}
    else                return array
  }
  getAdsFromIds(id){
    if(typeof id == "string")id = [id]
    var arr = []
    var sel = AdsApp.ads().withIds(id)
    var ite = sel.get()
    while(ite.hasNext())arr.push(ite.next())
    return arr
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
