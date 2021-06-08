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
			let url = "https://fether.m.alibaba-inc.com/analytics/getSitePv?_f_needLogin=1&token=xxx"
			fetch(url, {
				body: JSON.stringify({
					spma: request.spma
				}),
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				credentials: 'include',
			}).then(response => response.json())
				.then(resp => sendResponse(resp.result))
				.catch(error => {
					alert(error)
				})
			return true;
		}
		
		if (request.contentScriptQuery == "querySpmd") {
			let url = "https://fether.m.alibaba-inc.com/analytics/search_spmd?_f_needLogin=1&token=xxx"
			fetch(url, {
				body: JSON.stringify({
					spma: request.spma,
					spmb: request.spmb,
					spmc: request.spmc,
					spmd: request.spmd
				}),
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				credentials: 'include',
			})
				.then(response => response.json())
				.then(resp => sendResponse(resp.result))
				.catch(error => {
					alert(error)
				})
			return true;
		}
		
		if (request.contentScriptQuery == "addConfig") {
			let url = "https://fether.m.alibaba-inc.com/analytics/api_add_report?_f_needLogin=1&token=xxx"
			fetch(url, {
				body: JSON.stringify({
					spma: request.spma,
					name: request.name,
					spmalist: request.spmalist,
					spmblist: request.spmblist,
					spmclist: request.spmclist,
					spmdlist: request.spmdlist,
					percentlist: request.percentlist,
					dialoglist: request.dialoglist
				}),
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				credentials: 'include',
			})
				.then(response => response.json())
				.then(resp => sendResponse(resp.result))
				.catch(error => {
					alert(error)
				})
			return true;
		}

		if (request.contentScriptQuery == "addSpmdName") {
			let url = "https://fether.m.alibaba-inc.com/analytics/api_add_spmdName?_f_needLogin=1&token=xxx"
			fetch(url, {
				body: JSON.stringify({
					spma: request.spma,
					spmd: request.spmd,
					name: request.name
				}),
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				credentials: 'include',
			})
				.then(response => response.json())
				.then(resp => sendResponse(resp.result))
				.catch(error => {
					alert(error)
				})
			return true;
		}

		if (request.contentScriptQuery == "queryNameList") {
			let url = "https://fether.m.alibaba-inc.com/analytics/api_indicator_query?_f_needLogin=1&token=xxx"
			fetch(url, {
				body: JSON.stringify({
					fName: request.fName,
					sName: request.sName
				}),
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				credentials: 'include',
			})
				.then(response => response.json())
				.then(resp => sendResponse(resp.result))
				.catch(error => {
					alert(error)
				})
			return true;
		}

		if (request.contentScriptQuery == "addIndicatorName") {
			let url = "https://fether.m.alibaba-inc.com/analytics/api_indicator_config_add?_f_needLogin=1&token=xxx"
			fetch(url, {
				body: JSON.stringify(request),
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				credentials: 'include',
			})
				.then(response => response.json())
				.then(resp => sendResponse(resp.result))
				.catch(error => {
					alert(error)
				})
			return true;
		}

		if (request.contentScriptQuery == "deleteIndicatorName") {
			let url = "https://fether.m.alibaba-inc.com/analytics/api_indicator_config_delete?_f_needLogin=1&token=xxx"
			fetch(url, {
				body: JSON.stringify(request),
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				credentials: 'include',
			})
				.then(response => response.json())
				.then(resp => sendResponse(resp.result))
				.catch(error => {
					alert(error)
				})
			return true;
		}

		if (request.contentScriptQuery == "queryNameConfig") {
			let url = "https://fether.m.alibaba-inc.com/analytics/api_indicator_config_query?_f_needLogin=1&token=xxx"
			fetch(url, {
				body: JSON.stringify(request),
				method: 'POST',
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				credentials: 'include',
			})
				.then(response => response.json())
				.then(resp => sendResponse(resp.result))
				.catch(error => {
					alert(error)
				})
			return true;
		}
	});