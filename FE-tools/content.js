chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.isClicked === true) {
    var findSpmdIsOn = localStorage.getItem('findSpmdIsOn') || 'off'
    if (findSpmdIsOn == 'on') {
      localStorage.setItem('findSpmdIsOn', 'off')
      $('body').off('mouseenter mouseleave', '[data-spm-click]')
      $('body').off('mouseleave', '.spm-box')
      sendResponse('off')
    } else if (findSpmdIsOn == 'off') {
      localStorage.setItem('findSpmdIsOn', 'on')
      $('body').on('mouseenter mouseleave', '[data-spm-click]', function (event) {
        if (event.type == 'mouseenter') {
          var attr = $(this).attr('data-spm-click')
          var reg = /.*locaid=(.*)/
		  var spma = $('meta[name="spm-id"]').attr('content')
          var spmd = attr.match(reg)[1]
          var offset = $(event.currentTarget).offset()
          var currentHeight = $(event.currentTarget).height()
          var spmb = $('body').attr('data-spm')
		  var top = offset.top +  currentHeight
		  var left = offset.left
		  var tpl = function(){
			  /*
			  	  <div class="spm-box" style="padding:20px;background-color:#fff;color:#333;border:1px solid #eaeaea;position:absolute;top:<%= top%>px;left: <%= left%>px;z-index:9999999999;">
						<div style="margin-bottom:15px;">
							spmd段为：<span class="data-spm-d" data-clipboard-target=".data-spm-d"><%= spmd%></span>
							<span style="margin-left:10px;">pv：<span style="color: #4d7fff;font-family:tahoma;font-weight: bold;"><%= spmdObj.pv%></span></span>
							<span style="margin-left:10px;">uv：<span style="color: #4d7fff;font-family:tahoma;font-weight: bold;"><%= spmdObj.uv%></span></span>
						</div>
						<div style="margin-bottom:15px;">
							spmb段为：<span class="data-spm-b" data-clipboard-target=".data-spm-b"><%= spmb%></span>
							<span style="margin-left:10px;">pv：<span style="color: #4d7fff;font-family:tahoma;font-weight: bold;"><%= spmbObj.pv%></span></span>
							<span style="margin-left:10px;">uv：<span style="color: #4d7fff;font-family:tahoma;font-weight: bold;"><%= spmbObj.uv%></span></span>
						</div>
						<div>
							个性化配置复制：<span class="data-spm-copy" data-clipboard-target=".data-spm-copy"><%= spmd%>-<%= spmb%></span>
						</div>
				  </div>
			  */
		  }.toString().replace(/[\r\n]/g, "").replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '').replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')
		  var tplFn = _.template(tpl)
		  $.ajax({
			  url: '//data.alimama.net/api/chrome-plug/searchSpmbSpmd.json',
			  data: {
				  spma:spma,
				  spmb:spmb,
				  spmd:spmd
			  },
			  dataType: 'json'
		  }).then(function(resp){
			var data = resp.data
			var htmlContent = tplFn({
				top: top,
				left: left,
				spmb: spmb,
				spmd: spmd,
				spmbObj: data.spmb,
				spmdObj: data.spmd
			})
			$('body').append(htmlContent)
			window.clipSpmd = new Clipboard('.data-spm-d')
			window.clipSpmb = new Clipboard('.data-spm-b')
			window.clipSpmCopy = new Clipboard('.data-spm-copy')
		  })
        } else if (event.type == 'mouseleave') {
          if ($(event.relatedTarget).hasClass('spm-box')) return

          $('body .spm-box').remove()
        }
      })

      $('body').on('mouseleave', '.spm-box', function () {
        window.clipSpmb.destroy()
        window.clipSpmd.destroy()
        window.clipSpmCopy.destroy()
        delete window.clipSpmb
        delete window.clipSpmd
        delete window.clipSpmCopy
        $(this).remove()
      })
      sendResponse('on')
    }
  } else {
    sendResponse('error')
  }
})
