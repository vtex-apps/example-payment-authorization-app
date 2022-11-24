import React, { Component, Fragment } from 'react'
import styles from './index.css'

interface InjectScriptProps {
  id: string
  src: string
  onLoad: (this: GlobalEventHandlers, ev: Event) => void
}

type Props = {
  appPayload: string
  isIframe: boolean
}

type State = {
  scriptLoaded: boolean
  loading: boolean
}

class ExampleTransactionAuthApp extends Component<Props, State> {
  divContainer: React.RefObject<HTMLDivElement>

  constructor(props: Props) {
    super(props)
    this.state = {
      scriptLoaded: false,
      loading: false,
    }

    this.divContainer = React.createRef()
  }

  componentWillMount = () => {
    if (!('$' in window)) {
      this.injectScript({
        id: 'jquery',
        src: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
        onLoad: this.injectRecaptchaApi
      })
    } else {
      this.injectRecaptchaApi
    }
  }
  
  injectRecaptchaApi = () => {
    this.injectScript({
      id: 'google-recaptcha-v2',
      src: 'https://recaptcha.net/recaptcha/api.js?render=explicit',
      onLoad: this.handleOnLoad
    })
  }

  componentDidMount() {
    // In case you want to remove payment loading in order to show an UI.
    if (!this.props.isIframe) {
      window.$(window).trigger('removePaymentLoading.vtex')
    }
  }

  handleOnLoad = () => {
    this.setState({ scriptLoaded: true })
    grecaptcha.ready(() => {
      if (this.divContainer.current) {
        grecaptcha.render(this.divContainer.current, {
          sitekey: '------>REPATCHA_V2_SITE_KEY<------', //Replace with site key
          theme: 'dark',
          callback: this.onVerify,
        })
      }
    })
  }

  onVerify = () => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.approvePaymentUrl, {method: 'POST'}).finally(() => {
      this.finishValidation(true)
    })
  }

  cancelTransaction = () => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })

    fetch(parsedPayload.denyPaymentUrl, {method: 'POST'}).finally(() => {
      this.finishValidation(false)
    })
  }

  confirmTransation = () => {
    const parsedPayload = JSON.parse(this.props.appPayload)
    this.setState({ loading: true })
    
    fetch(parsedPayload.approvePaymentUrl, {method: 'POST'}).finally(() => {
      this.finishValidation(true)
    })
  }

  finishValidation = (status: boolean) => {
    if (this.props.isIframe) {
      const close: HTMLElement = window.parent.document.getElementsByClassName("vtex-modal__close-icon")[0] as HTMLElement
      close.click()
      return
    }

    window.$(window).trigger('transactionValidation.vtex', [status])
  }

  injectScript = ({ id, src, onLoad }: InjectScriptProps) => {
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
          <Fragment>
            <div className="g-recaptcha" ref={this.divContainer}></div>
            <button
              id="payment-app-confirm"
              className={styles.buttonSuccess}
              onClick={this.confirmTransation}>
              Confirmar
            </button>
          </Fragment>
        ) : (
          <h2>Carregando...</h2>
        )}

        {!loading && (
          <button
            id="payment-app-cancel"
            className={styles.buttonDanger}
            onClick={this.cancelTransaction}>
            Cancelar
          </button>
        )}
      </div>
    )
  }
}

export default ExampleTransactionAuthApp
