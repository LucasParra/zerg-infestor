# Zerg Infestor
Obviously run:
```
npm install
```

For the 
use of this software you have to have the correct permissions on the directories where the files will go

# Commands And Options of us ZERG INFESTOR

The basic command is
````
node index 
````

Note: This command is usseless if you don't add the required options

# Required Options:
## The site option
**--site="https:/emo00.template-help.com/wt_prod-20039/"**

Here you have to paste (or write i don't know) the url of the template that you want to infest and bring to your pc. The best is to not include de index.html text in the url but if you want to or you have to (in case that, for example, they have a us.html and index.html files) you can paste with the .html name file and there is no problem

## The baseUrl option
**--baseUrl="https://livedemo00.template-help.com/wt_prod-20039/"**

Here you have to paste (or write again i don't know) the base of the url, for example if you have this

http://test.com/this/is/a/directory/us.html

You will have this folder structure

**this/is/a/directory**

and the baseUrl will be http://test.com/this/is/a/directory/

But now if you want to download another file that is in 

http://test.com/this/is/a/test/index.html

You will have this folder structure

**this/is/a/test**

and the baseUrl will be http://test.com/this/is/a/test/

## The basePath option
**--basePath="~/Sites/zergKiler/test"**

This is the (look the bold text) **EMPTY** folder where your files will go. Be sure that the permissions are correct because that always is forgotten by us, the developers

So if we take note of everything we can run a command like this

````
node index --site="https://web-platform-tests.org/appendix/test-templates.html" --baseUrl="https://web-platform-tests.org/appendix/" --basePath="~/Sites/zergKiler/test"
````

And all will be ok!:D

Any suggestion, request and all is wellcome!
