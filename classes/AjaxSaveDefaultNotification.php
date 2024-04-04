<?php

namespace GravityDefaults;

class AjaxSaveDefaultNotification
{
	function __construct()
	{
		add_action('wp_ajax_save_default_notification_data', array($this, 'save_default_notification_data'));
		add_action('update_default_template', array($this, 'update_default_template'));
	}

	public static function send_nonce_error()
	{
		wp_send_json_error(
			array('message' => 'Nonce verification failed!')
		);
		exit();
	}

	public function update_default_template()
	{
		if(isset($_POST['notifications'])){
			DefaultNotificationsControl::update_default_template($_POST['notifications'] ?? array());
		}else{
			DefaultNotificationsControl::update_default_template(array());
		}
	}

	public function remove_default_notification_data()
	{
		if (!isset($_POST['_nonce_notification'])) {
			self::send_nonce_error();
		}
		$veryfy = wp_verify_nonce($_POST['_nonce_notification'], 'save_default_notification_data');
		if (!$veryfy) {

			self::send_nonce_error();

		}
		DefaultNotificationsControl::remove_default_notification($_POST['id'] ?? '');
	}

	public function save_default_notification_data()
	{
		if (!isset($_POST['_nonce_notification'])) {
			self::send_nonce_error();
		}
		$veryfy = wp_verify_nonce($_POST['_nonce_notification'], 'save_default_notification_data');
		if (!$veryfy) {
			self::send_nonce_error();
		}
		DefaultNotificationsControl::set_default_notification(
			array(
				'ntype' => $_POST['ntype'] ?? '',
				'name' => $_POST['name'] ?? '',
				'to' => $_POST['to'] ?? '',
				'from' => $_POST['from'] ?? '',
				'replyto' => $_POST['replyto'] ?? '',
				'subject' => $_POST['subject'] ?? '',
				'message' => $_POST['message'] ?? ''
			)
		);
		wp_send_json_success(
			array('message' => 'Saved!')
		);
	}
}
