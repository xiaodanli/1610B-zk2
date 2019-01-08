define(function(){
    var $ = {
        ajax: function(options) {
            var defaulte = {
                type: 'get',
                async: true,
                data: ''
            };
    
            var data = Object.assign({}, defaulte, options);
            //第一步：先创建ajax
            var xhr = new XMLHttpRequest();
    
    
            //第二步：连接服务器   
    
            /*
                open(type|method,url,async);
                get     url
    
                post     send()
    
                key=value&key=value
            */
           xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status <= 300 || xhr.status === 304) {
                    data.success(xhr.responseText);
                } else {
                    data.error(new Error('Can not find url:' + data.url));
                }
            };
    
            var dataString = typeof data.data === 'object' ? this.format(data.data) : data.data;
            var url = data.type === 'get' && data.data != '' ? data.url + '?' + dataString : data.url;
            xhr.open(data.type, url, data.async);
    
            //第三步：发送数据
            xhr.send(data.type === 'get' ? null : dataString);
        },
        format: function(data) {
            var str = '';
            for (var i in data) {
                str += i + '=' + data[i] + '&';
            }
    
            return str.slice(0, -1)
        }
    }

    return $
})
