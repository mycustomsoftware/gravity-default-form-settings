<?php
/**
 * @var $default_confirmation
 * @var $nonce_confirmation
 */

use GravityDefaults\DefaultConfirmationControl;
?>
<div class="header-area">
    <div data-description="Manage pagination options" class="selectable" style="display:block;">
        <div class="gf-pagebreak-first gf-pagebreak">
            <span>Default confirmation</span>
        </div>
    </div>
</div>
<ul id="df-confirmation">
    <li style="text-align: center">
		<?php if(!empty($default_confirmation)):
        extract($default_confirmation);
        ?>
    <li class="df-confirmation">
        <div class="header">
            <h4 class="name">Confirmation <small style="font-size:10px;">(type: <?php echo $type; ?>)</small></h4>
            <div class="actions">
                <a href="#" class="edit"><i class="dashicons dashicons-edit"></i></a>
            </div>
        </div>
        <div class="df-confirmation-editor">
            <label style="<?php echo ($type == 'redirect' ? '' : 'display:none;'); ?>">
                <span class="label">Redirect to</span>
                <input type="text" name="confirmation[to]" value="<?php echo $to;?>" placeholder="Redirect to">
                <input type="hidden" name="confirmation[type]" value="<?php echo $type;?>" placeholder="type">
            </label>
            <label style="<?php echo ($type == 'message' ? '' : 'display:none;'); ?> align-items: flex-start">
                <span class="label">Message</span>
                <textarea name="confirmation[message]" placeholder="Message" rows="5" cols="50" style="width: 100%;"><?php echo $message;?></textarea>
            </label>
        </div>
    </li>

    <?php else: ?>
            <h4>No confirmation</h4>
		<?php endif; ?>
        <button type="submit" style="<?php echo (!empty($default_confirmation)) ? 'display:none;' : ''; ?>" data-controldialogtitle="Add confirmation" data-controldialog="add-confirmation" value="add" class="button gform-add-new-form primary gform-button--confirmation gform-button--interactive">Add confirmation</button>
    </li>
</ul>
<script type="text/html" data-add-confirmation>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s">
        <label class="gform-toggle__label">
            <span>Confirmation type</span>
            <select name="type" required data-ifchange>
                <option value="">Select type</option>
                <option value="message">Message</option>
                <option value="redirect">Redirect</option>
            </select>
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s" data-requeredif="type" data-displayif="type" data-ifvalue="redirect" style="display:none;">
        <label class="gform-toggle__label" data-openlinkdialog data-linkdialogtitle="Redirect url">
            <span>Redirect to</span>
            <input class="gform-toggle__toggle" name="to" type="text" data-linkdialog="url">
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s" data-displayif="type" data-requeredif="type" data-ifvalue="message" style="display:none;">
        <label class="gform-toggle__label">
            <span>Message</span>
            <textarea class="gform-toggle__toggle" name="message"></textarea>
        </label>
    </div>
    <div class="gform-toggle gform-toggle--with-icons gform-toggle--theme-cosmos gform-toggle--label-right gform-toggle--size-s gform-save-confirmation">
        <label class="gform-toggle__label">
            <input type="hidden" name="_nonce_confirmation" value="<?php echo $nonce_confirmation; ?>">
            <button type="submit" name="gform-save-confirmation-save" data-ajax-action="save_default_confirmation_data" value="save" class="update-form update-form-ajax gform-button gform-button--primary-new gform-button--interactive gform-button--active-type-loader gform-button--icon-leading"><span></span><i class="gform-button__icon gform-button__icon--inactive gform-icon gform-icon--floppy-disk" data-js="button-icon"></i> Save<span></span></button>
        </label>
    </div>
</script>

