let a = 'aaa';
// import $ from 'jquery';
class Foo { 
  constructor() { 
    console.log('Foo constructor');
  }
}
// let $ = require('expose-loader?$!jquery');
require('jquery');
require('style-loader!css-loader!./index.css');
require('./modules/module-index');