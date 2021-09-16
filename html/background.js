var isEnabled = true;
const DELAY = -5000;    // The pips starts playing five seconds before the hour changes
restoreOptions();

window.setTimeout(triggerAlarm, msToNextHour() + DELAY);

function playRadioPips() {
    var audio = new Audio('res/radio-pips.ogg');
    audio.volume = 0.5;
    audio.play();
}

function triggerAlarm() {
    if (isEnabled) {
        playRadioPips();
    }
    window.setTimeout(triggerAlarm, 3600000);
}

function updateIcon() {
    browser.browserAction.setIcon({
        path: isEnabled ? {
            19: "res/icon-19.png",
            38: "res/icon-38.png"
        } : {
            19: "res/icon-19-off.png",
            38: "res/icon-38-off.png"
        }
    });

    browser.browserAction.setTitle({
        title: isEnabled ? 'Greenwich Time Signal is ON' : 'Greenwich Time Signal is OFF'
    });
}

function toggleAudio() {
    isEnabled = !isEnabled;
    saveOptions();
    updateIcon();
}

function saveOptions() {
    browser.storage.local.set({
        isEnabled: isEnabled
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        console.log("setCurrentChoice:", result);
        isEnabled = result.isEnabled;
        updateIcon();
    }

    function onError(error) {
        console.log("onError:", error);
        isEnabled = true;
        updateIcon();
    }

    let getting = browser.storage.local.get("isEnabled");
    getting.then(setCurrentChoice, onError);
}

function msToNextHour() {
    return (3600000 - new Date().getTime() % 3600000);
}

browser.browserAction.onClicked.addListener(toggleAudio);