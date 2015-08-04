/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	mean = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'number mean', function tests() {

	it( 'should export a function', function test() {
		expect( mean ).to.be.a( 'function' );
	});

	it( 'should compute the distribution mean', function test() {
		assert.strictEqual( mean( 1 ), 1 );
		assert.strictEqual( mean( 5  ), 0.2 );
		assert.strictEqual( mean( 10  ), 0.1 );
		assert.strictEqual( mean( 20  ), 0.05 );
	});

});
