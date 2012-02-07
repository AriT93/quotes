$(document).ready(function (){

    Quote = Backbone.Model.extend({
        symbol: null
    });

    Quotes = Backbone.Collection.extend({
        initialize: function(models, options){
            //this.bind("add", options.view.addFriendLi);
        }
    });

      AppView = Backbone.View.extend({
        el: $("body"),
        initialize: function(){
          this.quotes = new Quotes(null, {view: this} );
        },
        events: {
          "click #add-quote": "showPrompt"
        },
        render: function(){
            var quotelist=[];
            this.quotes.each(function(model){
                quotelist.push( model.get('symbol'));
            });
            $.getJSON(getUrl(quotelist),parseData);
        },
        addsymbol: function(data){
            this.quotes.add(data);
        },
        showPrompt: function(){
            var symbol = prompt("What Symbol");
            var quote_model = new Quote({symbol: symbol});
            this.quotes.add(quote_model);
            this.render();
        },
        addFriendLi: function(model){

        }
    });
    window.appview = new AppView;
    var quote = new Quote({symbol: "gof"});
    appview.addsymbol(quote);
    var quote2 = new Quote({symbol : "TTM"});
    appview.addsymbol(quote2);
    appview.render();


    $("#quote").click(function(){
        appview.render();
    });

});