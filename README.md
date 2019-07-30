# Transaction App Example


## Description


The transaction app is an app that creates a step verification to the checkout process allowing or rejecting an order placement. This repository provides an example on how to accomplish it.


## Usage


To get started you should edit the `manifest.json` file to properly select the app name, for this example: `paym-step-app`. You should also input the correct initial version and, if applicable, change the vendor name.  
  
Create a new workspace and link this app to your store and workspace. Go on to `{{your-account}}.vtexcommercestable.com/checkout?workspace={{your-workspace}}`, open the browser dev tools then run:  


```
window.transactionAppName = '{{your-app-name}}'
```
 
If you follow through the checkout process, you should now see your app running after order confirmation. 

**PROTIP:** *vtexcommercestable* does not support workspace, so you might need to export your cart to run some tests. To do that, you may go `{{your-workspace}}--{{your-store}}.myvtex.com`, add products to cart, go to cart, then open your browser DevTools and run:
```
vtexjs.checkout.orderFormId
```
You should get the orderFormId and then you may inject that in *vtexcommercestable* using:  
`{{your-account}}.vtexcommercestable.com/checkout?workspace={{your-workspace}}&orderFormId={{your-orderFormId}}`

## Responding to checkout


The checkout API expects a response from the app through the `transactionValidation.vtex` event, therefore an approach for responding is:


```
$(window).trigger('transactionValidation.vtex', [status])
```


Where `status` is a boolean and  resolves(`status == true`) or rejects (`status == false`) order placement. 


Please refer to the [response method implementation](https://github.com/vtex-apps/transaction-app-example/blob/3e5742c87a2771998009cff4fecacb092bb3362b/react/index.js#L22) in this repo for an example on expected response trigger. 

## Checkout Payload

Checkout should give you a payload via `props` to better be able to handle the order, to access that you just do:

```
const { payload } = this.props
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

There is an example for the script injection [here](https://github.com/vtex-apps/transaction-app-example/blob/3e5742c87a2771998009cff4fecacb092bb3362b/react/index.js#L41) 

Do keep in mind that if the external js src in use handles DOM manipulation, then you should use React's [`ref`](https://reactjs.org/docs/refs-and-the-dom.html) to create a div container and handing it over to the library. There's also an [example](https://github.com/vtex-apps/transaction-app-example/blob/3e5742c87a2771998009cff4fecacb092bb3362b/react/index.js#L11) for doing so in this repo.  
