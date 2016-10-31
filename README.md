# LocalStorage-WebFontLoader-woff-woff2
Better webfont loading with using localStorage and providing WOFF/2 support

# Usage
## Example
```
<script>
  loadFont('Font Name', 'font-name-woff.css', 'font-name-woff2.css');
</script>
```
```font-name-woff.css``` — css file with base64 font in woff format

```font-name-woff2.css``` — css file with base64 font in woff2 format

## By default
```
<script>
  loadFont('Museo Sans Bold', 'vendor/fonts/museoSans/700woff.css', 'vendor/fonts/museoSans/700woff2.css');
</script>
```

## Apply font to page after load
```
<script>
  loadFont('Museo Sans Bold', 'vendor/fonts/museoSans/700woff.css', 'vendor/fonts/museoSans/700woff2.css', true);
</script>
```

## Set custom localStorage prefix
```
<script>
  loadFont('Museo Sans Bold', 'vendor/fonts/museoSans/700woff.css', 'vendor/fonts/museoSans/700woff2.css', false, 'my-prefix');
</script>
```

# Thanks to
RU: https://htmlacademy.ru/blog/61-better-webfont-loading-with-localstorage-and-woff2

EN: http://bdadam.com/blog/better-webfont-loading-with-localstorage-and-woff2.html
