const URL_GET_TOKEN_VISA = 'https://apitestenv.vnforapps.com/api.security/v1/security'
const URL_GET_SESSION_VISA = 'https://apitestenv.vnforapps.com/api.ecommerce/v2/ecommerce/token/session/'
const URL_TRANSACTION_VISA = 'https://apitestenv.vnforapps.com/api.authorization/v3/authorization/ecommerce/'
const AUTH_BASE64 = '' //aquí va el authorization proporcionado por niubiz

export const getTokenVisa = async () => {
  let salidaJson = {
    error: false,
    mensajeError: null,
    res: {}
  }
  try {
    const response = await fetch(URL_GET_TOKEN_VISA, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${AUTH_BASE64}`
      }
    })

    if (response.ok) {
      const res = await response.text()
      salidaJson.error = false
      salidaJson.res = res
    } else {
      salidaJson.error = true
      salidaJson.res = response
    }
  } catch (error) {
    console.error(error)
  }

  return salidaJson
}

export const getTokenSessionVisa = async (idMercado, tokenVisa, monto) => {
  let salidaJson = {
    error: false,
    mensajeError: null,
    res: {}
  }

  try {
    const response = await fetch(URL_GET_SESSION_VISA + idMercado, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokenVisa
      },
      body: JSON.stringify(
        {
          amount: monto,
          antifraud: {
            clientIp: '192.168.1.3',
            merchantDefineData: {
              'MDD{Nºx}': '5',
              'MDD{Nºx+1}': '6',
              'MDD{Nºx+2}': '7'
            }
          },
          channel: 'web',
          recurrenceMaxAmount: monto
        }
      )
    })

    if (response.ok) {
      const res = await response.json()
      salidaJson.error = false
      salidaJson.res = res
    } else {
      salidaJson.error = true
      salidaJson.res = response
    }
  } catch (error) {
    console.error(error)
  }

  return salidaJson
}

export const sendTransaction = async (idMercado, token, json) => {
  let salidaJson = {
    error: false,
    mensajeError: null,
    res: {}
  }

  try {
    const response = await fetch(URL_TRANSACTION_VISA + idMercado, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(json)
    })

    if (response.ok) {
      const res = await response.json()
      salidaJson.error = false
      salidaJson.res = res
    } else {
      salidaJson.error = true
      salidaJson.res = response
    }
  } catch (error) {
    console.error(error)
  }

  return salidaJson
}

export const sendTransactionRecurrent = async (idMercado, token, json) => {
  let salidaJson = {
    error: false,
    mensajeError: null,
    res: {}
  }

  try {
    const response = await fetch(URL_TRANSACTION_VISA + idMercado, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(json)
    })

    if (response.ok) {
      const res = await response.json()
      salidaJson.error = false
      salidaJson.res = res
    } else {
      salidaJson.error = true
      salidaJson.res = response
    }
  } catch (error) {
    console.error(error)
  }

  return salidaJson
}
