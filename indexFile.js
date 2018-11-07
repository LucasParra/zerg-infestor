const axios = require('axios');
const download = require('download-file')
const https = require('https');
const fs = require('fs');
const shell = require('shelljs');

const Checker = require('./checker');
const HTMLElements = require('./html');
const FileFinder = require('./fileFinder');

const IndexFile = class IndexFile
{
	constructor(basePath = "", baseUrl = "", site = "")
	{
		this.filename = "";

		this.baseUrl = baseUrl;
		this.basePath = basePath;

		this.site = site;

		this.getFileName = function()
		{
			this.filename = this.site.substr(this.site.lastIndexOf('/') + 1) == '' ? 'index.html' : this.site.substr(this.site.lastIndexOf('/') + 1);
		}
		this.getFiles = function()
		{
			let checker;
		    axios.get(this.site)
		    .then((response)=>
		    {
		        let html = String(response.data);
		        checker = new Checker(html, baseUrl, basePath);

		        let indexs = [];
		        for(let i = 0; i < html.length;i++)
		        {
		            if(html[i] === "h")
		            {
		                let search = checker.checkFromIndexHref(i);
		                if(search !== false)
		                {
		                    indexs.push({index : i, type : 'href'});
		                }
		            }
		            else if(html[i] === "s")
		            {
		                let search = checker.checkFromIndexSrc(i);
		                if(search !== false)
		                {
		                    indexs.push({index : i, type : 'src'});
		                }
		            }
		        }
		        let htmlData = [];
				let htmlElement = new HTMLElements('', checker.basePath, checker.baseUrl);
		        indexs.forEach(function(element,index)
		        {
		            let indexOpen = checker.findLowerThan(element.index);
		            let htmlElementText = checker.getHtmlElement(indexOpen);

		            checker.checkElement(htmlElementText);

		            let dataCheckHtml = checker.checkElement(htmlElementText);

		            let indexBool = checker.checkElementExternal(htmlElementText);

		            if(dataCheckHtml.status)
		            {
		            	if(dataCheckHtml.html)
	            		{
	            			htmlElementText = dataCheckHtml.html;
	            		}
						htmlData.push(checker.getUrlHtmlElement(htmlElementText).replace('"',''))
		            }
		        });
   	            htmlElement.findFiles = function()
	            {
	            	new FileFinder(baseUrl, basePath);
	            }
	            htmlElement.totalHtmlElements = htmlData.length;
	            htmlData.forEach((htmlText) =>
	            {
	            	htmlElement.url = htmlText;
	            	htmlElement.download(htmlText);
	            });
		    })
		    .catch(error =>
		    {
		        if(process.env.isConsoled == "true") console.log(error);
		    });
		}
		this.downloadIndex = function(callback)
		{
    		let fullUrl =  this.baseUrl + this.filename;
            
            let file = fs.createWriteStream(this.basePath + this.filename);

            if(process.env.isConsoled == "true") console.log(fullUrl);

            let options =
            {
                method: 'GET',
                headers: {'user-agent': 'node.js'}
            };
            let req = https.get(fullUrl, options, (res) =>
            {
            	res.setEncoding('utf-8');
				res.on('data', function (body)
				{
				    file.write(String(body).replace('href="//','href="http://'));
			    });
				if(process.env.isConsoled == "true") console.log("Download Succes 1 -> " + this.basePath + this.filename);
            }).on('error', (err)=>
            {
                if(process.env.isConsoled == "true") console.log(err);
            })
		}
		this.getFileName();
	}
}
module.exports = IndexFile;