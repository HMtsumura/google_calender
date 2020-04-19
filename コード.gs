function doGet(e) {
  //var t = HtmlService.createTemplateFromFile('scheduler.html');
  var page= e.parameter["p"];
  if(page == "registerSchedule" || page == null){
    return HtmlService.createTemplateFromFile('registSchedule').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }else{
    return HtmlService.createTemplateFromFile('mainSchedule').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  /*var filterparam = e.parameter["p"];
  var html;
  
  switch(filterparam){
    case "mainSchedule":
      var html = HtmlService.createTemplateFromFile('mainSchedule').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
      break;
    case "registSchedule":
      var html = HtmlService.createTemplateFromFile('registSchedule').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
      break;
  }
  return html;*/
}
/*
function recieveFromHtml(values) {
  for(var i = 0; i < values.length; i++) {
    Logger.log(values[i]);
  }
  Browser.msgBox("値が送信できました。\nログを確認してください。");
}

function registerSchedule (e){
  
  Logger.log('aaa')
}*/


function main(){
  var app = SpreadsheetApp;
  var html = HtmlService.createHtmlOutputFromFile('registSchedule');
  var content = html.getContent().replace(/%adasu\(\)%/, '"' + adasu() + '"');
  app.getActiveSpreadsheet().show(HtmlService.createHtmlOutput(content));
}

function adasu(){
  var a = "aaa";
  return a;
}

function recieveFromHtml(startTimes,endTimes,titles) {

  for(var i = 0; i < startTimes.length ; i ++){
  var calendar = CalendarApp.getDefaultCalendar();
  var title = titles[i];
  var startTime = new Date(startTimes[i]);
  var endTime   = new Date(endTimes[i]);
  calendar.createEvent(title, startTime, endTime);
  Logger.log(title)
  Logger.log(startTime)
  Logger.log(endTime)
 
  }
  Browser.msgBox("予定を"+i+"件登録しました。");
}

function getSchedule() {
  let date = new Date();
  //let endTime = new Date(Date.parse(startTime) + (10 * 60 * 60 * 24 * 1000));
  let events = CalendarApp.getEventsForDay(date);
  let eventInfos = [];
  for (var i in events) {
    let startDate =  dateFormatter(events[i].getStartTime());
    let startTime = timeFormatter(events[i].getStartTime());
    //let endDate = dateFormatter(events[i].getEndTime());
    let endTime = timeFormatter(events[i].getEndTime());
    let title = events[i].getTitle();
    let eventInfo = [];
    Logger.log(startTime);
    Logger.log(endTime);
    Logger.log(title);
    eventInfo.push(startDate);
    eventInfo.push(startTime);
    eventInfo.push(endTime);
    eventInfo.push(title);
    eventInfos.push(eventInfo);
    //eventInfo.push({startTime:startTime,endTime:endTime,title:title});
    //startTimes.push(timeFormatter(events[i].getStartTime()));
    //endTimes.push(timeFormatter(events[i].getEndTime()));
    //titles.push(events[i].getTitle());
    //eventInfos.push(eventInfo);
    }
  //Logger.log(startTimes);
  return eventInfos;
}

function dateFormatter(date){ 
  return Utilities.formatDate(date,'JST','yyyy-MM-dd');
}

function timeFormatter(date){ 
  return Utilities.formatDate(date,'JST','HH:mm');
}
