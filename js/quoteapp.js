$(document).ready(function (){

    window.Quote = Backbone.Model.extend({
        symbol: null,
        clear: function(){
            this.destroy();
//            $(this.id.el).remove();
        }

    });

    window.QuoteList = Backbone.Collection.extend({
        model: Quote,
        localStorage: new Store("quotes"),
        initialize: function(models, options){
        }
    });

    window.Quotes = new QuoteList;

    window.QuoteView = Backbone.View.extend({
        tagName: "li",

        template: _.template($("#quote-template").html()),

        events: {
            "click .symbol-destroy": "clear"
        },
        initialize: function(){
            this.model.view = this;
        },
        render: function(){
            $(this.el).html(this.template(this.model));
            $(this.el).attr('id', getModelID(this.model.Symbol).id);
            return this;
        },
        clear: function(){
            Quotes.get(this.el.id).clear();
            $("#quote-list #"+this.el.id).fadeOut('slow',function(el){
            $(el).remove();
            });
        }
    });

    window.AppView = Backbone.View.extend({
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
        },
        addsymbol: function(data){
            Quotes.create(data);
            this.render();
        },
        showPrompt: function(){
            var symbol = prompt("What Symbol").toUpperCase();
            var quote_model = new Quote({symbol: symbol});
            Quotes.create(quote_model);
            this.render();
        },
        addQuoteLi: function(model){
            var view = new QuoteView({model: model});
            var li = view.render().el;
            $("#quote-list").append(view.render().el);
        }
    });
    window.appview = new AppView;
    appview.render();

    $("#quote").click(function(){
        appview.render();
    });

});