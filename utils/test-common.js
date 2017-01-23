process.env.NODE_ENV = 'test';

require('mocha');
const fs = require('fs');
const chai = require('chai');
const sinon = require('sinon');
const bluebird = require('bluebird');

global['chai'] = chai;
global['expect'] = global['chai'].expect;
global['Promise'] = Promise;
