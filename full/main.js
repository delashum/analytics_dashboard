function AddPage(url) {
    chrome.storage.sync.set({
        'test': {
            test: 'val',
            other: 'value'
        }
    });
}

function GetPage(url) {
    chrome.storage.sync.get('test', function (res) {
        console.log(res);
    });
}

function ClearStorage() { //OK
    chrome.storage.sync.clear();
}

function GetUrlRoot() { //OK
    var fullUrl = window.location.href;
    var subData = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/.exec(fullUrl)[1];
    var components = subData.split('.');
    var obj = {
        domain: components[components.length - 2],
        extension: components[components.length - 1],
        full: fullUrl
    };
    if (components.length === 3) {
        obj.subdomain = components[0];
    }
    return obj;
}

chrome.runtime.sendMessage({
    request: "popupData"
}, function (response) {
    console.log(response);
});



chrome.runtime.sendMessage({
    request: "log"
}, function (response) {
    console.log(response);
});