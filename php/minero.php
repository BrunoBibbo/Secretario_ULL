<?php
	include_once('simple_html_dom.php');
	
	//Facultades:
	$web_facultades = "http://www.facultades.ull.es/";
	$html_facultades = file_get_html($web_facultades);
	$array_facultades = $html_facultades->find('a');
	
	//Secciones:
	$web_secciones;
	$html_secciones;
	$array_secciones;
	
	//Grado:
	$web_grado;
	$html_grado;
	$array_grado;
	
	//Carrera:
	$web_carrera;
	
	echo "la facultad: " . $_GET["facultad"] . "\n";
	echo "la seccion: " . $_GET["seccion"] . "\n";
	echo "el grado: " . $_GET["grado"] . "\n";
	
	//Recogiendo Facultad:
	for($i = 0; $i < sizeof($array_facultades)-1; $i++){
		if(preg_match("/" . $_GET["facultad"] . "/i", html_entity_decode($array_facultades[$i]->plaintext))){
			$web_secciones = $web_facultades . $array_facultades[$i]->href;
		}
	}
	
	echo "WEB SECCIONES: " . $web_secciones . "\n";
	
	$html_secciones = file_get_html($web_secciones);
	$array_secciones = $html_secciones->find('a');
	
	//Recogiendo Seccion:
	for($i = 0; $i < sizeof($array_secciones); $i++){
		if(preg_match("/" . $_GET["seccion"] . "/i", html_entity_decode($array_secciones[$i]->plaintext))){
			$web_grado = $array_secciones[$i]->href;
		}
	}
	
	echo "WEB GRADO: " . $web_grado . "\n";
	
	$html_grado = file_get_html($web_grado);
	$array_grado = $html_grado->find('a');
	
	//Recogiendo Grado:
	for($i = 0; $i < sizeof($array_grado); $i++){
		if(preg_match("/" . $_GET["grado"] . "/i", html_entity_decode($array_grado[$i]->plaintext))){
			$web_carrera = $web_facultades . $array_grado[$i]->href;
		}
	}
	
	echo "WEB CARRERA: " . $web_carrera . "\n";
?>