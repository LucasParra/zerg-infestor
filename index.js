console.clear();
const yargs = require('yargs');
const axios = require('axios');
const glob  = require('glob');
const fs = require('fs');
const shell = require('shelljs');
const https = require('https');

const Checker = require('./checker');
const HTMLElement = require('./html');
const IndexFile = require('./indexFile');
const FileTarget = require('./fileTarget')

if(yargs.argv.site && yargs.argv.baseUrl && yargs.argv.basePath)
{
	const site = yargs.argv.site;
	const baseUrl = (yargs.argv.baseUrl.charAt(yargs.argv.baseUrl.length - 1) !== "/") ? yargs.argv.baseUrl + "/" : yargs.argv.baseUrl;
	const basePath = (yargs.argv.basePath.charAt(yargs.argv.basePath.length -1) !== "/") ? yargs.argv.basePath + "/" : yargs.argv.basePath + "/";

	let checker = new Checker("", baseUrl , basePath);
	if(baseUrl  == baseUrl + site.substr(site.lastIndexOf('/') + 1,- 1))
	{
	    process.env.isConsoled = true;

	   	let file = new IndexFile(basePath, baseUrl, site);

		file.downloadIndex();
		
	    [0,1,2,3].forEach(()=> //Number o levels to search
	    {
	    	file.getFiles();
		    file.getFiles();
		    file.getFiles();
		    file.getFiles();
	    });
	}
}