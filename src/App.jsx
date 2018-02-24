import React from 'react'


import Navbar from './components/Navbar'
import Ticker from './components/Ticker'


class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <Ticker />
      </div>
    )
  }
}


export default App;
