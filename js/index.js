//Variables de lectura de ficheros.
var conocimiento = "lib/patrones.xml";
var palabrasMalSonantes = "lib/palabrejas.xml"
var informacionFacultades = "lib/facultades.xml"

//Variables de palabras reservadas
var facultades = [];
var secciones = [];
var grados = [];

//Inicializamos las palabras reservadas:
cargarPalabrasReservadas();

//Principal para conversar.
function conversar(){
  pregunta = document.getElementById("pregunta_usuario").value;
  
  respuesta = reconocerPatron(pregunta);
  
  crearRespuestaHtml(pregunta, respuesta);
}

//Carga el documento XML.
function cargarXMLDoc(filename){
  if (window.XMLHttpRequest){
    xhttp=new XMLHttpRequest();
  }
  else{
    xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xhttp.open("GET",filename,false);
  xhttp.send();
  return xhttp.responseXML;
}

//Lee el documento XML y lo guarda en una variable.
function leerXML(fichero){
  return cargarXMLDoc(fichero);
}

//Cargará las palabras reservadas y las guardará en los arrays correspondientes.
function cargarPalabrasReservadas(){
  var xml = leerXML(informacionFacultades);
  var etiquetasDeFacultades = xml.getElementsByTagName("facultad");
  var etiquetasDeSecciones = xml.getElementsByTagName("seccion");
  var etiquetasDeGrados = xml.getElementsByTagName("carrera");

  for(var i=0; i< etiquetasDeFacultades.length; i++){
    facultades.push(etiquetasDeFacultades[i].getAttribute("name"));
    //console.log(facultades[i]);
  }

  for(var i=0; i< etiquetasDeSecciones.length; i++){
    secciones.push(etiquetasDeSecciones[i].getAttribute("name"));
    //console.log(secciones[i]);
  }

  for(var i=0; i< etiquetasDeGrados.length; i++){
    grados.push(etiquetasDeGrados[i].textContent);
    //console.log(grados[i]);
  }

}

//Reconoce los patrones del texto y devuelve una respuesta.
function reconocerPatron(pregunta){
  var xml = leerXML(conocimiento);
  var texto;
  var regexp;
  var frase;
  var recogido = 0;
  var infoMineria;
  
  texto = reconocimientoMalasPalabras(pregunta);

  if(!texto){
    infoMineria = getInfoMineria(pregunta);
    //console.log(infoMineria);
    //MINERIAAAAA!
    //Si encuentra algo, habrá que actualizar la variable texto!!
  }
  
  if(!texto){
    for(i = 0; i < xml.getElementsByTagName('pattern').length; i++){
      frase = xml.getElementsByTagName('pattern')[i].childNodes[0].nodeValue;
      regexp = new RegExp(",?\\s");
    
      palabras_pregunta = pregunta.split(regexp);
    
      palabras_patron = frase.split(regexp);
    
      regexp = new RegExp(palabras_patron[0], "gi");

      for(j = 0; j < palabras_pregunta.length; j++){
        if(palabras_pregunta[j].match(regexp)){
      texto = xml.getElementsByTagName('template')[i].childNodes[0].nodeValue;
      recogido = 1;
      break;
        }
      }
      if(recogido)
        break;
    }
  }
  return texto;
}

function reconocimientoMalasPalabras(pregunta){
  var xml = leerXML(palabrasMalSonantes);
  var palabrota;
  var regexp;
  var texto;
  recogido = 0;
  
  for(i = 0; i < xml.getElementsByTagName('pattern').length; i++){
    palabrota = xml.getElementsByTagName('pattern')[i].childNodes[0].nodeValue;
    regexp = new RegExp(",?\\s");
    
  //console.log("palabrota" + i + ": " + palabrota);
  
    palabras_pregunta = pregunta.split(regexp);
    
  //console.log(palabras_pregunta);
  
    regexp = new RegExp(palabrota, "gi");
  
    for(j = 0; j < palabras_pregunta.length; j++){
      if(palabras_pregunta[j].match(regexp)){
    if(i == 0){
      texto = xml.getElementsByTagName('template')[i].childNodes[0].nodeValue;
    }
    else{
      for(z = 0; z < xml.getElementsByTagName('pattern').length; z++){
        if(xml.getElementsByTagName('srai')[i].childNodes[0].nodeValue.match(xml.getElementsByTagName('pattern')[z].childNodes[0].nodeValue)){
          texto = xml.getElementsByTagName('template')[z].childNodes[0].nodeValue;
          break;
        }
      }
    }
    recogido = 1;
    break;
    }
    if(recogido)
    break;
    }
  }
  
  return texto;
}

function getInfoMineria(texto){
  var facultad_solicitada = buscarInfo(texto, facultades);
  var grado_solicitado = buscarInfo(texto, grados);
  var xml = leerXML(informacionFacultades);
  var nodos;
  var contador = 0;
  var grado;
  var infoMineria = [4];

  if(grado_solicitado){
    nodos = xml.getElementsByTagName("carrera");
    while(contador < nodos.length){
      if(grados[grado_solicitado] == nodos[contador].textContent){
          infoMineria[0] = nodos[contador].parentNode.parentNode.getAttribute("name");
          infoMineria[1] = nodos[contador].parentNode.getAttribute("name");
          infoMineria[2] = grados[grado_solicitado];
          infoMineria[3] = crearBasura(texto, grados[grado_solicitado]);
          console.log(infoMineria);
          return infoMineria;
      }
      contador ++;
    }
  }
  else if (facultad_solicitada){
    infoMineria[0] = facultades[facultad_solicitada];
    infoMineria[3] = crearBasura(texto, facultades[facultad_solicitada]);
    console.log(infoMineria);
    return infoMineria;
  }
  else
    return;
}

function buscarInfo(texto, array){
    var info;
    var regexp;
    var iterador = 0;
    var indiceDeBusqueda;
    texto = normalizarCadena(texto);

    while(iterador < array.length){
      info = normalizarCadena(array[iterador]);
      regexp = new RegExp(info, "g");
      if(texto.match(regexp)){
        indiceDeBusqueda = iterador;
        return indiceDeBusqueda;
      }
      else
      iterador ++;
    }

}

//Elimina las tildes
function normalizarCadena(cadena){
  
  var palabras;
  var resultado = "";
  var puntuaciones = new RegExp("\\.|,?\\s");
  cadena = cadena.toLowerCase();
  cadena = cadena.replace(/á/g ,"a");
  cadena = cadena.replace(/é/g ,"e");
  cadena = cadena.replace(/í/g ,"i");
  cadena = cadena.replace(/ó/g ,"o");
  cadena = cadena.replace(/ú/g ,"u");

  palabras = cadena.split(puntuaciones);
  for(var i=0; i< palabras.length; i++){
    if(palabras[i].length > 2){
      if(i != 0)
        resultado = resultado.concat(" ");
      resultado = resultado.concat(palabras[i]);
    }
  }
  return resultado;
}

function crearBasura(texto, matching){
  var basura;
  var match;
  var regexp;
  basura = normalizarCadena(texto);
  match = normalizarCadena(matching);
  basura = basura.replace(match," ");
  return basura;
}


function crearRespuestaHtml(pregunta, respuesta) {
  pregunta_humano = document.createElement("LABEL");
  pregunta_humano.setAttribute("class", "humano");
  pregunta_humano.appendChild(document.createTextNode(pregunta));
  
  respuesta_bot = document.createElement("LABEL");
  respuesta_bot.setAttribute("class", "bot");
  respuesta_bot.appendChild(document.createTextNode(respuesta));
  
  br = document.createElement("BR");
  br1 = document.createElement("BR");
  
  span = document.getElementById("conversacion");
  span.appendChild(pregunta_humano);
  span.appendChild(br);
  span.appendChild(respuesta_bot);
  span.appendChild(br1);
  span.scrollTop = span.scrollHeight;
}