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
        main: components[components.length - 2],
        suffix: components[components.length - 1]
    };
    if (components.length === 3) {
        obj.sub = components[0];
    }
    return obj;
}

chrome.storage.onChanged.addListener(function (obj, str) {
    console.log(obj.test.newValue.obj);
})