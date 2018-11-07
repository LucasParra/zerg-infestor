const https = require('https');
const fs = require('fs');
const shell = require('shelljs');

const HTMLElements = class HTMLElements
{
    constructor(url = "", basePath = "", baseUrl = "")
    {
    	this.url = url.replace('"', '');
    	this.filename = "";

    	this.basePath = basePath;
    	this.baseUrl = baseUrl;
        this.acc = 0;

        this.findFiles;

        this.totalHtmlElements = 0;

    	this.download = function()
    	{
    		if(this.url.indexOf('HTTP') == -1 &&
                this.url.indexOf('http') == -1 &&
                this.url.indexOf('//') == -1)
    		{
                let b = true;
    			this.setFileName();

    			let middlePath = this.getMiddlePath();
    		
	    		let fullUrl = this.baseUrl + this.url;

                shell.mkdir('-p', this.basePath + ((middlePath !== false) ? middlePath : ''));

                let add = "";
                if(this.filename.indexOf('.css') !== -1)
                {
                    add = "-unchecked";
                }
                let file = fs.createWriteStream(this.basePath + ((middlePath !== false) ? middlePath : '') + this.filename + add, {flags: 'wx'});
                file.on('error', function(err)
                {
                    b = false;
                    file.end();
                });

                if(b)
                {
                    let options =
                    {
                        method: 'GET',
                        headers: {'user-agent': 'node.js'}
                    };
                    let request = https.get(fullUrl, options, (response) =>
                    {
                        response.pipe(file);
                        this.addOneAcc();
                        if(process.env.isConsoled == "true") console.log("Download Succes 2 -> " + this.basePath + ((middlePath !== false) ? middlePath : '') + this.filename);
                    }).on('error', (err)=>
                    {
                        if(process.env.isConsoled == "true") console.log(err);
                    });
                }
    		}
    	}

    	this.setFileName = function()
    	{
    		this.filename = this.url.substr(this.url.lastIndexOf('/') + 1);
    	}

    	this.getMiddlePath = function()
    	{
    		return (this.filename != this.url) ? this.url.substring(0, this.url.lastIndexOf('/') + 1) : false;
    	}
        this.addOneAcc = function()
        {
            this.acc++;
            if(this.acc == this.totalHtmlElements-1)
            {
                this.findFiles();
            }
        };

    }
}

module.exports = HTMLElements;