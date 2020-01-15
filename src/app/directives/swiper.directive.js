/* jshint esversion: 6 */

const DEFAULT_SWIPER_OPTIONS = {
	slidesPerView: 'auto',
	spaceBetween: 1,
	centeredSlides: true,
	loop: false,
	loopAdditionalSlides: 100,
	speed: 600,
	autoplay: {
		delay: 8000,
	},
	keyboard: {
		enabled: true,
		onlyInViewport: true,
	},
	mousewheelControl: false,
	onSlideClick: function(swiper) {
		angular.element(swiper.clickedSlide).scope().clicked(angular.element(swiper.clickedSlide).scope().$index);
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
};

export class SwiperDirective {

	constructor() {
		this.restrict = 'A';
		this.options = DEFAULT_SWIPER_OPTIONS;
	}

	link(scope, element, attributes, controller) {
		scope.$on('lastItem', (slide) => {
			this.onSwiper(element);
		});
		scope.$on('$destroy', () => {
			if (element.swiper) {
				element.swiper.destroy();
				// console.log('swiper.destroy');
			}
		});
		scope.$watch('$viewContentLoaded', () => {
			this.onSwiper(element);
		});
		scope.$on('onResize', ($scope) => {
			if (element.swiper) {
				element.swiper.update();
			}
		});
	}

	onSwiper(element) {
		if (element.swiper) {
			element.swiper.update();
		} else {
			element.swiper = new Swiper(element, this.options);
			element.addClass('swiper-init');
		}
	}

	static factory() {
		return new SwiperDirective();
	}

}

SwiperDirective.factory.$inject = [];

export class SwiperHeroDirective extends SwiperDirective {

	constructor() {
		super();
		this.options = {
			speed: 600,
			parallax: true,
			autoplay: {
				delay: 8000,
			},
			loop: false,
			spaceBetween: 0,
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
			mousewheelControl: false,
			onSlideClick: function(swiper) {
				angular.element(swiper.clickedSlide).scope().clicked(angular.element(swiper.clickedSlide).scope().$index);
			},
			on: {
				setTransition: function() {},
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		};
	}

	static factory() {
		return new SwiperHeroDirective();
	}

}

SwiperHeroDirective.factory.$inject = [];
