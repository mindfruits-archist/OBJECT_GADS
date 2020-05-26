import adsInheritence from './adsInheritence'

class Own extends adsInheritence{
  constructor(){

  }

  throwerr(string){
    throw"Argument incorrect"+string?": `"+string+"`.":".";
  }
  printJSON(json){
    var str = "", i = 0
    for(a in json){
      i++
      str += i+' --- "'+a+'": "'+json[a]+'"\n'
    }
    console.log(str);
  }
  /*ownUtilities***************************************************************************************************************/
  /************************************************************************************************************************/
  getIteratorFromConfig(config){
    return config.accounts ? AdsApp.accounts() :
            config.campaigns ? AdsApp.campaigns() :
            config.adGroups ? AdsApp.adGroups() :
            config.ads ? AdsApp.ads() :
            config.keywords ? AdsApp.keywords() :
            config.labels ? AdsApp.labels() :
            config.extensions ? AdsApp.extensions() :
            config.targetting ? AdsApp.targetting() :
            /*retourn par défaut*/AdsApp.campaigns();
  }
  addCondition(theIterator, objectCondition, options){
    objectCondition = objectCondition || []
    var dateRange = objectCondition.dateRange || []
    var orderBy = objectCondition.orderBy || []
    var widthIds = objectCondition.widthIds || []
    var condition = Array.isArray(objectCondition.condition) ? objectCondition.condition : typeof objectCondition.condition == "string" ? [objectCondition.condition] : []

    if(condition)
      for(a in condition)
        theIterator.withCondition(condition[a])
    else this.throwerr("addCondition=>argument 'objectCondition' manquant")
    if(dateRange)theIterator.forDateRange(dateRange)
    if(orderBy)theIterator.orderBy(orderBy)
    if(widthIds)theIterator.widthIds(widthIds)
    if(objectCondition === true)return this.getResults(theIterator.get())
    else if(options)return this.getResults(theIterator.get(), options)
    else return theIterator.get();
  }
  getResults(theIterator, config, entityType){
    var results = [], entityResponse
    while (theIterator.hasNext()) {
      var entity = theIterator.next();
      switch(entity.getEntityType() || entityType){
        case"Account":entityResponse = this.getAccountResult(entity, config.full ? true : false);break;
        case"Campaign":case"ShoppingCampaign":entityResponse = this.getCampaignResult(entity, entity.getEntityType() == "Campaign" && !config.full ? false : true);break;
        case"AdGroup":case"ShoppingAdGroup":entityResponse = this.getAdGroupResult(entity, entity.getEntityType() == "AdGroup" && !config.full  ? false : true);break;
        case"Ad":entityResponse = this.getAdResult(entity, config.full ? true : false);break;
        case"Keyword":entityResponse = this.getKeywordResult(entity, config.full ? true : false);break;
        case"Label":entityResponse = this.getLabelResult(entity, config.full ? true : false);break;
        /*EXTENSIONS*/
        /*
        case"MobileApp":entityResponse = this.getMobileAppResult(entity);break;
        case"PhoneNumber":entityResponse = this.getPhoneNumberResult(entity);break;
        case"Price":entityResponse = this.getPriceResult(entity);break;
        case"SiteLinks":entityResponse = this.getSiteLinksResult(entity);break;
        case"Snippets":entityResponse = this.getSnippetsResult(entity);break;
        /*----------*/
        /*----------*/
        /*SHOPPING*/
        case"productAd":entityResponse = this.getProductAdResult(entity);break;
        case"productGroup":entityResponse = this.getProductGroupResult(entity);break;
        /*----------*/
        case"CampaignMobileApp":entityResponse = this.getMobileAppResult(entity);break;
        case"BudgetOrders":entityResponse = this.getBudgetOrdersResult(entity);break;
        case"BiddingStrategy":entityResponse = this.getBiddingStrategyResult(entity);break;
        case"Draft":entityResponse = this.getDraftResult(entity);break;
        case"Experiment":entityResponse = this.getExperimentResult(entity);break;
        case"UserList":entityResponse = this.getUserListResult(entity);break;
        case"Media":entityResponse = this.getMediaResult(entity);break;
        default:
        /*Les objects qui ne possèdent pas de method "getEntityType()"*/
        /*----------*/
          /*AUDIENCE object*/if(entity.getAudienceId)entityResponse = this.getAudiencesResult()
          /*----------*/
        break;
      }

      if(config){
        if(config.negativeKeywords){
          entityResponse.negativeKeywords = {}
          var ite = entity.negativeKeywords().get();
          while (ite.hasNext()) {
            var r = this.getNegativeKeywordsResult(ite.next());
            if(config.negativeKeywords.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.negativeKeywords.dateRange || config.dateRange))})
            entityResponse["negativeKeywords"].push(r)
          }
        }
        if(config.mobileApps){
          var ite = this.addCondition(entity.extensions().mobileApps().get(), config.mobileApps.condition || "")
          entityResponse["mobileApp"] = []
          while(ite.hasNext()){
            var r = this.getMobileAppResult(ite.next())
            if(config.mobileApps.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.mobileApps.dateRange || config.dateRange))})
            entityResponse["mobileApp"].push(r)
          }
        }
        if(config.phoneNumbers){
          var ite = this.addCondition(entity.phoneNumbers().get(), config.mobileApps.condition || "")
          entityResponse["phoneNumber"] = []
          while(ite.hasNext()){
            var r = this.getPhoneNumberResult(ite.next())
            if(config.phoneNumbers.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.phoneNumbers.dateRange || config.dateRange))})
            entityResponse["phoneNumber"].push(r)
          }
        }
        if(config.prices){
          var ite = this.addCondition(entity.extensions().prices().get(), config.prices.condition || "")
          entityResponse["prices"] = []
          while(ite.hasNext()){
            var r = this.getPhoneNumberResult(ite.next())
            if(config.prices.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.prices.dateRange || config.dateRange))})
            entityResponse["prices"].push(r)
          }
        }
        if(config.sitelinks){
          var ite = this.addCondition(entity.extensions().sitelinks().get(), config.sitelinks.condition || "")
          entityResponse["sitelinks"] = []
          while(ite.hasNext()){
            var r = this.getSiteLinksResult(ite.next())
            if(config.sitelinks.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.sitelinks.dateRange || config.dateRange))})
            entityResponse["sitelinks"].push(r)
          }
        }
        if(config.snippets){
          var ite = this.addCondition(entity.extensions().snippets().get(), config.snippets.condition || "")
          entityResponse["snippets"] = []
          while(ite.hasNext()){
            var r = this.getSnippetsResult(ite.next())
            if(config.snippets.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.snippets.dateRange || config.dateRange))})
            entityResponse["snippets"].push(r)
          }
        }
        if(config.proximities){
          if(config.proximities.addProximity)
            theIterator.addProximity({latitude: config.proximities.data.lat, longitude: config.proximities.data.lon, radius: config.proximities.data.radius, radiusUnits: config.proximities.data.radiusUnits, bidModifier: config.proximities.data.bidModifier});
          else{
            var ite = this.addCondition(entity.targetting().targetedProximities().get(), config.proximities.condition || "")
            entityResponse["proximities"] = []
            while(ite.hasNext()){
              var r = this.getProximitiesResult(ite.next())
              if(config.proximities.stats)
                r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
              entityResponse["proximities"].push(r)
            }
          }
        }
        if(config.platforms){
          if(config.platforms.targets == "desktop")var ite = this.addCondition(entity.platforms().desktop().get(), config.platforms.condition || "")
          else if(config.platforms.targets == "tablet")var ite = this.addCondition(entity.platforms().tablet().get(), config.platforms.condition || "")
          else if(config.platforms.targets == "mobile")var ite = this.addCondition(entity.platforms().mobile().get(), config.platforms.condition || "")
          else var ite = this.addCondition(entity.platforms().get(), config.platforms.condition || "")
          entityResponse[config.platforms.targets] = []
          while(ite.hasNext()){
            var r = this.getPlatformsResult(ite.next())
            if(config.platforms.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            if(config.platforms.bidModifier)
              r.entity.addProximity(config.proximities.data.lat, config.proximities.data.lon, config.proximities.data.radius, config.proximities.data.radiusUnits, config.proximities.data.bidModifier);
            entityResponse[config.platforms.targets].push(r)
          }
        }
        if(config.locations){
          var ite = this.addCondition(entity.targetting().targetedLocations().get(), config.locations.condition || "")
          entityResponse[config.locations] = []
          while(ite.hasNext()){
            var r = this.getLocationsResult(ite.next())
            if(config.locations.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[config.locations].push(r)
          }
        }
        if(config.excludedLocations){
          var ite = this.addCondition(entity.targetting().excludedLocations().get(), config.excludeLocation.condition || "")
          entityResponse[config.excludedLocations] = []
          while(ite.hasNext()){
            var r = this.getExcludedLocationsResult(ite.next())
            if(config.excludedLocations.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[config.excludedLocations].push(r)
          }
        }
        if(config.adSchedules){
          if(config.adSchedules.add)
            entity.adSchedules(config.adSchedules.add.geoCode)
          var ite = this.addCondition(entity.targetting().adSchedules().get(), config.adSchedules.condition || "")
          entityResponse[config.adSchedules] = []
          while(ite.hasNext()){
            var r = this.getAdSchedulesResult(ite.next())
            if(config.adSchedules.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[config.adSchedules].push(r)
          }
        }
        if(config.searchAdGroupAudience || config.searchCampaignAudience){
          var audienceType = config.searchAdGroupAudience ? "searchAdGroupAudience" : "searchCampaignAudience"
          if(config[audienceType].add){
            //entity.adSchedules(config.excludeLocation.add.geoCode)
          }
          var ite = this.addCondition(entity.targetting().audiences(), config.locations.condition || "")
          entityResponse[config[audienceType]] = []
          while(ite.hasNext()){
            var r = this.getAudiencesResult(ite.next())
            if(config[audienceType].stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[config[audienceType]].push(r)
          }
        }
        if(config.searchAdGroupExcludedAudience || config.searchCampaignExcludedAudience){
          var audienceType = config.searchAdGroupExcludedAudience ? "searchAdGroupExcludedAudience" : "searchCampaignExcludedAudience"
          var ite = this.addCondition(entity.targeting().excludedAudiences(), config.searchCampaignExcludedAudience)
          entityResponse[config[audienceType]] = []
          while(ite.hasNext()){
            var audience = ite.next()
            Logger.log('Excluded audience with ID = %s, name = %s and audience list ' +
            'ID = %s was found.', audience.getId(), audience.getName(),
            audience.getAudienceId());
            var r = {entity: audience, getId: audience.getId, getAudienceId: audience.getAudienceId(), getName: audience.getName()}
            if(config[audienceType].stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[config[audienceType]].push(r)
          }
        if(config.setTargetingSetting){
          var audienceType = config.searchAdGroupExcludedAudience ? "searchAdGroupExcludedAudience" : "searchCampaignExcludedAudience"
          var ite = this.addCondition(entity.targeting().excludedAudiences(), config.searchCampaignExcludedAudience)
          entityResponse[config[audienceType]] = []
          while(ite.hasNext()){
            var audience = ite.next()
            Logger.log('Excluded audience with ID = %s, name = %s and audience list ' +
            'ID = %s was found.', audience.getId(), audience.getName(),
            audience.getAudienceId());
            var r = {entity: audience, getId: audience.getId, getAudienceId: audience.getAudienceId(), getName: audience.getName()}
            if(config[audienceType].stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[config[audienceType]].push(r)
          }
        }
        if(config.videoAds){
          var ite = this.addCondition(entity.videoAds(), config.condition)
          entityResponse["videoAds"] = []
          while(ite.hasNext()){
            var videoAd = ite.next()
            this.logVideoAd(videoAd);
            var r = this.getVideoAdResult(videoAd)
            if(config.videoAds.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse["videoAds"].push(r)
          }
        }
        /*****************/
        if(config.videoTargeting){
          var ite = this.addCondition(entity.videoTargeting()[config.videoTargeting.type](), [])
          while(ite.hasNext()){
            var videoTargetingProperty = ite.next()
            var funcName = videoTargeting.type.charAt(0).toUpperCase()+videoTargeting.type.substring(1)
            var r = this["get"+funcName+"Result"](videoTargetingProperty)
            if(config.videoTargeting.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[videoTargeting.type].push(r)
          }
        }
        /*****************/
        if(config.stats)
          entityResponse["stats"] = this.getStatsResult(entity.getStatsFor(config.dateRange))
        /*****************/
        if(config.keywords)
          entityResponse["keywords"] = this.getKeywordResult(entity.keywords())
        /*****************/
        if(config.addLocation)
          entity.addLocation(config.addLocation.geoCode, config.addLocation.bidModifier)
          /*****************/
        if(config.action)
          switch(config.action.type){
            case"add": this.addAction(entity, config.action)
            break;
            case"pause": this.pauseAction(entity, config.action)
            break;
            default: this.generalAction(entity, config.action);break;
          }
          /*****************/
        if(config.custom){
          entityResponse = {}
          for(a in config.custom)
            entityResponse[config.custom[a]]
        }
        /*****************/

      }
      // var accountName = account.getName() ? account.getName() : '--';
      // Logger.log('%s,%s,%s,%s', account.getCustomerId(),  accountName,
      //     account.getTimeZone(),  account.getCurrencyCode());
      results.push(entityResponse)
    }
    return results
  }
  addAction(entity, action){
    var entityType = action.entityType
    var actionType = action.actionType
    var config = action.config
    switch(entityType){
      case"keyword":
            entity.newKeywordBuilder()
                .withText(action.withText)
                .withCpc(action.withCpc)/*Optional*/
                .withFinalUrl(action.withFinalUrl) /*Optional*/
                .build();
      break;
      case"location":
            entity.addLocation(action.addLocation.geoCode, action.addLocation.bidModifier)
      break;
      case"audience":
            var AUDIENCE_LIST_ID = action.audienceListId
            var BID_MODIFIER = action.bidModifier
            // Create the search audience.
            var searchAudience = entityResponse.targeting()
                .newUserListBuilder()
                .withAudienceId(AUDIENCE_LIST_ID)
            if(!action.actionType)searchAudience.withBidModifier(BID_MODIFIER).build()
                // Change the target setting to TARGET_ALL.
            else if(!action.actionType == "targetSetting"){
              searchAudience = entityResponse.targeting().setTargetingSetting(config.setTargetingSetting.criterionTypeGroup, config.setTargetingSetting.targetingSetting);
            }
            else if(!action.actionType == "bidModifier"){
              searchAudience = entityResponse.bidding().setBidModifier(BID_MODIFIER);

              // Display the results.
              Logger.log('Bid modifier for Search Audience with Name = "%s" in ' +
                  'Ad Group ID: "%s" was set to %s.',
                   searchAudience.getName(),
                   adGroup.getId().toFixed(0),
                   searchAudience.bidding().getBidModifier());
            }else if(action.actionType == "exclude"){
              searchAudience.exclude()
              // Create the excluded audience.
              Logger.log('Excluded audience with ID = %s and audience list ID = %s was ' +
                  'created for campaign: "%s".', audience.getId(),
                   audience.getAudienceId(), campaign.getName());
            }
            searchAudience.getResult();
      break;
      case"media":
          if(actionType == "addInStream"){
            entity = entity.newVideoAd().inStreamAdBuilder();
            if(config.withAdName)entity = entity.withAdName(config.withAdName)
            if(config.withDisplayUrl)entity = entity.withDisplayUrl(config.withDisplayUrl)
            if(config.withFinalUrl)entity = entity.withFinalUrl(config.withFinalUrl)
            entity.withVideo(config.video).build();
          }
          if(actionType == "videoDiscoveryAd"){
            entity = entity.newVideoAd().videoDiscoveryAdBuilder()
            if(config.withAdName)entity = entity.withAdName(config.withAdName)
            if(config.withDescription1)entity = entity.withDisplayUrl(config.withDescription1)
            if(config.withDescription2)entity = entity.withFinalUrl(config.withDescription2)
            if(config.withHeadline)entity = entity.withFinalUrl(config.withHeadline)
            if(config.withThumbnail)entity = entity.withFinalUrl(config.withThumbnail)
            if(config.withDestinationPage)entity = entity.withFinalUrl(config.withDestinationPage)
            entity.withVideo(video).build();
          }
          if(action.actionType == "inMarketAudience"){
            var audience = entity.videoTargeting().newAudienceBuilder()
            if(config.withAudienceId)entity = entity.withAudienceId(config.withAudienceId)
            if(config.withAudienceType)entity = entity.withAudienceType(config.withAudienceType || 'USER_INTEREST')
            audience.build();
            Logger.log('Added Audience ID %s', audience.getResult().getId().toString());
          }
      break;
      case"video":
          entity.newVideoAdGroupBuilder()
          .withName(config.withName)
          // This can also be 'TRUE_VIEW_IN_DISPLAY'
          .withAdGroupType(config.withAdGroupType || 'TRUE_VIEW_IN_STREAM')
          .withCpv(config.withCpv)
          .build();
      break;
      default:break;
    }
  }
  pauseAction(entity, action){
    var entityType = action.entityType
    var config = action.config
    switch(entityType){
      /*case"keyword":
        entity.pause();
      break;*/
      break;
      default:entity.pause();break;
    }
  }
  generalAction(entity, action){
    var type = action.type
    var actionType = action.actionType
    var config = action.config
    switch(type){
      /*case"keyword":
        entity.pause();
      break;*/
      case"create":
            var root
            if(["adGroup","campaign"].indexOf(actionType) != -1)entityResponse.shoppingAdGroup = entity.newAdGroupBuilder().build().getResult()
            if(["tree"].indexOf(actionType) != -1){
                root = entity.rootProductGroup();
                // Add a brand product group for "cardcow" under root product group.
                var brandNode = root.newChild().brandBuilder().withName(config.brandNode.name).withBid(config.brandNode.bid).build().getResult();
                var newItem, newItems = []
                for(a in config.productGroup){
                  newItem = brandNode.newChild().conditionBuilder().withCondition(config.productGroup[a].conditionName)
                  if(config.productGroup[a].bid)newItem = newItem.withBid(config.productGroup[a].bid)
                  newItem.build().getResult()
                  newItems.push(newItem)
                }
                entityResponse.tree = newItems
              }
              if(["walkHierarchy"].indexOf(actionType) != -1){
                root = entity.rootProductGroup();
                entityResponse.walkHierarchy = this.walkHierarchy(root, 0);
              }
              if(["createProductAd"].indexOf(actionType) != -1){
                var adOperation = shoppingAdGroup.newAdBuilder().withMobilePreferred(true).build();
                var productAd = adOperation.getResult();
                Logger.log(
                    "Ad with ID = %s was created.",
                    productAd.getId().toFixed(0));
              }
      break;
      case"set":
            if(actionType == "updateProductGroupBid")entity.setMaxCpc(entity.getMaxCpc() + config.setMaxCpc);
            if(entityType == "video"){
              if(actionType == "setCpv")entity.bidding().setCpv(config.setCpv)
            }
      break;
      case"remove":
            entity.remove()
      break;
      case"removeLabel":
            entity.removeLabel(action.labelName)
      break;
      case"applyLabel":
            entity.applyLabel(action.labelName)
      break;
      case"open":
            if(actionType == "openUserLists")entity.open();
      break;
      default:break;
    }
  }
  getAccountResult(account){
    return {entity: account, getCurrencyCode: account.getCurrencyCode(), getCustomerId: account.getCustomerId(), getName: account.getName(), getTimeZone: account.getTimeZone()}
  }
  getCampaignResult(campaign, full){
    if(full)return {entity: campaign, getId: campaign.getId(), getName: campaign.getName(), bidding: {getStrategyType: campaign.bidding().getStrategyType()}}
    return {entity: campaign, getId: campaign.getId(), getName: campaign.getName(), getTimeZone: campaign.getTimeZone()}
  }
  getShoppingCampaignResult(shoppingCampaign){
    return {entity: shoppingCampaign, getId: shoppingCampaign.getId(), getName: shoppingCampaign.getName(), bidding: {getStrategyType: shoppingCampaign.bidding().getStrategyType()}}
  }
  getAdGroupResult(adGroup, full){
    if(full)return {entity: adGroup, getId: adGroup.getId(), getName: adGroup.getName(), bidding: {getCpa: adGroup.bidding().getCpa(), getCpc: adGroup.bidding().getCpc(), getCpm: adGroup.bidding().getCpm(), getStrategyType: adGroup.bidding().getStrategyType()}, devices: {getTabletBidModifier: adGroup.devices().getTabletBidModifier(), getMobileBidModifier: adGroup.devices().getMobileBidModifier(), getDesktopBidModifier: adGroup.devices().getDesktopBidModifier()}}
    return {entity: adGroup, getId: adGroup.getId(), getName: adGroup.getName(), getTimeZone: adGroup.getTimeZone()}
  }
  getShoppingAdGroupResult(shoppingAdGroup){
    var children = [];
    var tmp, tmpEntity = shoppingAdGroup.rootProductGroup().children().get();
    while(tmpEntity.hasNext()){tmp = tmpEntity.next(); if(tmp.isOtherCase())children.push(this.getProductGroupResult(tmp))}
    return {entity: shoppingAdGroup, getId: shoppingAdGroup.getId(), getName: shoppingAdGroup.getName(), bidding: {getCpa: shoppingAdGroup.bidding().getCpa(), getCpc: shoppingAdGroup.bidding().getCpc(), getCpm: shoppingAdGroup.bidding().getCpm(), getStrategyType: shoppingAdGroup.bidding().getStrategyType()}, devices: {getTabletBidModifier: shoppingAdGroup.devices().getTabletBidModifier(), getMobileBidModifier: shoppingAdGroup.devices().getMobileBidModifier(), getDesktopBidModifier: shoppingAdGroup.devices().getDesktopBidModifier()},
    children: children}
  }
  getShoppingProductAdResult(productAd){
    return {entity: productAd, getId: productAd.getId(), getName: productAd.getName(), bidding: {getCpa: productAd.bidding().getCpa(), getCpc: productAd.bidding().getCpc(), getCpm: productAd.bidding().getCpm(), getStrategyType: productAd.bidding().getStrategyType()}, devices: {getTabletBidModifier: productAd.devices().getTabletBidModifier(), getMobileBidModifier: productAd.devices().getMobileBidModifier(), getDesktopBidModifier: productAd.devices().getDesktopBidModifier()}}
  }
  getShoppingProductGroupResult(productGroup){
    return {entity: productGroup, getId: productGroup.getId(), getName: productGroup.getName(), bidding: {getCpa: productGroup.bidding().getCpa(), getCpc: productGroup.bidding().getCpc(), getCpm: productGroup.bidding().getCpm(), getStrategyType: productGroup.bidding().getStrategyType()}, devices: {getTabletBidModifier: productGroup.devices().getTabletBidModifier(), getMobileBidModifier: productGroup.devices().getMobileBidModifier(), getDesktopBidModifier: productGroup.devices().getDesktopBidModifier()}}
  }
  getAdResult(ad){
    return {entity: ad, getId: ad.getId(), getDescription1: ad.getDescription1(), getDescription2: ad.getDescription2(), getDisplayUrl: ad.getDisplayUrl(), getHeadline: ad.getHeadline()}
  }
  getKeywordResult(keyword){
    return {entity: keyword, getId: keyword.getId(), getApprovalStatus: keyword.getApprovalStatus(), getFirstPageCpc: keyword.getFirstPageCpc(), getMatchType: keyword.getMatchType(), getQualityScore: keyword.getQualityScore(), getText: keyword.getText(), getTopOfPageCpc: keyword.getTopOfPageCpc()}
  }
  getLabelResult(label){
    return {entity: label, getId: label.getId(), getName: label.getName(), getColor: label.getColor(), getDescription: label.getDescription()}
  }
  getBiddingStrategyResult(label){
    return {entity: label, getId: label.getId(), getName: label.getName(), getType: label.getType()}
  }
  getDraftResult(label){
    return {entity: label, getId: label.getId(), getName: label.getName(), getStatus: label.getStatus(), hasRunningExperiment: label.hasRunningExperiment()}
  }
  getExperimentResult(label){
    return {entity: label, getId: label.getId(), getName: label.getName(), getStatus: label.getStatus(), getTrafficSplitPercent: label.getTrafficSplitPercent()}
  }
  getBudgetOrdersResult(label){
    return {entity: label, getId: label.getId(), getName: label.getName(), budgetOrders: label.budgetOrders(), getSpendingLimit: label.getSpendingLimit(), getTotalAdjustments: label.getTotalAdjustments()}
  }
  getStatsResult(stats){
    return {entity: stats, getAverageCpc: stats.getAverageCpc(), getAverageCpm: stats.getAverageCpm(), getAverageCpv: stats.getAverageCpv(), getAveragePageviews: stats.getAveragePageviews(), getCtr: stats.getCtr(), getImpressions: stats.getImpressions(), getViewRate: stats.getViewRate(), getViews: stats.getViews(), getCost: stats.getCost(), getConversions: stats.getConversions(), getConversionRate: stats.getConversionRate(), getClicks: stats.getClicks(), getBounceRate: stats.getBounceRate(), getAverageTimeOnSite: stats.getAverageTimeOnSite()}
  }
  getMobileAppResult(app){
    return {entity: app, getAppId: app.getAppId(), getId: app.getId(), getLinkText: app.getLinkText(), getStore: app.getStore()}
  }
  getPhoneNumberResult(phone){
    return {entity: phone, getCountry: phone.getCountry(), getId: phone.getId(), isMobilePreferred: phone.isMobilePreferred(), getPhoneNumber: phone.getPhoneNumber()}
  }
  getPriceResult(price){
    return {entity: price, getLanguage: price.getLanguage(), getPriceQualifier: price.getPriceQualifier(), isMobilePreferred: price.isMobilePreferred(), getPriceType: price.getPriceType(), getTrackingTemplate: price.getTrackingTemplate()}
  }
  getSiteLinksResult(sitelink){
    return {entity: sitelink, getId: sitelink.getId, getDescription1: sitelink.getDescription1(), getDescription2: sitelink.getDescription2(), isMobilePreferred: sitelink.isMobilePreferred(), getLinkText: sitelink.getLinkText()}
  }
  getProximitiesResult(proximity){
    return {entity: proximity, getId: proximity.getId, getBidModifier: proximity.getBidModifier(), getCampaignType: proximity.getCampaignType(), getLatitude: proximity.getLatitude(), getLongitude: proximity.getLongitude(), getRadius: proximity.getRadius(), getRadiusUnits: proximity.getRadiusUnits()}
  }
  getPlatformsResult(platform){
    return {entity: platform, getId: platform.getId, getBidModifier: platform.getBidModifier(), getCampaignType: platform.getCampaignType(), getLatitude: platform.getLatitude(), getLongitude: platform.getLongitude(), getRadius: platform.getRadius(), getRadiusUnits: platform.getRadiusUnits()}
  }
  getLocationsResult(location){
    return {entity: location, getId: location.getId, getBidModifier: location.getBidModifier(), getCampaignType: location.getCampaignType(), getCountryCode: location.getCountryCode(), getName: location.getName(), getTargetType: location.getTargetType(), getTargetingStatus: location.getTargetingStatus()}
  }
  getExcludedLocationsResult(excludedLocation){
    return {entity: excludedLocation, getId: excludedLocation.getId, getCountryCode: excludedLocation.getCountryCode(), getCampaignType: excludedLocation.getCampaignType(), getName: excludedLocation.getName(), getTargetType: excludedLocation.getTargetType(), getTargetingStatus: excludedLocation.getTargetingStatus()}
  }
  getAdSchedulesResult(adSchedule){
    return {entity: adSchedule, getId: adSchedule.getId, getDayOfWeek: adSchedule.getDayOfWeek(), getCampaignType: adSchedule.getCampaignType(), getEndHour: adSchedule.getEndHour(), getEndMinute: adSchedule.getEndMinute(), getStartHour: adSchedule.getStartHour(), getStartMinute: adSchedule.getStartMinute()}
  }
  getAgesResult(ages){
    return {entity: audience, getId: audience.getId, getAgeRange: audience.getAgeRange()}
  }
  getAudiencesResult(audience){
    return {entity: audience, getId: audience.getId, getAudienceId: audience.getAudienceId(), getAudienceType	: audience.getAudienceType(), getName: audience.getName(), isEnabled: audience.isEnabled()}
  }
  getGendersResult(genders){
    return {entity: audience, getId: audience.getId, getGenderType: audience.getGenderType()}
  }
  getKeywordsVideoResult(keywordsVideo){
    return {entity: audience, getId: audience.getId, getText: audience.getText(), isEnabled: audience.isEnabled()}
  }
  getKeywordsResult(keywordsVideo){
    return {entity: audience, getId: audience.getId, getText: audience.getText(), isEnabled: audience.isEnabled()}
  }
  getMobileAppCategoriesResult(mobileAppCategories){
    return {entity: audience, getId: audience.getId, getMobileAppCategoryId: audience.getMobileAppCategoryId(), isManaged	: audience.isManaged(), isPaused: audience.isPaused(), isEnabled: audience.isEnabled()}
  }
  getMobileApplicationsResult(mobileApplications){
    return {entity: audience, getId: audience.getId, getAppId: audience.getAppId(), isManaged	: audience.isManaged(), getName: audience.getName(), isEnabled: audience.isEnabled()}
  }
  getParentalStatusesResult(parentalStatuses){
    return {entity: audience, getId: audience.getId, getParentType: audience.getParentType()}
  }
  getPlacementsResult(placements){
    return {entity: audience, getId: audience.getId, getUrl: audience.getUrl(), isManaged	: audience.isManaged(), isPaused: audience.isPaused(), isEnabled: audience.isEnabled()}
  }
  getTopicsResult(topics){
    return {entity: audience, getId: audience.getId, getTopicId: audience.getTopicId(), isPaused: audience.isPaused(), isEnabled: audience.isEnabled()}
  }
  getYouTubeChannelsResult(youTubeChannels){
    return {entity: audience, getId: audience.getId, getChannelId: audience.getChannelId(), isManaged	: audience.isManaged(), isPaused: audience.isPaused(), isEnabled: audience.isEnabled()}
  }
  getYouTubeVideosResult(youTubeVideos){
    return {entity: audience, getId: audience.getId, getVideoId: audience.getVideoId(), isManaged	: audience.isManaged(), isPaused: audience.isPaused(), isEnabled: audience.isEnabled()}
  }
  getProductGroupResult(productGroup){
    return {entity: productGroup, getId: productGroup.getId, getDimension: productGroup.getDimension(), getMaxCpc	: productGroup.getMaxCpc(), getValue: productGroup.getValue(), isExcluded: productGroup.isExcluded(), isOtherCase: productGroup.isOtherCase(), children: }
  }
  getProductAdResult(productAd){
    return {entity: productAd, getId: productAd.getId, getType: productAd.getType(), isEnabled: productAd.isEnabled(), isMobilePreferred: productAd.isMobilePreferred(), isPaused: productAd.isPaused()}
  }
  getUserListResult(userList){
    Logger.log('Name: ' + userList.getName() +        ' Type: ' + userList.getType() +        ' ID: ' + userList.getId());    Logger.log(' Desc: ' + userList.getDescription() +        ' IsOpen: ' + userList.isOpen() +        ' MembershipLifeSpan: ' + userList.getMembershipLifeSpan());    Logger.log(' SizeForDisplay: ' + userList.getSizeForDisplay() +        ' SizeRangeForDisplay: ' + userList.getSizeRangeForDisplay());    Logger.log(' SizeForSearch: ' + userList.getSizeForSearch() +        'SizeRangeForSearch: ' + userList.getSizeRangeForSearch());   Logger.log(' IsReadOnly: ' + userList.isReadOnly() +        ' IsEligibleForSearch: ' + userList.isEligibleForSearch() +        ' IsEligibleForDisplay: ' + userList.isEligibleForDisplay());    Logger.log(' ');
    return {entity: userList, getId: userList.getId, getDescription: userList.getDescription(), getMembershipLifeSpan: userList.getMembershipLifeSpan(), getName: userList.getName(), getSizeForDisplay: userList.getSizeForDisplay(), getSizeForSearch: userList.getSizeForSearch(), getSizeRangeForDisplay: userList.getSizeRangeForDisplay(), getSizeRangeForSearch: userList.getSizeRangeForSearch(), getType: userList.getType(), isClosed: userList.isClosed(), isEligibleForDisplay: userList.isEligibleForDisplay(), isEligibleForSearch: userList.isEligibleForSearch(), isOpen: userList.isOpen(), isReadOnly: userList.isReadOnly()}
  }
  getVideoCampaignResult(videoCampaign){
    Logger.log('Campaign Name: ' + videoCampaign.getName());    Logger.log('Enabled: ' + videoCampaign.isEnabled());    Logger.log('Bidding strategy: ' + videoCampaign.getBiddingStrategyType());    Logger.log('Ad rotation: ' + videoCampaign.getAdRotationType());    Logger.log('Start date: ' + this.formatDate(videoCampaign.getStartDate()));    Logger.log('End date: ' + this.formatDate(videoCampaign.getEndDate()));
    return {entity: videoCampaign, getId: videoCampaign.getId, getAdRotationType: videoCampaign.getAdRotationType(), getBiddingStrategyType: videoCampaign.getBiddingStrategyType(), getName: videoCampaign.getName(), getInventoryType: videoCampaign.getInventoryType(), getNetworks: videoCampaign.getNetworks(), isEnabled: videoCampaign.isEnabled(), isPaused: videoCampaign.isPaused(), isRemoved: videoCampaign.isRemoved(), isClosed: videoCampaign.isClosed()}
  }
  getVideoAdGroupResult(videoAdGroup){
    return {entity: videoAdGroup, getId: videoAdGroup.getId, getName: videoAdGroup.getName(), getTopContentBidModifier: videoAdGroup.getTopContentBidModifier(), getAdGroupType: videoAdGroup.getAdGroupType(), isEnabled: videoAdGroup.isEnabled(), isPaused: videoAdGroup.isPaused(), isRemoved: videoAdGroup.isRemoved()}
  }
  getVideoAdResult(videoAd){
    return {entity: videoAd, getId: videoAd.getId, getChannelName: videoAd.getChannelName(), getDescription1: videoAd.getDescription1(), getName: videoAd.getName(), getDescription2: videoAd.getDescription2(), getDestinationPage: videoAd.getDestinationPage(), getDisplayUrl: videoAd.getDisplayUrl(), getHeadline: videoAd.getHeadline(), getPolicyApprovalStatus: videoAd.getPolicyApprovalStatus(), getType: videoAd.getType(), getVideoId: videoAd.getVideoId(), isEnabled: videoAd.isEnabled(), isPaused: videoAd.isPaused()}
  }
  getMediaResult(media){
    return {entity: media, getId: media.getId, getFileSize: media.getFileSize(), getMimeType: media.getMimeType(), getName: media.getName(), getReferenceId: media.getReferenceId(), getSourceUrl: media.getSourceUrl(), getType: media.getType(), getHeadline: media.getHeadline(), getPolicyApprovalStatus: media.getPolicyApprovalStatus(), getType: media.getType(), getVideoId: media.getVideoId(), isEnabled: media.isEnabled(), isPaused: media.isPaused()}
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
