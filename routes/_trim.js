module.exports = function(string) {
	string = string.replace(/^\s{1,}/,'');
	string = string.replace(/\s{1,}$/,'');
	return string;
}