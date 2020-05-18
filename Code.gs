"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ads = function () {
  function Ads(ids, options) {
    _classCallCheck(this, Ads);

    var tmp;
    if (typeof ids == "undefined") throw "Vous devez entrer au moins 1 paramètre à la class Ads (au moins 1 identifiant GAds)";else if (typeof ids == "string") {
      if (ids == "all") ids = getAllClients(); //NOT TESTED YET
      else if (ids == "qlqchose") {} //NOT TESTED YET
        else ids = [ids];
    } else if (!Array.isArray(ids)) throw "Le 1er paramètre de la class Ads doit être soit un string (googleAds ID), soit un array (de googleAds IDs)";
    this.id = ids;
    if (typeof options == 'undefined') {
      Logger.log("Le 2nd paramètre 'options' entré n'est pas valide, il a été mit par defaut à 'full'");
      options = "full";
    } else if ((typeof options === "undefined" ? "undefined" : _typeof(options)) == 'object' || !Array.isArray(options)) {
      //CASE NOT USED YET
    }
    this.options = options;

    this.initGlobalVariables();

    if (typeof options == "string") {
      this.initVarsForFullReport(); //NOT TESTED YET
      switch (options) {
        case "full":
          break;
        case "accounts":case "account":
          this.bool.campaigns = false;this.bool.groups = false;this.bool.ads = false;break;
        case "campaigns":case "campaign":
          this.bool.groups = false;this.bool.ads = false;break;
        case "groups":case "group":
          this.bool.ads = false;break;
        case "ads":case "ad":
          break;
        case "none":
          this.bool = { accounts: false, campaigns: false, groups: false, ads: false };break;
        default:
          break;
      }
      for (a in ids) {
        if (this.bool.accounts) {
          this.getAll(ids[a]);
        }
      }
    } else {
      if (options.wheatherScript || options.wheatherScript == "") {
        this.weatherCampaignsList = this.getAllClients_weatherScript();
      }
      if (options.wheatherScript_) {
        this.weatherCampaignsDetails = this.getAllClients_weatherScript_(options.wheatherScript_);
      }
    }
  }

  _createClass(Ads, [{
    key: "initGlobalVariables",
    value: function initGlobalVariables() {
      this.myDate();
      var d = new Date();
      this.date = d;
    }
    /*********************************************************************************************************************************************/
    /****************************************RECURSIVES FUNCTION FOR INITIALIZING THE ADS CLASS WITH ARGMENT options AS STRING*****************************************************************************/
    /*********************************************************************************************************************************************/
    /*********************************************************************************************************************************************/

  }, {
    key: "initVarsForFullReport",
    value: function initVarsForFullReport() {
      this.date_ = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
      this.bool = { accounts: true, campaigns: true, groups: true, ads: true };
      this.tmp = {};
      this.accounts = { nbr: this.id.length };
      this.campaigns = {};
      this.groups = {};
      this.ads = {};
      this._accounts = {};
      this._campaigns = {};
      this._groups = {};
      this._ads = {};
      this.accounts_ = {};
      this.campaigns_ = {};
      this.groups_ = {};
      this.ads_ = {};
    }
  }, {
    key: "getAll",
    value: function getAll(id) {
      this.tmp.nbrCampaigns = 0;
      this.tmp.nbrGroups = 0;
      this.tmp.nbrAds = 0;
      this.getAccount(id);
      this.campaigns[id].nbr = this.tmp.nbrCampaigns;
      this.groups[id].nbr = this.tmp.nbrGroups;
      this.ads[id].nbr = this.tmp.nbrAds;
      if (this.bool.campaigns) Logger.log("Le client '" + this.accounts[id].name + "' a: " + this.tmp.nbrCampaigns + " campagnes actives");
      if (this.bool.groups) Logger.log("Le client '" + this.accounts[id].name + "' a: " + this.tmp.nbrGroups + " groupes d'annonces actives");
      if (this.bool.ads) Logger.log("Le client '" + this.accounts[id].name + "' a: " + this.tmp.nbrAds + " annonces ad actives");
    }
  }, {
    key: "getAccount",
    value: function getAccount(accountId) {
      // Logger.log("getAccount this.tmp.accountId: %s", this.tmp.accountId)
      this.tmp.accountId = accountId;
      var o,
          account,
          d = new Date(),
          dd = new Date();
      if (typeof accountId == "undefined") throw "Vous devez entrer un numéro de compte Ads";else if (typeof accountId == "string") accountId = [accountId];
      var accountSelector = AdsManagerApp.accounts().withIds(accountId);
      var accountIterator = accountSelector.get();
      if (accountIterator.hasNext()) {
        account = accountIterator.next();
        o = {};
        o.id = account.getCustomerId();
        o.name = account.getName();
        o.budget = 0;
        if (!this.bool.campaigns) o.budget = this.getBudget(account);
        o.stats = {};
        d = new Date(d.setDate(d.getDate() - 2));
        o.stats[this.date.getYearDay()] = this.getStats(account);
        o.stats[this.date.getYearDay() - 1] = this.getStats(account, "YESTERDAY");
        o.stats[this.date.getYearDay() - 2] = this.getStats(account, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate() - 1), d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate() - 2));
        o.stats_delta = {};
        o.stats_delta[this.date.getYearDay()] = this.delta(o.stats[this.date.getYearDay() - 2], o.stats[this.date.getYearDay() - 1]);
        d = new Date(), dd = new Date();
        d.setDay(0);dd.setDay(0);dd.setDate(dd.getDate() - 7);
        o.stats_week = {};
        o.stats_week[this.date.getWeek() - 1] = this.getStats(account, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate()), dd.getFullYear() + "" + this.completedate(dd.getMonth() + 1) + "" + this.completedate(dd.getDate()));
        d.setDate(d.getDate() - 7);dd.setDate(dd.getDate() - 7);
        o.stats_week[this.date.getWeek() - 2] = this.getStats(account, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate()), dd.getFullYear() + "" + this.completedate(dd.getMonth() + 1) + "" + this.completedate(dd.getDate()));
        o.stats_week_delta = {};
        o.stats_week_delta[this.date.getWeek()] = this.delta(o.stats_week[this.date.getWeek() - 2], o.stats_week[this.date.getWeek() - 1]);
        o.costs = this.getCosts(account);
        o.campaigns = {};
        this._accounts[accountId] = { object: account, campaigns: {} };
        this.accounts[accountId] = o;
        this.accounts_[accountId] = { id: o.id, name: o.name, stats: o.stats, stats_week: o.stats_week, stats_week_delta: o.stats_week_delta, costs: o.costs, budget: o.budget };
        this._campaigns[accountId] = {};
        this.campaigns[accountId] = {};
        this.campaigns_[accountId] = {};
        this._groups[accountId] = {};
        this.groups[accountId] = {};
        this.groups_[accountId] = {};
        this._ads[accountId] = {};
        this.ads[accountId] = {};
        this.ads_[accountId] = {};
        // Logger.log("account id: "+o.id)
      } else throw "L'id '" + accountId + "' ne correspond à aucun compte client.";
      if (this.bool.campaigns) this.getCampaignsFromAccount(account);
      this.campaigns[accountId] = this.accounts[accountId].campaigns;
    }
  }, {
    key: "getCampaignsFromAccount",
    value: function getCampaignsFromAccount(account) {
      // Logger.log("getCampaignsFromAccount this.tmp.accountId: %s", this.tmp.accountId)
      var arr = [],
          ite,
          sel,
          o,
          campaign,
          i = 0,
          d = new Date(),
          dd = new Date();

      AdsManagerApp.select(account);
      sel = AdsApp.campaigns();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        campaign = ite.next();
        this.tmp.campaignId = campaign.getId();
        o = {};
        o.id = campaign.getId();
        o.accountId = this.tmp.accountId;
        o.name = campaign.getName();
        o.budget = campaign.getBudget().getAmount();
        Logger.log("------------------------");
        Logger.log("budget: %s €", o.budget);
        o.stats = {};
        d = new Date(d.setDate(d.getDate() - 2));
        o.stats[this.date.getYearDay()] = this.getStats(campaign);
        o.stats[this.date.getYearDay() - 1] = this.getStats(campaign, "YESTERDAY");
        o.stats[this.date.getYearDay() - 2] = this.getStats(campaign, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate() - 1), d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate() - 2));
        o.stats_delta = {};
        o.stats_delta[this.date.getYearDay()] = this.delta(o.stats[this.date.getYearDay() - 2], o.stats[this.date.getYearDay() - 1]);
        d = new Date(), dd = new Date();
        d.setDay(0);dd.setDay(0);dd.setDate(dd.getDate() - 7);
        o.stats_week = {};
        o.stats_week[this.date.getWeek() - 1] = this.getStats(campaign, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate()), dd.getFullYear() + "" + this.completedate(dd.getMonth() + 1) + "" + this.completedate(dd.getDate()));
        d.setDate(d.getDate() - 7);dd.setDate(dd.getDate() - 7);
        o.stats_week[this.date.getWeek() - 2] = this.getStats(campaign, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate()), dd.getFullYear() + "" + this.completedate(dd.getMonth() + 1) + "" + this.completedate(dd.getDate()));
        o.stats_week_delta = {};
        o.stats_week_delta[this.date.getWeek()] = this.delta(o.stats_week[this.date.getWeek() - 2], o.stats_week[this.date.getWeek() - 1]);
        o.labels = this.getLabels(campaign);
        o.keywords = this.getKeywords(campaign);
        o.costs = this.getCosts(campaign);
        o.groups = {};
        this.accounts_[this.tmp.accountId].budget += o.budget;
        this._accounts[this.tmp.accountId][this.tmp.campaignId] = { object: campaign, groups: {} };
        this.accounts[this.tmp.accountId].campaigns[this.tmp.campaignId] = o;
        this._campaigns[this.tmp.accountId][this.tmp.campaignId] = { object: campaign, groups: {} };
        this.campaigns[this.tmp.accountId][this.tmp.campaignId] = o;
        this.campaigns_[this.tmp.accountId][this.tmp.campaignId] = { id: o.id, accountId: o.accountId, name: o.name, keywords: o.keywords, stats: o.stats, stats_week: o.stats_week, stats_week_delta: o.stats_week_delta, costs: o.costs, budget: o.budget };
        this._groups[this.tmp.campaignId] = {};
        this.groups_[this.tmp.campaignId] = {};
        if (this.bool.groups) this.getGroupsFromCampaign(campaign);
        i++;
        // Logger.log("campaign id: "+o.id)
      }
      Logger.log("this.tmp.nbrCampaigns: %s\n i: %s", this.tmp.nbrCampaigns, i);
      this.tmp.nbrCampaigns += i;
    }
  }, {
    key: "getGroupsFromCampaign",
    value: function getGroupsFromCampaign(campaign) {
      // Logger.log("getGroupsFromCampaign this.tmp.accountId: %s", this.tmp.accountId)
      var arr = [],
          oo = {},
          ite,
          sel,
          o,
          group,
          i = 0,
          d = new Date(),
          dd = new Date();
      var campaignId = this.tmp.campaignId;

      sel = campaign.adGroups();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        group = ite.next();
        this.tmp.groupId = group.getId();
        o = {};
        o.id = group.getId();
        o.accountId = this.tmp.accountId;
        o.campaignId = this.tmp.campaignId;
        o.name = group.getName();
        o.stats = {};
        d = new Date(d.setDate(d.getDate() - 2));
        o.stats[this.date.getYearDay()] = this.getStats(group);
        o.stats[this.date.getYearDay() - 1] = this.getStats(group, "YESTERDAY");
        o.stats[this.date.getYearDay() - 2] = this.getStats(group, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate() - 1), d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate() - 2));
        o.stats_delta = {};
        o.stats_delta[this.date.getYearDay()] = this.delta(o.stats[this.date.getYearDay() - 2], o.stats[this.date.getYearDay() - 1]);
        d = new Date(), dd = new Date();
        d.setDay(0);dd.setDay(0);dd.setDate(dd.getDate() - 7);
        o.stats_week = {};
        o.stats_week[this.date.getWeek() - 1] = this.getStats(group, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate()), dd.getFullYear() + "" + this.completedate(dd.getMonth() + 1) + "" + this.completedate(dd.getDate()));
        d.setDate(d.getDate() - 7);dd.setDate(dd.getDate() - 7);
        o.stats_week[this.date.getWeek() - 2] = this.getStats(group, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate()), dd.getFullYear() + "" + this.completedate(dd.getMonth() + 1) + "" + this.completedate(dd.getDate()));
        o.stats_week_delta = {};
        o.stats_week_delta[this.date.getWeek()] = this.delta(o.stats_week[this.date.getWeek() - 2], o.stats_week[this.date.getWeek() - 1]);
        o.labels = this.getLabels(group);
        o.keywords = this.getKeywords(group);
        o.costs = this.getCosts(group);
        o.ads = {};
        this._accounts[this.tmp.accountId][this.tmp.campaignId][this.tmp.groupId] = { object: group, ads: {} };
        this.accounts[this.tmp.accountId].campaigns[this.tmp.campaignId].groups[this.tmp.groupId] = o;
        this._campaigns[this.tmp.accountId][this.tmp.campaignId][this.tmp.groupId] = { object: group, ads: {} };
        this.campaigns[this.tmp.accountId][this.tmp.campaignId].groups[this.tmp.groupId] = o;
        this._groups[this.tmp.campaignId][this.tmp.groupId] = { object: group, ads: {} };
        this.groups[this.tmp.accountId][this.tmp.groupId] = o;
        this.groups_[this.tmp.accountId][this.tmp.groupId] = { id: o.id, accountId: o.accountId, campaignId: o.campaignId, name: o.name, keywords: o.keywords, stats: o.stats, stats_week: o.stats_week, stats_week_delta: o.stats_week_delta, costs: o.costs };
        this._ads[this.tmp.groupId] = {};
        this.ads_[this.tmp.groupId] = {};
        if (this.bool.ads) this.getAdsFromGroup(group);
        i++;
        // Logger.log("group id: "+o.id)
      }
      Logger.log("this.tmp.nbrGroups: %s\n i: %s", this.tmp.nbrGroups, i);
      this.tmp.nbrGroups += i;
    }
  }, {
    key: "getAdsFromGroup",
    value: function getAdsFromGroup(group) {
      // Logger.log("getAdsFromGroup this.tmp.accountId: %s", this.tmp.accountId)
      var arr = [],
          ite,
          sel,
          o,
          ad,
          i = 0,
          d = new Date(),
          dd = new Date();
      var campaignId = group.getCampaign().getId();
      var groupId = group.getId();

      sel = group.ads();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        ad = ite.next();
        this.tmp.adId = ad.getId();
        //o = {costs: {[this.date.getDate()]: 0, [this.date.getWeek()]: 0, [this.date.getMonth()+1]: 0}}
        o = {};
        o.id = ad.getId();
        o.accountId = this.tmp.accountId;
        o.campaignId = this.tmp.campaignId;
        o.groupId = this.tmp.groupId;
        o.name = ad.getHeadline();
        o.stats = {};
        d = new Date(d.setDate(d.getDate() - 2));
        o.stats[this.date.getYearDay()] = this.getStats(ad);
        o.stats[this.date.getYearDay() - 1] = this.getStats(ad, "YESTERDAY");
        o.stats[this.date.getYearDay() - 2] = this.getStats(ad, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate() - 1), d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate() - 2));
        o.stats_delta = {};
        o.stats_delta[this.date.getYearDay()] = this.delta(o.stats[this.date.getYearDay() - 2], o.stats[this.date.getYearDay() - 1]);
        d = new Date(), dd = new Date();
        d.setDay(0);dd.setDay(0);dd.setDate(dd.getDate() - 7);
        o.stats_week = {};
        o.stats_week[this.date.getWeek() - 1] = this.getStats(ad, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate()), dd.getFullYear() + "" + this.completedate(dd.getMonth() + 1) + "" + this.completedate(dd.getDate()));
        d.setDate(d.getDate() - 7);dd.setDate(dd.getDate() - 7);
        o.stats_week = {};
        o.stats_week[this.date.getWeek() - 2] = this.getStats(ad, d.getFullYear() + "" + this.completedate(d.getMonth() + 1) + "" + this.completedate(d.getDate()), dd.getFullYear() + "" + this.completedate(dd.getMonth() + 1) + "" + this.completedate(dd.getDate()));
        o.stats_week_delta = {};
        o.stats_week_delta[this.date.getWeek()] = this.delta(o.stats_week[this.date.getWeek() - 2], o.stats_week[this.date.getWeek() - 1]);
        o.url = ad.urls().getFinalUrl();
        o.type = ad.getType();
        o.labels = this.getLabels(ad);
        //o.keywords = this.getKeywords(ad)
        o.costs = this.getCosts(ad);
        arr.push(o);
        this._accounts[this.tmp.accountId][this.tmp.campaignId][this.tmp.groupId][this.tmp.adId] = { object: ad, labels: o.labels };
        this.accounts[this.tmp.accountId].campaigns[this.tmp.campaignId].groups[this.tmp.groupId].ads[this.tmp.adId] = o;
        this._campaigns[this.tmp.accountId][this.tmp.campaignId][this.tmp.groupId][this.tmp.adId] = { object: ad, labels: o.labels };
        this.campaigns[this.tmp.accountId][this.tmp.campaignId].groups[this.tmp.groupId].ads[this.tmp.adId] = o;
        this._groups[this.tmp.campaignId][this.tmp.groupId][this.tmp.adId] = { object: ad, labels: o.labels };
        this.groups[this.tmp.accountId][this.tmp.groupId].ads[this.tmp.adId] = o;
        this._ads[this.tmp.groupId][this.tmp.adId] = { object: ad, labels: o.labels };
        this.ads[this.tmp.accountId][this.tmp.adId] = o;
        this.ads_[this.tmp.accountId][this.tmp.adId] = { id: o.id, accountId: o.accountId, campaignId: o.campaignId, groupId: o.groupId, name: o.name, url: o.url, type: o.type, stats: o.stats, stats_week: o.stats_week, stats_week_delta: o.stats_week_delta, costs: o.costs };
        i++;
        // Logger.log("ad id: "+o.id)
      }
      Logger.log("this.tmp.nbrAds: %s\n i: %s", this.tmp.nbrAds, i);
      this.tmp.nbrAds += i;
    }
    /***************************************************************************************************************************************************************************/
    /*****************************************GET OBJECTS OR IDS FROM ID(S)***********************************************************************************************************/
    /***************************************************************************************************************************************************************************/

    /******************************************GET OBJECTS-CHILDREN FROM OBJECT-PARENT'S IDS ARRAY**************************************************************************************************************/

  }, {
    key: "getAccountsFromAccountIds",
    value: function getAccountsFromAccountIds(accountId) {
      if (typeof accountId == "undefined") throw "Vous devez entrer un array d'ids en 2nd argument";else if (typeof accountId == "string") accountId = [accountId];

      var arr = [],
          accounts = [],
          ite = AdsManagerApp.accounts().withIds(accountId).get();
      while (ite.hasNext()) {
        accounts.push(ite.next());
      }return accounts;
    }
  }, {
    key: "getCampaignsFromCampaignIds",
    value: function getCampaignsFromCampaignIds(accountId, arrIds) {
      if (typeof accountId == "undefined" && accountId.indexOf('-') == -1) throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];
      if (typeof arrIds == "undefined") throw "Vous devez entrer un array d'ids en 2nd argument";else if (typeof arrIds == "string") arrIds = [arrIds];

      var sel,
          ite,
          campaign,
          o = {},
          account = AdsManagerApp.accounts().withIds(accountId).get().next();
      AdsManagerApp.select(account);
      sel = AdsApp.campaigns().withIds(arrIds);
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        campaign = ite.next();
        o[campaign.getId()] = campaign;
      }
      return o;
    }
  }, {
    key: "getGroupsFromGroupIds",
    value: function getGroupsFromGroupIds(accountId, arrIds) {
      if (typeof accountId == "undefined") throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];
      if (typeof arrIds == "undefined") throw "Vous devez entrer un array d'ids en 2nd argument";else if (typeof arrIds == "string") arrIds = [arrIds];

      var sel,
          ite,
          group,
          o = {},
          account = AdsManagerApp.accounts().withIds(accountId).get().next();
      AdsManagerApp.select(account);
      sel = AdsApp.adGroups().withIds(arrIds);
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        group = ite.next();
        o[group.getId()] = group;
      }
      return o;
    }
  }, {
    key: "getAdsFromAdIds",
    value: function getAdsFromAdIds(accountId, arrIds) {
      if (typeof accountId == "undefined") throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];
      if (typeof arrIds == "undefined") throw "Vous devez entrer un array d'ids en 2nd argument";else if (typeof arrIds == "string") arrIds = [arrIds];

      var sel,
          ite,
          ad,
          o = {},
          account = AdsManagerApp.accounts().withIds(accountId).get().next();
      AdsManagerApp.select(account);
      sel = AdsApp.campaigns().withIds(arrIds);
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        ad = ite.next();
        o[ad.getId()] = ad;
      }
      return o;
    }
    /***************************************GET OBJECTS-CHILDREN FROM OBJECT-PARENT'S ID******************************************************************************************************************/

  }, {
    key: "getCampaignsFromAccountId",
    value: function getCampaignsFromAccountId(accountId) {
      if (typeof accountId == "undefined" && accountId.indexOf('-') == -1) throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];

      var sel,
          ite,
          campaign,
          o = {},
          account = this.getAccountsFromAccountIds(accountId)[0];
      AdsManagerApp.select(account);
      sel = AdsApp.campaigns();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        campaign = ite.next();
        o[campaign.getId()] = campaign;
      }
      return o;
    }
  }, {
    key: "getGroupsFromCampaignId",
    value: function getGroupsFromCampaignId(accountId, campId) {
      if (typeof accountId == "undefined" && accountId.indexOf('-') == -1) throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];
      if (typeof campId == "undefined") throw "Vous devez entrer un array d'ids en 2nd argument";else if (typeof campId == "string") campId = [campId];

      var sel,
          ite,
          group,
          o = {},
          account = this.getAccountsFromAccountIds(accountId)[0];
      AdsManagerApp.select(account);
      sel = AdsApp.campaigns().widthId(campId).withCondition("Status = ENABLED").get().adGroups();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        group = ite.next();
        o[group.getId()] = group;
      }
      return o;
    }
  }, {
    key: "getAdsFromGroupId",
    value: function getAdsFromGroupId(accountId, groupId) {
      if (typeof accountId == "undefined" && accountId.indexOf('-') == -1) throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];
      if (typeof groupId == "undefined") throw "Vous devez entrer un array d'ids en 2nd argument";else if (typeof groupId == "string") groupId = [groupId];

      var sel,
          ite,
          ad,
          o = {},
          account = this.getAccountsFromAccountIds(accountId)[0];
      AdsManagerApp.select(account);
      sel = AdsApp.adGroups().widthId(groupId).withCondition("Status = ENABLED").get().ads();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        ad = ite.next();
        o[ad.getId()] = ad;
      }
      return o;
    }
    /******************************************GET OBJECTS-CHILDRENs IDS FROM PARENT-OBJECT'S ID********************************************************************************************************************/

  }, {
    key: "getCampaignsIdsFromAccountId",
    value: function getCampaignsIdsFromAccountId(accountId) {
      if (typeof accountId == "undefined" && accountId.indexOf('-') == -1) throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];

      var sel,
          ite,
          arr = [],
          account = this.getAccountsFromAccountIds(accountId)[0];
      AdsManagerApp.select(account);
      sel = AdsApp.campaigns();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        arr.push(ite.next().getId());
      }return arr;
    }
  }, {
    key: "getGroupsIdsFromCampaignId",
    value: function getGroupsIdsFromCampaignId(accountId, campId) {
      if (typeof accountId == "undefined" && accountId.indexOf('-') == -1) throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];
      if (typeof arrIds == "undefined") throw "Vous devez entrer un array d'ids en 2nd argument";else if (typeof arrIds == "string") arrIds = [arrIds];

      var sel,
          ite,
          arr = [],
          account = this.getAccountsFromAccountIds(accountId)[0];
      AdsManagerApp.select(account);
      sel = AdsApp.campaigns().widthId(campId).withCondition("Status = ENABLED").get().adGroups();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        arr.push(ite.next().getId());
      }return arr;
    }
  }, {
    key: "getAdsIdsFromGroupId",
    value: function getAdsIdsFromGroupId(accountId, groupId) {
      if (typeof accountId == "undefined" && accountId.indexOf('-') == -1) throw "Vous devez entrer un numéro de compte Ads en 1er argument";else if (typeof accountId == "string") accountId = [accountId];
      if (typeof arrIds == "undefined") throw "Vous devez entrer un array d'ids en 2nd argument";else if (typeof arrIds == "string") arrIds = [arrIds];

      var sel,
          ite,
          arr = [],
          account = this.getAccountsFromAccountIds(accountId)[0];
      AdsManagerApp.select(account);
      sel = AdsApp.adGroups().widthId(groupId).withCondition("Status = ENABLED").get().ads();
      ite = sel.withCondition("Status = ENABLED").get();
      while (ite.hasNext()) {
        arr.push(ite.next().getId());
      }return arr;
    }
    /***************************************************************************************************************************************************************************/
    /***************************************************************************************************************************************************************************/
    /******************************************GET STATISTICS DATAS**********************************************************************************************************/
    /***************************************************************************************************************************************************************************/

  }, {
    key: "getBudget",
    value: function getBudget(adObject, period) {
      var a = void 0,
          budgetAmount = 0;
      if (typeof period == "undefined") period = "THIS_MONTH";
      if (adObject.getEntityType() == "Account") {
        AdsManagerApp.select(adObject);
        //RECUPERER ICI TOUTES LES CAMPAGNES LIEES A CE COMPTE,
        //PUIS CREER UN BOUCLE EN APPELANT this.getBudget() POUR CHACUNE DE CES CAMPAGNES
        var _budgetSelector = AdsApp.budgets().forDateRange("THIS_MONTH");

        var _budgetIterator = _budgetSelector.get();
        while (_budgetIterator.hasNext()) {
          var _budget = _budgetIterator.next();
          var campaigns = _budget.campaigns().withCondition("Status = ENABLED").get();
          while (campaigns.hasNext()) {
            var campaign = campaigns.next();
            //Logger.log("BUDGETS::"+adObject.getName()+"::campaign.getName(): %s", campaign.getName())
            budgetAmount += this.getBudget(campaign);
          }
        }
        return budgetAmount;
      } else {
        var amount = 0,
            budgetSelector = AdsApp.budgets().forDateRange(period);

        var budgetIterator = budgetSelector.get();
        while (budgetIterator.hasNext()) {
          var budget = budgetIterator.next();
          amount += budget.getAmount();
        }
        return amount;
      }
    }
  }, {
    key: "getStats",
    value: function getStats(adObject, period, rangeTo) {
      var tmp;
      if (typeof rangeTo == "undefined") {
        if (typeof period == "undefined") period = "TODAY";
        tmp = adObject.getStatsFor(period);
      } else tmp = adObject.getStatsFor(rangeTo, period);
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
      };
      if (adObject.getEntityType == "Campaign") {
        o.startDate = adObject.getEndDate();
        o.startDate = adObject.getStartDate();
      }
      return o;
    }
  }, {
    key: "getLabels",
    value: function getLabels(adsapp) {
      var arr = [],
          o,
          label,
          labelIterator,
          labelSelector = adsapp.labels();

      labelIterator = labelSelector.get();
      while (labelIterator.hasNext()) {
        o = {};
        label = labelIterator.next();
        o.id = label.getId();
        o.name = label.getName();
        o.description = label.getDescription();
        o.color = label.getColor();
        arr.push(o);
      }
      return arr;
    }
  }, {
    key: "getKeywords",
    value: function getKeywords(adsapp) {
      var arr = [],
          o,
          keyword,
          keywordIterator,
          keywordSelector = adsapp.keywords();

      keywordIterator = keywordSelector.get();
      while (keywordIterator.hasNext()) {
        o = {};
        keyword = keywordIterator.next();
        bidding = keyword.bidding();
        o.id = keyword.getId();
        o.text = keyword.getText();
        o.qualityscore = keyword.getQualityScore();
        o.firstPageCpc = keyword.getFirstPageCpc();
        o.topOfPageCpc = keyword.getTopOfPageCpc();
        o.bidding = {};
        o.bidding.cpc = bidding.getCpc();
        o.bidding.cpm = bidding.getCpm();
        o.bidding.strategyType = bidding.getStrategyType();
        arr.push(o);
      }
      return arr;
    }
  }, {
    key: "delta",
    value: function delta(fromObj, toObj) {
      var a,
          aa,
          o = {};
      for (a in toObj) {
        o[a] = (toObj[a] - fromObj[a]) / fromObj[a] * 100;
      }return o;
    }
  }, {
    key: "getCosts",
    value: function getCosts(adObject /*, o*/) {
      var _o;

      /*
      if(typeof o.costs == "undefined")
        o.costs = {["today_"+(this.date.getDate()-1)]: 0, ["week_"+this.date.getWeek()-1]: 0, ["month_"+(this.date.getMonth()+1)]: 0}
      o.costs["yesterday"] = adObject.getStatsFor("YESTERDAY").getCost()
      o.costs["today_"+(this.date.getDate()-1)] += adObject.getStatsFor("TODAY").getCost()
      o.costs["last7"] = adObject.getStatsFor("LAST_7_DAYS").getCost()
      o.costs["week_"+(this.date.getWeek() - 1)] += adObject.getStatsFor("LAST_WEEK").getCost()
      o.costs["thisWeek"] = adObject.getStatsFor("THIS_WEEK_MON_TODAY").getCost()
      o.costs["month_"+(this.date.getMonth()+1)] += adObject.getStatsFor("LAST_MONTH").getCost()
      o.costs["thisMonth"] = adObject.getStatsFor("THIS_MONTH").getCost()
      */
      var o = (_o = {}, _defineProperty(_o, "today_" + (this.date.getDate() - 1), 0), _defineProperty(_o, "week_" + this.date.getWeek() - 1, 0), _defineProperty(_o, "month_" + (this.date.getMonth() + 1), 0), _o);
      o["yesterday"] = adObject.getStatsFor("YESTERDAY").getCost();
      o["today_" + (this.date.getDate() - 1)] += adObject.getStatsFor("TODAY").getCost();
      o["last7"] = adObject.getStatsFor("LAST_7_DAYS").getCost();
      o["week_" + (this.date.getWeek() - 1)] += adObject.getStatsFor("LAST_WEEK").getCost();
      o["thisWeek"] = adObject.getStatsFor("THIS_WEEK_MON_TODAY").getCost();
      o["month_" + (this.date.getMonth() + 1)] += adObject.getStatsFor("LAST_MONTH").getCost();
      o["thisMonth"] = adObject.getStatsFor("THIS_MONTH").getCost();

      //Logger.log("o.costs: %s", o.costs)

      return o;
    }

    /*********************************************************************************************************************************************/
    /********************************GET ALL (CLIENT'S) DESIRED ENTITY***************************************/
    /*********************************************************************************************************************************************/
    /*********************************************************************************************************************************************/

  }, {
    key: "getAllThat",
    value: function getAllThat(account, that, conditions) {
      var a,
          array = [],
          thatAvailablesValues = ["accounts", "campaigns", "adGroups", "ads", "keywords", "labels"];
      if (typeof conditions == "undefined") conditions = [{ withCondition: "Status = ENABLED" }];else if (!Array.isArray(conditions)) throw "1:Dans la fonction 'getAllThat', la valeur '" + conditions + "' pour l'argument 'conditions' doit être un array d'objets (conditions = [{},{},..])";else if (_typeof(conditions[0]) != "object" || Array.isArray(conditions[0])) throw "2:Dans la fonction 'getAllThat', la valeur '" + conditions + "' pour l'argument 'conditions' doit être un array d'objets (conditions = [{},{},..])";
      if (typeof that == "undefined") throw "L'appel à la fonction 'getAllThat' a second argument 'that' OBLIGATOIRE";else if (thatAvailablesValues.indexOf(that) == -1) throw "Dans la fonction 'getAllThat', la valeur '" + that + "' pour l'argument 'that' n'existe pas.\nVeuillez svp choisir pour l'argument 'that' une des valeurs suivantes: " + thatAvailablesValues + ".";
      AdsManagerApp.select(account);
      var selector = AdsApp[that]();
      for (a in conditions) {
        selector[a](conditions[a]);
      }var iterator = selector.get();
      while (iterator.hasNext()) {
        array.push(iterator.next());
      }return array;
    }
  }, {
    key: "getAllClients",
    value: function getAllClients() {
      var array = [];
      var accountSelector = AdsManagerApp.accounts();
      var accountIterator = accountSelector.get();
      while (accountIterator.hasNext()) {
        array.push(accountIterator.next());
      }return array;
    }
  }, {
    key: "getAllCampaigns",
    value: function getAllCampaigns(account) {
      var array = [];
      AdsManagerApp.select(account);
      var campaignSelector = AdsApp.campaigns().withCondition("Status = ENABLED");

      var campaignIterator = campaignSelector.get();
      while (campaignIterator.hasNext()) {
        array.push(campaignIterator.next());
      }return array;
    }
  }, {
    key: "getAllGroups",
    value: function getAllGroups(account) {
      var array = [];
      AdsManagerApp.select(account);
      var groupSelector = AdsApp.adGroups().withCondition("Status = ENABLED");

      var groupIterator = groupSelector.get();
      while (groupIterator.hasNext()) {
        array.push(groupIterator.next());
      }return array;
    }
  }, {
    key: "getAllAds",
    value: function getAllAds(account) {
      var array = [];
      AdsManagerApp.select(account);
      var adSelector = AdsApp.ads().withCondition("Status = ENABLED");

      var adIterator = adSelector.get();
      while (adIterator.hasNext()) {
        array.push(adIterator.next());
      }return array;
    }
  }, {
    key: "getAllKeywords",
    value: function getAllKeywords(account) {
      var array = [];
      AdsManagerApp.select(account);
      var keywordSelector = AdsApp.keywords().withCondition("Status = ENABLED");

      var keywordIterator = keywordSelector.get();
      while (keywordIterator.hasNext()) {
        array.push(keywordIterator.next());
      }return array;
    }
  }, {
    key: "getAllLabels",
    value: function getAllLabels(account) {
      var array = [];
      AdsManagerApp.select(account);
      var labelSelector = AdsApp.labels().withCondition("Status = ENABLED");

      var labelIterator = labelSelector.get();
      while (labelIterator.hasNext()) {
        array.push(labelIterator.next());
      }return array;
    }
    /******************************************GET ATTRIBUTE(S) FROM ADS ENTITIES********************************************************************************************************************/

  }, {
    key: "getEntitiesAttribute",
    value: function getEntitiesAttribute(entities, attribute) {
      if ((typeof entities === "undefined" ? "undefined" : _typeof(entities)) != "object") throw "Dans la fonction 'getEntitiesName', l'argument 'entities' entré est incorrect (valeur entrée: " + entities + ")\n'entities' est sensé être un array de GAdsEntities (cependant il peut simplement être un GAdsEntities)";else if ((typeof entities === "undefined" ? "undefined" : _typeof(entities)) == "object" && !Array.isArray(entities)) entities = [entities];
      if (typeof attribute == "undefined" || typeof attribute != "string") throw "Dans la fonction 'getEntitiesName', l'argument 'attribute' entré est incorrect (valeur entrée: " + attribute + ")\n'attribute' est de type string";
      var a,
          array = [];
      for (a in entities) {
        array.push(entities[a][attribute]());
      }return array;
    }
  }, {
    key: "getEntitiesAttributePersonalized0",
    value: function getEntitiesAttributePersonalized0(entities) {
      if ((typeof entities === "undefined" ? "undefined" : _typeof(entities)) != "object") throw "Dans la fonction 'getEntitiesName', l'argument 'entities' entré est incorrect (valeur entrée: " + entities + ")\n'entities' est sensé être un array de GAdsEntities (cependant il peut simplement être un GAdsEntities)";else if ((typeof entities === "undefined" ? "undefined" : _typeof(entities)) == "object" && !Array.isArray(entities)) entities = [entities];
      var a,
          array = [];
      for (a in entities) {
        array.push(entities[a].getId() + ": " + (entities[a].getName() || entities[a].getText()));
      }return array;
    }

    /*********************************************************************************************************************************************/
    /********************************GET ALL CLIENT'S IDS AND NAMES WITH THERE ASSOCIATED ACTIVED CAMPAIGNS***************************************/
    /*********************************************************************************************************************************************/
    /*********************************************************************************************************************************************/

  }, {
    key: "getAllClients_weatherScript",
    value: function getAllClients_weatherScript() {
      var a,
          array = [];
      var clients = this.getAllClients();
      Logger.log(clients.length + " ID clients ont été récupéré. Préparation de l'output..");
      for (a in clients) {
        array.push({ id: clients[a].getCustomerId(), name: clients[a].getName(), campaigns: this.getEntitiesAttributePersonalized0(this.getAllCampaigns(clients[a])) });
        Logger.log(parseInt(a) + 1 + "/" + clients.length + " clients traités");
      }
      return array;
    }
  }, {
    key: "getAllClients_weatherScript_",
    value: function getAllClients_weatherScript_(obj) {
      var a,
          array = [],
          campaigns,
          output = [];
      for (a in obj) {
        campaigns = this.getCampaignsFromAccountId(a);
        for (aa in obj[a]) {
          for (aaa in campaigns) {
            if (campaigns[aaa].getName() == obj[a][aa]) array.push(campaigns[aaa]);
          }
        }
      }
      for (a in array) {
        output.push({ name: array[a].getName(), stats: this.getStats(array[a]), budget: this.getBudget(array[a]), keywords: this.getKeywords(array[a]), labels: this.getLabels(array[a]), costs: this.getCosts(array[a]) });
      }return output;
    }
  }, {
    key: "myDate",
    value: function myDate() {
      Date.prototype.getYearDay = function () {
        //1 - 366
        var year = this.getFullYear();
        var month = this.getMonth();
        var day = this.getDate();

        var offset = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

        //l'année bissextile n'est utile qu'à partir de mars
        var bissextile = month < 2 ? 0 : year % 400 == 0 || year % 4 == 0 && year % 100 != 0;

        return parseInt(day + offset[month] + bissextile);
      };

      Date.prototype.getMonday = function () {
        var offset = (this.getDay() + 6) % 7;
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() - offset);
      };

      Date.prototype.getWeek = function () {
        //1 - 53
        var year = this.getFullYear();
        var week;

        //dernier lundi de l'année
        var lastMonday = new Date(year, 11, 31).getMonday();

        //la date est dans la dernière semaine de l'année
        //mais cette semaine fait partie de l'année suivante
        if (this >= lastMonday && lastMonday.getDate() > 28) {
          week = 1;
        } else {
          //premier lundi de l'année
          var firstMonday = new Date(year, 0, 1).getMonday();

          //correction si nécessaire (le lundi se situe l'année précédente)
          if (firstMonday.getFullYear() < year) firstMonday = new Date(year, 0, 8).getMonday();

          //nombre de jours écoulés depuis le premier lundi
          var days = this.getYearDay() - firstMonday.getYearDay();

          //window.alert(days);

          //si le nombre de jours est négatif on va chercher
          //la dernière semaine de l'année précédente (52 ou 53)
          if (days < 0) {
            week = new Date(year, this.getMonth(), this.getDate() + days).getWeek();
          } else {
            //numéro de la semaine
            week = 1 + parseInt(days / 7);

            //on ajoute une semaine si la première semaine
            //de l'année ne fait pas partie de l'année précédente
            week += new Date(year - 1, 11, 31).getMonday().getDate() > 28;
          }
        }

        return parseInt(week);
      };
      Date.prototype.setDay = function (dayIndex) {
        dayIndex = Math.floor(+dayIndex);
        if (dayIndex < 0 || 6 < dayIndex) {
          throw new Error("Must pass integer between 0-6, where sunday is 0.");
        }
        this.setDate(this.getDate() + dayIndex - this.getDay());
        return this.valueOf();
      };
    }
  }, {
    key: "completedate",
    value: function completedate(time) {
      if (time < 10) time = "0" + String(time);
      return time;
    }
  }]);

  return Ads;
}();
