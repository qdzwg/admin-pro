<template>
  <div id="app">
    <router-view></router-view>
    <page-loading v-if='loading'></page-loading>
  </div>
</template>

<script>
import store from "@/store";
import { mapState } from 'vuex'
import pageLoading from "@/components/global/pageLoading";
import './assets/styles/font/iconfont.css'
export default {
  name: 'App',
  computed:{
    ...mapState(['loading'])
  },
  components: {
    pageLoading
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.i-b {
  display: inline-block;
}
.page-btn {
  margin-right: 15px;
}

/*css reset*/
/* html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
font,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
caption {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-weight: inherit;
  font-style: inherit;
  font-family: inherit;
  vertical-align: baseline;
}

body {
  font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
  min-height: 100%;
  height: auto;
  position: relative;
}
html {
  font-size: 20px;
  min-height: 100%;
  height: auto;
}
ol,
ul {
  list-style: none;
}
table {
  border-collapse: collapse;
}
caption,
th,
td {
  font-weight: normal;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
}
blockquote,
q {
  quotes: "" "";
}
a {
  text-decoration: none;
}
input {
  vertical-align: middle;
}
img {
  border: none;
  vertical-align: middle;
}
input[type="text"],
input[type="password"] {
  outline: medium;
}
input[type="submit"],
input[type="reset"],
input[type="button"],
button,
input[type="number"] {
  -webkit-appearance: none;
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
  font-size: 0;
  line-height: 0;
}
.clearfix {
  display: inline-block;
}
.clearfix {
  display: block;
}
html,
body {
  -webkit-text-size-adjust: none;
}
.body-ce {
  background-color: #cecece;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="text"]::-webkit-inner-spin-button,
input[type="password"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  border-radius: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

.fr {
  float: right;
}
.fl {
  float: left;
}
.tr {
  text-align: right;
}
.ofh {
  overflow: hidden;
}
.ml10 {
  margin-left: 1rem;
}
.mt10 {
  margin-top: 1rem;
}
.w100 {
  width: 100%;
}

.color1 {
  color: #999;
}
.none {
  display: none;
} */

.fr {
  float: right;
}
.fl {
  float: left;
}
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
  font-size: 0;
  line-height: 0;
}
.clearfix {
  display: inline-block;
}
.clearfix {
  display: block;
}
</style>
