var pregunta;
var respuesta;
var span;
var texto;

function conversar(){
  pregunta = document.getElementById("pregunta_usuario");
  respuesta = reconocerPatron(pregunta);
  span = document.getElementById("conversacion");
  span.appendChild( document.createTextNode("some new content") );
}

function reconocerPatron(){
  var aimlFile = "../lib/patrones.aiml";
  var fs = readFile(aimlFile, function (err, data){
    if(err) 
      throw err;
    texto = data;
    console.log(data);
  });
  
  return texto;
}