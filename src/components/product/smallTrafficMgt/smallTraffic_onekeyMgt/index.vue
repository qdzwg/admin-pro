<template>
  <div class="page-wrapper">
  </div>
</template>

<script>
import { onKeyLogin } from '../apis/xjt_line.js'
export default {
  components: {  },
  props: {},
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {},
  methods: {
  },
  created () {
    onKeyLogin().then(res=>{
      if(res.status==200&& res.data.status == 200){
        window.location.href=res.data.data.forwardUrl;
      } else {
        this.$Message.warning(res.data.message);
      }
    });
  },
  mounted () {
  }

}
</script>

