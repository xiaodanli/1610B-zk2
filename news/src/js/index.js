require(['./js/config.js'],function(){
    require(['ajax','bscroll'],function(ajax,bscroll){
        function init(){
            loadData();
            addEvent();
            initScroll();
        }

        var page = 1,

            limit = 5,

            total = 0,

            searchKey = '';

        var scroll = null;

        var _list = document.querySelector('.list'),
            _innerList = document.querySelector('.inner-list');

        function loadData(){
            ajax.ajax({
                url:'/api/getList',
                data:{
                    page:page,
                    limit:limit,
                    searchKey:searchKey
                },
                success:function(res){
                    console.log(res);
                    var data = JSON.parse(res);

                    if(data.code === 1){
                        total = data.total;
                        renderList(data.data);
                    }
                }
            })
        }

        //渲染列表

        function renderList(list){
            var str = '';

            list.forEach(function(item){
                str += `
                <li>
                    <h2>${item.title}</h2>
                    <p>${item.con}</p>
                    <button class="del-btn" data-id="${item._id}">删除</button>
                </li>`;
            })

            _list.innerHTML += str;

            scroll.refresh();
        }



        //添加点击事件

        function addEvent(){
            /*
                1.获取输入框的值

                page = 1;

                2.ajax

                list.innerHTML = '';
            */

            //点击搜索

            var _searchBtn = document.querySelector('.search-btn'),
                _ipt = document.querySelector('.ipt');

            _searchBtn.addEventListener('click',function(){
                searchKey = _ipt.value;
                page = 1;
                _list.innerHTML = '';
                _innerList.setAttribute('up','上拉加载');
                loadData();
            })

            //点击删除
            _list.addEventListener('click',function(e){
                
                if(e.target.tagName === 'BUTTON'){
                    var id = e.target.getAttribute('data-id');

                    ajax.ajax({
                        url:'/api/del',
                        data:{
                            id:id
                        },
                        success:function(res){
                            var data = JSON.parse(res);
                            if(data.code === 1){
                                alert(data.msg);
                                _list.removeChild(e.target.parentNode);
                            }   
                        }
                    })
                }
            })
        }

        
        //初始化滚动
        function initScroll(){

            
            scroll = new bscroll('.list-wrap',{
                click:true,
                probeType:2
            })

            scroll.on('scroll',function(){

                if(this.y < this.maxScrollY - 44){
                    if(page < total){
                        _innerList.setAttribute('up','释放加载更多')
                    }else{
                        _innerList.setAttribute('up','没有更多数据')
                    }
                }else if(this.y < this.maxScrollY - 22){
                    if(page < total){
                        _innerList.setAttribute('up','上拉加载')
                    }else{
                        _innerList.setAttribute('up','没有更多数据')
                    }
                }

            })


            scroll.on('touchEnd',function(){
                if(_innerList.getAttribute('up')==='释放加载更多'){
                    if(page < total){
                        page++;
                        loadData();
                        _innerList.setAttribute('up','上拉加载');
                    }else{
                        _innerList.setAttribute('up','没有更多数据');
                    }
                }
            })
            
        }

        init()
    })
})


/*
    接口说明：咨询列表

    接口地址：/api/getList

    请求方式：get

    参数：

                        参数说明            是否必须      数据类型
        
        page              第几页              否           number

        limit             每页显示的条数       否           number  
 
        searchKey         搜索的关键词         否           string

    返回数据：

        code ：  0  失败   msg ： 错误提示信息

        code ：1   成功   

        data：[
            {
                title:  标题
                
                con   ：内容

                _id   : 索引 id
            }
        ]
*/