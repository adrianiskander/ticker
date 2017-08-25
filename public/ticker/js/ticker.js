vueStocks = new Vue({
  el: "#vueStocks",
  data: {
    stocks: {
      "BTC": {},
      "ZEC": {},
      "LTC": {},
      "ETH": {},
      "ETC": {},
      "XEM": {},
      "DASH": {},
      "BCH": {},
      "XMR": {},
      "XRP": {},
      "LSK": {},
      "OMG": {},
      "NEO": {},
      "NXT": {},
      "DOGE": {},
      "IOT": {}
    }
  },
  methods: {
    updateStock: function(stock) {
      this.stocks[stock["symbol"]] = stock;
      return null;
    },
  }
});


var stocks = [
    "BTC", "ZEC", "LTC", "ETH",
    "ETC", "XEM", "BCH", "DASH",
    "XMR", "XRP", "LSK", "OMG",
    "NEO", "NXT", "DOGE", "IOT"
];
var stocks = stocks.toString();
var url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="+ stocks +"&tsyms=USD";
var request = new XMLHttpRequest();
request.open("GET", url);
request.onload = function() {
    updateStocks(JSON.parse(request.response));
}
request.send(null);


function updateStocks(stocks) {
    for (key in stocks) {
        var stock = {
            "symbol": key,
            "closed": stocks[key]["USD"]
        }
        vueStocks.updateStock(stock);
    }
}


var coinIO = io.connect('https://streamer.cryptocompare.com/');
var subscriptions = [
  '5~CCCAGG~BCH~USD',
  '5~CCCAGG~BTC~USD',
  '5~CCCAGG~ZEC~USD',
  '5~CCCAGG~LTC~USD',
  '5~CCCAGG~DASH~USD',
  '5~CCCAGG~ETH~USD',
  '5~CCCAGG~ETC~USD',
  '5~CCCAGG~XMR~USD',
  '5~CCCAGG~XRP~USD',
  '5~CCCAGG~LSK~USD',
  '5~CCCAGG~OMG~USD',
  '5~CCCAGG~XEM~USD',
  '5~CCCAGG~NEO~USD',
  '5~CCCAGG~NXT~USD',
  '5~CCCAGG~DOGE~USD',
  '5~CCCAGG~IOT~USD',
];

coinIO.emit('SubAdd', {subs:subscriptions} );

coinIO.on("m", function(message){
    message = message.split("~");
    if (message[4] === "1" || message[4] === "2") {
        var stock = {
            "symbol": message[2],
            "closed": message[5]
        }
        if (message[4] === "1") {
            stock["isUp"] = true,
            stock["isDown"] = false
        } else if (message[4] === "2") {
            stock["isUp"] = false,
            stock["isDown"] = true
        }
        vueStocks.updateStock(stock);
    }
});

