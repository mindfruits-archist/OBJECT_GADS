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
  addAdGroup() {
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var adGroupOperation = campaign.newAdGroupBuilder()
          .withName('INSERT_ADGROUP_NAME_HERE')
          .withCpc(1.2)
          .build();
    }
  }
  //Update an ad group
  updateAdGroup() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.bidding().setCpc(1.2);
      // update other properties as required here
    }
  }
  //Get all ad groups
  getAlladGroups() {
    // AdsApp.adGroups() will return all ad groups that are not removed by
    // default.
    var adGroupIterator = AdsApp.adGroups().get();
    Logger.log('Total adGroups found : ' + adGroupIterator.totalNumEntities());
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      Logger.log('AdGroup Name: ' + adGroup.getName());
    }
  }
  //Get an ad group by name
  getAdGroupByName() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      Logger.log('AdGroup Name: ' + adGroup.getName());
      Logger.log('Enabled: ' + adGroup.isEnabled());
    }
  }
  //Get an ad group's stats
  getadGroupstats() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      // You can also request reports for pre-defined date ranges. See
      // https://developers.google.com/adwords/api/docs/guides/awql,
      // DateRangeLiteral section for possible values.
      var stats = adGroup.getStatsFor('LAST_MONTH');
      Logger.log(adGroup.getName() + ', ' + stats.getClicks() + ', ' +
          stats.getImpressions());
    }
  }
  //Pause an ad group
  pauseAdGroup() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.pause();
      Logger.log('AdGroup with name = ' + adGroup.getName() +
          ' has paused status : ' + adGroup.isPaused());
    }
  }
  //Get an ad group's device bid modifiers
  getAdGroupBidModifiers() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      Logger.log('AdGroup name: ' + adGroup.getName());
      Logger.log('Mobile bid modifier: ' +
          adGroup.devices().getMobileBidModifier());
      Logger.log('Tablet bid modifier: ' +
          adGroup.devices().getTabletBidModifier());
      Logger.log('Desktop bid modifier: ' +
          adGroup.devices().getDesktopBidModifier());
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Ad Params******************************************************************************************/
  /************************************************************************************************************************/
  //Create text ad with ad parameters for an ad group
  setupAdParamsInAdGroup() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      adGroup = adGroupIterator.next();

      adGroup.newAd().expandedTextAdBuilder()
          .withHeadlinePart1('Holiday sale')
          .withHeadlinePart2(
              'Starts in {param1: a few} days {param2: and} hours!')
          .withDescription('Everything must go!')
          .withFinalUrl('http://www.example.com/holidaysales')
          .build();

      var keywordIterator = adGroup.keywords().get();
      if (keywordIterator.hasNext()) {
        keyword = keywordIterator.next();
        // Setup Ad to show as 'Doors open in 5 days, 7 hours!' when searched
        // using this keyword. If the ad is triggered using a keyword
        // without ad param, the ad shows as
        // 'Doors open in a few days, and hours!'
        keyword.setAdParam(1, 5);
        keyword.setAdParam(2, 7);
      }
    }
  }
  //Get ad parameters for a keyword
  getAdParamsForKeyword() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      adGroup = adGroupIterator.next();
      var keywordIterator = adGroup.keywords()
          .withCondition('Text = "Holiday sales"')
          .get();
      if (keywordIterator.hasNext()) {
        keyword = keywordIterator.next();
        var adParamIterator = keyword.adParams().get();
        while (adParamIterator.hasNext()) {
          var adParam = adParamIterator.next();
          logAdParam(adParam);
        }
      }
    }
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
  addExpandedTextAd() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.newAd().expandedTextAdBuilder()
          .withHeadlinePart1('First headline of ad')
          .withHeadlinePart2('Second headline of ad')
          .withDescription('Ad description')
          .withPath1('path1')
          .withPath2('path2')
          .withFinalUrl('http://www.example.com')
          .build();
      // ExpandedTextAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_expandedtextadbuilder
    }
  }
  //Add an image ad
  addImageAd() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    var mediaIterator = AdsApp.adMedia().media()
        .withCondition('Name = "INSERT_IMAGE_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext() && mediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var image = mediaIterator.next();
      adGroup.newAd().imageAdBuilder()
          .withName('Ad name')
          .withImage(image)
          .withDisplayUrl('http://www.example.com')
          .withFinalUrl('http://www.example.com')
          .build();
      // ImageAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_imageadbuilder
    }
  }
  //Add an HTML5 ad
  addHtml5Ad() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    var mediaIterator = AdsApp.adMedia().media()
        .withCondition('Name = "INSERT_MEDIA_BUNDLE_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext() && mediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var mediaBundle = mediaIterator.next();
      adGroup.newAd().html5AdBuilder()
          .withName('Ad name')
          .withMediaBundle(mediaBundle)
          .withEntryPoint('someDirectory/index.html')
          .withDimensions('300x250')
          .withDisplayUrl('http://www.example.com')
          .withFinalUrl('http://www.example.com')
          .build();
      // HTML5AdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_html5adbuilder
    }
  }
  //Add a Gmail image ad
  addGmailImageAd() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    var logoMediaIterator = AdsApp.adMedia().media()
        .withCondition('Name = "INSERT_LOGO_IMAGE_NAME_HERE"')
        .get();
    var imageMediaIterator = AdsApp.adMedia().media()
        .withCondition('Name = "INSERT_IMAGE_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext() &&
        logoMediaIterator.hasNext() &&
        imageMediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var logo = logoMediaIterator.next();
      var image = imageMediaIterator.next();
      adGroup.newAd().gmailImageAdBuilder()
          .withName('Ad name')
          .withAdvertiser('Advertiser')
          .withSubject('Subject')
          .withDescription('Description')
          .withLogo(logo)
          .withImage(image)
          .withFinalUrl('http://www.example.com')
          .withDisplayUrl('http://www.example.com')
          .build();
      // GmailImageAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_gmailimageadbuilder
    }
  }
  //Add a Gmail single promotion ad
  addGmailSinglePromotionAd() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    var logoMediaIterator = AdsApp.adMedia().media()
        .withCondition('Name = "INSERT_LOGO_IMAGE_NAME_HERE"')
        .get();
    var imageMediaIterator = AdsApp.adMedia().media()
        .withCondition('Name = "INSERT_IMAGE_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext() &&
        logoMediaIterator.hasNext() &&
        imageMediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var logo = logoMediaIterator.next();
      var image = imageMediaIterator.next();
      adGroup.newAd().gmailSinglePromotionAdBuilder()
          .withName('Ad name')
          .withContent('Content')
          .withHeadline('Headline')
          .withAdvertiser('Advertiser')
          .withSubject('Subject')
          .withDescription('Description')
          .withCallToAction('Call to action')
          .withLogo(logo)
          .withImage(image)
          .withFinalUrl('http://www.example.com')
          .withDisplayUrl('http://www.example.com')
          .build();
      // GmailSinglePromotionAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_gmailsinglepromotionadbuilder
    }
  }
  //Add a Gmail multi-product ad
  addGmailMultiProductAd() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    var logoMediaIterator = AdsApp.adMedia().media()
        .withCondition('Name = "INSERT_LOGO_IMAGE_NAME_HERE"')
        .get();
    var itemImageMediaIterator = AdsApp.adMedia().media()
        .withCondition('Name = "INSERT_ITEM_1_IMAGE_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext() &&
        logoMediaIterator.hasNext() &&
        itemImageMediaIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var logo = logoMediaIterator.next();
      var item1Image = itemImageMediaIterator.next();
      adGroup.newAd().gmailMultiProductAdBuilder()
          .withName('Ad name')
          .withAdvertiser('Advertiser')
          .withSubject('Subject')
          .withDescription('Description')
          .withHeadline('Headline')
          .withLogo(logo)
          .withItemImages([item1Image])
          .withItemTitles(['Item 1 title'])
          .withItemButtonCallsToAction(['Item 1 button text'])
          .withItemButtonFinalUrls(['http://www.example.com/item_1_button'])
          .withFinalUrl('http://www.example.com')
          .withDisplayUrl('http://www.example.com')
          .build();
      // GmailMultiProductAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_gmailmultiproductadbuilder
    }
  }
//**********************
  //Add a responsive display ad
  // You create responsive display ads in two steps:
  //   1. Create or retrieve assets (marketing images, square marketing images,
  //      optional logos, optional landscape logos, and optional YouTube videos)
  //   2. Create the ad.
  //
  // The following assumes you have not already created named assets.
  addResponsiveDisplayAd() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();

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

    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var adGroupBuilder = adGroup.newAd()
          .responsiveDisplayAdBuilder()
          .withBusinessName('Your business name')
          .withFinalUrl('http://www.example.com')
          .withHeadlines(['First headline', 'Second headline'])
          .withDescriptions(
              ['First description', 'Second description', 'Third description']);

      // If you selected assets with a snippet as shown above, then provide those
      // assets here like this:
      //
      // adGroupBuilder = adGroupBuilder.withMarketingImages(marketingImages);

      adGroupBuilder
          .addMarketingImage(
              buildImageAsset("rectangular image asset", "https://goo.gl/3b9Wfh"))
          .addSquareMarketingImage(
              buildImageAsset("square image asset", "https://goo.gl/mtt54n"))
          .build();

      // ResponsiveDisplayAdBuilder has additional options.
      // For more details, see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_responsivedisplayadbuilder
    }
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
  pauseAdsInAdGroup() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var adsIterator = adGroup.ads().get();
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next();
        ad.pause();
      }
    }
  }
//**********************
  //Get expanded text ads in an ad group
  getExpandedTextAdsInAdGroup() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var adsIterator = adGroup.ads()
        .withCondition('Type=EXPANDED_TEXT_AD')
        .get();
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next().asType().expandedTextAd();
        logExpandedTextAd(ad);
      }
    }
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
  getTextAdsInAdGroup() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      // You can filter for ads of a particular type, using the AdType selector.
      // See https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_adselector#withCondition_1
      // for possible values.

      var adsIterator = adGroup.ads().withCondition('Type=TEXT_AD').get();
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next();
        logAd(ad);
      }
    }
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
  getAdStats() {
    var adGroupIterator = AdsApp.adGroups()
          .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
          .get();
    if (adGroupIterator.hasNext()) {
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
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next();
        // You can also request reports for pre-defined date ranges. See
        // https://developers.google.com/adwords/api/docs/guides/awql,
        // DateRangeLiteral section for possible values.
        var stats = ad.getStatsFor('LAST_MONTH');
        Logger.log(adGroup.getName() + ', ' +
            stats.getClicks() + ', ' + stats.getImpressions());
      }
    }
  }
//**********************
  //Get legacy responsive display ads in an ad group
  getResponsiveDisplayAdsInAdGroup() {
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
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var adsIterator = adGroup.ads()
          .withCondition('Type IN ["MULTI_ASSET_RESPONSIVE_DISPLAY_AD",
                                   "LEGACY_RESPONSIVE_DISPLAY_AD"]')
          .get();
      while (adsIterator.hasNext()) {
        var ad = adsIterator.next().asType().responsiveDisplayAd();
        if (ad.isLegacy()) {
          logLegacyResponsiveDisplayAd(ad);
        } else {
          logResponsiveDisplayAd(ad);
        }
      }
    }
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
    logTextAssets('Short headline ', ad.getHeadlines());
    logTextAssets('Description ', ad.getDescriptions());
    Logger.log('Business name : ' + ad.getBusinessName());
    logImageAssets('Marketing image ', ad.getMarketingImages());
    logImageAssets('Square marketing image ', ad.getSquareMarketingImages());
    logImageAssets('Logo image ', ad.getLogoImages());
    logImageAssets('Landscape logo image ', ad.getLandscapeLogoImages());
    logYouTubeAssets('YouTube video ', ad.getYouTubeVideos());
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
    var biddingStrategies = AdsApp.biddingStrategies().get();
    while (biddingStrategies.hasNext()) {
      var biddingStrategy = biddingStrategies.next();

      Logger.log('Bidding strategy with id = %s, name = %s and type = ' +
          '%s was found.', biddingStrategy.getId().toFixed(0),
          biddingStrategy.getName(), biddingStrategy.getType());
    }
  }
  //Get bidding strategy by name
  getBiddingStrategyByName() {
    var biddingStrategies = AdsApp.biddingStrategies().withCondition(
        'Name="INSERT_BIDDING_STRATEGY_NAME_HERE"').get();
    while (biddingStrategies.hasNext()) {
      var biddingStrategy = biddingStrategies.next();

      var stats = biddingStrategy.getStatsFor('LAST_MONTH');

      Logger.log('Bidding strategy with id = %s, name = %s and type = ' +
          '%s was found.', biddingStrategy.getId().toFixed(0),
           biddingStrategy.getName(), biddingStrategy.getType());
      Logger.log('Clicks: %s, Impressions: %s, Cost: %s.',
          stats.getClicks(), stats.getImpressions(), stats.getCost());
    }
  }
  //Set campaign bidding strategy
  setCampaignBiddingStrategy() {
    var campaign = AdsApp.campaigns()
        .withCondition('Name="INSERT_CAMPAIGN_NAME_HERE"')
        .get()
        .next();

    // You may also set a flexible bidding strategy for the campaign
    // using the setStrategy() method. Use the
    // AdsApp.biddingStrategies() method to retrieve flexible bidding
    // strategies in your account.
    campaign.bidding().setStrategy('MANUAL_CPM');
  }
  //Clear ad group bidding strategy
  clearAdGroupBiddingStrategy() {
    var adGroup = AdsApp.adGroups()
        .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get()
        .next();
    adGroup.bidding().clearStrategy();
  }
  //Set an ad group's default CPC bid
  setAdGroupDefaultCpcBid() {
    var adGroup = AdsApp.adGroups()
        .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get()
        .next();

    // This bid will only be used for auction if a corresponding cpc
    // bidding strategy is set to the ad group. E.g.
    //
    // adGroup.bidding().setStrategy('MANUAL_CPC');
    adGroup.bidding().setCpc(3.0);
  }
  //Set a keyword's CPC bid
  setKeywordCpcBid() {
    var keyword = AdsApp.keywords()
      .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
      .withCondition('AdGroupName = "INSERT_ADGROUP_NAME_HERE"')
      .withCondition('KeywordText = "INSERT_KEYWORD_TEXT_HERE"')
      .get()
      .next();

    // This bid will only be used for auction if a corresponding cpc
    // bidding strategy is set to the parent ad group. E.g.
    //
    // adGroup.bidding().setStrategy('MANUAL_CPC');
    keyword.bidding().setCpc(3.0);
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Budget Orders******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve base spending limit of budget order
  getBaseSpendingLimit() {
    var budgetOrderIterator = AdsApp.budgetOrders().get();
    while (budgetOrderIterator.hasNext()) {
      var budgetOrder = budgetOrderIterator.next();
      var limitText = "";
      if (budgetOrder.getSpendingLimit() == null) {
        limitText = "unlimited";
      } else if (budgetOrder.getTotalAdjustments() == null) {
        limitText = budgetOrder.getSpendingLimit();
      } else {
        limitText = budgetOrder.getSpendingLimit() -
            budgetOrder.getTotalAdjustments();
      }
      Logger.log("Budget Order [" + budgetOrder.getName() +
          "] base spending limit: " + limitText);
    }
  }
  //Retrieve the active budget order
  getActiveBudgetOrder() {
    // There will only be one active budget order at any given time.
    var budgetOrderIterator = AdsApp.budgetOrders()
        .withCondition('status="ACTIVE"')
        .get();
    while (budgetOrderIterator.hasNext()) {
      var budgetOrder = budgetOrderIterator.next();
      Logger.log("Budget Order [" + budgetOrder.getName() +
          "] is currently active.");
    }
  }
  //Retrieve all budget orders
  getAllBudgetOrders() {
    var budgetOrderIterator = AdsApp.budgetOrders().get();
    while (budgetOrderIterator.hasNext()) {
      var budgetOrder = budgetOrderIterator.next();
      Logger.log("Budget Order [" + budgetOrder.getName() + "]");
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Budgets******************************************************************************************/
  /************************************************************************************************************************/
  //Set campaign budget
  setCampaignBudget() {
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.getBudget().setAmount(100);
      Logger.log('Campaign with name = ' + campaign.getName() +
          ' has budget = ' + campaign.getBudget().getAmount());
    }
  }
  //Get campaign budget
  getBudgetDetails() {
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
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

      while (budgetCampaignIterator.hasNext()) {
        var associatedCampaign = budgetCampaignIterator.next();
        Logger.log(associatedCampaign.getName());
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Campaigns******************************************************************************************/
  /************************************************************************************************************************/
  //Get all campaigns
  getAllCampaigns() {
    // AdsApp.campaigns() will return all campaigns that are not removed by
    // default.
    var campaignIterator = AdsApp.campaigns().get();
    Logger.log('Total campaigns found : ' +
        campaignIterator.totalNumEntities());
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      Logger.log(campaign.getName());
    }
  }
//******************
  //Get a campaign by name
  getCampaignsByName() {
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      Logger.log('Campaign Name: ' + campaign.getName());
      Logger.log('Enabled: ' + campaign.isEnabled());
      Logger.log('Bidding strategy: ' + campaign.getBiddingStrategyType());
      Logger.log('Ad rotation: ' + campaign.getAdRotationType());
      Logger.log('Start date: ' + formatDate(campaign.getStartDate()));
      Logger.log('End date: ' + formatDate(campaign.getEndDate()));
    }
  }
  formatDate(date) {
    zeroPad(number) { return Utilities.formatString('%02d', number); }
    return (date == null) ? 'None' : zeroPad(date.year) + zeroPad(date.month) +
        zeroPad(date.day);
  }
//******************
  //Get a campaign's stats
  getCampaignStats() {
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      // You can also request reports for pre-defined date ranges. See
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_campaign#getStatsFor_1,
      // DateRangeLiteral section for possible values.
      var stats = campaign.getStatsFor('LAST_MONTH');
      Logger.log(campaign.getName() + ', ' + stats.getClicks() + 'clicks, ' +
          stats.getImpressions() + ' impressions');
    }
  }
  //Pause a campaign
  pauseCampaign() {
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.pause();
    }
  }
  //Get a campaign's device bid modifiers
  getCampaignBidModifiers() {
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      Logger.log('Campaign name: ' + campaign.getName());

      var platformIterator = campaign.targeting().platforms().get();
      while (platformIterator.hasNext()) {
        var platform = platformIterator.next();
        Logger.log(platform.getName() + ' bid modifier: ' +
            platform.getBidModifier());
      }
    }
  }
  //
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Display******************************************************************************************/
  /************************************************************************************************************************/
  //Add a placement to an existing ad group
  addPlacementToAdGroup() {
    var adGroup = AdsApp.adGroups()
        .withCondition("Name = 'INSERT_ADGROUP_NAME_HERE'")
        .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
        .get()
        .next();

    // Other display criteria can be built in a similar manner using the
    // corresponding builder method in the AdsApp.Display,
    // AdsApp.CampaignDisplay or AdsApp.AdGroupDisplay class.
    var placementOperation = adGroup.display()
        .newPlacementBuilder()
        .withUrl('http://www.site.com')  // required
        .withCpc(0.50)                   // optional
        .build();
    var placement = placementOperation.getResult();
    Logger.log('Placement with id = %s and url = %s was created.',
        placement.getId(), placement.getUrl());
  }
  //Retrieve all topics in an existing ad group
  getAllTopics() {
    var adGroup = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
        .get()
        .next();

    // Other display criteria can be retrieved in a similar manner using
    // the corresponding selector methods in the AdsApp.Display,
    // AdsApp.CampaignDisplay or AdsApp.AdGroupDisplay class.
    var topicIterator = AdsApp.display()
        .topics()
        .withCondition('Impressions > 100')
        .forDateRange('LAST_MONTH')
        .orderBy('Clicks DESC')
        .get();

    while (topicIterator.hasNext()) {
      var topic = topicIterator.next();

      // The list of all topic IDs can be found on
      // https://developers.google.com/adwords/api/docs/appendix/verticals
      Logger.log('Topic with criterion id = %s and topic id = %s was ' +
          'found.', topic.getId().toFixed(0),
           topic.getTopicId().toFixed(0));
    }
  }
  //Get stats for all audiences in an existing ad group
  getAudienceStats() {
    var adGroup = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
        .get()
        .next();

    // Other display criteria can be retrieved in a similar manner using
    // the corresponding selector methods in the AdsApp.Display,
    // AdsApp.CampaignDisplay or AdsApp.AdGroupDisplay class.
    var audienceIterator = adGroup.display()
        .audiences()
        .get();

    Logger.log('ID, Audience ID, Clicks, Impressions, Cost');

    while (audienceIterator.hasNext()) {
      var audience = audienceIterator.next();
      var stats = audience.getStatsFor('LAST_MONTH');

      // User List IDs (List IDs) are available on the details page of
      // a User List (found under the Audiences section of the Shared
      // Library)
      Logger.log('%s, %s, %s, %s, %s', audience.getId().toFixed(0),
         audience.getAudienceId(), stats.getClicks(),
         stats.getImpressions(), stats.getCost());
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Drafts and Experiments******************************************************************************************/
  /************************************************************************************************************************/
  //Create a draft campaign
  createDraft() {
    var campaign = AdsApp.campaigns()
        .withCondition("Name = 'INSERT_CAMPAIGN_NAME_HERE'")
        .get()
        .next();

    var draftBuilder = campaign.newDraftBuilder()
        .withName("INSERT_NEW_DRAFT_NAME_HERE")
        .build();

    var draft = draftBuilder.getResult();
  }
  //Get draft campaigns
  getDrafts() {
    // Get all drafts.
    var drafts = AdsApp.drafts().get();

    Logger.log(drafts.totalNumEntities());

    while (drafts.hasNext()) {
      var draft = drafts.next();
      Logger.log("Draft: " + draft.getName());
    }

    // Get a specific draft.
    var campaignIterator = AdsApp.drafts()
        .withCondition("DraftName = 'INSERT_DRAFT_NAME'")
        .get();

    while (campaignIterator.hasNext()) {
      Logger.log(campaignIterator.next().getName());
    }
  }
  //Create an experiment
  createExperiment() {
    var draft = AdsApp.drafts()
        .withCondition("DraftName = INSERT_DRAFT_NAME")
        .get()
        .next();

    var experimentBuilder = draft.newExperimentBuilder();

    experimentBuilder.withName("INSERT_NEW_EXPERIMENT_NAME_HERE")
        .withTrafficSplitPercent(50)
        .startBuilding();
  }
  //Get experiments
  getExperiments() {
    // Get all experiments.
    var exps = AdsApp.experiments().get();

    Logger.log(exps.totalNumEntities());

    while (exps.hasNext()) {
      var exp = exps.next();
      Logger.log("Experiment: " + exp.getName());
    }

    // Get specific experiment.
    var campaignIterator = AdsApp.experiments()
        .withCondition("Name = 'INSERT_EXPERIMENT_NAME'")
        .get();

    while (campaignIterator.hasNext()) {
      Logger.log(campaignIterator.next().getName());
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Excluded Placement Lists******************************************************************************************/
  /************************************************************************************************************************/
  //Show all the shared excluded placements in an excluded placement list
  showAllExcludedPlacementsFromList() {
    var EXCLUDED_PLACEMENT_LIST_NAME = 'INSERT_LIST_NAME_HERE';

    var excludedPlacementListIterator =
        AdsApp.excludedPlacementLists()
            .withCondition('Name = "' + EXCLUDED_PLACEMENT_LIST_NAME + '"')
            .get();

    if (excludedPlacementListIterator.totalNumEntities() == 1) {
      var excludedPlacementList = excludedPlacementListIterator.next();
      var sharedExcludedPlacementIterator =
          excludedPlacementList.excludedPlacements().get();

      while (sharedExcludedPlacementIterator.hasNext()) {
        var sharedExcludedPlacement = sharedExcludedPlacementIterator.next();
        Logger.log(sharedExcludedPlacement.getUrl());
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Keywords******************************************************************************************/
  /************************************************************************************************************************/
  //Add a keyword to an existing ad group
  addKeyword() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();

      adGroup.newKeywordBuilder()
          .withText('Hello world')
          .withCpc(1.25)                          // Optional
          .withFinalUrl('http://www.example.com') // Optional
          .build();

      // KeywordBuilder has a number of other options. For more details see
      // https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_keywordbuilder
    }
  }
  //Pause an existing keyword in an ad group
  pauseKeywordInAdGroup() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var keywordIterator = adGroup.keywords()
          .withCondition('Text="INSERT_KEYWORDS_HERE"').get();
      while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        keyword.pause();
      }
    }
  }
//******************
  //Get all keywords in an ad group
  getKeywordsInAdGroup() {
    var keywordIterator = AdsApp.keywords()
        .withCondition('AdGroupName = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (keywordIterator.hasNext()) {
      while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        Logger.log(formatKeyword(keyword));
      }
    }
  }

  formatKeyword(keyword) {
    return 'Text : ' + keyword.getText() + '\n' +
        'Match type : ' + keyword.getMatchType() + '\n' +
        'CPC : ' + keyword.bidding().getCpc() + '\n' +
        'Final URL : ' + keyword.urls().getFinalUrl() + '\n' +
        'Approval Status : ' + keyword.getApprovalStatus() + '\n' +
        'Enabled : ' + keyword.isEnabled() + '\n';
  }
//******************
  //Get stats for all keywords in an ad group
  getKeywordStats() {
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var keywordIterator = adGroup.keywords().get();
      while (keywordIterator.hasNext()) {
        var keyword = keywordIterator.next();
        // You can also request reports for pre-defined date ranges. See
        // https://developers.google.com/adwords/api/docs/guides/awql,
        // DateRangeLiteral section for possible values.
        var stats = keyword.getStatsFor('LAST_MONTH');
        Logger.log(adGroup.getName() + ', ' + keyword.getText() + ', ' +
            stats.getClicks() + ', ' + stats.getImpressions());
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Labels******************************************************************************************/
  /************************************************************************************************************************/
  //Get all labels from a user's account
  getAllLabels() {
    var labelIterator = AdsApp.labels().get();

    while (labelIterator.hasNext()) {
      var label = labelIterator.next();
      Logger.log(label.getName());
    }
  }
  //Get a label by name
  getLabelsByName() {
    var labelIterator = AdsApp.labels()
        .withCondition('Name = "INSERT_LABEL_NAME_HERE"')
        .get();
    if (labelIterator.hasNext()) {
      var label = labelIterator.next();
      Logger.log('Name: ' + label.getName());
      Logger.log('Description: ' + label.getDescription());
      Logger.log('Color: ' + label.getColor());
      Logger.log('Number of campaigns: ' +
          label.campaigns().get().totalNumEntities());
      Logger.log('Number of ad groups: ' +
          label.adGroups().get().totalNumEntities());
      Logger.log('Number of ads: ' + label.ads().get().totalNumEntities());
      Logger.log('Number of keywords: ' +
          label.keywords().get().totalNumEntities());
    }
  }
  //Apply a label to a campaign
  applyLabel() {
    // Retrieve a campaign, and apply a label to it. Applying labels to other
    // object types are similar.
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.applyLabel('Test');
    }
  }
  //Remove a label from a campaign
  removeLabel() {
    var campaignIterator = AdsApp.campaigns()
       .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
       .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.removeLabel('Test');
    }
  }
  //Remove a label from the user's account
  removeLabel() {
    var labelIterator = AdsApp.labels()
        .withCondition('Name = "INSERT_LABEL_NAME_HERE"')
        .get();
    if (labelIterator.hasNext()) {
      label = labelIterator.next();
      label.remove();
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Negative Keyword Lists******************************************************************************************/
  /************************************************************************************************************************/
  //Construct a new negative keyword list and add it to a campaign
  addNegativeKeywordListToCampaign() {
    var NEGATIVE_KEYWORD_LIST_NAME = 'INSERT_LIST_NAME_HERE';
    var CAMPAIGN_NAME = 'INSERT_CAMPAIGN_NAME_HERE';

    var negativeKeywordListOperator =
        AdsApp.newNegativeKeywordListBuilder()
            .withName(NEGATIVE_KEYWORD_LIST_NAME)
            .build();

    if (negativeKeywordListOperator.isSuccessful()) {
      var negativeKeywordList = negativeKeywordListOperator.getResult();
      negativeKeywordList.addNegativeKeywords([
          'broad match keyword',
          '"phrase match keyword"',
          '[exact match keyword]'
      ]);

      var campaign = AdsApp.campaigns()
          .withCondition('Name = "' + CAMPAIGN_NAME + '"')
          .get();
      campaign.addNegativeKeywordList(negativeKeywordList);
    } else {
      Logger.log('Could not add Negative Keyword List.');
    }
  }
  //Remove all the shared negative keywords in an negative keyword list
  removeAllNegativeKeywordsFromList() {
    var NEGATIVE_KEYWORD_LIST_NAME = 'INSERT_LIST_NAME_HERE';

    var negativeKeywordListIterator =
        AdsApp.negativeKeywordLists()
            .withCondition('Name = "' + NEGATIVE_KEYWORD_LIST_NAME + '"')
            .get();

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
  addNegativeKeywordToCampaign() {
    var campaignIterator = AdsApp.campaigns()
          .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
          .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      campaign.createNegativeKeyword('[Budget hotels]');
    }
  }
  //Get negative keywords in a campaign
  getNegativeKeywordForCampaign() {
    var campaignIterator = AdsApp.campaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var negativeKeywordIterator = campaign.negativeKeywords().get();
      while (negativeKeywordIterator.hasNext()) {
        var negativeKeyword = negativeKeywordIterator.next();
        Logger.log('Text: ' + negativeKeyword.getText() + ', MatchType: ' +
            negativeKeyword.getMatchType());
      }
    }
  }
  //Add a negative keyword to an ad group
  addNegativeKeywordToAdGroup() {
    // If you have multiple ad groups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      adGroup.createNegativeKeyword('[Budget hotels]');
    }
  }
  //Get negative keywords in an ad group
  getNegativeKeywordForAdGroup() {
    // If you have multiple ad groups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.adGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var adGroupIterator = AdsApp.adGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      var negativeKeywordIterator = adGroup.negativeKeywords().get();
      while (negativeKeywordIterator.hasNext()) {
        var negativeKeyword = negativeKeywordIterator.next();
        Logger.log('Text: ' + negativeKeyword.getText() + ', MatchType: ' +
            negativeKeyword.getMatchType());
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Search Audiences******************************************************************************************/
  /************************************************************************************************************************/
  //Add search audience to an ad group
  addSearchAudienceToAdGroup() {
    var AUDIENCE_LIST_ID = INSERT_AUDIENCE_ID_HERE;
    var CAMPAIGN_NAME = 'INSERT_CAMPAIGN_NAME_HERE';
    var ADGROUP_NAME = 'INSERT_ADGROUP_NAME_HERE';

    // Retrieve the ad group.
    var adGroup = AdsApp.adGroups()
        .withCondition('Name = "' + ADGROUP_NAME + '"')
        .withCondition('CampaignName = "' + CAMPAIGN_NAME + '"')
        .get()
        .next();

    // Create the search audience.
    var searchAudience = adGroup.targeting()
        .newUserListBuilder()
        .withAudienceId(AUDIENCE_LIST_ID)
        .withBidModifier(1.3)
        .build()
        .getResult();

    // Display the results.
    Logger.log('Search audience with name = %s and ID = %s was added to ad ' +
        'group ID: %s', searchAudience.getName(),
        searchAudience.getId().toFixed(0), adGroup.getId().toFixed(0));
  }
  //Get ad group search audience by name
  getAdGroupSearchAudienceByName() {
    var CAMPAIGN_NAME = 'INSERT_CAMPAIGN_NAME_HERE';
    var ADGROUP_NAME = 'INSERT_ADGROUP_NAME_HERE';
    var AUDIENCE_NAME = 'INSERT_AUDIENCE_NAME_HERE';

    // Retrieve the search audience.
    var searchAudience = AdsApp.adGroupTargeting().audiences()
        .withCondition('CampaignName = ' + CAMPAIGN_NAME)
        .withCondition('AdGroupName = ' + ADGROUP_NAME)
        .withCondition('UserListName = "' + AUDIENCE_NAME + '"')
        .get()
        .next();

    // Display the results.
    Logger.log('Search audience with name = %s and ID = %s was found.',
        searchAudience.getName(), searchAudience.getId());
  }
  //Filter ad group search audience by stats
  filterAdGroupAudienceByStats() {
    var CAMPAIGN_NAME = 'INSERT_CAMPAIGN_NAME_HERE';
    var ADGROUP_NAME = 'INSERT_ADGROUP_NAME_HERE';

    // Retrieve top performing search audiences.
    var topPerformingAudiences = AdsApp.adGrouptargeting().audiences()
        .withCondition('CampaignName = ' + CAMPAIGN_NAME)
        .withCondition('AdGroupName = ' + ADGROUP_NAME)
        .withCondition('Clicks > 30')
        .forDateRange('LAST_MONTH')
        .get();

    while (topPerformingAudiences.hasNext()) {
      var audience = topPerformingAudiences.next();
      Logger.log('Search audience with ID = %s, name = %s and audience list ' +
          'ID = %s has %s clicks.', audience.getId().toFixed(0),
          audience.getName(), audience.getAudienceId(),
          audience.getStatsFor('THIS_MONTH').getClicks());
    }
  }
  //Exclude search audience from a campaign
  addExcludedAudienceToCampaign() {
    var CAMPAIGN_NAME = INSERT_CAMPAIGN_NAME_HERE;
    var AUDIENCE_LIST_ID = INSERT_AUDIENCE_ID_HERE;

    // Retrieve the campaign.
    var campaign = AdsApp.campaigns()
        .withCondition('Name = "' + CAMPAIGN_NAME + '"')
        .get()
        .next();

    // Create the excluded audience.
    var audience = campaign.targeting()
        .newUserListBuilder()
        .withAudienceId(AUDIENCE_LIST_ID)
        .exclude()
        .getResult();
    Logger.log('Excluded audience with ID = %s and audience list ID = %s was ' +
        'created for campaign: "%s".', audience.getId(),
         audience.getAudienceId(), campaign.getName());
  }
  //Get excluded search audiences for a campaign
  getExcludedAudiencesForCampaign() {
    var CAMPAIGN_NAME = INSERT_CAMPAIGN_NAME_HERE;

    // Retrieve the campaign.
    var campaign = AdsApp.campaigns()
        .withCondition('Name = "' + CAMPAIGN_NAME + '"')
        .get()
        .next();

    var excludedAudiences = campaign.targeting().excludedAudiences().get();

    while (excludedAudiences.hasNext()) {
      var audience = excludedAudiences.next();
      Logger.log('Excluded audience with ID = %s, name = %s and audience list ' +
          'ID = %s was found.', audience.getId(), audience.getName(),
           audience.getAudienceId());
    }
  }
  //Set AdGroup targeting setting
  setAdGroupTargetSetting() {
    var CAMPAIGN_NAME = 'INSERT_CAMPAIGN_NAME_HERE';
    var ADGROUP_NAME = 'INSERT_ADGROUP_NAME_HERE';

    // Retrieve the ad group.
    var adGroup = AdsApp.adGroups()
        .withCondition('Name = "' + ADGROUP_NAME + '"')
        .withCondition('CampaignName = "' + CAMPAIGN_NAME + '"')
        .get()
        .next();

    // Change the target setting to TARGET_ALL.
    adGroup.targeting().setTargetingSetting('USER_INTEREST_AND_LIST',
        'TARGET_ALL_TRUE');
  }
  //Update audience bid modifier
  updateAudienceBidModifer() {
    var CAMPAIGN_NAME = 'INSERT_CAMPAIGN_NAME_HERE';
    var ADGROUP_NAME = 'INSERT_ADGROUP_NAME_HERE';
    var AUDIENCE_NAME = 'INSERT_AUDIENCE_NAME_HERE';

    // Create the search audience.
    var searchAudience = AdsApp.adGrouptargeting().audiences()
        .withCondition('CampaignName = ' + CAMPAIGN_NAME)
        .withCondition('AdGroupName = ' + ADGROUP_NAME)
        .withCondition('UserListName = "' + AUDIENCE_NAME + '"')
        .get()
        .next();

    searchAudience.bidding().setBidModifier(1.6);

    // Display the results.
    Logger.log('Bid modifier for Search Audience with Name = "%s" in ' +
        'Ad Group ID: "%s" was set to %s.',
         searchAudience.getName(),
         adGroup.getId().toFixed(0),
         searchAudience.bidding().getBidModifier());
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Shopping******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve all shopping campaigns
  getAllShoppingCampaigns() {
    var retval = [];
    var campaignIterator = AdsApp.shoppingCampaigns().get();
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();

      // Optional: Comment out if you don't need to print details.
      Logger.log('Campaign Name: %s', campaign.getName());

      retval.push(campaign);
    }
    return retval;
    /*USAGE:
    var shoppingCampaigns = getAllShoppingCampaigns();

    for (var i = 0; i < shoppingCampaigns.length; i++) {
      var shoppingCampaign = shoppingCampaigns[i];

      // Process your campaign.
    }
    /USAGE*/
  }
  //Retrieve a shopping campaign by its name
  getShoppingCampaignByName(campaignName) {
    var campaignIterator = AdsApp.shoppingCampaigns()
        .withCondition("CampaignName = '" + campaignName + "'")
        .get();
    while (campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      Logger.log('Campaign Name: %s', campaign.getName());
    }
  }
  //Retrieve a shopping adgroup by its name
  getShoppingAdGroup() {
    var campaignName = 'INSERT_CAMPAIGN_NAME_HERE';
    var adGroupName = 'INSERT_ADGROUP_NAME_HERE';

    var adGroupIterator = AdsApp.shoppingAdGroups()
        .withCondition("CampaignName = '" + campaignName +
            "' and AdGroupName = '" + adGroupName + "'")
        .get();
    while (adGroupIterator.hasNext()) {
      var adGroup = adGroupIterator.next();
      Logger.log(
          'AdGroup Name: %s, CPC = %s, Mobile Bid ' + 'Modifier = %s',
          adGroup.getName(),
          adGroup.bidding().getCpc(),
          adGroup.devices().getMobileBidModifier()
      );
    }
  }
  //Create a shopping ad group
  createShoppingAdGroup() {
    var campaignName = 'INSERT_CAMPAIGN_NAME_HERE';

    var shoppingCampaign = AdsApp.shoppingCampaigns()
        .withCondition("CampaignName = '" + campaignName + "'")
        .get()
        .next();
    var adGroupOperation = shoppingCampaign.newAdGroupBuilder().build();
    var adGroup = adGroupOperation.getResult();
    Logger.log(adGroup);
  }
  //Create a shopping product group hierarchy
  createTree() {
    var campaignName = 'INSERT_CAMPAIGN_NAME_HERE';
    var adGroupName = 'INSERT_ADGROUP_NAME_HERE';

    var shoppingAdGroup = AdsApp.shoppingAdGroups()
        .withCondition("CampaignName = '" + campaignName +
            "' and AdGroupName = '" + adGroupName + "'")
        .get()
        .next();

    var root = shoppingAdGroup.rootProductGroup();

    // The structure created is
    // - root
    //   - cardcow brand
    //     - New
    //     - Refurbished
    //     - Other conditions
    //   - Other brands

    // Add a brand product group for "cardcow" under root product group.
    var brandNode = root.newChild()
        .brandBuilder()
        .withName('cardcow')
        .withBid(1.2)
        .build()
        .getResult();

    // Add new conditions for New and Refurbished cardcow brand items.
    var newItems = brandNode.newChild()
        .conditionBuilder()
        .withCondition('NEW')
        .build()
        .getResult();

    var refurbishedItems = brandNode.newChild()
        .conditionBuilder()
        .withCondition('REFURBISHED')
        .withBid(0.9)
        .build()
        .getResult();
  }
//***************
  //Traverses the product group hierarchy
  walkProductPartitionTree() {
    var campaignName = 'INSERT_CAMPAIGN_NAME_HERE';
    var adGroupName = 'INSERT_ADGROUP_NAME_HERE';

    var shoppingAdGroup = AdsApp.shoppingAdGroups()
        .withCondition("CampaignName = '" + campaignName +
            "' and AdGroupName = '" + adGroupName + "'")
        .get()
        .next();
    var root = shoppingAdGroup.rootProductGroup();
    walkHierarchy(root, 0);
  }

  walkHierarchy(productGroup, level) {
    var description = '';

    if (productGroup.isOtherCase()) {
      description = 'Other';
    } else if (productGroup.getDimension() == 'CATEGORY') {
      // Shows how to process a product group differently based on its type.
      description = productGroup.asCategory().getName();
    } else {
      description = productGroup.getValue();
    }

    var padding = new Array(level + 1).join('-');

    // Note: Child product groups may not have a max cpc if it has been excluded.
    Logger.log(
        '%s %s, %s, %s, %s, %s',
        padding,
        description,
        productGroup.getDimension(),
        productGroup.getMaxCpc(),
        productGroup.isOtherCase(),
        productGroup.getId().toFixed()
    );
    var childProductGroups = productGroup.children().get();
    while (childProductGroups.hasNext()) {
      var childProductGroup = childProductGroups.next();
      walkHierarchy(childProductGroup, level + 1);
    }
  }
//***************
  //Gets the 'Everything else' product group
  getEverythingElseProductGroup() {
    var campaignName = 'INSERT_CAMPAIGN_NAME_HERE';
    var adGroupName = 'INSERT_ADGROUP_NAME_HERE';

    var shoppingAdGroup = AdsApp.shoppingAdGroups()
        .withCondition("CampaignName = '" + campaignName +
            "' and AdGroupName = '" + adGroupName + "'")
        .get()
        .next();

    var rootProductGroup = shoppingAdGroup.rootProductGroup();
    var childProductGroups = rootProductGroup.children().get();
    while (childProductGroups.hasNext()) {
      var childProductGroup = childProductGroups.next();
      if (childProductGroup.isOtherCase()) {
        // Note: Child product groups may not have a max cpc if it has been
        // excluded.
        Logger.log(
            '"Everything else" product group found. Type of the product ' +
                'group is %s and bid is %s.',
            childProductGroup.getDimension(),
            childProductGroup.getMaxCpc());
        return;
      }
    }
    Logger.log('"Everything else" product group not found under root ' +
        'product group.');
  }
  //Update bids for product groups
  updateProductGroupBid() {
    var productGroups = AdsApp.productGroups()
        .withCondition('Clicks > 5')
        .withCondition('Ctr > 0.01')
        .forDateRange('LAST_MONTH')
        .get();
    while (productGroups.hasNext()) {
      var productGroup = productGroups.next();
      productGroup.setMaxCpc(productGroup.getMaxCpc() + 0.01);
    }
  }
  //Retrieve product ads
  getProductAds() {
    var adGroupName = 'INSERT_ADGROUP_NAME_HERE';

    var shoppingAdGroup = AdsApp.shoppingAdGroups()
        .withCondition("AdGroupName = '" + adGroupName + "'")
        .get()
        .next();

    var productAds = shoppingAdGroup.ads().get();
    while (productAds.hasNext()) {
      var productAd = productAds.next();
      Logger.log(
          "Ad with ID = %s was found.",
          productAd.getId().toFixed(0));
    }
  }
  //Create product ads
  createProductAd() {
    var adGroupName = 'INSERT_ADGROUP_NAME_HERE';

    var shoppingAdGroup = AdsApp.shoppingAdGroups()
        .withCondition("AdGroupName = '" + adGroupName + "'")
        .get()
        .next();

    var adOperation = shoppingAdGroup.newAdBuilder()
        .withMobilePreferred(true)
        .build();
    var productAd = adOperation.getResult();
    Logger.log(
        "Ad with ID = %s was created.",
        productAd.getId().toFixed(0));

  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*User Lists******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve all user lists
  getAllUserLists() {
    var userlistIt = AdsApp.userlists().get();
    while (userlistIt.hasNext()){
      var userList = userlistIt.next();
      Logger.log('Name: ' + userList.getName() +
          ' Type: ' + userList.getType() +
          ' ID: ' + userList.getId());
      Logger.log(' Desc: ' + userList.getDescription() +
          ' IsOpen: ' + userList.isOpen() +
          ' MembershipLifeSpan: ' + userList.getMembershipLifeSpan());
      Logger.log(' SizeForDisplay: ' + userList.getSizeForDisplay() +
          ' SizeRangeForDisplay: ' + userList.getSizeRangeForDisplay());
      Logger.log(' SizeForSearch: ' + userList.getSizeForSearch() +
          ' SizeRangeForSearch: ' + userList.getSizeRangeForSearch());
      Logger.log(' IsReadOnly: ' + userList.isReadOnly() +
          ' IsEligibleForSearch: ' + userList.isEligibleForSearch() +
          ' IsEligibleForDisplay: ' + userList.isEligibleForDisplay());
      Logger.log(' ');
    }
  }
  //Get the number of members in a user list
  getUserListMemberCount() {
    var iterator = AdsApp.userlists().get();
    while (iterator.hasNext()) {
      var userlist = iterator.next();
      Logger.log('User List [' + userlist.getName() + ']  has ' +
          userlist.getSizeForDisplay() +
          ' members for Search campaigns and  ' +
          userlist.getSizeRangeForDisplay() +
          ' members for Display campaigns.');
    }
  }
  //Open a user list
  openUserLists() {
    var iterator = AdsApp.userlists().get();
    while (iterator.hasNext()) {
      var userlist = iterator.next();
      if (userlist.isClosed()) {
         userlist.open();
      }
    }
  }
  //Retrieve search campaigns targeted by a user list
  getSearchCampaignsTargetedByUserList() {
    var userlistIterator = AdsApp.userlists().get();
    while (userlistIterator.hasNext()) {
      var userList = userlistIterator.next();
      var campaignIterator = userList.targetedCampaigns().get();
      var campaignNames = [];

      while (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        campaignNames.push(campaign.getName());
      }

      Logger.log("User List [" + userList.getName() +
          "]  is targeting [ " +
          campaignNames.join(',') + "]");
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Video******************************************************************************************/
  /************************************************************************************************************************/
  //Retrieve all video campaigns
  getAllVideoCampaigns() {
    // AdsApp.videoCampaigns() will return all campaigns that are not
    // removed by default.
    var videoCampaigns = [];
    var videoCampaignIterator = AdsApp.videoCampaigns().get();
    Logger.log('Total campaigns found : ' +
        videoCampaignIterator.totalNumEntities());
    while (videoCampaignIterator.hasNext()) {
      var videoCampaign = videoCampaignIterator.next();
      Logger.log(videoCampaign.getName());
      videoCampaigns.push(videoCampaign);
    }
    return videoCampaigns;
    /*USAGE:
    var videoCampaigns = getAllVideoCampaigns();

    for (var i = 0; i < videoCampaigns.length; i++) {
      var videoCampaign = videoCampaigns[i];

      // Process your campaign.
    }
    USAGE*/
  }
//********************
  //Retrieve a video campaign by its name
  getVideoCampaignByName() {
    var videoCampaignIterator = AdsApp.videoCampaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (videoCampaignIterator.hasNext()) {
      var videoCampaign = videoCampaignIterator.next();
      Logger.log('Campaign Name: ' + videoCampaign.getName());
      Logger.log('Enabled: ' + videoCampaign.isEnabled());
      Logger.log('Bidding strategy: ' + videoCampaign.getBiddingStrategyType());
      Logger.log('Ad rotation: ' + videoCampaign.getAdRotationType());
      Logger.log('Start date: ' + formatDate(videoCampaign.getStartDate()));
      Logger.log('End date: ' + formatDate(videoCampaign.getEndDate()));
      return videoCampaign;
    }
    return null;
  }

  formatDate(date) {
    zeroPad(number) { return Utilities.formatString('%02d', number); }
    return (date == null) ? 'None' : zeroPad(date.year) + zeroPad(date.month) +
        zeroPad(date.day);
  }
//********************
  //Retrieve a video campaign's stats
  getVideoCampaignStats() {
    var videoCampaignIterator = AdsApp.videoCampaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (videoCampaignIterator.hasNext()) {
      var videoCampaign = videoCampaignIterator.next();
      // Fetch stats for the last month. See the DateRangeLiteral section at
      // https://developers.google.com/adwords/api/docs/guides/awql#formal_grammar
      // for a list of all supported pre-defined date ranges.
      // Note: Reports can also be used to fetch stats. See
      // https://developers.google.com/google-ads/scripts/docs/features/reports
      // for more information.
      var stats = videoCampaign.getStatsFor('LAST_MONTH');
      Logger.log(videoCampaign.getName() + ', ' + stats.getImpressions() +
          ' impressions, ' + stats.getViews() + ' views');
      return stats;
    }
    return null;
  }
  //Pause a video campaign
  pauseVideoCampaign() {
    var videoCampaignIterator = AdsApp.videoCampaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (videoCampaignIterator.hasNext()) {
      var videoCampaign = videoCampaignIterator.next();
      videoCampaign.pause();
    }
  }
  //Add a video ad group
  addVideoAdGroup() {
    var videoCampaignIterator = AdsApp.videoCampaigns()
        .withCondition('Name = "INSERT_CAMPAIGN_NAME_HERE"')
        .get();
    if (videoCampaignIterator.hasNext()) {
      var videoCampaign = videoCampaignIterator.next();
      var videoAdGroupOperation = videoCampaign.newVideoAdGroupBuilder()
          .withName('INSERT_ADGROUP_NAME_HERE')
          // This can also be 'TRUE_VIEW_IN_DISPLAY'
          .withAdGroupType('TRUE_VIEW_IN_STREAM')
          .withCpv(1.2)
          .build();
    }
  }
  //Update a video ad group
  updateAdGroup() {
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      videoAdGroup.bidding().setCpv(1.2);
      // update other properties as required here
    }
  }
  //Retrieve all video ad groups
  getAllVideoAdGroups() {
    // AdsApp.videoAdGroups() will return all ad groups that are not removed by
    // default.
    var videoAdGroups = [];
    var videoAdGroupIterator = AdsApp.videoAdGroups().get();
    Logger.log('Total adGroups found : ' + videoAdGroupIterator.totalNumEntities());
    while (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      Logger.log('AdGroup Name: ' + videoAdGroup.getName() +
          ', AdGroup Type: ' + videoAdGroup.getAdGroupType());
      videoAdGroups.push(videoAdGroup);
    }
    return videoAdGroups;
  }
  //Retrieve a video ad group by name
  getVideoAdGroupByName() {
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      Logger.log('AdGroup Name: ' + videoAdGroup.getName());
      Logger.log('AdGroup Type: ' + videoAdGroup.getAdGroupType());
      Logger.log('Enabled: ' + videoAdGroup.isEnabled());
      return videoAdGroup;
    }
    return null;
  }
  //Retrieve a video ad group's stats
  getVideoAdGroupStats() {
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      // You can also request reports for pre-defined date ranges. See
      // https://developers.google.com/adwords/api/docs/guides/awql,
      // DateRangeLiteral section for possible values.
      var stats = videoAdGroup.getStatsFor('LAST_MONTH');
      Logger.log(videoAdGroup.getName() + ', ' + stats.getImpressions() + ', ' +
          stats.getViews());
      return stats;
    }
    return null;
  }
  //Pause a video ad group
  pauseVideoAdGroup() {
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      videoAdGroup.pause();
      Logger.log('AdGroup with name: ' + videoAdGroup.getName() +
          ' has paused status: ' + videoAdGroup.isPaused());
    }
  }
  //Retrieve any video for use in an ad
  getVideo() {
    // This will just get the first valid YouTube video in the account.
    // It demonstrates how to filter to see if a video is valid for video ads.
    var videos = AdsApp.adMedia().media()
        .withCondition("Type = VIDEO")
        .get();
    var video = null;
    while (videos.hasNext()) {
      video = videos.next();
      // You have to use a YouTube video for True View ads, so only return if
      // the YouTubeVideoId exists.
      if(video.getYouTubeVideoId()) {
        return video;
      }
    }
    return null;
  }
  //Retrieve a specific video for use in an ad
  getVideoByYouTubeId() {
    // You can filter on the YouTubeVideoId if you already have that video in
    // your account to fetch the exact one you want right away.
    var videos = AdsApp.adMedia().media()
        .withCondition("Type = VIDEO AND YouTubeVideoId = ABCDEFGHIJK")
        .get();
    if (videos.hasNext()) {
      return videos.next();
    }
    return null;
  }
  //Add an in-stream video ad
  addInStreamVideoAd() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.videoAdGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    var video = getVideo(); // Defined above
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      videoAdGroup.newVideoAd().inStreamAdBuilder()
          .withAdName("In Stream Ad")
          .withDisplayUrl("http://www.example.com")
          .withFinalUrl("http://www.example.com")
          .withVideo(video)
          .build();
    }
  }
  //Add an in-stream video ad
  addInStreamVideoAd() {
    // If you have multiple adGroups with the same name, this snippet will
    // pick an arbitrary matching ad group each time. In such cases, just
    // filter on the campaign name as well:
    //
    // AdsApp.videoAdGroups()
    //     .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
    //     .withCondition('CampaignName = "INSERT_CAMPAIGN_NAME_HERE"')
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    var video = getVideo(); // Defined above
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      videoAdGroup.newVideoAd().inStreamAdBuilder()
          .withAdName("In Stream Ad")
          .withDisplayUrl("http://www.example.com")
          .withFinalUrl("http://www.example.com")
          .withVideo(video)
          .build();
    }
  }
  //Add video discovery ad
  addVideoDiscoveryAd() {
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    var video = getVideo(); // Defined above
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      videoAdGroup.newVideoAd().videoDiscoveryAdBuilder()
          .withAdName("Video Discovery Ad")
          .withDescription1("Description line 1")
          .withDescription2("Description line 2")
          .withHeadline("Headline")
          .withThumbnail("THUMBNAIL1")
          .withDestinationPage("WATCH")
          .withVideo(video)
          .build();
    }
  }
  //Pause video ads in video ad group
  pauseVideoAdsInVideoAdGroup() {
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      var videoAdsIterator = videoAdGroup.videoAds().get();
      while (videoAdsIterator.hasNext()) {
        var videoAd = videoAdsIterator.next();
        videoAd.pause();
      }
    }
  }
//************************
  //Retrieve video ads in video ad group
  getInStreamAdsInVideoAdGroup() {
    var videoAds = [];
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      var videoAdsIterator = videoAdGroup.videoAds()
          .withCondition('Type="TRUE_VIEW_IN_STREAM_VIDEO_AD"').get();
      while (videoAdsIterator.hasNext()) {
        var videoAd = videoAdsIterator.next();
        logVideoAd(videoAd);
        videoAds.push(videoAd);
      }
    }
    return videoAds;
  }

  logVideoAd(videoAd) {
    // Note that not all fields are populated for both video ad types.
    Logger.log('Video ID : ' + videoAd.getVideoId());
    Logger.log('Headline : ' + videoAd.getHeadline());
    Logger.log('Line1 : ' + videoAd.getDescription1());
    Logger.log('Line2 : ' + videoAd.getDescription2());
    Logger.log('Final URL : ' + videoAd.urls().getFinalUrl());
    Logger.log('Display URL : ' + videoAd.getDisplayUrl());
    Logger.log('Destination Page : ' + videoAd.getDestinationPage());
    Logger.log('Approval Status : ' + videoAd.getApprovalStatus());
    Logger.log('Enabled : ' + videoAd.isEnabled());
  }
//************************
  //Retrieve ad stats from a video ad group
  getVideoAdGroupAdStats() {
    var statsList = [];
    var videoAdGroupIterator = AdsApp.videoAdGroups()
        .withCondition('Name = "INSERT_ADGROUP_NAME_HERE"')
        .get();
    if (videoAdGroupIterator.hasNext()) {
      var videoAdGroup = videoAdGroupIterator.next();
      var videoAdsIterator = videoAdGroup.videoAds().get();
      while (videoAdsIterator.hasNext()) {
        var videoAd = videoAdsIterator.next();
        // You can also request reports for pre-defined date ranges. See
        // https://developers.google.com/adwords/api/docs/guides/awql,
        // DateRangeLiteral section for possible values.
        var stats = videoAd.getStatsFor('LAST_MONTH');
        Logger.log(adGroup.getName() + ', ' +
            stats.getViews() + ', ' + stats.getImpressions());
        statsList.push(stats);
      }
    }
    return statsList;
  }
  //Add in-market audience to a video ad group
  addInMarketAudienceToVideoAdGroup() {
    var ag = AdsApp.videoAdGroups()
        .withCondition('CampaignStatus != REMOVED')
        .get()
        .next();

    Logger.log(
        'AdGroup ID %s Campaign ID %s', ag.getId().toString(),
        ag.getVideoCampaign().getId().toString());

    // Get the audience ID from the list here:
    // https://developers.google.com/adwords/api/docs/appendix/codes-formats#in-market-categories

    var audience = ag.videoTargeting()
        .newAudienceBuilder()
        .withAudienceId(80428)
        .withAudienceType('USER_INTEREST')
        .build();

    Logger.log('Added Audience ID %s', audience.getResult().getId().toString());

    var audiences = ag.videoTargeting().audiences().get();
    while (audiences.hasNext()) {
      var aud = audiences.next();
      Logger.log('Retrieved Audience ID %s', aud.getId().toString());
    }
  }
  //
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
