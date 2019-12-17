/* jshint esversion: 6 */

export default class FancyboxGalleryDirective {

	constructor() {
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		$('.fancybox', element).fancybox({
			closeBtn: false,
			afterLoad: function () {
				var $pin = $('.label', this.element);

				if (!$pin.length) {
					return;
				}

				var _this = this;
				$pin.each(function (i, el) {
					$($(el).clone()[0]).appendTo(_this.inner);
				});
			}
		}).addClass('fancyboxed');
	}

	static factory() {
		return new FancyboxGalleryDirective();
	}

}

FancyboxGalleryDirective.factory.$inject = [];
