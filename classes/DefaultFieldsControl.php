<?php

namespace GravityDefaults;

use GFFormDetail;

class DefaultFieldsControl
{
	public static function get_default_fields()
	{
		return get_option('gf_default_template');
	}

	public static function display_field($default_field)
	{
		$default_field = array_merge(
			array(
				'label' => '',
				'defaultvalue' => '',
				'icon' => '',
				'type' => ''
			), $default_field
		);
		ob_start();
		include DEFAULTGF_TEMPLATE_PATH . '/html/item-template.html';
		$content = ob_get_clean();
		$variables = array(
			'{{icontag}}' => '<i class="gform-icon ' . $default_field['icon'] . '"></i>',
			'{{icon}}' => $default_field['icon'],
			'{{label}}' => $default_field['label'],
			'{{defaultvalue}}' => $default_field['defaultvalue'],
			'{{type}}' => $default_field['type'],
		);
		echo str_replace(array_keys($variables), array_values($variables), $content);
	}

	public static function get_field_groups()
	{
		$field_groups = GFFormDetail::get_field_groups();
		$exclude_groups = apply_filters('inlcude_gform_default_fields_groups', array('standard_fields', 'advanced_fields'));
		$return_field_groups = array();
		foreach ($field_groups as $key => $group) {
			if (!in_array($group['name'], $exclude_groups)) {
				continue;
			}
			$return_field_groups[$key] = $group;
		}
		return $return_field_groups;
	}
}
