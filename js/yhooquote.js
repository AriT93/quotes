function getUrl(symbol){
    var q = escape('select * from yahoo.finance.quotes where symbol in ("' + symbol + '")');
    var str = "http://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json&env=http://datatables.org/alltables.env";

    return str;

};


function parseData(result){

    $("#quote-area").empty();
    var template = _.template($("#quote-template").html());
    var quotes = result.query.results.quote;
    var html="";
    if(result){
        for(i = 0; i < quotes.length; i++){
            html += template(quotes[i]);
        }
        if(result.query.count === 1){
            html += template(quotes);
        }
    }
    $("#quote-area").html(html);
    $("#quote-area").fadeIn('slow');
}
