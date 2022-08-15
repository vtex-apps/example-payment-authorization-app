declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

interface Window {
  vtexjs: VTEXJS
  $: any // JQuery types
}