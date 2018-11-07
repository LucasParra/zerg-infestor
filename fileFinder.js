const glob  = require('glob');
const fs = require('fs');

const FileTarget = require('./fileTarget');
const Checker = require('./checker');
var FileFinder = class FileFinder
{
	constructor(baseUrl = "", basePath = "")
	{
		let filesTarget = [];
		let checker = new Checker("", baseUrl , basePath);
		glob(basePath  + "**/**/**/**/**/**", (err, files)=>
		{
			if (err)
			{
				console.log('Error', err);
			}
			else
			{
				files.forEach((path, index) =>
				{
					if(fs.lstatSync(path).isFile() && path.indexOf('-unchecked') !== -1)
					{
						filesTarget.push(new FileTarget(path, basePath));
					}
				});
				if(filesTarget.length > 0)
				{
					checker.checkFilesTarget(filesTarget);

					filesTarget.forEach((fileTarget) =>
					{
						fileTarget.changeName(fileTarget.path.replace('-unchecked', ''));
					});
				}
			}
		});
	}
}

module.exports = FileFinder;