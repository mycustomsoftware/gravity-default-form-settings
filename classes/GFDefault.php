<?php

namespace GravityDefaults;
use GFCommon;
use GFForms;

if (!class_exists('GFForms')) {
	return;
}
GFForms::include_addon_framework();

class GFDefault extends \GFAddOn
{
	protected $_version = '1.0';
	protected $_min_gravityforms_version = '1.9';
	protected $_slug = 'gf-default';
	protected $_path = 'gf-default/includes/GFDefault.php';
	protected $_full_path = __FILE__;
	protected $_title = 'Gravity Forms Default fields Add-On';
	protected $_short_title = 'Default fields';
	private static $_instance = null;

	public static function get_instance()
	{
		if (self::$_instance == null) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	public static function display_field_settings()
	{
		require_once __DIR__ . '/template-fields-control.php';
	}

	public function pre_init()
	{
		parent::pre_init();
	}

	public function init()
	{
		parent::init();
	}

	public function init_admin()
	{
		parent::init_admin();
		add_filter('gform_settings_save_button', array($this, 'render_form_page'));
	}

	public function render_form_page($html)
	{
		if (!isset($_GET['subview'])) {
			return $html;
		}
		if ($_GET['subview'] !== 'gf-default') {
			return $html;
		}
		$form_data = "";
		ob_start();
		require_once DEFAULTGF_PATH . '/layout.php';
		$form_data = ob_get_contents();
		ob_clean();
		return $form_data . $html;
	}

	public static function display_buttons($buttons)
	{
		$skip = array(
			'textarea',
			'html',
			'page',
			'section',
			'captcha',
			'checkbox',
			'radio',
			'select',
			'list',
			'consent',
		);
		$return = "";
		foreach ($buttons as $button) {
			if (in_array($button['data-type'], $skip)) {
				continue;
			}
			unset($button['onclick']);
			unset($button['onkeypress']);
			$button['data-icon'] = empty($button['data-icon']) ? 'gform-icon--cog' : $button['data-icon'];
			$button['data-description'] = empty($button['data-description']) ? sprintf(esc_attr__('Add a %s field to your form.', 'gravityforms'), $button['value']) : $button['data-description'];
			$attrs = ' ';
			foreach (array_keys($button) as $attr) {
				$attrOut = $attr;
				if ($attrOut == 'value') {
					$attrOut = 'data-label';
				}
				$attrs .= $attrOut . '="' . esc_attr($button[$attr]) . '" ';
			}
			$icon_code = GFCommon::get_icon_markup(array('icon' => rgar($button, 'data-icon')));
			$icon_code = str_replace('"',"'",$icon_code);
			$return .= sprintf(
				'<li><a href="#" title="%s" class="dfield-item"%s><div class="button-icon">%s</div><div class="button-text">%s</div></a></li>',
				esc_attr($button['data-description']),
				$attrs,
				$icon_code,
				esc_html($button['value'])
			);
		}
		return $return;
	}

	public function init_frontend()
	{
		parent::init_frontend();
	}

	public function init_ajax()
	{
		parent::init_ajax();
	}

	public function should_enqueue_admin_script()
	{
		return (rgget('page') == 'gf_edit_forms');
	}

	public function should_enqueue_frontend_script()
	{
		return !GFForms::get_page();
	}

	public function plugin_settings_fields()
	{
		return array(
			array(
				'title' => esc_html__('Default fields Add-On Settings', 'simpleaddon'),
				'fields' => array()
			)
		);
	}
}
