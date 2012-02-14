
function getUrl(symbol){
    var q = escape('select * from yahoo.finance.quotes where symbol in ("' + symbol + '")');
    var str = "http://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json&env=http://datatables.org/alltables.env";

    return str;

};

function parseData(result){
    $("#quote-list").empty();
    if(result.query.results){
    var quotes = result.query.results.quote;
        for(i = 0; i < quotes.length; i++){
            var q = Quotes.get(quotes[i].Symbol);
            appview.addQuoteLi(quotes[i]);
        }
        if(result.query.count === 1){
            var q = Quotes.get(quotes.Symbol);
            appview.addQuoteLi(quotes);
        }
    }
}
function getModelID(symbol){
   return Quotes.find(function(model){
        var m = model.toJSON();
        if(m.symbol === symbol){
            return m.id;
        }
    });

}