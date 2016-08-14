/*******************************************************************

~~Analytics Dashboard~~
- A Dashboard to track website data and analytics over time, and sync between devices -

Authors: Erik Webb, Jacob Shumway

===================================================================

This script is to keep track of page changes and updating the data base.
Front end will communicate with the page for needed data occasionally.

******************************************************************/


/*
This is what main is supposed to look like

var mainTemplate = {
    last50: [{
        duration: Number (in milliseconds),
        fullUrl: String,
        shortUrl: String (www.stackoverflow.com),
    }, ...],
    active: {
        id: Number,
        url: String,
        start: Number (milliseconds)
    }
}
*/


var mainTemplate = {
    last50: [],
    active: {
        id: 0,
        url: "",
        start: 0
    }
};

var settings = {
    minDuration: 1000 * 4,
    maxDuration: 1000 * 60 * 10,
    avgDuration: 1000 * 60
};


var main,
    msgs = [];
Initialize();


/**

Run on Chrome-Open, pull relevent data from Storage into temporary memory.

*/
function Initialize() {
    chrome.storage.sync.get('main', function (res) {
        main = res.main || {};
        if (!main.active) {
            main = mainTemplate;
        }
    });
}



/**

Change activated tab, store previous active tab in Database.

*/
function Activate(tab) {
    if (tab.id === main.active.id || tab.status !== "complete") {
        return;
    }

    var now = (new Date()).getTime();
    var duration = main.active.start !== 0 ? now - main.active.start : 0;

    if (tab.url.indexOf('chrome') === 0 || duration !== 0 && duration <= settings.minDuration) {
        main.active.start = now;
        return;
    } else if (duration >= settings.maxDuration) {
        duration = settings.maxDuration;
    }

    if (duration !== 0) {
        Updatelast50({
            duration: duration,
            fullUrl: main.active.url,
            shortUrl: /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/.exec(main.active.url)[1]
        });
    }

    main.active.id = tab.id;
    main.active.start = now;
    main.active.url = tab.url;
    UpdateDB();

}






/**

Update last50 in main

*/
function Updatelast50(site) {
    main.last50.unshift(site);
    if (main.last50.length > 50) {
        main.last50.pop();
    }
}


/**

Updates DB with main.

*/
function UpdateDB() {
    chrome.storage.sync.set({
        main: main
    }, function (res) {
        Log(res);
    })
}







/**

Manage Communication between Background and Foreground scripts

*/
chrome.runtime.onMessage.addListener(
    function (message, sender, response) {
        if (message.request == 'popupData') {
            response(main);
        } else if (message.request == 'log') {
            response(msgs);
        }
    }
);



chrome.tabs.onActivated.addListener(function (data) {
    GetActive(data.tabId, 'activate');
});

chrome.tabs.onUpdated.addListener(function (tabId, current, tab) {
    GetActive(tabId, 'update');
});

chrome.tabs.onCreated.addListener(function (tabId, current, tab) {
    GetActive(tabId, 'create');
});

function GetActive(id, msg) {
    chrome.tabs.get(id, function (tab) {
        Activate(tab);
    });
}



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




function Log(thing) {
    msgs.push(thing);
}