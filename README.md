Mean
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Exponential](https://en.wikipedia.org/wiki/Exponential_distribution) distribution [expected value](https://en.wikipedia.org/wiki/Expected_value).

The [expected value](https://en.wikipedia.org/wiki/Expected_value) for an [exponential](https://en.wikipedia.org/wiki/Exponential_distribution) random variable is

<div class="equation" align="center" data-raw-text="\mathbb{E}\left[ X \right] = \frac{1}{\lambda}" data-equation="eq:expectation">
	<img src="https://cdn.rawgit.com/distributions-io/exponential-mean/517d605ff693b5b069788c78e6a9340d00692dbe/docs/img/eqn.svg" alt="Expected value for an exponential distribution.">
	<br>
</div>

where `lambda > 0` is the rate parameter.


## Installation

``` bash
$ npm install distributions-exponential-mean
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var mean = require( 'distributions-exponential-mean' );
```

#### mean( lambda[, opts] )

Computes the [expected value](https://en.wikipedia.org/wiki/Expected_value) for an [exponential](https://en.wikipedia.org/wiki/Exponential_distribution) distribution with parameter `lambda`. `lambda` may be either a [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number), an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), or a [`matrix`](https://github.com/dstructs/matrix). All `lambda` values must be positive numbers. For non-positive inputs, `NaN` is returned.

``` javascript
var matrix = require( 'dstructs-matrix' ),
	lambda,
	mat,
	out,
	i;

out = mean( 1 );
// returns 1

lambda = [ 1, 5, 10, 20 ];
out = mean( lambda );
// returns [ 1, 0.2, 0.1, 0.05 ]

lambda = new Float32ArrayArray( lambda );
out = mean( lambda );
// returns Float64Array( [1,0.2,0.1,0.05] )

lambda =  matrix( [ 1, 5, 10, 20 ], [2,2] );
/*
	[ 1, 5,
	  10, 20 ]
*/

out = mean( lambda );
/*
	[ 1, 0.2,
	  0.1, 0.05 ]
*/
```

The function accepts the following `options`:

* 	__accessor__: accessor `function` for accessing `array` values.
* 	__dtype__: output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix) data type. Default: `float64`.
*	__copy__: `boolean` indicating if the `function` should return a new data structure. Default: `true`.
*	__path__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path.
*	__sep__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path separator. Default: `'.'`.

For non-numeric `arrays`, provide an accessor `function` for accessing `array` values.

``` javascript
var lambda = [
	[0,1],
	[1,5],
	[2,10],
	[3,20]
];

function getValue( d, i ) {
	return d[ 1 ];
}

var out = mean( lambda, {
	'accessor': getValue
});
// returns [ 1, 0.2, 0.1, 0.05 ]
```

To [deepset](https://github.com/kgryte/utils-deep-set) an object `array`, provide a key path and, optionally, a key path separator.

``` javascript
var lambda = [
	{'x':[9,1]},
	{'x':[9,5]},
	{'x':[9,10]},
	{'x':[9,20]}
];

var out = mean( lambda, 'x|1', '|' );
/*
	[
		{'x':[9,1]},
		{'x':[9,0.2]},
		{'x':[9,0.1]},
		{'x':[9,0.05]},
	]
*/

var bool = ( data === out );
// returns true
```

By default, when provided a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix), the output data structure is `float64` in order to preserve precision. To specify a different data type, set the `dtype` option (see [`matrix`](https://github.com/dstructs/matrix) for a list of acceptable data types).

``` javascript
var lambda, out;

lambda = new Float64Array( [ 1,5,10,20 ] );

out = mean( lambda, {
	'dtype': 'int32'
});
// returns Int32Array( [ 1,0,0,0 ] )

// Works for plain arrays, as well...
out = mean( [1,5,10,20], {
	'dtype': 'int32'
});
// returns Int32Array( [ 1,0,0,0 ] )
```

By default, the function returns a new data structure. To mutate the input data structure (e.g., when input values can be discarded or when optimizing memory usage), set the `copy` option to `false`.

``` javascript
var lambda,
	bool,
	mat,
	out,
	i;

lambda = [ 1, 5, 10, 20 ];

out = mean( lambda, {
	'copy': false
});
// returns [ 1, 0.2, 0.1, 0.05 ]

bool = ( data === out );
// returns true

mat = matrix( [ 1, 5, 10, 20 ], [2,2] );
/*
	[ 1, 5,
	  10, 20 ]
*/

out = mean( mat, {
	'copy': false
});
/*
	[ 1, 0.2,
	  0.1, 0.05 ]
*/

bool = ( mat === out );
// returns true
```


## Notes

*	If the `lambda` parameter is __not__ a positive number, the [expected value](https://en.wikipedia.org/wiki/Expected_value) is `NaN`.

	``` javascript
	var lambda, out;

	out = mean( -1 );
	// returns NaN

	out = mean( 0 );
	// returns NaN

	out = mean( null );
	// returns NaN

	out = mean( true );
	// returns NaN

	out = mean( {'a':'b'} );
	// returns NaN

	out = mean( [ true, null, [] ] );
	// returns [ NaN, NaN, NaN ]

	function getValue( d, i ) {
		return d.x;
	}
	lambda = [
		{'x':true},
		{'x':[]},
		{'x':{}},
		{'x':null}
	];

	out = mean( lambda, {
		'accessor': getValue
	});
	// returns [ NaN, NaN, NaN, NaN ]

	out = mean( lambda, {
		'path': 'x'
	});
	/*
		[
			{'x':NaN},
			{'x':NaN},
			{'x':NaN,
			{'x':NaN}
		]
	*/
	```

*	Be careful when providing a data structure which contains non-numeric elements and specifying an `integer` output data type, as `NaN` values are cast to `0`.

	``` javascript
	var out = mean( [ true, null, [] ], {
		'dtype': 'int8'
	});
	// returns Int8Array( [0,0,0] );
	```


## Examples

``` javascript
var matrix = require( 'dstructs-matrix' ),
	mean = require( 'distributions-exponential-mean' );

var lambda,
	mat,
	out,
	tmp,
	i;

// Plain arrays...
lambda = new Array( 10 );
for ( i = 0; i < lambda.length; i++ ) {
	lambda[ i ] = i + 1;
}
out = mean( lambda );

// Object arrays (accessors)...
function getValue( d ) {
	return d.x;
}
for ( i = 0; i < lambda.length; i++ ) {
	lambda[ i ] = {
		'x': lambda[ i ]
	};
}
out = mean( lambda, {
	'accessor': getValue
});

// Deep set arrays...
for ( i = 0; i < lambda.length; i++ ) {
	lambda[ i ] = {
		'x': [ i, lambda[ i ].x ]
	};
}
out = mean( lambda, {
	'path': 'x/1',
	'sep': '/'
});

// Typed arrays...
lambda = new Int32Array( 10 );
for ( i = 0; i < lambda.length; i++ ) {
	lambda[ i ] = i + 1
}
out = mean( lambda );

// Matrices...
mat = matrix( lambda, [5,2], 'int32' );
out = mean( mat );

// Matrices (custom output data type)...
out = mean( mat, {
	'dtype': 'uint8'
});
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```



## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/distributions-exponential-mean.svg
[npm-url]: https://npmjs.org/package/distributions-exponential-mean

[travis-image]: http://img.shields.io/travis/distributions-io/exponential-mean/master.svg
[travis-url]: https://travis-ci.org/distributions-io/exponential-mean

[codecov-image]: https://img.shields.io/codecov/c/github/distributions-io/exponential-mean/master.svg
[codecov-url]: https://codecov.io/github/distributions-io/exponential-mean?branch=master

[dependencies-image]: http://img.shields.io/david/distributions-io/exponential-mean.svg
[dependencies-url]: https://david-dm.org/distributions-io/exponential-mean

[dev-dependencies-image]: http://img.shields.io/david/dev/distributions-io/exponential-mean.svg
[dev-dependencies-url]: https://david-dm.org/dev/distributions-io/exponential-mean

[github-issues-image]: http://img.shields.io/github/issues/distributions-io/exponential-mean.svg
[github-issues-url]: https://github.com/distributions-io/exponential-mean/issues
