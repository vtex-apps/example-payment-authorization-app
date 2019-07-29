import React, { Component } from 'react'
import styles from './index.css'

class YesNoApp extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      scriptLoaded: false
    }

    this.callback.bind(this)
  }

  componentWillMount = () => {
    this.injectScript()
  }

  sayYes = () => {
    $(window).trigger('transactionValidation.vtex', [true])
  }

  sayNo = () => {
    $(window).trigger('transactionValidation.vtex', [false])
  }

  handleOnLoad = () => {
    console.log("alo");
    this.setState({scriptLoaded: true});
  };


  injectScript = () => {
    if (document.getElementById('google-recaptcha-v2')) {
      return
    }

    const head = document.getElementsByTagName('head')[0]

    const js = document.createElement('script')
    js.id = 'google-recaptcha-v2'
    js.src = 'https://www.google.com/recaptcha/api.js'
    js.onload = this.handleOnLoad

    head.appendChild(js)
  }
  
  callback = (e) => { 
    e.preventDefault();
    console.log(e)
  }

  render() {
    const { payload } = this.props

    console.log('payload', payload)

    return (
      <div className={styles.yesNoWrapper}>
        {
          this.state.scriptLoaded ? 
            <div 
            className="g-recaptcha"
            callback='callback'
            data-sitekey="6LeELrAUAAAAAJPKPpnuV-kf4mG8MlHHs6BPEyUj"
            ></div> 
            : 
        <h1>Deu ruim :(</h1>}
      </div>
    )
  }
}

export default YesNoApp
