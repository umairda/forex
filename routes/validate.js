var util = require('util');
var isNumber = require('./is_number.js');

module.exports = function(arr,types) {

	var valid = 1;
	var j = 0;
	
	for (var i in arr)
	{
		//console.log(util.format("arr[i]: %s, typeof arr[i]: %s, types[j] %s",arr[i],typeof arr[i],types[j]));
		if (types[j]=='number')
		{
			if (!isNumber(arr[i])) valid = 0;
		}
		else if (typeof arr[i] != types[j]) valid = 0;
		j++;
	}
	
	return valid;
}