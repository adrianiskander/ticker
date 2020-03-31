'use strict';


const CoinsList = Vue.component('coins-list', {
  template: '#coins-list-template',
  props: ['coins']
});


const Navbar = Vue.component('navbar', {
  template: '#navbar-template',
  props: ['sortBy'],
  methods: {
    setSortBy: function(event) {
      this.$root.sortBy = event.target.selectedOptions[0].value;
    }
  }
})


let app = new Vue({

  el: '#app',

  data: {
    coins: {},
    apiLimit: 100,
    cryptoApiUrl: 'https://min-api.cryptocompare.com',    /* CryptoCompare API */
    cryptoStreamUrl: 'https://streamer.cryptocompare.com' /* CryptoCompare websocket stream */,
    sortBy: 'name'
  },

  computed: {
    coinsByName: function() {
      return Object.values(this.coins).sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    },
    coinsByVolume: function() {
      return Object.values(this.coins).sort((a, b) => {
        return a.volume < b.volume;
      });
    }
  },

  created() {
    this.requestGetCoinsByVolume()
  },

  methods: {
    getCoins: function() {
      /*
        Return coins based on selected sort method.
      */
      if (this.sortBy === 'name') { return this.coinsByName; }
      else if (this.sortBy === 'volume') { return this.coinsByVolume; }
      
      return this.coins;
    },
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
          price: coin.RAW.USD.PRICE.toFixed(2),
          volume: parseInt(coin.RAW.USD.VOLUME24HOURTO)
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
      
      /*
        Coin value goes up(1) or down(2)
      */

      if ( ! isNaN(message[13]) && ((message[4] === "1") || (message[4] === "2")) ) {

        let coin = {
          name: message[2],
          price: message[5],
          volume: parseInt(message[13])
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
