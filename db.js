chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log('test', changeInfo.url);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    // how to fetch tab url using activeInfo.tabid
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        console.log(tab.url);
    });
});