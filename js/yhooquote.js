function getUrl(symbol){
    var q = escape('select * from yahoo.finance.quotes where symbol ="' + symbol +'"');
    var str = "http://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json&env=http://datatables.org/alltables.env";

    return str;

};


function parseData(result){
    var quotes = result.query.results.quote;

    $("#symbol").html(quotes.Symbol);
    $("#price").html(quotes.LastTradePriceOnly);
    $("#range").html(quotes.YearRange);
//  $("#data").html(JSON.stringify( result.query.results));
}


$(document).ready(function(){




$("#quote").click(function(){
    $.getJSON(getUrl("ibm"),parseData);
    //alert("blarrrr")
});

});