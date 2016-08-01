var urlWidget = {
    parse: function(node){
        var urlRegex = new RegExp(/(https?:\/\/[^\s]+)/g);
        var urls = node.content.match(urlRegex);
        if(!urls){
            return Promise.resolve();
        }

        var urlDataPromises = urls.map(url => {
            return new Promise((resolve, reject) => {
                var existingUrlWidget = node.widgets.filter(widget => { return widget.type === 'urlWidget' && widget.url === url; })[0];
                var shouldUpdateWidget = false;
                if(existingUrlWidget && (new Date()) - existingUrlWidget.lastUpdated < (60 * 1000) ){
                    shouldUpdateWidget = true;
                } else if(!existingUrlWidget){
                    shouldUpdateWidget = true;
                }

                if(shouldUpdateWidget){
                    fetch('/summarize?url=' + url)
                        .then(response => response.json())
                        .then(summary => {
                            var widgetData = {
                                matchingText: url,
                                type: 'urlWidget',
                                url: url,
                                title:  summary.title,
                                minutesToRead: summary.stats.minutes,
                                summary: summary.text,
                                lastUpdated: Date.now()
                            };
                            resolve(widgetData);
                        });
                }
            });
        });

        return Promise.all(urlDataPromises);
    },

    render: function(widgetData){
        var html =  '<a href="' + widgetData.url + '">' + widgetData.title + '</a>&nbsp;<small>' + widgetData.minutesToRead + 'min read&nbsp;|&nbsp;<a href="' + widgetData.url + '">' + widgetData.url + '</a></small>';
        html += "&nbsp;";
        return html;
    }
};

export default urlWidget;