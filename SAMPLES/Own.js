class Own(){
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
  addCondition(theIterator, objectCondition){
    var dateRange = objectCondition.dateRange || []
    var orderBy = objectCondition.orderBy || []
    var widthIds = objectCondition.widthIds || []
    var condition = objectCondition.condition || []

    if(condition)
      if(Array.isArray(condition))
        for(a in condition)
          theIterator.withCondition(condition)
      else theIterator.withCondition(condition)
    this.throwerr("addCondition=>argument 'objectCondition' manquant")
    if(dateRange)theIterator.forDateRange(dateRange)
    if(orderBy)theIterator.orderBy(orderBy)
    if(widthIds)theIterator.widthIds(widthIds)
    return theIterator.get();
  }
  getResults(theIterator, config){
    var results = [], entityResponse
    while (theIterator.hasNext()) {
      var entity = theIterator.next();
      switch(entity.getEntityType()){
        case"Account":entityResponse = this.getAccountResults(entity);break;
        case"Campaign":entityResponse = this.getCampaignResults(entity);break;
        case"CampaignMobileApp":entityResponse = this.getMobileAppResult(entity);break;
        case"AdGroup":entityResponse = this.getAdGroupResults(entity);break;
        case"Ad":entityResponse = this.getAdResults(entity);break;
        case"Keyword":entityResponse = this.getKeywordResults(entity);break;
        case"Label":entityResponse = this.getLabelResults(entity);break;
        /*EXTENSIONS*/
        /*
        case"MobileApp":entityResponse = this.getMobileAppResults(entity);break;
        case"PhoneNumber":entityResponse = this.getPhoneNumberResults(entity);break;
        case"Price":entityResponse = this.getPriceResults(entity);break;
        case"SiteLinks":entityResponse = this.getSiteLinksResults(entity);break;
        case"Snippets":entityResponse = this.getSnippetsResults(entity);break;
        /*----------*/
      }

      if(config){
        if(config.mobileApps){
          var ite = this.addCondition(entity.extensions().mobileApps().get(), config.mobileApps.condition)
          entityResponse["mobileApp"] = []
          while(ite.hasNext()){
            var r = this.getMobileAppResult(ite.next())
            if(config.mobileApps.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.mobileApps.dateRange || config.dateRange))})
            entityResponse["mobileApp"].push(r)
          }
        }
        if(config.phoneNumbers){
          var ite = this.addCondition(entity.phoneNumbers().get(), config.mobileApps.condition)
          entityResponse["phoneNumber"] = []
          while(ite.hasNext()){
            var r = this.getPhoneNumberResult(ite.next())
            if(config.phoneNumbers.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.phoneNumbers.dateRange || config.dateRange))})
            entityResponse["phoneNumber"].push(r)
          }
        }
        if(config.prices){
          var ite = this.addCondition(entity.extensions().prices().get(), config.prices.condition)
          entityResponse["prices"] = []
          while(ite.hasNext()){
            var r = this.getPhoneNumberResult(ite.next())
            if(config.prices.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.prices.dateRange || config.dateRange))})
            entityResponse["prices"].push(r)
          }
        }
        if(config.sitelinks){
          var ite = this.addCondition(entity.extensions().sitelinks().get(), config.sitelinks.condition)
          entityResponse["sitelinks"] = []
          while(ite.hasNext()){
            var r = this.getSiteLinksResult(ite.next())
            if(config.sitelinks.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.sitelinks.dateRange || config.dateRange))})
            entityResponse["sitelinks"].push(r)
          }
        }
        if(config.snippets){
          var ite = this.addCondition(entity.extensions().snippets().get(), config.snippets.condition)
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
            var ite = this.addCondition(entity.targetting().targetedProximities().get(), config.proximities.condition)
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
          if(config.platforms.targets == "desktop")var ite = this.addCondition(entity.platforms().desktop().get(), config.platforms.condition)
          if(config.platforms.targets == "tablet")var ite = this.addCondition(entity.platforms().tablet().get(), config.platforms.condition)
          if(config.platforms.targets == "mobile")var ite = this.addCondition(entity.platforms().mobile().get(), config.platforms.condition)
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
          if(config.addLocation)
            entity.addLocation(config.addLocation)
          var ite = this.addCondition(entity.targetting().targetedLocations().get(), config.locations.condition)
          entityResponse[config.locations] = []
          while(ite.hasNext()){
            var r = this.getLocationsResult(ite.next())
            if(config.locations.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[config.locations].push(r)
          }
        }
        if(config.excludedLocations){
          if(config.excludedLocations.add)
            entity.excludedLocations(config.excludeLocation.add.geoCode)
          var ite = this.addCondition(entity.targetting().excludedLocations().get(), config.locations.condition)
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
            entity.adSchedules(config.excludeLocation.add.geoCode)
          var ite = this.addCondition(entity.targetting().adSchedules().get(), config.locations.condition)
          entityResponse[config.adSchedules] = []
          while(ite.hasNext()){
            var r = this.getAdSchedulesResult(ite.next())
            if(config.adSchedules.stats)
              r = r.concat({stats: this.getStatsResult(ite.getStatsFor(config.dateRange))})
            entityResponse[config.adSchedules].push(r)
          }
        }
        /*****************/
        if(config.stats)
          entityResponse["stats"] = this.getStatsResult(entity.getStatsFor(config.dateRange))
        /*****************/
        if(config.addLocation)
          entity.addLocation(config.addLocation.geoCode, config.addLocation.bidModifier)
      }
      // var accountName = account.getName() ? account.getName() : '--';
      // Logger.log('%s,%s,%s,%s', account.getCustomerId(),  accountName,
      //     account.getTimeZone(),  account.getCurrencyCode());
      results.push(entityResponse)
    }
    return results
  }
  getAccountResult(account){
    return {entity: account, getCurrencyCode: account.getCurrencyCode(), getCustomerId: account.getCustomerId(), getName: account.getName(), getTimeZone: account.getTimeZone()}
  }
  getCampaignResult(campaign){
    return {entity: campaign, getId: campaign.getId(), getName: campaign.getName(), getTimeZone: campaign.getTimeZone()}
  }
  getAdGroupResult(adGroup){
    return {entity: adGroup, getId: adGroup.getId(), getName: adGroup.getName(), getTimeZone: adGroup.getTimeZone()}
  }
  getAdResult(ad){
    return {entity: ad, getId: ad.getId(), getDescription1: ad.getDescription1(), getDescription2: ad.getDescription2(), getDisplayUrl: ad.getDisplayUrl(), getHeadline: ad.getHeadline()}
  }
  getKeywordResult(keyword){
    return {entity: keyword, getId: keyword.getId(), getApprovalStatus: keyword.getApprovalStatus(), getFirstPageCpc: keyword.getFirstPageCpc(), getMatchType: keyword.getMatchType(), getQualityScore: keyword.getQualityScore(), getText: keyword.getText(), getTopOfPageCpc: keyword.getTopOfPageCpc(), getText: keyword.getText()}
  }
  getLabelResult(label){
    return {entity: label, getId: label.getId(), getName: label.getName(), getColor: label.getColor(), getDescription: label.getDescription()}
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
  getExcludedLocationsResult(excludedLocations){
    return {entity: excludedLocations, getId: excludedLocations.getId, getCountryCode: excludedLocations.getCountryCode(), getCampaignType: excludedLocations.getCampaignType(), getName: excludedLocations.getName(), getTargetType: excludedLocations.getTargetType(), getTargetingStatus: excludedLocations.getTargetingStatus()}
  }
  getAdSchedulesResult(excludedLocations){
    return {entity: excludedLocations, getId: excludedLocations.getId, getDayOfWeek: excludedLocations.getDayOfWeek(), getCampaignType: excludedLocations.getCampaignType(), getEndHour: excludedLocations.getEndHour(), getEndMinute: excludedLocations.getEndMinute(), getStartHour: excludedLocations.getStartHour(), getStartMinute: excludedLocations.getStartMinute()}
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
