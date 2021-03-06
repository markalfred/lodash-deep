# lodash-deep
Lodash mixins for (deep) object accessing / manipulation.

## Installation
### Bower
1. `bower install lodash-deep`
2. Reference `lodash-deep.min.js` after `lodash.min.js`

### Node.js
1. `npm install lodash`
2. `npm install lodash-deep`
3. 
    ``` javascript

    var _ = require("lodash");
    _.mixin(require("lodash-deep"));
    ```

## Docs
The following mixins are included in `lodash-deep`:
- [_.deepSet](#_deepsetobject-propertypath-value)
- [_.deepGet](#_deepgetobject-propertypath)
- [_.deepOwn](#_deepownobject-propertypath)
- [_.deepPluck](#_deeppluckcollection-propertypath)
- [_.deepIn](#_deepinobject-propertypath)
- [_.deepHas](#_deephasobject-propertypath)

### propertyPath
Nearly all methods of this library have the `propertyPath` parameter. This parameter defines the location of the nested value(s). Array indices can also be used as property name.
The propertyPath can be specified as either `string` or `Array`. When it is specified as string the `.` is used as separator between the different levels. Because of this all `.` and `\` characters of property names in a string based propertyPath have to be escaped by a `\`. The helper method `deepEscapePropertyName` is available for this purpose.

``` javascript
	// Simple property path
	// { level1: { level2: { level3: [ 'value' ] }}}
	var pathString = 'level1.level2.level3.0'; // as string
	var pathArray = ['level1', 'level2', 'level3', 0]; // as array

	// Property path with '.' and '\'
	// { 'lev.el1': { 'lev\\el2': { level3: [ 'value' ] }}}
	var path2String = 'lev\\.el1.lev\\\\el2.level3.0'; // as manually escaped string
	var path2StringAlt = _.deepEscapePropertyName('lev.el1') + '.' + _.deepEscapePropertyName('lev\\el2') + '.level3.0'; // as programmatically escaped string
	var path2Array = ['lev.el1', 'lev\\el2', 'level3', 0]; // as array (just the plain names, you never have to escape anything when using the array syntax.
```


### _.deepSet(collection, propertyPath, value)
Sets a value of a property in an object tree. Any missing objects/arrays will be created.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### value
Type: `*`

The value to set.

#### returns
Type: `Object`

``` javascript
var object = {};
_.deepSet(object, 'level1.level2.level3.value', 'value 3');
// -> { level1: { level2: { level3: { value: 'value 3' }}}}
_.deepSet(object, 'level1.level2.level3.value', 'foo');
// -> { level1: { level2: { level3: { value: 'foo' }}}}
```

### _.deepGet(collection, propertyPath)
Retrieves the value of a property in an object tree.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `*|undefined`

The value, or undefined if it doesn't exists.

``` javascript
var object = {
	level1: {
		value: 'value 1',
		level2: Object.create({
			level3: {
				value: 'value 3'
			}
		})
	}
};
_.deepGet(object, 'level1.value');
// -> 'value 1'
_.deepGet(object, 'level1.level2.level3.value');
// -> 'value 3'
_.deepGet(object, 'foo.bar.baz');
// -> undefined
```

### _.deepOwn(collection, propertyPath)
Retrieves the value of a *own* property in an object tree.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `*|undefined`

The value, or undefined if it doesn't exists.

``` javascript
var object = {
	level1: {
		value: 'value 1',
		level2: Object.create({
			level3: {
				value: 'value 3'
			}
		})
	}
};
_.deepOwn(object, 'level1.value');
// -> 'value 1'
_.deepOwn(object, 'level1.level2.level3.value');
// -> undefined
_.deepOwn(object, 'foo.bar.baz');
// -> undefined
```

### _.deepPluck(collection, propertyPath)
Executes a deep pluck on an collection of object trees.

#### collection
Type: `Object|Array`

The collection of object trees.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `Array`

``` javascript
var collection = [
	{ level1: { level2: { level3: { value: 1 }}}},
	{ level1: { level2: { level3: { value: 2 }}}},
	{ level1: { level2: { level3: { value: 3 }}}},
	{ level1: { level2: { level3: { value: 4 }}}},
	{ level1: { level2: {} }},
	{}
];
_.deepPluck(collection, 'level1.level2.level3.value');
// -> [ 1, 2, 3, 4, undefined, undefined ]
```

### _.deepIn(collection, propertyPath)
Executes a deep check for the existence of a property in an object tree.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `boolean`

``` javascript
var object = {
	level1: {
		level2: Object.create({
			level3: {
				value: 'value 3'
			}
		})
	}
};
_.deepIn(object, 'level1');
// -> true
_.deepIn(object, 'level1.level2');
// -> true
_.deepIn(object, 'level1.level2.level3');
// -> true
_.deepIn(object, 'level1.level2.level3.value');
// -> true
```

### _.deepHas(collection, propertyPath)
Executes a deep check for the existence of a *own* property in an object tree.

#### collection
Type: `Object|Array`

The root object/array of the object tree.

#### propertyPath
Type: `string|Array`

The [propertyPath](#propertypath).

#### returns
Type: `boolean`

``` javascript
var object = {
	level1: {
		level2: Object.create({
			level3: {
				value: 'value 3'
			}
		})
	}
};
_.deepHas(object, 'level1');
// -> true
_.deepHas(object, 'level1.level2');
// -> true
_.deepHas(object, 'level1.level2.level3');
// -> false
_.deepHas(object, 'level1.level2.level3.value');
// -> false
```

### Function name change
In version 1.2.0 function names were simplified. Backward compatibility with the old names remains in place.

## Contributors
- [Mark Lagendijk](@marklagendijk)
- [Andrew Luetgers](@andrewluetgers) 
- [Nelson Pecora](@yoshokatana)
