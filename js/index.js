
//Variables de lectura de ficheros.
var conocimiento = "lib/patrones.xml";
var xml;

//Variables del bot.
var pregunta;
var respuesta;
var span;
var texto;


//Principal para conversar.
function conversar(){
  pregunta = document.getElementById("pregunta_usuario");
  respuesta = reconocerPatron(pregunta);

  span = document.getElementById("conversacion");
  span.appendChild( document.createTextNode("some new content") );
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
function leerXML(){
  xml = cargarXMLDoc(conocimiento);
}

//Reconoce los patrones del texto y devuelve una respuesta.
function reconocerPatron(p){
  leerXML();

  for(i = 0; i < xml.getElementsByTagName('pattern').length; i++){
	  texto = xml.getElementsByTagName('pattern')[i].childNodes[0].nodeValue;
	  console.log(texto);
  }
  
  return texto;
}