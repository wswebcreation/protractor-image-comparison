/*
 James Cryer / Huddle 2014
 URL: https://github.com/Huddle/Resemble.js
 */
'use strict';

const PNG = require('pngjs').PNG;
const fs = require('fs');

function resembleJS(){

    function compare(imageOne, imageTwo, options){
        console.log('imageOne = ',imageOne);
        console.log('imageTwo = ',imageTwo);
        console.log('options = ',options);
    }

    return compare;
}

module.exports = resembleJS();