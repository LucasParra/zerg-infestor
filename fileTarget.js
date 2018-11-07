const fs = require('fs');

var FileTarget = class FileTarget
{
	constructor(path = "")
	{

		this.path = path;
		this.url = "";

		this.imports = [];

		this.setUrl = function(url)
		{
			this.url = url;
		};

		this.findImports = function()
		{
			let indexFind = fs.readFileSync(this.path,'utf-8').indexOf('url(');

			if(indexFind != -1)
			{
				let indexData = this.findAllIndexInData('url(');
				if(indexData) this.getFilesImport(indexData)
			}
			return this.imports;
		};
		this.getFilesImport = function(indexs)
		{
			indexs.forEach((index) =>
			{
				let closeIndex = fs.readFileSync(this.path,'utf-8').indexOf(')' , index + 5)
				let element = fs.readFileSync(this.path,'utf-8').substring(index, closeIndex);
				if(element.indexOf('data:image') == -1)
				{
					this.imports.push(element);
				}
			});
		};
		this.findAllIndexInData = function(search)
		{
			let returnData = [];

		    let searchStrLen = search.length;
		    if (searchStrLen > 0)
		    {
     		    let startIndex = 0, index, indexs = [];

		        search = search.toLowerCase();

			    while ((index = fs.readFileSync(this.path,'utf-8').indexOf(search, startIndex)) > -1)
			    {
			        indexs.push(index);
			        startIndex = index + searchStrLen;
			    }
			    returnData = indexs;
		    }
		    return returnData;
		};

        this.changeName = function(newName)
        {
            fs.rename(this.path, newName, function(err)
            {
                if ( err ) console.log(err);
            });
        };
	}
}

module.exports = FileTarget;