<?php

use GravityDefaults\DefaultConfirmationControl;
use GravityDefaults\DefaultFieldsControl;
use GravityDefaults\DefaultNotificationsControl;
use function GravityDefaults\get_default_confirmation;

wp_enqueue_script('wplink');
wp_enqueue_script('wpdialogs');
wp_enqueue_script('wpdialogs-popup');
wp_enqueue_style('wp-jquery-ui-dialog');
wp_enqueue_style('thickbox');
echo "<div style='display:none;'>";
    wp_editor('', 'unique_id', array('editor_class'=>'hidden'));
echo "</div>";
//wp_enqueue_script( 'wp-link' );
wp_enqueue_script('jquery-ui-droppable');
wp_enqueue_script('jquery-ui-draggable');
wp_enqueue_script('jquery-ui-sortable');
$nonce                 = wp_create_nonce( 'save_default_template_data' );
$nonce_notification    = wp_create_nonce( 'save_default_notification_data' );
$nonce_confirmation    = wp_create_nonce( 'save_default_confirmation_data' );
$default_fields        = DefaultFieldsControl::get_default_fields();
$default_notifications = DefaultNotificationsControl::get_default_notifications();
$default_confirmation = DefaultConfirmationControl::get_default_confirmation();
$field_groups          = DefaultFieldsControl::get_field_groups();
$firstopen = true;
?>
<script src="<?php echo plugins_url('assets/js/tooltip.js', DEFAULTGF_FILE); ?>"></script>
<style>@import url("<?php echo plugins_url('assets/css/gf-layout.css', DEFAULTGF_FILE); ?>");</style>
<div class="content-area">
    <div class="list-area">
        <?php require_once DEFAULTGF_TEMPLATE_PATH.'/list-area.php'; ?>
        <input type="hidden" name="_nonce" value="<?php echo $nonce; ?>">
        <?php require_once DEFAULTGF_TEMPLATE_PATH.'/notifitations-area.php'; ?>
        <?php require_once DEFAULTGF_TEMPLATE_PATH.'/confirmation-area.php'; ?>
    </div>
	<?php require_once DEFAULTGF_TEMPLATE_PATH.'/sidebar-area.php'; ?>
</div>
<div class="gform-dialog__mask gform-dialog__mask--position-fixed gform-dialog__mask--theme-light gform-dialog__mask--blur" style="z-index: 20;">
    <article id="editor-button-flyout" class="gform-dialog gform-dialog--editor-button">
        <button type="button" class="gform-dialog__close gform-button--circular gform-button  gform-button--simplified gform-button--size-xs" style="z-index: 11;" title="Close button">
            <span class="gform-button__icon gform-icon gform-icon--delete"></span>
        </button>
        <header class="gform-dialog__head">
            <h5 class="gform-dialog__title">Add notification</h5>
        </header>
        <div class="gform-dialog__content"></div>
    </article>
</div>

<script type="text/html" data-item-template>
	<?php require DEFAULTGF_TEMPLATE_PATH.'/html/item-template.html'; ?>
</script>
<script src="<?php echo plugins_url('assets/js/gf-default.js', DEFAULTGF_FILE); ?>"></script>
