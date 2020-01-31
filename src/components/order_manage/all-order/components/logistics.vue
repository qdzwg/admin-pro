<template>
  <div>
    <Form :label-width="120"
          ref="formValidate">
      <FormItem label="发货信息：">
        {{data.expressMsg}}
      </FormItem>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: ''
    }
  },
  props: ['result'],
  watch: {
    result () {
      this.data = this.result
    }
  },
  methods: {
    rest (value) {
      this.$refs['formValidate'].resetFields()
    }
  }
}
</script>
