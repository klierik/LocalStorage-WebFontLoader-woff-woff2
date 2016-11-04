function loadFonts(fontsArray, options) {

	var fonts   = fontsArray,
		options = mergeObject({
		// If false: font will append into page only if it was previously stored into LocalStorage
		// So font will append when customer refresh the page (prevent text blinking when with custom font usage)
		// If true: append font immediately after font loading finish
		appendFontWhenLoaded: false
		, loadWhenDomLoaded:  true				// Start load font only after DOMContentLoaded event fired. If false: load after init()
		, async:              true 				// Load fonts via async
		, prefix:             'font-storage-' 	// Storage prefix
		, postfixUrl:         '-url'			// Storage Css postfix
		, postfixCss:         '-css'			// Storage Url postfix
		, debug:              false				// Enable debug mode
		}, options),
		loSto   = {};

	function init() {
		if (!checkBrowserSupport()) {
			return false
		}

		prepare();

		if (options.loadWhenDomLoaded) {
			document.addEventListener("DOMContentLoaded", storeAllFonts);
		} else {
			storeAllFonts();
		}
	}


	function checkBrowserSupport() {
		// 0.1 Check for Browser support
		var nua           = navigator.userAgent
			, noSupport   = !window.addEventListener // IE8 и ниже
			|| (nua.match(/(Android (2|3|4.0|4.1|4.2|4.3))|(Opera (Mini|Mobi))/) && !nua.match(/Chrome/)) // Android Stock Browser до 4.4 и Opera Mini
			, noLsSupport = false;

		// 0.2 Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
		// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
		// to avoid the entire page breaking, without having to do a check at each usage of Storage.
		// https://gist.github.com/philfreo/68ea3cd980d72383c951
		if (typeof localStorage === 'object') {
			try {
				localStorage.setItem('localStorage', 1);
				localStorage.removeItem('localStorage');
			} catch (error) {
				Storage.prototype._setItem = Storage.prototype.setItem;
				Storage.prototype.setItem  = function () {
				};
				echo(error);
				echo('Your web browser does not support storing settings locally.');

				noLsSupport = true;
			}
		}

		if (noSupport || noLsSupport) {
			return false;
		}

		return true;
	}

	function prepare() {
		// 1. Prepare localStorage
		try {
			// Set helper variable for localStorage
			// this can be helpful when cookies disable or browser denied access to it.
			// Instead we can get some exceptions which stop fonts loading
			loSto = localStorage || {};
		} catch (error) {
			echo(error);
		}
	}

	function storeAllFonts() {
		var arr = fonts;

		// Check for fonts qty
		// We can use Single font loader or Multiple fonts loading
		if (typeof arr[0] === 'string' || arr[0] instanceof String) {

			// Single loader
			storeFont(getFontParams(arr))
		} else {

			// Multiple loader
			// Loop all fonts through one by one
			arr.forEach(function (font) {
				storeFont(getFontParams(font))
			})
		}
	}

	function appendFont(styleCss) {
		// 2. Create <style> element and use it for font encoded in base64
		var styleElement = document.createElement('style');
		styleElement.rel = 'stylesheet';
		document.head.appendChild(styleElement);
		styleElement.textContent = styleCss;
	}

	function storeFont(font) {
		if (!isFontStored(font)) {
			// If font not stored already — load it
			loadFont(font)
		}
	}

	function isFontStored(font) {
		// 3. Check if font already stored in LocalStorage
		if (loSto[font.storedCss] && (loSto[font.storedUrl] === font.woffUrl || loSto[font.storedUrl] === font.woff2Url)) {

			// yes, font already stored in LocalStorage
			// so lets append it into page :)

			// 4. Append font
			appendFont(loSto[font.storedCss]);
		} else {
			return false;
		}
	}

	function loadFont(font) {
		// Font not stored in LocalStorage
		// so let's load it

		// 5. But we check for WOFF2 support by browser
		var url = (font.woff2Url && checkWoff2Support())
			? font.woff2Url // yeap, WOFF2 support present
			: font.woffUrl; // damn it, we use WOFF instead

		// 6. Open request and download font
		var request = new XMLHttpRequest();
		request.open('GET', url, options.async);
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {

				// 7. Update LocalStorage with new font data
				loSto[font.storedUrl] = url;					// Store URL
				loSto[font.storedCss] = request.responseText;	// Story css style with font

				if (options.appendFontWhenLoaded) {
					appendFont(request.responseText);
				}
			} else {
				echo(request.responseText)
			}
		};

		request.send();
	}

	function getFontParams(font) {
		// Parse font array data
		return {
			name:        font[0]
			, woffUrl:   font[1]
			, woff2Url:  font[2]
			, storedCss: options.prefix + font[0] + options.postfixCss
			, storedUrl: options.prefix + font[0] + options.postfixUrl
		}
	}

	// Source: https://github.com/filamentgroup/woff2-feature-test
	function checkWoff2Support() {
		if (!( "FontFace" in window )) {
			return false;
		}

		var f = new FontFace('t', 'url( "data:application/font-woff2;base64,d09GMgABAAAAAADcAAoAAAAAAggAAACWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoUNAE2AiQDCAsGAAQgBSAHIBtvAcieB3aD8wURQ+TZazbRE9HvF5vde4KCYGhiCgq/NKPF0i6UIsZynbP+Xi9Ng+XLbNlmNz/xIBBqq61FIQRJhC/+QA/08PJQJ3sK5TZFMlWzC/iK5GUN40psgqvxwBjBOg6JUSJ7ewyKE2AAaXZrfUB4v+hze37ugJ9d+DeYqiDwVgCawviwVFGnuttkLqIMGivmDg" ) format( "woff2" )', {});
		f.load()['catch'](function () {
		});

		return f.status == 'loading' || f.status == 'loaded';
	}

	// echo errors and notifications in debug mode
	function echo(message) {
		if (options.debug) {
			console.log(message);
		}
	}

	// Recursively merge properties of two objects — http://stackoverflow.com/a/383245
	function mergeObject(obj1, obj2) {

		for (var p in obj2) {
			try {
				// Property in destination object set; update its value.
				if (obj2[p].constructor == Object) {
					obj1[p] = mergeObject(obj1[p], obj2[p]);

				} else {
					obj1[p] = obj2[p];

				}

			} catch (e) {
				// Property in destination object not set; create it and set its value.
				obj1[p] = obj2[p];

			}
		}

		return obj1;
	}

	// Run Forrest run :)
	init();
}
