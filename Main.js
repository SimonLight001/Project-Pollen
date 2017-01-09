//METRO TILES

var height = 0;
var width = 0;

var unitSize = 200;

//Tiles per large/medium/small
var l = 6;
var m = 4;
var s = 2;

var sizeFlag = 'l';

var mThreshold = 800;
var sThreshold = 550;

var padding = 2;
var scaledPadding = 0;

$(document).ready(function() {
    UpdateSize();
    RedrawCards();
    RepositionCards();
	checkFileAPI();
	AssignData();
});

$(window).resize(function() {
    UpdateSize();
    RedrawCards();
    RepositionCards();
	AssignData();
});

function UpdateSize()
{
    height = $(window).height();
    width = $(window).width();
    if(width > mThreshold)
    {
        unitSize = width / l;
        scaledPadding = padding / l;
        sizeFlag = 'l';
    }
    else if (width > sThreshold)
    {
        unitSize = width / m;
        scaledPadding = padding / m;
        sizeFlag = 'm';
    }
    else
    {
        unitSize = width / s;
        scaledPadding = padding / s;
        sizeFlag = 's';
    }
}

function RedrawCards()
{
    var cards = document.getElementsByClassName("pollen-content");
    for (var i = 0; i < cards.length; i++)
    {
        var size = cards[i].dataset.size;
        console.log(size);
        if(size == "1x1")
        {
            cards[i].style.width = unitSize - scaledPadding - padding + "px";
            cards[i].style.height = unitSize - scaledPadding - padding + "px";
        }
        else if(size == "2x2")
        {
            cards[i].style.width = (unitSize * 2) - scaledPadding - padding + "px";
            cards[i].style.height = (unitSize * 2) - scaledPadding - padding + "px";
        }
        else if(size == "2x1")
        {
            cards[i].style.width = (unitSize * 2)  - scaledPadding - padding + "px";
            cards[i].style.height = unitSize - scaledPadding - padding + "px";
        }
    }
}

function RepositionCards()
{
    var width;
    if(sizeFlag == 'l')
        width = l;
    else if(sizeFlag == 'm')
        width = m;
    else
        width = s;

    var grid = new Array([]);

    var cards = document.getElementsByClassName("pollen-content");

    for(var x = 0; x < width; ++x)
    {
        grid[x] = new Array();
        for(var y = 0; y < cards.length * 2; ++y)
        {
            grid[x][y] = 0;
        }
    }

    var retract = false;

    for (var i = 0; i < cards.length; i++)
    {
        if(retract)
            retract = false;
        var size = cards[i].dataset.size;
        for(var y = 0; y < cards.length * 2; ++y)
        {
            if(retract) //Need a better way of exiting the nested loop
                break;
            for(var x = 0; x < width; ++x)
            {
                if(retract) //Need a better way of exiting the nested loop
                    break;
                if(size == "1x1")
                {
                    if(grid[x][y] == 0)
                    {
                        cards[i].style.transform = 'translate(' + ((x * unitSize) + padding - scaledPadding) + 'px,' + ((y * unitSize) + padding - scaledPadding) + 'px)';
                        grid[x][y] = 1;
                        retract = true;
                    }
                }
                else if(size == "2x2")
                {
                    if(x <= width - 2 && y <= cards.length * 2 - 2) //in bounds?
                    {
                        if(grid[x][y] == 0 && grid[x + 1][y] == 0 && grid[x][y + 1] == 0 && grid[x + 1][y + 1] == 0)
                        {
                            cards[i].style.transform = 'translate(' + ((x * unitSize) + padding - scaledPadding) + 'px,' + ((y * unitSize) + padding - scaledPadding) + 'px)';
                            grid[x][y] = 1;
                            grid[x + 1][y] = 1;
                            grid[x][y + 1] = 1;
                            grid[x + 1][y + 1] = 1;
                            retract = true;
                        }
                    }
                }
                else if(size == "2x1")
                {
                    if(x <= width - 2) //in bounds?
                    {
                        if(grid[x][y] == 0 && grid[x + 1][y] == 0)
                        {
                            cards[i].style.transform = 'translate(' + ((x * unitSize) + padding - scaledPadding) + 'px,' + ((y * unitSize) + padding - scaledPadding) + 'px)';
                            grid[x][y] = 1;
                            grid[x + 1][y] = 1;
                            retract = true;
                        }
                    }
                }
            }
        }
    }
}

function AssignData()
{
	
	var parser, xmlDoc;

	text = "<bookstore><book>" +
	"<title>Everyday Italian</title>" +
	"<author>Giada De Laurentiis</author>" +
	"<year>2005</year>" +
	"</book></bookstore>";
	
	console.log(text);

	parser = new DOMParser();
	xmlDoc = parser.parseFromString(text,"text/xml");

	document.getElementById("content1").innerHTML =
	xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
}
function AddCard()
{

}

    var reader; //GLOBAL File Reader object for demo purpose only

    /**
     * Check for the various File API support.
     */
    function checkFileAPI() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            reader = new FileReader();
            return true; 
        } else {
            alert('The File APIs are not fully supported by your browser. Fallback required.');
            return false;
        }
    }

    /**
     * read text input
     */
    function readText(filePath) {
        var output = ""; //placeholder for text output
        if(filePath.files && filePath.files[0]) {           
            reader.onload = function (e) {
                output = e.target.result;
                displayContents(output);
            };//end onload()
            reader.readAsText(filePath.files[0]);
        }//end if html5 filelist support
        else if(ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
            try {
                reader = new ActiveXObject("Scripting.FileSystemObject");
                var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
                output = file.ReadAll(); //text contents of file
                file.Close(); //close file "input stream"
                displayContents(output);
            } catch (e) {
                if (e.number == -2146827859) {
                    alert('Unable to access local files due to browser security settings. ' + 
                     'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
                     'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
                }
            }       
        }
        else { //this is where you could fallback to Java Applet, Flash or similar
            return false;
        }       
        return true;
    }   

    /**
     * display content using a basic HTML replacement
     */
    function displayContents(txt) {
        var el = document.getElementById('main'); 
        el.innerHTML = txt; //display output in DOM
    }   

//SLIDESHOW
