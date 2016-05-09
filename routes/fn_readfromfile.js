

	var lineReader = require('readline').createInterface({
		input: require('fs').createReadStream('c:/sierrachart/data/'+pair+'.dly')
	});

	var i=0;
	var data = {};
	var message = '';
	function _record(formatted_string) {
		messages.push(formatted_string);
		console.log(formatted_string);
	}
	var messages = [];
	var data_names = [];
	
	lineReader.on('line', function (line) {
		
		var arr = line.split(",");
		
		if (i==0)
		{
			for(var j in arr)
			{
				data_names.push(arr[j]);
			}
			_record(util.format("(%d) data names stored: %s",i,line));
		}
		else if (i<10)
		{		
			var temp = {};
			
			for (var k in data_names)
			{
				if (typeof arr[k] === 'undefined')
				{
					_record(util.format("(%d) %s does not exist for: %s", i,data_names[k],line));
				}
				else 
				{
					temp[data_names[k]] = arr[k];
					_record(util.format("(%d) %s stored in %s",i,arr[k],data_names[k]));
				}
			}
			data[i] = temp;
		}
		i++;
	}).on('close', function() {
		res.send(JSON.stringify(data));
	});