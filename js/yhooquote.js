function getUrl(symbol){
    var q = escape('select * from yahoo.finance.quotes where symbol in ("' + symbol +'")');
    var str = "http://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json&env=http://datatables.org/alltables.env";

    return str;

};


function parseData(result){
    $("#quote-area").empty();
    if(result){
        var quotes = result.query.results.quote;
        var html="";
        for(i = 0; i < quotes.length; i++){
            var template = _.template($("#quote-template").html(), quotes[i]);
            html += template;
        }
        $("#quote-area").html(html);
    }
}
