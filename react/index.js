import React, { Component } from 'react'
import styles from './index.css'

class YesNoApp extends Component {
  sayYes = () => {
    $(window).trigger('transactionValidation.vtex', [true])
  }

  sayNo = () => {
    $(window).trigger('transactionValidation.vtex', [false])
  }

  render() {
    const { payload } = this.props

    console.log('payload', payload)

    return (
      <div className={styles.yesNoWrapper}>
        <button onClick={this.sayYes}>Yes</button>
        <button onClick={this.sayNo}>No</button>
      </div>
    )
  }
}

export default YesNoApp
