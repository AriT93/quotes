$(document).ready(function() {
    // Define the model
    Quote = Backbone.Model.extend();

    // Define the collection
    Quotes = Backbone.Collection.extend(
        {
            model: Quote,
            // Url to request when fetch() is called
            url: 'http://www.google.com/finance/info?infotype=infoquoteall&q=',
            parse: function(response) {
                return response;
            },
            // Overwrite the sync method to pass over the Same Origin Policy
            sync: function(method, model, options) {
                var that = this;
                var params = _.extend({
                    type: 'GET',
                    dataType: 'data',
                    url: that.url + localStorage.getItem("quotes").toString(),
                    processData: false
                }, options);

                return $.ajax(params);
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
