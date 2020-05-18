import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class Targetting extends Own{
  constructor(){


  }
  /*Ad Schedules******************************************************************************************/
  /************************************************************************************************************************/
  //Add ad schedules for a campaign
  function addAdSchedule() {
    var theIterator = this.addCondition(this.getTheIterator(config.condition), config)
    var resp = this.getResults(theIterator, {excludedLocations: {add: {geoCode: config.excludedLocations.geoCode}}})
    resp.entity.addAdSchedule({
      dayOfWeek: config.schedule[a].dayOfWeek,
      startHour: config.schedule[a].startHour,
      startMinute: config.schedule[a].startMinute,
      endHour: config.schedule[a].endHour,
      endMinute: config.schedule[a].endMinute,
      bidModifier:  config.schedule[a].bidModifier
    });
  }
  //Get ad schedules for a campaign
  function getAdSchedules() {
    var theIterator = this.addCondition(this.getTheIterator(config.condition), config)
    return this.getResults(theIterator, {adSchedules: true})
  }

  function formatSchedule(schedule) {
    function zeroPad(number) { return Utilities.formatString('%02d', number); }
    return schedule.getDayOfWeek() + ', ' +
        schedule.getStartHour() + ':' + zeroPad(schedule.getStartMinute()) +
        ' to ' + schedule.getEndHour() + ':' + zeroPad(schedule.getEndMinute());
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Excluded Locations******************************************************************************************/
  /************************************************************************************************************************/
  //Add excluded locations for a campaign
  function excludeLocationTarget() {
    var theIterator = this.addCondition(this.getTheIterator(config.condition), config)
    return this.getResults(theIterator, {excludedLocations: {add: {geoCode: config.excludedLocations.geoCode}}})
  }
  //Get excluded locations for a campaign
  function getExcludedLocations(config) {
    var theIterator = this.addCondition(this.getTheIterator(config.condition), config)
    return this.getResults(theIterator, {excludedLocations: {}})
  }

  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Location******************************************************************************************/
  /************************************************************************************************************************/
  //Target a campaign for a country
  function targetCampaignByCountry(config) {
    var theIterator = this.addCondition(this.getTheIterator(config.condition), config)
    this.getResults(theIterator, {addLocation: {geoCode: config.geoCode, bidModifier: config.bidModifier}})
  }
  //Get the list of locations targeted by a campaign
  function getTargetedLocations(config) {
    var theIterator = this.addCondition(getTheIterator(config.condition), config)
    return this.getResults(theIterator, {locations: true})
  }
  //Remove a targeted location from a campaign
  function removeTargetedLocationById(config) {
    var theIterator = this.addCondition(getTheIterator(config.condition), config)
    var resp = this.getResults(theIterator, {locations: {remove: true}})
    for(a in resp.locations)
      resp.locations.entity.remove()
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Platforms******************************************************************************************/
  /************************************************************************************************************************/
  //Set mobile bid modifier for a campaign
  function setMobileBidModifier(config) {
    var theIterator = this.addCondition(getTheIterator(config.condition), config)
    if(!config.targets)throwerr("config.platforms.targets")
    if(!config.config.platforms.targets)throwerr("config.platforms.setBidModifier")
    return this.getResults(theIterator, {platforms: {targets: config.targets, setBidModifier: config.setBidModifier}})
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Proximity******************************************************************************************/
  /************************************************************************************************************************/
  //Add a proximity target to a campaign
  function targetCampaignByProximity(config) {
    var theIterator = this.addCondition(this.getIteratorFromConfig(config.condition), config)
    console.log('find proximities entity at: "data.proximities"');
    return this.getResults(theIterator, {proximities: {addProximities: config.addProximities}})
  }
  //Get the list of all proximity targets for a campaign
  function getTargetedProximities(config) {
    var theIterator = this.addCondition(this.getIteratorFromConfig(config.condition), config)
    console.log('find proximities entity at: "data.proximities"');
    return this.getResults(theIterator, {proximities: true})
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
