<?php

namespace GravityDefaults;

class DefaultConfirmationControl
{

	public static function display_confirmation($default_field)
	{
//		var_dump($default_field);
		ob_start();
		include DEFAULTGF_TEMPLATE_PATH . '/html/item-confirmation.html';
		$content = ob_get_clean();
		$variables = array(
			'{{type}}'     => $default_field['type'],
			'{{to}}'       => $default_field['to'],
			'{{message}}'  => $default_field['message'],
		);
		echo str_replace(array_keys($variables), array_values($variables), $content);
	}

	public static function update_default_template(array $default_confirmation)
	{
		if($default_confirmation['type'] == 'message'){
			$default_confirmation['to'] = '';
		}
		if($default_confirmation['type'] == 'redirect'){
			$default_confirmation['message'] = '';
		}
		update_option('gf_default_confirmation', $default_confirmation);
	}
	public static function get_default_confirmation()
	{
		return get_option('gf_default_confirmation', array());
	}
}
