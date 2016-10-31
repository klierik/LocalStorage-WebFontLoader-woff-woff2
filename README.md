# LocalStorage-WebFontLoader-woff-woff2
Better webfont loading with using localStorage and providing WOFF/2 support

# Usage
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
