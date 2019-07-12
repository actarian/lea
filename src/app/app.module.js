﻿/* jshint esversion: 6 */
/* global window, document, angular, Swiper, TweenMax, TimelineMax */

import AppearDirective from './directives/appear.directive';
import AutocompleteDirective from './directives/autocomplete.directive';
import GlslCanvasDirective from './directives/glsl-canvas.directive';
import HasDropdownDirective from './directives/has-dropdown.directive';
import HeaderDirective from './directives/header.directive';
import HeroDirective from './directives/hero.directive';
import HilightDirective from './directives/hilight.directive';
import HrefDirective from './directives/href.directive';
import { LastItemDirective } from './directives/last-item.directive';
import LazyScriptDirective from './directives/lazy-script.directive';
import LazyDirective from './directives/lazy.directive';
import MediaDirective from './directives/media.directive';
import { MuuriDirective } from './directives/muuri.directive';
import ParallaxOuterDirective from './directives/parallax-outer.directive';
import ParallaxOuter2Directive from './directives/parallax-outer2.directive';
import ParallaxDirective from './directives/parallax.directive';
import ScrollDirective from './directives/scroll.directive';
import ScrollableDirective from './directives/scrollable.directive';
import StickyDirective from './directives/sticky.directive';
import { SwiperGalleryDirective, SwiperHeroDirective, SwiperProjectsDirective, SwiperTileDirective } from './directives/swiper.directive';
import TitleDirective from './directives/title.directive';
// import TransitionDirective from './directives/transition.directive';
import VideoDirective from './directives/video.directive';
import VirtualScrollDirective from './directives/virtual-scroll.directive';
import VisibilityDirective from './directives/visibility.directive';
import WishlistDirective from './directives/wishlist.directive';
import ZoomableDirective from './directives/zoomable.directive';
import { ImageWithFeatures } from './filters/image-with-features.filter';
import { NotInFilter } from './filters/notIn.filter';
import { TrustedFilter } from './filters/trusted.filter';
import ControlMessagesDirective from './forms/control-messages.directive';
import ControlDirective from './forms/control.directive';
import ValidateDirective from './forms/validate.directive';
import GalleryCtrl from './gallery/gallery.controller';
import HighwayDirective from './highway/highway.directive';
import MoodboardDropdownDirective from './moodboard/moodboard-dropdown.directive';
import MoodboardSearchDirective from './moodboard/moodboard-search.directive';
import RootCtrl from './root.controller';
import ApiService from './services/api.service';
import DomService from './services/dom.service';
import WishlistService from './services/wishlist.service';
import LocationService from './shared/location.service';
import PromiseService from './shared/promise.service';
import StateService from './shared/state.service';
import { CookieService, LocalStorageService, SessionStorageService } from './shared/storage.service';

/*
import FaqCtrl from './faq/faq.controller';
import MagazineCtrl from './magazine/magazine.controller';
import MoodboardSectionCtrl from './moodboard/moodboard-section.controller';
import MoodboardCtrl from './moodboard/moodboard.controller';
import NewsCtrl from './news/news.controller';
import ReferencesCtrl from './references/references.controller';
import StoreLocatorCtrl from './store-locator/store-locator.controller';
import WishlistCtrl from './wishlist/wishlist.controller';
*/

const MODULE_NAME = 'app';

const app = angular.module(MODULE_NAME, ['ngSanitize', 'jsonFormatter']);

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('*');
}]);

app.factory('ApiService', ApiService.factory)
	.factory('DomService', DomService.factory)
	.factory('LocationService', LocationService.factory)
	.factory('PromiseService', PromiseService.factory)
	.factory('StateService', StateService.factory)
	.factory('CookieService', CookieService.factory)
	.factory('LocalStorageService', LocalStorageService.factory)
	.factory('SessionStorageService', SessionStorageService.factory)
	.factory('WishlistService', WishlistService.factory);

app.directive('appear', AppearDirective.factory)
	.directive('control', ControlDirective.factory)
	.directive('controlMessages', ControlMessagesDirective.factory)
	.directive('glslCanvas', GlslCanvasDirective.factory)
	.directive('hasDropdown', HasDropdownDirective.factory)
	.directive('header', HeaderDirective.factory)
	.directive('hero', HeroDirective.factory)
	.directive('highway', HighwayDirective.factory)
	.directive('hilight', HilightDirective.factory)
	.directive('href', HrefDirective.factory)
	.directive('lastItem', LastItemDirective.factory)
	.directive('lazy', LazyDirective.factory)
	.directive('lazyScript', LazyScriptDirective.factory)
	.directive('media', MediaDirective.factory)
	.directive('moodboardDropdown', MoodboardDropdownDirective.factory)
	.directive('moodboardSearch', MoodboardSearchDirective.factory)
	.directive('muuri', MuuriDirective.factory)
	.directive('parallax', ParallaxDirective.factory)
	.directive('parallaxOuter', ParallaxOuterDirective.factory)
	.directive('parallaxOuter2', ParallaxOuter2Directive.factory)
	.directive('scroll', ScrollDirective.factory)
	.directive('scrollable', ScrollableDirective.factory)
	.directive('selectWithAutocomplete', AutocompleteDirective.factory)
	.directive('sticky', StickyDirective.factory)
	.directive('swiperGallery', SwiperGalleryDirective.factory)
	.directive('swiperHero', SwiperHeroDirective.factory)
	.directive('swiperProjects', SwiperProjectsDirective.factory)
	.directive('swiperTile', SwiperTileDirective.factory)
	.directive('title', TitleDirective.factory)
	.directive('validate', ValidateDirective.factory)
	.directive('video', VideoDirective.factory)
	.directive('virtualScroll', VirtualScrollDirective.factory)
	.directive('visibility', VisibilityDirective.factory)
	.directive('wishlist', WishlistDirective.factory)
	// .directive('transition', TransitionDirective.factory)
	.directive('zoomable', ZoomableDirective.factory);

app.controller('RootCtrl', RootCtrl)
	.controller('GalleryCtrl', GalleryCtrl);
/*
	.controller('AdvancedSearchCtrl', AdvancedSearchCtrl)
	.controller('CollectionsCtrl', CollectionsCtrl)
	.controller('ContactsCtrl', ContactsCtrl)
	.controller('FaqCtrl', FaqCtrl)
	.controller('MagazineCtrl', MagazineCtrl)
	.controller('MoodboardCtrl', MoodboardCtrl)
	.controller('MoodboardSectionCtrl', MoodboardSectionCtrl)
	.controller('NewsCtrl', NewsCtrl)
	.controller('ReferencesCtrl', ReferencesCtrl)
	.controller('StoreLocatorCtrl', StoreLocatorCtrl)
	.controller('WishlistCtrl', WishlistCtrl);
	*/

app.filter('imageWithFeatures', [ImageWithFeatures])
	.filter('notIn', ['$filter', NotInFilter])
	.filter('trusted', ['$sce', TrustedFilter]);

// app.run(['$compile', '$timeout', '$rootScope', function($compile, $timeout, $rootScope) {}]);

app.run(['$compile', '$timeout', '$rootScope', function($compile, $timeout, $rootScope) {
	$rootScope.first = true;
	$rootScope.firstView = document.querySelector('.view').cloneNode(true);
	// console.log('$rootScope.firstView', $rootScope.firstView);
}]);

export default MODULE_NAME;
