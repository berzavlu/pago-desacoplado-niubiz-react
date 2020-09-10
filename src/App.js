import React, { useEffect, useState } from 'react'
import { getTokenVisa, getTokenSessionVisa, sendTransaction, sendTransactionRecurrent } from './services'
import logoNiubiz from './niubiz.png'
import './App.css'

const MERCHANT_ID = 123456789 //Se necesita un id de comercio proporcionado por niubiz
const AMOUNT = 10.0
const PUCHASE_NUMBER = 900

var elementStyles = {
    base: {
        color: '#666666',
        fontWeight: 400,
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        placeholder: {
            color: '#999999'
        },
        autofill: {
            color: '#e39f48'
        }
    },
    invalid: {
        color: '#E25950',
        '::placeholder': {
            color: '#FFCCA5'
        }
    }
};


function App() {
    const [token, setToken] = useState('')
    const [session, setSession] = useState('')
    const [activePayment, setActivePayment] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [successPayment, setSuccessPayment] = useState(false)

    const createForm = () => {
        window.cardNumber = window.payform.createElement('card-number', {
            style: elementStyles,
            placeholder: 'Número de Tarjeta'
        }, 'txtNumeroTarjeta');
        window.cardExpiry = window.payform.createElement('card-expiry', {
            style: elementStyles,
            placeholder: 'MM/AA'
        }, 'txtFechaVencimiento');
        window.cardCvv = window.payform.createElement('card-cvc', {
            style: elementStyles,
            placeholder: 'CVV'
        }, 'txtCvv');
        setShowForm(true)
    }

    const setConfigurationScriptLoaded = () => {
        var configuration = {
            sessionkey: session,
            channel: "web",
            merchantid: MERCHANT_ID,
            purchasenumber: `${PUCHASE_NUMBER}`,
            amount: AMOUNT,
            language: "es", // esto falta en su documentación de nibubiz
            merchantConfiguration: {
              recurrencyEnabled: false,
              tokenizationEnabled: false,
            },
            font: "https://fonts.googleapis.com/css?family=Montserrat:400&display=swap"
        };
        window.configuration = configuration
        window.payform.setConfiguration(configuration)
        createForm()
    }

    const addCustomPayScript = () => {
        return new Promise((resolve) => {
            if (window.payform) {
                setShowForm(true)
                resolve()
            } else {
                const script = document.createElement('script')
                script.src = 'https://pocpaymentserve.s3.amazonaws.com/payform.min.js'
                script.async = true
                script.onload = () => setConfigurationScriptLoaded()
                document.head.appendChild(script)
                resolve()
            }

        })
    }

    const importFiles = async () => {
        try {
            await addCustomPayScript()
        } catch (error) {
            alert('error')
            console.log('Error al cargar el script de pago', error)
        }
    }


    useEffect(() => {
        if (activePayment) {
            importFiles()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePayment])

    const getTokenNiubizSecurity = async () => {
        try {
            const resToken = await getTokenVisa()
            if (resToken.error) {
                alert('error')
                return
            }
            setToken(resToken.res)
        } catch (error) {
            alert('error')
            console.log('Ocurrió un error al obtener el token', error)
        }
    }

    const getTokenNiubizSesion = async () => {
        try {
            const resToken = await getTokenSessionVisa(MERCHANT_ID, token, AMOUNT)
            if (resToken.error) {
                alert('error')
                return
            }
            setSession(resToken.res.sessionKey)
            setActivePayment(true)
        } catch (error) {
            alert('error')
            console.log('Ocurrió un error al obtener el token de sesión', error)
        }
    }

    const doTransaction = async (MERCHANT_ID, token, obj) => {
      try {
        await sendTransaction(MERCHANT_ID, token, obj)
        setSuccessPayment(true)
        setLoading(false)
        setShowForm(false)
      } catch (error) {
        alert('error')
        console.log('Ocurrió un error al realizar la transacción', error)
      }
    }

    const payVisa = () => {
      setLoading(true)
      var data = {
        name: "Nombres",
        lastName: "Apellidos",
        email: "micorreo@mail.com",
        phoneNumber: "1234567",
        currencyConversion: false,
        recurrence: false,
        alias: 'mialias'
      }
       window.payform.createToken(
        [window.cardNumber,window.cardExpiry,window.cardCvv],
        data
       )
       .then(function(res){
        //Tu código aquí}
        const obj = {
          "antifraud":null,
          "captureType":"manual",
          "cardHolder":{
            "documentNumber": "77232373",
            "documentType": "0"
          },
          "channel":"web",
          "countable": true,
          "order":{
          "amount": AMOUNT,
          "currency": "PEN",
          "productId": "321",
          "purchaseNumber": `${PUCHASE_NUMBER}`,
          "tokenId": res.transactionToken,
          "originalAmount": AMOUNT
          },
         "sponsored":null
        }

          doTransaction(MERCHANT_ID, token, obj)
       })
       .catch((error) => {
           alert('error')
           console.log('Ocurrió un error', error)
       });

    }

    const resetPayment = () => {
        setToken('')
        setSession('')
        setActivePayment(false)
        setShowForm(false)
    }

    const onPayRecurrency = async () => {
      const json = {
        "antifraud":null,
        "captureType":"manual",
        "channel":"recurrent",
        "countable": true,
        "order":{
          "amount": 100,
          "currency": "PEN",
          "purchaseNumber": PUCHASE_NUMBER,
        },
        "card":{
          "tokenId": 7000010038732941,
        },
        "cardHolder":{
          "email": "berzavlu@gmail.com",
        },
      }
      try {
        const restoken = await await getTokenVisa()
        console.log(restoken.res)
        const res = await sendTransactionRecurrent(MERCHANT_ID, restoken.res, json)
        console.log(res)
      } catch (error) {
        alert('error')
        console.log('Ocurrió un error al realizar la transacción', error)
      }
    }

    // 4919 – 1481 – 0785 – 9067
    return (<div className="App">
        <p>
            <strong>Paso 1: Crear token de seguridad</strong>
        </p>
        <button onClick={getTokenNiubizSecurity}>Obtener Token de seguridad</button>
        {
        token !== '' && <p>{token}</p>
    }
        <p>
            <strong>Paso 2: Crear sesión de comunicación</strong>
        </p>
        <button onClick={getTokenNiubizSesion}>Obtener Token de sesión</button>
        {
          session !== '' && <div> {session}</div>
        }
        <hr />
        <p>
            <strong>Pago recurrente</strong>
        </p>
        <button onClick={onPayRecurrency}>cobrar recurrencia</button>

        {successPayment && (
          <h1>
              <strong>Pago correcto :)</strong>
          </h1>
        )}
        <div style={{ display: showForm ? 'block' : 'none' }}>
            <div className='w3-modal show-modal-beneficiaries'>
                <div className='w3-modal-content contentWidth'>
                    <div className='w3-header'>
                    </div>
                    <div className='w3-container'>
                        <div className='formPayment' style={{ overflow: 'hidden' }}>
                            <div className='formPayment__row bordered-input'>
                                  <div id="txtNumeroTarjeta" className="form-control"></div>
                            </div>
                            <div className='formPayment__row' style={{ justifyContent: 'space-between' }}>
                                <div className='formPayment__col formPayment__col--left bordered-input' style={{width: '157px'}}>
                                  <div id="txtFechaVencimiento" className="form-control"></div>
                                </div>
                                <div className='formPayment__col formPayment__col--right bordered-input' style={{width: '100px'}}>
                                  <div id="txtCvv" className="form-control"></div>
                                </div>
                            </div>
                            {loading ? (
                              <button className='formPayment--btn'>Cargando...</button>
                            ) : (
                              <button className='formPayment--btn' onClick={payVisa}>Pagar {AMOUNT}</button>
                            )}
                            <div className='formPayment--niubiz'>
                                <img src={logoNiubiz} alt='' />
                            </div>
                        </div>
                        <div className='w3areabtn'>
                            <button className='btn-pago-cancel' onClick={resetPayment}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default App;
