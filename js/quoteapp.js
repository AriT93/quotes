$(document).ready(function (){

    Quote = Backbone.Model.extend({
        symbol: null
    });

    Quotes = Backbone.Collection.extend({
        initialize: function(models, options){
            this.bind("add", options.view.addFriendLi);
        }
    });

    AppView = Backbone.View.extend({
        el: $("body"),
        initialize: function(){
            this.quotes = new Quotes(null,{view: this});
        },
        events: {
            "click #add-quote" : "showPrompt"
        },
        showPrompt: function(){
            var symbol = prompt("What Symbol");
            var quote_model = new Quote({symbol: symbol});
            this.quotes.add(quote_model);
        },
        addFriendLi: function(model){
            $("#quote-list").append("<li>" + model.get('symbol') + "</li>");
        }
    });
    var appview = new AppView;

    $("#quote").click(function(){
        $.getJSON(getUrl("TTM,GOF"),parseData);
    });

});