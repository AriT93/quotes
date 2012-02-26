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
                    dataType: 'jsonp',
                    url: that.url + localStorage.getItem("quotes").toString(),
                    processData: false
                }, options);

                return $.ajax(params);
            }
        });

    // Define the View
    QuotesView = Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render', 'updateQuotes');
            // create a collection
            this.collection = new Quotes;
            // Fetch the collection and call render() method
            var that = this;
            this.collection.fetch({
                symbols: that.symbols,
                success: function () {
                    that.render();
                }
            });
            setTimeout(that.updateQuotes,60000);
        },
        // Use an extern template
        template: _.template($('#quotesTemplate').html()),

        render: function() {
            // Fill the html with the template and the collection
            $(".quote").fadeOut('slow');
            $(this.el).html(this.template({ quotes: this.collection.toJSON() }));
            $(".quote").fadeIn('slow');
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
        el: $('body')
    });
});