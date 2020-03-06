let a = 'aaa';
// import $ from 'jquery';
class Foo { 
  constructor() { 
    console.log('Foo constructor');
  }
}
let $ = require('expose-loader?$!jquery');
require('./index.css');
require('./modules/module-index');