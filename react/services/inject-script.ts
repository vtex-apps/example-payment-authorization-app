interface InjectScriptProps {
  id: string
  src: string
  onLoad?: (this: GlobalEventHandlers, ev: Event) => void
}
  
export const injectScript = ({ id, src, onLoad }: InjectScriptProps) => {
  if (document.getElementById(id)) {
    return
  }

  const head = document.getElementsByTagName('head')[0]
  const js = document.createElement('script')

  js.id = id
  js.src = src
  js.async = true
  js.defer = true
  if (onLoad) {
    js.onload = onLoad
  }

  head.appendChild(js)
}