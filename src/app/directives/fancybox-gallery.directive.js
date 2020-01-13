/* jshint esversion: 6 */

export default class FancyboxGalleryDirective {

	constructor() {
		this.restrict = 'A';
	}

	link(scope, element, attributes, controller) {
		$('.fancybox', element).fancybox({
			closeBtn: false,
			hash: false,
			afterLoad: function () {
				var $pin = this.$thumb.siblings('.label');

				if (!$pin.length) {
					return;
				}

				var _this = this;
				$pin.each(function (i, el) {
					_this.$content.append($(el).clone()[0]);
				});
			}
		}).addClass('fancyboxed');
	}

	static factory() {
		return new FancyboxGalleryDirective();
	}

}

FancyboxGalleryDirective.factory.$inject = [];
