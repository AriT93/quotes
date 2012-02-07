$(document).ready(function (){

    window.Quote = Backbone.Model.extend({
        symbol: null
    });

    window.QuoteList = Backbone.Collection.extend({
        model: Quote,
        localStorage: new Store("quotes"),
        initialize: function(models, options){
        }
    });

    window.Quotes = new QuoteList;

    AppView = Backbone.View.extend({
        el: $("body"),
        initialize: function(){
            Quotes.fetch();
        },
        events: {
            "click #add-quote": "showPrompt"
        },
        render: function(){
            $("#quote-area").fadeOut('slow');
            var quotelist=[];
            Quotes.each(function(model){
                quotelist.push( model.get('symbol'));
            });
            $.getJSON(getUrl(quotelist),parseData);
            setTimeout(function(){
                appview.render();
            },60000);
        },
        addsymbol: function(data){
            Quotes.create(data);
            this.render();
        },
        showPrompt: function(){
            var symbol = prompt("What Symbol");
            var quote_model = new Quote({symbol: symbol});
            Quotes.create(quote_model);
            this.render();
        },
        addFriendLi: function(model){
            this.render();
        }
    });
    window.appview = new AppView;
    appview.render();

    $("#quote").click(function(){
        appview.render();
    });

});