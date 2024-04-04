<?php
/**
 * @var $default_fields
 */
use GravityDefaults\DefaultFieldsControl;
?>
<div class="header-area">
	<div data-title="Pagination Options" data-description="Manage pagination options" class="selectable" style="display:block;">
		<div class="gf-pagebreak-first gf-pagebreak">
			<span>Default Fields</span>
		</div>
	</div>
</div>
<ul id="df-fields">
<?php foreach ($default_fields as $key => $default_field) :
    DefaultFieldsControl::display_field($default_field);
endforeach; ?>
</ul>
