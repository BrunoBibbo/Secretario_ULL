<?php
	include_once('simple_html_dom.php');
	
	//Facultades:
	$web_facultades = "http://www.facultades.ull.es";
	$html_facultades = file_get_html($web_facultades);
	$array_facultades = $html_facultades->find('a');
	
	//Secciones:
	$web_secciones;
	$html_secciones;
	$array_secciones;
	
	//Grado:
	$web_grado = "";
	$html_grado;
	$array_grado;
	
	//Carrera:
	$web_carrera = "";
	$html_carrera;
	$array_carrera;
	
	//Opcion:
	$web_opcion = "";
	
	//Resultado:
	$resultado = array(0 => -1, 1 => "");
	
	/*echo "La facultad: " . $_GET["facultad"] . "\n";
	echo "La seccion: " . $_GET["seccion"] . "\n";
	echo "El grado: " . $_GET["grado"] . "\n";
	echo "La basura: " . $_GET["opcion"] . "\n";*/
	
	//Recogiendo Facultad:
	for($i = 0; $i < sizeof($array_facultades) - 1; $i++){
		if(preg_match("/" . $_GET["facultad"] . "/i", html_entity_decode($array_facultades[$i]->plaintext))){
			$web_secciones = $web_facultades . $array_facultades[$i]->href;
		}
	}
	
	$html_secciones = file_get_html($web_secciones);
	$array_secciones = $html_secciones->find('a');

	//Si la peticion no tiene seccion, mostramos todas las disponibles:
	if($_GET["seccion"] == "undefined"){
		$array_secciones_posibles = array();

		for($i = 0; $i < sizeof($array_secciones); $i++){
			if(preg_match("/sección/i", html_entity_decode($array_secciones[$i]->plaintext))){
				$array_secciones_posibles[] = $array_secciones[$i]->href;
			}
		}
		
		$resultado[0] = 0;
		$resultado[1] = $array_secciones_posibles;
	}
	
	//Si la peticion tiene seccion seguimos ejecutando:
	else{
		//Recogiendo Seccion:
		for($i = 0; $i < sizeof($array_secciones); $i++){
			if(preg_match("/" . $_GET["seccion"] . "/i", html_entity_decode($array_secciones[$i]->plaintext))){
				$web_grado = $array_secciones[$i]->href;
			}
		}
		
		if(strlen($web_grado) > 0){
			$resultado[0] = 1;
			$resultado[1] = $web_grado;
		}
		
		$html_grado = file_get_html($web_grado);
		$array_grado = $html_grado->find('a');
		
		//Recogiendo Grado:
		for($i = 0; $i < sizeof($array_grado); $i++){
			if(preg_match("/" . $_GET["grado"] . "/i", html_entity_decode($array_grado[$i]->plaintext))){
				$web_carrera = $web_facultades . $array_grado[$i]->href;
			}
		}
		
		if(strlen($web_carrera) > 0){
			$resultado[0] = 2;
			$resultado[1] = $web_carrera;
		}
		
		//Realizamos la busqueda especifica:
		if($_GET["opcion"] && $resultado[0] == 2){
			$html_carrera = file_get_html($web_carrera);
			$array_carrera = $html_carrera->find('a');
			
			//Variables globales:
			$tilde = array("á", "é", "í", "ó", "ú");
			$sin_tilde = array("a", "e", "i", "o", "u");
			
			//Variables de comprobación de opcion:
			$palabras_basura = explode(" ", $_GET["opcion"]);
			$palabras_basura_utiles = 0;
			$contador_probabilidad = 0;
			$matching = false;
			
			//Ver cuantas palabras basura son utiles:
			for($i = 0; $i < sizeof($palabras_basura); $i++){
				if(strlen($palabras_basura[$i]) > 2)
					$palabras_basura_utiles++;
			}
			
			//Recogiendo informacion:
			for($i = 0; $i < sizeof($array_carrera); $i++){
				$array_carrera[$i]->plaintext = str_replace($tilde, $sin_tilde, $array_carrera[$i]->plaintext);
				$posible_opcion = explode(" ", $array_carrera[$i]->plaintext);
				
				for($j = 0; $j < sizeof($palabras_basura); $j++){
					$len_PB = strlen($palabras_basura[$j]);
					$len_PO = strlen(html_entity_decode($posible_opcion[$contador_probabilidad]));
					
					if($len_PO <= 2){
						$contador_probabilidad++;
					}
					
					if($len_PB > 2){
						if(preg_match("/" . $palabras_basura[$j] . "/i", html_entity_decode($posible_opcion[$contador_probabilidad]))){
							unset($palabras_basura[$j]);
							$palabras_basura = array_values($palabras_basura);
							$palabras_basura_utiles--;
							
							$contador_probabilidad++;

							if($contador_probabilidad == sizeof($posible_opcion)){
								$matching = true;
								break;
							}
						}
						else{
							$contador_probabilidad = 0;
						}
					}
				}
				
				if($matching){
					$web_opcion = $web_facultades . $array_carrera[$i]->href;

					if(strlen($web_opcion) > 0){
						$resultado[0] = 3;
						$resultado[1] = $web_opcion;
					}
					
					if($palabras_basura_utiles > 0){
						$html_carrera = file_get_html($web_opcion);
						$array_carrera = $html_carrera->find('a');
						$matching = false;
						$contador_probabilidad = 0;
						$i = 0;
					}
					else{
						break;
					}
				}
			}
		}
	}

	echo json_encode($resultado);
?>