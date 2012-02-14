$(document).ready(function (){
  var Quote = Backbone.Model.extend({
        clear: function(){
            this.destroy();
        }
    });

    var QuoteList = Backbone.Collection.extend({
        model: Quote,
        localStorage: new Store("quotes")
    });

    var QuoteView = Backbone.View.extend({
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
            appview.collection.get(this.el.id).clear();
            $("#quote-list #"+this.el.id).fadeOut('slow',function(el){
            $(el).remove();
            });
        }

    });

    var AppView = Backbone.View.extend({
        el: $("body"),
        initialize: function(){
            _.bindAll(this, 'render');
            this.collection = new QuoteList();
            this.collection.fetch();
            this.render();
        },
        events: {
            "click #add-quote": "showPrompt"
        },
        render: function(){
            var quotelist=[];
            this.collection.each(function(model){
                quotelist.push( model.get('symbol'));
            });
            $.getJSON(this.getUrl(quotelist),this.parseData);
        },
        showPrompt: function(){
            var symbol = prompt("What Symbol").toUpperCase();
            var quote_model = new Quote({symbol: symbol,id: symbol});
            this.collection.create(quote_model);
            this.render();
        },
        addQuoteLi: function(model){
            var q =  this.collection.get(model.Symbol);
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
                    var q = appview.collection.get(quotes[i].Symbol);
                    appview.addQuoteLi(quotes[i]);
                }
                if(result.query.count === 1){
                    var q = appview.collection.get(quotes.Symbol);
                    appview.addQuoteLi(quotes);
                }
            }
        },
        getUrl: function(symbol){
            var q = escape('select * from yahoo.finance.quotes where symbol in ("' + symbol + '")');
            var str = "http://query.yahooapis.com/v1/public/yql?q=" + q + "&format=json&env=http://datatables.org/alltables.env";
            return str;
        }
    });
    var appview = new AppView();

     $("#quote").click(function(){
         appview.render();
     });

});
