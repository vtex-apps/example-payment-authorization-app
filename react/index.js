import React, { Component } from 'react'
import styles from './index.css'

class ExampleTransactionAuthApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scriptLoaded: false,
      loading: false,
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

  respondTransaction = status => {
    $(window).trigger('transactionValidation.vtex', [status])
  }

  handleOnLoad = () => {
    this.setState({ scriptLoaded: true })
    grecaptcha.ready(() => {
      grecaptcha.render(this.divContainer.current, {
        sitekey: '------>REPATCHA_V2_SITE_KEY<------', //Replace with site key
        theme: 'dark',
        callback: this.onVerify,
      })
    })
  }

  onVerify = e => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.approvePaymentUrl).then(() => {
      this.respondTransaction(true)
    })
  }

  cancelTransaction = () => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.denyPaymentUrl).then(() => {
      this.respondTransaction(false)
    })
  }

  injectScript = (id, src, onLoad) => {
    if (document.getElementById(id)) {
      return
    }

    const head = document.getElementsByTagName('head')[0]

    const js = document.createElement('script')
    js.id = id
    js.src = src
    js.async = true
    js.defer = true
    js.onload = onLoad

    head.appendChild(js)
  }

  render() {
    const { scriptLoaded, loading } = this.state

    return (
      <div className={styles.wrapper}>
        {scriptLoaded && !loading ? (
          <div className="g-recaptcha" ref={this.divContainer}></div>
        ) : (
          <h2>Loading...</h2>
        )}

        {!loading && (
          <button
            onClick={this.cancelTransaction}
            className={styles.buttonDanger}>
            Cancelar
          </button>
        )}
      </div>
    )
  }
}

export default ExampleTransactionAuthApp
