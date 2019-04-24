chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.sendMessage(tab.id, {
		isClicked: true
	}, function (response) {
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
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.contentScriptQuery == "querySpmAll") {
			var url = "https://data.alimama.net/api/chrome-plug/searchSpmAll.json?spma=" +
				encodeURIComponent(request.spma);
			fetch(url)
				.then(response => response.json())
				.then(resp => sendResponse(resp))
				.catch(error => {
					alert(error)
				})
			return true;
		}

		if (request.contentScriptQuery == "querySpmd") {
			var url = "https://data.alimama.net/api/chrome-plug/searchSpmbSpmd.json?spma=" +
				encodeURIComponent(request.spma) + "&spmb=" + encodeURIComponent(request.spmb) + "&spmd=" + encodeURIComponent(request.spmd)
			fetch(url)
				.then(response => response.json())
				.then(resp => sendResponse(resp))
				.catch(error => {
					alert(error)
				})
			return true;
		}

		if (request.contentScriptQuery == "addConfig") {
			var url = "https://data.alimama.net/api/user-config/add.json?spma=" +
			request.spma + "&name=" + request.name + "&spmalist=" + request.spmalist + "&spmblist=" + request.spmblist + "&spmdlist=" + request.spmdlist + "&percentlist=" + request.percentlist + "&dialoglist=" + request.dialoglist
			fetch(url)
				.then(response => response.json())
				.then(resp => sendResponse(resp))
				.catch(error => {
					alert(error)
				})
			return true;
		}

		if (request.contentScriptQuery == "addSpmdName") {
			var url = "https://data.alimama.net/api/chrome-plug/addSpmdName.json?spma=" +
			request.spma + "&name=" + request.name + "&spmd=" + request.spmd
			fetch(url)
				.then(response => response.json())
				.then(resp => sendResponse(resp))
				.catch(error => {
					alert(error)
				})
			return true;
		}
	});