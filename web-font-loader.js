// Этот скрипт должен быть размещён в <head> над всеми внешними объявлениями стилей (link[rel=stylesheet])
function loadFont(fontName, woffUrl, woff2Url, appendFont, prefix) {
	// 0. Многие неподдерживаемые браузеры должны останавливать работу тут.
	var nua = navigator.userAgent;
	var noSupport = !window.addEventListener // IE8 и ниже
		|| (nua.match(/(Android (2|3|4.0|4.1|4.2|4.3))|(Opera (Mini|Mobi))/) && !nua.match(/Chrome/)) // Android Stock Browser до 4.4 и Opera Mini

	if (noSupport) {
		return;
	}

	// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
	// throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
	// to avoid the entire page breaking, without having to do a check at each usage of Storage.
	// https://gist.github.com/philfreo/68ea3cd980d72383c951
	if (typeof localStorage === 'object') {
		try {
			localStorage.setItem('localStorage', 1);
			localStorage.removeItem('localStorage');
		} catch (e) {
			Storage.prototype._setItem = Storage.prototype.setItem;
			Storage.prototype.setItem = function() {};
			console.log('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
			return;
		}
	}

	// Устанавливаем переменную что бы управлять процессом подключения шрифта на странице после его загрузки
	// false: если значение явно не установлено, то шрифт будет подключатся при следующей загрузки страницы
	// true:  если значение установлено, то шрифт будет подключен сразу же после его загрузки
	var appendFont = appendFont || false;

	// 1. Настраиваем localStorage
	var loSto = {};

	try {
		// Устанавливаем вспомогательную переменную для помощи с localStorage,
		// например, для случаев когда cookies отключены и браузер не даёт к ним доступа.
		// Иначе могут быть получены исключения, которые полностью остановят загрузку шрифтов.
		loSto = localStorage || {};
	} catch(ex) {
		console.log(ex);
	}

	var localStoragePrefix = (prefix || 'font-storage') + '-' + fontName;
	var localStorageUrlKey = localStoragePrefix + '-url';
	var localStorageCssKey = localStoragePrefix + '-css';
	var storedFontUrl = loSto[localStorageUrlKey];
	var storedFontCss = loSto[localStorageCssKey];

	// 2. Создаём элемент <style>, который мы используем для вставки шрифта, закодированного в base64.
	var styleElement = document.createElement('style');
	styleElement.rel = 'stylesheet';
	document.head.appendChild(styleElement);
	// Из-за ошибок IE9 установка styleElement.textContent должна быть после этой строки.

	// 3. Проверяем, находится ли шрифт уже в localStorage и последней ли он версии.
	if (storedFontCss && (storedFontUrl === woffUrl || storedFontUrl === woff2Url)) {
		// css до сих пор в localStorage
		// и были загружены из одного из текущих адресов

		// 4. Применяем стили шрифта.
		styleElement.textContent = storedFontCss;
	} else {
		// Данных нет, или они загружены с устаревшего URL,
		// поэтому мы должны загрузить их снова.

		// 5. Проверяем поддержку WOFF2 чтобы узнать, какой URL использовать.
		var url = (woff2Url && supportsWoff2())
			? woff2Url // WOFF2 URL передан в функцию и поддерживается.
			: woffUrl; // Поддерживается только WOFF.

		// 6. Получаем данные с сервера.
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				// 7. Обновляем localStorage новыми данными и применяем стили шрифта.
				loSto[localStorageUrlKey] = url;

				if(appendFont){
					// Применить шрифт сразу посге его загрузки
					loSto[localStorageCssKey] = styleElement.textContent = request.responseText;
				} else {
					// Кешировать шрифт, но НЕ применяються после загрузки
					loSto[localStorageCssKey] = request.responseText;
				}
			}
		};
		request.send();
	}

	function supportsWoff2() {
		// Источник: https://github.com/filamentgroup/woff2-feature-test
		if (!window.FontFace) {
			return false;
		}

		var f = new FontFace('t', 'url( "data:application/font-woff2;base64,d09GMgABAAAAAADcAAoAAAAAAggAAACWAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABk4ALAoUNAE2AiQDCAsGAAQgBSAHIBtvAcieB3aD8wURQ+TZazbRE9HvF5vde4KCYGhiCgq/NKPF0i6UIsZynbP+Xi9Ng+XLbNlmNz/xIBBqq61FIQRJhC/+QA/08PJQJ3sK5TZFMlWzC/iK5GUN40psgqvxwBjBOg6JUSJ7ewyKE2AAaXZrfUB4v+hze37ugJ9d+DeYqiDwVgCawviwVFGnuttkLqIMGivmDg" ) format( "woff2" )', {});
		f.load();

		return f.status === 'loading';
	}
}
