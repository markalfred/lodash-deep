/**
 * Lodash mixins for (deep) object accessing / manipulation.
 * @author Mark Lagendijk <mark@lagendijk.info>
 * @license MIT
 */
(function(undefined){
	'use strict';

	// Node.js support
	var isNode = (typeof module !== 'undefined' && module.exports);
	var _ = isNode ? require('lodash') : window._;

	var mixins = {
		/**
		 * Executes a deep check for the existence of a property in an object tree.
		 * @param {Object|Array} collection - The root object/array of the tree.
		 * @param {string|Array} propertyPath - The propertyPath.
		 * @returns {boolean}
		 */
		deepIn: function(collection, propertyPath){
			var properties = getProperties(propertyPath);
			for(var i = 0; i < properties.length; i++){
				var property = properties[i];
				if(_.isObject(collection) && property in collection){
					collection = collection[property];
				}
				else{
					return false;
				}
			}

			return true;
		},
		/**
		 * Executes a deep check for the existence of a own property in an object tree.
		 * @param {Object|Array} collection - The root object/array of the tree.
		 * @param {string|Array} propertyPath - The propertyPath.
		 * @returns {boolean}
		 */
		deepHas: function(collection, propertyPath){
			var properties = getProperties(propertyPath);
			for(var i = 0; i < properties.length; i++){
				var property = properties[i];
				if(_.isObject(collection) && collection.hasOwnProperty(property)){
					collection = collection[property];
				}
				else{
					return false;
				}
			}

			return true;
		},
		/**
		 * Retrieves the value of a property in an object tree.
		 * @param {Object|Array} collection - The root object/array of the tree.
		 * @param {string|Array} propertyPath - The propertyPath.
		 * @returns {*} - The value, or undefined if it doesn't exists.
		 */
		deepGet: function(collection, propertyPath){
			if(_.deepIn(collection, propertyPath)){
				return _.reduce(getProperties(propertyPath), function(object, property){
					return object[property];
				}, collection);
			}
			else{
				return undefined;
			}
		},
		/**
		 * Retrieves the own value of a property in an object tree.
		 * @param {Object|Array} collection - The root object/array of the tree.
		 * @param {string|Array} propertyPath - The propertyPath.
		 * @returns {*} - The value, or undefined if it doesn't exists.
		 */
		deepOwn: function(collection, propertyPath){
			if(_.deepHas(collection, propertyPath)){
				return _.reduce(getProperties(propertyPath), function(object, property){
					return object[property];
				}, collection);
			}
			else{
				return undefined;
			}
		},
		/**
		 * Sets a value of a property in an object tree. Any missing objects/arrays will be created.
		 * @param {Object|Array} collection - The root object/array of the tree.
		 * @param {string|Array} propertyPath - The propertyPath.
		 * @param {*} value - The value to set.
		 * @returns {Object} The object.
		 */
		deepSet: function(collection, propertyPath, value){
			var properties, currentObject;
			properties = getProperties(propertyPath);
			currentObject = collection;

			_.forEach(properties, function(property, index){
				if(index + 1 === properties.length){
					currentObject[property] = value;
				}
				else if(!_.isObject(currentObject[property])){
					// Create the missing object or array
					currentObject[property] = properties[index + 1] % 1 === 0 ? [] : {};
				}
				currentObject = currentObject[property];
			});

			return collection;
		},
		/**
		 * Executes a deep pluck on an collection of object trees.
		 * @param {Object|Array} collection - The collection of object trees.
		 * @param {string|Array} propertyPath - The propertyPath.
		 * @returns {Array}
		 */
		deepPluck: function(collection, propertyPath){
			return _.map(collection, function(item){
				return _.deepGetValue(item, propertyPath);
			});
		},
		/**
		 * Escapes a property name for usage in a string based property path.
		 * @param {string} propertyName - The name / key of the property.
		 * @returns {string}
		 */
		deepEscapePropertyName: function(propertyName){
			return propertyName
				.replace(/\\/g, '\\\\')
				.replace(/\./g, '\\.');
		}
	};

	// Support pre 1.2.0 function names
	mixins.deepSetValue = mixins.deepSet;
	mixins.deepGetValue = mixins.deepGet;
	mixins.deepGetOwnValue = mixins.deepOwn;

	if(isNode){
		module.exports = mixins;
	}
	else{
		_.mixin(mixins);
	}

	/**
	 * The RegEx used by getPropertyPathParts
	 * We want to split on any non-escaped dot. Because the escape character can be escaped itself we have to check that
	 * the dot is not preceded by an uneven amount of backslashes.
	 * Normally we would use the following RegEx to split the path into the appropriate parts:
	 * /(?<!\\)(?:\\\\)*\./
	 * 1. (?<!\\)    Sequence not starting with \. This is called a 'lookbehind'.
	 * 2. (\\\\)    Any number of \\
	 * 3. \.        A dot
	 * Unfortunately Javascript does not support 'lookbehind', so we have to use a workaround.
	 * Since Javascript does support 'lookahead' we can reverse both the path, and the RegEx (so it can use 'lookahead'
	 * instead of 'lookbehind')
	 * The reverse RegEx is:
	 * /\.(\\\\)*(?!(\\))/
	 * 1. \.        A dot
	 * 2. (\\\\)*    Any number of \\
	 * 3. (?!(\\))    Sequence not ending with \. This is called a 'lookahead'.
	 * @type {RegExp}
	 */
	var reversePathSplitRegex = /\.(\\\\)*(?!(\\))/;

	/**
	 * Returns the property path as array.
	 * @param {string|Array} propertyPath
	 * @returns {Array}
	 */
	function getProperties(propertyPath){
		if(_.isArray(propertyPath)){
			return propertyPath;
		}
		else if(!_.isString(propertyPath)){
			return [];
		}

		// Reverse the path, so it can be used with the reverse RegEx
		return _(reverseString(propertyPath)
			// Split using the RegEx.
			.split(reversePathSplitRegex)
			// Reverse the parts of the array, to get them in original order
			.reverse())
			// The array returned by the splitting RegEx contains 3 items per path part:
			// 1. The main part
			// 2. undefined
			// 3. Backslashes located at the end of the part
			// Add these together to appropriate path parts
			.forEach(function(part, index, parts){
				if(index % 3 === 2 && part !== undefined){
					parts[index - 2] += part;
					parts[index] = undefined;
				}
			})
			// Remove undefined items
			.pull(undefined)
			// Unescape the parts, and reverse their contents back to original order
			.map(function(part){
				return reverseString(part)
					.replace(/\\\\/g, '\\')
					.replace(/\\\./g, '.');
			})
			.value();
	}

	function reverseString(string){
		return string.split('').reverse().join('');
	}
})();
