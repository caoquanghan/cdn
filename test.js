var fs = require('fs');
String.prototype.compress = function (asArray) {
	"use strict";
	// Build the dictionary.
	asArray = (asArray === true);
	var i,
		dictionary = {},
		uncompressed = this,
		c,
		wc,
		w = "",
		result = [],
		ASCII = '',
		dictSize = 256;
	for (i = 0; i < 256; i += 1) {
		dictionary[String.fromCharCode(i)] = i;
	}

	for (i = 0; i < uncompressed.length; i += 1) {
		c = uncompressed.charAt(i);
		wc = w + c;
		//Do not use dictionary[wc] because javascript arrays
		//will return values for array['pop'], array['push'] etc
	   // if (dictionary[wc]) {
		if (dictionary.hasOwnProperty(wc)) {
			w = wc;
		} else {
			result.push(dictionary[w]);
			ASCII += String.fromCharCode(dictionary[w]);
			// Add wc to the dictionary.
			dictionary[wc] = dictSize++;
			w = String(c);
		}
	}

	// Output the code for w.
	if (w !== "") {
		result.push(dictionary[w]);
		ASCII += String.fromCharCode(dictionary[w]);
	}
	return asArray ? result : ASCII;
};

String.prototype.decompress = function () {
	"use strict";
	// Build the dictionary.
	var i, tmp = [],
		dictionary = [],
		compressed = this,
		w,
		result,
		k,
		entry = "",
		dictSize = 256;
	for (i = 0; i < 256; i += 1) {
		dictionary[i] = String.fromCharCode(i);
	}

	if(compressed && typeof compressed === 'string') {
		// convert string into Array.
		for(i = 0; i < compressed.length; i += 1) {
			tmp.push(compressed[i].charCodeAt(0));
		}
		compressed = tmp;
		tmp = null;
	}

	w = String.fromCharCode(compressed[0]);
	result = w;
	for (i = 1; i < compressed.length; i += 1) {
		k = compressed[i];
		if (dictionary[k]) {
			entry = dictionary[k];
		} else {
			if (k === dictSize) {
				entry = w + w.charAt(0);
			} else {
				return null;
			}
		}

		result += entry;

		// Add w+entry[0] to the dictionary.
		dictionary[dictSize++] = w + entry.charAt(0);

		w = entry;
	}
	return result;
};
var inputData = fs.readFileSync('combine.min.js');
//thêm escape cho các ký tự đặc biệt
inputData = `\"` + inputData.toString().replace(/\'/g, '\\\'').replace(/\"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + `\"`;
fs.writeFileSync('input.txt', inputData);
var checkData = fs.readFileSync('check.txt');
console.log(checkData.toString() === inputData);
console.log(checkData.toString().compress() === inputData.compress());
//luu nguyen ban noi dung checkData.toString().compress() vao file output.txt
var decode = {
	data: checkData.toString().compress(),
}
fs.writeFileSync('output.json', JSON.stringify(decode));

var t = fs.readFileSync('output.json');
var decode = JSON.parse(t).data;

console.log(decode.decompress() === inputData.compress().decompress());