<?php

namespace GravityDefaults;
class DefaultNotificationsControl
{

	public static function get_default_notifications()
	{
		return get_option('gf_default_notifications', array());
	}

	public static function set_default_notification($default_notification)
	{
		$default_notifications = get_option('gf_default_notifications', array());
		$default_notifications[] = $default_notification;
		update_option('gf_default_notifications', $default_notifications);
		return $default_notifications;
	}

	public static function display_notification(array $default_field, $ind = null)
	{
		ob_start();
		include DEFAULTGF_TEMPLATE_PATH . '/html/item-notification.html';
		$content = ob_get_clean();
		$variables = array(
			'{{ind}}'     => $ind ?? '',
			'{{ntype}}'   => $default_field['ntype'],
			'{{name}}'    => $default_field['name'],
			'{{replyto}}' => $default_field['replyto'],
			'{{to}}'      => $default_field['to'],
			'{{from}}'    => $default_field['from'],
			'{{subject}}' => $default_field['subject'],
			'{{message}}' => $default_field['message'],
		);
		echo str_replace(array_keys($variables), array_values($variables), $content);
	}

	public static function remove_default_notification(mixed $param)
	{
		$default_notifications = get_option('gf_default_notifications', array());
		unset($default_notifications[$param]);
		update_option('gf_default_notifications', $default_notifications);
	}

	public static function update_default_template(array $default_notifications)
	{
		update_option('gf_default_notifications', $default_notifications);
	}
}
