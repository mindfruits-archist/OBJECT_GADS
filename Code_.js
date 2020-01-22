class Ads{
  constructor(ids){
    var tmp
    if(typeof ids == "undefined")throw "Vous devez entrer un paramètre à la class Ads"
    else if(typeof ids == "string")ids = [ids]
    else if(!Array.isArray(ids))throw "Le paramètre de la class Ads doit être soit un string googleAds id, soit un array de googleAds id"

    let d = new Date()
    this.date = d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear()
    this.id = ids
    this.tmp = {}
    this.accounts = {nbr: ids.length}
    this.campaigns = {}
    this.groups = {}
    this.ads = {}
    this._accounts = {}
    this._campaigns = {}
    this._groups = {}
    this._ads = {}
    this.accounts_ = {}
    this.campaigns_ = {}
    this.groups_ = {}
    this.ads_ = {}
    for(a in ids){
      this.getAll(ids[a])
    }
  }
  /*********************************************************************************************************************************************/
  /****************************************RECURSIVES FUNCTION FOR INITIALIZING THE ADS CLASS*****************************************************************************/
  /*********************************************************************************************************************************************/
  /*********************************************************************************************************************************************/
  getAll(id){
    this.tmp.nbrCamapigns = 0
    this.tmp.nbrGroups = 0
    this.tmp.nbrAds = 0
    this.getAccount(id)
    this.campaigns[id].nbr = this.tmp.nbrCamapigns
    this.groups[id].nbr = this.tmp.nbrGroups
    this.ads[id].nbr = this.tmp.nbrAds
    Logger.log("Le client '"+this.accounts[id].name+"' a: "+this.tmp.nbrCamapigns+" campagnes actives")
    Logger.log("Le client '"+this.accounts[id].name+"' a: "+this.tmp.nbrGroups+" groupes d'annonces actives")
    Logger.log("Le client '"+this.accounts[id].name+"' a: "+this.tmp.nbrAds+" annonces ad actives")
  }
  getAccount(accountId){
    // Logger.log("getAccount this.tmp.accountId: %s", this.tmp.accountId)
    this.tmp.accountId = accountId
    var o, account
    if(typeof accountId == "undefined")throw "Vous devez entrer un numéro de compte Ads"
    else if(typeof accountId == "string")accountId = [accountId]
    var accountSelector = AdsManagerApp.accounts()
    .withIds(accountId)
    var accountIterator = accountSelector.get();
    if (accountIterator.hasNext()) {
      account = accountIterator.next();
      o = {}
      o.id = account.getCustomerId()
      o.name = account.getName()
      o.stats = {}
      o.stats[this.date] = this.getStats(account)
      o.campaigns = {}
      this._accounts[accountId] = {object: account, campaigns: {}}
      this.accounts[accountId] = o
      this.accounts_[accountId] = {id: o.id, name: o.name, stats: o.stats}
      this._campaigns[accountId] = {}
      this.campaigns[accountId] = {}
      this.campaigns_[accountId] = {}
      this._groups[accountId] = {}
      this.groups[accountId] = {}
      this.groups_[accountId] = {}
      this._ads[accountId] = {}
      this.ads[accountId] = {}
      this.ads_[accountId] = {}
      // Logger.log("account id: "+o.id)
    }else throw "L'id '"+accountId+"' ne correspond à aucun compte client."
    this.getCampaignsFromAccount(account)
    this.campaigns[accountId] = this.accounts[accountId].campaigns
  }
  getCampaignsFromAccount(account){
    // Logger.log("getCampaignsFromAccount this.tmp.accountId: %s", this.tmp.accountId)
    var arr = [], ite, sel, o, campaign, i = 0

    AdsManagerApp.select(account);
    sel = AdsApp.campaigns()
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      campaign = ite.next()
      this.tmp.campaignId = campaign.getId()
      o = {}
      o.id = campaign.getId()
      o.accountId = this.tmp.accountId
      o.name = campaign.getName()
      o.stats = {}
      o.stats[this.date] = this.getStats(campaign)
      o.groups = {}
      this._accounts[this.tmp.accountId][this.tmp.campaignId] = {object: campaign, groups: {}}
      this.accounts[this.tmp.accountId].campaigns[this.tmp.campaignId] = o
      this._campaigns[this.tmp.accountId][this.tmp.campaignId] = {object: campaign, groups: {}}
      this.campaigns[this.tmp.accountId][this.tmp.campaignId] = o
      this.campaigns_[this.tmp.accountId][this.tmp.campaignId] = {id: o.id, accountId: o.accountId, name: o.name, stats: o.stats}
      this._groups[this.tmp.campaignId] = {}
      this.groups_[this.tmp.campaignId] = {}
      this.getGroupsFromCampaign(campaign)
      i++
      // Logger.log("campaign id: "+o.id)
    }
    this.tmp.nbrCamapigns += i
  }
  getGroupsFromCampaign(campaign){
    // Logger.log("getGroupsFromCampaign this.tmp.accountId: %s", this.tmp.accountId)
    var arr = [], oo = {}, ite, sel, o, group, i = 0
    var campaignId = this.tmp.campaignId

    sel = campaign.adGroups()
    ite = sel.withCondition("Status = ENABLED").get();
    while(ite.hasNext()){
      group = ite.next();
      this.tmp.groupId = group.getId()
      o = {}
      o.id = group.getId()
      o.accountId = this.tmp.accountId
      o.campaignId = this.tmp.campaignId
      o.name = group.getName()
      o.stats = {}
      o.stats[this.date] = this.getStats(group)
      o.ads = {}
      this._accounts[this.tmp.accountId][this.tmp.campaignId][this.tmp.groupId] = {object: group, ads: {}}
      this.accounts[this.tmp.accountId].campaigns[this.tmp.campaignId].groups[this.tmp.groupId] = o
      this._campaigns[this.tmp.accountId][this.tmp.campaignId][this.tmp.groupId] = {object: group, ads: {}}
      this.campaigns[this.tmp.accountId][this.tmp.campaignId].groups[this.tmp.groupId] = o
      this._groups[this.tmp.campaignId][this.tmp.groupId] = {object: group, ads: {}}
      this.groups[this.tmp.accountId][this.tmp.groupId] = o
      this.groups_[this.tmp.accountId][this.tmp.groupId] = {id: o.id, accountId: o.accountId, campaignId: o.campaignId, name: o.name, stats: o.stats}
      this._ads[this.tmp.groupId] = {}
      this.ads_[this.tmp.groupId] = {}
      this.getAdsFromGroup(group)
      i++
      // Logger.log("group id: "+o.id)
    }
    this.tmp.nbrGroups += i
  }
  getAdsFromGroup(group){
    // Logger.log("getAdsFromGroup this.tmp.accountId: %s", this.tmp.accountId)
    var arr = [], ite, sel, o, ad, i = 0
    var campaignId = group.getCampaign().getId()
    var groupId = group.getId()

    sel = group.ads()
    ite = sel.withCondition("Status = ENABLED").get();
    while(ite.hasNext()){
      ad = ite.next();
      this.tmp.adId = ad.getId()
      o = {}
      o.id = ad.getId()
      o.accountId = this.tmp.accountId
      o.campaignId = this.tmp.campaignId
      o.groupId = this.tmp.groupId
      o.name = ad.getHeadline();
      o.stats = {}
      o.stats[this.date] = this.getStats(ad)
      o.url = ad.urls().getFinalUrl();
      o.type = ad.getType();
      // o.labels = this.getAdLabel(ad)
      arr.push(o)
      this._accounts[this.tmp.accountId][this.tmp.campaignId][this.tmp.groupId][this.tmp.adId] = {object: ad, labels: o.labels}
      this.accounts[this.tmp.accountId].campaigns[this.tmp.campaignId].groups[this.tmp.groupId].ads[this.tmp.adId] = o
      this._campaigns[this.tmp.accountId][this.tmp.campaignId][this.tmp.groupId][this.tmp.adId] = {object: ad, labels: o.labels}
      this.campaigns[this.tmp.accountId][this.tmp.campaignId].groups[this.tmp.groupId].ads[this.tmp.adId] = o
      this._groups[this.tmp.campaignId][this.tmp.groupId][this.tmp.adId] = {object: ad, labels: o.labels}
      this.groups[this.tmp.accountId][this.tmp.groupId].ads[this.tmp.adId] = o
      this._ads[this.tmp.groupId][this.tmp.adId] = {object: ad, labels: o.labels}
      this.ads[this.tmp.accountId][this.tmp.adId] = o
      this.ads_[this.tmp.accountId][this.tmp.adId] = {id: o.id, accountId: o.accountId, campaignId: o.campaignId, groupId: o.groupId, name: o.name, stats: o.stats, url: o.url, type: o.type}
      i++
      // Logger.log("ad id: "+o.id)
    }
    this.tmp.nbrAds += i
  }
  /*
  getAdLabel(ad){
    var arr = [], o, label, labelIterator, labelSelector = ad.labels()

    labelIterator = labelSelector.get();
    while (labelIterator.hasNext()) {
      o = {}
      label = labelIterator.next();
      o.id = label.getId()
      o.name = label.getName()
      o.description = label.getDescription()
      o.color = label.getColor()
      arr.push(o)
    }
    return arr
  }
  */
  /***************************************************************************************************************************************************************************/
  /*****************************************GET OBJECTS OR IDS FROM ID(S)***********************************************************************************************************/
  /***************************************************************************************************************************************************************************/
  /******************************************GET OBJECTS FROM IDS ARRAY**************************************************************************************************************/
  getAccountsFromAccountIds(accountId){
    if(typeof accountId == "undefined")throw "Vous devez entrer un array d'ids en 2nd argument"
    else if(typeof accountId == "string")accountId = [accountId]

    var arr = [], accounts = [], ite = AdsManagerApp.accounts().withIds(accountId).get()
    while(ite.hasNext())
      accounts.push(ite.next())

    return accounts
  }
  getCampaignsFromCampaignIds(accountId, arrIds){
    if(typeof accountId == "undefined" && accountId.indexOf('-') == -1)throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]
    if(typeof arrIds == "undefined")throw "Vous devez entrer un array d'ids en 2nd argument"
    else if(typeof arrIds == "string")arrIds = [arrIds]

    var sel, ite, campaign, o = {}, account = AdsManagerApp.accounts().withIds(accountId).get().next()
    AdsManagerApp.select(account);
    sel = AdsApp.campaigns().withIds(arrIds);
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      campaign = ite.next()
      o[campaign.getId()] = campaign
    }
    return o
  }
  getGroupsFromGroupIds(accountId, arrIds){
    if(typeof accountId == "undefined")throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]
    if(typeof arrIds == "undefined")throw "Vous devez entrer un array d'ids en 2nd argument"
    else if(typeof arrIds == "string")arrIds = [arrIds]

    var sel, ite, group, o = {}, account = AdsManagerApp.accounts().withIds(accountId).get().next()
    AdsManagerApp.select(account);
    sel = AdsApp.adGroups().withIds(arrIds);
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      group = ite.next()
      o[group.getId()] = group
    }
    return o
  }
  getAdsFromAdIds(accountId, arrIds){
    if(typeof accountId == "undefined")throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]
    if(typeof arrIds == "undefined")throw "Vous devez entrer un array d'ids en 2nd argument"
    else if(typeof arrIds == "string")arrIds = [arrIds]

    var sel, ite, ad, o = {}, account = AdsManagerApp.accounts().withIds(accountId).get().next()
    AdsManagerApp.select(account);
    sel = AdsApp.campaigns().withIds(arrIds);
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      ad = ite.next()
      o[ad.getId()] = ad
    }
    return o
  }
  /***************************************GET OBJECTS CHILDREN FROM ID******************************************************************************************************************/
  getCampaignsFromAccountId(accountId){
    if(typeof accountId == "undefined" && accountId.indexOf('-') == -1)throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]

    var sel, ite, campaign, o = {}, account = this.getAccountsFromAccountIds(accountId)[0]
    AdsManagerApp.select(account);
    sel = AdsApp.campaigns()
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      campaign = ite.next()
      o[campaign.getId()] = campaign
    }
    return o
  }
  getGroupsFromCampaignId(accountId, campId){
    if(typeof accountId == "undefined" && accountId.indexOf('-') == -1)throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]
    if(typeof campId == "undefined")throw "Vous devez entrer un array d'ids en 2nd argument"
    else if(typeof campId == "string")campId = [campId]

    var sel, ite, group, o = {}, account = this.getAccountsFromAccountIds(accountId)[0]
    AdsManagerApp.select(account);
    sel = AdsApp.campaigns().widthId(campId).withCondition("Status = ENABLED").get().adGroups()
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      group = ite.next()
      o[group.getId()] = group
    }
    return o
  }
  getAdsFromGroupId(accountId, groupId){
    if(typeof accountId == "undefined" && accountId.indexOf('-') == -1)throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]
    if(typeof groupId == "undefined")throw "Vous devez entrer un array d'ids en 2nd argument"
    else if(typeof groupId == "string")groupId = [groupId]

    var sel, ite, ad, o = {}, account = this.getAccountsFromAccountIds(accountId)[0]
    AdsManagerApp.select(account);
    sel = AdsApp.adGroups().widthId(groupId).withCondition("Status = ENABLED").get().ads()
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext()){
      ad = ite.next()
      o[ad.getId()] = ad
    }
    return o
  }
  /******************************************GET IDS CHILDREN FROM ID********************************************************************************************************************/
  getCampaignsIdsFromAccountId(accountId){
    if(typeof accountId == "undefined" && accountId.indexOf('-') == -1)throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]

    var sel, ite, arr = [], account = this.getAccountsFromAccountIds(accountId)[0]
    AdsManagerApp.select(account);
    sel = AdsApp.campaigns()
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext())
      arr.push(ite.next().getId())
    return arr
  }
  getGroupsIdsFromCampaignId(accountId, campId){
    if(typeof accountId == "undefined" && accountId.indexOf('-') == -1)throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]
    if(typeof arrIds == "undefined")throw "Vous devez entrer un array d'ids en 2nd argument"
    else if(typeof arrIds == "string")arrIds = [arrIds]

    var sel, ite, arr = [], account = this.getAccountsFromAccountIds(accountId)[0]
    AdsManagerApp.select(account);
    sel = AdsApp.campaigns().widthId(campId).withCondition("Status = ENABLED").get().adGroups()
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext())
      arr.push(ite.next().getId())
    return arr
  }
  getAdsIdsFromGroupId(accountId, groupId){
    if(typeof accountId == "undefined" && accountId.indexOf('-') == -1)throw "Vous devez entrer un numéro de compte Ads en 1er argument"
    else if(typeof accountId == "string")accountId = [accountId]
    if(typeof arrIds == "undefined")throw "Vous devez entrer un array d'ids en 2nd argument"
    else if(typeof arrIds == "string")arrIds = [arrIds]

    var sel, ite, arr = [], account = this.getAccountsFromAccountIds(accountId)[0]
    AdsManagerApp.select(account);
    sel = AdsApp.adGroups().widthId(groupId).withCondition("Status = ENABLED").get().ads()
    ite = sel.withCondition("Status = ENABLED").get()
    while(ite.hasNext())
      arr.push(ite.next().getId())
    return arr
  }
  /***************************************************************************************************************************************************************************/
  /***************************************************************************************************************************************************************************/
  /******************************************GET STATISTICS FUNCTIONS**********************************************************************************************************/
  /***************************************************************************************************************************************************************************/
  getStats(adObject){
    var tmp = adObject.getStatsFor("TODAY")
    o = {
      cpc: tmp.getAverageCpc(),
      cpm: tmp.getAverageCpm(),
      cpv: tmp.getAverageCpv(),
      pv: tmp.getAveragePageviews(),
      tos: tmp.getAverageTimeOnSite(),
      br: tmp.getBounceRate(),
      clicks: tmp.getClicks(),
      cr: tmp.getConversionRate(),
      conv: tmp.getConversions(),
      cost: tmp.getCost(),
      ctr: tmp.getCtr(),
      imp: tmp.getImpressions(),
      vr: tmp.getViewRate(),
      views: tmp.getViews()
    }
    if(adObject.getEntityType == "Campaign"){
      o.startDate = adObject.getEndDate()
      o.startDate = adObject.getStartDate()
    }
    return o
  }
}
