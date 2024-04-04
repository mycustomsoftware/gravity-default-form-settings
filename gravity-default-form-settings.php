<?php
/**
 * Plugin Name: Gravity default form settings
 * Plugin URI: https://wordpress.org/plugins/gravity-default-form-settings
 * Description: Gravity default form settings for Gravity Forms that allows you to set default confirmation, notifications, and fields.
 * Version: 1.0.0
 * Author: My Custom Software
 * Author URI: https://github.com/mycustomsoftware
 *  License: GPL3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Requires PHP: 8.2
 **/

use GravityDefaults\AjaxSaveDefaultConfirmation;
use GravityDefaults\AjaxSaveDefaultData;
use GravityDefaults\AjaxSaveDefaultNotification;
use GravityDefaults\DefaultConfirmationControl;
use GravityDefaults\DefaultFieldsControl;
use GravityDefaults\DefaultNotificationsControl;
use GravityDefaults\GFDefault;

require_once __DIR__.'/vendor/autoload.php';
define("DEFAULTGF_FILE",__FILE__);
define("DEFAULTGF_PATH",__DIR__);
define("DEFAULTGF_TEMPLATE_PATH",DEFAULTGF_PATH.'/templates/');
class GravityDefaultFormSettings
{
	function __construct() {
		new AjaxSaveDefaultConfirmation();
		new AjaxSaveDefaultNotification();
		new AjaxSaveDefaultData();
		new GFDefault();
		add_action( 'gform_after_save_form', array($this,'set_default_notification_to'), 11, 2 );
		add_filter( "gform_pre_notification_save", array($this,'alter_notification_form_value_on_save'), 10, 3 );
		add_action( 'gform_after_save_form', array($this,'add_default_fields'), 10, 2 );
		add_filter( 'gform_notification_settings_fields', array($this,'set_default_notification_form_value'), 999999, 3 );
		add_filter( 'gform_confirmation', array($this,'custom_confirmation'), 10, 4 );
	}
	public static function plug_path() {
		return DEFAULTGF_PATH;
	}

	function set_default_notification_to( $form, $is_new ) {
		if ( $is_new ) {
			$form = GFAPI::get_form( $form['id'] );
			$defaultnotifications = $this->get_default_newform_notification_field_value();
			$form['notifications'] = [];
//			$form['confirmations']  = [];
			$confirmation  = $this->get_confirmation();
			$confirmation['id'] = uniqid();
			$confirmation['name'] = 'Default Confirmation';
			$confirmation['isDefault'] = true;
			$confirmation['queryString'] = '';
			$confirmation['pageId'] = '';
//			$confirmation['message'] = $confirmation['message'];
//			$confirmation['url']     = $confirmation['url'];
			$form['confirmations'] = [];
			$form['confirmations'][$confirmation['id']]  = $confirmation;
			foreach ( $defaultnotifications as $default ) {
				$notification_id         = uniqid();
				$default['id']           = $notification_id;
				$form['notifications'][] = $default;
			}
			$form['is_active'] = '1';
//			var_dump($form['confirmations']);
//			exit();
//			{"660e869755863":{"id":"660e869755863","name":"Default Confirmation","isDefault":true,"type":"message","message":"Thanks for contacting us! We will get in touch with you shortly.","url":"","pageId":"","queryString":""}}
			GFAPI::update_form( $form );
		}
	}

	function get_default_newform_notification_field_value() {
		return $this->get_default_by_type_notification_field_value('newform');
	}
	function get_default_newnotification_notification_field_value() {
		return $this->get_default_by_type_notification_field_value('newnotification');
	}
	function get_default_by_type_notification_field_value($ntype) {
		$return_default_notification = array();
		$notifications = DefaultNotificationsControl::get_default_notifications();
		foreach ($notifications as $notification) {
			if($notification['ntype'] == $ntype) {
				$notification['replyTo'] = $notification['replyto'];
				$notification['toType']   = 'email';
				$notification['toEmail']  = $notification['to'];
				$notification['fromName'] = $notification['from'];
				unset($notification['ntype']);
				unset($notification['replyto']);
				$return_default_notification[] = $notification;
			}
		}
		return $return_default_notification;
	}
	function alter_notification_form_value_on_save( $notification, $form, $is_new_notification ) {
		$default = $this->get_default_newnotification_notification_field_value();
		if ( $is_new_notification  && !empty($default)) {
			$notification = $default[0];
			$notification['id']      = uniqid();
		}
		return $notification;
	}

	function set_default_notification_form_value( $fields, $notification, $form ) {
		$defaults = $this->get_default_newnotification_notification_field_value();
		if(!empty($defaults)){
			$default = $defaults[0];
			if ( empty( $notification ) ) {
				foreach ( $fields[0]['fields'] as $key => $field ) {
					if( isset($field['name']) && isset( $default[$field['name']] )  ) {
						$fields[0]['fields'][$key]['default_value'] = $default[$field['name']];
					}
				}
			}
			$this->alter_to_email_value_by_script($default['to']);
		}
		return $fields;
	}

	function alter_to_email_value_by_script( $value ) {
		printf("<script>document.onreadystatechange=function(){'complete'==document.readyState&&(document.getElementById('toEmail').value='{$value}')};</script>");
	}

	function add_default_fields( $form, $is_new ) {
		if ( $is_new ) {
			if(count($form['fields']) == 0 ){
				$default_fields = DefaultFieldsControl::get_default_fields();
				if(!empty($default_fields)) {
					$counter = 1;
					foreach ($default_fields as $key => $default_field) {
						$default_field['formId'] = $form['id'];
						$default_field['defaultValue'] = $default_field['defaultvalue'];
						unset($default_field['icon']);
						unset($default_field['ntype']);
						unset($default_field['defaultvalue']);
						$default_field['id'] = $counter;
						$form['fields'][] = $default_field;
						$counter++;
					}
				}
			}
			GFAPI::update_form( $form );
		}
	}
	public static function get_confirmation_message(){
		$confirmation = self::get_confirmation();
		if($confirmation['type'] == 'message') {
			return $confirmation['message'];
		}
		if($confirmation['type'] == 'redirect') {
			return array(
				'redirect' => $confirmation['url']
			);
		}
	}
	public static function get_confirmation(){
		$defaultconfirmation = DefaultConfirmationControl::get_default_confirmation();
		$confirmation = array(
			'type' => 'message',
			'message' => ''
		);

		if(!empty($defaultconfirmation)) {
			$confirmation['type'] = $defaultconfirmation['type'];
			if($defaultconfirmation['type'] == 'message') {
				$confirmation['message'] = $defaultconfirmation['message'];
			}
			if($defaultconfirmation['type'] == 'redirect') {
				$confirmation['url'] = $defaultconfirmation['to'];
			}
		}
		return $confirmation;
	}
	function custom_confirmation( $confirmation, $form, $entry, $ajax ) {
		$defaultconfirmation = $this->get_confirmation_message();
		if(!empty($defaultconfirmation)) {
			$confirmation = $defaultconfirmation;
		}
		return $confirmation;
	}
}
new GravityDefaultFormSettings();
