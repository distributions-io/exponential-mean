/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	mean = require( './../lib' ),

	// Function to apply element-wise
	MEAN = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-mean', function tests() {

	it( 'should export a function', function test() {
		expect( mean ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				mean( [1,2,3], {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				mean( [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				mean( new Int8Array([1,2,3]), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				mean( matrix( [2,2] ), {
					'dtype': value
				});
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			// NaN, // allowed
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( mean( values[ i ] ) ) );
		}
	});

	it( 'should compute the distribution mean when provided a number', function test() {
		assert.strictEqual( mean( 1 ), 1 );
		assert.strictEqual( mean( 5  ), 0.2 );
		assert.strictEqual( mean( 10  ), 0.1 );
		assert.strictEqual( mean( 20  ), 0.05 );
	});

	it( 'should compute the distribution mean when provided a plain array', function test() {
		var lambda, actual, expected;

		lambda = [ 1, 5, 10, 20 ];
		expected = [ 1, 0.2, 0.1, 0.05 ];

		actual = mean( lambda );
		assert.notEqual( actual, lambda );
		assert.deepEqual( actual, expected );

		// Mutate...
		actual = mean( lambda, {
			'copy': false
		});
		assert.strictEqual( actual, lambda );
		assert.deepEqual( lambda, expected );
	});

	it( 'should compute the distribution mean when provided a typed array', function test() {
		var lambda, actual, expected;

		lambda = new Float64Array ( [ 1,5,10,20 ] );
		expected = new Float64Array( [ 1,0.2,0.1,0.05 ] );

		actual = mean( lambda );
		assert.notEqual( actual, lambda );
		assert.deepEqual( actual, expected );

		// Mutate:
		actual = mean( lambda, {
			'copy': false
		});
		expected = new Float64Array( [ 1,0.2,0.1,0.05 ] );
		assert.strictEqual( actual, lambda );
		assert.deepEqual( lambda, expected );
	});

	it( 'should compute the distribution mean and return an array of a specific type', function test() {
		var lambda, actual, expected;

		lambda = [ 1, 5, 10, 20 ];
		expected = new Int32Array( [ 1,0.2,0.1,0.05 ] );

		actual = mean( lambda, {
			'dtype': 'int32'
		});
		assert.notEqual( actual, lambda );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 4 );
		assert.deepEqual( actual, expected );
	});

	it( 'should compute the distribution mean using an accessor', function test() {
		var lambda, actual, expected;

		lambda = [
			{'lambda':1},
			{'lambda':5},
			{'lambda':10},
			{'lambda':20}
		];
		expected = [ 1, 0.2, 0.1, 0.05 ];

		actual = mean( lambda, {
			'accessor': getValue
		});
		assert.notEqual( actual, lambda );
		assert.deepEqual( actual, expected );

		// Mutate:
		actual = mean( lambda, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual, lambda );
		assert.deepEqual( lambda, expected );

		function getValue( d ) {
			return d.lambda;
		}
	});

	it( 'should compute an element-wise distribution mean and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':[9,1]},
			{'x':[9,5]},
			{'x':[9,10]},
			{'x':[9,20]}
		];

		expected = [
			{'x':[9,1]},
			{'x':[9,0.2]},
			{'x':[9,0.1]},
			{'x':[9,0.05]}
		];

		actual = mean( data, {
			'path': 'x.1'
		});
		assert.strictEqual( actual, data );
		assert.deepEqual( actual, expected );

		// Specify a path with a custom separator...
		data = [
			{'x':[9,1]},
			{'x':[9,5]},
			{'x':[9,10]},
			{'x':[9,20]}
		];

		actual = mean( data, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual, data );
		assert.deepEqual( actual, expected );
	});

	it( 'should compute an element-wise distribution mean when provided a matrix', function test() {
		var mat,
			out,
			d1,
			d2,
			d3,
			i;

		d1 = new Int16Array( 25 );
		d2 = new Float64Array( 25 );
		d3 = new Int16Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i + 1;
			d2[ i ] = MEAN( i + 1 );
			d3[ i ] = MEAN( i + 1 );
		}
		mat = matrix( d1, [5,5], 'int16' );
		out = mean( mat );

		assert.deepEqual( out.data, d2 );

		// Mutate...
		out = mean( mat, {
			'copy': false
		});
		assert.strictEqual( mat, out );
		assert.deepEqual( mat.data, d3 );
	});

	it( 'should compute an element-wise distribution mean and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Int16Array( 25 );
		d2 = new Float32Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i + 1;
			d2[ i ] = MEAN( i + 1 );
		}
		mat = matrix( d1, [5,5], 'int16' );
		out = mean( mat, {
			'dtype': 'float32'
		});

		assert.strictEqual( out.dtype, 'float32' );
		assert.deepEqual( out.data, d2 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( mean( [] ), [] );
		assert.deepEqual( mean( matrix( [0,0] ) ).data, new Float64Array() );
		assert.deepEqual( mean( new Int8Array() ), new Float64Array() );
	});

});
