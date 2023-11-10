function cargarXML() {
  const archivo = document.getElementById("archivoXML").files[0];
  //console.log(archivo.name)
  var lector = new FileReader();
  lector.onload = function(e) {
    procesarXML(e.target.result);
  };
  lector.readAsText(archivo);
}

function procesarXML(xml) {
  const archivo = document.getElementById("archivoXML").files[0];
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(xml, "text/xml");
  //console.log(xmlDoc)
  var comprobante = xmlDoc.getElementsByTagName("cfdi:Comprobante")[0];
  var emisor = comprobante.getElementsByTagName("cfdi:Emisor")[0];
  var subtotal = comprobante.getAttribute("SubTotal");
  //console.log(subtotal)
  var sub= parseFloat(subtotal);
  //console.log(sub)
  const descuentoNode = comprobante.getAttribute("Descuento");
  const descuento = descuentoNode ? parseFloat(descuentoNode) : 0;
  console.log(descuento)
  // Calcular total aplicando descuento
  
  //var traslados = comprobante.getElementsByTagName("cfdi:Traslado");
  //var trasladoImporte = traslados[0].getAttribute("Importe");
  //var tasaOCuota = traslados[0].getAttribute("TasaOCuota");
  var nombreEmisor = emisor.getAttribute("Nombre");
  //console.log(nombreEmisor)
  var tipo = comprobante.getAttribute("TipoDeComprobante");
   if (tipo=="P") {
      console.log("Pago")
      tipo="Pago"
   } else {
      if (tipo=="I") {
        console.log("ingreso")
        tipo="Ingreso"
      } else {
        if (tipo=="E") {
          console.log("egreso")
          tipo="Egreso"
        } else {
            tipo="quiensabe";
        }
      }
   }
  var totalF = comprobante.getAttribute("Total");
  var fecha = comprobante.getAttribute("Fecha");
  var folio = comprobante.getAttribute("Folio");
  
  //console.log(totalF)
  //console.log(tipo)

  if (descuento>0){
    var total = sub - descuento;
    var datos = [archivo.name,fecha, nombreEmisor, folio, total, totalF, tipo];
    //console.log("da",descuento, sub)
  }else{
  var datos = [archivo.name, fecha, nombreEmisor, folio, subtotal, totalF, tipo]; //,trasladoImporte, tasaOCuota
  }
  agregarDatosTabla(datos);
  const impuestos = xmlDoc.getElementsByTagName("cfdi:Traslado");

  const totales = {};

  for (let i = 0; i < impuestos.length; i++) {
    const impuesto = impuestos[i];
    const tasaocuota = impuesto.getAttribute("TasaOCuota");
    const importe = parseFloat(impuesto.getAttribute("Importe"));

    if (totales[tasaocuota]) {
      totales[tasaocuota] += importe;
    } else {
      totales[tasaocuota] = importe;
    }
  }

  const tabla = document.createElement("table");
  tabla.classList.add("table");
  const encabezado = tabla.insertRow();
  encabezado.classList.add("encabezado")
  encabezado.insertCell().textContent = "TasaOCuota";
  encabezado.insertCell().textContent = "Importe Total";

 

  for (const tasaocuota in totales) {
    const fila = tabla.insertRow();
    
    fila.insertCell().textContent = tasaocuota;
    fila.insertCell().textContent = totales[tasaocuota]/2;
  }

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";
  resultado.appendChild(tabla);


}

function agregarDatosTabla(datos) {
  var tabla = document.getElementById("tablaDatos").getElementsByTagName('tbody')[0];
  var nuevaFila = tabla.insertRow(-1);
  for (var i = 0; i < datos.length; i++) {
    var nuevaCelda = nuevaFila.insertCell(i);
    nuevaCelda.innerHTML = datos[i];
  }
  //sumarImportesTasaOCuota(datos[4], datos[5]);
}


