
var conf = "Stocks.json";
var request = require('request');
var fs = require('fs');
$( document ).ready(function() {
	if (fs.existsSync("Stocks.json"))
	{
		console.log("Stocks.json exists, load into html");
		var stocks = JSON.parse( fs.readFileSync("Stocks.json",'utf8') )
		for (var i = stocks.recentStocks.length - 1; i >= 0; i--) {
			$("#recentStocks").append("<li class='new-item'>"+stocks.recentStocks[i].symbol+"</li>");
			console.log(stocks.recentStocks[i].name)
		};
	}
	else
	{
		console.log("First time setup!");
		fs.writeFileSync("Stocks.json", '{ "recentStocks":[],"Urls":[],"}', "utf8");
	}



	$("#queryButton").click(function(event) {

		request('http://d.yimg.com/autoc.finance.yahoo.com/autoc?query='+encodeURIComponent($('#queryBar').val())+'&callback=YAHOO.Finance.SymbolSuggest.ssCallback', function (error, response, body) {
			if (!error && response.statusCode == 200) {
    			body = body.replace('YAHOO.Finance.SymbolSuggest.ssCallback(',"");
    			body = body.slice(0, body.length-1)
    			body = JSON.parse(body)
    			var name = body.ResultSet.Result[0].name
    			var symbol = body.ResultSet.Result[0].symbol
				var obj = JSON.parse('{	"name"	:"'+name+'","symbol":"'+symbol+'"}')
				var stocks = JSON.parse( fs.readFileSync("Stocks.json",'utf8') );
				if (fs.readFileSync("Stocks.json","utf8").indexOf(name) == -1)
				{
				stocks['recentStocks'].push(obj);
				fs.writeFileSync("Stocks.json",stocks,"utf8");
				$("#recentStocks").append('<li class="new-item" >'+obj.symbol+'</li>')	
			}
		}
	});
});


	$('#iconlist #Add_url').click(function(event) {
		console.log("Hello");

		$('#urllist').append('<div class="row"><div class="medium-3 columns" id="input">URL:</div><div class="medium-8 columns"><input id="urlInput" type="text"></div><div class="medium-1 columns"><i class="fa fa-close"></i></div></div>')	
	})
	$('#iconlist #save_url').click(function(event) {
		var l=[];
		var stocks 	= 	fs.readFileSync(conf,'utf8');
		stocks.Urls =[];
		for (var i =0; i< $("#urllist #urlInput").length; i++) {
			stocks.Urls.push($("#urllist #urlInput")[i].value );
			console.log(stocks.Urls);
		};
		console.log(l);
		stocks.Urls = l;
		
		fs.writeFileSync("Stocks.json",stocks,"utf8");
	});
});
