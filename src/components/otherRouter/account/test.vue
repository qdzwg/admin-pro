<template>
    <div v-if='show'>
        {{msg}}
    </div>
</template>
<style>


</style>
<script>
    import store from '@/store'
    export default {
        data(){
            return {
                msg:"好好学习，天天向上1",
                show:false
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                if(!store.state.menu.asyncRouter.some(item => item.name === vm.$route.name)){
                     vm.$router.back()//如果没有就不会跳转
                }
            })
        },
        created(){
            this.show = true
        }
    }
</script>
