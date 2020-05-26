import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class GoogleAdsEntities extends Own{
  constructor(){

  }

  /*Account Labels******************************************************************************************/
  /************************************************************************************************************************/
  //Create an account label
  createAccountLabels(config) {
    console.log("createAccountLabels:needed: !config.labelName!");
    var labelName = config.labelName;

    var label = AdsManagerApp.createAccountLabel(labelName);
    Logger.log("Label with text = '%s' created.", labelName);
    return label
  }
  //Apply an account label to multiple accounts
  applyAccountLabels(config) {
    console.log("applyAccountLabels:needed: !config.accountIds!, !config.labelName!");
    var accountIds = typeof config.accountIds == "string" ? [config.accountIds] : config.accountIds
    var labelName = config.labelName;

    var accounts = AdsManagerApp.accounts().withIds(accountIds).get();
    while (accounts.hasNext()) {
      var account = accounts.next();
      account.applyLabel(labelName);

      Logger.log('Label with text = "%s" applied to customer id %s.',
                 labelName, account.getCustomerId());
    }
  }
  //Remove an account label from multiple accounts
  removeLabelFromAccounts(config) {
    console.log("removeLabelFromAccounts:needed: !config.accountIds!, !config.labelName!");
    var accountIds = typeof config.accountIds == "string" ? [config.accountIds] : config.accountIds
    var labelName = config.labelName;

    var accounts = AdsManagerApp.accounts().withIds(accountIds).get();
    while (accounts.hasNext()) {
      var account = accounts.next();
      account.removeLabel(labelName);

      Logger.log('Label with text = "%s" removed from customer id %s.',
                 labelName, account.getCustomerId());
    }
  }
  //Select an account by label name
  selectAccountsByLabelName(config) {
    console.log("selectAccountsByLabelName:needed: !config.labelName!");
    var labelName = config.labelName;

    var accountIterator = this.addCondition(AdsManagerApp.accounts(), "LabelIds IN ['" + labelName + "']")
    return this.getResults(accountIterator)
  }
  //Select an account by label ID
  selectAccountsByLabelId(config) {
    console.log("selectAccountsByLabelId:needed: !config.labelId!");
    var labelId = config.labelId;
    var accountIterator = this.addCondition(AdsManagerApp.accounts(), "LabelIds IN ['" + labelId + "']")
    return this.getResults(accountIterator)
  }
  //Retrieve all account labels
  getAllAccountLabels() {
    console.log("getAllAccountLabels: NO ARGUMENT NEEDED")
    var labelIterator = AdsManagerApp.accountLabels().get(), arr = []
    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      arr.push(label)
    }
    return arr
  }
  //Retrieve an account label by its name
  getLabelByName(config) {
    console.log("selectAccountsByLabelName:needed: !config.labelName!");
    var labelName = config.labelName;

    var labelIterator = this.addCondition(AdsManagerApp.accountLabels(), "Name CONTAINS '" + labelName + "'")
    return this.getResults(labelIterator)
  }
  //Retrieve account labels by their IDs
  getLabelById(config) {
    console.log("selectAccountsByLabelName:needed: !config.ids[]!");
    var ids = typeof config.ids == "string" ? [config.ids] : config.ids
    var labelIterator = AdsManagerApp.accountLabels()
        .withIds(ids) // Replace with label IDs here
        .get();
    return this.getResults(labelIterator)
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Accounts******************************************************************************************/
  /************************************************************************************************************************/
  //Get details on the current account
  getCurrentAccountDetails(config) {
    console.log("selectAccountsByLabelName:needed: !config.getStatsFor!");
    var currentAccount = AdsApp.currentAccount();
    Logger.log('Customer ID: ' + currentAccount.getCustomerId() +
        ', Currency Code: ' + currentAccount.getCurrencyCode() +
        ', Timezone: ' + currentAccount.getTimeZone());
    var stats = currentAccount.getStatsFor(config.getStatsFor || 'LAST_MONTH');
    return stats
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Ad Customizers******************************************************************************************/
  /************************************************************************************************************************/
  //Create an ad customizer data source
  createAdCustomizerSource(config) {
    console.log("createAdCustomizerSource:needed: !config.withName''!, !config.addAttribute{type,value}!");
    var a, source = AdsApp.newAdCustomizerSourceBuilder()
        .withName(config.withName)
    for(a in config.addAttribute)
        source.addAttribute(config.addAttribute.type, config.addAttribute.value)
    source.build();
    return source
  }
  //Find an ad customizer data source by name
  getAdCustomizerSource(config) {
    console.log("getAdCustomizerSource:needed: !config.getName''!");
    var sources = AdsApp.adCustomizerSources().get(), arr = []
    while (sources.hasNext()) {
      var source = sources.next();
      if (source.getName() == config.getName) {
        arr.push(source)
        Logger.log(source.getName() + ' ' + source.getAttributes());
      }
    }
    return arr
  }
  //Get a data source's customizer items
  getAdCustomizerItems() {
    console.log("getAdCustomizerItems: NO ARGUMENT NEEDED")
    var source = AdsApp.adCustomizerSources().get().next();
    var items = source.items().get(), arr = []
    while (items.hasNext()) {
      var item = items.next();
      arr.push(item)
      Logger.log(item.getAttributeValues());
    }
    return arr
  }
  //Create ad customizers
  createAdCustomizers(config) {
    console.log("createAdCustomizers:needed: !config.withName''!, !config.addAttribute{type,value}!, !config.withAttributeValue{type,value}!, !config.withTargetKeyword''!");
    var a, source = AdsApp.newAdCustomizerSourceBuilder()
        .withName(config.withName)
    for(a in config.addAttribute)
        source.addAttribute(config.addAttribute.value, config.addAttribute.type)
    source.build().getResult();
    source.adCustomizerItemBuilder()
    for(a in config.withAttributeValue)
        source.withAttributeValue(config.withAttributeValue.type, config.withAttributeValue.value)
    source.withTargetKeyword(config.withTargetKeyword).build();
    return source
  }
  //Create text ad with ad customizers
  setupCustomizedAd(config) {
    console.log("setupCustomizedAd:needed: !config.condition''!, !config.withHeadlinePart1!, !config.withHeadlinePart2!, !config.withDescription!, !config.withFinalUrl!");
    // If you have multiple ad groups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //      .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //      .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition)
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();

      // This ad will try to fill in the blanks using the 'flower' and 'price'
      // attributes from the 'Flower' data source.
      adGroup.newAd().expandedTextAdBuilder()
          .withHeadlinePart1(config.withHeadlinePart1)
          .withHeadlinePart2(config.withHeadlinePart2)
          .withDescription(config.withDescription)
          .withFinalUrl(config.withFinalUrl)
          .build();
    }
    return adGroup
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Ad Groups******************************************************************************************/
  /************************************************************************************************************************/
  //Add an ad group
  addAdGroup(config) {
    console.log("addAdGroup:needed: !config.condition''!, !config.withName!, !config.withCpc!");
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var adGroupOperation = campaign.newAdGroupBuilder()
          .withName(config.withName)
          .withCpc(config.withCpc)
          .build();
    }
  }
  //Update an ad group
  updateAdGroup(config) {
    console.log("updateAdGroup:needed: !config.condition''!, !config.setCpc!");
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition)
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.bidding().setCpc(config.setCpc);
      // update other properties as required here
    }
  }
  //Get all ad groups
  getAlladGroups() {
    console.log("getAlladGroups: NO ARGUMENT NEEDED")
    // AdsApp.adGroups() will return all ad groups that are not removed by
    // default.
    return this.getResults(aAdsApp.adGroups().get())
  }
  //Get an ad group by name
  getAdGroupByName(config) {
    console.log("getAdGroupByName:needed: !config.condition''!");
    return this.getResults(this.addCondition(AdsApp.adGroups(), 'Name = "'+config.condition+'"'))
  }
  //Get an ad group's stats
  getadGroupstats(config) {
    console.log("getadGroupstats:needed: !config.condition''!");
    return this.getResults(this.addCondition(AdsApp.adGroups(), 'Name = "'+config.condition+'"'), {stats: config.dateRange})
  }
  //Pause an ad group
  pauseAdGroup(config) {
    console.log("pauseAdGroup:needed: !config.condition''!");
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition)
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.pause();
      Logger.log('AdGroup with name = ' + adGroup.getName() +
          ' has paused status : ' + adGroup.isPaused());
    }
  }
  //Get an ad group's device bid modifiers
  getAdGroupBidModifiers(config) {
    console.log("getAdGroupBidModifiers:needed: !config.condition''!");
    var arr = [], adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition)
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      Logger.log('AdGroup name: ' + adGroup.getName());
      Logger.log('Mobile bid modifier: ' +
          adGroup.devices().getMobileBidModifier());
      Logger.log('Tablet bid modifier: ' +
          adGroup.devices().getTabletBidModifier());
      Logger.log('Desktop bid modifier: ' +
          adGroup.devices().getDesktopBidModifier());
      arr.push({entity: adGroup, mobile: adGroup.devices().getMobileBidModifier(), tablet: adGroup.devices().getTabletBidModifier(), desktop:adGroup.devices().getDesktopBidModifier()})
    }
    return arr
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Ad Params******************************************************************************************/
  /************************************************************************************************************************/
  //Create text ad with ad parameters for an ad group
  setupAdParamsInAdGroup(config) {
    console.log("setupAdParamsInAdGroup:needed: !config.condition''!, !config.setAdParam[]!, !config.withHeadlinePart1''!, !config.withHeadlinePart2''!, !config.withDescription''!, !config.withFinalUrl''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = [], obj
    while (adGroupIterator.hasNext()) {
      obj = {}
      adGroup = adGroupIterator.next();

      adGroup.newAd().expandedTextAdBuilder()
          .withHeadlinePart1(config.withHeadlinePart1)
          .withHeadlinePart2(config.withHeadlinePart2)
          .withDescription(config.withDescription)
          .withFinalUrl(config.withFinalUrl)
          .build();
      obj.entitys = adGroup
      obj.keywords = []
      var keywordIterator = adGroup.keywords().get();
      if (keywordIterator.hasNext()) {
        keyword = keywordIterator.next();
        // Setup Ad to show as 'Doors open in 5 days, 7 hours!' when searched
        // using this keyword. If the ad is triggered using a keyword
        // without ad param, the ad shows as
        // 'Doors open in a few days, and hours!'
        var i = 1
        for(a in config.setAdParam){
          keyword.setAdParam(i, config.setAdParam[a]);
          i++
        }
        obj.keywords.push(keyword)
      }
      arr.push(obj)
    }
    return arr
  }
  //Get ad parameters for a keyword
  getAdParamsForKeyword(config) {
    console.log("getAdParamsForKeyword:needed: !config.condition''!, !config.keywords.condition[]!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition)
    while (adGroupIterator.hasNext()) {
      adGroup = adGroupIterator.next();
      var keywordIterator = this.addCondition(adGroup.keywords(), config.keywords.condition), arr = []
      if (keywordIterator.hasNext()) {
        keyword = keywordIterator.next();
        var adParamIterator = keyword.adParams().get();
        while (adParamIterator.hasNext()) {
          var adParam = adParamIterator.next();
          arr.push(adParam)
          this.logAdParam(adParam);
        }
      }
    }
    return arr
  }

  logAdParam(adParam) {
    Logger.log('Keyword : ' + adParam.getKeyword().getText());
    Logger.log('MatchType : ' + adParam.getKeyword().getMatchType());
    Logger.log('Index : ' + adParam.getIndex());
    Logger.log('Insertion Text : ' + adParam.getInsertionText());
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Ads******************************************************************************************/
  /************************************************************************************************************************/
  //Add an expanded text ad
  addExpandedTextAd(config) {
    console.log("addExpandedTextAd:needed: !config.condition''!, !config.withHeadlinePart1''!, !config.withHeadlinePart2''!, !config.withDescription''!, !config.withPath1''!, !config.withPath2''!, !config.withFinalUrl''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = []
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var ad = adGroup.newAd().expandedTextAdBuilder()
          .withHeadlinePart1(config.withHeadlinePart1)
          .withHeadlinePart2(config.withHeadlinePart2 || "")
          .withHeadlinePart3(config.withHeadlinePart3 || "")
          .withDescription(config.withDescription)
          .withDescription1(config.withDescription1 || "")
          .withDescription2(config.withDescription2 || "")
          .withFinalUrl(config.withFinalUrl)
          .withPath1(config.withPath1)
          .withPath2(config.withPath2 || "")
          .build();
      // ExpandedTextAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_expandedtextadbuilder
      arr.push({adGroup: adGroup, ad: ad})
    }
    return arr
  }
  //Add an image ad
  addImageAd(config) {
    console.log("addImageAd:needed: !config.condition''!, !config.media.condition''!, !config.withName''!, !config.withDisplayUrl''!, !config.withFinalUrl''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = []
    var mediaIterator = AdsApp.adMedia().media()
        .withCondition(config.media.condition)
        .get();
    while (adGroupIterator.hasNext() && mediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var image = mediaIterator.next();
      var ad = adGroup.newAd().imageAdBuilder()
          .withName(config.withName)
          .withImage(image)
          .withDisplayUrl(config.withDisplayUrl)
          .withFinalUrl(config.withFinalUrl)
          .build();
      // ImageAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_imageadbuilder
      arr.push({adGroup: adGroup, image: image, ad: ad})
    }
    return arr
  }
  //Add an HTML5 ad
  addHtml5Ad(config) {
    console.log("addHtml5Ad:needed: !config.condition''!, !config.media.condition''!, !config.withName''!, !config.withEntryPoint''!, !config.withDimensions''!, !config.withDisplayUrl''!, !config.withFinalUrl''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = []
    var mediaIterator = AdsApp.adMedia().media()
        .withCondition(config.media.condition)
        .get();
    while (adGroupIterator.hasNext() && mediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var mediaBundle = mediaIterator.next();
      var ad = adGroup.newAd().html5AdBuilder()
          .withName(config.withName)
          .withImage(mediaBundle)
          .withEntryPoint(config.withEntryPoint)
          .withDimensions(config.withDimensions)
          .withDisplayUrl(config.withDisplayUrl)
          .withFinalUrl(config.withFinalUrl)
          .build();
      // HTML5AdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_html5adbuilder
      arr.push({adGroup: adGroup, mediaBundle: mediaBundle, ad: ad})
    }
    return arr
  }
  //Add a Gmail image ad
  addGmailImageAd(config) {
    console.log("addGmailImageAd:needed: !config.condition''!, !config.media.condition''!, !config.logo.condition''!, !config.withName''!, !config.withAdvertiser''!, !config.withSubject''!, !config.withDescription''!, !config.withDisplayUrl''!, !config.withFinalUrl''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = []
    var logoMediaIterator = this.addCondition(AdsApp.adMedia().media(), config.logo.condition)
    var imageMediaIterator = this.addCondition(AdsApp.adMedia().media(), config.media.condition)
    while (adGroupIterator.hasNext() &&
        logoMediaIterator.hasNext() &&
        imageMediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var logo = logoMediaIterator.next();
      var image = imageMediaIterator.next();
      var ad = adGroup.newAd().gmailImageAdBuilder()
          .withName(config.withName)
          .withAdvertiser(config.withAdvertiser)
          .withSubject(config.withSubject)
          .withDescription(config.withDescription)
          .withLogo(logo)
          .withImage(image)
          .withFinalUrl(config.withFinalUrl)
          .withDisplayUrl(config.withDisplayUrl)
          .build();
      // GmailImageAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_gmailimageadbuilder
      arr.push({adGroup: adGroup, logo: logo, image: image, ad : ad})
    }
    return arr
  }
  //Add a Gmail single promotion ad
  addGmailSinglePromotionAd(config) {
    console.log("addGmailSinglePromotionAd:needed: !config.condition''!, !config.media.condition''!, !config.logo.condition''!, !config.withName''!, !config.withContent''!, !config.withHeadline''!, !config.withAdvertiser''!, !config.withSubject''!, !config.withDescription''!, !config.withCallToAction''!, !config.withDisplayUrl''!, !config.withFinalUrl''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = []
    var logoMediaIterator = this.addCondition(AdsApp.adMedia().media(), config.logo.condition)
    var imageMediaIterator = this.addCondition(AdsApp.adMedia().media(), config.media.condition)
    if (adGroupIterator.hasNext() &&
        logoMediaIterator.hasNext() &&
        imageMediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var logo = logoMediaIterator.next();
      var image = imageMediaIterator.next();
      var ad = adGroup.newAd().gmailSinglePromotionAdBuilder()
          .withName(config.withName)
          .withContent(config.withContent)
          .withHeadline(config.withHeadline)
          .withAdvertiser(config.withAdvertiser)
          .withSubject(config.withSubject)
          .withDescription(config.withDescription)
          .withCallToAction(config.withCallToAction)
          .withLogo(logo)
          .withImage(image)
          .withFinalUrl(config.withFinalUrl)
          .withDisplayUrl(config.withDisplayUrl)
          .build();
      // GmailSinglePromotionAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_gmailsinglepromotionadbuilder
      arr.push({adGroup: adGroup, logo: logo, image: image, ad: ad})
    }
    return arr
  }
  //Add a Gmail multi-product ad
  addGmailMultiProductAd(config) {
    console.log("addGmailMultiProductAd:needed: !config.condition''!, !config.media.condition''!, !config.logo.condition''!, !config.withName''!, !config.withHeadline''!, !config.withAdvertiser''!, !config.withSubject''!, !config.withDescription''!, !config.withItemImages''!, !config.withItemButtonCallsToAction''!, !config.withItemButtonFinalUrls''!, !config.withItemTitles''!, !config.withDisplayUrl''!, !config.withFinalUrl''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = []
    var logoMediaIterator = this.addCondition(AdsApp.adMedia().media(), config.logo.condition)
    var imageMediaIterator = this.addCondition(AdsApp.adMedia().media(), config.media.condition)
    while (adGroupIterator.hasNext() &&
        logoMediaIterator.hasNext() &&
        itemImageMediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var logo = logoMediaIterator.next();
      var item1Image = itemImageMediaIterator.next();
      var ad = adGroup.newAd().gmailMultiProductAdBuilder()
          .withName(config.withName)
          .withHeadline(config.withHeadline)
          .withAdvertiser(config.withAdvertiser)
          .withSubject(config.withSubject)
          .withDescription(config.withDescription)
          .withLogo(logo)
          .withItemImages([item1Image])
          .withItemTitles(config.withItemTitles)
          .withItemButtonCallsToAction(config.withItemButtonCallsToAction
          .withItemButtonFinalUrls(config.withItemButtonFinalUrls)
          .withFinalUrl(config.withFinalUrl)
          .withDisplayUrl(config.withDisplayUrl)
          .build();
      // GmailMultiProductAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_gmailmultiproductadbuilder
      arr.push({adGroup: adGroup, logo: logo, ad: ad, item: item1Image})
    }
    return arr
  }
//**********************
  //Add a responsive display ad
  // You create responsive display ads in two steps:
  //   1. Create or retrieve assets (marketing images, square marketing images,
  //      optional logos, optional landscape logos, and optional YouTube videos)
  //   2. Create the ad.
  //
  // The following assumes you have not already created named assets.
  addResponsiveDisplayAd(config) {
    console.log("addResponsiveDisplayAd:needed: !config.condition''!, !config.withBusinessName''!, !config.withDescriptions[]!, !config.withHeadlines[]!, !config.withFinalUrl''!, !config.buildImageAsset''!, !config.addMarketingImage.alt''!, !config.addMarketingImage.url''!, !config.addSquareMarketingImage.alt''!, !config.addSquareMarketingImage.url''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = []

    // If you have already created named image assets, select them like this:
    //
    // var marketingImages = [];
    // var marketingImageIterator = AdsApp.adAssets()
    //     .assets()
    //     .withCondition('Name IN ["INSERT_FIRST_ASSET_NAME_HERE",
    //                              "INSERT_SECOND_ASSET_NAME_HERE"]')
    //     .get();
    // while (marketingImageIterator.hasNext()) {
    //   marketingImages.push(marketingImageIterator.next());
    // }
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var adGroupBuilder = adGroup.newAd()
          .responsiveDisplayAdBuilder()
          .withBusinessName(config.withBusinessName)
          .withFinalUrl(config.withFinalUrl)
          .withHeadlines(config.withHeadlines)
          .withDescriptions(config.withDescriptions);

      // If you selected assets with a snippet as shown above, then provide those
      // assets here like this:
      //
      // adGroupBuilder = adGroupBuilder.withMarketingImages(marketingImages);

      var ad = adGroupBuilder
          .addMarketingImage(
              buildImageAsset(config.addMarketingImage.alt, config.addMarketingImage.url))
          .addSquareMarketingImage(
              buildImageAsset(config.addSquareMarketingImage.alt, config.addSquareMarketingImage.url))
          .build();
      arr.push(ad)
      // ResponsiveDisplayAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_responsivedisplayadbuilder
    }
    return arr
  }

  buildImageAsset(assetName, imageUrl) {
    var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
    return AdsApp.adAssets().newImageAssetBuilder()
        .withData(imageBlob)
        .withName(assetName)
        .build()
        .getResult();
  }
//**********************
  //Pause ads in an ad group
  pauseAdsInAdGroup(config) {
    console.log("pauseAdsInAdGroup:needed: !config.condition''!");
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = [], obj
    while (adGroupIterator.hasNext()) {
      obj = {}
      var adGroup = adGroupIterator.next();
      var adsIterator = adGroup.ads().get();
      obj.entity = adGroup
      obj.ads = []
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next();
        obj.ads.push(ad)
        ad.pause();
      }
      arr.push(obj)
    }
    return arr
  }
//**********************
  //Get expanded text ads in an ad group
  getExpandedTextAdsInAdGroup(config) {
    console.log("getExpandedTextAdsInAdGroup:needed: !config.condition''!");
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = [], obj
    while (adGroupIterator.hasNext()) {
      obj = {}
      var adGroup = adGroupIterator.next();
      var adsIterator = this.addCondition(adGroup.ads(), 'Type=EXPANDED_TEXT_AD')
      obj.entity = adGroup
      obj.ads = []
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next().asType().expandedTextAd();
        this.logExpandedTextAd(ad);
        obj.ads.push(ad)
      }
      arr.push(obj)
    }
    return arr
  }

  logExpandedTextAd(expandedTextAd) {
    Logger.log('Headline part 1 : ' + expandedTextAd.getHeadlinePart1());
    Logger.log('Headline part 2 : ' + expandedTextAd.getHeadlinePart2());
    Logger.log('Description : ' + expandedTextAd.getDescription());
    Logger.log('Path 1 : ' + expandedTextAd.getPath1());
    Logger.log('Path 2 : ' + expandedTextAd.getPath2());
    Logger.log('Final URL : ' + expandedTextAd.urls().getFinalUrl());
    Logger.log('Mobile final URL : ' + expandedTextAd.urls().getFinalUrl());
    Logger.log('Final URL : ' + expandedTextAd.urls().getMobileFinalUrl());
    Logger.log('Tracking template : ' +
        expandedTextAd.urls().getTrackingTemplate());
    Logger.log('Custom parameters : ' +
        expandedTextAd.urls().getCustomParameters());
    Logger.log('Approval Status : ' +
        expandedTextAd.getApprovalStatus());
    Logger.log('Enabled : ' + expandedTextAd.isEnabled());
  }
//**********************
//**********************
  //Get text ads in an ad group
  getTextAdsInAdGroup(config) {
    console.log("getTextAdsInAdGroup:needed: !config.condition''!");
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = [], obj
    if (adGroupIterator.hasNext()) {
      obj = {}
      var adGroup = adGroupIterator.next();
      // You can filter for ads of a particular type, using the AdType selector.
      // See https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_adselector#withCondition_1
      // for possible values.

      var adsIterator = adGroup.ads().withCondition('Type=TEXT_AD').get();
      obj.entity = adGroup
      obj.ads = []
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next();
        this.logAd(ad);
        obj.ads.push(ad)
      }
      arr.push(obj)
    }
    return arr
  }

  logAd(ad) {
    Logger.log('Headline : ' + ad.getHeadline());
    Logger.log('Line1 : ' + ad.getDescription1());
    Logger.log('Line2 : ' + ad.getDescription2());
    Logger.log('Final URL : ' + ad.urls().getFinalUrl());
    Logger.log('Display URL : ' + ad.getDisplayUrl());
    Logger.log('Approval Status : ' + ad.getApprovalStatus());
    Logger.log('Mobile preferred : ' + ad.isMobilePreferred());
    Logger.log('Enabled : ' + ad.isEnabled());
  }
//**********************
  //Get stats for ads in an ad group
  getAdStats(config) {
    console.log("getAdStats:needed: !config.condition''!, !config.dateRange''!");
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = [], obj
    while (adGroupIterator.hasNext()) {
      obj = {}
      var adGroup = adGroupIterator.next();
      // If you want to restrict your search to some ads only, then you could
      // apply a label and retrieve ads as
      //
      //   var label = AdsApp.labels()
      //             .withCondition('Name="INSERT_LABEL_NAME_HERE"')
      //             .get()
      //             .next();
      //   var adsIterator = label.ads().get();

      var adsIterator = adGroup.ads().get();
      obj.entity = adGroup
      obj.ads = []
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next();
        // You can also request reports for pre-defined date ranges. See
        // https://developers.google.com/adwords/api/docs/guides/awql,
        // DateRangeLiteral section for possible values.
        var stats = ad.getStatsFor(config.dateRange);
        Logger.log(adGroup.getName() + ', ' +
            stats.getClicks() + ', ' + stats.getImpressions());
        obj.ads.push(ad)
      }
      arr.push(obj)
    }
    return arr
  }
//**********************
  //Get legacy responsive display ads in an ad group
  getResponsiveDisplayAdsInAdGroup(config) {
    // Responsive display ads can include multiple text and multiple media assets
    // in the ad, while legacy responsive display ads cannot. Use a condition
    // 'Type = "MULTI_ASSET_RESPONSIVE_DISPLAY_AD"' to select the former and
    // condition 'Type = "LEGACY_RESPONSIVE_DISPLAY_AD"' to select the
    // latter. 'Type = "RESPONSIVE_DISPLAY_AD"' will also select legacy responsive
    // display ads, but the syntax is deprecated.
    //
    // When an ad iterator includes both responsive display ads and legacy
    // responsive display ads, use the ad.isLegacy() method to determine the style
    // of the ad.
    console.log("getResponsiveDisplayAdsInAdGroup:needed: !config.condition''!, !config.dateRange''!");
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config.condition), arr = [], obj
    while (adGroupIterator.hasNext()) {
      obj = {}
      var adGroup = adGroupIterator.next();
      var adsIterator = adGroup.ads()
          .withCondition('Type IN ["MULTI_ASSET_RESPONSIVE_DISPLAY_AD",
                                   "LEGACY_RESPONSIVE_DISPLAY_AD"]')
          .get();
      obj.entity = adGroup
      obj.ads = []
      obj.isLegacy = []
      obj.isNotLegacy = []
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next().asType().responsiveDisplayAd();
        obj.ads.push(ad)
        if (ad.isLegacy()) {
          this.logLegacyResponsiveDisplayAd(ad);
          obj.isLegacy.push(ad)
        } else {
          this.logResponsiveDisplayAd(ad);
          obj.isNotLegacy.push(ad)
        }
      }
      arr.push(obj)
    }
    return arr
  }

  logLegacyResponsiveDisplayAd(ad) {
    Logger.log('Long headlines : ' + ad.getLongHeadline());
    Logger.log('Short headline : ' + ad.getShortHeadline());
    Logger.log('Description : ' + ad.getDescription());
    Logger.log('Business name : ' + ad.getBusinessName());
    Logger.log('Marketing image : ' + ad.getMarketingImage().getName());
    Logger.log('Logo image : ' + ad.getLogoImage().getName());
    Logger.log('Approval status : ' + ad.getApprovalStatus());
    Logger.log('Enabled : ' + ad.isEnabled());
  }

  logResponsiveDisplayAd(ad) {
    Logger.log('Long headline : ' + ad.getLongHeadline());
    this.logTextAssets('Short headline ', ad.getHeadlines());
    this.logTextAssets('Description ', ad.getDescriptions());
    Logger.log('Business name : ' + ad.getBusinessName());
    this.logImageAssets('Marketing image ', ad.getMarketingImages());
    this.logImageAssets('Square marketing image ', ad.getSquareMarketingImages());
    this.logImageAssets('Logo image ', ad.getLogoImages());
    this.logImageAssets('Landscape logo image ', ad.getLandscapeLogoImages());
    this.logYouTubeAssets('YouTube video ', ad.getYouTubeVideos());
    Logger.log('Approval status : ' + ad.getApprovalStatus());
    Logger.log('Enabled : ' + ad.isEnabled());
  }

  logTextAssets(prefix, assetArray) {
    for (var i = 0; i < assetArray.length; i++) {
      Logger.log(prefix + i + ' : ' + assetArray[i].text);
    }
  }

  logImageAssets(prefix, assetArray) {
    for (var i = 0; i < assetArray.length; i++) {
      Logger.log(prefix + i + ' : ' + assetArray[i].getName());
    }
  }

  logYouTubeAssets(prefix, assetArray) {
    for (var i = 0; i < assetArray.length; i++) {
      Logger.log(prefix + i + ' : ' + assetArray[i].getYouTubeVideoId());
    }
  }
//**********************
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Bidding******************************************************************************************/
  /************************************************************************************************************************/
  //Get bidding strategies
  getBiddingStrategies() {
    console.log("getBiddingStrategies: NO ARGUMENT NEEDED !");
    var biddingStrategies = AdsApp.biddingStrategies().get(), arr = []
    while (biddingStrategies.hasNext()) {
      var biddingStrategy = biddingStrategies.next();
      arr.push(biddingStrategy)
      Logger.log('Bidding strategy with id = %s, name = %s and type = ' +
          '%s was found.', biddingStrategy.getId().toFixed(0),
          biddingStrategy.getName(), biddingStrategy.getType());
    }
    return arr
  }
  //Get bidding strategy by name
  getBiddingStrategyStatsByName(config) {
    console.log("getBiddingStrategyStatsByName:needed: !config.condition''!");
    var biddingStrategies = this.addCondition(AdsApp.biddingStrategies(), config.condition), arr = []
    while (biddingStrategies.hasNext()) {
      var biddingStrategy = biddingStrategies.next();
      arr.push(biddingStrategy)
    }
    return arr
  }
  //Get bidding strategy stats by name
  getBiddingStrategyStatsByName(config) {
    console.log("getBiddingStrategyStatsByName:needed: !config.condition''!, !config.dateRange''!");
    var biddingStrategies = this.addCondition(AdsApp.biddingStrategies(), config.condition)
    return this.getResults(biddingStrategies, {stats: config.dateRange})
  }
  //Set campaign bidding strategy
  setCampaignBiddingStrategy(config) {
    console.log("setCampaignBiddingStrategy:needed: !config.condition''!, !config.setStrategy''!");
    var campaignSel = this.addCondition(AdsApp.campaigns(), config.condition)
    var campaign = campaignSel.next()

    // You may also set a flexible bidding strategy for the campaign
    // using the setStrategy() method. Use the
    // AdsApp.biddingStrategies() method to retrieve flexible bidding
    // strategies in your account.
    campaign.bidding().setStrategy(config.setStrategy || 'MANUAL_CPM');
    return campaign
  }
  //Clear ad group bidding strategy
  clearAdGroupBiddingStrategy(config) {
    console.log("clearAdGroupBiddingStrategy:needed: !config.condition''!");
    var adGroupSel = this.addCondition(AdsApp.adGroups(), config.condition)
    var adGroup = adGroupSel.next();
    adGroup.bidding().clearStrategy();
    return adGroup
  }
  //Set an ad group's default CPC bid
  setAdGroupDefaultCpcBid(config) {
    console.log("setAdGroupDefaultCpcBid:needed: !config.condition''!, !config.setCpc''!");
    var adGroupSel = this.addCondition(AdsApp.adGroups(), config.condition)
    var adGroup = adGroupSel.next();

    // This bid will only be used for auction if a corresponding cpc
    // bidding strategy is set to the ad group. E.g.
    //
    // adGroup.bidding().setStrategy('MANUAL_CPC');
    adGroup.bidding().setCpc(config.setCpc);
    return adGroup
  }
  //Set a keyword's CPC bid
  setKeywordCpcBid(config) {
    console.log("setKeywordCpcBid:needed: !config.condition''!, !config.setCpc''!");
    var keywordSel = this.addCondition(AdsApp.keywords(), config.condition)
    var keyword = keywordSel.next();

    // This bid will only be used for auction if a corresponding cpc
    // bidding strategy is set to the parent ad group. E.g.
    //
    // adGroup.bidding().setStrategy('MANUAL_CPC');
    keyword.bidding().setCpc(config.setCpc);
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Budget Orders******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve base spending limit of budget order
  getBaseSpendingLimit() {
    console.log("getBaseSpendingLimit: NO ARGMENT NEEDED !");
    var budgetOrderIterator = AdsApp.budgetOrders().get(), arr = [];
    while (budgetOrderIterator.hasNext()) {
      var budgetOrder = budgetOrderIterator.next();
      var limitText = "";
      if (budgetOrder.getSpendingLimit() == null) {
        limitText = "unlimited";
      } else if (budgetOrder.getTotalAdjustments() == null) {
        limitText = budgetOrder.getSpendingLimit();
      } else {
        limitText = budgetOrder.getSpendingLimit() - budgetOrder.getTotalAdjustments();
      }
      Logger.log("Budget Order [" + budgetOrder.getName() +
          "] base spending limit: " + limitText);
      arr.push({budgetOrder: budgetOrder, limitText: limitText})
    }
    return arr
  }
  //Retrieve the active budget order
  getActiveBudgetOrder() {
    console.log("getActiveBudgetOrder: NO ARGMENT NEEDED !");
    // There will only be one active budget order at any given time.
    var budgetOrderIterator = AdsApp.budgetOrders()
        .withCondition('status="ACTIVE"')
        .get(), arr = [];
    while (budgetOrderIterator.hasNext()) {
      var budgetOrder = budgetOrderIterator.next();
      Logger.log("Budget Order [" + budgetOrder.getName() +
          "] is currently active.");
      arr.push(budgetOrder)
    }
    return arr
  }
  //Retrieve all budget orders
  getAllBudgetOrders() {
    console.log("getAllBudgetOrders: NO ARGMENT NEEDED !");
    var budgetOrderIterator = this.addCondition(AdsApp.budgetOrders().get()), arr = [];
    return this.getResults(budgetOrderIterator)
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Budgets******************************************************************************************/
  /************************************************************************************************************************/
  //Set campaign budget
  setCampaignBudget(config) {
    console.log("setCampaignBudget:needed: !config.condition''!, !config.setAmount''!");
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition), arr = []
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.getBudget().setAmount(config.setAmount);
      Logger.log('Campaign with name = ' + campaign.getName() +
          ' has budget = ' + campaign.getBudget().getAmount());
      arr.push(campaign)
    }
    return arr
  }
  //Get campaign budget
  getBudgetDetails(config) {
    console.log("getBudgetDetails:needed: !config.condition''!");
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition), arr = [], obj
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var budget = campaign.getBudget();
      var budgetCampaignIterator = budget.campaigns().get();

      Logger.log('Budget amount : ' + budget.getAmount());
      Logger.log('Delivery method : ' + budget.getDeliveryMethod());
      Logger.log('Explicitly shared : ' + budget.isExplicitlyShared());
      Logger.log('Associated campaigns : ' +
          budgetCampaignIterator.totalNumEntities());
      Logger.log('Details');
      Logger.log('=======');

      // Get all the campaigns associated with this budget. There could be
      // more than one campaign if this is a shared budget.

      obj = {campaign: campaign, bidget: budget, budgetCampaignIterator: budgetCampaignIterator}
      obj.associatedCampaign = []
      while (budgetCampaignIterator.hasNext()) {
        var associatedCampaign = budgetCampaignIterator.next();
        Logger.log(associatedCampaign.getName());
        obj.associatedCampaign.push(associatedCampaign.getName())
      }
      arr.push(obj)
    }
    return arr
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Campaigns******************************************************************************************/
  /************************************************************************************************************************/
  //Get all campaigns
  getAllCampaigns() {
    console.log("getAllCampaigns: NO ARGMENT NEEDED !");
    // AdsApp.campaigns() will return all campaigns that are not removed by
    // default.
    return this.addCondition(AdsApp.campaigns(), true)
  }
//******************
  //Get a campaign by name
  getCampaignsByName(config) {
    console.log("getCampaignsByName:needed: !config.condition''!");
    return this.addCondition(AdsApp.campaigns(), 'Name = "'+config.condition+'"', true)
  }
  formatDate(date) {
    zeroPad(number) { return Utilities.formatString('%02d', number); }
    return (date == null) ? 'None' : zeroPad(date.year) + zeroPad(date.month) +
        zeroPad(date.day);
  }
//******************
  //Get a campaign's stats
  getCampaignStats(config) {
    console.log("getCampaignStats:needed: !config.condition''!");
    return this.addCondition(AdsApp.campaigns(), config.condition, {stats: config.datRange})
  }
  //Pause a campaign
  pauseCampaign(config) {
    console.log("pauseCampaign:needed: !config.condition''!");
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config.condition)
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.pause();
    }
  }
  //Get a campaign's device bid modifiers
  getCampaignBidModifiers(config) {
    console.log("getCampaignBidModifiers:needed: !config.condition''!\noptionnally: config.platforms{}");
    return this.addCondition(AdsApp.campaigns(), config.condition, {platforms: config.platforms || true})
  }
  //
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Display******************************************************************************************/
  /************************************************************************************************************************/
  //Add a placement to an existing ad group
  addPlacementToAdGroup(config) {
    console.log("addPlacementToAdGroup:needed: !config.condition''!, !config.withUrl''!\noptionnally: config.withCpc(int)");
    var adGroupIte = this.addCondition(AdsApp.adGroups(), config.condition)
    var adGroup = adGroupIte.next();

    // Other display criteria can be built in a similar manner using the
    // corresponding builder method in the AdsApp.Display,
    // AdsApp.CampaignDisplay or AdsApp.AdGroupDisplay class.
    var placementOperation = adGroup.display()
        .newPlacementBuilder()
        .withUrl(config.withUrl)  // required
        .withCpc(config.withCpc)  // optional
        .build();
    var placement = placementOperation.getResult();
    Logger.log('Placement with id = %s and url = %s was created.',
        placement.getId(), placement.getUrl());
    return placement
  }
  //Retrieve all topics in an existing ad group
  getAllTopics(config) {
    console.log("getAllTopics:needed: !config.condition''!, !config.topics{condition,forDateRange,orderBy}''!");
    var adGroupIte = this.addCondition(AdsApp.adGroups(), config), arr = []
    var adGroup = adGroupIte.next();

    // Other display criteria can be retrieved in a similar manner using
    // the corresponding selector methods in the AdsApp.Display,
    // AdsApp.CampaignDisplay or AdsApp.AdGroupDisplay class.
    var topicIterator = this.addCondition(AdsApp.display().topics(), config.topics)

    while (topicIterator.hasNext()) {
      var topic = topicIterator.next();
      arr.push(topic)

      // The list of all topic IDs can be found on
      // https://developers.google.com/adwords/api/docs/appendix/verticals
      Logger.log('Topic with criterion id = %s and topic id = %s was ' +
          'found.', topic.getId().toFixed(0),
           topic.getTopicId().toFixed(0));
    }
    return arr
  }
  //Get stats for all audiences in an existing ad group
  getAudienceStats(config) {
    console.log("getAudienceStats:needed: !config.condition''!, !config.audiences{condition,forDateRange,orderBy}''!");
    var adGroupIte = this.addCondition(AdsApp.adGroups(), config), arr = [], obj = {}
    var adGroup = adGroupIte.next();

    // Other display criteria can be retrieved in a similar manner using
    // the corresponding selector methods in the AdsApp.Display,
    // AdsApp.CampaignDisplay or AdsApp.AdGroupDisplay class.
    var audienceIterator = adGroup.display()
        .audiences()
        .get();

    Logger.log('ID, Audience ID, Clicks, Impressions, Cost');
    obj.entity = adGroup
    obj.audiences = []
    while (audienceIterator.hasNext()) {
      var audience = audienceIterator.next();
      var stats = audience.getStatsFor(config.audiences.dateRange);
      obj.audiences.push({entity: audience, stats: stats})

      // User List IDs (List IDs) are available on the details page of
      // a User List (found under the Audiences section of the Shared
      // Library)
      Logger.log('%s, %s, %s, %s, %s', audience.getId().toFixed(0),
         audience.getAudienceId(), stats.getClicks(),
         stats.getImpressions(), stats.getCost());
       arr.push(obj)
    }
    return arr
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Drafts and Experiments******************************************************************************************/
  /************************************************************************************************************************/
  //Create a draft campaign
  createDraft(config) {
    console.log("createDraft:needed: !config.condition''!, !config.withName''!");
    var campaignIte = this.addCondition(AdsApp.campaigns(), config), arr = [], obj = {}
    var campaign = adGroupIte.next();

    var draftBuilder = campaign.newDraftBuilder()
        .withName(config.withName)
        .build();

    var draft = draftBuilder.getResult();
    return draft
  }
  //Get draft campaigns
  getDrafts() {
    console.log("getDrafts: NO ARGMENT NEEDED !");
    // Get all drafts.
    return this.addCondition(AdsApp.drafts(), true)
  }
  // Get a specific draft.
  getDraftsByName(config) {
    console.log("getDraftsByName:needed: !config.condition''!");
    return this.addCondition(AdsApp.drafts(), "DraftName = '"+config+"'", true)
  }
  //Create an experiment
  createExperiment() {
    console.log("createExperiment:needed: !config.condition''!, !config.withName''!, !config.withTrafficSplitPercent''!");
    var draftIte = this.addCondition(AdsApp.drafts(), "DraftName = '"+config+"'")
    var draft = draftIte.next();

    var experimentBuilder = draft.newExperimentBuilder();

    experimentBuilder.withName(config.withName)
        .withTrafficSplitPercent(config.withTrafficSplitPercent)
        .startBuilding();
    return experimentBuilder
  }
  //Get experiments
  getExperiments() {
    console.log("getExperiments: NO ARGMENT NEEDED !");
    // Get all experiments.
    return this.addCondition(AdsApp.experiments(), true);
  }
  // Get specific experiment.
  getExperimentsByName() {
    console.log("getExperimentsByName:needed: !config.condition''!");
    return this.addCondition(AdsApp.experiments(), "Name = '"+config+"'", true)
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Excluded Placement Lists******************************************************************************************/
  /************************************************************************************************************************/
  //Show all the shared excluded placements in an excluded placement list
  showAllExcludedPlacementsFromList(config) {
    console.log("showAllExcludedPlacementsFromList:needed: !config.condition''!");
    var EXCLUDED_PLACEMENT_LIST_NAME = config.condition, arr = [], obj;

    var excludedPlacementListIterator = this.addCondition(AdsApp.excludedPlacementLists(), 'Name = "' + EXCLUDED_PLACEMENT_LIST_NAME + '"')

    while (excludedPlacementListIterator.hasNext()){
      var excludedPlacementList = excludedPlacementListIterator.next();
      var sharedExcludedPlacementIterator = excludedPlacementList.excludedPlacements().get();

      obj = {}
      obj.excludedPlacementList = excludedPlacementList
      obj.sharedExcludedPlacement = []
      while (sharedExcludedPlacementIterator.hasNext()) {
        var sharedExcludedPlacement = sharedExcludedPlacementIterator.next();
        Logger.log(sharedExcludedPlacement.getUrl());
        obj.sharedExcludedPlacement.push(sharedExcludedPlacement)
      }
      arr.push(obj)
    }
    return arr
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Keywords******************************************************************************************/
  /************************************************************************************************************************/
  //Add a keyword to an existing ad group
  addKeyword(config) {
    console.log("addKeyword:needed: !config.condition''!, !config.withName''!, !config.withCpc''!, !config.withFinalUrl''!");
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    return this.addCondition(AdsApp.adGroups(), config, {action: {type: "add", entityType: "keyword", config: config}})
  }
  //Pause an existing keyword in an ad group
  pauseKeywordInAdGroup() {
    console.log("pauseKeywordInAdGroup:needed: !config.condition''!, !config.keyword.condition''!");
    //return this.addCondition(AdsApp.adGroups(), config, {action: {type: "pause", value: "keyword", config: config}})
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config)
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var keywordIterator = this.addCondition(adGroup.keywords(), config.keyword.condition, {action: {type: "pause", entityType: "keyword"}})
    }
  }
//******************
  //Get all keywords in an ad group
  getKeywordsInAdGroup(config) {
    console.log("getKeywordsInAdGroup:needed: !config.condition''(AdGroupName)!");
    return this.addCondition(AdsApp.keywords(), 'AdGroupName = "'+config+'"', true)
  }
/*
  formatKeyword(keyword) {
    return 'Text : ' + keyword.getText() + '\n' +
        'Match type : ' + keyword.getMatchType() + '\n' +
        'CPC : ' + keyword.bidding().getCpc() + '\n' +
        'Final URL : ' + keyword.urls().getFinalUrl() + '\n' +
        'Approval Status : ' + keyword.getApprovalStatus() + '\n' +
        'Enabled : ' + keyword.isEnabled() + '\n';
  }
*/
//******************
  //Get stats for all keywords in an ad group
  getKeywordStats(config) {
    console.log("getKeywordStats:needed: !config.condition''!, !config.dateRange''!");
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config), arr = [], obj
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var keywordIterator = adGroup.keywords().get();
      arr.push(this.getResults(keywordIterator, {stats: config.dateRange}))
    }
    return arr
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Labels******************************************************************************************/
  /************************************************************************************************************************/
  //Get all labels from a user's account
  getAllLabels() {
    console.log("getAllLabels: NO ARGMENT NEEDED !");
    return this.addCondition(AdsApp.labels(), true)
  }
  //Get a label by name
  getLabelsByName(config) {
    console.log("getLabelsByName:needed: !config.condition''(LabelName)!, !config.labelName!");
    return this.addCondition(AdsApp.labels(), 'Name = "'+config+'"', true)
  }
  //Apply a label to a campaign
  applyLabel(config) {
    console.log("applyLabel:needed: !config.condition''(LabelName)!, !config.labelName!");
    // Retrieve a campaign, and apply a label to it. Applying labels to other
    // object types are similar.
    return this.addCondition(AdsApp.campaigns(), config, {action: {type: "applyLabel", config: config}})
  }
  //Remove a label from a campaign
  removeLabel() {
    console.log("removeLabel:needed: !config.condition''(LabelName)!, !config.labelName!");
    return this.addCondition(AdsApp.campaigns(), config, {action: {type: "removeLabel", config: config}})
  }
  //Remove a label from the user's account
  removeLabel() {
    console.log("removeLabel:needed: !config.condition''(LabelName)!, !config.labelName!");
    return this.addCondition(AdsApp.labels(), config, {action: {type: "remove", config: config}})
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Negative Keyword Lists******************************************************************************************/
  /************************************************************************************************************************/
  //Construct a new negative keyword list and add it to a campaign
  addNegativeKeywordListToCampaign(config) {
    console.log("addNegativeKeywordListToCampaign:needed: !config.keywordListName''(LabelName)!, !config.campaignName!, !config.addNegativeKeywords[]!");
    var NEGATIVE_KEYWORD_LIST_NAME = config.keywordListName;
    var CAMPAIGN_NAME = config.campaignName;

    var negativeKeywordListOperator =
        AdsApp.newNegativeKeywordListBuilder()
            .withName(NEGATIVE_KEYWORD_LIST_NAME)
            .build();

    if (negativeKeywordListOperator.isSuccessful()) {
      var negativeKeywordList = negativeKeywordListOperator.getResult();
      negativeKeywordList.addNegativeKeywords(config.addNegativeKeywords);

      var campaign = this.addCondition(AdsApp.campaigns(), config || 'Name = "' + CAMPAIGN_NAME + '"')
      campaign.addNegativeKeywordList(negativeKeywordList);
    } else {
      Logger.log('Could not add Negative Keyword List.');
    }
  }
  //Remove all the shared negative keywords in an negative keyword list
  removeAllNegativeKeywordsFromList(config) {
    console.log("removeAllNegativeKeywordsFromList:needed: !config.keywordListName''(LabelName)!");
    var NEGATIVE_KEYWORD_LIST_NAME = config.keywordListName;

    var negativeKeywordListIterator = this.addCondition(AdsApp.negativeKeywordLists(), 'Name = "' + NEGATIVE_KEYWORD_LIST_NAME + '"')

    if (negativeKeywordListIterator.totalNumEntities() == 1) {
      var negativeKeywordList = negativeKeywordListIterator.next();
      var sharedNegativeKeywordIterator =
          negativeKeywordList.negativeKeywords().get();

      var sharedNegativeKeywords = [];

      while (sharedNegativeKeywordIterator.hasNext()) {
        sharedNegativeKeywords.push(sharedNegativeKeywordIterator.next());
      }

      for (var i = 0; i < sharedNegativeKeywords.length; i++) {
        sharedNegativeKeywords[i].remove();
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Negative Keywords******************************************************************************************/
  /************************************************************************************************************************/
  //Add negative keyword to a campaign
  addNegativeKeywordToCampaign(config) {
    console.log("addNegativeKeywordToCampaign:needed: !config.campaignName''!, !config.negativeKeyword''");
    var campaignIterator = this.addCondition(AdsApp.campaigns(), config || 'Name = "'+config.campaignName+'"')
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.createNegativeKeyword(config.negativeKeyword);
    }
  }
  //Get negative keywords in a campaign
  getNegativeKeywordForCampaign(config) {
    console.log("getNegativeKeywordForCampaign:needed: !config.campaignName''!, !config.negativeKeywords''");
    return this.addCondition(AdsApp.campaigns(), config || 'Name = "'+config.campaignName+'"', {negativeKeywords: true})
  }
  //Add a negative keyword to an ad group
  addNegativeKeywordToAdGroup() {
    console.log("addNegativeKeywordToAdGroup:needed: !config.condition''!, !config.negativeKeyword''");
    // If you have multiple ad groups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = this.addCondition(AdsApp.adGroups(), config)
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.createNegativeKeyword(config.negativeKeyword);
    }
  }
  //Get negative keywords in an ad group
  getNegativeKeywordForAdGroup() {
    console.log("getNegativeKeywordForAdGroup:needed: !config.campaignName''!, !config.negativeKeywords''");
    // If you have multiple ad groups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    return this.addCondition(AdsApp.adGroups(), config, {negativeKeywords: true})
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Search Audiences******************************************************************************************/
  /************************************************************************************************************************/
  //Add search audience to an ad group
  addSearchAudienceToAdGroup(config) {
    console.log("addSearchAudienceToAdGroup:needed: !config.condition''!, !config.audienceListId'', !config.bidModifier'', !config.searchAdGroupAudience||searchCampaignAudience''\noptionnally: config.campaignName, config.adgroupName");

    var action = {action: {type: "add", entityType: "audience", config: config}}

    // Retrieve the ad group.
    return this.addCondition(
      AdsApp.adGroups(),
      config,
      action
    )
  }
  //Get ad group search audience by name
  getAdGroupSearchAudienceByName(config) {
    console.log("getAdGroupSearchAudienceByName:needed: !config.condition''||(config.campaignName''&&config.adGroupName''&&config.userListName'')!");
    var CAMPAIGN_NAME = config.campaignName
    var ADGROUP_NAME = config.adGroupName
    var AUDIENCE_NAME = config.userListName
    config.searchAdGroupAudience = true

    // Retrieve the search audience.
    return this.addCondition(
      AdsApp.adGroupTargeting().audiences(),
      config || [
        'CampaignName = ' + CAMPAIGN_NAME,
        'AdGroupName = ' + ADGROUP_NAME,
        'UserListName = "' + AUDIENCE_NAME + '"'
      ],
      config
    )
  }
  //Filter ad group search audience by stats
  filterAdGroupAudienceByStats(config) {
    console.log("filterAdGroupAudienceByStats:needed: !config.condition''||(config.campaignName''&&config.adGroupName'')!||!config.dateRange!");

    // Retrieve top performing search audiences.
    return this.addCondition(
      AdsApp.adGroupTargeting().audiences(),
      config,
      {stats: config.dateRange || 'THIS_MONTH'}
    )
  }
  //Exclude search audience from a campaign
  addExcludedAudienceToCampaign(config) {
    console.log("addExcludedAudienceToCampaign:needed: !config.condition''!");
    var action = {action: {type: "add", entityType: "audience", actionType: "exclude", config: config}}
    if(!config.searchCampaignExcludedAudience)config.searchCampaignExcludedAudience = true

    // Retrieve the campaign.
    return this.addCondition(
      AdsApp.campaigns(),
      config,
      {action: action}
    )
  }
  //Get excluded search audiences for a campaign
  getExcludedAudiencesForCampaign(config) {
    console.log("getExcludedAudiencesForCampaign:needed: !config.condition''!, !config.searchCampaignExcludedAudience''|[]!");

    if(!config.searchCampaignExcludedAudience)config.searchCampaignExcludedAudience = true

    // Retrieve the campaign.
    var campaignIte = this.addCondition(
      AdsApp.campaigns(), config, true
    )
  }
  //Set AdGroup targeting setting
  setAdGroupTargetSetting(config) {
    console.log("setAdGroupTargetSetting:needed: !config.condition''!, !config.setTargetingSetting''|[]!, !config.criterionTypeGroup'', !config.targetingSetting'TARGET_ALL_TRUE||TARGET_ALL_FALSE'!");
    var action = {action: {type: "add", entityType: "audience", actionType: "targetSetting", config: config}}

    // Retrieve the campaign.
    var campaignIte = this.addCondition(
      AdsApp.adGroups(), config, action
    )
  }
  //Update audience bid modifier
  updateAudienceBidModifer(config) {
    console.log("updateAudienceBidModifer:needed: !config.condition''!, !config.setTargetingSetting''!, !config.setTargetingSetting.criterionTypeGroup'', !config.setTargetingSetting.targetingSetting'TARGET_ALL_TRUE||TARGET_ALL_FALSE'!");
    var action = {action: {type: "add", entityType: "audience", actionType: "bidModifier", config: config}}

    // Retrieve the campaign.
    var campaignIte = this.addCondition(
      AdsApp.adGroups(), config, action
    )

  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Shopping******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve all shopping campaigns
  getAllShoppingCampaigns(config) {
      console.log("getAllShoppingCampaigns: NO ARGUMENT NEEDED")
    /*
    var retval = [];
    var campaignIterator = AdsApp.shoppingCampaigns().get();
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();

      // Optional: Comment out if you don't need to print details.
      Logger.log('Campaign Name: %s', campaign.getName());

      retval.push(campaign);
    }
    return retval;
    */
    return this.addCondition(AdsApp.shoppingCampaigns(), [], true)
    /*USAGE:
    var shoppingCampaigns = getAllShoppingCampaigns();

    for (var i = 0; i < shoppingCampaigns.length; i++) {
      var shoppingCampaign = shoppingCampaigns[i];

      // Process your campaign.
    }
    /USAGE*/
  }
  //Retrieve a shopping entity
  getShopping(config) {
    console.log("getShopping:needed:!config.shoppingCampaign|shoppingAdGroups|productAd|productGroup|''!\noptionnally:  config.condition''");
    var entityType = config.shoppingAdGroups||config.adGroups ? "shoppingAdGroups"
                      : config.shoppingCampaign||config.campaign ? "shoppingCampaigns"
                      : config.productAd ? "productAds"
                      //: config.productBrand ? "productBrands"
                      //: config.productCategory ? "productCategorizq"
                      //: config.productChannelExclusivity ? "productChannelExclusivitizq"
                      //: config.productChannel ? "productChannels"
                      //: config.productCondition ? "productConditions"
                      //: config.productChannel ? "productChannels"
                      : config.productGroup ? "productGroups"
                      //: config.productItemId ? "productItemIds"
                      //: config.ProductType ? "ProductTypes"
                      : ""
    return this.addCondition(AdsApp[entityType](), config, true)
  }
  //Retrieve a shopping campaign by its name
  getShoppingCampaignByName(campaignName) {
    console.log("getShopping:needed: !campaignName''!");
    return this.addCondition(AdsApp.shoppingCampaigns(), "CampaignName = '" + campaignName + "'", true)
  }
  //Retrieve a shopping adgroup by its name
  getShoppingAdGroup(config) {
    console.log("getShopping:needed: !config.condition''|[]!");
    return this.addCondition(AdsApp.shoppingAdGroups(), config, true)
  }
  //Create a shopping ad group
  createShoppingAdGroup(config) {
    console.log("getShopping:needed: !config.condition''|[]!");
    return this.addCondition(AdsApp.shoppingCampaigns(), config, {action: {type: "create", actionType: "adGroup"/*, entityType: "shoppingCampaigns", config: config*/}})
  }
  //Create a shopping product group hierarchy
  createTree(config) {
    console.log("createTree:needed: !config.condition''|[]!, !config.brandNode{!name:!, bid:}!, !config.productGroup[{!conditionName!, bid},..]!");

    var shoppingAdGroup = this.addCondition(AdsApp.shoppingAdGroups(), config, {type: "create", actionType: "tree"})
  }
//***************
  //Traverses the product group hierarchy
  walkProductPartitionTree(config) {
    console.log("walkProductPartitionTree:needed: !config.condition''|[]!");
    var shoppingAdGroup = this.addCondition(AdsApp.shoppingAdGroups(), config, {type: "create", actionType: "walkHierarchy"})
  }

//***************
  //Gets the 'Everything else' product group
  getEverythingElseProductGroup(config) {
    console.log("getEverythingElseProductGroup:needed: !config.condition''|[]!");
    var shoppingAdGroup = this.addCondition(AdsApp.shoppingAdGroups(), config, {type: "create", actionType: "everythingElse"})
  }
  //Update bids for product groups
  updateProductGroupBid(config) {
    console.log("updateProductGroupBid:needed: !config.condition''|[]!, !config.setMaxCpc(int)!");
    var productGroups = this.addCondition(AdsApp.productGroups(), config, {type: "get", actionType: "updateProductGroupBid", config: config})
  }
  //Retrieve product ads
  getProductAds(config) {
    console.log("getProductAds:needed: !config.condition''|[]!");
    return this.addCondition(AdsApp.shoppingAdGroups(), config, true)
  }
  //Create product ads
  createProductAd(config) {
    console.log("createProductAd:needed: !config.condition''|[]!");
    return this.addCondition(AdsApp.shoppingAdGroups(), config, {action: {type: "create", actionType: "createProductAd", config: config}})
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*User Lists******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve all user lists
  getAllUserLists() {
    console.log("getAllUserLists: NO ARGUMENT NEEDED")
    return this.addCondition(AdsApp.userlists(), [], true)
  }
  //Get the number of members in a user list
  getUserListMemberCount() {
    console.log("getUserListMemberCount: NO ARGUMENT NEEDED")
    return this.addCondition(AdsApp.userlists(), [], {custom: ["getSizeForDisplay", "getSizeRangeForDisplay"]})
  }
  //Open a user list
  openUserLists() {
    console.log("openUserLists: NO ARGUMENT NEEDED")
    return this.addCondition(AdsApp.userlists(), [], {action: {type: "open", actionType: "openUserLists"}})
    /*
    var iterator = AdsApp.userlists().get();
    while (iterator.hasNext()) {
      var userlist = iterator.next();
      if (userlist.isClosed()) {
         userlist.open();
      }
    }
    */
  }
  //Retrieve search campaigns targeted by a user list
  getSearchCampaignsTargetedByUserList() {
    console.log("getSearchCampaignsTargetedByUserList: NO ARGUMENT NEEDED")
    var a, userList, resp = this.addCondition(AdsApp.userlists(), [], true)
    for(a in resp)
      resp.campaigns = this.addCondition(resp[a].entity.targetedCampaigns(), [], true)
    return resp
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Video******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve all video campaigns
  getAllVideoCampaigns() {
    console.log("getAllVideoCampaigns: NO ARGUMENT NEEDED")
    // AdsApp.videoCampaigns() will return all campaigns that are not
    // removed by default.
    return this.addCondition(AdsApp.videoCampaigns(), [], true)
  }
//********************
  //Retrieve a video campaign by its name
  getVideoCampaignByName(config) {
    console.log("getVideoCampaignByName:needed: !config.videoCampaignName''|[]!");
    return this.addCondition(AdsApp.videoCampaigns(), 'Name = "'+config.videoCampaignName+'"', true)
  }
//********************
  //Retrieve a video campaign's stats
  getVideoCampaignStats(config) {
    console.log("getVideoCampaignStats:needed: !config.condition''|[]!, !config.dateRange''!");
    return this.addCondition(AdsApp.videoCampaigns(), config,  {stats: config.dateRange})
  }
  //Pause a video campaign
  pauseVideoCampaign(config) {
    console.log("pauseVideoCampaign:needed: !config.condition''|[]!");
    return this.addCondition(AdsApp.videoCampaigns(), config, {action: {type: "pause"}})
  }
  //Add a video ad group
  addVideoAdGroup(config) {
    console.log("addVideoAdGroup:needed: !config.condition''|[]!, !config.withName''!, !config.withAdGroupType'TRUE_VIEW_IN_STREAM|TRUE_VIEW_IN_DISPLAY'!, !config.withCpv''!");
    return this.addCondition(AdsApp.videoAdGroups(), config, {action: {type: "add", entityType: "video", config: config}})
  }
  //Update a video ad group
  updateAdGroup(config) {
    console.log("updateAdGroup:needed: !config.condition''|[]!, !config.setCpv''!");
    return this.addCondition(AdsApp.videoAdGroups(), config, {action: {type: "set", entityType: "video", actionType: "setCpv", config: config}})
  }
  //Retrieve all video ad groups
  getAllVideoAdGroups() {
    console.log("getAllVideoAdGroups: NO ARGUMENT NEEDED")
    return this.addCondition(AdsApp.videoAdGroups(), [])
    // AdsApp.videoAdGroups() will return all ad groups that are not removed by
    // default.
  }
  //Retrieve a video ad group by name
  getVideoAdGroupByName(config) {
    console.log("getVideoAdGroupByName:needed: !config.videoAdGroupName''!");
    return this.addCondition(AdsApp.videoAdGroups(), 'Name = "'+config.videoAdGroupName+'"', true)
  }
  //Retrieve a video ad group's stats
  getVideoAdGroupStats() {
    console.log("getVideoAdGroupStats:needed: !config.condition''!, !config.dateRange!");
    return this.addCondition(AdsApp.videoAdGroups(), config, {stats: config.dateRange})
  }
  //Pause a video ad group
  pauseVideoAdGroup() {
    console.log("pauseVideoAdGroup:needed: !config.condition''!");
    return this.addCondition(AdsApp.videoAdGroups(), config, {action: {type: "pause"}})
  }
  //Retrieve any video for use in an ad
  getVideo(config) {
    console.log("getVideo:needed: !config.condition'Type = `AUDIO, DYNAMIC_IMAGE, ICON, IMAGE, STANDARD_ICON, VIDEO, COMPOSITE_BUNDLE`'!, \nsee availables conditions here: https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_mediaselector#columns");
    return this.addCondition(AdsApp.adMedia().media(), config, {action: {type: "pause"}})
    // This will just get the first valid YouTube video in the account.
    // It demonstrates how to filter to see if a video is valid for video ads.
  }
  //Retrieve a specific video for use in an ad
  getVideoByYouTubeId(config) {
    console.log("getVideoByYouTubeId:needed: !config.youTubeVideoId''!");
    return this.addCondition(AdsApp.adMedia().media(), "Type = VIDEO AND YouTubeVideoId = "+config.youTubeVideoId+"", true)
    // You can filter on the YouTubeVideoId if you already have that video in
    // your account to fetch the exact one you want right away.
  }
  //Add an in-stream video ad
  addInStreamVideoAd() {
    console.log("addInStreamVideoAd:needed: !config.video.condition''!, !config.condition''!, !config.withAdName''!, !config.withDisplayUrl''!, !config.withFinalUrl''!");
    config.video = getVideo(config.video);
    return this.addCondition(AdsApp.videoAdGroups(), config, {action: {type: "add", entityType: "media", actionType: "addInStream", config: config}})
  }
  //Add video discovery ad
  addVideoDiscoveryAd(config) {
    console.log("addVideoDiscoveryAd:needed: !config.video.condition''!, !config.condition''!, !config.withAdName''!, !config.withDescription1''!, !config.withDescription2''!, !config.withHeadline''!, !config.withThumbnail''!, !config.withDestinationPage''!");
    config.video = getVideo(config.video);
    return this.addCondition(AdsApp.videoAdGroups(), config, {action: {type: "add", entityType: "media", actionType: "videoDiscoveryAd", config: config}})
  }
  //Pause video ads in video ad group
  pauseVideoAdsInVideoAdGroup(config) {
    console.log("pauseVideoAdsInVideoAdGroup:needed: !config.condition''!");
    return this.addCondition(AdsApp.videoAdGroups(), config, {action: {type: "pause"}})
  }
//************************
  //Retrieve video ads in video ad group
  getInStreamAdsInVideoAdGroup(config) {
    console.log("getInStreamAdsInVideoAdGroup:needed: !config.video.condition''!, !config.condition''!");
    return this.addCondition(AdsApp.videoAdGroups(), config, {videoAds: true})
  }
//************************
  //Retrieve ad stats from a video ad group
  getVideoAdGroupAdStats(config) {
    console.log("getVideoAdGroupAdStats:needed: !config.video.condition''!, !config.condition''!");
    return this.addCondition(AdsApp.videoAdGroups(), config, {videoAds: {stats: config.dateRange}, condition: config.video})
  }
  //Add in-market audience to a video ad group
  addInMarketAudienceToVideoAdGroup() {
    console.log("addInMarketAudienceToVideoAdGroup:needed: !config.condition''!, !config.withAudienceId''! !config.withAudienceType'USER_INTEREST,USER_LIST,CUSTOM_AFFINITY'!");
    return this.addCondition(AdsApp.videoAdGroups(), 'CampaignStatus != REMOVED', {action: {type: "add", entityType: "media", actionType: "inMarketAudience", config: config}, videoTargeting: {type: "audience"}})
  }
  //
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
