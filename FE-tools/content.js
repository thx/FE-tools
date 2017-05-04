chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.isClicked === true) {
    var findSpmdIsOn = localStorage.getItem('findSpmdIsOn') || 'off'
    if (findSpmdIsOn == 'on') {
      localStorage.setItem('findSpmdIsOn', 'off')
      $('body').off('mouseenter mouseleave', '[data-spm-click]')
      $('body').off('mouseleave', '.spm-box')
	  $('body .chrome-plug-spm-car').remove()
      sendResponse('off')
    } else if (findSpmdIsOn == 'off') {
      localStorage.setItem('findSpmdIsOn', 'on')
	  //购物车template
	var carTpl = function(){
		/*
			<div class="chrome-plug-spm-car">
				<div class="fl chrome-plug-spm-inlineblock chrome-plug-spm-icon" data-switch="off">
					<img src="https://img.alicdn.com/tfs/TB1MiArQFXXXXauXXXXXXXXXXXX-48-48.png" alt="购物车图标"/>
				</div>
				<div class="fl chrome-plug-spm-inlineblock chrome-plug-spm-car-content">
					<div>
						<a href="javascript:;" class="chrome-plug-clear">一键清空</a>
					</div>
					<div>
						<h4>
							配置名称
						</h4>
						<input type="text" placeholder="自定义配置名称" class="chrome-plug-config-name chrome-plug-spm-input mb10 mt10"/>
					</div>
					<div class="chrome-plug-spm-car-spmd">
						<h4>
						    spmd列表
						</h4>
					</div>
					<div class="chrome-plug-spm-car-spmb mt30">
						<h4>
						    spmb列表
						</h4>
					</div>
					<div class="chrome-plug-spm-car-dialog mt30">
						<h4>
						    弹窗列表
						</h4>
						<div class="chrome-plug-spm-input-box mt10">
							<form>
								<% _.each(dialogList, function (dialog) {%>
									<div>
										<input type="checkbox" class="chrome-plug-spm-input-dialog mr5" value="<%= dialog%>" chrome-plug-spm-last="<%= dialog%>:<%= dialog%>"/><%= dialog%>
									</div>
								<%})%>
							</form>
						</div>
					</div>
					<button class="chrome-plug-spm-btn chrome-plug-spm-btn-save mt30">保存</button>
					<div class="chrome-plug-save-error mt10"></div>
				</div>
			</div>
		*/
	}.toString().replace(/[\r\n]/g, "").replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '').replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')
	var carTplFn = _.template(carTpl)
	$('body').append(carTplFn({
		dialogList: ['新手引导',
					 '首页引导',
					 '计划草稿',
					 '全店新建编辑资源位',
					 '单品新建编辑资源位',
					 '类目型定向',
					 '相似宝贝定向',
					 '智能定向',
					 '营销场景定向',
					 '达摩盘定向',
					 '兴趣点定向',
					 '访客定向',
					 '群体定向',
					 '卖家属性定向',
					 '单品智能定向-购物意图定向',
					 '单品达摩盘定向',
					 '单品扩展定向',
					 '单品创意编辑',
					 '添加创意-创意库选择',
					 '添加创意-本地上传',
					 '添加创意-创意模板制作',
					 '添加创意-快捷制作',
					 '计划设置-整体',
					 '计划复制',
					 '单元复制',
					 '选择定向类型',
					 '选择计划单元',
					 '全店-添加编辑定向-出价设置',
					 '全店-添加编辑资源位-出价设置',
					 '单品计划设置-整体',
					 '单品选择计划单元',
					 '单品选择定向类型',
					 '单品-智能定向-相似宝贝定向-横向管理',
					 '单品-智能定向-访客定向-横向管理',
					 '单品-增加资源位',
					 '单品-增加资源位-批量溢价',
					 '批量出价',
					 '钻展协议']
	}))

	//购物车打开，关闭事件
	$('body .chrome-plug-spm-icon').on('click', function(event){
		if($(this).attr('data-switch') == 'off'){
			$(this).attr('data-switch', 'on').parent('.chrome-plug-spm-car').css('right','0px')
		}else{
			$(this).attr('data-switch', 'off').parent('.chrome-plug-spm-car').css('right','-300px')
		}
	})

	var spmTpl = function(){
		/*
			<div class="mt10 mb10 chrome-plug-spmbd-box" chrome-plug-spm-last="<%= name%>:<%= last%>">
				<span><%= name%>：</span>
				<span><%= key%></span>
				<button class="chrome-plug-spm-btn chrome-plug-spm-btn-delete ml10">删除</button>
			</div>
		*/
	}.toString().replace(/[\r\n]/g, "").replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '').replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')
	var spmTplFn = _.template(spmTpl)

	//添加spmd事件
	$('body').on('click', '.chrome-plug-spm-btn-addSpmd', function(event){
		var spmb = $(this).attr('chrome-plug-spmb')
		var spmd = $(this).attr('chrome-plug-spmd')
		var name = $(this).siblings('.chrome-plug-spm-input').val()
		$('body .chrome-plug-spm-car-spmd').append(spmTplFn({
			name: name,
			key: spmd,
			last: spmd + '-' + spmb
		}))
		$(this).parent('div').append('<span class="ml10">添加成功</span>')
				.end().remove()
	})

	//添加spmb事件
	$('body').on('click', '.chrome-plug-spm-btn-addSpmb', function(event){
		var spmb = $(this).attr('chrome-plug-spmb')
		var name = $(this).siblings('.chrome-plug-spm-input').val()
		$('body .chrome-plug-spm-car-spmb').append(spmTplFn({
			name: name,
			key: spmb,
			last: spmb
		}))
		$(this).parent('div').append('<span class="ml10">添加成功</span>')
				.end().remove()
	})

	//删除spmb、spmd事件
	$('body').on('click', '.chrome-plug-spm-btn-delete', function(event){
		$(this).parent('.chrome-plug-spmbd-box').remove()
	})

	//保存提交
	$('body').on('click', '.chrome-plug-spm-btn-save' ,function(event){
		var name = $('body .chrome-plug-config-name').val()
		var spmblist = []
		var spmdlist = []
		var dialoglist = []
		_.each($('body .chrome-plug-spm-car-spmd .chrome-plug-spmbd-box'), function(item){
			spmdlist.push($(item).attr('chrome-plug-spm-last'))
		})
		_.each($('body .chrome-plug-spm-car-spmb .chrome-plug-spmbd-box'), function(item){
			spmblist.push($(item).attr('chrome-plug-spm-last'))
		})
		_.each($('body .chrome-plug-spm-input-dialog'), function(item){
			if($(item).prop('checked')){
				dialoglist.push($(item).attr('chrome-plug-spm-last'))
			}
		})
		$.ajax({
			url: '//data.alimama.net/api/user-config/add.json',
			data: {
				name: name,
				spmdlist: spmdlist.join(','),
				spmblist: spmblist.join(','),
				dialoglist: dialoglist.join(',')
			},
			dataType: 'json'
		}).then(function(resp){
			if(!resp.info.ok){
				$('body .chrome-plug-save-error').text(resp.info.message)
				return false
			}
			$('body .chrome-plug-save-error').empty()
			$('body .chrome-plug-spm-icon').attr('data-switch', 'off').parent('.chrome-plug-spm-car').css('right','-300px')
		})
	})

	//一键清空事件
	$('body .chrome-plug-clear').on('click', function(event){
		$('body .chrome-plug-spmbd-box').remove()
		$('body .chrome-plug-config-name').val('')
	})

	//埋点hover事件
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
		  //埋点数据template
		  var tpl = function(){
			  /*
			  	  <div class="spm-box" style="padding:20px;background-color:#fff;color:#333;border:1px solid #eaeaea;position:absolute;top:<%= top%>px;left: <%= left%>px;z-index:99999999999;">
						<div style="margin-bottom:15px;">
							<div>
								点击spmd段为：<span class="data-spm-d" data-clipboard-target=".data-spm-d"><%= spmd%></span>
								<span style="margin-left:10px;">pv：<span style="color: #4d7fff;font-family:tahoma;font-weight: bold;"><%= spmdObj.pv%></span></span>
								<span style="margin-left:10px;">uv：<span style="color: #4d7fff;font-family:tahoma;font-weight: bold;"><%= spmdObj.uv%></span></span>
							</div>
							<div class="mt10">
								<input class="chrome-plug-spm-input" type="text" placeholder="点击自定义名称"/>
								<button class="chrome-plug-spm-btn chrome-plug-spm-btn-addSpmd" chrome-plug-spmd="<%= spmd%>" chrome-plug-spmb="<%= spmb%>">添加购物车</button>
							</div>
						</div>
						<div style="margin-bottom:15px;">
							<div>
								页面spmb段为：<span class="data-spm-b" data-clipboard-target=".data-spm-b"><%= spmb%></span>
								<span style="margin-left:10px;">pv：<span style="color: #4d7fff;font-family:tahoma;font-weight: bold;"><%= spmbObj.pv%></span></span>
								<span style="margin-left:10px;">uv：<span style="color: #4d7fff;font-family:tahoma;font-weight: bold;"><%= spmbObj.uv%></span></span>
							</div>
							<div class="mt10">
								<input class="chrome-plug-spm-input" type="text" placeholder="页面自定义名称"/>
								<button class="chrome-plug-spm-btn chrome-plug-spm-btn-addSpmb" chrome-plug-spmd="<%= spmd%>" chrome-plug-spmb="<%= spmb%>">添加购物车</button>
							</div>
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
			// window.clipSpmd = new Clipboard('.data-spm-d')
			// window.clipSpmb = new Clipboard('.data-spm-b')
			// window.clipSpmCopy = new Clipboard('.data-spm-copy')
		  })
        } else if (event.type == 'mouseleave') {
          if ($(event.relatedTarget).hasClass('spm-box')) return

          $('body .spm-box').remove()
        }
      })

      $('body').on('mouseleave', '.spm-box', function () {
        // window.clipSpmb.destroy()
        // window.clipSpmd.destroy()
        // window.clipSpmCopy.destroy()
        // delete window.clipSpmb
        // delete window.clipSpmd
        // delete window.clipSpmCopy
        $(this).remove()
      })
      sendResponse('on')
    }
  } else {
    sendResponse('error')
  }
})
