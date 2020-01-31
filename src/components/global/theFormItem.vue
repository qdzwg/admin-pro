<script>
// import {}
export default {
  name: "theFormItem",
  props: {
    option: Object,
    default: function () {
      return {
        filedTitile: "所属城市",
        necessary: "true",
        tableFieldName: "CITY_ID",
        defaultValue: "123",
        show: true,
        fieldType: "input",
        tableName: "park_info"
      }
    }
  },
  data () {
    return {
      option: {
        filedTitile: "所属城市",
        necessary: "true",
        tableFieldName: "CITY_ID",
        defaultValue: "123",
        show: true,
        fieldType: "input",
        tableName: "park_info"
      }
    }
  },
  components: {

  },
  methods: {

  },
  render (h, context) {
    console.log(this)
    let option = this.option
    let eleMent = ''
    if (option.fieldType == 'text') {
      eleMent = <span>${option.defaultValue}</span>
    } else if (option.fieldType == 'input') {
      eleMent = <Input v-model="option.value" placeholder="Enter something..." style="width: 300px"></Input>
    }
    return (
      <div>
        {eleMent}
      </div>
    )
  }
}
</script>