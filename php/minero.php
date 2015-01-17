<?php
	include_once('simple_html_dom.php');
	
	$w = "http://www.facultades.ull.es/";
	
	$contenido = file_get_html($w);
	
	$array = $contenido->find('a');
	
	for($i = 0; $i < sizeof($array); $i++){
		echo $array[$i]->plaintext . "\n";
		if(!preg_match("/Tecnología/i", $array[$i]->plaintext));
			$web = $array[$i]->href;
	}
	echo $w . $web;
	
?>