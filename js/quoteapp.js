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
        showPrompt: function(){
            var symbol = prompt("What Symbol").toUpperCase();
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
        parseData: function(result){
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
        },
        getUrl:function(symbol){
            var q = escape('select * from yahoo.finance.quotes where symbol in ("' + symbol + '")');
            var str = "http://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json&env=http://datatables.org/alltables.env";
            return str;
        }
    });
    window.appview = new AppView;
    appview.render();

     $("#quote").click(function(){
         appview.render();
     });

});