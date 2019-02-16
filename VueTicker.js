let VueTicker = new Vue({
  el: '#VueTicker',
  data: {
    coins: {},
    apiLimit: 100,
    cryptoApiUrl: 'https://min-api.cryptocompare.com',    // CryptoCompare API
    cryptoStreamUrl: 'https://streamer.cryptocompare.com' // CryptoCompare websocket stream
  },
  created() {
    this.requestGetCoinsByVolume()
  },
  methods: {
    requestGetCoinsByVolume: function() {

      let request = new XMLHttpRequest

      request.open('GET', this.cryptoApiUrl +'/data/top/totalvolfull?limit='+ this.apiLimit +'&tsym=USD')
      request.send(null)
      request.onload = () => {
        this.parseApiData(JSON.parse(request.response).Data)
      }
    },
    parseApiData: function(coins) {
      /*
        Parse raw coins data for faster/easier use. 
      */
      let coinsParsed = {}

      coins.forEach(coin => {
        coin = {
          name: coin.RAW.USD.FROMSYMBOL,
          price: coin.RAW.USD.PRICE.toFixed(2)
        }
        coinsParsed[coin.name] = coin
      })

      this.coins = coinsParsed
      this.subscribeStream(Object.keys(coinsParsed))
    },
    subscribeStream: function(symbols) {
      /*
        Subscribe to websocket stream using coin symbols.
      */
      let cryptoio = io.connect(this.cryptoStreamUrl)
      let subscriptions = []

      symbols.forEach(symbol => {
        subscriptions.push('5~CCCAGG~'+ symbol +'~USD')
      })

      cryptoio.emit('SubAdd', {'subs': subscriptions})

      cryptoio.on('m', message => {
        this.handleMessage(message)
      })
    },
    handleMessage: function(message) {

      message = message.split('~')
      
      // coin value goes up(1) or down(2)
      if ((message[4] === "1") || (message[4] === "2")) {

        let coin = {
          name: message[2],
          price: message[5]
        }

        if (message[4] === "1") {
          coin.isUp = true
          coin.isDown = false
        }
        else if (message[4] === "2") {
          coin.isUp = false
          coin.isDown = true
        }

        this.updateCoin(coin)
      }
    },
    updateCoin: function(coin) {
      this.coins[coin.name] = coin
      /*
        Reset coin status after short interval to remove binded css classes.
        This will allow tick animations be reapplied and play again.
      */
      window.setTimeout(() => {
        this.coins[coin.name].isUp = false
        this.coins[coin.name].isDown = false
      }, 500)
    }
  }
})
