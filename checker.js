const shell = require('shelljs');
const fs = require('fs');
const https = require('https');

var Checker = class Checker
{
    constructor(html = "", baseUrl = "", basePath = "")
    {
        this.html = html;

        this.baseUrl = baseUrl;
        this.basePath = basePath;

        this.noClosedTags = ['<link', '<img'];
        this.checkNoClosedTags = function(htmlElement)
        {
            let boolReturn = false;
            this.noClosedTags.forEach((extension)=>
            {
                if(htmlElement.indexOf(extension) != -1)
                {
                    boolReturn = true;
                }
            });
            return boolReturn;
        };
        this.checkFromIndexHref = function(index)
        {
            return (this.html.substr(index, 6) == "href=\"" || this.html.substr(index, 6) == "href='") ? index : false
        };

        this.checkFromIndexSrc = function(index)
        {
            return (this.html.substr(index, 5) == "src='" || this.html.substr(index, 5) == "src=\"") ? index : false;
        };
        this.findLowerThan = function(index)
        {
            let i = 0;
            let b = true;
            let indexStr = 0;

            while(b)
            {
                i++;
                if(this.html.charAt(index - i) == '<')
                {
                    b = false;
                    indexStr = index - i;
                }
            }
            return indexStr;
        };
        this.getHtmlElement = function(index)
        {
            let i = index + 1, j = 0, b = true, htmlElement = "";

            while(b)
            {
                if(this.html.length >= i )
                {
                    htmlElement = this.html.substring(index, i);
                    if(htmlElement[htmlElement.length - 1] == '>')
                    {
                        j++;
                        if(this.checkNoClosedTags(htmlElement))
                        {
                            b = false;
                        }
                    }
                    if(j == 2)
                    {
                        b = false;
                    }
                    i++;
                }
                else
                {
                    b = false;
                }
            }
            return htmlElement;
        };
        this.checkElement = function(htmlElement)
        {
            let newHtml = "";

            let isAScriptTag = htmlElement.indexOf('<script') !== -1 && htmlElement.indexOf('</script>')  !== -1,
            isALinkTag = htmlElement.indexOf('<link')  !== -1,
            isAImgTag = htmlElement.indexOf('<img') !== -1;

            let isAValidTag = false;
            if(isAScriptTag)
            {
                isAValidTag = htmlElement.indexOf('.js') !== -1;
            }
            if(isALinkTag)
            {
                isAValidTag = htmlElement.indexOf('.css') !== -1 || this.checkImageTag(htmlElement);
            }
            if(isAImgTag)
            {
                if(htmlElement.indexOf('<a') !== -1)
                {
                    newHtml = this.cleanOfTagAImage(htmlElement);
                }
                
                isAValidTag = this.checkImageTag(htmlElement);
            }
            return {status : ((isAScriptTag || isALinkTag || isAImgTag) && isAValidTag), "html" : newHtml};
        };
        this.getUrlHtmlElement = function(htmlElement)
        {
            let openIndex = (htmlElement.indexOf('href=') != -1) ? htmlElement.indexOf('href=') : htmlElement.indexOf('src=');
            let closeIndex = (htmlElement.indexOf('"') !== -1) ? htmlElement.indexOf('"', openIndex + 6) : htmlElement.indexOf("'", openIndex + 6);

            return htmlElement.substring(openIndex + 5, closeIndex);
        };
        this.checkImageTag = function(htmlElement)
        {
            let boolReturn = false;
            let imagesExtensions = ['.tif','.tiff','.gif','.jpeg', 'jpg', '.jif', '.jfif','.jp2','.jpx','.j2k','.j2c','.fpx','.pcd','.png','.pdf', 'svg'];
            imagesExtensions.forEach((extension)=>
            {
                if(htmlElement.indexOf(extension) != -1)
                {
                    boolReturn = true;
                }
            });
            return boolReturn;
        };
        this.cleanOfTagAImage = function(htmlElement)
        {
            let indexStartImgTag = htmlElement.indexOf('<img');
            let newHTML = htmlElement.substr(indexStartImgTag);

            let indexEndImgTag = (newHTML.indexOf('/>') !== -1) ? newHTML.indexOf('/>') : newHTML.indexOf('>');
            let numberAdd = (newHTML.indexOf('/>') !== -1) ? 2 : 1;

            return newHTML.substring(0, indexEndImgTag + numberAdd);
        };
        this.checkElementExternal = function(htmlElement)
        {
            let indexs = 
            [
                htmlElement.indexOf('href="//') != -1,
                htmlElement.indexOf('href=\'//') != -1,
                htmlElement.indexOf('src=\'//') != -1,
                htmlElement.indexOf('src="//') != -1
            ];
            return indexs.indexOf(true);
        };
        this.checkFilesTarget = function(filesTarget)
        {
            let urlFiles = [], i = 0, baseUrl = this.baseUrl, basePath = this.basePath;
            filesTarget.forEach(function(fileTarget)
            {
                fileTarget.findImports();
                if(fileTarget.imports.length > 0)
                {
                    fileTarget.imports.forEach(function (ruteImport, index)
                    {
                        if(ruteImport.indexOf('http') == -1 && ruteImport.indexOf('HTTP') == -1)
                        {
                            let cleanUrl = ruteImport.split('(')[1].replace('"', '').replace('"', '');
                            cleanUrl = cleanUrl.replace("'", '').replace("'", '');

                            if(cleanUrl.split('/')[0] == "..")
                            {
                                cleanUrl = cleanUrl.replace('../', '');
                            }
                            let fullUrl = baseUrl + cleanUrl;
                            
                            let folderPath = basePath;
                            let filename = "";

                            let pathArray = cleanUrl.split('/');
                            pathArray.forEach((elementPath, index) =>
                            {
                                if(index != pathArray.length-1)
                                {
                                    folderPath += elementPath + "/";
                                }
                                else
                                {
                                    filename = elementPath;
                                    if(filename.indexOf('?') != -1 )
                                    {
                                        filename = elementPath.split('?')[0];
                                    }
                                }
                            });
                            shell.mkdir('-p', folderPath);

                            let add = "";
                            let b = true;

                            if(filename.indexOf('.css') !== -1)
                            {
                                add = "-unchecked";
                            }
                            let file = fs.createWriteStream(folderPath + filename + add, {flags: 'wx'});
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
                                  if(process.env.isConsoled == "true") console.log("Download Success 3 -> " + folderPath + filename);
                                }).on('error', (err)=>
                                {
                                    return new Error('No se pudo descargar' , {path : folderPath + filename, url : fullUrl});
                                });
                            }
                        }
                    });
                }
            });
        }
    }
}

module.exports = Checker;