window.onload = function () {
  // Función que calcula la integral aproximada
  // Fórmula: (disparosEnArea / disparosTotales) * areaDelRectangulo
  function getIntegralAproximadaMontecarlo(
    disparosEnArea,
    disparosTotales,
    areaRectangulo
  ) {
    return (
      (parseFloat(disparosEnArea) / disparosTotales) *
      parseFloat(areaRectangulo)
    );
  }

  // Función para generar puntos aleatorios en un rango de minimo y máximo.
  // Resultado: puntos disparados en eje
  function generarPuntoAleatorio(min, max) {
    random = parseFloat(Math.random() * (max - min) + min).toFixed(4);

    return random;
  }

  // Función para calcular los puntos máximo y mínimo de la función
  // Fórmula: Xk = a + (k(b-a))/N*
  function calcularPuntosMaxMin(a, b, funcion) {
    let n = (b - a) * 10;

    // Generamos valores para Xk y los guardamos en un vector
    let vectorXk = new Array(n).fill(undefined).map((value, k) => {
      return parseFloat(a) + k * ((parseFloat(b) - parseFloat(a)) / n);
    });

    // Calculamos los valores f(Xk) y los guardamos en un vector
    let valores = vectorXk.map((valor) => {
      return math.evaluate(funcion, { x: valor }).toString();
    });

    // Definimos los valores MAX y MIN
    let valormax = Math.max.apply(Math, valores);
    let valormin = Math.min.apply(Math, valores);

    // Aumentamos los rangos un 10% para dibujar un rectangulo un poco aumentado
    valormax = valormax >= 0 ? 1.1 * valormax : 0;
    valormin = valormin >= 0 ? 0 : 1.1 * valormin;

    return [valormax, valormin];
  }

  // Comprobamos que existan las entradas para ejecutar la función montecarlo
  function valoresOk() {
    return (
      document.getElementById("funcion").value &&
      document.getElementById("a").value &&
      document.getElementById("b").value &&
      document.getElementById("disparos").value
    );
  }

  // Función que calcula todos los pasos y construye el grafico de la funcion y los puntos disparados.
  function montecarlo() {
    if (valoresOk) {
      // PASO 1: se leen los datos ingresados por el usuario.
      let y = document.getElementById("funcion").value;
      let a = document.getElementById("a").value;
      let b = document.getElementById("b").value;
      let disparosTotal = document.getElementById("disparos").value;

      // PASO 2: calcular los puntos máximo y mínimo de la función
      let ymax;
      let ymin;
      let maxMin = calcularPuntosMaxMin(a, b, y);
      ymax = maxMin[0];
      ymin = maxMin[1];

      // PASO 3: calcular el área del rectángulo tomando los límites de cada eje (a, b, ymin, ymax)
      let areaRectangulo =
        (parseFloat(b) - parseFloat(a)) * (parseFloat(ymax) - parseFloat(ymin));

      // PASO 4: calcular el valor aproximado de la integral definida
      // Fórmula: (( disparosEnArea / disparosTotal )*(b-a)) * (ymax - ymin)

      // Realizamos los disparos y seteamos los arrays que contienen los puntos adentro y fuera del area
      let disparosTotales = 0;
      let disparosEnArea = 0;
      let puntosEnX = [];
      let puntosEnY = [];
      let puntosFueraX = [];
      let puntosFueraY = [];
      let puntosInColor = [];
      let puntosOutColor = [];

      //Definimos un ciclo para cada disparo
      while (disparosTotales < disparosTotal) {
        let puntoX = generarPuntoAleatorio(parseFloat(a), parseFloat(b));
        let puntoY = generarPuntoAleatorio(parseFloat(ymin), parseFloat(ymax));

        let enColor = "rgba(9, 107, 5, 0.5)";
        let fueraColor = "rgba(145, 48, 35, 0.5)";

        let valorFuncionPuntoX = parseFloat(
          math.evaluate(y, { x: parseFloat(puntoX) }).toString()
        );

        if (valorFuncionPuntoX > parseFloat(puntoY) && parseFloat(puntoY) > 0) {
          // Si f(x) > y && y > 0 está en el área positiva
          disparosEnArea++;

          // Se cargan los puntos como puntos en area y se carga el color
          puntosEnX.push(puntoX);
          puntosEnY.push(puntoY);
          puntosInColor.push(enColor);
        } else if (
          valorFuncionPuntoX < parseFloat(puntoY) &&
          parseFloat(puntoY) < 0
        ) {
          // Si f(x) > y && y > 0 está en el área negativa
          disparosEnArea--;

          // Se cargan los puntos como puntos en area y se carga el color
          puntosEnX.push(puntoX);
          puntosEnY.push(puntoY);
          puntosInColor.push(enColor);
        } else {
          // Se cargan los puntos como puntos fuera de area y se carga el color
          puntosFueraX.push(puntoX);
          puntosFueraY.push(puntoY);
          puntosOutColor.push(fueraColor);
        }

        disparosTotales++;
      }

      // Obtenemos el valor de la integral aproximada para mostrarla
      let integralAproximada = getIntegralAproximadaMontecarlo(
        disparosEnArea,
        disparosTotales,
        areaRectangulo
      );
      document.getElementById("area").innerHTML = integralAproximada;

      // Límites aumentados para hacer el gráfico
      let xMinLimit = a > 0 ? a * 0.8 : a * 1.2;
      let xMaxLimit = b > 0 ? b * 1.2 : b * 0.8;
      let yMinLimit = ymin > 0 ? ymin * 0.8 : ymin * 1.2;
      let yMaxLimit = ymax > 0 ? ymax * 1.2 : ymax * 0.8;

      // Creamos los valores del gráfico
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
          },
        ],
      };

      const usuarioFuncion = math.compile(y);
      const valoresX = math.range(xMinLimit, xMaxLimit, 0.1, true).toArray();
      const valoresY = valoresX.map(function (x) {
        return usuarioFuncion.evaluate({ x: x });
      });

      var funcionLinea = {
        x: valoresX,
        y: valoresY,
        mode: "lines",
        fill: "tozeroy",
        type: "scatter",
        name: "f(x)",
      };

      var puntosEnArea = {
        x: puntosEnX,
        y: puntosEnY,
        mode: "markers",
        type: "scatter",
        name: "Puntos en área",
        marker: {
          color: puntosInColor,
          symbol: "x",
        },
      };

      var puntosFueraArea = {
        x: puntosFueraX,
        y: puntosFueraY,
        mode: "markers",
        type: "scatter",
        name: "Puntos fuera área",
        marker: {
          color: puntosOutColor,
          symbol: "x",
        },
      };

      var data = [funcionLinea, puntosEnArea, puntosFueraArea];

      Plotly.newPlot("myDiv", data, layout);
    }
  }

  // Refrescar los valores del resultado cuando el usuario vuelve a calcular
  document.getElementById("form").onsubmit = function (event) {
    event.preventDefault();
    montecarlo();
  };

  // Se calculan los valores del resultado al iniciar la aplicación
  montecarlo();
};
