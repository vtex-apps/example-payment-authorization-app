import React, { Component } from 'react'
import styles from './index.css'

class YesNoApp extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      scriptLoaded: false
    }

    this.divContainer = React.createRef()
  }

  componentWillMount = () => {
    this.injectScript(
      'google-recaptcha-v2', 
      'https://recaptcha.net/recaptcha/api.js?render=explicit', 
      this.handleOnLoad
    )
  }

  respondTransaction = (status) => {
    $(window).trigger('transactionValidation.vtex', [status])
  }

  handleOnLoad = () => {
    this.setState({scriptLoaded: true});
    grecaptcha.ready(() => {
      grecaptcha.render(this.divContainer.current, {
        'sitekey': '6LeELrAUAAAAAJPKPpnuV-kf4mG8MlHHs6BPEyUj',
        'theme': 'dark',
        'callback': this.onVerify
      });
    }) 
  };

  onVerify = (e) => {
    this.respondTransaction(true)
  }
  
  injectScript = (id, src, onLoad) => {
    if (document.getElementById(id)) {
      return
    }

    const head = document.getElementsByTagName('head')[0]

    const js = document.createElement('script')
    js.id = id
    js.src = src
    js.async = true;
    js.defer = true;
    js.onload = onLoad

    head.appendChild(js)
  }

  render() {
    const { payload } = this.props

    return (
      <div className={styles.yesNoWrapper}>
        <p>
          {JSON.stringify(payload)}
        </p>
        {
          this.state.scriptLoaded ? 
            <div 
            className="g-recaptcha"
            ref={this.divContainer}
            ></div> 
            : 
            <h1>
              Not cool :(
            </h1>
        }

        <button
          onClick={() => {this.respondTransaction(false)}}
          className={styles.buttonDanger}
        >
            Cancelar
        </button>
      </div>
    )
  }
}

export default YesNoApp
