import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Ads Manager Scripts************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


/*AdsManagerScripts******************************************************************************************/
/************************************************************************************************************************/
class AdsManagerScripts extends Own{
  constructor(configJSON){
    console.log("Paramètres de configuration valides: \n{getAllAccount:, getAccountsFromCustomerIds:, getAccountsByLabel:, getAccountByStats:, getAccountsUnderAChildManagerAccount:, updateAccountsInSeries:}")
    if(typeof configJSON != "undefined"){
      if(configJSON.getAllAccount)this.getAllAccount = getAllAccounts()
      if(configJSON.getAccountsFromCustomerIds)this.getAccountsFromCustomerIds = getAccountsFromCustomerIds(configJSON.getAccountsFromCustomerIds)
      if(configJSON.getAccountsByLabel)this.getAccountsByLabel = getAccountsByLabel(configJSON.getAccountsByLabel)
      if(configJSON.getAccountByStats)this.getAccountByStats = getAccountByStats(configJSON.getAccountByStats)
      if(configJSON.getAccountsUnderAChildManagerAccount)this.getAccountsUnderAChildManagerAccount = getAccountsUnderAChildManagerAccount(configJSON.getAccountsUnderAChildManagerAccount)
      if(configJSON.updateAccountsInSeries)this.updateAccountsInSeries = updateAccountsInSeries(configJSON.updateAccountsInSeries)
    }
  }
  getAllAccounts() {
    var accountSelector = AdsManagerApp.accounts().get();
    return this.getResults(accountSelector)
  }
  getAccountsFromCustomerIds(ids) {
    // This is useful when you are reading customer IDs from an external data
    // source, such as a Google Spreadsheet.

    // You can also use the condition "CustomerId in ['123-456-7890',
    // '345-678-9000', '890-123-6000']".
    var accountSelector = this.addCondition(AdsManagerApp.accounts(), {widthIds: typeof ids == "string" ? [ids] : ids})
    return this.getResults(accountSelector)
  }
  getAccountsByLabel(labelName) {
    // Only CONTAINS and DOES_NOT_CONTAIN operators are supported.
    var accountSelector = this.addCondition(AdsManagerApp.accounts(), "LabelNames CONTAINS '"+labelName+"'")
    return this.getResults(accountSelector)
  }
  getAccountByStats(objectCondition) {
    // This is useful when you need to identify accounts that were performing
    // well (or poorly) in a given time frame.
    var condition = objectCondition.condition
    var dateRange = objectCondition.dateRange
    var orderBy = objectCondition.orderBy

    if(!condition || !dateRange)this.throwerr("getAccountByStats::objectCondition={!condition:['',]!,!dateRange:''!,orderBy:'',...}")
    var accountSelector = this.addCondition(AdsManagerApp.accounts(), objectCondition)
    return this.getResults(accountSelector, {stats: objectCondition.dateRange})
  }
  getAccountsUnderAChildManagerAccount(id) {
    // This is useful if you want to restrict your script to process only accounts
    // under a specific child manager account. This allows you to manage specific
    // child manager account hierarchies from the top-level manager account
    // without having to duplicate your script in the child manager account.

    var accountSelector = this.addCondition(AdsManagerApp.accounts(), "ManagerCustomerId = '"+id+"'")
    return this.getResults(accountSelector)
  }
  updateAccountsInSeries(objectConditionAccount, objectConditionEntities) {
    // You can use this approach when you have only minimal processing to
    // perform in each of your client accounts.
    var condition = objectConditionAccount.condition
    var dateRange = objectConditionAccount.dateRange
    var orderBy = objectConditionAccount.orderBy

    // Select the accounts to be processed.
    var accountSelector = this.addCondition(AdsManagerApp.accounts(), objectConditionAccount.condition)

    // Save the manager account, to switch back later.
    var managerAccount = AdsApp.currentAccount();

    while (accountSelector.hasNext()) {
      var account = accountSelector.next();
      // Switch to the account you want to process.
      AdsManagerApp.select(account);
      for(a in objectConditionEntities){
        var var theIterator
        var condition = objectConditionEntities[a].condition
        var dateRange = objectConditionEntities[a].dateRange
        var orderBy = objectConditionEntities[a].orderBy

        switch(a){
          case"campaigns":theIterator = AdsApp.campaigns();break
          case"adGroups":theIterator = AdsApp.adGroups();break
          case"ad":theIterator = AdsApp.ads();break
          case"keywords":theIterator = AdsApp.keywords();break
          case"labels":theIterator = AdsApp.label();break
          default:break;
        }
        var theIterator = this.addCondition(AdsApp.campaigns(), condition)
        theIterator = this.getResults(theIterator)
        for(i = theIterator.length; i > 0; i--){
          switch(objectConditionEntities[a].action){
            case"pause": theIterator[i].entity.pause();break;
            default:break;
          }
        }
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*updateAccountsInParallel***************************************************************************************************************/
  /************************************************************************************************************************/
  updateAccountsInParallel(objectConditionAccount) {
    // You can use this approach when you have a large amount of processing
    // to do in each of your client accounts.

    // Select the accounts to be processed. You can process up to 50 accounts.
    var accountSelector = this.addCondition(AdsManagerApp.accounts(), objectConditionAccount.condition)

    // Process the account in parallel. The callback method is optional.
    accountSelector.executeInParallel(/*process function*/'updateAccountsInParallel___processAccount', 'updateAccountsInParallel___allFinished'/*callback function*/);
  }
    /**
     * Process one account at a time. This method is called by the executeInParallel
     * method call in updateAccountsInParallel for every account that
     * it processes.
     *
     * @return {Number} the number of campaigns paused by this method.
     */
    updateAccountsInParallel___processAccount() {
      // executeInParallel will automatically switch context to the account being
      // processed, so all calls to AdsApp will apply to the selected account.
      var account = AdsApp.currentAccount();
      var campaignIterator = AdsApp.campaigns()
          .withCondition("LabelNames = 'Christmas promotion'")
          .get();

      while (campaignIterator.hasNext()) {
        var campaign = campaignIterator.next();
        Logger.log('Pausing campaign %s in account %s', campaign.getName(),
            account.getCustomerId());
        campaign.pause();
      }
      // Optional: return a string value. If you have a more complex JavaScript
      // object to return from this method, use JSON.stringify(value). This value
      // will be passed on to the callback method, if specified, in the
      // executeInParallel method call.
      return campaignIterator.totalNumEntities().toFixed(0);
    }

    /**
     * Post-process the results from processAccount. This method will be called
     * once all the accounts have been processed by the executeInParallel method
     * call.
     *
     * @param {Array.<ExecutionResult>} results An array of ExecutionResult objects,
     * one for each account that was processed by the executeInParallel method.
     */
    updateAccountsInParallel___allFinished(results) {
      for (var i = 0; i < results.length; i++) {
        // Get the ExecutionResult for an account.
        var result = results[i];

        Logger.log('Customer ID: %s; status = %s.', result.getCustomerId(),
            result.getStatus());

        // Check the execution status. This can be one of ERROR, OK, or TIMEOUT.
        if (result.getStatus() == 'ERROR') {
          Logger.log("-- Failed with error: '%s'.", result.getError());
        } else if (result.getStatus() == 'OK') {
          // This is the value you returned from processAccount method. If you
          // used JSON.stringify(value) in processAccount, you can use
          // JSON.parse(text) to reconstruct the JavaScript object.
          var retval = result.getReturnValue();
          Logger.log('--Processed %s campaigns.', retval);
        } else {
          // Handle timeouts here.
        }
      }
    }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
/**
 * Process one account at a time. This method is called by the executeInParallel
 * method call in updateAccountsInParallel for every account that
 * it processes.
 *
 * @return {Number} the number of campaigns paused by this method.
 */
function updateAccountsInParallel___processAccount() {
  // executeInParallel will automatically switch context to the account being
  // processed, so all calls to AdsApp will apply to the selected account.
  var account = AdsApp.currentAccount();
  var campaignIterator = AdsApp.campaigns()
      .withCondition("LabelNames = 'Christmas promotion'")
      .get();

  while (campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    Logger.log('Pausing campaign %s in account %s', campaign.getName(),
        account.getCustomerId());
    campaign.pause();
  }
  // Optional: return a string value. If you have a more complex JavaScript
  // object to return from this method, use JSON.stringify(value). This value
  // will be passed on to the callback method, if specified, in the
  // executeInParallel method call.
  return campaignIterator.totalNumEntities().toFixed(0);
}

/**
 * Post-process the results from processAccount. This method will be called
 * once all the accounts have been processed by the executeInParallel method
 * call.
 *
 * @param {Array.<ExecutionResult>} results An array of ExecutionResult objects,
 * one for each account that was processed by the executeInParallel method.
 */
function updateAccountsInParallel___allFinished(results) {
  for (var i = 0; i < results.length; i++) {
    // Get the ExecutionResult for an account.
    var result = results[i];

    Logger.log('Customer ID: %s; status = %s.', result.getCustomerId(),
        result.getStatus());

    // Check the execution status. This can be one of ERROR, OK, or TIMEOUT.
    if (result.getStatus() == 'ERROR') {
      Logger.log("-- Failed with error: '%s'.", result.getError());
    } else if (result.getStatus() == 'OK') {
      // This is the value you returned from processAccount method. If you
      // used JSON.stringify(value) in processAccount, you can use
      // JSON.parse(text) to reconstruct the JavaScript object.
      var retval = result.getReturnValue();
      Logger.log('--Processed %s campaigns.', retval);
    } else {
      // Handle timeouts here.
    }
  }
/*---end-***************************************************************************************************************/
/************************************************************************************************************************/
/****************************************************************************************************************/
/************************************************************************************************************************/

/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Ads Manager Scripts************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/
