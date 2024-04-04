<?php

namespace GravityDefaults;

class AjaxSaveDefaultConfirmation
{
	function __construct()
	{
		add_action('wp_ajax_save_default_confirmation_data', array($this, 'save_default_confirmation_data'));
		add_action('update_default_template', array($this, 'update_default_template'));
	}
	public function update_default_template()
	{
		if( isset($_POST['confirmation']) ){
			DefaultConfirmationControl::update_default_template($_POST['confirmation'] ?? array());
		}
	}
	public static function send_nonce_error()
	{
		wp_send_json_error(
			array('message' => 'Nonce verification failed!')
		);
		exit();
	}
	public function check_nonce()
	{
		if (!isset($_POST['_nonce_confirmation'])) {
			self::send_nonce_error();
			exit();
		}
		$veryfy = wp_verify_nonce($_POST['_nonce_confirmation'], 'save_default_confirmation_data');
		if (!$veryfy) {
			self::send_nonce_error();
			exit();
		}

	}
	public function save_default_confirmation_data()
	{
		$this->check_nonce();
		DefaultConfirmationControl::update_default_template(array(
			'type'    => $_POST['type'] ?? '',
			'to'      => $_POST['to'] ?? '',
			'message' => $_POST['message'] ?? '',
		));
		wp_send_json_success(
			array('message' => 'Saved!')
		);
	}
}
