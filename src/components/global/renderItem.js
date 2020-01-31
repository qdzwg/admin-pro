export default {
  name: 'renderItem',
  functional: true,
  props: {
    render: {
      type: Function
    },
    column: {
      type: Object
    }
  },
  render: (h, ctx) => {
    const params = {
      row: ctx.props.column
    }
    return ctx.props.render(h, params)
  }
}
