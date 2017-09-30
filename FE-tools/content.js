chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.isClicked === true) {
        var findSpmdIsOn = localStorage.getItem('findSpmdIsOn') || 'off'
        if (findSpmdIsOn == 'on') {
            localStorage.setItem('findSpmdIsOn', 'off')
            $('body').off('mouseenter mouseleave', '[data-spm-click]')
            $('body').off('mouseleave', '.spm-box')
            $('body').off('click.spm')
            $('body .chrome-plug-spm-car').remove()
            sendResponse('off')
        } else if (findSpmdIsOn == 'off') {
            var that = this
            localStorage.setItem('findSpmdIsOn', 'on')

            // 添加个数变化
            this.changeCounts = function() {
                var totalCount, dialogCount, personalCount
                dialogCount = $('body .chrome-plug-spm-input-dialog:checked').length
                personalCount = $('body .chrome-plug-spmbd-box').length
                totalCount = dialogCount + personalCount
                $('body .chrome-plug-spm-total-count').text(totalCount)
                $('body .chrome-plug-spm-dialog-count').text(dialogCount)
                $('body .chrome-plug-spm-personal-count').text(personalCount)
            }

            // 获取站点整体数据
            var spma = $('meta[name="spm-id"]').attr('content')
            var spmObj = {} // 全店整体数据
            $.ajax({
                url: '//data.alimama.net/api/chrome-plug/searchSpmAll.json',
                data: {
                    spma: spma
                },
                dataType: 'json'
            }).then(function(resp) {
                var data = resp.data
                spmObj = data.list[0]
            })
            // 购物车template
            var carTpl = function() {
                /*
                	<div class="chrome-plug-spm-car">
                		<div class="fl chrome-plug-spm-inlineblock chrome-plug-spm-icon">
                			<div class="chrome-plug-spm-icon-box chrome-plug-spm-icon-box-1" data-content="已添加个数">
                				<div class="chrome-plug-spm-count chrome-plug-spm-total-count">0</div>
                			</div>
                			<div class="chrome-plug-spm-icon-box chrome-plug-spm-icon-shopping" data-switch="off" data-content="展开购物车">
                				<img class="img20" src="https://img.alicdn.com/tfs/TB1rop8RVXXXXczXVXXXXXXXXXX-32-32.png" alt="展开关闭购物车"/>
                			</div>
                			<div class="chrome-plug-spm-icon-box chrome-plug-clear" data-content="清空购物车">
                				<img class="img18" src="https://img.alicdn.com/tfs/TB1UzyhRVXXXXcsXFXXXXXXXXXX-32-32.png" alt="清空购物车"/>
                			</div>
                			<div class="chrome-plug-spm-icon-box chrome-plug-spm-icon-box-4 chrome-plug-spm-btn-save" data-content="保存分组">
                				<img class="img18" src="https://img.alicdn.com/tfs/TB1Xj5uRVXXXXX5XFXXXXXXXXXX-32-32.png" alt="保存分组"/>
                			</div>
                		</div>
                		<div class="fl chrome-plug-spm-inlineblock chrome-plug-spm-car-content">
                			<div class="chrome-plug-save-error"></div>
                			<div class="mb20">
                				<input type="text" placeholder="自定义分组名称" class="chrome-plug-config-name chrome-plug-spm-input"/>
                			</div>
                			<div class="chrome-plug-spm-car-content-tab">
                				<div class="chrome-plug-spm-pointer chrome-plug-spm-inlineblock chrome-plug-spm-car-content-title chrome-plug-spm-car-content-tab-on" data-tab="1">
                					<span class="chrome-plug-spm-inlineblock">自定义</span>
                					<span class="chrome-plug-spm-inlineblock chrome-plug-spm-car-content-count chrome-plug-spm-personal-count">0</span>
                				</div>
                				<div class="chrome-plug-spm-pointer chrome-plug-spm-inlineblock chrome-plug-spm-car-content-title" data-tab="2">
                					<span class="chrome-plug-spm-inlineblock">浮层</span>
                					<span class="chrome-plug-spm-inlineblock chrome-plug-spm-car-content-count chrome-plug-spm-dialog-count">0</span>
                				</div>
                			</div>
                			<div class="chrome-plug-spm-car-define">
												<div class="chrome-plug-spm-car-spmTotal">
                					<h4 class="chrome-plug-spm-hide">
                						全站整体
                					</h4>
                				</div>
                				<div class="chrome-plug-spm-car-spmd">
                					<h4 class="chrome-plug-spm-hide">
                						按钮列表
                					</h4>
                				</div>
                				<div class="chrome-plug-spm-car-spmb">
                					<h4 class="chrome-plug-spm-hide">
                						页面列表
                					</h4>
                				</div>
                				<div class="chrome-plug-spm-car-percent">
                					<h4 class="chrome-plug-spm-hide">
                						使用率列表
                					</h4>
                				</div>
                			</div>

                			<div class="chrome-plug-spm-car-dialog chrome-plug-spm-hide">
                				<div class="chrome-plug-spm-input-box mt10">
                					<form>
                						<% _.each(dialogList, function (dialog) {%>
                							<div class="mb5">
                								<input type="checkbox" class="chrome-plug-spm-input-dialog mr5" value="<%= dialog%>" chrome-plug-spm-last="<%= dialog%>:<%= dialog%>"/><%= dialog%>
                							</div>
                						<%})%>
                					</form>
                				</div>
                			</div>
                		</div>
                	</div>
                */
            }.toString().replace(/[\r\n]/g, '').replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '').replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')

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
                    '钻展协议'
                ]
            }))

            // 购物车打开，关闭事件
            $('body .chrome-plug-spm-icon-shopping').on('click.spm', function(event) {
                if ($(this).attr('data-switch') == 'off') {
                    $(this).attr('data-switch', 'on').attr('data-content', '关闭购物车').parents('.chrome-plug-spm-car').css('right', '0px')
                } else {
                    $(this).attr('data-switch', 'off').attr('data-content', '展开购物车').parents('.chrome-plug-spm-car').css('right', '-260px')
                }
            })

            // 图标hover tips事件
            $('body .chrome-plug-spm-icon-box').hover(function(event) {
                var content = $(this).attr('data-content')
                var offset = $(this).offset()
                var top = offset.top + 4
                var left = offset.left - 88
                var template = '<div class="chrome-plug-spm-icon-tips" style="width:80px;height:30px;color:#fff;background-color: #070a22;border-radius:4px;text-align:center;padding:6px 0px;position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:99;">' + content + '</div>'
                $('body').append(template)
            }, function(event) {
                $('body .chrome-plug-spm-icon-tips').remove()
            })

            var spmTpl = function() {
                /*
                	<div class="mt10 mb10 chrome-plug-spmbd-box" chrome-plug-spm-last="<%= name%>:<%= last%>">
                		<span class="chrome-plug-spm-add-name"><%= name%></span>
                		<span class="chrome-plug-spm-pointer chrome-plug-spm-btn-delete chrome-plug-spm-hide ml10">
                			<img style="width: 16px;position:relative;top:1px;" src="https://img.alicdn.com/tfs/TB1QQ5hRVXXXXbRaXXXXXXXXXXX-20-20.png" alt="删除"/>
                		</span>
                	</div>
                */
            }.toString().replace(/[\r\n]/g, '').replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '').replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')

            var spmTplFn = _.template(spmTpl)

            // 添加spmd事件
            $('body').on('click.spm', '.chrome-plug-spm-btn-addSpmd', function(event) {
                var src = 'https://img.alicdn.com/tfs/TB1O7atRVXXXXapXVXXXXXXXXXX-20-20.png'
                var spmb = $(this).attr('chrome-plug-spmb')
                var spmd = $(this).attr('chrome-plug-spmd')
                var name = $(this).parents('td').next('td').children('input').val()
                $('body .chrome-plug-spm-car-spmd').append(spmTplFn({
                    name: name,
                    key: spmd,
                    last: spmd + '-' + spmb
                }))
                $(this).attr('src', src).removeClass('chrome-plug-spm-btn-addSpmd')
                that.changeCounts()
            })

            // 添加spmb事件
            $('body').on('click.spm', '.chrome-plug-spm-btn-addSpmb', function(event) {
                var src = 'https://img.alicdn.com/tfs/TB1O7atRVXXXXapXVXXXXXXXXXX-20-20.png'
                var spmb = $(this).attr('chrome-plug-spmb')
                var name = $(this).parents('td').next('td').children('input').val()
                $('body .chrome-plug-spm-car-spmb').append(spmTplFn({
                    name: name,
                    key: spmb,
                    last: spmb
                }))
                $(this).attr('src', src).removeClass('chrome-plug-spm-btn-addSpmb')
                that.changeCounts()
            })

            // 添加全站整体事件
            $('body').on('click.spm', '.chrome-plug-spm-btn-addSpmTotal', function(event) {
                var src = 'https://img.alicdn.com/tfs/TB1O7atRVXXXXapXVXXXXXXXXXX-20-20.png'
                var name = '全站整体'
                $('body .chrome-plug-spm-car-spmTotal').append(spmTplFn({
                    name: name,
                    key: spma,
                    last: spma
                }))
                $(this).attr('src', src).removeClass('chrome-plug-spm-btn-addSpmTotal')
                that.changeCounts()
            })

            // 添加使用率事件
            $('body').on('click.spm', '.chrome-plug-spm-btn-addSpmPercent', function(event) {
                var src = 'https://img.alicdn.com/tfs/TB1O7atRVXXXXapXVXXXXXXXXXX-20-20.png'
                var spmb = $(this).attr('chrome-plug-spmb')
                var spmd = $(this).attr('chrome-plug-spmd')
                var name = $(this).parents('td').next('td').children('input').val()
                var last
                if ($(this).attr('data-type') == '1') {
                    last = spmd + '-' + spmb + '/' + 'spmb-' + spmb
                } else {
                    last = spmd + '-' + spmb + '/' + 'spma-' + spma
                }
                $('body .chrome-plug-spm-car-percent').append(spmTplFn({
                    name: name,
                    last: last
                }))
                $(this).attr('src', src).removeClass('chrome-plug-spm-btn-addSpmPercent')
                that.changeCounts()
            })

            // 添加dialog
            $('body .chrome-plug-spm-input-dialog').on('click.spm', function(event) {
                that.changeCounts()
            })
            // 删除spmb、spmd事件
            $('body').on('click.spm', '.chrome-plug-spm-btn-delete', function(event) {
                $(this).parent('.chrome-plug-spmbd-box').remove()
                that.changeCounts()
            })

            // tab切换事件
            $('body .chrome-plug-spm-car-content-title').on('click.spm', function(event) {
                var tab = $(this).attr('data-tab')
                if (tab == '1') {
                    $(this).addClass('chrome-plug-spm-car-content-tab-on')
                        .siblings('.chrome-plug-spm-car-content-title').removeClass('chrome-plug-spm-car-content-tab-on')
                        .end().parents('.chrome-plug-spm-car-content').children('.chrome-plug-spm-car-define').show()
                        .next('.chrome-plug-spm-car-dialog').hide()
                } else {
                    $(this).addClass('chrome-plug-spm-car-content-tab-on')
                        .siblings('.chrome-plug-spm-car-content-title').removeClass('chrome-plug-spm-car-content-tab-on')
                        .end().parents('.chrome-plug-spm-car-content').children('.chrome-plug-spm-car-define').hide()
                        .next('.chrome-plug-spm-car-dialog').show()
                }
            })

            // hover 显示删除
            $('body').on('mouseenter mouseleave', '.chrome-plug-spmbd-box', function(event) {
                if (event.type == 'mouseenter') {
                    $(this).children('.chrome-plug-spm-btn-delete').removeClass('chrome-plug-spm-hide')
                } else {
                    $(this).children('.chrome-plug-spm-btn-delete').addClass('chrome-plug-spm-hide')
                }
            })
            // 保存提交
            $('body').on('click.spm', '.chrome-plug-spm-btn-save', function(event) {
                var name = $('body .chrome-plug-config-name').val()
                var spmblist = []
                var spmdlist = []
                var dialoglist = []
                var spmalist = []
                var percentlist = []
                _.each($('body .chrome-plug-spm-car-spmd .chrome-plug-spmbd-box'), function(item) {
                    spmdlist.push($(item).attr('chrome-plug-spm-last'))
                })
                _.each($('body .chrome-plug-spm-car-spmb .chrome-plug-spmbd-box'), function(item) {
                    spmblist.push($(item).attr('chrome-plug-spm-last'))
                })
                _.each($('body .chrome-plug-spm-car-spmTotal .chrome-plug-spmbd-box'), function(item) {
                    spmalist.push($(item).attr('chrome-plug-spm-last'))
                })
                _.each($('body .chrome-plug-spm-car-percent .chrome-plug-spmbd-box'), function(item) {
                    percentlist.push($(item).attr('chrome-plug-spm-last'))
                })
                _.each($('body .chrome-plug-spm-input-dialog'), function(item) {
                    if ($(item).prop('checked')) {
                        dialoglist.push($(item).attr('chrome-plug-spm-last'))
                    }
                })
                $.ajax({
                    url: '//data.alimama.net/api/user-config/add.json',
                    data: {
                        spma: spma,
                        name: name,
                        spmdlist: spmdlist.join(','),
                        spmblist: spmblist.join(','),
                        spmalist: spmalist.join(','),
                        percentlist: percentlist.join(','),
                        dialoglist: dialoglist.join(',')
                    },
                    dataType: 'json'
                }).then(function(resp) {
                    if (!resp.info.ok) {
                        $('body .chrome-plug-save-error').text(resp.info.message)
                        return false
                    }
                    $('body .chrome-plug-save-error').empty()
                    $('body .chrome-plug-spm-icon-shopping').attr('data-switch', 'off').attr('data-content', '展开购物车').parents('.chrome-plug-spm-car').css('right', '-260px')
                }, function(resp) {
                    if (resp.status == 401) {
                        $('body .chrome-plug-save-error').html('请先登录<a href="https://data.alimama.net" target="_blank">埋点平台</a>')
                        return false
                    }
                })
            })

            // 一键清空事件
            $('body .chrome-plug-clear').on('click.spm', function(event) {
                $('body .chrome-plug-spmbd-box').remove()
                $('body .chrome-plug-spm-input-dialog').prop('checked', false)
                that.changeCounts()
            })

            // 展开高级事件
            $('body').on('click.spm', '.chrome-plug-spm-advance-btn', function(event) {
                var status = $(this).attr('data-status')
                if (status == '1') {
                    $(this).attr('data-status', 2).text('收起高级设置 >>').next().show().end()
                        .parents('.chrome-plug-spm-advance').children('.chrome-plug-spm-table').show()
                } else {
                    $(this).attr('data-status', 1).text('展开高级设置 >>').next().hide().end()
                        .parents('.chrome-plug-spm-advance').children('.chrome-plug-spm-table').hide()
                }
            })

            // 埋点hover事件
            var timer
            $('body').on('mouseenter mouseleave', '[data-spm-click]', function(event) {
                var that = this
                if (event.type == 'mouseenter') {
                    timer = setTimeout(function() {
                        var attr = $(that).attr('data-spm-click')
                        var reg = /.*locaid=(.*)/
                        var spma = $('meta[name="spm-id"]').attr('content')
                        var spmd = attr.match(reg)[1]
                        var winWidth = $(window).width()
                        var offset = $(event.currentTarget).offset()
                        var currentHeight = $(event.currentTarget).height()
                        var spmb = $('body').attr('data-spm')
                        var top = offset.top + currentHeight
                        var left = offset.left
                        if (left + 340 > winWidth) {
                            left = left - 340
                        }
                        // 埋点数据template
                        var tpl = function() {
                            /*
                            	<div class="spm-box" style="background-color:#fff;color:#333;border:1px solid #eaeaea;position:absolute;top:<%= top%>px;left: <%= left%>px;z-index:99999999999;">
                            			<table class="chrome-plug-spm-table">
                            				<thead>
                            					<tr>
                            						<th>操作</th>
                            						<th>埋点</th>
                            						<th class="align-right">pv</th>
                            						<th class="align-right">uv</th>
                            					</tr>
                            				</thead>
                            				<tbody>
                            					<tr>
                            						<td>
                            							<img class="chrome-plug-spm-btn-addSpmd chrome-plug-spm-pointer" chrome-plug-spmd="<%= spmd%>" chrome-plug-spmb="<%= spmb%>" src="https://img.alicdn.com/tfs/TB176KiRVXXXXcEaXXXXXXXXXXX-20-20.png" alt="操作"/>
                            						</td>
                            						<td>
                            							<span>点击</span>
                            							<input class="chrome-plug-spm-input-common" type="text" value="<%= spmd%>"/>
                            						</td>
                            						<td class="align-right">
                            							<span><%= spmdObj.pv%></span>
                            						</td>
                            						<td class="align-right">
                            							<span><%= spmdObj.uv%></span>
                            						</td>
                            					</tr>
                            					<tr>
                            						<td>
                            							<img class="chrome-plug-spm-btn-addSpmb chrome-plug-spm-pointer" chrome-plug-spmd="<%= spmd%>" chrome-plug-spmb="<%= spmb%>" src="https://img.alicdn.com/tfs/TB176KiRVXXXXcEaXXXXXXXXXXX-20-20.png" alt="操作"/>
                            						</td>
                            						<td>
                            							<span>页面</span>
                            							<input class="chrome-plug-spm-input-common" type="text" value="<%= spmb%>"/>
                            						</td>
                            						<td class="align-right">
                            							<span><%= spmbObj.pv%></span>
                            						</td>
                            						<td class="align-right">
                            							<span><%= spmbObj.uv%></span>
                            						</td>
                            					</tr>
                            					<tr>
                            						<td>
                            							<img class="chrome-plug-spm-btn-addSpmTotal chrome-plug-spm-pointer" src="https://img.alicdn.com/tfs/TB176KiRVXXXXcEaXXXXXXXXXXX-20-20.png" alt="操作"/>
                            						</td>
                            						<td>
                            							<span>全站整体</span>
                            						</td>
                            						<td class="align-right">
                            							<span><%= spmObj.pv%></span>
                            						</td>
                            						<td class="align-right">
                            							<span><%= spmObj.uv%></span>
                            						</td>
                            					</tr>
                            				</tbody>
                            			</table>
                            			<div style="width:100%;height:1px;background-color:#eaeaea;"></div>
                            			<div class="chrome-plug-spm-advance">
                            				<div class="mb10 mt10" style="padding: 0px 15px;overflow:hidden;">
                            					<div class="fl chrome-plug-spm-advance-btn chrome-plug-spm-pointer" data-status="1">展开高级指标 >></div>
                            					<span class="fr chrome-plug-spm-hide">公式（UV占比）</span>
                            				</div>
                            				<table class="chrome-plug-spm-table chrome-plug-spm-hide">
                            					<tbody>
                            						<tr>
                            							<td>
                            								<img class="chrome-plug-spm-btn-addSpmPercent" data-type="1" chrome-plug-spmd="<%= spmd%>" chrome-plug-spmb="<%= spmb%>" src="https://img.alicdn.com/tfs/TB176KiRVXXXXcEaXXXXXXXXXXX-20-20.png" alt="操作"/>
                            							</td>
                            							<td>
                            								<input class="chrome-plug-spm-input-common" type="text" value="当前页打开率"/>
                            							</td>
                            							<td class="align-right">
                            								<span>点击 / 页面</span>
                            							</td>
                            						</tr>
                            						<tr>
                            							<td>
                            								<img class="chrome-plug-spm-btn-addSpmPercent" data-type="2" chrome-plug-spmd="<%= spmd%>" chrome-plug-spmb="<%= spmb%>" src="https://img.alicdn.com/tfs/TB176KiRVXXXXcEaXXXXXXXXXXX-20-20.png" alt="操作"/>
                            							</td>
                            							<td>
                            								<input class="chrome-plug-spm-input-common" type="text" value="全站点打开率"/>
                            							</td>
                            							<td class="align-right">
                            								<span>点击 / 全站</span>
                            							</td>
                            						</tr>
                            					</tbody>
                            				</table>
                            			</div>
                            	</div>
                            */
                        }.toString().replace(/[\r\n]/g, '').replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '').replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')
                        var tplFn = _.template(tpl)
                        $.ajax({
                            url: '//data.alimama.net/api/chrome-plug/searchSpmbSpmd.json',
                            data: {
                                spma: spma,
                                spmb: spmb,
                                spmd: spmd
                            },
                            dataType: 'json'
                        }).then(function(resp) {
                            var data = resp.data
                            var htmlContent = tplFn({
                                top: top,
                                left: left,
                                spmb: spmb,
                                spmd: spmd,
                                spmbObj: data.spmb,
                                spmdObj: data.spmd,
                                spmObj: spmObj
                            })
                            $('body').append(htmlContent)
                        })

                        // window.clipSpmd = new Clipboard('.data-spm-d')
                        // window.clipSpmb = new Clipboard('.data-spm-b')
                        // window.clipSpmCopy = new Clipboard('.data-spm-copy')
                    }, 400)
                } else if (event.type == 'mouseleave') {
                    if ($(event.relatedTarget).parents('.spm-box').length) return
                    clearTimeout(timer)
                    $('body .spm-box').remove()
                }
            })

            $('body').on('mouseleave', '.spm-box', function() {
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