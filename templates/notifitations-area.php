<?php
/**
 * @var $default_notifications
 * @var $nonce_notification
 */

use GravityDefaults\DefaultNotificationsControl;

?>
<div class="header-area">
    <div data-description="Manage pagination options" class="selectable" style="display:block;">
        <div class="gf-pagebreak-first gf-pagebreak">
            <span>Default Notifications</span>
        </div>
    </div>
</div>
<ul id="df-notification">
    <li style="text-align: center">
		<?php if(!empty($default_notifications)):
			foreach ($default_notifications as $key => $default_notification) {
				DefaultNotificationsControl::display_notification($default_notification,$key);
			} ?>
		<?php else: ?>
            <h4>No notifications</h4>
		<?php endif; ?>
        <button type="submit" data-controldialogtitle="Add notification" data-controldialog="add-notification" value="add" class="button gform-add-new-form primary gform-button--notification gform-button--interactive">Add notification</button>
    </li>
</ul>
<script type="text/html" data-add-notification>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s">
        <label class="gform-toggle__label">
            <span>Notification type</span>
            <select name="ntype" required>
                <option value="">Select type</option>
                <option value="newform">When creating a new form</option>
                <option value="newnotification">When creating a new notification</option>
            </select>
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s">
        <label class="gform-toggle__label">
            <span>From Name</span>
            <input class="gform-toggle__toggle" name="name" type="text" required>
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s">
        <label class="gform-toggle__label">
            <span>E-mail to</span>
            <input class="gform-toggle__toggle" name="to" type="text" required>
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s">
        <label class="gform-toggle__label">
            <span>E-mail from</span>
            <input class="gform-toggle__toggle" name="from" type="text" required>
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s">
        <label class="gform-toggle__label">
            <span>Reply to</span>
            <input class="gform-toggle__toggle" name="replyto" type="text">
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s">
        <label class="gform-toggle__label">
            <span>Subject</span>
            <input class="gform-toggle__toggle" name="subject" type="text" required>
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s">
        <label class="gform-toggle__label">
            <span>Message</span>
            <textarea class="gform-toggle__toggle" name="message" required></textarea>
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s gform-save-notification">
        <label class="gform-toggle__label">
            <input type="hidden" name="_nonce_notification" value="<?php echo $nonce_notification; ?>">
            <button type="submit" name="gform-save-notification-save" data-ajax-action="save_default_notification_data" value="save" class="update-form update-form-ajax gform-button gform-button--primary-new gform-button--interactive gform-button--active-type-loader gform-button--icon-leading"><span></span><i class="gform-button__icon gform-button__icon--inactive gform-icon gform-icon--floppy-disk" data-js="button-icon"></i> Save<span></span></button>
        </label>
    </div>
</script>
<script type="text/html" data-notification-template>
	<?php require DEFAULTGF_TEMPLATE_PATH.'/html/item-notification.html'; ?>
</script>
