//Variables de lectura de ficheros.
var conocimiento = "lib/patrones.xml";
var palabrasMalSonantes = "lib/palabrejas.xml"

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

//Reconoce los patrones del texto y devuelve una respuesta.
function reconocerPatron(pregunta){
  var xml = leerXML(conocimiento);
  var texto = unsigned;
  var regexp;
  var frase;
  var recogido = 0;
  
  texto = reconocimientoMalasPalabras(pregunta);
  
  if(texto == unsigned){
    for(i = 0; i < xml.getElementsByTagName('pattern').length; i++){
	    frase = xml.getElementsByTagName('pattern')[i].childNodes[0].nodeValue;
	    regexp = new RegExp(",?\\s");
	  
	    palabras_pregunta = pregunta.split(regexp);
	  
	    palabras_patron = frase.split(regexp);
	  
	    regexp = new RegExp(, "gi");

	    for(j = 0; j < palabras.length; j++){
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
  var texto = unsigned;
  recogido = 0;
  
  for(i = 0; i < xml.getElementsByTagName('pattern').length; i++){
    palabrota = xml.getElementsByTagName('pattern')[i].childNodes[0].nodeValue;
    regexp = new RegExp(",?\\s");
    
    palabras_pregunta = pregunta.split(regexp);
    
    regexp = new RegExp(, "gi");
  
    for(j = 0; j < palabras.length; j++){
      if(palabras_pregunta[j].match(regexp)){
	if(xml.getElementsByTagName('template')[i].childNodes[0].nodeValue != unsigned)
	  texto = xml.getElementsByTagName('template')[i].childNodes[0].nodeValue;
	else{
	  for(z = 0; z < xml.getElementsByTagName('pattern').length; z++){
	    if(xml.getElementsByTagName('srai')[i].childNodes[0].nodeValue.match(xml.getElementsByTagName('pattern')[z].childNodes[0].nodeValue){
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
