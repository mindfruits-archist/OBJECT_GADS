class Ads{
  constructor(id){
    this._alert = []
    this.id = id || "error: id account manquant an argument"
    this._alert.push("this.id: "+this.id);
    this.ok = this.script_from_Automated_Personalized_Impression_Checker()
    /*
    this.ids = {_: "accounts"}
    this.accounts = this.getClients()
    this._accounts = this.getAccountsFromAccountId()
    this._account = this._ = this.getAccountsFromAccountId()[0]
    this._campaigns = this.getCampaignsFromAccountId();
    this._adgroups = this.getAdGroupsFromCampaignsObt();
    this._ads = this.getAdsFromAdGroupsObj();
    */
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
    // Logger.log("---this.getAccountsFromAccountId say: this ads id contain %s accounts", array.length)
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
    // Logger.log("---getCampaignsFromAccountId say: this account ("+this._.Name+") id contain %s campaigns", ids.length)
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
    // Logger.log("---getAdGroupsFromCampaignObt say: this campaign object contain %s adGroups", ids.length)
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
    // Logger.log("---getAdsFromAdGroupsObj say: this adGroup object contain %s ads", ids.length)
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
      // Logger.log("---getLabelMatchFromAccountId dit: %s", "tour n°"+i)
      var label = labelIterator.next();
      bool = true
    }
    // Logger.log("---getLabelMatchFromAccountId dit: bool = %s", bool)
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
  script_from_Automated_Personalized_Impression_Checker() {
    //https://ads.google.com/aw/bulk/scripts/edit?ocid=127821475&scriptId=3686868&euid=125808475&__u=9346270275&uscid=127821475&__c=4020307275&authuser=0
    var tmp, cpt, obj, objects = [], account, accounts = {}, accountKey, campaign, campaigns = {}, campaignKey, group, groups = {}, groupKey, ad, ads = {}, adKey, object_Ad
    /*
    var _ = new SP('10xIHLxOJ8Rjjd0YATgXzUCXiN8onyEdi5Re5zZeHq7I')//Spreadsheet jumeau sur la plateforme GAS => https://docs.google.com/spreadsheets/d/10xIHLxOJ8Rjjd0YATgXzUCXiN8onyEdi5Re5zZeHq7I/edit
    var sh_ads_params = _._.ads_params
    var stats = _._.stats
    var dev = _._.dev
    */
    //Logger.log(sh_ads_params)
    //var clients = sh_ads_params.getRange(3,1,sh_ads_params.getLastRow()-2,sh_ads_params.getLastColumn()).getValues()
    var clients = [["640-144-6914"]]
    //Logger.log(clients)
    var adsAccounts = []
    for(a in clients)
      if(clients[a][0]!=""){
        /*Logger.log("\n\n---------client name: %s", clients[a][0])
        Logger.log("account id: %s----------\n\n", clients[a][1])*/
        //Logger.log(this._.length)
        campaign = this.getCampaignsFromAccountId("")
        campaigns[clients[a][1]] = {}
        campaigns[clients[a][1]].accounts = this._
        campaigns[clients[a][1]].campaigns = campaign.objects
        campaigns[clients[a][1]].groups = {}
        campaigns[clients[a][1]].ads = {}
        campaign = campaign.details
        for(aa in campaign){
          group = this.getAdGroupsFromCampaignObt(campaign[aa].object, "")
          campaigns[clients[a][1]].groups[campaign[aa].campaignId] = group.objects
          group = group.details
          for(aaa in group){
            ad = this.getAdsFromAdGroupsObj(group[aaa].object, "")
            campaigns[clients[a][1]].ads[group[aaa].adGroupId] = ad.objects
            ad = ad.details
            /*
            for(aaaa in ad){
              Logger.log("campaignName: %s, adGroup: %s, ad: %s", campaign[aa].campaignName, group[aaa].adGroupName, ad[aaaa].object.getHeadline())
            }
            */
          }
        }
        obj = {id: clients[a][1], client: clients[a][0], accounts: campaigns[clients[a][1]].accounts, campaigns: campaigns[clients[a][1]].campaigns, groups: campaigns[clients[a][1]].groups, ads: campaigns[clients[a][1]].ads}
        objects.push(obj)
      }
      else Logger.log("array client vide")
    objects = JSON.stringify(objects)
    return objects
    //dev.getRange("A2:B2").setValues([["Ads accounts object", objects]])
    //Logger.log(adsAccounts)
  }
}
