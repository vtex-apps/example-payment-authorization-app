# Payment Authentication App Example

## Description

The Payment Authentication app is an app that creates a step verification to the checkout process allowing or rejecting an order placement. This repository provides an example on how to accomplish it.

## Table of Contents

- [Usage](#usage)
- [Responding to checkout](#responding-to-checkout)
- [Checkout Payload](#checkout-payload)
- [Injecting external script](#injecting-external-script)

## Usage

To get started you should edit the `manifest.json` file to properly select the app name, for this example: `example-payment-auth-app`. You should also input the correct initial version and, if applicable, change the vendor name.

Create a new workspace and link this app to your store and workspace. Go on to `{{your-account}}.vtexcommercestable.com.br/checkout?workspace={{your-workspace}}`. If you follow through the checkout process, you should now see your app running after order confirmation.

**PROTIP:** _vtexcommercestable_ does not support workspace, so you might need to export your cart to run some tests. To do that, you may go `{{your-workspace}}--{{your-store}}.myvtex.com`, add products to cart, go to cart, then open your browser DevTools and run:

```js
vtexjs.checkout.orderFormId
```

You should get the orderFormId and then you may inject that in _vtexcommercestable_ using:
`{{your-account}}.vtexcommercestable.com/checkout?workspace={{your-workspace}}&orderFormId={{your-orderFormId}}`

## Responding to checkout

The checkout API expects a response from the app through the `transactionValidation.vtex` event, therefore an approach for responding is:

```js
$(window).trigger('transactionValidation.vtex', [status])
```

Where `status` is a boolean and resolves(`status == true`) or rejects (`status == false`) order placement.

Please refer to the [response method implementation](https://github.com/vtex-apps/example-payment-authorization-app/blob/master/react/index.js#L28) in this repo for an example on expected response trigger.

Another event Checkout can receive is `removePaymentLoading.vtex` which tells it to remove the finishing transaction loading screen, in case your payment application has UI in which the user has to interact, since the payment application intercepts the finishing transaction process.

```js
$(window).trigger('removePaymentLoading.vtex')
```

## Checkout Payload

Checkout should give you a payload via `props` to better be able to handle the order, to access that you just do:

```
const { appPayload } = this.props
```

## Injecting external script

In order to be able to run external scripts on your transaction app, you need to inject that script on the head of the checkout html. To do so, you have to do a DOM injection, for that you should do:

```
const head = document.getElementsByTagName('head')[0]

const js = document.createElement('script')
js.id = {{script-id}}
js.src = {{script-src}}
js.async = true;
js.defer = true;
js.onload = {{callback-onload}}

head.appendChild(js)
```

There is an example for the script injection [here](https://github.com/vtex-apps/example-payment-authorization-app/blob/master/react/index.js#L70)

Do keep in mind that if the external js script handles DOM manipulation, then you should use React's [`ref`](https://reactjs.org/docs/refs-and-the-dom.html) to create a div container and hand it over to the library. There's also an [example](https://github.com/vtex-apps/example-payment-authorization-app/blob/master/react/index.js#L12) for doing so in this repo.
