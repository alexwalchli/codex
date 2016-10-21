// TODO: embedded stock tickers
// var stockTickerWidget = {
//   parse: function (node) {
//     var tickers = node.content.split(' ').filter(word => word.startsWith('$'))
//     if (!tickers || !tickers.length) {
//       return Promise.resolve()
//     }

//     var tickerDataPromises = tickers.map(ticker => {
//       return new Promise((resolve, reject) => {
//         var existingTickerWidget = node.widgets.filter(widget => { return widget.type === 'stockTickerWidget' && widget.ticker === ticker })[0]
//         var shouldUpdateWidget = false
//         if (existingTickerWidget && (new Date()) - existingTickerWidget.lastUpdated < (60 * 1000)) {
//           shouldUpdateWidget = true
//         } else if (!existingTickerWidget) {
//           shouldUpdateWidget = true
//         }

//         if (shouldUpdateWidget) {
//           fetch('/stockprice?ticker=' + ticker.replace('$', ''))
//                         .then(response => response.json())
//                         .then(data => {
//                           var widgetData = {
//                             matchingText: ticker,
//                             type: 'stockTickerWidget',
//                             title: ticker,
//                             dailyGainLoss: data.c,
//                             currentPrice: data.l,
//                             lastUpdated: Date.now()
//                           }
//                           resolve(widgetData)
//                         })
//         }
//       })
//     })

//     return Promise.all(tickerDataPromises)
//   },

//   render: function (widgetData) {
//     var html = '<a href="' + widgetData.url + '">' + widgetData.title + '</a>&nbsp;<small>' + widgetData.minutesToRead + 'min read&nbsp;|&nbsp;<a href="' + widgetData.url + '">' + widgetData.url + '</a></small>'
//     html += '&nbsp;'
//     return html
//   }
// }

// export default stockTickerWidget
