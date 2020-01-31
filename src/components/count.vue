<template>
    <div>
        <h2>{{msg}}</h2>
        <hr/>
        <h3>{{count}}</h3>
        <button @click="add(10)">+</button>
        <button @click="reduce">-</button>
        <button @click="addAction">action+</button>
        <button @click="reduceAction">action-</button>
        <firstcompoent :setauthor="msg" @showbox="toshow"></firstcompoent>
    </div>
</template>
<script>
import store from '@/store'
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'
import firstcompoent from './global/first'
export default {
  data () {
    return {
      msg: 'Hello Vuex'
    }
  },
  store,
  computed: {
    ...mapState(['count']),
    ...mapGetters(['count'])
  },
  methods: {
    ...mapMutations(['add', 'reduce']),
    ...mapActions(['addAction', 'reduceAction']),
    toshow (msg) {
      this.msg = msg
    }
  },
  components: {firstcompoent}
}
</script>
