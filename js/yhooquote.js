function getUrl(symbol){
    var q = escape('select * from yahoo.finance.quotes where symbol in ("' + symbol +'")');
    var str = "http://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json&env=http://datatables.org/alltables.env";

    return str;

};


function parseData(result){
    var quotes = result.query.results.quote;
    for(i = 0; i < quotes.length; i++){
        var template = _.template($("#quote-template").html(), quotes[i]);
        $("#quote-list").append(template);
//        template(quotes[i]);
        $("#" + quotes[i].Symbol).html(quotes[i].Symbol);
        $("#"+ quotes[i].Symbol.toLowerCase() +" #price").html(quotes[i].LastTradePriceOnly);
        $("#range").html(quotes[i].YearRange);
        $("#div_yield").html(quotes[i].DividendYield);
        $("#div_date").html(quotes[i].DividendPayDate);
        $("#div_share").html(quotes[i].DividendShare);
        $("#time").html(quotes[i].LastTradeDate + ' ' + quotes[i].LastTradeTime);
    }
}
