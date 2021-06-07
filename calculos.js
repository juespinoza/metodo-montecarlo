window.onload = function () {
  //Definimos una función para generar los puntos aleatorios que se dispararán (teniendo en cuenta los límites del rectangulo)
  function generarPuntoAleatorio(min, max) {
    random = parseFloat(Math.random() * (max - min) + min).toFixed(4);

    return random;
  }

  //Definimos el Algoritmo de Newton-Rapson
  function newtonraphson(funcion, funcionDerivada, valorInicial) {
    var tolerancia = 1e-7;
    var epsilon = 2.220446049250313e-16;
    var maxCount = 20;
    var count = 0;
    var raiz;

    while (count++ < maxCount) {
      imagenFuncionEnValorInicial = math
        .evaluate(funcion, { x: valorInicial })
        .toString();
      imagenFuncionDerivadaEnValorInicial = math
        .evaluate(funcionDerivada, { x: valorInicial })
        .toString();

      if (
        Math.abs(imagenFuncionDerivadaEnValorInicial) <=
        epsilon * Math.abs(imagenFuncionEnValorInicial)
      ) {
        console.log("Not Convergent");
        return false;
      }

      raiz =
        valorInicial -
        imagenFuncionEnValorInicial / imagenFuncionDerivadaEnValorInicial;

      if (Math.abs(raiz - valorInicial) <= tolerancia * Math.abs(raiz)) {
        return Math.round(raiz * 100.0) / 100.0;
      }

      valorInicial = raiz;
    }
    return false;
  }

  //Cálculamos Máx y Mín
  function calcularMaxMin(a, b, funcion) {
    //Definimos el valor N* de la ecuación Xk = a + (k(b-a))/N*
    let n = (b - a) * 10;
    //hallamos las Xk y las guardamos en un vector

    let vector = new Array(n).fill(undefined).map((value, k) => {
      return parseFloat(a) + k * ((parseFloat(b) - parseFloat(a)) / n);
    });
    //Con los valores XK, calculamos los valores de F(xk)
    let valores = vector.map((valor) => {
      return math.evaluate(funcion, { x: valor }).toString();
    });

    //Definimos los valores Max y Min del rectángulo
    let valormax = Math.max.apply(Math, valores);
    let valormin = Math.min.apply(Math, valores);

    if (valormax >= 0) {
      valormax = 1.1 * valormax;
    } else {
      valormax = 0;
    }
    if (valormin >= 0) {
      valormin = 0;
    } else {
      valormin = 1.1 * valormin;
    }

    return [valormax, valormin];
  }

  function valuesOk() {
    return (
      document.getElementById("funcion").value &&
      document.getElementById("a").value &&
      document.getElementById("b").value &&
      document.getElementById("disparos").value
    );
  }

  //Definimos una función para tomar los valores que ingreso el usuario y realizamos el método de Monte Carlo
  function montecarlo() {
    if (valuesOk) {
      let y = document.getElementById("funcion").value;
      let a = document.getElementById("a").value;
      let b = document.getElementById("b").value;
      let disparos = document.getElementById("disparos").value;
      let ymax;
      let ymin;
      let raices = [];
      let max = [];
      let min = [];

      //PASO 2
      // Definimos el máx y mín del rectangulo
      let maxMin = calcularMaxMin(a, b, y);
      ymax = maxMin[0];
      ymin = maxMin[1];

      //PASO 3
      //Calculamos el área del rectangulo
      let areaRectangulo =
        (parseFloat(b) - parseFloat(a)) * (parseFloat(ymax) - parseFloat(ymin));

      //PASO 4
      //Definimos los contadores de los disparos totales y los disparos en el área definida
      let disparosTotales = 0;
      let disparosEnArea = 0;

      //Definimos los arrays de puntos aleatorios
      let puntosInX = [];
      let puntosInY = [];
      let puntosOutX = [];
      let puntosOutY = [];
      let puntosInColor = [];
      let puntosOutColor = [];

      //Definimos un ciclo para cada disparo
      while (disparosTotales < disparos) {
        let puntoX = generarPuntoAleatorio(parseFloat(a), parseFloat(b));
        let puntoY = generarPuntoAleatorio(parseFloat(ymin), parseFloat(ymax));

        let inColor = "rgba(9, 107, 5, 0.5)";
        let outColor = "rgba(145, 48, 35, 0.5)";

        if (
          parseFloat(math.evaluate(y, { x: parseFloat(puntoX) }).toString()) >
            parseFloat(puntoY) &&
          parseFloat(puntoY) > 0
        ) {
          disparosEnArea++;
          puntosInX.push(puntoX);
          puntosInY.push(puntoY);
          puntosInColor.push(inColor);
        } else if (
          parseFloat(math.evaluate(y, { x: parseFloat(puntoX) }).toString()) <
            parseFloat(puntoY) &&
          parseFloat(puntoY) < 0
        ) {
          disparosEnArea--;
          puntosInX.push(puntoX);
          puntosInY.push(puntoY);
          puntosInColor.push(inColor);
        } else {
          puntosOutX.push(puntoX);
          puntosOutY.push(puntoY);
          puntosOutColor.push(outColor);
        }

        disparosTotales++;
      }

      //Realizamos una funcion para obtener el valor de la integral
      function getMonteCarlo() {
        let estimacionIntegral =
          (parseFloat(disparosEnArea) / disparosTotales) *
          parseFloat(areaRectangulo);
        return estimacionIntegral;
      }

      let xMinLimit = a > 0 ? a * 0.8 : a * 1.2;
      let xMaxLimit = b > 0 ? b * 1.2 : b * 0.8;
      let yMinLimit = ymin > 0 ? ymin * 0.8 : ymin * 1.2;
      let yMaxLimit = ymax > 0 ? ymax * 1.2 : ymax * 0.8;

      //Realizamos el gráfico de la solución
      var layout = {
        title: "Gráfico de la función mediante el Método Montecarlo",
        xaxis: {
          title: "Eje X",
          range: [xMinLimit, xMaxLimit],
          showline: true,
        },
        yaxis: {
          title: "Eje Y",
          range: [yMinLimit, yMaxLimit],
          showline: true,
        },
        shapes: [
          {
            type: "rect",
            x0: a,
            y0: ymin,
            x1: b,
            y1: ymax,
            line: {
              color: "rgba(85, 87, 85, 1)",
              width: 2,
            },
            //fillcolor: "rgba(255, 99, 71, 0.1)",
          },
        ],
      };

      const exprFuncion = math.compile(y);
      const xValuesFuncion = math
        .range(xMinLimit, xMaxLimit, 0.1, true)
        .toArray();
      const yValuesFuncion = xValuesFuncion.map(function (x) {
        return exprFuncion.evaluate({ x: x });
      });

      var funcion = {
        x: xValuesFuncion,
        y: yValuesFuncion,
        mode: "lines",
        fill: "tozeroy",
        type: "scatter",
        name: "f(x)",
      };

      var puntosEnArea = {
        x: puntosInX,
        y: puntosInY,
        mode: "markers",
        type: "scatter",
        name: "Puntos en área",
        marker: {
          color: puntosInColor,
          symbol: "x",
        },
      };

      var puntosFueraArea = {
        x: puntosOutX,
        y: puntosOutY,
        mode: "markers",
        type: "scatter",
        name: "Puntos fuera área",
        marker: {
          color: puntosOutColor,
          symbol: "x",
        },
      };

      var data = [funcion, puntosEnArea, puntosFueraArea];

      Plotly.newPlot("myDiv", data, layout);
      document.getElementById("area").innerHTML = getMonteCarlo();
    }
  }

  //Actualizamos el gráfico cada vez que el usuario presiona el botón "Calcular"
  document.getElementById("form").onsubmit = function (event) {
    event.preventDefault();
    montecarlo();
  };

  //Realizamos el Método de Montecarlo
  montecarlo();
};
