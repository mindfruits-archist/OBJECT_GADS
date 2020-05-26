class adsInheritence{
  contructor(){

  }
/*Shopping*/
/*Shopping*/
/*Shopping*/
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
    var toReturn = {padding: padding, description: description, getDimension: productGroup.getDimension(), getMaxCpc: productGroup.getMaxCpc(), isOtherCase: productGroup.isOtherCase(), getId: productGroup.getId().toFixed()}
    var childProductGroups = productGroup.children().get();
    toReturn.childProductGroup = []
    while (childProductGroups.hasNext()) {
      var childProductGroup = childProductGroups.next();
      toReturn.childProductGroups.push(childProductGroup)
      toReturn.children = walkHierarchy(childProductGroup, level + 1);
    }
    return toReturn
  }
/********/
/********/
/********/

/*Video*/
/*Video*/
/*Video*/
  formatDate(date) {
    zeroPad(number) { return Utilities.formatString('%02d', number); }
    return (date == null) ? 'None' : zeroPad(date.year) + zeroPad(date.month) +
        zeroPad(date.day);
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
/********/
/********/
/********/


}
