jQuery(function($) {
	function updateItemOrder(){
		let fieldsWrapper = $('#df-fields');
		let items = fieldsWrapper.find('[data-item]');
		if(items.length === 0){
			fieldsWrapper.append('<div class="empty"><span>No fields</span><h3>Use drag and drop to add fields</h3></div>');
			fieldsWrapper.addClass('empty');
		}else{
			fieldsWrapper.find('.empty').remove();
			fieldsWrapper.removeClass('empty');
			items.each(function (index) {
				$(this).attr('data-item',index);
			});
		}
	}
	$(document).on('change','[data-ifchange]',function (event) {
		let val       = $(this).val();
		let name  = $(this).attr('name');
		let items     = $('body').find('[data-displayif="'+name+'"]');
		let selectedItems = $('body').find('[data-ifvalue="'+val+'"]');
		let requiredItems = $('body').find('[data-ifvalue="'+val+'"][data-requeredif="'+name+'"]');
		items.css('display','none');
		items.find('input,select,textarea').prop('required',false);
		selectedItems.attr('style','');
		selectedItems.find('input,select,textarea').val('');
		requiredItems.find('input,select,textarea').attr('required','required');
	});
	$(document).on('mouseover click','.actions-wrapper .moreoptions',function (event) {
		event.preventDefault()
		$(this).closest('.actions-wrapper').focus();
	});
		window.linkinput = false;
		$(document).on('click','#wp-link-submit',function (event) {
			var url = $('body').find('#wp-link-url').val();
			if (url && window.linkinput) {
				var selectedUrl = url;
				window.linkinput.val(selectedUrl);
				let attrs = wpLink.getAttrs();
				wpLink.buildHtml(attrs);
				console.log('Selected URL:', selectedUrl);
			}
			event.preventDefault()
		});
		$(document).on('click','[data-openlinkdialog]',function (event) {
		window.linkinput = $(this).find('[data-linkdialog="url"]');
		console.log($(this).find('[data-linkdialog="url"]'));
		wpLink.open();
		event.preventDefault()
	});
	$(document).on('focus','[name="confirmation[to]"]',function (event) {
		window.linkinput = this;
		wpLink.open();
	});
	$(document).on('click','[data-save-item]',function (event) {
		event.preventDefault()
		$(this).closest('[data-editable-content]').removeClass('active');
	});
	$(document).on('click','[data-cancel-item]',function (event) {
		event.preventDefault()
		$(this).closest('[data-editable-content]').removeClass('active');
	});
	$(document).on('click','[data-remove-item]',function (event) {
		event.preventDefault();
		let result = confirm('Are you sure you want to delete this item?');
		if (result) {
			$(this).closest('[data-item]').remove();
			updateItemOrder();
		}
	});
	$(document).on('click','[data-edit-item]',function (event) {
		event.preventDefault();
		$(this).closest('[data-item]').find('[data-editable-content]').addClass('active');
	});
	$(document).on('click','.panel-block-tabs__toggle',function (event) {
		$(this).closest('.panel-block-tabs__wrapper').toggleClass('open');
		$(this).closest('.panel-block-tabs__wrapper').find('.panel-block-tabs__body').toggle('slow');
		event.preventDefault();
	});
	$(document).on('click','[name="gform-save-default-settings"]',function (event) {
		event.preventDefault();
		let gform = window.gform || {};
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: $('.list-area').find('input, select, textarea').serialize()+"&action=save_default_template_data",
			dataType: 'json',
		}).done(function(data) {
			gform.utils.trigger( { event: 'gform/page_loader/hide' } );
			$('body').find('#gform-settings-save').click();
		});
		gform.utils.trigger( { event: 'gform/page_loader/show' } );
	});
	$(document).on('click','button[data-controldialog]',function (event) {
		event.preventDefault();
		let title = $(this).data('controldialogtitle');
		let controldialog = $(this).data('controldialog');
		let html = $('body').find('[data-'+controldialog+']').html();
		$('#editor-button-flyout').closest('.gform-dialog__mask').find('.gform-dialog__title').html(title);
		$('#editor-button-flyout').closest('.gform-dialog__mask').find('.gform-dialog__content').html(html);
		$('#editor-button-flyout').closest('.gform-dialog__mask').addClass('gform-dialog--anim-in-active').addClass('gform-dialog--anim-in-ready');
	});
	$(document).on('click','.gform-dialog__close',function (event) {
		event.preventDefault();
		$('#editor-button-flyout').closest('.gform-dialog__mask').removeClass('gform-dialog--anim-in-active').removeClass('gform-dialog--anim-in-ready');
	});
	$(document).on('click','.df-notification .header a.delete',function (event) {
		event.preventDefault();
		let IsDelete = confirm("Are you sure you want to delete this notification?");
		if(IsDelete){
			$(this).closest('.df-notification').remove();
			$('body').find('[name="gform-save-default-settings"]').trigger('click');
		}
	});
	$(document).on('click','.df-notification .header a.edit',function (event) {
		event.preventDefault();
		$(this).closest('.df-notification').find('.df-notification-editor').toggleClass('active');
	});
	$(document).on('change','.gform-toggle__label input,.gform-toggle__label select,.gform-toggle__label textarea',function (event) {
		let content = $(this).closest('.gform-dialog__content');
		content.find('.gform-toggle__label .error').remove();
	});
	$(document).on('click','[data-ajax-action]',function (event) {
		event.preventDefault();
		let action = $(this).attr('data-ajax-action');
		let content = $(this).closest('.gform-dialog__content');
		let nameInp = content.find('[required]');
		let error = false;
		content.find('.gform-toggle__label .error').remove();
		nameInp.each(function(index,el){
			let name = $(el).val();
			if(name.trim() === '' && error === false){
				$(el).closest('.gform-toggle__label').append('<span class="error">This field is required.</span>');
				$(el).closest('.gform-toggle__label').click();
				error = true;
				return false;
			}
		});
		if(error){
			return
		}
		let data = content.find('input, select, textarea').serialize();
		data = data + '&action='+action;
		gform.utils.trigger( { event: 'gform/page_loader/show' } );
			$.ajax({
				url: ajaxurl,
				type: 'POST',
				data: data,
				dataType: 'json',
			}).done(function(data) {
				// console.log(data,"success");
				$('body').find('#gform-settings-save').click();
			})
			.fail(function(data) {
				console.log(data,"error");
			})
			.always(function() {
				gform.utils.trigger( { event: 'gform/page_loader/hide' } );
			});
	});
	$(document).ready(function() {
		$('body').find('#gform-settings-save').css('display','none');
		$('body').find('#gform-settings-save').after('<button style="display: none" type="submit"  name="gform-save-default-settings" value="save" class="primary button large">Save Settings &nbsp;→</button>');
		$( "#df-fields" ).sortable({
			handle: ".header-control",
			placeholder: "ui-state-highlight",
			connectWith: ".add-buttons-list",
			revert: true,
			stop: function() {
				// $('#df-fields').find('[data-item]').attr('style','');
			},
			change: function() {
				updateItemOrder();
			}
		})
		$(document).on('click','.add-buttons-list .dfield-item',function (event) {
			let data = $(this).data();
			let template = $('body').find('[data-item-template]').html();
			template = template.replace(new RegExp('{{icontag}}','g'),'<i class="gform-icon ' + data.icon + '"></i>');
			template = template.replace(new RegExp('{{icon}}','g'),data.icon);
			template = template.replace(new RegExp('{{defaultvalue}}','g'),'');
			$.each(data,function (key,item) {
				if(key != 'uiSortableItem' && key != 'sortableItem'){
					template = template.replace(new RegExp('{{'+key+'}}','g'),item);
				}
			})
			// console.log(template);
			$('body').find('#df-fields').append(template);
			return false;
		});
		$( ".add-buttons-list .dfield-item" ).draggable({
			connectToSortable: "#df-fields",
			helper: "clone",
			revert: "invalid",
			stop:function(event, ui){
				let data = ui.helper.data();
				let template = $('body').find('[data-item-template]').html();
				template = template.replace(new RegExp('{{icontag}}','g'),'<i class="gform-icon ' + data.icon + '"></i>');
				template = template.replace(new RegExp('{{icon}}','g'),data.icon);
				template = template.replace(new RegExp('{{defaultvalue}}','g'),'');
				$.each(data,function (key,item) {
					if(key != 'uiSortableItem' && key != 'sortableItem'){
						template = template.replace(new RegExp('{{'+key+'}}','g'),item);
					}
				})
				ui.helper.replaceWith('');
				$('body').find('#df-fields>.ui-sortable-placeholder.ui-state-highlight').css('display','none');
				$('body').find('#df-fields>.ui-sortable-placeholder.ui-state-highlight').before(template);
				updateItemOrder();
			}
		});
		$('.gform-settings__navigation a').each(function (event) {
			let label = $(this).find('span.label').text();
			$(this).attr('title',label);
			$(this).attr('alt',label);
		})
		$(document).on('click','.df-confirmation .actions .edit',function (event) {
			event.preventDefault();
			$('body').find('[data-controldialog="add-confirmation"]').trigger('click');
			let ctype = $('[name="confirmation[type]"]').val();
			let cto   = $('[name="confirmation[to]"]').val();
			let cmessage   = $('[name="confirmation[message]"]').val();
			$('body').find('.gform-dialog--editor-button .gform-dialog__title').html('Edit Confirmation');
			$('body').find('.gform-dialog--editor-button .gform-dialog__content [name="type"] [value='+ctype+']').prop('selected',true);
			$('body').find('.gform-dialog--editor-button .gform-dialog__content [name="type"]').trigger('change');
			if(cto.trim() !== ''){
				$('body').find('.gform-dialog--editor-button .gform-dialog__content [name="to"]').val(cto);
				$('body').find('.gform-dialog--editor-button .gform-dialog__content [name="to"]').trigger('change');
			}
			if(cmessage.trim() !== ''){
				$('body').find('.gform-dialog--editor-button .gform-dialog__content [name="message"]').val(cmessage);
				$('body').find('.gform-dialog--editor-button .gform-dialog__content [name="message"]').trigger('change');
			}
		});
	});
	updateItemOrder();
});
