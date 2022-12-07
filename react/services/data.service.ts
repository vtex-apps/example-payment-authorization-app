export const postData = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })

  return response
}