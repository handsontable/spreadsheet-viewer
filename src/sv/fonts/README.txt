# Font fallbacks for well known fonts

We are using the following formats:

- WOFF2 for Edge 14+, FF 39+, Chrome 36+, Safari 12+, Opera 23+, iOS Safari 10+, Android Browser 76+
- WOFF for IE9+, Edge 12+, FF 3.6+, Chrome 5+, Safari 5.1+, Opera 11.5+, iOS Safari 5+, Android Browser 4.4+

Learn more about formats: https://css-tricks.com/understanding-web-fonts-getting/, https://creativemarket.com/blog/the-missing-guide-to-font-formats


## Sources

- Liberation Fonts
  - Source: https://github.com/liberationfonts/liberation-fonts/releases/tag/2.00.5
  - License: SIL Open Font License, Version 1.1
- Caladea
  - Source: https://packages.debian.org/sid/fonts-crosextra-caladea
  - License: Apache License 2.0
- Carlito: 
  - Source: https://packages.debian.org/sid/fonts-crosextra-carlito 
  - License: Apache License 2.0


## Installation

Follow the installation instructions at https://github.com/filamentgroup/glyphhanger


## Conversion

The following code converts from TTF to WOFF2, WOFF

```
cd client/fonts

cd liberation-fonts-ttf-2.00.5
glyphhanger --formats=woff2,woff --subset=*.ttf
mv *.woff *.woff2 ../web
cd ..

cd crosextrafonts-20130214
glyphhanger --formats=woff2,woff --subset=*.ttf
mv *.woff *.woff2 ../web
cd ..

crosextrafonts-carlito-20130920
glyphhanger --formats=woff2,woff --subset=*.ttf
mv *.woff *.woff2 ../web
cd ..
```
