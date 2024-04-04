<?php

namespace GravityDefaults;
class AjaxSaveDefaultData
{
	function __construct()
	{
		add_action('wp_ajax_save_default_template_data', array($this, 'save_default_template_data'));
	}

	public static function send_nonce_error()
	{
		wp_send_json_error(
			array('message' => 'Nonce verification failed!')
		);
		exit();
	}


	function save_default_template_data()
	{
		if (!isset($_POST['_nonce'])) {
			self::send_nonce_error();
		}
		$veryfy = wp_verify_nonce($_POST['_nonce'], 'save_default_template_data');
		if (!$veryfy) {
			self::send_nonce_error();
		}
		$clean_array = array();
		foreach ($_POST['type'] as $key => $item) {
			$clean_array[(int)$key + 1] = array(
				'type' => $item,
				'label' => $_POST['label'][$key],
				'defaultvalue' => $_POST['defaultvalue'][$key],
				'icon' => $_POST['icon'][$key],
			);
		}
		update_option(
			'gf_default_template',
			$clean_array
		);
		do_action('update_default_template');
		wp_send_json_success(
			array('message' => 'Saved!')
		);
		exit();
	}
}
