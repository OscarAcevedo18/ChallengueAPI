let inputAmount= document.querySelector("#inputAmount");
let selectTypeMoney= document.querySelector ("#selectTypeMoney");
let btn= document.querySelector ("#btn");
let dataArray = []                          //////*****Guarda el array que se obtiene del servidor**********///////////////
let myChart = null
let lastchange = 0;

///////////////**********Se crea funcion para conectar con el servidor*******/////////////////

async function ConectionServer() {
  try {
    currency = selectTypeMoney.value;
    const res = await fetch(`https://mindicador.cl/api/${currency}`)
    const data = await res.json()
    console.log(res.status);

    lastchange = (data.serie[0].valor);

    calculo();
    
    ///////////////**********Aca es donde guardo el array original en la variable dataArray*******/////////////////
    dataArray = data.serie.slice(0, 10);
    console.log(dataArray)

    /////////////**********Aca creo una nueva variable para que tome las fechas Label*******/////////////////
    const datChange = dataArray.map((x) => x.valor)

    //////////////**********Aca creo una nueva variable para que tome las fechas Label con map*******/////////////////
    const datLabel = dataArray.map((x) =>
        `${x.fecha.substring(8, 10)}-${x.fecha.substring(
          5,
          7
        )}-${x.fecha.substring(0, 4)}`
    )

    ////////////**********Aca envio los datos al grafico*******/////////////////
    chartRender(datLabel, datChange)
    document.querySelector("#error").innerHTML = 'Mensaje del Servidor: conexión realizada'
  } catch (e) {
    document.querySelector("#error").innerHTML = 'Mensaje del Servidor: No se pudo establecer la conexión'
    document.querySelector("#resultado").innerHTML= "....";
  }
}

// ------------------------------------------------------------------------------------------
// se almacena función para otro desafio
function dateToday(ultimafecha) {
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');              //////////////********** `getDate()` devuelve el día del mes (del 1 al 31)*******/////////////////
    var month = String(today.getMonth() + 1).padStart(2, '0');      //////////////********** `getMonth()` devuelve el mes (de 0 a 11)*******/////////////////
    var year = today.getFullYear();                                //////////////********** `getFullYear()` devuelve el año completo*******/////////////////
    let oscrfecha = (`${day}-${month}-${year}`);
    // console.log(fecha.substring(0, 4))
    // console.log(day);
    return oscrfecha;
    }

dateToday()

////////////**********Acá se muestra el grafico*******/////////////////
function chartRender(datLabel, datChange) {
  
  const ctx = document.getElementById('myChart').getContext('2d')
  if (myChart != null) {
    myChart.destroy()
  }
  myChart = new Chart(ctx, {
    type: 'line',

    data: {
      labels: datLabel.reverse(),
      datasets: [
        {
          label: `Valor: ${currency.toUpperCase()}`,
          data: datChange.reverse(),
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: false,
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          beginAtZero: true,
        },
      },
    },
  })
}

//////////////**********En esta función se calcula el input junto al select*******/////////////////

function calculo () {
  let resultado = Number((inputAmount.value / lastchange).toFixed(2));

  document.querySelector("#resultado").innerHTML= "Resultado  :  " + resultado;
}

btn.addEventListener("click", () =>{
  if (inputAmount.value=="") {
    alert("Debe ingresar un valor")
    return
  }

  if (isNaN(inputAmount.value)) {
    alert('Solo puedes ingresar valores numéricos en la cantidad aconvertir')
    return
  }

  ConectionServer()
})