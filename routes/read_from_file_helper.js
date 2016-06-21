var isNumber = require('./is_number.js');
var _trim = require('./_trim.js');

var read_from_file_helper = function(data_arr, filename)
{	
	var lineReader = require('readline').createInterface({
		input: require('fs').createReadStream(filename)
	});

	var i=0;
	var data = [];
	var data_names = [];
	var message = '';
	var messages = [];
	var util = require('util');
	var segment = 0;
	
	function _record(formatted_string) {
		messages.push(formatted_string);
		console.log(formatted_string);
	}
	
	return lineReader.on('line', function (line) {
		
		var arr = line.split(",");
		
		if (i==0)
		{
			var temp = {};

			for(var j=0; j<arr.length; j++)
			{
				arr[j] = _trim(arr[j]);
				data_names.push(arr[j]);
				temp[j]=arr[j];
			}
			_record(util.format("(%d) data names stored: %s",i,line));
			data["filename"] = filename;
			data["columns"] = temp;
		}
		else 
		{	
			if (!(i%300)) {
				data = [];
				segment++;
			}
			var temp = {};
			
			for (var k=0; k<data_names.length; k++)
			{
				if (typeof arr[k] === 'undefined')
				{
					_record(util.format("(%d) %s does not exist for: %s", i,data_names[k],line));
				}
				else 
				{
					temp[data_names[k]] = _trim(arr[k]);
					//_record(util.format("(%d) %s stored in %s",i,arr[k],data_names[k]));
				}
				if (i==1)
				{
					var temp2 = data["columns"][k];
					data["columns"][k] = [];
					data["columns"][k]["name"] = temp2;
					
					if (isNumber(arr[k])) data["columns"][k]["type"] = "number";
					else data["columns"][k]["type"] = "string";
				}
			}
			data.push(temp);
			data_arr[segment] = data;
		}
		i++;
	});
}

module.exports = read_from_file_helper;