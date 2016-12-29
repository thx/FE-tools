chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.isClicked === true) {
		var findSpmdIsOn = localStorage.getItem('findSpmdIsOn') || 'off'
		if (findSpmdIsOn == 'on') {
			localStorage.setItem('findSpmdIsOn', 'off');
			$('body').off('mouseenter mouseleave', '[data-spm-click]')
			$('body').off('mouseleave', '.data-spm-d');
			sendResponse('off');
		} else if (findSpmdIsOn == 'off') {
			localStorage.setItem('findSpmdIsOn', 'on');
			$('body').on('mouseenter mouseleave', '[data-spm-click]', function(event) {
				if (event.type == 'mouseenter') {
					var attr = $(this).attr('data-spm-click')
					var reg = /.*locaid=(.*)/
					var spmd = attr.match(reg)[1]
					var offset = $(event.currentTarget).offset()
					var currentHeight = $(event.currentTarget).height()
					$('body').append('<div class="data-spm-d" data-clipboard-target=".data-spm-d" style="padding:20px;background-color:#fff;color:#333;border:1px solid #eaeaea;position:absolute;top:' + (offset.top + currentHeight) + 'px;left: ' + offset.left + 'px;z-index:999999;">' + spmd + '</div>')
					window.clip = new Clipboard('.data-spm-d');
				} else if (event.type == 'mouseleave') {
					if ($(event.relatedTarget).hasClass('data-spm-d')) return

					$('body .data-spm-d').remove()
				}
			})

			$('body').on('mouseleave', '.data-spm-d', function() {
				window.clip.destroy()
				delete window.clip
				$(this).remove()
			});
			sendResponse('on');
		}

	} else {
		sendResponse('error');
	}
});