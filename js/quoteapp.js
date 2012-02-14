$(document).ready(function (){

    window.Quote = Backbone.Model.extend({
        clear: function(){
            this.destroy();
        }
    });

    window.QuoteList = Backbone.Collection.extend({
        model: Quote,
        localStorage: new Store("quotes")
    });

    window.Quotes = new QuoteList;

    window.QuoteView = Backbone.View.extend({
        tagName: "li",

        template: _.template($("#quote-template").html()),

        events: {
            "click .symbol-destroy": "clear"
        },

        initialize: function(){
            _.bindAll(this,'render','clear');
            this.model.view = this;
        },
        render: function(){
            $(this.el).html(this.template(this.model.attributes));
            $(this.el).attr('id',this.model.attributes.Symbol);
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
            $.getJSON(getUrl(symbol),this.getQuoteData);
            var quote_model = new Quote({symbol: symbol,id: symbol});
            Quotes.create(quote_model);
            this.render();
        },
        addQuoteLi: function(model){
            var q =  Quotes.get(model.Symbol);
            if(q){
            q.set(model);
            q.save();
            }else{
                q = new Quote({symbol: model.Symbol,id:model.Symbol});
            }
            var view = new QuoteView({model: q});
            $("#quote-list").append(view.render().el);
        },
        getQuoteData: function(result){
            if(result.query.results){
                var q = Quotes.get(result.query.results.quote.Symbol);
                q.set(result.query.results.quote);
            }
        }
    });
    window.appview = new AppView;
    appview.render();

     $("#quote").click(function(){
         appview.render();
     });

});