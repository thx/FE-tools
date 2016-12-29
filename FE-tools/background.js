chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.sendMessage(tab.id, {
		isClicked: true
	}, function(response) {
		if (response == 'on') {
			chrome.browserAction.setIcon({
				path: "icon_on.png"
			});
		} else if (response == 'off') {
			chrome.browserAction.setIcon({
				path: "icon_off.png"
			});
		} else {
			return
		}
	});
});