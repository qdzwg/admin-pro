<template>
<div>
    <gridTable :search-items='searchItems' ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="done"></confirm>
</div>
</template>
<script>
import confirm from '@/components/global/confirm'
import gridTable from '@/components/global/list'
import { apiGet, apiPost } from "@/fetch/api";
export default {
    data () {
        return {
            searchItems: [
                {
                label: "商品名称",
                type: "input",
                name: "goodsName"
                },
                {
                label: "业务类型",
                type: "select",
                placeholder:'请选择业务类型',
                name: "modelType",
                data: [
                    {
                    value: '',
                    label: "请选择"
                    },
                    {
                    value: "park",
                    label: "景区"
                    },
                    {
                    value: "hotel",
                    label: "酒店"
                    },
                    {
                    value: "mdse",
                    label: "商品"
                    },
                    {
                    value: "route",
                    label: "跟团游"
                    },
                    {
                    value: "traffic",
                    label: "小交通"
                    }
                ]
                }
            ],
            columns: [
                {
                title: '产品图片',
                key: 'photoUrl',
                sortable: true,
                render: (h,params) => {
                    return h("img", {
                        attrs: {
                            src: params.row.photoUrl
                            ? params.row.photoUrl
                            : "https://testwww.lotsmall.cn/static/h-ui/images/default_pic.png",
                            style: "width:100px;height:60px;padding:5px;float:left"
                        }
                    })
                }
                },
                {
                title: '产品名称',
                key: 'goodsName',
                sortable: true
                },
                {
                title: '业务类型',
                key: 'modelType',
                sortable: true,
                render: (h,params) => {
                    return h('span', this.filter.orderType(params.row.modelType))
                }
                },
                {
                title: '关注时间',
                key: 'createTime',
                sortable: true,
                },
                {
                title: '操作',
                key: 'action',
                align: 'center',
                width: 100,
                render: (h, params) => {
                    const actions = [
                    {
                        title:'删除',
                        action: () => {
                            this.$refs.confirmModel.confirm('/distmarket/distMarketFollowGoods/del1Fl?id='+params.row.id)
                        }
                    }
                    ]
                    return this.common.columnsHandle(h, actions)
                }
                }
            ],
            data: '',
            url: '/distmarket/distMarketFollowGoods/followGoodsGridFl',
            params: {
                sort: "createTime",
                order: "desc",
                limit: 10,
                page: 1,
            }
        }
    },
    mounted () {
        
    },
    components: {
        confirm,
        gridTable,
    },
    methods: {
        
    }
}
</script>