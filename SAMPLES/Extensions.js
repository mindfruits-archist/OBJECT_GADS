import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Extentions************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class Extensions extends Own(){
  constructor(){

  }
  /*Mobile Apps******************************************************************************************/
  /************************************************************************************************************************/
  addMobileApp(config) {
    console.log("Ajouter une application mobile à une campagne.\nParamètre obligatoires: \n{withAppId:, withStore:, withLinkText:, withFinalUrl:, getFinalDate:,}");
    var withAppId = config.withAppId, withStore = config.withStore, withLinkText = config.withLinkText, withFinalUrl = config.withFinalUrl, finalDate = config.getFinalDate
    var request = typeof config == 'string' ? config : config.condition

    var theIterator
    if(!ite)theIterator = this.addCondition(AdsApp.campaigns(), request)
    else theIterator = ite
    while (theIterator.hasNext()) {
      var campaign = theIterator.next();
      // See https://support.google.com/google-ads/answer/2402582 for details on how
      // to obtain applications specific store id
      var newMobileApp = AdsApp.extensions().newMobileAppBuilder()
          .withAppId(withAppId)                  // required
          .withStore(withStore)
          .withLinkText(withLinkText)           // required
          .withFinalUrl(withFinalUrl)  // required
          .withStartDate(finalDate)      // optional
          .build()
          .getResult();

      // Add mobile app to campaign. Adding mobile apps to ad groups is similar.
      campaign.addMobileApp(newMobileApp);
    }
    return true
  }
  getMobileAppsForCampaign(config, ite) {
    console.log("Récupérer les infos e l'application mobile d'une campagne.\nParamètre obligatoires: \n{condition: [""],}");
    var request = typeof config == 'string' ? config : config.condition
    var theIterator
    if(!ite)theIterator = this.addCondition(AdsApp.campaigns(), request)
    else theIterator = ite
    return this.getResults(theIterator, {mobileApp: true})
  }
  getMobileAppStats(config, ite) {
    console.log("Récupérer les stats de l'application mobile d'une campagne.\nParamètre obligatoires: \n{condition: [""],}");
    var request = typeof config == 'string' ? config : config.condition
    var theIterator = this.addCondition(AdsApp.campaigns(), request)
    while (theIterator.hasNext()) {
      var campaign = theIterator.next();
      // Retrieve the campaign's mobile apps. Retrieving an ad group's mobile
      // apps is similar.
      var appsIterator = campaign.extensions().mobileApps().get();

      var stats = this.getResults(appsIterator, {stats: config.dateRange})
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Phone Numbers******************************************************************************************/
  /************************************************************************************************************************/
  addPhoneNumber(config, ite) {
    console.log("Ajouter une application mobile à une campagne.\nParamètre obligatoires: \n{getId:, getCountry:, getPhoneNumber:,}");
    var getId = config., getCountry = config.getCountry, getPhoneNumber = config.getPhoneNumber, isMobilePreferred = config.isMobilePreferred
    var condition = typeof config == 'string' ? config : config.condition
    var theIterator
    if(!ite)theIterator = this.addCondition(AdsApp.campaigns(), condition)
    else theIterator = ite
    while (theIterator.hasNext()) {
      var entity = theIterator.next();
      var phoneNumberBuilder = AdsApp.extensions().newPhoneNumberBuilder();
      var newPhoneNumber = phoneNumberBuilder
          .withCountry(getCountry)
          .withPhoneNumber(getPhoneNumber)
          .build()
          .getResult();

      // Add phone number to entity. Adding phone number to ad group is
      // similar.
      entity.addPhoneNumber(newPhoneNumber);
      Logger.log("Le numéro '"+newPhoneNumber+"' a été ajouté à la l'entité '"+campaign.getEntityName()+"' nommée '"+entity.getName()+"'")
    }
  }
  getPhoneNumbersForCampaign(config, ite) {
    console.log("Récupérer les numéros de téléphone associés à une campagne.\nParamètre obligatoires: \n{condition: [""], phoneNumber: ,}");
    var theIterator
    if(!ite)theIterator = this.addCondition(AdsApp.campaigns(), config)
    else theIterator = ite
    return this.getResults(theIterator, {phoneNumber: config.phoneNumber})
  }
  getPhoneNumberStats(config, phoneNumber) {
    // To retrieve stats for the phone number over all campaigns you can use
    //    AdsApp.extensions().phoneNumbers()
    //    directly instead of filtering by a specific campaign.
    console.log("Récupérer les stats d'un numéro de téléphone associés à une campagne.\nParamètre obligatoires: \n{condition: [""], phoneNumber: ,}");
    var theIterator
    if(!ite)theIterator = this.addCondition(AdsApp.campaigns(), config)
    else theIterator = ite
    var result = this.getResults(theIterator)
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      // Retrieve the campaign's phone numbers. Retrieving an ad group's phone
      // numbers is similar.

      var campaignPhoneNumberIterator = campaign.extensions()
          .phoneNumbers()
          .get();
      var tmp = this.getResults(campaignPhoneNumberIterator, {stats: config.dateRange})
    }
  }
  setPhoneNumberSchedule(config) {
    if(!config.condition || !config.schedule)
      throwerr("config contient trois(3) clés: 'phoneNumber'(''), 'condition'(''/['']) et 'schedule'([{}])")
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var phoneNumberIterator = campaign.extensions().phoneNumbers().get();
      var phoneNumber = null;

      // Scan through the phone numbers to locate the one with matching number.
      while (phoneNumberIterator.hasNext()) {
        phoneNumber = phoneNumberIterator.next();
        if (phoneNumber.getPhoneNumber() == '"'+config.phoneNumber+'"') {
          // Set phone number schedule to run only on Mondays and Tuesdays, 9 AM
          // to 6 PM. You can follow a similar approach to set schedules for
          // other ad extension types.
          var days = []
          for(a in config.schedule)
            days.push({
              dayOfWeek: config.schedule[a].dayOfWeek,
              startHour: config.schedule[a].startHour,
              startMinute: config.schedule[a].startMinute,
              endHour: config.schedule[a].endHour,
              endMinute: config.schedule[a].endMinute
            })

          phoneNumber.setSchedules(days);
          break;
        }
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Prices******************************************************************************************/
  /************************************************************************************************************************/
  createPrice(config) {
    console.log("supposed config={prices:[{withHeader,withDescription,withAmount,withCurrencyCod,withUnitType,withFinalUrl,withMobileFinalUrl}], conditions: [{adgroups, campaigns}], priceBuilder: {product_catName,riceQualifier,trackingTemplate}}");
    console.log("observed config="+config);
    var a, item, priceItemBuilder = AdsApp.extensions().newPriceItemBuilder();
    if(config.prices||(config.entities)
      throwerr("Extensions::createPrice => config est un objet contenant les prices et les conditions a appliquer à la selection d'entities sur lesquelles appliquées le(s) prices)")
    var priceItems = []
    for(a config.prices){
      item = config.prices[a]
      priceItems.push(
        priceItemBuilder.withHeader(item.withHeader)
        .withDescription(item.withDescription)
        .withAmount(item.withAmount)
        .withCurrencyCod(item.withCurrencyCod')
        .withUnitType(item.withUnitType)
        .withFinalUrl(item.withFinalUrl)
        .withMobileFinalUrl(item.withMobileFinalUrl)
        .build()
        .getResult()
      )
    }
    if(!config.priceBuilder)
      throwerr("Extensions::createPrice => config est un objet contenant aussi un json pour configurer le priceBuilder")
    var priceBuilder = AdsApp.extensions().newPriceBuilder();
    var price = priceBuilder.withPriceType(config.product_catName)
        .withPriceQualifier('UP_TO')
        .withTrackingTemplate('http://www.example.com/track')
        .withLanguage(config.priceBuilder.language || 'EN')
    for(a in priceItems)
        price.addPriceItem(priceItems[a])
    price.build().getResult();

    // Add price extension to the account.
    AdsApp.currentAccount().addPrice(price);

    // Add price extension to an ad group.
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.conditions.adgroups)
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.addPrice(price);
    }

    // Add price extension to a campaign.
    var adGroupIterator = this.addCondition(AdsApp.campaigns(), config.conditions.campaigns)
    var campaignIterator = AdsApp.campaigns()
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.addPrice(price);
    }
  }

  getPricesForCampaign(config) {
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    return this.getResults(campaignIterator, {prices: true})
  }
  getPricesStats(config) {
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    var resp = this.getResults(campaignIterator)
    var campaign = resp.entity
      // Retrieve the campaign's price extensions. Retrieving an ad group's
      // price extensions is similar.
    return this.getResults(campaign.extensions().prices().get(), {stats: {dateRange: config.dateRange}} )
/*
      while (pricesIterator.hasNext()) {
        var price = pricesIterator.next();

        // You can also request reports for pre-defined date ranges. Refer to
        // https://developers.google.com/adwords/api/docs/guides/awql,
        // DateRangeLiteral section for possible values.
        var stats = price.getStatsFor(dateRange);
        Logger.log(price.getId() + ', ' + stats.getClicks() + ', ' +
            stats.getImpressions());
      }
    }
*/
    }
    console.log("la condition '"+config.condition+"' ne recupère aucune entité");
  }
  setPriceSchedule(config) {
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    var resp = getResults(campaignIterator, {prices: true})
    var prices = resp.prices
    for(a in prices){
      price = prices[a]
      if (price.getPriceType() == config.priceType) {
        // Set price extension schedule to run only on Mondays and Tuesdays,
        // 9 AM to 6 PM. You can follow a similar approach to set schedules for
        // other ad extension types.
        var days = []
        for(a in config.schedule)
          days.push({
            dayOfWeek: config.schedule[a].dayOfWeek,
            startHour: config.schedule[a].startHour,
            startMinute: config.schedule[a].startMinute,
            endHour: config.schedule[a].endHour,
            endMinute: config.schedule[a].endMinute
          })

        price.setSchedules(days);

        return;
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Sitelinks******************************************************************************************/
  /************************************************************************************************************************/
  createSitelink(config) {
    console.log("supposed config={condition:{campaigns,adGroups}, prices:[{withHeader,withDescription,withMobilePreferred}]");
    console.log("observed config="+config);
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition.campaigns)
    if (campaignIterator.hasNext())
      var campaign = campaignIterator.next();
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition.adGroups)
    if (adGroupIterator.hasNext())
      var adGroup = adGroupIterator.next();

    if(!config.sitelinks)throwerr("Extensions::createSiteLinks: !config.sitelinks!")
    for(a in config.sitelink){
      var sitelinkBuilder = AdsApp.extensions().newSitelinkBuilder();
      var newSitelink = sitelinkBuilder
      .withLinkText(config.sitelinks[a].withLinkText)
      .withFinalUrl(config.sitelinks[a].withFinalUrl)
      .withMobilePreferred(config.sitelinks[a].withMobilePreferred)
      .build()
      .getResult();

      if(config.condition.campaign)campaign.addSitelink(newSitelink);
      if(config.condition.adGroups)adGroup.addSitelink(newSitelink);
    }
  }
  getSitelinksForCampaign(config) {
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    var resp = this.getResults(campaignIterator, {sitelinks: true})
    this.printJSON(resp)
    return resp
    /*
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var sitelinksIterator = campaign.extensions().sitelinks().get();
      while (sitelinksIterator.hasNext()) {
        var sitelink = sitelinksIterator.next();
        Logger.log('Sitelink text: ' + sitelink.getLinkText() +
            ', Sitelink final URL: ' + sitelink.urls().getFinalUrl() +
            ', mobile preferred: ' + sitelink.isMobilePreferred());
      }
      Logger.log(
          'Total count of sitelinks: ' + sitelinksIterator.totalNumEntities());
    }
    */
  }
  getSitelinkStats(config) {
    var campaignIterator = addCondition(AdsApp.campaigns(), config.condition)
    var resp = getResults(campaignIterator, {sitelinks: {stats:true, dateRange: config.dateRange}})
    return resp.sitelinks
    //var campaign = Object.assign({}, campaignIterator.entity)
    /*
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      // Retrieve the campaign's sitelinks. Retrieving an ad group's
      // sitelinks is similar.
      var sitelinksIterator = campaign.extensions().sitelinks().get();

      while (sitelinksIterator.hasNext()) {
        var sitelink = sitelinksIterator.next();

        // You can also request reports for pre-defined date ranges. See
        // https://developers.google.com/adwords/api/docs/guides/awql,
        // DateRangeLiteral section for possible values.
        var stats = sitelink.getStatsFor('LAST_MONTH');
        Logger.log(sitelink.getLinkText() + ', ' + stats.getClicks() + ', ' +
            stats.getImpressions());
      }
    }
    */
  }
  setSitelinkSchedule(config) {
    if(!config.getLinkText)throwerr("'config.getLinkText' required")
    var campaignIterator = addCondition(AdsApp.campaigns(), config.condition)
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var sitelinksIterator = campaign.extensions().sitelinks().get();
      var sitelink = null;

      // Scan through the sitelinks to locate the one with text as Music.
      while (sitelinksIterator.hasNext()) {
        sitelink = sitelinksIterator.next();
        if (sitelink.getLinkText() == config.getLinkText) {
          // Set sitelink schedule to run only on Mondays and Tuesdays, 9 AM to
          // 6 PM. You can follow a similar approach to set schedules for other
          // ad extension types.
          var days = []
          for(a in config.schedule)
            days.push({
              dayOfWeek: config.schedule[a].dayOfWeek,
              startHour: config.schedule[a].startHour,
              startMinute: config.schedule[a].startMinute,
              endHour: config.schedule[a].endHour,
              endMinute: config.schedule[a].endMinute
            })

          sitelink.setSchedules(days);

          break;
        }
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Sitelinks******************************************************************************************/
  /************************************************************************************************************************/
  createSnippet(config) {
    console.log("supposed config={condition:{campaigns,adGroups}, snippet:[{withHeader'',withValues[],withMobilePreferred(boolean)}]");
    console.log("observed config="+config);
    var snippetBuilder = AdsApp.extensions().newSnippetBuilder();
    var newSnippet = snippetBuilder
        .withHeader(config.withHeader)
        .withValues(config.withValues)
        .withMobilePreferred(config.withMobilePreferred)
        .build()
        .getResult();

    if(config.campaigns){
      // Add snippet to a campaign
      var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition.campaigns)
      var resp = this.getResults(campaignIterator)
      var campaign = resp.entity
      campaign.addSnippet(newSnippet);
    }

    if(config.adGroups){
      // Add snippet to an ad group
      var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition.adGroups)
      var resp = this.getResults(adGroupIterator)
      var adgroup = resp.entity
      adgroup.addSnippet(newSnippet);
    }
  }
  getSnippetsForCampaign(config) {
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    return this.getResults(campaignIterator, {snippets: true})
    /*  .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var snippetsIterator = campaign.extensions().snippets().get();
      while (snippetsIterator.hasNext()) {
        var snippet = snippetsIterator.next();
        Logger.log('Snippet header: ' + snippet.getHeader() +
            ', Snippet values: ' + snippet.getValues() +
            ', mobile preferred: ' + snippet.isMobilePreferred());
      }
      Logger.log(
          'Total count of snippets: ' + snippetsIterator.totalNumEntities());
    }
    */
  }
  getSnippetStats(config) {
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    var resp = this.getResults(campaignIterator, {snippets: {stats: config.dateRange}})
    return resp.snippets
    /*
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      // Retrieve the campaign's snippets. Retrieving an ad group's
      // snippets is similar.
      var snippetsIterator = campaign.extensions().snippets().get();

      while (snippetsIterator.hasNext()) {
        var snippet = snippetsIterator.next();

        // You can also request reports for pre-defined date ranges. See
        // https://developers.google.com/adwords/api/docs/guides/awql,
        // DateRangeLiteral section for possible values.
        var stats = snippet.getStatsFor('LAST_MONTH');
        Logger.log(snippet.getHeader() + ', ' + stats.getClicks() + ', ' +
            stats.getImpressions());
      }
    }
    */
  }
  setSnippetSchedule(config) {
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var snippetsIterator = campaign.extensions().snippets().get();
      var snippet = null;

      // Scan through the snippets to locate the one with header set as Brands.
      while (snippetsIterator.hasNext()) {
        snippet = snippetsIterator.next();
        if (snippet.getHeader() == 'Brands') {
          // Set snippet schedule to run only on Mondays and Tuesdays, 9 AM to
          // 6 PM. You can follow a similar approach to set schedules for other
          // ad extension types.
          var days = []
          for(a in config.schedule)
            days.push({
              dayOfWeek: config.schedule[a].dayOfWeek,
              startHour: config.schedule[a].startHour,
              startMinute: config.schedule[a].startMinute,
              endHour: config.schedule[a].endHour,
              endMinute: config.schedule[a].endMinute
            })

          snippet.setSchedules(days);

          break;
        }
      }
    }
  }
}
