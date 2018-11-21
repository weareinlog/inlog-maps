'use strict';
const expect = require('chai').expect;
const index = require('../dist/index.js');

describe('function test', () => {
    it('should return something', () => {
        const result = 'alala';
        expect(result).to.equal('alala');
    });
});

