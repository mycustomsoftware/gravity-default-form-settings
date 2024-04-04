/**
 * @author Cam Tullos cam@tullos.ninja
 * @since version 1.0 - 11/04/16
 *
 * @description jQuery plugin that creates an absolute positioned tooltip based
 * on the element that toggles it (hide/show). All events are processed through
 * the element that toggles the tooltip.
 *
 * @example
	$("button.tooltip").tooltip({
		classes			: 'tooltip',
		content			: null,
		persistent		: false,
		plainText		: false,
		position		: "top-center",
		target			: "body",
		trigger			: "hover"
	});

	@example
	$("a[title]").tooltip({
		trigger 		: "hover"
		position 		: "auto-right-middle"
	});
	*
	*
	* The following config parameters are available.
	* Note: config parameters can be passed via data- attributes:
 *
 * @example
   <a href="#top" data-toggle="tooltip" data-trigger="hover" data-position="auto-top-center" title="Back to top of page">Top</a>
   *
   *
   * --------------------------
   * CONFIGURATION
   * --------------------------
 *
 * @param classes {String} A space delimited list of classes to apply to the
 * 		tooltip container. Default: "tooltip"
 *
 * @param content {String | $(.selector)} Specifies the HTML to use inside the
 * 		tooltip container.
 *
 * @param persistent {Boolean} Specifies if the tooltip should hide when the
 * 		opposite trigger is fired, a user clicks outside of the tooltip or when
 * 		another tooltip is shown. Default: false
 *
 * 		- If the trigger is hover (mouseover), the tooltip will automatically
 * 		  hide when the mouseout event is fired.
 *
 * 		- If the trigger is focus, the tooltip will automatically hide when the
 * 		  blur event is fired.
 *
 * 		- If the trigger is click, the tooltip will automatically hide when the
 * 		  caller element is clicked again.
 *
 * @param plainText {Boolean} Whether to treat the [content] as plain text
 * 		instead of HTML. Default: false.
 *
 * @param position {String} Where to position the tooltip. Default: "top-center"
 * 		top-left 	| top-center 	| top-right
 * 		bottom-left | bottom-center | bottom-right
 * 		left-top 	| left-middle 	| left-bottom
 * 		right-top 	| right-middle 	| right-bottom
 *
 * 		Prefixing any position value with auto (auto-left-middle) will
 * 		dynamically position the tooltip. In cases where the tooltip will
 * 		display off screen, the tooltip will be positioned in a position that
 * 		allows it to be seen.
 *
 * 		- If the position value is "auto-left-middle" but will display off
 * 		  screen, "auto-right-middle" will be applied.
 *
 * @param target {String | $(.selector) } Appends the tooltip to a specific element.
 * 		Default: null (caller element parent)
 *
 * @param trigger {String} Event that will display the tooltip. Default: "click"
 * 		Valid trigger values: click | focus | hover/mouseover | manual
 *
 * 		- If the trigger is manual you will have to toggle the tooltip using one
 * 		  of the available methods.
 *
 * 		  @see hide
 * 		  @see show
 * 		  @see toggle
 *
 *
 * --------------------------
 * FUNCTIONS
 * --------------------------
 *
 * @function $.fn.tooltip('get', 'property') Gets the specified configuration property.
 * @function $.fn.tooltip('hide') Hides the tooltip. Triggers the tooltip:hide event. Alias: 'close'.
 * @function $.fn.tooltip('redraw') Redraws the tooltip. Triggers the tooltip:redraw event.
 * @function $.fn.tooltip('set', 'property', [value], silent). Sets the specified configuration property.
 * @function $.fn.tooltip('show') Shows the tooltip. Triggers the tooltip:show event. Alias: 'open'.
 * @function $.fn.tooltip('toggle') Hides or Shows the tooltip. Triggers the tooltip:toggle event.
 *
 *
 * --------------------------
 * EVENTS
 * --------------------------
 *
 * @event tooltip:before.hide 	Triggered before the tooltip is hidden.
 * @event tooltip:before.show 	Triggered before the tooltip is shown.
 * @event tooltip:before.toggle Triggered before the tooltip is toggled.
 * @event tooltip:before.update Triggered before the tooltip configuration has been updated.
 *
 * @event tooltip:hide 			Triggered when the tooltip is hidden.
 * @event tooltip:initialized 	Triggered after the tooltip has been intialized.
 * @event tooltip:show 			Triggered when the tooltip is shown.
 * @event tooltip:toggle 		Triggered when the tooltip is toggled.
 * @event tooltip:update 		Triggered when the tooltip configuration has been updated.
 *
 * @event tooltip:after.hide 	Triggered after the tooltip is hidden.
 * @event tooltip:after.show 	Triggered after the tooltip is shown.
 * @event tooltip:after.toggle 	Triggered after the tooltip is toggled.
 * @event tooltip:after.update 	Triggered after the tooltip configuration has been updated.
 *
 */

'use strict';

window.tooltipIDX = 0;

(function($) {

	$.fn.tooltip = function(action, params) {
		var ns = {
			tooltipize: function (me) {
				// 0.0 - Localize the tooltip settings.
				var opt = me.__tooltip;

				// 1.0 - Get the tooltip content.
				var tooltipCont = opt.content;

				/**
				 * 1.1 - If the element is an <a> tag -> use the href value as the
				 * content element to find.
				 */
				if ($(me).is('a') && $(me).attr('href') && $(me).attr('href') !== '#') {
					tooltipCont = $(me).attr('href');
				}

				/**
				 * 1.2 - If the content element is not found -> use the title attribute.
				 *
				 * 1.3 - If still not found -> search parent for [data-tooltip-content]
				 *
				 * 1.4 - If the content element is found -> get it's HTML or text value
				 * 		 and use it as the content.
				 *
				 * 1.5 - If there is no content try the title attribute.
				 *
				 * 1.6 - If still no content clear the __tooltip dataset and exit.
				 * 		 This will disqualify the element from being considered
				 * 		 a tooltip.
				 *
				 * 1.7 - Add the content element to the opt.target
				 *
				 * 1.8 - Reference the element to the tooltip content.
				 * 		 This is used when closing the tooltip on outside
				 * 		 click
				 *
				 * 1.9 - Hide the tooltip.
				 */
				if (typeof tooltipCont !== 'string') {

					if ($(me).attr('title')) { // 1.2
						tooltipCont = $(me).attr('title');
						$(me).removeAttr('title');

					} else { // 1.3
						var qry = $(me).parent().find('[data-tooltip-content]');
						if (qry.length > 0) {
							tooltipCont = (opt.plainText === true) ? qry.text() : qry.html();
						}
					}
				} else { // 1.4
					if ($(tooltipCont).length > 0) {
						tooltipCont = (opt.plainText === true) ? $(tooltipCont).text() : $(tooltipCont).html();
					}
				}

				// 1.6
				if (!tooltipCont) {
					me.__tooltip = undefined;
					return false;
				}

				// 1.7
				me.__tooltip.content = null;
				ns.set($(me), 'content', tooltipCont, true);

				window.tooltipIDX += 1;
				me.__tooltip.IDX = window.tooltipIDX;

				// 2.0 - Set up trigger listener
				ns.set($(me), 'trigger', me.__tooltip.trigger, true);

				return true;
			},

			init: function (elms) {
				params = undefined;

				/**
				 * Default event listeners:
				 * 		tooltip:hide
				 * 		tooltip:show
				 * 		tooltip:toggle
				 *
				 * You can override these events by using e.stopPropagation() in your event listener.
				 * This comes in handing if you want to change the hide/show animations or
				 *
				 * Note: Your listener must be specified before calling $.tooltip() on an element.
				 */
				elms.on('tooltip:hide', ns.on.hide);
				elms.on('tooltip:show', ns.on.show);
				elms.on('tooltip:toggle', ns.on.toggle);

				return elms.each(function () {

					// 0.0 - Default settings.
					var defaults = {
						classes: 'tooltip',
						content: null,
						persistent: false,
						plainText: false,
						position: 'top-center',
						target: 'body',
						trigger: 'hover',
						IDX: 0
					};

					var d = $(this).data();

					var me = this;
					me.__tooltip = $.extend(defaults, action);
					me.__tooltip = $.extend(me.__tooltip, d);

					// 0.1 - Set the target container if the value is 'parent'.
					if (typeof me.__tooltip.target === 'string' || !me.__tooltip.target) {
						if (me.__tooltip.target === 'parent' || !me.__tooltip.target) {
							me.__tooltip.target = $(me).parent();
						} else {
							me.__tooltip.target = $(me.__tooltip.target);
						}
					}

					var isTooltip = ns.tooltipize(me);

					if (isTooltip === true) {
						$(me).trigger("tooltip:initialized", [me.__tooltip.content]);
					}
				});
			},

			get: function () {
				var elms 	= arguments[0];
				var prop 	= arguments[1];
				var output;

				if (elms.length > 1) {
					output = [];
					elms.each(function () { output.push(this.__tooltip[prop]); });
				} else {
					output = elms[0].__tooltip[prop];
				}

				return output;
			},

			hide: function (elm) {
				if (elm.hasOwnProperty('type')) {
					elm = $(elm.target);
				}

				if (typeof elm[0].__tooltip === 'undefined') {
					return;
				}

				if (elm[0].__tooltip.content.attr('aria-hidden') === 'true') {
					return;
				}

				elm.trigger('tooltip:before.hide', [elm[0].__tooltip.content]);
				elm[0].__tooltip.content.attr('aria-hidden', 'true');
				elm.trigger('tooltip:hide', [elm[0].__tooltip.content]);
				elm.trigger('tooltip:after.hide', [elm[0].__tooltip.content]);
			},

			move: function (elm, pos) {

				if (typeof elm[0].__tooltip === 'undefined') {
					return;
				}

				pos 	= pos || elm[0].__tooltip.position;
				pos 	= pos || 'top-center';

				var target = elm[0].__tooltip.target;
				var tooltip = elm[0].__tooltip.content;
				var w, h, x, y, left, top;


				tooltip.removeClass('top-left top-right top-center')
					.removeClass('bottom-left bottom-right bottom-center')
					.removeClass('left-top left-bottom left-middle')
					.removeClass('right-top right-bottom right-middle')
					.addClass(pos.replace('auto-', ''));

				switch (pos) {
					case 'auto-top-center':
					case 'top-center':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= left + (elm.innerWidth() / 2);
						x 		-= tooltip.innerWidth() / 2;
						x 		= Math.floor(x);
						y 		= Math.floor(top - tooltip.outerHeight());

						if (y < 0 && pos === 'auto-top-center') {
							ns.move(elm, 'bottom-center');
							return;
						}
						break;

					case 'auto-top-right':
					case 'top-right':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= left + elm.outerWidth();
						x 		-= tooltip.outerWidth();
						x 		= Math.ceil(x);
						y 		= Math.floor(top - tooltip.outerHeight());

						if (y < 0 && pos === 'auto-top-right') {
							ns.move(elm, 'bottom-right');
							return;
						}
						break;

					case 'auto-top-left':
					case 'top-left':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= Math.ceil(left);
						y 		= Math.floor(top - tooltip.outerHeight());

						if (y < 0 && pos === 'auto-top-left') {
							ns.move(elm, 'bottom-left');
							return;
						}
						break;

					case 'auto-bottom-center':
					case 'bottom-center':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= left + (elm.outerWidth() / 2);
						x 		-= tooltip.outerWidth() / 2;
						x 		= Math.floor(x);
						y 		= Math.ceil(top + elm.outerHeight());

						h = y + tooltip.outerHeight();
						if (h > $(document).innerHeight() && pos === 'auto-bottom-center') {
							ns.move(elm, 'top-center');
							return;
						}
						break;

					case 'auto-bottom-right':
					case 'bottom-right':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= left + elm.outerWidth();
						x 		-= tooltip.outerWidth();
						x 		= Math.ceil(x);
						y 		= Math.ceil(top + elm.outerHeight());

						h = y + tooltip.outerHeight();
						if (h > $(document).innerHeight() && pos === 'auto-bottom-right') {
							ns.move(elm, 'top-right');
							return;
						}
						break;

					case 'auto-bottom-left':
					case 'bottom-left':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= Math.ceil(left);
						y 		= Math.ceil(top + elm.outerHeight());

						h = y + tooltip.outerHeight();
						if (h > $(document).innerHeight() && pos === 'auto-bottom-left') {
							ns.move(elm, 'top-left');
							return;
						}
						break;

					case 'auto-left-top':
					case 'left-top':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= Math.floor(left - tooltip.outerWidth());
						y 		= Math.floor(top);

						if (x < 0 && pos === 'auto-left-top') {
							ns.move(elm, 'right-top');
							return;
						}
						break;

					case 'auto-left-bottom':
					case 'left-bottom':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= Math.floor(left - tooltip.outerWidth());
						y 		= Math.ceil(top - tooltip.outerHeight() + elm.outerHeight());

						if (x < 0 && pos === 'auto-left-bottom') {
							ns.move(elm, 'right-bottom');
							return;
						}
						break;

					case 'auto-left-middle':
					case 'left-middle':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= Math.floor(left - tooltip.outerWidth());
						y 		= top + (elm.outerHeight() / 2);
						y 		-= tooltip.outerHeight() / 2;
						y 		= Math.floor(y);

						if (x < 0 && pos === 'auto-left-middle') {
							ns.move(elm, 'right-middle');
							return;
						}
						break;

					case 'auto-right-top':
					case 'right-top':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= Math.floor(left + elm.outerWidth());
						y 		= Math.floor(top);

						w = x + tooltip.outerWidth();
						if (w > $(window).innerWidth() && pos === 'auto-right-top') {
							ns.move(elm, 'left-top');
							return;
						}
						break;

					case 'auto-right-bottom':
					case 'right-bottom':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= Math.floor(left + elm.outerWidth());
						y 		= Math.ceil(top - tooltip.outerHeight() + elm.outerHeight());

						w = x + tooltip.outerWidth();
						if (w > $(window).innerWidth() && pos === 'auto-right-bottom') {
							ns.move(elm, 'left-bottom');
							return;
						}
						break;

					case 'auto-right-middle':
					case 'right-middle':
						left 	= (target.is('body') === true) ? elm.offset().left 	: elm[0].offsetLeft;
						top 	= (target.is('body') === true) ? elm.offset().top 	: elm[0].offsetTop;
						x 		= Math.floor(left + elm.outerWidth());
						y 		= top + (elm.outerHeight() / 2);
						y 		-= tooltip.outerHeight() / 2;
						y 		= Math.floor(y);

						w = x + tooltip.outerWidth();
						if (w > $(window).innerWidth() && pos === 'auto-right-middle') {
							ns.move(elm, 'left-middle');
							return;
						}
						break;
				}


				var c = {
					position: 'absolute',
					left: x + 'px',
					top: y + 'px'
				};

				tooltip.css(c);
			},

			set: function () {
				var elms 	= arguments[0];
				var prop 	= arguments[1];
				var val 	= arguments[2];
				var silent 	= arguments[3];

				elms.each(function () {
					var elm = $(this);

					if (silent !== true) {
						elm.trigger('tooltip:before.update', [elm[0].__tooltip.content, prop, val]);
					}

					switch (prop) {
						case 'classes':
							ns.setClasses(elm, val, silent);
							break;

						case 'content':
							ns.setContent(elm, val, silent);
							break;

						case 'trigger':
							ns.setTrigger(elm, val, silent);
							break;

						default:
							elm[0].__tooltip[prop] = val;
							if (silent !== true) {
								elm.trigger('tooltip:update', [elm[0].__tooltip.content, prop, val]);
							}
					}

					if (silent !== true) {
						elm.trigger('tooltip:after.update', [elm[0].__tooltip.content, prop, val]);
					}
				});
			},

			setClasses: function (elm, classes, silent) {
				elm.removeClass(elm[0].__tooltip.classes).addClass(classes);
				elm[0].__tooltip.classes = classes;
				if (silent !== true) {
					elm.trigger('tooltip:update', [elm[0].__tooltip.content, 'classes', classes]);
				}
			},

			setContent: function (elm, content, silent) {
				// 0.0 - Remove old content.
				if (elm[0].__tooltip.content !== null) {
					elm[0].__tooltip.content.remove();
				}

				// 0.1 - If null -> clear tooltip
				if (!content || content === '') {
					ns.setTrigger(elm, null, silent);
					elm[0].__tooltip = undefined;
					return;
				}

				// 0.1 - Add the content to the dom.
				elm[0].__tooltip.content = $('<div>'+content+'</div>').appendTo(elm[0].__tooltip.target);

				if (silent !== true) {
					elm.trigger('tooltip:update', [elm[0].__tooltip.content, 'content', content]);
				}

				// 0.2 - Add classes, role, and aria-hidden values.
				elm[0].__tooltip.content.addClass(elm[0].__tooltip.classes)
					.attr('role', 'tooltip')
					.attr('aria-hidden', 'true');

				// 1.8 - Set the tooltip control element -> elm
				elm[0].__tooltip.content[0].control = elm;

				// 1.9 - Hide the tooltip;
				elm[0].__tooltip.content.hide();
			},

			setTrigger: function (elm, trigger, silent) {
				// 0.0 - Valid triggers
				var tarr = ['click', 'focus', 'hover', 'manual', 'mouseover', 'mouseout', 'blur'];

				// 0.1 - Clear previous trigger
				var prevTrigger = elm[0].__tooltip.trigger;
				if (typeof prevTrigger !== 'undefined') {

					for (var i = 0; i < tarr.length; i++) {
						if (tarr[0] === 'manual') { continue; }
						elm.off(tarr[i], ns.on.trigger);
						elm.off(tarr[i], ns.on.untrigger);
					}
				}

				if (!trigger || trigger === '') { return; }

				// 1.0 - Parse the trigger string
				trigger = String(trigger).toLowerCase();
				trigger = (trigger === 'hover') ? 'mouseover' : trigger;

				// 1.1 - Validate if the trigger is allowed. No? Set it to 'focus'.
				trigger = (tarr.indexOf(trigger) > -1) ? trigger : 'focus';

				// 2.1 - Set the new value
				elm[0].__tooltip.trigger = trigger;

				if (silent !== true) {
					elm.trigger('tooltip:update', [elm[0].__tooltip.content, 'trigger', trigger]);
				}

				// 2.2 - Setup triggers if the value isn't "manual"
				if (trigger !== 'manual') { // 2.1

					elm.on(trigger, ns.on.trigger);

					switch (trigger) {
						case 'mouseover':
							elm.on('mouseout', ns.on.untrigger);
							break;

						case 'focus':
							elm.on('blur', ns.on.untrigger);
							break;
					}
				}
			},

			show: function (elm) {
				if (elm.hasOwnProperty('type')) {
					elm = $(elm.target);
				}

				if (typeof elm[0].__tooltip === 'undefined') {
					return;
				}

				if (elm[0].__tooltip.content.attr('aria-hidden') === 'false') {
					return;
				}

				ns.move(elm);
				elm.trigger('tooltip:before.show', [elm[0].__tooltip.content]);
				elm[0].__tooltip.content.attr('aria-hidden', 'false');
				elm.trigger('tooltip:show', [elm[0].__tooltip.content]);
				elm.trigger('tooltip:after.show', [elm[0].__tooltip.content]);
			},

			toggle: function (elm) {
				if (elm.hasOwnProperty('type')) {
					elm = $(elm.target);
				}

				if (typeof elm[0].__tooltip === 'undefined') {
					return;
				}

				var status = elm[0].__tooltip.content.attr('aria-hidden');
				status = (status === true || status === 'true') ? 'false' : 'true';


				if (status === 'false') {

					// close tooltips accept this one
					var tooltips = $('[role="tooltip"]');
					tooltips.each(function () {

						var isTooltip = Boolean(typeof this.control !== 'undefined');
						if (isTooltip !== true) { return; }

						if (this.control[0].__tooltip.persistent === true) {
							return;
						}

						if (this.control[0].__tooltip.IDX === elm[0].__tooltip.IDX) { return; }
						this.control.blur();
						this.control.tooltip('hide');
					});
				}

				if (status === 'false') { ns.move(elm); }
				elm.trigger('tooltip:before.toggle', [elm[0].__tooltip.content, status]);
				elm[0].__tooltip.content.attr('aria-hidden', status);
				elm.trigger('tooltip:toggle', [elm[0].__tooltip.content, status]);
				elm.trigger('tooltip:after.toggle', [elm[0].__tooltip.content, status]);
			},

			on: {

				hide: function (e, tooltip) {
					tooltip.stop();
					tooltip.fadeOut(250);
				},

				show: function (e, tooltip) {
					tooltip.stop();
					tooltip.fadeIn(250);
				},

				toggle: function (e, tooltip) {
					tooltip.stop();
					tooltip.fadeToggle(250);
				},

				trigger: function (e) {
					if (typeof e.target.__tooltip === 'undefined') { return; }

					if ($(this).is('a') && e.type === 'click') {
						e.preventDefault();
					}

					if (e.target.__tooltip.persistent === true) {
						ns.show($(this));
					} else {
						ns.toggle($(this));
					}
				},

				untrigger: function (e) {
					if (e.target.__tooltip.persistent === true) {
						return;
					}
					ns.hide($(e.target));
				}
			}
		};

		switch (action) {

			case 'close':
			case 'hide':
				ns.hide($(this));
				break;

			case 'open':
			case 'show':
				ns.show($(this));
				break;

			case 'redraw':
				ns.move($(this));
				break;

			case 'set':
				ns.set.apply(this, [this, params]);
				break;

			case 'get':
				ns.get.apply(this, [this, params]);
				break;

			case 'toggle':
				ns.toggle($(this));
				break;

			default:
				return ns.init(this);
		}
	};

	// Default dismiss button query
	var onTooltipDismissClick = function (e) {
		if (e) { e.preventDefault(); }

		// 1.0 - Find the tooltip container
		var qry = $(e.target).closest('[role="tooltip"]');
		if (qry.length > 0) {
			if (typeof qry[0].control !== 'undefined') {
				qry[0].control.tooltip('hide');
			}
		}
	};
	$('[data-dismiss="tooltip"]').on('click', onTooltipDismissClick);

	// Dismiss tooltips when clicking outside container
	var onTooltipOutsideEvent = function (e) {

		var tooltips;

		/**
		 * Validate if the e.target is a tooltip button.
		 * If so: return.
		 */
		var isTooltipButton = Boolean(typeof e.target.__tooltip !== 'undefined');
		if (isTooltipButton === true) {
			return;
		}

		var isTooltipDismiss = Boolean($(e.target).data('dismiss') === 'tooltip');
		if (isTooltipDismiss === true) {
			onTooltipDismissClick(e);
			return;
		}

		/**
		 * Validate if the click event happened within a [role="tooltip"] element.
		 * If it didn't: close the tooltips that don't have persistent set to true.
		 */
		var closest = $(e.target).closest('[role="tooltip"]');
		var isTooltipContainer = Boolean(closest.length > 0);
		if (isTooltipContainer !== true) {
			tooltips = $('[role="tooltip"]');
			tooltips.each(function () {
				var isTooltip = Boolean(typeof this.control !== 'undefined');
				if (isTooltip !== true) { return; }
				if (this.control[0].__tooltip.persistent !== true) {
					this.control.tooltip('hide');
				}
			});
		} else {
			closest[0].control.tooltip('show');
		}
	};
	$(document).on('click', onTooltipOutsideEvent);

	// Reposition tooltips on window.resize event
	var onTooltipResize = function () {
		var tooltips = $('[role="tooltip"]');
		tooltips.each(function () {
			var isTooltip = Boolean(typeof this.control !== 'undefined');
			if (isTooltip !== true) { return; }
			this.control.tooltip('redraw');
		});
	};
	$(window).on('resize', onTooltipResize);

	// Default initialization query
	$('[data-toggle="tooltip"]').tooltip();
}(window.jQuery));
