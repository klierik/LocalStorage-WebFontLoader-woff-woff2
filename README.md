# LocalStorage-WebFontLoader-woff-woff2
Better webfont loading with using localStorage and providing WOFF/2 support

# Usage
## Example
```
<script>
  loadFonts([['Dispatch Bold', '<?php echo $this->getUrl() . "vendor/fonts/dispatch/bold.woff.css" ?>', '<?php echo $this->getUrl() . "vendor/fonts/dispatch/bold.woff2.css" ?>']])
</script>
```
```bold.woff.css``` — css file with base64 font in woff format
```
@font-face {
    font-family: 'Dispatch Bold';
    src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAA.....) format('woff');
    font-weight: normal;
    font-style: normal;
}
```

```bold.woff2.css``` — css file with base64 font in woff2 format
```
@font-face {
    font-family: 'Dispatch Bold';
    src: url(data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAA.....) format('woff2');
    font-weight: normal;
    font-style: normal;
}
```

# Thanks to
RU: https://htmlacademy.ru/blog/61-better-webfont-loading-with-localstorage-and-woff2

EN: http://bdadam.com/blog/better-webfont-loading-with-localstorage-and-woff2.html
