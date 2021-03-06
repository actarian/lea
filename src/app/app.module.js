/* jshint esversion: 6 */

import CollectionsCtrl from './collections/collections.controller';
import ColorsCtrl from './colors/colors.controller';
import ContactsCtrl from './contacts/contacts.controller';
import ContactStoreCtrl from './contactStore/contactStore.controller';
import LoginCtrl from './contacts/login.controller';
import AbstractDirective from './directives/abstract.directive';
import AppearDirective from './directives/appear.directive';
import AutocompleteDirective from './directives/autocomplete.directive';
// import GalleryItemDirective from './directives/gallery-item.directive';
import CookiesDirective from './directives/cookies.directive';
import FancyboxGalleryDirective from "./directives/fancybox-gallery.directive";
import FaqDirective from './directives/faq.directive';
import HasDropdownDirective from './directives/has-dropdown.directive';
import HeaderDirective from './directives/header.directive';
import HeroDirective from './directives/hero.directive';
import HilightDirective from './directives/hilight.directive';
import HrefDirective from './directives/href.directive';
import LabelDirective from './directives/label.directive';
import { LastItemDirective } from './directives/last-item.directive';
import LazyScriptDirective from './directives/lazy-script.directive';
import LazyDirective from './directives/lazy.directive';
import MediaDirective from './directives/media.directive';
import { MuuriDirective } from './directives/muuri.directive';
import NoBounceDirective from './directives/no-bounce.directive';
import NoHeroDirective from './directives/no-hero.directive';
import ParallaxOuterDirective from './directives/parallax-outer.directive';
import ParallaxDirective from './directives/parallax.directive';
import ScrollDirective from './directives/scroll.directive';
import ScrollableDirective from './directives/scrollable.directive';
import ShareDirective from './directives/share.directive';
import SliderDirective from './directives/slider.directive';
import SmoothScrollDirective from './directives/smooth-scroll.directive';
import SplitDirective from './directives/split.directive';
import StickyDirective from './directives/sticky.directive';
import { SwiperDirective, SwiperHeroDirective } from './directives/swiper.directive';
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
import NewsletterCtrl from './newsletter/newsletter.controller';
import ProjectsCtrl from './projects/projects.controller';
import RootCtrl from './root.controller';
import SearchCtrl from './search/search.controller';
import ApiService from './services/api.service';
import DomService from './services/dom.service';
import IntersectionService from './services/intersection.service';
import WishlistService from './services/wishlist.service';
import LocationService from './shared/location.service';
import PromiseService from './shared/promise.service';
import StateService from './shared/state.service';
import { CookieService, LocalStorageService, SessionStorageService } from './shared/storage.service';
import StoreLocatorCtrl from './store-locator/store-locator.controller';

const MODULE_NAME = 'lea';

const app = angular.module(MODULE_NAME, ['ngSanitize', 'jsonFormatter']);

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true).hashPrefix('*');
}]);

app.factory('ApiService', ApiService.factory)
	.factory('DomService', DomService.factory)
	.factory('IntersectionService', IntersectionService.factory)
	.factory('LocationService', LocationService.factory)
	.factory('PromiseService', PromiseService.factory)
	.factory('StateService', StateService.factory)
	.factory('CookieService', CookieService.factory)
	.factory('LocalStorageService', LocalStorageService.factory)
	.factory('SessionStorageService', SessionStorageService.factory)
	.factory('WishlistService', WishlistService.factory);

app.directive('abstract', AbstractDirective.factory)
	.directive('appear', AppearDirective.factory)
	.directive('control', ControlDirective.factory)
	.directive('controlMessages', ControlMessagesDirective.factory)
	.directive('cookies', CookiesDirective.factory)
	.directive('fancyboxGallery', FancyboxGalleryDirective.factory)
	.directive('faq', FaqDirective.factory)
	// .directive('galleryItem', GalleryItemDirective.factory)
	.directive('hasDropdown', HasDropdownDirective.factory)
	.directive('header', HeaderDirective.factory)
	.directive('hero', HeroDirective.factory)
	.directive('noHero', NoHeroDirective.factory)
	.directive('highway', HighwayDirective.factory)
	.directive('hilight', HilightDirective.factory)
	.directive('href', HrefDirective.factory)
	.directive('label', LabelDirective.factory)
	.directive('lastItem', LastItemDirective.factory)
	.directive('lazy', LazyDirective.factory)
	.directive('lazyScript', LazyScriptDirective.factory)
	.directive('media', MediaDirective.factory)
	.directive('moodboardDropdown', MoodboardDropdownDirective.factory)
	.directive('moodboardSearch', MoodboardSearchDirective.factory)
	.directive('muuri', MuuriDirective.factory)
	.directive('noBounce', NoBounceDirective.factory)
	.directive('parallax', ParallaxDirective.factory)
	.directive('parallaxOuter', ParallaxOuterDirective.factory)
	.directive('scroll', ScrollDirective.factory)
	.directive('scrollable', ScrollableDirective.factory)
	.directive('selectWithAutocomplete', AutocompleteDirective.factory)
	.directive('share', ShareDirective.factory)
	.directive('slider', SliderDirective.factory)
	.directive('sticky', StickyDirective.factory)
	.directive('split', SplitDirective.factory)
	.directive('swiper', SwiperDirective.factory)
	.directive('swiperHero', SwiperHeroDirective.factory)
	.directive('validate', ValidateDirective.factory)
	.directive('video', VideoDirective.factory)
	.directive('virtualScroll', VirtualScrollDirective.factory)
	.directive('smoothScroll', SmoothScrollDirective.factory)
	.directive('visibility', VisibilityDirective.factory)
	.directive('wishlist', WishlistDirective.factory)
	.directive('zoomable', ZoomableDirective.factory);

app.controller('RootCtrl', RootCtrl)
	.controller('ContactsCtrl', ContactsCtrl)
	.controller('ContactStoreCtrl', ContactStoreCtrl)
	.controller('LoginCtrl', LoginCtrl)
	.controller('CollectionsCtrl', CollectionsCtrl)
	.controller('ColorsCtrl', ColorsCtrl)
	.controller('GalleryCtrl', GalleryCtrl)
	.controller('NewsletterCtrl', NewsletterCtrl)
	.controller('ProjectsCtrl', ProjectsCtrl)
	.controller('SearchCtrl', SearchCtrl)
	.controller('StoreLocatorCtrl', StoreLocatorCtrl);

app.filter('imageWithFeatures', [ImageWithFeatures])
	.filter('notIn', ['$filter', NotInFilter])
	.filter('trusted', ['$sce', TrustedFilter]);

// app.run(['$compile', '$timeout', '$rootScope', function($compile, $timeout, $rootScope) {}]);

app.run(['$compile', '$timeout', '$rootScope', function($compile, $timeout, $rootScope) {
	DomService.detect();
	$rootScope.first = true;
	$rootScope.firstView = document.querySelector('.view').cloneNode(true);
}]);

export default MODULE_NAME;
