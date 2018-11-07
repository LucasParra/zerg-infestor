var https = require('https');
var fs = require('fs');
var options =
{
    method: 'GET',
    headers: {'user-agent': 'node.js'}
};
var file = fs.createWriteStream("/Users/lucas/Sites/test.css");
var request = https.get('https://livedemo00.template-help.com/wt_prod-12812/css/bootstrap.css', options, function(response)
{
  response.pipe(file);
});