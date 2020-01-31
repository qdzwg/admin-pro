<template>
    <div>
        <img style="margin-top:5px;" :style="{width:width,height:height}" :src="url" alt="">
    </div>
</template>
<script>
    export default {
        data(){
            return {

            }
        },
        props:{
            url:{
                type:String,
                default:""
            },
            height:{
               type:String,
                default:"75px" 
            },
            width:{
               type:String,
                default:"75px" 
            }
        }
    }
</script>