import React, { Component } from 'react'

import ExampleTransactionAuthApp from '.'

class WrapperIframe extends Component<Props> {
  constructor(Props: Readonly<Props>) {
    super(Props)
    this.state = {}
  }

  public render() {
    const { query } = this.props

    return <ExampleTransactionAuthApp appPayload={query.appPayload} isIframe />
  }
}

interface Props {
  query: { appPayload: string }
}

export default WrapperIframe
