/*******************************************************************

~~Analytics Dashboard~~
- A Dashboard to track website data and analytics over time, and sync between devices -

Authors: Erik Webb, Jacob Shumway

===================================================================

This script is to keep track of page changes and updating the data base.
Front end will communicate with the page for needed data occasionally.

******************************************************************/


/*

main = {
    last100: [{
        duration: Number (in milliseconds),
        fullUrl: String,
        shortUrl: String (www.stackoverflow.com),
    }, ...],
    active: {
        tabId: Number,
        windowId: Number,
        start: Number (milliseconds)
    }
}

*/

var settings = {
    minDuration: 1000 * 4,
    maxDuration: 1000 * 60 * 10,
    avgDuration: 1000 * 60
};


var main;
Initialize();


/**

Run on Chrome-Open, pull relevent data from Storage into temporary memory.

*/
function Initialize() {
    chrome.storage.sync.get('main', function (res) {
        main = res || {};
    });
}



/**

Change activated tab, store previous active tab in Database.

*/
function Activate(tab) {
    if (tab.windowId === main.active.windowId && tab.tabId === main.tabId) {
        return;
    }

    var now = (new Date()).getTime();
    var duration = now - main.active.start
    if (duration <= settings.minDuration) {
        return;
    }

    if (duration >= settings.maxDuration) {
        duration = settings.maxDuration;
    }

    UpdateLast100({
        duration: duration,
        fullUrl: '',
        shortUrl: ''
    });

    main.active.tabId = tab.tabId;
    main.active.windowId = tab.windowId;
    UpdateDB();

}






/**

Update last100 in main

*/
function UpdateLast100(site) {
    main.last100.unshift(site);
    if (main.last100.length > 100) {
        main.last100.pop();
    }
}


/**

Updates DB with main.

*/
function UpdateDB() {
    chrome.storage
}







/**

Manage Communication between Background and Foreground scripts

*/
chrome.runtime.onMessage.addListener(
    function (message, sender, response) {
        if (message.request == 'popupData') {
            response(main);
        }
    }
);



chrome.tabs.onActivated(function () {

});





//chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//    console.log('test', changeInfo.url);
//});
//
//chrome.tabs.onActivated.addListener(function (activeInfo) {
//    // how to fetch tab url using activeInfo.tabid
//    chrome.tabs.get(activeInfo.tabId, function (tab) {
//        console.log(tab.url);
//    });
//});


//Get all history for the last 90 days
chrome.history.search({
    text: '',
    startTime: (new Date()).getTime() - (1000 * 60 * 60 * 24 * 90),
    maxResults: 5000
}, function (arr) {
    console.log(arr);
    var bytes = JSON.stringify(arr).replace(/[\[\]\,\"]/g, '').length;
    console.log(bytes);
});