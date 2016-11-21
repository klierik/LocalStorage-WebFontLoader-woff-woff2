/**
 * Async WebFontLoader with woff/2 support
 * https://github.com/klierik/LocalStorage-WebFontLoader-woff-woff2
 * 
 * v.1.0.0
 * */

(function () {
	var loader = {
		options: {
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
		},

		storage: null,

		init: function(fontsArr, options){
			this.options = this.extend(this.options, options);
			this.storage = this.getStorage();

			fontsArr.forEach(function(font){
				font = this.extend({
					storedCss: this.options.prefix + font.name + this.options.postfixCss,
					storedUrl: this.options.prefix + font.name + this.options.postfixUrl,
					url: font.woff2Url && this.isWoff2Supported() ? font.woff2Url : font.woffUrl
				}, font);

				if(this.isFontLoaded(font)) {
					this.appendFont(this.storage[font.storedCss]);
					return;
				};

				this.storeFont(font);
			}, this);
		},

		getStorage: function(){
			if(!window.localStorage) {
				throw new Error('localStorage not supported');
			}

			window.localStorage.setItem('__storage_test__', '1');
			window.localStorage.removeItem('__storage_test__');

			return window.localStorage;
		},

		isFontLoaded: function(font){
			return this.storage[font.storedCss] && this.storage[font.storedUrl] === font.url;
		},

		storeFont: function(font){
			if (this.options.loadWhenDomLoaded) {
				document.addEventListener("DOMContentLoaded", function () {
					this._loadFont(font)
				}.apply(this));
			} else {
				this._loadFont(font)
			}
		},

		_loadFont: function(font){
			var request = new XMLHttpRequest();
			request.open('GET', font.url, this.options.async);
			request.onload = function () {

				if(request.readyState === XMLHttpRequest.DONE) {
					if (request.status >= 200 && request.status < 400) {
						this.storage[font.storedUrl] = font.url;
						this.storage[font.storedCss] = request.responseText;

						if (this.options.appendFontWhenLoaded) {
							this.appendFont(request.responseText);
						}

					} else {
						throw new Error(request.responseText);
					}
				}
			}.bind(this);

			request.send();
		},

		appendFont: function(css){
			var styleElement = document.createElement('style');
			styleElement.rel = 'stylesheet';
			document.head.appendChild(styleElement);
			styleElement.textContent = css;
		},

		extend: function(target, source){
			for (var property in source) {
				try {
					// Property in destination object set; update its value.
					if (source[property].constructor == Object) {
						target[property] = this.extend(target[property], source[property]);

					} else {
						target[property] = source[property];

					}

				} catch (e) {
					// Property in destination object not set; create it and set its value.
					target[property] = source[property];

				}
			}

			return target;
		},

		isWoff2Supported: function () {
			if (!( "FontFace" in window )) {
				return false;
			}

			var f = new FontFace('t', 'url( "data:application/font-woff2;base64,d09GMgABAAAAAADcAAoAAAAAAggAAACWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoUNAE2AiQDCAsGAAQgBSAHIBtvAcieB3aD8wURQ+TZazbRE9HvF5vde4KCYGhiCgq/NKPF0i6UIsZynbP+Xi9Ng+XLbNlmNz/xIBBqq61FIQRJhC/+QA/08PJQJ3sK5TZFMlWzC/iK5GUN40psgqvxwBjBOg6JUSJ7ewyKE2AAaXZrfUB4v+hze37ugJ9d+DeYqiDwVgCawviwVFGnuttkLqIMGivmDg" ) format( "woff2" )', {});
			f.load().catch(function () {
				//
			});

			return f.status == 'loading' || f.status == 'loaded';
		}
	};


	window.loadFonts = function(fontArray, options){
		try {
			loader.init(fontArray, options);
		} catch(error) {
			throw new Error(error);
		}
	};

})();
