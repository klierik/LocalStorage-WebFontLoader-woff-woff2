# Async WebFontLoader with LocalStorage support
Simple webfont async loading with localStorage support and WOFF1/2 support

# Options
```
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
```

# Usage
This script must be placed in the HEAD above all external stylesheet declarations (link[rel=stylesheet])

## Single font loader
In this way we set only One font to load
```
loadFonts([
	{
		name: 'Dispatch Bold',
		woffUrl: '<?php echo $this->getUrl() . "vendor/fonts/dispatch/bold.woff.css" ?>',
		woff2Url: '<?php echo $this->getUrl() . "vendor/fonts/dispatch/bold.woff2.css" ?>'
	}
]);
```
```bold.woff.css``` — css file with base64 font in woff format
```
@font-face {
    font-family: 'Dispatch Bold';
    src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAA.....) format('woff');
    font-weight: bold;
    font-style: normal;
}
```

```bold.woff2.css``` — css file with base64 font in woff2 format
```
@font-face {
    font-family: 'Dispatch Bold';
    src: url(data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAA.....) format('woff2');
    font-weight: bold;
    font-style: normal;
}
```

## Multiple fonts loader
In this way we set array of fonts to load
```
loadFonts([
	{
		name: 'Dispatch Bold',
		woffUrl: '<?php echo $this->getUrl() . "vendor/fonts/dispatch/bold.woff.css" ?>',
		woff2Url: '<?php echo $this->getUrl() . "vendor/fonts/dispatch/bold.woff2.css" ?>'
	},
	{
		name: 'Open Sans',
		woffUrl: '<?php echo $this->getUrl() . "vendor/fonts/openSans/openSans.woff.css" ?>',
		woff2Url: '<?php echo $this->getUrl() . "vendor/fonts/openSans/openSans.woff2.css" ?>'
	}
]);
```

## How to set custom options
If you need make some individual changes you can set custom options in this way
```
loadFonts([
	{
		name: 'Dispatch Bold',
		woffUrl: '<?php echo $this->getUrl() . "vendor/fonts/dispatch/bold.woff.css" ?>',
		woff2Url: '<?php echo $this->getUrl() . "vendor/fonts/dispatch/bold.woff2.css" ?>'
	},
	{
		name: 'Open Sans',
		woffUrl: '<?php echo $this->getUrl() . "vendor/fonts/openSans/openSans.woff.css" ?>',
		woff2Url: '<?php echo $this->getUrl() . "vendor/fonts/openSans/openSans.woff2.css" ?>'
	}
], {
	appendFontWhenLoaded: true		// Yes, append font when it was loaded
	, loadWhenDomLoaded:  false		// Do not wait when DOMContentLoaded event fired, load font just now!
	, async:              false		// When font so important and everything is nothing — do not use async mode
});
```

# Problems
Under Safari Private mode script won't work (localStorage not supported). In DevTools says:
```
QuotaExceededError (DOM Exception 22): The quota has been exceeded.
```

# Thanks to
RU: https://htmlacademy.ru/blog/61-better-webfont-loading-with-localstorage-and-woff2

EN: http://bdadam.com/blog/better-webfont-loading-with-localstorage-and-woff2.html
