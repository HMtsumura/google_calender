function doGet(e) {
  //var t = HtmlService.createTemplateFromFile('scheduler.html');
  var page = e.parameter["p"];
  if (page == "registerSchedule" || page == null) {
    return HtmlService.createTemplateFromFile('mainSchedule').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  } else if (page == "regist") {
    return HtmlService.createTemplateFromFile('registSchedule').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }
  //QUnit.urlParams( e.parameter );
  //QUnit.config({ title: "Unit tests for my project" });
  //QUnit.load( myTests );
  //return QUnit.getHtml();
}
//QUnit.helpers(this);

function main() {
  var app = SpreadsheetApp;
  var html = HtmlService.createHtmlOutputFromFile('mainSchedule');
  var content = html.getContent().replace(/%adasu\(\)%/, '"' + adasu() + '"');
  app.getActiveSpreadsheet().show(HtmlService.createHtmlOutput(content));
}

function adasu() {
  var a = "aaa";
  return a;
}

function recieveFromHtml(startTimes, endTimes, titles, planOrResult) {
  for (var i = 0; i < startTimes.length; i++) {
    let calendar = CalendarApp.getDefaultCalendar();
    let title = titles[i];
    let startTime = new Date(startTimes[i]);
    let endTime = new Date(endTimes[i]);
    if (planOrResult) {
      //デフォルト？で出てくる色以外の色を設定したいけど、設定すると無効な値となる。
      calendar.createEvent(title, startTime, endTime).setColor(CalendarApp.EventColor.BLUE);
    } else {
      calendar.createEvent(title, startTime, endTime).setColor(CalendarApp.EventColor.RED);
    }
    Logger.log(title)
    Logger.log(startTime)
    Logger.log(endTime)

  }
  Browser.msgBox("予定を" + i + "件登録しました。");
}
//処理日の予定取得機能
function getSchedule() {
  let date = new Date();
  let events = CalendarApp.getEventsForDay(date);
  let eventInfos = [];
  for (var i in events) {
    let startDate = dateFormatter(events[i].getStartTime());
    let startTime = timeFormatter(events[i].getStartTime());
    //let endDate = dateFormatter(events[i].getEndTime());
    let endTime = timeFormatter(events[i].getEndTime());
    let title = events[i].getTitle();
    let eventInfo = [];
    let eventId = events[i].getId();
    eventId = eventId.split('@')[0];
    let rowInfo = {
      date: startDate,
      startTime: startTime,
      endTime: endTime,
      title: title,
      eventId: eventId
    }
    Logger.log(eventId);
    /*eventInfo.push(startDate);
    eventInfo.push(startTime);
    eventInfo.push(endTime);
    eventInfo.push(title);
    eventInfo.push(eventId);
    eventInfos.push(eventInfo);
    */
    eventInfos.push(rowInfo)
  }
  return eventInfos;
}
//日付をyyy-MM-ddの形に整形
function dateFormatter(date) {
  return Utilities.formatDate(date, 'JST', 'yyyy-MM-dd');
}
//時間をHH:mmの形に整形
function timeFormatter(date) {
  return Utilities.formatDate(date, 'JST', 'HH:mm');
}
//イベント作成機能
function createEvent(newEventInfos){
  for(var count = 0; count < newEventInfos.length; count++){
    let calendar = CalendarApp.getDefaultCalendar();
    let title = newEventInfos[count].title;
    let startTime = new Date(newEventInfos[count].startTime);
    let endTime = new Date(newEventInfos[count].endTime);
    calendar.createEvent(title, startTime, endTime);
  }
    Logger.log("予定を" + count + "件登録しました。");
}

/*function createEvent(startTimes, endTimes, titles) {
  for (var i = 0; i < startTimes.length; i++) {
    let calendar = CalendarApp.getDefaultCalendar();
    let title = titles[i];
    let startTime = new Date(startTimes[i]);
    let endTime = new Date(endTimes[i]);
    calendar.createEvent(title, startTime, endTime);
    Logger.log(title)
    Logger.log(startTime)
    Logger.log(endTime)
  }
  Logger.log("予定を" + i + "件登録しました。");
}
*/
//イベント更新機能
function updateEvent(updateEventInfos) {
  let date = new Date();
  //既にカレンダーに入ってるその日分の予定を取得
  let events = CalendarApp.getEventsForDay(date);
  let calendar = CalendarApp.getDefaultCalendar();
  let strCalendarID = CalendarApp.getId();
  Logger.log(strCalendarID);
  //画面の更新に関係してる予定分だけfor
  for (var i = 0; i < updateEventInfos.length; i++) {
    let event = Calendar.Events.get(strCalendarID, updateEventInfos[i].eventId);
    event.summary = updateEventInfos[i].title;
    let formattedStartDate = Utilities.formatDate(new Date(updateEventInfos[i].startTime), "JST", "yyyy-MM-dd'T'HH:mm:ssZ");
    let formattedEndDate = Utilities.formatDate(new Date(updateEventInfos[i].endTime), "JST", "yyyy-MM-dd'T'HH:mm:ssZ");
    event.start.dateTime = formattedStartDate;
    event.end.dateTime = formattedEndDate;
    Calendar.Events.patch(event, strCalendarID, updateEventInfos[i].eventId);
  }
}
//イベント削除機能
function deleteEvent(eventIds) {
  for (var i = 0; i < eventIds.length; i++) {
    let calendar = CalendarApp.getDefaultCalendar();
    let event = calendar.getEventById(eventIds[i]);
    event.deleteEvent();
  }
  Browser.msgBox("予定を" + i + "件削除しました。");
}

