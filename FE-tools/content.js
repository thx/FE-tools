chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.isClicked === true) {
        var findSpmdIsOn = localStorage.getItem('findSpmdIsOn') || 'off'
        if (findSpmdIsOn == 'on') {
            localStorage.setItem('findSpmdIsOn', 'off')
            $('body').off('mouseenter mouseleave', '[data-spm-click]')
            $('body').off('mouseleave', '.spm-box')
            $('body').off('click.plugin')
            $('body .chrome-plug-spm-car').remove()
            sendResponse('off')
        } else if (findSpmdIsOn == 'off') {
            var that = this
            localStorage.setItem('findSpmdIsOn', 'on')

            // 添加个数变化
            this.changeCounts = function () {
                var totalCount, dialogCount, personalCount
                dialogCount = $('body .chrome-plug-spm-input-dialog:checked').length
                personalCount = $('body .chrome-plug-spmbd-box').length
                totalCount = dialogCount + personalCount
                $('body .chrome-plug-spm-total-count').text(totalCount)
                $('body .chrome-plug-spm-dialog-count').text(dialogCount)
                $('body .chrome-plug-spm-personal-count').text(personalCount)
            }

            // 获取站点整体数据
            var spma = $('meta[name="spm-id"]').attr('content') || $('meta[name="data-spm"]').attr('content')
            var spmObj = {} // 全店整体数据
            var dialogList = []
            chrome.runtime.sendMessage(
                {contentScriptQuery: "querySpmAll", spma: spma},
                resp => {
                    var data = resp.data
                    spmObj = data.list[0] || {}
                    dialogList = _.map(data.dialogList, function (item) { return item.page_name })
                    // 购物车template
                    var carTpl = function () {
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
                                    <div class="chrome-plug-spm-icon-box chrome-plug-spm-btn-save" data-content="保存分组">
                                        <img class="img18" src="https://img.alicdn.com/tfs/TB1Xj5uRVXXXXX5XFXXXXXXXXXX-32-32.png" alt="保存分组"/>
                                    </div>
                                    <div class="chrome-plug-spm-icon-box chrome-plug-spm-icon-box-4" data-content="跳转小站">
                                        <a href="https://mamadata.alibaba-inc.com/#!/report/index?spma=<%= spma%>" target="_blank"><img class="img18" src="https://img.alicdn.com/tfs/TB1HmBbWxD1gK0jSZFsXXbldVXa-128-128.png" alt="跳转小站"/></a>
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
                                        <div class="chrome-plug-spm-car-spmd">
                                            <h4 class="chrome-plug-spm-hide">
                                                按钮列表
                                            </h4>
                                        </div>
                                        <div class="chrome-plug-spm-car-spmc">
                                            <h4 class="chrome-plug-spm-hide">
                                                按钮列表
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
                        dialogList: dialogList,
                        spma: spma
                    }))
    
                    // 购物车打开，关闭事件
                    $('body .chrome-plug-spm-icon-shopping').on('click.plugin', function (event) {
                        if ($(this).attr('data-switch') == 'off') {
                            $(this).attr('data-switch', 'on').attr('data-content', '关闭购物车').parents('.chrome-plug-spm-car').css('right', '0px')
                        } else {
                            $(this).attr('data-switch', 'off').attr('data-content', '展开购物车').parents('.chrome-plug-spm-car').css('right', '-260px')
                        }
                    })
    
                    // 图标hover tips事件
                    $('body .chrome-plug-spm-icon-box').hover(function (event) {
                        var content = $(this).attr('data-content')
                        var offset = $(this).offset()
                        var top = offset.top + 4
                        var left = offset.left - 88
                        var template = '<div class="chrome-plug-spm-icon-tips" style="width:80px;height:30px;color:#fff;background-color: #070a22;border-radius:4px;text-align:center;padding:6px 0px;position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:99;">' + content + '</div>'
                        $('body').append(template)
                    }, function (event) {
                        $('body .chrome-plug-spm-icon-tips').remove()
                    })
    
                    var spmTpl = function () {
                        /*
                            <div class="mt10 mb10 chrome-plug-spmbd-box" chrome-plug-spm-last="<%= name%>:<%= last%>:<%= type%>">
                                <span class="chrome-plug-spm-add-name"><%= name%>:<%= typeName%></span>
                                <span class="chrome-plug-spm-pointer chrome-plug-spm-btn-delete chrome-plug-spm-hide ml10">
                                    <img style="width: 16px;position:relative;top:1px;" src="https://img.alicdn.com/tfs/TB1QQ5hRVXXXXbRaXXXXXXXXXXX-20-20.png" alt="删除"/>
                                </span>
                            </div>
                        */
                    }.toString().replace(/[\r\n]/g, '').replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '').replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '')
    
                    var spmTplFn = _.template(spmTpl)
    
                    // 添加spmd 点击数据事件
                    $('body').on('click.plugin', '.chrome-plug-spm-btn-addSpmd-click', function (event) {
                        var src = 'https://img.alicdn.com/tfs/TB1O7atRVXXXXapXVXXXXXXXXXX-20-20.png'
                        var spmb = $(this).attr('chrome-plug-spmb')
                        var spmd = $(this).attr('chrome-plug-spmd')
                        var name = $(this).attr('chrome-plug-spmd-name')
                        $('body .chrome-plug-spm-car-spmd').append(spmTplFn({
                            name: name,
                            key: spmd,
                            last: spmd + '-' + spmb,
                            type: 'clk',
                            typeName: '点击'
                        }))
                        $(this).removeClass('chrome-plug-spm-btn-addSpmd-click').html(`<img src="${src}"/>`)
                        that.changeCounts()
                    })

                    // 添加spmd hover数据事件
                    $('body').on('click.plugin', '.chrome-plug-spm-btn-addSpmd-hover', function (event) {
                        var src = 'https://img.alicdn.com/tfs/TB1O7atRVXXXXapXVXXXXXXXXXX-20-20.png'
                        var spmb = $(this).attr('chrome-plug-spmb')
                        var spmd = $(this).attr('chrome-plug-spmd')
                        var name = $(this).attr('chrome-plug-spmd-name')
                        $('body .chrome-plug-spm-car-spmd').append(spmTplFn({
                            name: name,
                            key: spmd,
                            last: spmd + '-' + spmb,
                            type: 'hover',
                            typeName: 'hover'
                        }))
                        $(this).removeClass('chrome-plug-spm-btn-addSpmd-click').html(`<img src="${src}"/>`)
                        that.changeCounts()
                    })
    
                    // 添加spmc 曝光数据事件
                    $('body').on('click.plugin', '.chrome-plug-spm-btn-addSpmc-exp', function (event) {
                        var src = 'https://img.alicdn.com/tfs/TB1O7atRVXXXXapXVXXXXXXXXXX-20-20.png'
                        var spmb = $(this).attr('chrome-plug-spmb')
                        var spmc = $(this).attr('chrome-plug-spmc')
                        var name = $(this).attr('chrome-plug-spmc-name')
                        $('body .chrome-plug-spm-car-spmc').append(spmTplFn({
                            name: name,
                            key: spmc,
                            last: spmc + '-' + spmb,
                            type: 'exp',
                            typeName: '曝光'
                        }))
                        $(this).removeClass('chrome-plug-spm-btn-addSpmc-exp').html(`<img src="${src}"/>`)
                        that.changeCounts()
                    })

                    // 添加spmc hover数据事件
                    $('body').on('click.plugin', '.chrome-plug-spm-btn-addSpmc-hover', function (event) {
                        var src = 'https://img.alicdn.com/tfs/TB1O7atRVXXXXapXVXXXXXXXXXX-20-20.png'
                        var spmb = $(this).attr('chrome-plug-spmb')
                        var spmc = $(this).attr('chrome-plug-spmc')
                        var name = $(this).attr('chrome-plug-spmc-name')
                        $('body .chrome-plug-spm-car-spmc').append(spmTplFn({
                            name: name,
                            key: spmc,
                            last: spmc + '-' + spmb,
                            type: 'hover',
                            typeName: 'hover'
                        }))
                        $(this).removeClass('chrome-plug-spm-btn-addSpmc-hover').html(`<img src="${src}"/>`)
                        that.changeCounts()
                    })
    
                    // 添加dialog
                    $('body .chrome-plug-spm-input-dialog').on('click.plugin', function (event) {
                        that.changeCounts()
                    })
                    // 删除spmb、spmd事件
                    $('body').on('click.plugin', '.chrome-plug-spm-btn-delete', function (event) {
                        $(this).parent('.chrome-plug-spmbd-box').remove()
                        that.changeCounts()
                    })
    
                    // tab切换事件
                    $('body .chrome-plug-spm-car-content-title').on('click.plugin', function (event) {
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
                    $('body').on('mouseenter mouseleave', '.chrome-plug-spmbd-box', function (event) {
                        if (event.type == 'mouseenter') {
                            $(this).children('.chrome-plug-spm-btn-delete').removeClass('chrome-plug-spm-hide')
                        } else {
                            $(this).children('.chrome-plug-spm-btn-delete').addClass('chrome-plug-spm-hide')
                        }
                    })
                    // 保存提交
                    $('body').on('click.plugin', '.chrome-plug-spm-btn-save', function (event) {
                        var name = $('body .chrome-plug-config-name').val()
                        var spmclist = []
                        var spmdlist = []
                        var dialoglist = []
                        _.each($('body .chrome-plug-spm-car-spmd .chrome-plug-spmbd-box'), function (item) {
                            spmdlist.push($(item).attr('chrome-plug-spm-last'))
                        })
                        _.each($('body .chrome-plug-spm-car-spmc .chrome-plug-spmbd-box'), function (item) {
                            spmclist.push($(item).attr('chrome-plug-spm-last'))
                        })
                        _.each($('body .chrome-plug-spm-input-dialog'), function (item) {
                            if ($(item).prop('checked')) {
                                dialoglist.push($(item).attr('chrome-plug-spm-last'))
                            }
                        })
                        chrome.runtime.sendMessage(
                            {
                                contentScriptQuery: "addConfig", 
                                spma: spma,
                                name: name,
                                spmdlist: spmdlist.join(','),
                                spmclist: spmclist.join(','),
                                dialoglist: dialoglist.join(',')
                            },
                            resp => {
                                if (!resp.info.ok) {
                                    $('body .chrome-plug-save-error').text(resp.info.message)
                                    return false
                                }
                                $('body .chrome-plug-save-error').empty()
                                $('body .chrome-plug-spm-icon-shopping').attr('data-switch', 'off').attr('data-content', '展开购物车').parents('.chrome-plug-spm-car').css('right', '-260px')
                            })
                    })
    
                    // 一键清空事件
                    $('body .chrome-plug-clear').on('click.plugin', function (event) {
                        $('body .chrome-plug-spmbd-box').remove()
                        $('body .chrome-plug-spm-input-dialog').prop('checked', false)
                        that.changeCounts()
                    })
    
                    // 展开高级事件
                    $('body').on('click.plugin', '.chrome-plug-spm-advance-btn', function (event) {
                        var status = $(this).attr('data-status')
                        if (status == '1') {
                            $(this).attr('data-status', 2).text('收起高级设置 >>').next().show().end()
                                .parents('.chrome-plug-spm-advance').children('.chrome-plug-spm-table').show()
                        } else {
                            $(this).attr('data-status', 1).text('展开高级设置 >>').next().hide().end()
                                .parents('.chrome-plug-spm-advance').children('.chrome-plug-spm-table').hide()
                        }
                    })
                    //修改spmd名字事件
                    $('body').on('click.plugin', '.chrome-plug-spm-update-name', function (event) {
                        $(this).parents('.chrome-plug-spm-update').hide().next('input').show()
                    })
                    //发送修改spmd名字请求
                    $('body').on('change', '.chrome-plug-spm-input-common', function (event) {
                        var newName = $(this).val()
                        var spmd = $(this).attr('chrome-plug-spmd')
                        var me = this
                        chrome.runtime.sendMessage(
                            {
                                contentScriptQuery: "addSpmdName", 
                                spma: spma,
                                spmd: spmd,
                                name: newName
                            },
                            resp => {
                                if (resp.info.ok) {
                                    $(me).hide().siblings('.chrome-plug-spm-update').show().find('.chrome-plug-spm-span-common').text(newName)
                                }
                            })
                    })
                    // 埋点hover事件
                    var timer
                    $('body').on('mouseenter mouseleave', '[data-spm-click]', function (event) {
                        event.stopPropagation()
                        var that = this
                        if (event.type == 'mouseenter') {
                            timer = setTimeout(function () {
                                var attr = $(that).attr('data-spm-click')
                                var reg = /locaid=([^;]+);?/
                                // var spma = $('meta[name="spm-id"]').attr('content')
                                var spmd = attr.match(reg)[1]
                                var winWidth = $(window).width()
                                var offset = $(event.currentTarget).offset()
                                var currentHeight = $(event.currentTarget).height()
                                var spmb = $('body').attr('data-spm')
                                var spmcNode = $(that).parents('[data-spm]')[0]
                                var spmc = $(spmcNode).attr('data-spm')
                                var top = offset.top + currentHeight - 5
                                var left = offset.left
                                if (left + 800 > winWidth) {
                                    left = winWidth - 800
                                }
                                // 埋点数据template
                                var tpl = function () {
                                    /*
                                        <div class="spm-box" style="width:800px;background-color:#fff;color:#333;border:1px solid #eaeaea;position:absolute;top:<%= top%>px;left: <%= left%>px;z-index:99999999999;">
                                                <table class="chrome-plug-spm-table">
                                                    <thead>
                                                        <tr>
                                                            <th>埋点名称</th>
                                                            <th>埋点ID</th>
                                                            <th>类型</th>
                                                            <th class="align-right">PV</th>
                                                            <th class="align-right">UV</th>
                                                            <th>页面/全站uv占比</th>
                                                            <th>曝光/hover时长</th>
                                                            <th>决策时长</th>   
                                                            <th class="align-right">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td rowspan=2>
                                                                <span class="chrome-plug-spm-update ml10">
                                                                    <span class="chrome-plug-spm-span-common"><%= spmdObj.name%></span>
                                                                    <a href="javascript:;" class="chrome-plug-spm-update-name"><img style="width:16px;" src="https://img.alicdn.com/tfs/TB1yHcsdFGWBuNjy0FbXXb4sXXa-64-64.png"/></a>
                                                                </span>
                                                                <input class="chrome-plug-spm-input-common chrome-plug-spm-hide" chrome-plug-spmd="<%= spmd%>" type="text" value="<%= spmdObj.name%>"/>
                                                            </td>
                                                             <td rowspan=2>
                                                                <span><%= spmd%></span>
                                                            </td>
                                                            <td>
                                                                <span>点击-点击</span>
                                                            </td>
                                                            <td class="align-right">
                                                                <span><%= spmdObj.pv%></span>
                                                            </td>
                                                            <td class="align-right">
                                                                <span><%= spmdObj.uv%></span>
                                                            </td>
                                                            <td>
                                                                <span><%= ((spmdObj.uv/spmbObj.uv)*100).toFixed(2)%>%</span>
                                                                /
                                                                <span><%= ((spmdObj.uv/spmObj.muv)*100).toFixed(2)%>%</span>
                                                            </td>
                                                            <td>
                                                                -
                                                            </td>
                                                            <td>
                                                                <span><%= (spmdObj.dectime/1000).toFixed(0)%></span>
                                                            </td>
                                                            <td class="align-right">
                                                                <a href="javascript:;" class="chrome-plug-spm-btn-addSpmd-click chrome-plug-spm-pointer chrome-plug-spm-handle" chrome-plug-spmd-name="<%= spmdObj.name%>" chrome-plug-spmd="<%= spmd%>" chrome-plug-spmb="<%= spmb%>">添加</a>
                                                                <a href="https://mamadata.alibaba-inc.com/#!/spm/d-single?spma=<%= spma%>&spmd=<%= spmd%>" class="chrome-plug-spm-handle" target="_blank">查看详情</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span>点击-Hover</span>
                                                            </td>
                                                            <td class="align-right">
                                                                <span><%= spmdHover.pv%></span>
                                                            </td>
                                                            <td class="align-right">
                                                                <span><%= spmdHover.uv%></span>
                                                            </td>
                                                            <td>
                                                                <span><%= ((spmdHover.uv/spmbObj.uv)*100).toFixed(2)%>%</span>
                                                                /
                                                                <span><%= ((spmdHover.uv/spmObj.muv)*100).toFixed(2)%>%</span>
                                                            </td>
                                                            <td>
                                                                <span><%= (spmdHover.duration/1000).toFixed(2)%></span>
                                                            </td>
                                                            <td>
                                                                -
                                                            </td>
                                                            <td class="align-right">
                                                                <a href="javascript:;" class="chrome-plug-spm-btn-addSpmd-hover chrome-plug-spm-pointer chrome-plug-spm-handle" chrome-plug-spmd-name="<%= spmdObj.name%>" chrome-plug-spmd="<%= spmd%>" chrome-plug-spmb="<%= spmb%>">添加</a>
                                                                <a href="https://mamadata.alibaba-inc.com/#!/spm/d-hover?spma=<%= spma%>&spmb=<%= spmb%>&hoverkey=<%= spmd%>" class="chrome-plug-spm-handle" target="_blank">查看详情</a>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td rowspan=2>
                                                                <span class="chrome-plug-spm-update ml10">
                                                                    <span class="chrome-plug-spm-span-common"><%= spmcObj.name%></span>
                                                                    <a href="javascript:;" class="chrome-plug-spm-update-name"><img style="width:16px;" src="https://img.alicdn.com/tfs/TB1yHcsdFGWBuNjy0FbXXb4sXXa-64-64.png"/></a>
                                                                </span>
                                                                <input class="chrome-plug-spm-input-common chrome-plug-spm-hide" chrome-plug-spmc="<%= spmc%>" type="text" value="<%= spmcObj.name%>"/>
                                                            </td>
                                                             <td rowspan=2>
                                                                <span><%= spmc%></span>
                                                            </td>
                                                            <td>
                                                                <span>模块-曝光</span>
                                                            </td>
                                                            <td class="align-right">
                                                                <span><%= spmcObj.pv%></span>
                                                            </td>
                                                            <td class="align-right">
                                                                <span><%= spmcObj.uv%></span>
                                                            </td>
                                                            <td>
                                                                <span><%= ((spmcObj.uv/spmbObj.uv)*100).toFixed(2)%>%</span>
                                                                /
                                                                <span><%= ((spmcObj.uv/spmObj.muv)*100).toFixed(2)%>%</span>
                                                            </td>
                                                            <td>
                                                                <span><%= (spmcObj.duration/1000).toFixed(0)%></span>
                                                            </td>
                                                            <td>
                                                                -
                                                            </td>
                                                            <td class="align-right">
                                                                <a href="javascript:;" class="chrome-plug-spm-btn-addSpmc-exp chrome-plug-spm-pointer chrome-plug-spm-handle" chrome-plug-spmc-name="<%= spmcObj.name%>" chrome-plug-spmc="<%= spmc%>" chrome-plug-spmb="<%= spmb%>">添加</a>
                                                                <a href="https://mamadata.alibaba-inc.com/#!/spm/d-exp?spma=<%= spma%>&spmc=<%= spmc%>" class="chrome-plug-spm-handle" target="_blank">查看详情</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <span>曝光-Hover</span>
                                                            </td>
                                                            <td class="align-right">
                                                                <span><%= spmcHover.pv%></span>
                                                            </td>
                                                            <td class="align-right">
                                                                <span><%= spmcHover.uv%></span>
                                                            </td>
                                                            <td>
                                                                <span><%= ((spmcHover.uv/spmbObj.uv)*100).toFixed(2)%>%</span>
                                                                /
                                                                <span><%= ((spmcHover.uv/spmObj.muv)*100).toFixed(2)%>%</span>
                                                            </td>
                                                            <td>
                                                                <span><%= (spmcHover.duration/1000).toFixed(2)%></span>
                                                            </td>
                                                            <td>
                                                                <span><%= (spmcHover.dectime/1000).toFixed(2)%></span>
                                                            </td>
                                                            <td class="align-right">
                                                                <a href="javascript:;" class="chrome-plug-spm-btn-addSpmc-hover chrome-plug-spm-pointer chrome-plug-spm-handle" chrome-plug-spmc-name="<%= spmcObj.name%>" chrome-plug-spmc="<%= spmc%>" chrome-plug-spmb="<%= spmb%>">添加</a>
                                                                <a href="https://mamadata.alibaba-inc.com/#!/spm/d-hover?spma=<%= spma%>&spmb=<%= spmb%>&hoverkey=<%= spmc%>" class="chrome-plug-spm-handle" target="_blank">查看详情</a>
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
                                                                    <input class="chrome-plug-spm-input-advance" type="text" value="当前页打开率"/>
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
                                                                    <input class="chrome-plug-spm-input-advance" type="text" value="全站点打开率"/>
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
                                chrome.runtime.sendMessage(
                                    {contentScriptQuery: "querySpmd", spma, spmb, spmc, spmd},
                                    resp => {
                                        var data = resp.data
                                        data.spmd.name = data.spmd.name || spmd
                                        data.spmd.spmdId = spmd
                                        data.spmd.pv = data.spmd.pv || 0
                                        data.spmd.uv = data.spmd.uv || 0
                                        var htmlContent = tplFn({
                                            top,
                                            left,
                                            spma,
                                            spmb,
                                            spmc,
                                            spmd,
                                            spmbObj: data.spmb,
                                            spmdObj: data.spmd,
                                            spmcObj: data.spmc,
                                            spmcHover: data.spmcHover,
                                            spmdHover: data.spmdHover,
                                            spmObj
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
    
                    $('body').on('mouseleave', '.spm-box', function () {
                        // window.clipSpmb.destroy()
                        // window.clipSpmd.destroy()
                        // window.clipSpmCopy.destroy()
                        // delete window.clipSpmb
                        // delete window.clipSpmd
                        // delete window.clipSpmCopy
                        $(this).remove()
                    })
                });
            sendResponse('on')
        }
    } else {
        sendResponse('error')
    }
})