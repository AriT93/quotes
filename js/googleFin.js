$(document).ready(function() {
    // Define the model
    Quote = Backbone.Model.extend();

    // Define the collection
    Quotes = Backbone.Collection.extend(
        {
            model: Quote,
            // Url to request when fetch() is called
            // //%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22
            //url: 'http://www.google.com/finance/info?infotype=infoquoteall&q=' + localStorage.getItem("quotes").toString(),
            url: 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20('+'"'+localStorage.getItem("quotes").toString().replace(/,/g,'","') + '"'+ ')&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
            parse: function(response) {
                return response.query.results.quote;
            },
            // Overwrite the sync method to pass over the Same Origin Policy
            sync: function(method, model, options) {
                var that = this;
                var params = _.extend({
                    type: 'GET',
                    dataType: 'jsonp',
                    url: that.url, // + localStorage.getItem("quotes").toString(),
                    processData: false
                }, options);
                return $.ajax(params);
                // options.timeout = 10000;
                // options.dataType = 'jsonp xml';
                // var qs= Backbone.sync(method,model,options);
            },
            remove: function(deleted){
                var arSym = localStorage.getItem("quotes").split(',');
                var newArr = new Array();for(k in arSym) if(arSym[k] != deleted) newArr.push(arSym[k]);
                localStorage.setItem("quotes",newArr.join(','));
            }
        });

    // Define the View
    QuotesView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render', 'updateQuotes','showPrompt');
            // create a collection
            this.collection = new Quotes;
            // Fetch the collection and call render() method
            if (localStorage.getItem("quotes") == ""|| localStorage.getItem("quotes") == null){
                localStorage.setItem("quotes","INDEXDJX:.DJI");
            }
            var that = this;
            this.collection.fetch({
                symbols: that.symbols,
                success: function () {
                    that.render();
                },
                error: function(req,error,errorThrown){
                }
            });
            setTimeout(that.updateQuotes,60000);
        },
        events:{
            "click #add-quote": "showPrompt",
            "click #del-quote": "removeSymbol"
        },
        // Use an extern template
        template: _.template($('#quotesTemplate').html()),

        render: function() {
            // Fill the html with the template and the collection
            $(".quote").fadeOut('slow');
            $(this.el).html(this.template({ quotes: this.collection.toJSON() }));
            $(".quote").fadeIn('slow');
        },
        showPrompt: function(){
            var symbol = prompt("What Symbol").toUpperCase();
            localStorage.setItem("quotes",localStorage.getItem("quotes") + "," + symbol);
            this.updateQuotes();
        },
        removeSymbol: function(){
            var symbol = prompt("What Symbol").toUpperCase();
            this.collection.remove(symbol);
            this.collection.remove("");
            this.updateQuotes();
        },
        updateQuotes: function(){
            var that = this;
            this.collection.fetch({
                success: function(){
                    that.render();
                }
            });
            setTimeout(that.updateQuotes, 60000);
        }
    });

    window.app = new QuotesView({
        // define the el where the view will render
        el: $('#quotes')
    });
});
