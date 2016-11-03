function loadFonts(fontsArray, options) {

	var fonts   = fontsArray,
		options = mergeObject({
			appendFontWhenLoad:  false 				// Immediately append font after load
			, loadWhenDomLoaded: true				// Start load font only after DOMContentLoaded event fired. If false: load after init()
			, async:             true 				// Load fonts via async
			, prefix:            'font-storage-' 	// Storage prefix
			, postfixUrl:        '-url'				// Storage Css postfix
			, postfixCss:        '-css'				// Storage Url postfix
			, debug:             false				// Enable debug mode
		}, options),
		loSto   = {};


	function init() {
		if (!checkBrowserSupport()) {
			return false
		}

		prepare();

		if(options.loadWhenDomLoaded) {
			document.addEventListener("DOMContentLoaded", storeAllFonts);
		} else {
			storeAllFonts();
		}
	}


	function checkBrowserSupport() {
		// 0.1 Многие неподдерживаемые браузеры должны останавливать работу тут.
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
				echo('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');

				noLsSupport = true;
			}
		}

		if (noSupport || noLsSupport) {
			return false;
		}

		return true;
	}

	function prepare() {
		// 1. Настраиваем localStorage
		try {
			// Устанавливаем вспомогательную переменную для помощи с localStorage,
			// например, для случаев когда cookies отключены и браузер не даёт к ним доступа.
			// Иначе могут быть получены исключения, которые полностью остановят загрузку шрифтов.
			loSto = localStorage || {};
		} catch (error) {
			echo(error);
		}
	}

	function storeAllFonts() {
		var array = fonts;

		// Перебираем все добавленые шрифты по одному
		array.forEach(function (font) {
			storeFont(getFontParams(font))
		})
	}

	function appendFont(styleCss) {
		console.log(styleCss);
		// 2. Создаём элемент <style>, который мы используем для вставки шрифта, закодированного в base64.
		var styleElement = document.createElement('style');
		styleElement.rel = 'stylesheet';
		document.head.appendChild(styleElement);
		// Из-за ошибок IE9 установка styleElement.textContent должна быть после этой строки.
		styleElement.textContent = styleCss;
	}

	function storeFont(font) {
		if (!isFontStored(font)) {
			loadFont(font)
		}
	}

	function isFontStored(font) {
		// 3. Проверяем, находится ли шрифт уже в localStorage и последней ли он версии.
		if (loSto[font.storedCss] && (loSto[font.storedUrl] === font.woffUrl || loSto[font.storedUrl] === font.woff2Url)) {
			// css до сих пор в localStorage
			// и были загружены из одного из текущих адресов

			// 4. Применяем стили шрифта.
			appendFont(loSto[font.storedCss]);
		} else {
			return false;
		}
	}

	function loadFont(font) {
		// Данных нет, или они загружены с устаревшего URL,
		// поэтому мы должны загрузить их снова.

		// 5. Проверяем поддержку WOFF2 чтобы узнать, какой URL использовать.
		var url = (font.woff2Url && checkWoff2Support())
			? font.woff2Url // WOFF2 URL передан в функцию и поддерживается.
			: font.woffUrl; // Поддерживается только WOFF.

		// 6. Получаем данные с сервера.
		var request = new XMLHttpRequest();
		request.open('GET', url, options.async);
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				// 7. Обновляем localStorage новыми данными и применяем стили шрифта.
				loSto[font.storedUrl] = url;
				loSto[font.storedCss] = request.responseText;

				if (options.appendFontWhenLoad) {
					// Применить шрифт сразу после его загрузки
					appendFont(request.responseText);
				}
			} else {
				echo(request.responseText)
			}
		};

		request.send();
	}

	function getFontParams(font) {
		return {
			name:        font[0]
			, woffUrl:   font[1]
			, woff2Url:  font[2]
			, storedCss: options.prefix + font[0] + options.postfixCss
			, storedUrl: options.prefix + font[0] + options.postfixUrl
		}
	}

	function checkWoff2Support() {
		// Источник: https://github.com/filamentgroup/woff2-feature-test
		if (!( "FontFace" in window )) {
			return false;
		}

		var f = new FontFace('t', 'url( "data:application/font-woff2;base64,d09GMgABAAAAAADcAAoAAAAAAggAAACWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoUNAE2AiQDCAsGAAQgBSAHIBtvAcieB3aD8wURQ+TZazbRE9HvF5vde4KCYGhiCgq/NKPF0i6UIsZynbP+Xi9Ng+XLbNlmNz/xIBBqq61FIQRJhC/+QA/08PJQJ3sK5TZFMlWzC/iK5GUN40psgqvxwBjBOg6JUSJ7ewyKE2AAaXZrfUB4v+hze37ugJ9d+DeYqiDwVgCawviwVFGnuttkLqIMGivmDg" ) format( "woff2" )', {});
		f.load()['catch'](function () {
		});

		return f.status == 'loading' || f.status == 'loaded';
	}

	// echo errors and notifications
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

	// run Forrest run :)
	init();
}
