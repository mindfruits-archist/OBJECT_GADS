import Own from './Own'
/************************************************************************************************************************/
/************************************************************************************************************************/
/************************************************Targetting************************************************/
/************************************************************************************************************************/
/************************************************************************************************************************/


class AdvancedAPIs extends Own{
  constructor(){

  }

  /*Google Analytics******************************************************************************************/
  /************************************************************************************************************************/
  //Get an Analytics account
  getAccounts(config) {
    console.log("getAccounts:needed: !config.accountId/accountName!");
    var arr = [], ref = config.id || config.name, iteValue, accounts = Analytics.Management.Accounts.list();
    if(typeof ref == "string") ref = [ref]


    for (var i = 0; i < accounts.items.length; i++) {
      iteValue = config.id ? accounts.items[i].id : config.name ? accounts.items[i].name : null
      for(a in ref)
        if (ref[a] == iteValue)
          arr.push(accounts.items[i])
    }
    return arr
  }
  //Get a web property
  getWebPropertyById(config) {
    console.log("getAccounts:needed: !config.accountId!, !config.webPropertyId!");
    this.getAccounts(config)

    var webProperty = Analytics.Management.Webproperties.get(
        config.accountId, config.webPropertyId);

    Logger.log('Web Property ID: %s, Name: %s', webProperty.id, webProperty.name);
    return webProperty
  }
  //List all profiles
  listAllProfiles(config) {
    console.log("getAccounts:needed: !config.accountId!, !config.webPropertyId!");

    var profiles = Analytics.Management.Profiles.list(config.accountId, config.webPropertyId), arr = [];

    for (var i = 0; i < profiles.items.length; i++) {
      arr.push(profiles.items[a])
    }
    return arr
  }
  //Get stats for an Analytics profile
  getStatsForProfileId(config) {
    console.log("getAccounts:needed: !config.profileId!, !config.startDate!, !config.endDate!, !config.dimensions!");
    var metrics = Array.isArray(config.metrics) ? config.metrics.join(',') : typeof config.metrics == 'string' ? config.metrics : ""

    var results = Analytics.Data.Ga.get('ga:' + config.profileId, config.startDate,
        config.endDate, metrics);
    return results.rows
  }
  //Run a multi-channel funnel report
  runMultiChannelFunnelReport(config) {
    console.log("getAccounts:needed: !config.profileId!, !config.startDate!, !config.endDate!, !config.metrics!\noptionnaly: config.dimensions, config.sort, config.maxResult, config.filters");
    console.log("https://developers.google.com/analytics/devguides/reporting/mcf/v3/reference");
    // See https://support.google.com/analytics/answer/1191180 to learn more about
    // multi-channel funnel reports in Google Analytics.
    var metrics = Array.isArray(config.metrics) ? config.metrics.join(',') : typeof config.metrics == 'string' ? config.metrics : ""
    var dimensions = Array.isArray(config.dimensions) ? config.dimensions.join(',') : typeof config.dimensions == 'string' ? config.dimensions : ""

    var obj = {}
    if(config.dimensions)obj.dimensions = config.dimensions
    if(config.sort)obj.sort = config.sort
    if(config.maxResults)obj.maxResults = config.maxResults
    if(config.filters)obj.filters = config.filters

    var results = Analytics.Data.Mcf.get(
        'ga:' + config.profileId,
        config.startDate,
        config.endDate,
        metrics,
        obj
    );
    return results
  }
  //Run a multi-channel funnel report
  runMultiChannelFunnelReport_(config) {
    console.log("getAccounts:needed: !config.profileId!, !config.startDate!, !config.endDate!, !config.metrics!\noptionnaly: config.dimensions, config.sort, config.maxResult, config.filters");
    console.log("https://developers.google.com/analytics/devguides/reporting/mcf/v3/reference");
    // See https://support.google.com/analytics/answer/1191180 to learn more about
    // multi-channel funnel reports in Google Analytics.
    var metrics = Array.isArray(config.metrics) ? config.metrics.join(',') : typeof config.metrics == 'string' ? config.metrics : ""
    var dimensions = Array.isArray(config.dimensions) ? config.dimensions.join(',') : typeof config.dimensions == 'string' ? config.dimensions : ""

    var obj = {}
    if(config.dimensions)obj.dimensions = config.dimensions
    if(config.sort)obj.sort = config.sort
    if(config.maxResults)obj.maxResults = config.maxResults
    if(config.filters)obj.filters = config.filters

    var results = Analytics.Data.Mcf.get(
        'ga:' + config.profileId,
        config.startDate,
        config.endDate,
        metrics,
        obj
    );

    var headers = [], arra = [];
    for (var i = 0; i < results.columnHeaders.length; i++) {
      headers.push(results.columnHeaders[i].name);
    }
    Logger.log(headers.join(','));

    for (var i = 0; i < results.rows.length; i++) {
      var rowData = [];

      var row = results.rows[i];
      for (var j = 0; j < row.length; j++) {
        var cell = row[j];
        var dataType = results.columnHeaders[j].dataType;
        if (dataType == 'MCF_SEQUENCE') {
          rowData.push(getStringFromMcfSequence(cell.conversionPathValue));
        } else {
          rowData.push(cell.primitiveValue);
        }
      }
      Logger.log(rowData.join(','));
      arr.push(rowData)
    }
    return arr
  }
  //Filter stats for an Analytics profile
  filterStats(config) {
    console.log("getAccounts:needed: !config.profileId!, !config.startDate!, !config.endDate!, !config.metrics!\noptionnaly: config.dimensions, config.sort, config.maxResult, config.filters");
    var metrics = Array.isArray(config.metrics) ? config.metrics.join(',') : typeof config.metrics == 'string' ? config.metrics : ""
    var dimensions = Array.isArray(config.dimensions) ? config.dimensions.join(',') : typeof config.dimensions == 'string' ? config.dimensions : ""

    var obj = {}
    if(config.dimensions)obj.dimensions = config.dimensions
    if(config.sort)obj.sort = config.sort
    if(config.maxResults)obj.maxResults = config.maxResults
    if(config.filters)obj.filters = config.filters

    var results = Analytics.Data.Ga.get(
        'ga:' + config.profileId,
        config.startDate,
        config.endDate,
        metrics,
        obj
    );

    Logger.log('View (Profile) Name: %s', results.profileInfo.profileName);
    Logger.log('Total Sessions: %s', results.rows[0][0]);
    return results.rows
  }
  //Run real-time Analytics report
  runRealTimeReport(config) {
    // See https://support.google.com/analytics/answer/1638635 to learn more about
    // real-time reporting.

    var metrics = Array.isArray(config.metrics) ? config.metrics.join(',') : typeof config.metrics == 'string' ? config.metrics : ""
    var dimensions = Array.isArray(config.dimensions) ? config.dimensions.join(',') : typeof config.dimensions == 'string' ? config.dimensions : ""

    var obj = {}
    if(dimensions)obj.dimensions = dimensions
    var results = Analytics.Data.Realtime.get(
      'ga:' + config.profileId,
      metrics,
      obj
    );

    var headers = [];
    for (var i = 0; i < results.columnHeaders.length; i++) {
      headers.push(results.columnHeaders[i].name);
    }
    Logger.log(headers.join(','));
    var arr = []
    for (var i = 0; i < results.rows.length; i++) {
      var rowData = [];

      var row = results.rows[i];
      for (var j = 0; j < row.length; j++) {
        var cell = row[j];
        rowData.push(cell);
      }
      Logger.log(rowData.join(','));
      arr.push(rowData)
    }
    return arr
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Google BigQuery******************************************************************************************/
  /************************************************************************************************************************/
  //Create a BigQuery data set
  createDataSet() {
    console.log("createDataSet:needed: !config.projectId!, !config.dataSetId!, !config.tableId!, !config.dataSet[{id,friendlyName}]!");
    // Replace this value with the project ID listed in the Google
    // Cloud Platform project.
    var projectId = config.projectId;

    var dataSetId = config.dataSetId

    var dataSet = BigQuery.newDataset();
    dataSet.id = dataSetId;
    dataSet.friendlyName = config.dataSet.friendlyName || 'Fruit prices by default';
    dataSet.datasetReference = BigQuery.newDatasetReference();
    dataSet.datasetReference.projectId = projectId;
    dataSet.datasetReference.datasetId = dataSetId;

    dataSet = BigQuery.Datasets.insert(dataSet, projectId);
    Logger.log('Data set with ID = %s, Name = %s created.', dataSet.id,
        dataSet.friendlyName);
  }
  //Create a BigQuery data table
  createTable(config) {
    console.log("createTable:needed: !config.projectId!, !config.dataSetId!, !config.tableId!, !config.fields[{description,name,type}]!\noptionnaly: config.friendlyName");
    // Replace this value with the project ID listed in the Google
    // Cloud Platform project.
    var projectId = config.projectId;

    var dataSetId = config.dataSetId
    var tableId = config.tableId

    var table = BigQuery.newTable();
    var schema = BigQuery.newTableSchema();

    var nameFieldSchema, nameFieldSchemaArr = []

    for(a in config.fields){
      nameFieldSchema = BigQuery.newTableFieldSchema();
      nameFieldSchema.description = config.fields[a].description;
      nameFieldSchema.name = config.fields[a].name
      nameFieldSchema.type = config.fields[a].type
      nameFieldSchemaArr.push(nameFieldSchema)
    }

    schema.fields = nameFieldSchemaArr

    table.schema = schema;
    table.id = tableId;
    table.friendlyName = config.table.friendlyName || 'Fruit prices';

    table.tableReference = BigQuery.newTableReference();
    table.tableReference.datasetId = dataSetId;
    table.tableReference.projectId = projectId;
    table.tableReference.tableId = tableId;

    table = BigQuery.Tables.insert(table, projectId, dataSetId);

    Logger.log('Data table with ID = %s, Name = %s created.',
        table.id, table.friendlyName);
  }
  //Import into BigQuery data table
  importData(config) {
    console.log("importData:needed: !config.projectId!, !config.dataSetId!, !config.tableId!, !config.rows[{insertId,json}]!");
    // Replace this value with the project ID listed in the Google
    // Cloud Platform project.
    var projectId = config.projectId;

    var dataSetId = config.dataSetId
    var tableId = config.tableId

    var insertAllRequest = BigQuery.newTableDataInsertAllRequest(), row;
    insertAllRequest.rows = [];

    for(a in config.rows){
      row = BigQuery.newTableDataInsertAllRequestRows();
      row.insertId = config.rows.insertId;
      row.json = config.rows.json;
      insertAllRequest.rows.push(row);
    }

    var result = BigQuery.Tabledata.insertAll(insertAllRequest, projectId,
        dataSetId, tableId);

    if (result.insertErrors != null) {
      var allErrors = [];

      for (var i = 0; i < result.insertErrors.length; i++) {
        var insertError = result.insertErrors[i];
        allErrors.push(Utilities.formatString('Error inserting item: %s',
            insertError.index));

        for (var j = 0; j < insertError.errors.length; j++) {
          var error = insertError.errors[j];
          allErrors.push(Utilities.formatString('- ' + error));
        }
      }
      Logger.log(allErrors.join('\n'));
    } else {
      Logger.log(Utilities.formatString('%s data rows inserted successfully.',
          insertAllRequest.rows.length));
    }
  }
  //Run query against BigQuery data table
  queryDataTable(config) {
    console.log("queryDataTable:needed: !config.projectId!, !config.dataSetId!, !config.tableId!, !config.query''!");
    // Replace this value with the project ID listed in the Google
    // Cloud Platform project.
    var projectId = config.projectId;

    var dataSetId = config.dataSetId
    var tableId = config.tableId

    var fullTableName = projectId + ':' + dataSetId + '.' + tableId;

    var queryRequest = BigQuery.newQueryRequest();
    queryRequest.query = config.query.replace('?', fullTableName)
    var query = BigQuery.Jobs.query(queryRequest, projectId);

    var arr = []
    if (query.jobComplete) {
      for (var i = 0; i < query.rows.length; i++) {
        var row = query.rows[i];
        var values = [];
        for (var j = 0; j < row.f.length; j++) {
          values.push(row.f[j].v);
        }
        Logger.log(values.join(','));
        arr.push(values)
      }
    }
    return arr
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Google Calendar******************************************************************************************/
  /************************************************************************************************************************/
  //List today's events on primary calendar
  listAllEventsForToday(config) {
    console.log("listAllEventsForToday:needed: !config.calendarId!");
    var calendarId = config.calendarId
    var now = new Date();
    var startOfToday = new Date(now.getYear(), now.getMonth(), now.getDate(),
        0, 0, 0);
    var endOfToday = new Date(now.getYear(), now.getMonth(), now.getDate(),
        23, 59, 29);
    var calendarEvents = Calendar.Events.list(calendarId, {
      timeMin: startOfToday.toISOString(),
      timeMax: endOfToday.toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });

    var arr = []
    if (calendarEvents.items && calendarEvents.items.length > 0) {
      for (var i = 0; i < calendarEvents.items.length; i++) {
        var calendarEvent = calendarEvents.items[i];
        if (calendarEvent.start.date) {
          // All-day event.
          var start = parseDate(calendarEvent.start.date);
          Logger.log('%s (%s)', calendarEvent.summary,
                     start.toLocaleDateString());
        } else {
          var start = parseDate(calendarEvent.start.dateTime);
          Logger.log('%s (%s)', calendarEvent.summary, start.toLocaleString());
        }
        arr.push(start)
      }
    } else {
      Logger.log('No events found.');
    }
    return arr
  }
  //Get all of the current user's calendars
  getAllCalendars() {
    console.log("!NO ARGUMENT!");
    var calendarList = Calendar.CalendarList.list();
    var arr = []
    for (var i = 0; i < calendarList.items.length; i++) {
      var calendar = calendarList.items[i];
      arr.push(calendar)
      Logger.log('%s, %s', calendar.id, calendar.description);
    }
    return arr
  }
  //Create event on one of the current user's calendar
  createEvent(config) {
    console.log("createEvent:needed: !config.calendarId''!, !config.startDate''!, !config.endDate''!, calendarEvent{summary,description,emails[],colorId}");
    var calendarId = config.calendarId

    // Nov 1, 2014 10:00:00 AM
    var start = new Date(config.startDate);

    // Nov 1, 2014 11:00:00 AM
    var end = new Date(config.endDate);

    var calendarEvent = {
      summary: 'Run account performance report',
      description: 'Run account performance report for Oct.',
      start: {
        dateTime: start.toISOString()
      },
      end: {
        dateTime: end.toISOString()
      },
      attendees: [],
      // Red background. Use Calendar.Colors.get() for the full list.
      colorId: config.colorId
    };
    for(a in config.emails)calendarEvent.attendees.push(config.emails[a])
    calendarEvent = Calendar.Events.insert(calendarEvent, calendarId);
    Logger.log('New event with ID = %s was created.' + calendarEvent.getId());
    return calendarEvent
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Google Fusion Tables******************************************************************************************/
  /************************************************************************************************************************/
/*CODE FUSION EST UNE TECHNOLOGIE ARRETE PAR GOOGLE EN AOÛT 2019
  //Create a Fusion Table
  createFusionTable() {
    var table = FusionTables.newTable();
    table.name = 'My sales table';
    table.columns = [
      createColumn('Product', 'STRING'),
      createColumn('Date', 'DATETIME'),
      createColumn('Sales', 'NUMBER')
    ];
    table.isExportable = true;
    var newTable = FusionTables.Table.insert(table);

    Logger.log('Table with ID = %s and name = %s was created.',
               newTable.tableId, newTable.name);
  }
  //Insert data into a Fusion Table
  insertDataIntoFusionTable() {
    // See https://developers.google.com/chart/interactive/docs/fusiontables for
    // details on how to obtain your Google Fusion Table's ID from its URL.

    var tableId = 'INSERT_FUSION_TABLE_ID_HERE';

    // Prepare the data to insert into the table. This should be in CSV format,
    // and should match your table's schema.
    var data = Utilities.newBlob('Cake,2014-01-01,25\nCake,2014-01-02,35\n');
    data.setContentType('application/octet-stream');
    FusionTables.Table.importRows(tableId, data);

    Logger.log('Data imported successfully into Fusion Table.');
  }
  //Query data from Fusion Table
  queryDataFromFusionTable() {
    // See https://developers.google.com/chart/interactive/docs/fusiontables for
    // details on how to obtain your Google Fusion Table's ID from its URL.

    var tableId = 'INSERT_FUSION_TABLE_ID_HERE';

    var results = FusionTables.Query.sql('Select Date, Sales from ' + tableId +
        " where Product = 'Cake'");

    Logger.log(results.columns.join(','));
    for (var i = 0; i < results.rows.length; i++) {
      Logger.log(results.rows[i].join(','));
    }
  }
*/
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Google Slides******************************************************************************************/
  /************************************************************************************************************************/
/*ININTERESSANT !
  //Create a new presentation
  createPresentation() {
    var presentation =
        Slides.Presentations.create({"title": "MyNewPresentation"});
    Logger.log("Created presentation with ID: " + presentation.presentationId);
  }
  //Create a new slide
  createSlide(presentationId) {
    // You can specify the ID to use for the slide, as long as it's unique.
    var pageId = Utilities.getUuid();

    var requests = [{
      "createSlide": {
        "objectId": pageId,
        "insertionIndex": 1,
        "slideLayoutReference": {
          "predefinedLayout": "TITLE_AND_TWO_COLUMNS"
        }
      }
    }];
    var slide =
        Slides.Presentations.batchUpdate({'requests': requests}, presentationId);
    Logger.log("Created Slide with ID: " + slide.replies[0].createSlide.objectId);
  }
  //Read page element object IDs
  readPageElementIds(presentationId, pageId) {
    // You can use a field mask to limit the data the API retrieves
    // in a get request, or what fields are updated in an batchUpdate.
    var response = Slides.Presentations.Pages.get(
        presentationId, pageId, {"fields": "pageElements.objectId"});
    Logger.log(response);
  }
  //Add a new text box
  addTextBox(presentationId, pageId) {
    // You can specify the ID to use for elements you create,
    // as long as the ID is unique.
    var pageElementId = Utilities.getUuid();

    var requests = [{
      "createShape": {
        "objectId": pageElementId,
        "shapeType": "TEXT_BOX",
        "elementProperties": {
          "pageObjectId": pageId,
          "size": {
            "width": {
              "magnitude": 150,
              "unit": "PT"
            },
            "height": {
              "magnitude": 50,
              "unit": "PT"
            }
          },
          "transform": {
            "scaleX": 1,
            "scaleY": 1,
            "translateX": 200,
            "translateY": 100,
            "unit": "PT"
          }
        }
      }
    }, {
      "insertText": {
        "objectId": pageElementId,
        "text": "My Added Text Box",
        "insertionIndex": 0
      }
    }];
    var response =
        Slides.Presentations.batchUpdate({'requests': requests}, presentationId);
    Logger.log("Created Textbox with ID: " +
        response.replies[0].createShape.objectId);
  }
  //Format shape text
  formatShapeText(presentationId, shapeId) {
    var requests = [{
      "updateTextStyle": {
        "objectId": shapeId,
        "fields": "foregroundColor,bold,italic,fontFamily,fontSize,underline",
        "style": {
          "foregroundColor": {
            "opaqueColor": {
              "themeColor": "ACCENT5"
            }
          },
          "bold": true,
          "italic": true,
          "underline": true,
          "fontFamily": "Corsiva",
          "fontSize": {
            "magnitude": 18,
            "unit": "PT"
          }
        },
        "textRange": {
          "type": "ALL"
        }
      }
    }];
    var response =
        Slides.Presentations.batchUpdate({'requests': requests}, presentationId);
  }
*/
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Google Tasks******************************************************************************************/
  /************************************************************************************************************************/
  //Get tasks from task list
  getTasksFromDefaultList(config) {
    console.log("getTasksFromDefaultList:needed: !config.id!");
    // You can substitute a task list ID here to retrieve all the tasks
    // in that list.

    var TASK_LIST_ID = config.id || '@default';

    var taskList = Tasks.Tasklists.get(TASK_LIST_ID);

    // Display the task list details.
    Logger.log('Name: %s (%s)', taskList.title, taskList.id);

    // Retrieve all the tasks in the list.
    var tasks = Tasks.Tasks.list(TASK_LIST_ID);

    for (var i = 0; i < tasks.items.length; i++) {
      Logger.log('  %s) Title: %s, Due on: %s, Status: %s, ID = %s.',
                 i.toFixed(0), tasks.items[i].title,
                 tasks.items[i].due ? tasks.items[i].due : 'Never',
                 tasks.items[i].status, tasks.items[i].id);
    }
    return tasks
  }
  //Create a task
  createTask(config) {
    console.log("createTask:needed: !config.listId''!, !config.title''!, !config.notes''!, !config.dueDate(int)!");
    // You can substitute a task list ID here to create the task in a
    // specific list.

    var TASK_LIST_ID = config.listId || '@default';

    var task = Tasks.newTask();
    task.title = config.title || 'Run reports';
    task.notes = config.notes || 'Run account performance report in 5 days.';

    var dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (config.dueDate || 5));
    task.due = dueDate.toISOString();

    var newTask = Tasks.Tasks.insert(task, TASK_LIST_ID);
    Logger.log('Task with title = %s, id = %s and notes = %s was created. ' +
               'Task is due on %s.',
               newTask.title, newTask.id, newTask.notes, newTask.due);
     return newTask
  }
  //Mark task as completed
  markTaskAsCompleted(config) {
    console.log("markTaskAsCompleted:needed: !config.id''!, !config.listId''!, !config.status''!, !config.notes''!, !config.dueDate(int)!");
    var TASK_ID = config.id// || 'INSERT_TASK_ID_HERE';
    var TASK_LIST_ID = config.listId || '@default';

    // Retrieve the task.
    var task = Tasks.Tasks.get(TASK_LIST_ID, TASK_ID);
    task.status = config.status || 'completed';

    var updatedTask = Tasks.Tasks.update(task, TASK_LIST_ID, TASK_ID);
    Logger.log('Task with title = %s, id = %s and notes = %s was marked ' +
               'as complete.', updatedTask.title, updatedTask.id,
               updatedTask.notes);
    return updatedTask
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*Shopping Content******************************************************************************************/
  /************************************************************************************************************************/
  //Insert a product
  insertProduct(config) {
    var merchantId = config.merchantId

    // Create a product resource. See
    // https://developers.google.com/shopping-content/v2/reference/v2/products
    // for the full list of fields supported by product resource.
    var productResource = config.productResource
    console.log("insertProduct:needed: !config.merchantId''!, !config.productResource = {}!");
    console.log({
      'offerId': 'book123',
      'title': 'A Tale of Two Cities',
      'description': 'A classic novel about the French Revolution',
      'link': 'http://my-book-shop.com/tale-of-two-cities.html',
      'imageLink': 'http://my-book-shop.com/tale-of-two-cities.jpg',
      'contentLanguage': 'en',
      'targetCountry': 'US',
      'channel': 'online',
      'availability': 'in stock',
      'condition': 'new',
      'googleProductCategory': 'Media > Books',
      'productType': 'Media > Books',
      'gtin': '9780007350896',
      'price': {
        'value': '2.50',
        'currency': 'USD'
      },
      'shipping': [{
        'country': 'US',
        'service': 'Standard shipping',
        'price': {
          'value': '0.99',
          'currency': 'USD'
        }
      }],
      'shippingWeight': {
        'value': '2',
        'unit': 'pounds'
      }
    })
    ShoppingContent.Products.insert(productResource, merchantId);
  }
  //List all products
  listProducts(config) {
    console.log("listProducts:needed: !config.merchantId''!");
    var merchantId = config.merchantId

    // List all the products for a given merchant.
    var products = ShoppingContent.Products.list(merchantId);
    if (products.resources) {
      for (var i = 0; i < products.resources.length; i++) {
        Logger.log(products.resources[i]);
      }
      return products.resources
    }
    return false
  }
  //Insert products using custombatch API
  custombatch(config) {
    console.log("custombatch:needed: !config.merchantId''!");
    var merchantId = config.merchantId

    // Create your product resources. See
    // https://developers.google.com/shopping-content/v2/reference/v2/products
    // for the full list of fields supported by product resource. See the
    // insertProduct() snippet for a code example that shows how to construct
    // a product resource.
    /*
    var productResource1 = {
      // FILL THIS OUT.
    };

    var productResource2 = {
      // FILL THIS OUT.
    };

    var productResource3 = {
      // FILL THIS OUT.
    };
    */

    var i = 0, custombatchResource = {entries: []}
    for(a in config.custombatchResource){
      i++
      custombatchResource.entries.push(
        {
          'batchId': i,
          'merchantId': merchantId,
          'method': config.custombatchResource[a].method || 'insert',
          'productId': config.custombatchResource[a].productId,
          'product': config.custombatchResource[a].product
        }
      )
    }
    var response = ShoppingContent.Products.custombatch(custombatchResource);
    Logger.log(response);
    return response
  }
  //Get merchant account information
  getAccountInfo(config) {
    console.log("getAccountInfo:needed: !config.merchantId''!, !config.accountId''!");
    var merchantId = config.merchantId
    var accountId = config.accountId
    var obj = {}

    // See https://developers.google.com/shopping-content/v2/reference/v2/accounts
    // for the list of fields supported by Account type.
    var accounts = ShoppingContent.Accounts.get(merchantId, accountId);
    obj.accounts = accounts
    Logger.log(accounts);

    // See https://developers.google.com/shopping-content/v2/reference/v2/accountstatuses
    // for the list of account status fields supported by Shopping Content API.
    var accountstatuses = ShoppingContent.Accountstatuses.get(merchantId,
        accountId);
    obj.accountstatuses = accountstatuses
    Logger.log(accountstatuses);

    // See https://developers.google.com/shopping-content/v2/reference/v2/accountshipping
    // for various Account shipping settings fields supported by Shopping
    // Content API..
    var accountshipping = ShoppingContent.Accountshipping.get(merchantId,
        accountId);
    obj.accountshipping = accountshipping
    Logger.log(accountshipping);

    // See https://developers.google.com/shopping-content/v2/reference/v2/accounttax
    // for various Account tax fields supported by Shopping Content API.
    var accounttax = ShoppingContent.Accounttax.get(merchantId, accountId);
    obj.accounttax = accounttax
    Logger.log(accounttax);
    return obj
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*YouTube******************************************************************************************/
  /************************************************************************************************************************/
  //Update video's details
  updateYouTubeVideo(config) {
    console.log("updateYouTubeVideo:needed: !config.contentDetails''!, !config.resource''!");
    // 1. Fetch all the channels owned by active user.
    var myChannels = YouTube.Channels.list(config.contentDetails || 'contentDetails', {mine: true});
    var arr = []

    // 2. Iterate through the channels and get the uploads playlist ID.
    for (var i = 0; i < myChannels.items.length; i++) {
      var item = myChannels.items[i];
      var uploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;

      var playlistResponse = YouTube.PlaylistItems.list('snippet', {
        playlistId: uploadsPlaylistId,
        maxResults: 1
      });

      // Get the ID of the first video in the list.
      var video = playlistResponse.items[0];
      var originalDescription = video.snippet.description;
      var updatedDescription = originalDescription +
          ' Description updated via Google Apps Script';

      video.snippet.description = updatedDescription;

      var resource = {
        snippet: {
          title: video.snippet.title,
          description: updatedDescription,
          categoryId: '22'
        },
        id: video.snippet.resourceId.videoId
      };
      YouTube.Videos.update(resource, config.resource || 'id,snippet');

      Logger.log('Video with ID = %s and Title = %s was successfully updated.',
          video.snippet.resourceId.videoId, video.snippet.title);
    }
    return myChannels.items
  }
  //Create a channel bulletin
  postChannelBulletin(config) {
    console.log("postChannelBulletin:needed: !config.message''!, !config.resource''!, !config.videoId''!");
    var message = config.message

    var videoId = config.videoId// || 'INSERT_VIDEO_ID_HERE';
    var resource = {
      snippet: {
        description: message
      },
      contentDetails: {
        bulletin: {
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId
          }
        }
      }
    };

    var response = YouTube.Activities.insert(resource, config.resource || 'snippet,contentDetails');
    Logger.log('Posted to channel bulletin successfully.');
    return response
  }
  //Retrieve video uploads
  retrieveVideoUploads(config) {
    console.log("retrieveVideoUploads:needed: !config.contentDetails''!, !config.playlist!");
    var results = YouTube.Channels.list(config.contentDetails || 'contentDetails', {mine: true});
    var arr = [], obj
    for (var i in results.items) {
      var item = results.items[i];
      obj = {}
      obj.item = item
      // Get the playlist ID, which is nested in contentDetails, as described in
      // the Channel resource:
      // https://developers.google.com/youtube/v3/docs/channels
      var playlistId = item.contentDetails.relatedPlaylists.uploads;

      var nextPageToken = '';

      // This loop retrieves a set of playlist items and checks the nextPageToken
      // in the response to determine whether the list contains additional items.
      // It repeats that process until it has retrieved all of the items in the
      // list.
      while (nextPageToken != null) {
        var playlistResponse = YouTube.PlaylistItems.list(config.playlist || 'snippet', {
          playlistId: playlistId,
          maxResults: 25,
          pageToken: nextPageToken
        });
        obj.playlist = playlistResponse.items
        for (var j = 0; j < playlistResponse.items.length; j++) {
          var playlistItem = playlistResponse.items[j];
          Logger.log('[%s] Title: %s',
                     playlistItem.snippet.resourceId.videoId,
                     playlistItem.snippet.title);

        }
        nextPageToken = playlistResponse.nextPageToken;
      }
      arr.push(obj)
    }
    return arr
  }
  //Search videos by keyword
  searchVideosByKeyword(config) {
    console.log("searchVideosByKeyword:needed: !config.search''!, !config.q!");
    var results = YouTube.Search.list(config.search || 'id,snippet', {q: config.q || 'dogs', maxResults: 25});
    for (var i in results.items) {
      var item = results.items[i];
      Logger.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
    }
    return results.items
  }
  //Search videos by topics
  searchVideosByFreebaseTopic(config) {
    console.log("searchVideosByFreebaseTopic:needed: !config.mid''!, !config.search!\noptionnally: maxResults,");
    // See https://developers.google.com/youtube/v3/guides/searching_by_topic
    // for more details.

    // Insert Your Freebase topic ID here. The Freebase ID used in this example
    // corresponds to the Freebase entry for Google. See
    // http://www.freebase.com/m/045c7b for more details.
    var mid = config.mid || '/m/045c7b';
    var results = YouTube.Search.list(config.search || 'id,snippet',
        {topicId: mid, maxResults: config.maxResults || 25});
    for (var i in results.items) {
      var item = results.items[i];
      Logger.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
    }
    return results.items
  }
  //Subscribe to a channel
  subscribeToChannel(config) {
    console.log("subscribeToChannel:needed: !config.channelId''!, !config.search!, !config.resource''!");
    // Replace this channel ID with the channel ID you want to subscribe to.

    var channelId = config.channelId
    var resource = {
      snippet: {
        resourceId: {
          kind: 'youtube#channel',
          channelId: channelId
        }
      }
    };

    try {
      var response = YouTube.Subscriptions.insert(resource, config.resource || 'snippet');

      Logger.log('Subscribed to channel ID %s successfully.', channelId);
    } catch (e) {
      if (e.message.match('subscriptionDuplicate')) {
        Logger.log('Cannot subscribe; already subscribed to channel: ' +
            channelId);
      } else {
        Logger.log('Error adding subscription: ' + e.message);
      }
    }
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
  /*YouTube Analytics******************************************************************************************/
  /************************************************************************************************************************/
  //Create report for a channel
  runYoutubeAnalyticsReport(config) {
    console.log("runYoutubeAnalyticsReport:needed: !config.id''!, !config.metrics!, !config.dimensions''!, !config.sort''!");
    // Get the list of all channels.
    var myChannels = YouTube.Channels.list(config.id, {mine: true});

    // Pick the first available channel.
    var channel = myChannels.items[0];
    var channelId = channel.id;

    // Set the dates for report.
    var today = new Date();
    var oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    var todayFormatted = Utilities.formatDate(today, 'UTC', 'yyyy-MM-dd');
    var oneMonthAgoFormatted = Utilities.formatDate(oneMonthAgo, 'UTC',
        'yyyy-MM-dd');

    // See https://developers.google.com/youtube/analytics/v1/reports for
    // supported dimensions and metrics.
    var analyticsResponse = YouTubeAnalytics.Reports.query(
      'channel==' + channelId,
      oneMonthAgoFormatted,
      todayFormatted,
      config.metrics || 'views,likes,dislikes,shares',
      {
        dimensions: config.dimensions || 'day',
        sort: config.sort  || '-day'
      }
    );
    Logger.log(analyticsResponse);
    return analyticsResponse
  }
  /*---end-***************************************************************************************************************/
  /************************************************************************************************************************/
}
