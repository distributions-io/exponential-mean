'use strict';

// MODULES //

var MEAN = require( './number.js' );


// MEAN //

/**
* FUNCTION: mean( out, lambda )
*	Computes the distribution mean for parameters stored in a typed array.
*
* @param {Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} out - output array
* @param {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} lambda - input array
* @returns {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
*/
function mean( out, lambda ) {
	var len = lambda.length,
		i;
	for ( i = 0; i < len; i++ ) {
		out[ i ] = MEAN( lambda[ i ] );
	}
	return out;
} // end FUNCTION mean()


// EXPORTS //

module.exports = mean;
