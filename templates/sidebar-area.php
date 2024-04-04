<?php
/**
 * @var $firstopen
 * @var $field_groups
 */

use GravityDefaults\GFDefault;

?>
<div class="sidebar-area">
    <div class="sidebar__nav-wrapper">
        <h3>Available Fields</h3>
        <!--            <ul class="sidebar__nav ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">-->
        <!--                <li class="sidebar__nav__item ui-state-default ui-corner-top ui-tabs-tab ui-tab ui-tabs-active ui-state-active" role="tab" tabindex="0" aria-controls="add_fields"><a href="#add_fields" tabindex="-1" class="ui-tabs-anchor"><span class="sidebar__nav__item-text"><span class="sidebar__nav__item-text-inner">Add Fields</span></span></a></li>-->
        <!--                <li class="sidebar__nav__item ui-state-default ui-corner-top ui-tabs-tab ui-tab" id="settings_tab_item" role="tab" tabindex="-1" aria-controls="field_settings_container" aria-labelledby="ui-id-2" aria-selected="false" aria-expanded="false"><a href="#field_settings_container" tabindex="-1" class="ui-tabs-anchor" id="ui-id-2"><span class="sidebar__nav__item-text"><span class="sidebar__nav__item-text-inner">Field Settings</span></span></a></li>-->
        <!--            </ul>-->
    </div>
    <div class="sidebar__content-wrapper">
        <div class="sidebar__content">
            <div id="add_fields">
				<?php
				foreach ( $field_groups as $group ) { $tooltip_class = empty( $group['tooltip_class'] ) ? 'tooltip_left' : $group['tooltip_class'];
//					if($firstopen):   '';endif;
                    ?>
                    <div class="panel-block-tabs__wrapper open">
                        <button tabindex="0" class="panel-block-tabs__toggle" >
							<?php echo esc_html( $group['label'] ); ?><i></i>
                        </button>
                        <?php
                        printf('<div class="panel-block-tabs__body panel-block-tabs__body--nopadding gf-field-group" id="add_%s" style="%s"><ul class="add-buttons add-buttons-list" >%s</ul></div>',
	                        esc_attr( $group['name'] ),
	                        ($firstopen ? '' : ''),
	                        GFDefault::display_buttons( $group['fields'] )
                        );
                        ?>
                    </div>
					<?php if($firstopen){$firstopen = false;}
				} ?>
            </div>
        </div>
    </div>
    <div class="sidebar__header">
        <div class="sidebar__header__title-wrapper">
            <h4 class="sidebar__header__title">Save changes &nbsp;→</h4>
            <button type="submit"  name="gform-save-default-settings" value="save" class="update-form update-form-ajax gform-button gform-button--primary-new gform-button--interactive gform-button--active-type-loader gform-button--icon-leading"><i class="gform-button__icon gform-button__icon--inactive gform-icon gform-icon--floppy-disk" data-js="button-icon"></i> Save</button>
        </div>
    </div>
</div>
