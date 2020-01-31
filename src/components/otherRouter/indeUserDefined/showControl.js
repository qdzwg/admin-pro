let showControl = (obj, keyName) => {
  //   console.log(obj.componentsShow)
  //   console.log(key)
//   console.log(Object.keys(obj.componentsShow))
  Object.keys(obj.componentsShow).forEach(key => {
    obj.componentsShow[key] = keyName === key
  })
//   console.log(obj.componentsShow)
}
export default showControl
