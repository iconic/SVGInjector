## Change Log

### v2.1.2 (2017/10/09 03:56 +00:00)
- [01e4044](https://github.com/flobacher/SVGInjector2/commit/01e404473c45d850bad145b3c8d1cc25dd099f8c) 2.1.2
- [6de7b44](https://github.com/flobacher/SVGInjector2/commit/6de7b44afecdc73062e78400a34ae15c0c57194b) make the `update-version-comment` script work on windows as well
- [bd18b74](https://github.com/flobacher/SVGInjector2/commit/bd18b7472f7f3ce11676f060bbe725830886a692) update examples to test new `title`, `desc`, `aria-labelledby` and `aria-hidden` implementation
- [6eab4d9](https://github.com/flobacher/SVGInjector2/commit/6eab4d96a84d1cfd3b1317de5db52418d256064f) update logic for title and desc creation/adaption
- [fc49c49](https://github.com/flobacher/SVGInjector2/commit/fc49c49df789a580a611d121c09842d3cde7e166) add angular example
- [4f71cc4](https://github.com/flobacher/SVGInjector2/commit/4f71cc473843308259edb8741b8b61d6f5f696c1) add `h1` to titles to identify them easier
- [aafb1fe](https://github.com/flobacher/SVGInjector2/commit/aafb1fecda487a6e7ef7a6e9d96a6fcaac2a0dec) npm 5 support. hurray =)
- [c934bd3](https://github.com/flobacher/SVGInjector2/commit/c934bd357864bc9959aa4d20585f2ab26dfaf9a4) chore: update for usage with node 8

### v2.1.1 (2017/05/15 16:34 +00:00)
- [ba82a4c](https://github.com/flobacher/SVGInjector2/commit/ba82a4cb168afa4c0af668a03685597d1696d166) 2.1.1
- [013bb9d](https://github.com/flobacher/SVGInjector2/commit/013bb9d31fcba2fc4061b08418cfda5d5576b277) codestyle
- [6221b19](https://github.com/flobacher/SVGInjector2/commit/6221b19f6f9f00344754304dfcea07ef35548e81) add width and height also on single elements (not spritesheet-fragments) that only specify a viewbox

### v2.1.0 (2017/05/12 19:32 +00:00)
- [54fa00d](https://github.com/flobacher/SVGInjector2/commit/54fa00d7ca9b359cbcf99f0e9bfb5fdf06f94c48) 2.1.0
- [de4a372](https://github.com/flobacher/SVGInjector2/commit/de4a372b6d28f22f747cffd7b574da6160c8a257) add the option to provide fallback svgs for fragment ids, that might not be found in the spritesheet

### v2.0.37 (2017/05/12 17:31 +00:00)
- [e4d6f1a](https://github.com/flobacher/SVGInjector2/commit/e4d6f1a29b9cec3f6b9c6c803f8f6f6be00085bf) 2.0.37
- [#22](https://github.com/flobacher/SVGInjector2/pull/22) bugfix, replace element (@sladiri)
- [9f81e08](https://github.com/flobacher/SVGInjector2/commit/9f81e0801f5edbd358cac5df7b7013b710d46983) bugfix, replace element (@sladiri)

### v2.0.36 (2017/03/28 08:54 +00:00)
- [9cb552c](https://github.com/flobacher/SVGInjector2/commit/9cb552c103e32fb49efda3881272ba80fea81751) 2.0.36 (@flobacher)
- [9517d99](https://github.com/flobacher/SVGInjector2/commit/9517d9941b17d5dc1dece733fcf2bb1281e2852f) update version nr. on build (@flobacher)

### v2.0.35 (2017/03/13 12:40 +00:00)
- [9b0617f](https://github.com/flobacher/SVGInjector2/commit/9b0617fdab9f178bb24922d1c610c66ccd85b873) 2.0.35 (@flobacher)
- [7897ca7](https://github.com/flobacher/SVGInjector2/commit/7897ca7c284d4162b4f9ceb9446b829f5bb6f2c3) update example (@flobacher)
- [6e7f25f](https://github.com/flobacher/SVGInjector2/commit/6e7f25f0f39ae0ec56ccbd24e58da9ee448e3c88) angular-directive: allow sprite-id class to be not the first in the classList (@flobacher)
- [9c09103](https://github.com/flobacher/SVGInjector2/commit/9c09103d35c60c2762d389fb556ce83715ace092) fix package-script (@flobacher)

### v2.0.34 (2017/03/05 10:43 +00:00)
- [80f8b04](https://github.com/flobacher/SVGInjector2/commit/80f8b04c42104948937663a59f46fd751b1e5338) 2.0.34 (@flobacher)
- [699af49](https://github.com/flobacher/SVGInjector2/commit/699af496e1627e6b0a42a908671f39977d83e5b5) codestyle (@flobacher)
- [dedbd9b](https://github.com/flobacher/SVGInjector2/commit/dedbd9b181ffdf7450945c7642c2c658b58c173c) start adding support for interpolated data-src (@flobacher)
- [b1a17fc](https://github.com/flobacher/SVGInjector2/commit/b1a17fc1c7d2f05364a8e81d17872d734e6812da) add example for interpolation support of classnames (@flobacher)
- [1de9aa8](https://github.com/flobacher/SVGInjector2/commit/1de9aa8737a6e3d249c7c381c00f04f0d385cd2b) adapt example (@flobacher)
- [215638d](https://github.com/flobacher/SVGInjector2/commit/215638d7d4bad66921c11bc7b9c08ca3099f4998) only execute angular-directive code if src, data-src or sprite-class are present (@flobacher)
- [7eab253](https://github.com/flobacher/SVGInjector2/commit/7eab25323b2541640b3c5d143a525d3cd7f6ac69) codestyle (@flobacher)
- [a0459c8](https://github.com/flobacher/SVGInjector2/commit/a0459c855fdf258204dd77d783847fe17acd7dfb) getter for config (@flobacher)
- [3c4ba0e](https://github.com/flobacher/SVGInjector2/commit/3c4ba0e1bd1f48139d2673de3fc3732e2ba113c9) exit, when neither src, data-src, nor sprite sheet url are specified (@flobacher)
- [3aef12b](https://github.com/flobacher/SVGInjector2/commit/3aef12bf51f3fe0992618c3d2a50d921ba319c38) add inline svgs to examples (@flobacher)
- [ba2226f](https://github.com/flobacher/SVGInjector2/commit/ba2226fb08ca66d6f884d5ec3ef59a9911c307af) remove console.logs in minified version (@flobacher)
- [#16](https://github.com/flobacher/SVGInjector2/pull/16) Check for imgUrl (@TheCopartnery)
- [a188971](https://github.com/flobacher/SVGInjector2/commit/a188971bd5dbecea928eccc7e9d202ac0f46cecd) spelling correction (@TheCopartnery)
- [3e72195](https://github.com/flobacher/SVGInjector2/commit/3e72195bb3c26348e12f8ae2ebf5e2cd4ec9af09) Check for imgUrl - inline svg’s will not have an imgUrl (src/data-src) causing imgUrl.split to error (@TheCopartnery)

### v2.0.33 (2017/02/27 23:25 +00:00)
- [73c3432](https://github.com/flobacher/SVGInjector2/commit/73c3432a5ea5d88bf0230cf2f7a90a47e138655f) 2.0.33 (@flobacher)
- [85086e0](https://github.com/flobacher/SVGInjector2/commit/85086e0d80344dd139ba32e0a6daa8377e2e61e9) do not change src (@flobacher)
- [147b953](https://github.com/flobacher/SVGInjector2/commit/147b9533c47e2874a8da757cc05e9023ca655e86) add options (@flobacher)
- [2658876](https://github.com/flobacher/SVGInjector2/commit/2658876a641c1384b5afe6877b3f5185612a5525) add options (@flobacher)
- [#14](https://github.com/flobacher/SVGInjector2/pull/14) Update README.md (@TheCopartnery)
- [#13](https://github.com/flobacher/SVGInjector2/pull/13) Add simple with img tag example (@TheCopartnery)
- [35a3f6a](https://github.com/flobacher/SVGInjector2/commit/35a3f6ab8efab2863c702738b546e717c7fb1eb5) update README.md (@flobacher)
- [00838d8](https://github.com/flobacher/SVGInjector2/commit/00838d84dcd7ebc746b21eef37c57426c7a85c89) Update README.md (@TheCopartnery)
- [caedbeb](https://github.com/flobacher/SVGInjector2/commit/caedbebe345c666812600e2ec60b9468a16faff5) Add simple with img tag example (@TheCopartnery)
- [69ecf67](https://github.com/flobacher/SVGInjector2/commit/69ecf67708ce5a60a2c32d5326f2a1761d40842b) update/streamline examples and read (@flobacher)

### v2.0.32 (2017/02/22 22:58 +00:00)
- [d534db0](https://github.com/flobacher/SVGInjector2/commit/d534db0a68c66162165b190c5bb7249ec9bcc937) 2.0.32 (@flobacher)
- [794d4f5](https://github.com/flobacher/SVGInjector2/commit/794d4f5997fbbb4557e13c81bcfb2e9f47854c21) add a basic, non-spritesheet example (@flobacher)
- [50eaafb](https://github.com/flobacher/SVGInjector2/commit/50eaafb874c37b4dadc917c36a24f748206b3f29) always set data-src even if only src was specified (@flobacher)

### v2.0.31 (2017/02/22 21:13 +00:00)
- [0c64792](https://github.com/flobacher/SVGInjector2/commit/0c647921b47e34714cbfe630295fa6c56125130f) v2.0.31 (@flobacher)
- [f19994c](https://github.com/flobacher/SVGInjector2/commit/f19994c8db700e4157581dc90103e48bbac4c651) fix main entry in bower.json (@flobacher)
- [dd3f7d0](https://github.com/flobacher/SVGInjector2/commit/dd3f7d0b97f119208a450ef7e9bcc3d774a7ce2b) add copy of file to stay compatible with file structure of version < v2.0.28 (@flobacher)
- [eb84ea3](https://github.com/flobacher/SVGInjector2/commit/eb84ea3a63962657606e454956ca38da1bb07e76) make sure script works on all platforms (@flobacher)
- [fd897d7](https://github.com/flobacher/SVGInjector2/commit/fd897d7de5b53dc71d9f3e272c4ca4655a0ac6b5) codestyle: streamline folder-pathes (@flobacher)
- [5803a9a](https://github.com/flobacher/SVGInjector2/commit/5803a9a9eb257b4dbb31d72d0cac2ba941c1f7f2) add copy command to stay compatible with file structure of version < v2.0.28 (@flobacher)
- [#10](https://github.com/flobacher/SVGInjector2/pull/10) Update README links (@TheCopartnery)
- [febe4b2](https://github.com/flobacher/SVGInjector2/commit/febe4b22d331baeafaabefb00171ca767f8942af) update links (@TheCopartnery)

### v2.0.30 (2017/02/21 18:10 +00:00)
- [759c681](https://github.com/flobacher/SVGInjector2/commit/759c681a56dcb88b3ac2aa64d8b448b115e15010) 2.0.30 (@flobacher)
- [41f49c8](https://github.com/flobacher/SVGInjector2/commit/41f49c8292c203b826b97f1bef5d8fe013909112) fix main entry in package.json (@flobacher)
- [60b98b1](https://github.com/flobacher/SVGInjector2/commit/60b98b1c2c0d089a3583aec252c5cd4c7ff512b8) fix package script (@flobacher)

### v2.0.29 (2017/02/20 09:51 +00:00)
- [95bfd75](https://github.com/flobacher/SVGInjector2/commit/95bfd758356fc4839a028e6503dada49b6ceea2e) 2.0.29 (@flobacher)
- [c5e6c81](https://github.com/flobacher/SVGInjector2/commit/c5e6c816c42c247b709985b3789509ea87ec6381) fix package scripts (@flobacher)
- [b1ccb91](https://github.com/flobacher/SVGInjector2/commit/b1ccb91466fc96196da9fb69bd8dc7319ac1a866) update examples (@flobacher)
- [58f4acd](https://github.com/flobacher/SVGInjector2/commit/58f4acde207ac1d4ba8f797c52204e766902a47a) do not remove console.logs (@flobacher)
- [1aac685](https://github.com/flobacher/SVGInjector2/commit/1aac6854dca1c0fdace7b2f394028e62ab48f62e) fix fallbacks (@flobacher)
- [#7](https://github.com/flobacher/SVGInjector2/pull/7) Update broken examples/spritesheet link (@TheCopartnery)
- [7a39a24](https://github.com/flobacher/SVGInjector2/commit/7a39a24db30947640bacad3a4838d207865305ed) Update broken examples/spritesheet link (@TheCopartnery)
- [3cd8015](https://github.com/flobacher/SVGInjector2/commit/3cd801542957142d650aa0a373d64bb3930a50de) update README
- [e6c040f](https://github.com/flobacher/SVGInjector2/commit/e6c040f450caa311cdd804fbe14e82d2c3396d7a) update examples
- [cadac66](https://github.com/flobacher/SVGInjector2/commit/cadac666ddfb4fec52a8bd6b63aba0e776cdf195) fix package-scripts
- [5da3c45](https://github.com/flobacher/SVGInjector2/commit/5da3c454e15a5034d8e6c8e44e89ae11d16e0cfb) reorganise folder-structure, update examples and copy all attributes of the injection-target node to the injected sag (@flobacher)

### v2.0.28 (2016/04/04 00:19 +00:00)
- [f16c19a](https://github.com/flobacher/SVGInjector2/commit/f16c19a347a9577e1644579221098e27d84e5e58) 2.0.28 (@flobacher)
- [168c99d](https://github.com/flobacher/SVGInjector2/commit/168c99d8bfdcbab97b09301c21af6d1fc70437d8) respect aria-hidden also on injected sag (@flobacher)

### v2.0.27 (2016/04/03 23:41 +00:00)
- [2cb030f](https://github.com/flobacher/SVGInjector2/commit/2cb030f52aacd9d4afebe00e70b9caabe3ed04d9) 2.0.27 (@flobacher)
- [aadf829](https://github.com/flobacher/SVGInjector2/commit/aadf8299ecae7b5cd1213802f84d4fc2617c3d8d) correct those id-refs in sample sprite sheet.. this needs fixing in injector though (@flobacher)
- [24e397d](https://github.com/flobacher/SVGInjector2/commit/24e397dae2b936829ecac1a4a42524faa4b11520) do not add role=presentation to title and desc (@flobacher)
- [d01d011](https://github.com/flobacher/SVGInjector2/commit/d01d01169e69ce36647f5561b45f736a281b7a0a) suffix id-references in style-tags and refactor (@flobacher)
- [bc9aab5](https://github.com/flobacher/SVGInjector2/commit/bc9aab5a20292ce23657c01f229245b8613e227c) update scripts (@flobacher)
- [bd6213b](https://github.com/flobacher/SVGInjector2/commit/bd6213b62931d61563579e0641d7b03c95aadfc1) update/move examples (@flobacher)
- [#3](https://github.com/flobacher/SVGInjector2/pull/3) added support for aria-hidden attribute on svg element (@dgoerdes)
- [f8cf0fe](https://github.com/flobacher/SVGInjector2/commit/f8cf0fe3706f6008eb39549363742dccc4c7ce0c) added support for aria-hidden attribute on svg element (@dgoerdes)

### v2.0.26 (2016/03/22 13:47 +00:00)
- [9487319](https://github.com/flobacher/SVGInjector2/commit/94873198cca125917abf3a85baa7b803772e12ce) 2.0.26
- [07217d8](https://github.com/flobacher/SVGInjector2/commit/07217d88739a7144c7f8c68846d8873a579457fb) codestyle
- [8310c96](https://github.com/flobacher/SVGInjector2/commit/8310c9672b423acd866ea469aa454576452613b3) add accessibility section

### v2.0.25 (2016/03/22 13:07 +00:00)
- [94916ed](https://github.com/flobacher/SVGInjector2/commit/94916ed7ceebebf4802bff9a6081f13e718ac674) 2.0.25
- [b59d1d8](https://github.com/flobacher/SVGInjector2/commit/b59d1d8488187815cd5664fc96d8d642cf79cc76) Merge branch 'hochitom-master'
- [4ce5a2b](https://github.com/flobacher/SVGInjector2/commit/4ce5a2bc873a8145b6d71b6a5a39ec51a69efe48) Conflicts: 	svg-injector.js

### v2.0.24 (2016/03/22 12:55 +00:00)
- [dec40de](https://github.com/flobacher/SVGInjector2/commit/dec40de1191c38fea293eb639082b51cbcc3876f) 2.0.24
- [7ae93d3](https://github.com/flobacher/SVGInjector2/commit/7ae93d321ec228339c1ac7c2871a222f9fb0ad06) add shortcut script
- [5b5b00a](https://github.com/flobacher/SVGInjector2/commit/5b5b00aae15bca85c5367b4d2c0475a7f4fcb4ce) make npm scripts work on windows as well
- [a721de4](https://github.com/flobacher/SVGInjector2/commit/a721de4e732e5551a4afea529148c4e5c5256c0d) make npm scripts work on windows as well
- [9480d16](https://github.com/flobacher/SVGInjector2/commit/9480d167c1b9310edf307311d356cc1a106b03e2) codestyle
- [d945474](https://github.com/flobacher/SVGInjector2/commit/d9454742b29e0ea5f040f7eec544adef1dd074f4) make npm scripts work on windows as well
- [216993c](https://github.com/flobacher/SVGInjector2/commit/216993c903adcc3d51519d18e531fe1e2516e33c) 2.0.23
- [e425f4e](https://github.com/flobacher/SVGInjector2/commit/e425f4e5366c85548fcd75a77091a81216259edd) avoid latedef warnings
- [ff5578d](https://github.com/flobacher/SVGInjector2/commit/ff5578d442010529db2d133deb7837611f9f4616) ${npm_package_version}
- [ec44146](https://github.com/flobacher/SVGInjector2/commit/ec44146b4b52dc7156fd296411e108cd848edc26) IE does not support Children on SVGElement!
- [66f4ede](https://github.com/flobacher/SVGInjector2/commit/66f4ede7820ab4b5b6a5bfab7022912e7b5871a5) use .trim() only if element has a class attribute (@hochitom)

### 2.0.22 (2016/03/22 10:22 +00:00)
- [8453317](https://github.com/flobacher/SVGInjector2/commit/8453317d09226d4295f72775d1c6fe4117194f62) 2.0.22 (@flobacher)
- [84fd93c](https://github.com/flobacher/SVGInjector2/commit/84fd93cd5a406d1f119f207a67c72e4a19cf5c82) update ignore rules (@flobacher)

### 2.0.21 (2016/03/22 10:11 +00:00)
- [33afd04](https://github.com/flobacher/SVGInjector2/commit/33afd04de4a5d745d6faaa6efa3a23c69e27cb3e) 2.0.21 (@flobacher)
- [4f2317e](https://github.com/flobacher/SVGInjector2/commit/4f2317e21d8d02b59bd8cfd94636071144062514) update readme (@flobacher)

### 2.0.20 (2016/03/22 09:47 +00:00)
- [c508c18](https://github.com/flobacher/SVGInjector2/commit/c508c1852a94e3f9d11e5613cce086e69c1da17b) 2.0.20 (@flobacher)
- [cfa5475](https://github.com/flobacher/SVGInjector2/commit/cfa5475d847d20603e20253a354210b7841e94c8) update scripts (@flobacher)

### 2.0.19 (2016/03/22 09:30 +00:00)
- [045205b](https://github.com/flobacher/SVGInjector2/commit/045205b03426ce7dd904cda3a96734bcb4898f26) 2.0.19 (@flobacher)
- [da5f9e4](https://github.com/flobacher/SVGInjector2/commit/da5f9e4a7a98d59a361f9bf260039417a2b2a18d) cleanup (@flobacher)

### 2.0.18 (2016/03/22 09:23 +00:00)
- [52f5fe4](https://github.com/flobacher/SVGInjector2/commit/52f5fe4fd4cf79c1cde6903a3011664e69807cb4) 2.0.18 (@flobacher)

### 2.0.17 (2016/03/22 09:19 +00:00)
- [c39a16f](https://github.com/flobacher/SVGInjector2/commit/c39a16faac8b1fdb4eab78d68aae3caf7151dc3c) 2.0.17 (@flobacher)
- [41f86cc](https://github.com/flobacher/SVGInjector2/commit/41f86cc92455d76f075de681ee2a433c6084a58e) update scripts (@flobacher)
- [49cceae](https://github.com/flobacher/SVGInjector2/commit/49cceaea132570c55414a884cdb099c26d28a78a) update repo url and scripts (@flobacher)

### 2.0.16 (2016/03/22 09:14 +00:00)
- [5e7774e](https://github.com/flobacher/SVGInjector2/commit/5e7774ecb413d477b35868c1ce7d00225702f122) 2.0.16 (@flobacher)
- [6292886](https://github.com/flobacher/SVGInjector2/commit/629288681977a04c9b85277ec833766801c56fdd) update repo url and scripts (@flobacher)

### 2.0.15 (2016/03/22 09:07 +00:00)
- [fc29aea](https://github.com/flobacher/SVGInjector2/commit/fc29aea8a6406b0fb4831da03613034984071a9e) 2.0.15 (@flobacher)
- [9d91dc3](https://github.com/flobacher/SVGInjector2/commit/9d91dc380bf490c457b74eac75d9fc25308d0dc0) update gitignore (@flobacher)
- [359a256](https://github.com/flobacher/SVGInjector2/commit/359a256235e33953308e185a0c2e4f49e1be561c) add support for the desc element and add the role="presentation" to all elements
- [ef029f2](https://github.com/flobacher/SVGInjector2/commit/ef029f2748469fac90f4f292b53d7fd3f8a3f117) add support to set title for accessibility

### 2.0.14 (2016/03/21 14:33 +00:00)
- [7c25536](https://github.com/flobacher/SVGInjector2/commit/7c25536aeeb61eaadd7dad4d00c11314e74c58fd) 2.0.14 (@flobacher)
- [571dec2](https://github.com/flobacher/SVGInjector2/commit/571dec21fa1b716f7148f46d94f3b03313dec435) add support for IE
- [f189ab4](https://github.com/flobacher/SVGInjector2/commit/f189ab46d1773468b1719485c07d834cbcf0b9d8) elements can also be referenced via xlink:href. this time it works
- [eccb575](https://github.com/flobacher/SVGInjector2/commit/eccb575bf60a9fcc02a1c339a79fce5414926156) fix: previous version added suffix multiple times (@flobacher)
- [ffc0ad2](https://github.com/flobacher/SVGInjector2/commit/ffc0ad241a6960afd7fdbf57842bc96fef8847f7) elements can also be referenced via xlink:href.. need to suffix them as well (@flobacher)
- [e9ef3ed](https://github.com/flobacher/SVGInjector2/commit/e9ef3ed1de30eec4b6515db3aee7be19245feac0) cleanup logs (@flobacher)
- [507212f](https://github.com/flobacher/SVGInjector2/commit/507212fa1db669480f69dd42ee5d486c0aa17257) ignore tests and examples when installed via nom (@flobacher)
- [990d68d](https://github.com/flobacher/SVGInjector2/commit/990d68dd1b31211032c17290d16dbc00749cec34) rearange npm scripts for better readability (@flobacher)
- [303c20c](https://github.com/flobacher/SVGInjector2/commit/303c20c50e06370894389ab89b1ced216fe19934) update dependency (@flobacher)
- [a5bc1b3](https://github.com/flobacher/SVGInjector2/commit/a5bc1b3eedb6c8cc7a5b53b24e0cbb59322ddff0) remove deprecated version from bower (@flobacher)
- [e44352e](https://github.com/flobacher/SVGInjector2/commit/e44352e29f8c1f8f22e3d5b6ddfbde2676e59f19) build scripts updated (@flobacher)

### 2.0.13 (2016/03/01 23:35 +00:00)
- [5164dea](https://github.com/flobacher/SVGInjector2/commit/5164deabf4796a9418227965bfadf08cda4f2b2c) 2.0.13 (@flobacher)
- [8612dea](https://github.com/flobacher/SVGInjector2/commit/8612dea502bf308e16746955e0353be2a63e3c58) build scripts updated (@flobacher)
- [8281b74](https://github.com/flobacher/SVGInjector2/commit/8281b741f9ffe2c3df9a571f2cb2caa6603a64ef) additional iri references are matched (@flobacher)

### 2.0.12 (2016/03/01 22:11 +00:00)
- [a5ee0c8](https://github.com/flobacher/SVGInjector2/commit/a5ee0c8536d9d1122cd2892e4af109a0e8cb0ac3) 2.0.12 (@flobacher)
- [#1](https://github.com/flobacher/SVGInjector2/pull/1) fixed bug to work with multiple spritemaps (@hochitom)
- [#1](https://github.com/flobacher/SVGInjector2/pull/1) fixed bug to work with multiple spritemaps (@hochitom)
- [d2eb782](https://github.com/flobacher/SVGInjector2/commit/d2eb78263ed0ab26aad5c66be1ca146ee067ca0c) fixed bug to work with multiple spritemaps (@hochitom)

### 2.0.11 (2015/07/28 23:25 +00:00)
- [e562641](https://github.com/flobacher/SVGInjector2/commit/e5626412455a0c08a66d202c4e6083102f2887f9) Updated CHANGELOG (@flobacher)
- [3e86de1](https://github.com/flobacher/SVGInjector2/commit/3e86de1b801ef14317700bea265b5f3be90211de) 2.0.11 (@flobacher)
- [29f99e2](https://github.com/flobacher/SVGInjector2/commit/29f99e28674154fac5ac5ecf45a55ffa3bead497) bugfix angular directive (@flobacher)
- [a0c06d9](https://github.com/flobacher/SVGInjector2/commit/a0c06d99dc0d0cc11f9a768e2795d972186bdc60) Updated CHANGELOG (@flobacher)

### 2.0.10 (2015/07/28 21:19 +00:00)
- [05f6d56](https://github.com/flobacher/SVGInjector2/commit/05f6d5680634a285bbab9d7f5bb49804969b45f3) 2.0.10 (@flobacher)
- [d29eb5b](https://github.com/flobacher/SVGInjector2/commit/d29eb5b367750c3b88cfc0f29f8f35647a45115b) wrap angular directive into $observe so injection will trigger even if classname is result of an expression evaluation (@flobacher)
- [768c624](https://github.com/flobacher/SVGInjector2/commit/768c624a82d05adf566c20722e99b6b9340ee76c) remove unused variable (@flobacher)
- [72e5a02](https://github.com/flobacher/SVGInjector2/commit/72e5a0204f24667e0857cbff06604fefa0873948) abort injection if no sprite-- class and no data-src found (@flobacher)
- [2255226](https://github.com/flobacher/SVGInjector2/commit/2255226fdf63f91b5e1cb7116df9d2f3d0fa992d) 2.0.9 (@flobacher)

### 2.0.9 (2015/07/14 05:56 +00:00)
- [64b1a8d](https://github.com/flobacher/SVGInjector2/commit/64b1a8da26665d0e296402a666c0cc274d6a929d) prefix style-blocks if injected svg is not a spritesheet (@flobacher)
- [2dfc3e6](https://github.com/flobacher/SVGInjector2/commit/2dfc3e6facfb56b75f952e6e444cb033fa62b31c) start prefixing of style-blocks if injected svg is not a spritesheet (@flobacher)

### 2.0.8 (2015/07/09 13:41 +00:00)
- [37aca0a](https://github.com/flobacher/SVGInjector2/commit/37aca0ad994b0e250d8dec908b413cdab3874108) 2.0.8
- [c8bd742](https://github.com/flobacher/SVGInjector2/commit/c8bd7426603b2459e7779eaef22f98ea6f023a69) remove console-logs
- [c08fe76](https://github.com/flobacher/SVGInjector2/commit/c08fe76bf96b22115eecbe585ec3a5096610d90c) improve support for combining single svgs with a spritesheet
- [4203538](https://github.com/flobacher/SVGInjector2/commit/4203538f7db9a3061b8d7d366af72949f063a8c2) fix indentations
- [990f631](https://github.com/flobacher/SVGInjector2/commit/990f63122c5a7e2a1ccb95da2252a7cda75f1ccf) fix indentations
- [35d29ae](https://github.com/flobacher/SVGInjector2/commit/35d29ae172b60ed50c104e74a515ec21c4314a39) Updated CHANGELOG

### 2.0.7 (2015/07/09 12:46 +00:00)
- [82d7c05](https://github.com/flobacher/SVGInjector2/commit/82d7c05017e0b435d521093fbd76c3cf0f1c1f27) 2.0.7
- [5dd714b](https://github.com/flobacher/SVGInjector2/commit/5dd714b557f1c152dedfd178746cbf0753d64816) enable use of data-src in combination with spritesheet

### 2.0.6 (2015/06/18 06:13 +00:00)
- [f25e199](https://github.com/flobacher/SVGInjector2/commit/f25e199212ebcaf1fe77abfb2d94fbf6ecf86fd8) 2.0.6 (@flobacher)
- [623b590](https://github.com/flobacher/SVGInjector2/commit/623b5900916eb9f643852d1362de1b0b2d6b418b) bugfix (@flobacher)

### 2.0.5 (2015/06/18 06:09 +00:00)
- [eb677a0](https://github.com/flobacher/SVGInjector2/commit/eb677a09a8a55aeef027fe97d7c098157ad4ba48) 2.0.5 (@flobacher)
- [6766656](https://github.com/flobacher/SVGInjector2/commit/676665617710bc473c3445530ce9d109885de6f6) bugfix (@flobacher)

### 2.0.4 (2015/06/18 05:31 +00:00)
- [dc90149](https://github.com/flobacher/SVGInjector2/commit/dc901496e2e8b0ed5891d97310ecd5bab4a7c30a) Updated CHANGELOG (@flobacher)
- [2067b0c](https://github.com/flobacher/SVGInjector2/commit/2067b0cbfca30ee52caf18ae91c089aeaf8becc1) bug fix: find symbol by view box returned more than one symbol (@flobacher)
- [861ed83](https://github.com/flobacher/SVGInjector2/commit/861ed834528c0377a8714ced68c84dfb1322dae3) change name

### 2.0.3 (2015/06/15 14:33 +00:00)
- [d660786](https://github.com/flobacher/SVGInjector2/commit/d6607867b8097e834f97b91454adf4573e0c7080) replace angular.value by provider

### 2.0.2 (2015/06/15 13:10 +00:00)
- [9f959a3](https://github.com/flobacher/SVGInjector2/commit/9f959a3531c6645af4de9686eccf077b9bc48646) 2.0.2
- [1529207](https://github.com/flobacher/SVGInjector2/commit/152920770e1a1ca39a3a9b69f79e838bf70d9830) 2.0.2
- [73e1ed3](https://github.com/flobacher/SVGInjector2/commit/73e1ed32f6d0bd4cb3b412b046be40b0329e9852) simplify build-setup

### 2.0.1 (2015/06/15 11:42 +00:00)
- [1d1a757](https://github.com/flobacher/SVGInjector2/commit/1d1a7574036da96fee5017dc1fdd354fbefcab70) simplify build-setup
- [f1aa85b](https://github.com/flobacher/SVGInjector2/commit/f1aa85b9b2cfd272b62bc8eb4d464a74d5b9bc7a) refactor angular support (@flobacher)
- [3d91982](https://github.com/flobacher/SVGInjector2/commit/3d91982ef08dea95b13ab7bc24dbac3773c26201) add angular suport 2 (@flobacher)
- [543fc97](https://github.com/flobacher/SVGInjector2/commit/543fc97f1e9fb3898598a65b21f3b3d56b54f11e) add angular suport (@flobacher)
- [4be677c](https://github.com/flobacher/SVGInjector2/commit/4be677c0e82f1805b31b581c3c019e4e098ae265) cleanup the oop approach (@flobacher)
- [06e6dfd](https://github.com/flobacher/SVGInjector2/commit/06e6dfdbd355286255a293510382672dc62d2ec5) refactor to use an oop approach

### 1.2.2 (2015/06/10 09:32 +00:00)
- [70b802e](https://github.com/flobacher/SVGInjector2/commit/70b802e16b980dd54f2b32b2a402a7d33f27df26) change the default classnames that should be removed upon injection, disable debug.logs
- [99ed486](https://github.com/flobacher/SVGInjector2/commit/99ed486792c2b5755c1e22f707057ae83673a880) 1.2.2

### 1.2.1 (2015/06/09 08:54 +00:00)
- [b9c3944](https://github.com/flobacher/SVGInjector2/commit/b9c39448cecb26a7eebcc611f8d1a7f59e86eacc) version bump
- [0b67cff](https://github.com/flobacher/SVGInjector2/commit/0b67cffb236d8874b58c8ea44505f7ccd4dfb2fe) cleanup logs (@flobacher)
- [2b31cb7](https://github.com/flobacher/SVGInjector2/commit/2b31cb75295982b4ae6864db25adabc86e7063e8) unify id-prefixing (@flobacher)
- [15e1754](https://github.com/flobacher/SVGInjector2/commit/15e175418b29f4f6aa15b2bdb1119558309baa25) prefix all attributes that reference an id from defs

### 1.2.0 (2015/06/02 07:26 +00:00)
- [d68f27f](https://github.com/flobacher/SVGInjector2/commit/d68f27f82854092da2ee0291e8c77383e098a9be) version bump (@flobacher)
- [7c23f6e](https://github.com/flobacher/SVGInjector2/commit/7c23f6edbc7c93bc0a7a78bd1e0bd524e07f803b) optional prefix for fragIdClass assigned upon injection (@flobacher)
- [6f4863a](https://github.com/flobacher/SVGInjector2/commit/6f4863a8f203c619886f1cc07addb6a2f05a8445) add possibility to add a common spritesheetURL for all svg instances
- [b6693a4](https://github.com/flobacher/SVGInjector2/commit/b6693a4c3b1dc4c9f44601629f6471420c9f67df) Copy preserveAspectRatio of elem if exists
- [9198950](https://github.com/flobacher/SVGInjector2/commit/919895086d512c7ba239e25c6957099efb492519) add option to keep inline-styles for some elems (specify via class) even if remove all style-tags = true (@flobacher)
- [d7893d4](https://github.com/flobacher/SVGInjector2/commit/d7893d49ec7e4db901d1aff2ccd1c7611df2b8f6) add option to remove all style-tags upon injection (@flobacher)
- [1a3a7b0](https://github.com/flobacher/SVGInjector2/commit/1a3a7b0798dd74203c1af8f5679080c851ef3c3b) edit fallback classnames list (@flobacher)
- [5e277e4](https://github.com/flobacher/SVGInjector2/commit/5e277e462e4608c867dc90ef5ab91196b9cfd85e) do not write default removeStyleClass if it is specified in the options
- [e38b86d](https://github.com/flobacher/SVGInjector2/commit/e38b86dfb7df6a8dc9fa80c2e7a0645987f4734d) prefix styletags upon injection (@flobacher)
- [d317caa](https://github.com/flobacher/SVGInjector2/commit/d317caab138624da7e7e2ad2697c6b543265cdce) add default icon class -> if inect-target has this class, all styles within the svg-symbol will be removed and a default icon class will be applied
- [9e7b071](https://github.com/flobacher/SVGInjector2/commit/9e7b0712f156da3a03711229fc9f741cf6766115) update minified version
- [d9c017c](https://github.com/flobacher/SVGInjector2/commit/d9c017cdaf33bdc5d36c43936c9bf0c88bce005a) fix remove style tag from parent, which can be a <defs> as well as the svg-root element
- [eb0d92e](https://github.com/flobacher/SVGInjector2/commit/eb0d92e1e6ae1db1a21d534343a756d157a6bef4) output correct logs
- [d1c81ce](https://github.com/flobacher/SVGInjector2/commit/d1c81ce2ff208755536c3cbc211d1896877fc363) do not remove classnames if not there (@flobacher)
- [55c6657](https://github.com/flobacher/SVGInjector2/commit/55c6657de945b457b452c1a7c07b971e6a9fce5f) remove fallback classes on injection
- [59c2c17](https://github.com/flobacher/SVGInjector2/commit/59c2c1783e420ad23dbfb43ea10aad69ba36f192) remove no-svg class from html element is svg is supported
- [34cb3ba](https://github.com/flobacher/SVGInjector2/commit/34cb3ba47db35b33c96bea3b2625623e37a43f87) optimise classname creation
- [fe09f74](https://github.com/flobacher/SVGInjector2/commit/fe09f74d48a39d0d54b0a64b26c4d36978c672d4) bugfix fallback classname creation
- [3978592](https://github.com/flobacher/SVGInjector2/commit/39785924ef7af039038307ca8d6aaa19943c583b) bugfix fallback classname creation
- [2229e36](https://github.com/flobacher/SVGInjector2/commit/2229e36f089195851d966d0695a979785d065845) provide array with fallback classnames that contain a replacement-char
- [1131a95](https://github.com/flobacher/SVGInjector2/commit/1131a95804f7dc6303d8c97524b3a469be0760f8) png-fallbacks
- [5efa1de](https://github.com/flobacher/SVGInjector2/commit/5efa1de97215517f4be0f33de0acb432b55b248e) png fallbacks work
- [01e5a0c](https://github.com/flobacher/SVGInjector2/commit/01e5a0ce06bbadaa1c2fe43041184f3e33a15ada) cleanup, add drop_console to uglify options -> remove calls to console.log in dist, but leave in debug version
- [a6f31d2](https://github.com/flobacher/SVGInjector2/commit/a6f31d2ba0f63c40633fad9152ed854258c62097) add dist files (@flobacher)
- [588bac2](https://github.com/flobacher/SVGInjector2/commit/588bac2944848875d0dde08752dbf5a11b1de836) add editor-config (@flobacher)
- [1ce9a4a](https://github.com/flobacher/SVGInjector2/commit/1ce9a4a4f4904b55cb600710dc98b08e72c67783) style tags will be removed if special class is found on injection-target, name of this class is configurable via options (@flobacher)
- [e80cbdd](https://github.com/flobacher/SVGInjector2/commit/e80cbdd710f91c57e01772ec9fa8c0a9e8f5137b) queryselector is used to speed up finding of the svg shape inside the referenced view's viewbox (@flobacher)
- [fecb5a7](https://github.com/flobacher/SVGInjector2/commit/fecb5a7ec1cdd6001cc637eb55048ab7cb7b1a7d) update fragment-id example (@flobacher)
- [b37313e](https://github.com/flobacher/SVGInjector2/commit/b37313ecf87f6bff62ba4581c934e9fadf34e78c) if view displays a use tag, the referenced symbol is injected (@flobacher)
- [2f35d0e](https://github.com/flobacher/SVGInjector2/commit/2f35d0efbe45c9e67fe1b5ff1a4e6678b1d4f2db) extend fragment-id example by a spritesheet generated with grunt-svg-sprite (@flobacher)
- [fd16ef5](https://github.com/flobacher/SVGInjector2/commit/fd16ef578304b398f4ec6f8d18a198a05e644ac9) enable default fallback for sprites referenced via fragment-id (@flobacher)
- [5966d86](https://github.com/flobacher/SVGInjector2/commit/5966d86d7159c87a954abbcff6b039db7dce1432) add option, to only insert visible part specified via fragment-id of a view-elem (@flobacher)
- [925c812](https://github.com/flobacher/SVGInjector2/commit/925c8120991ba94aeca0718e64221dc55b98afeb) changed indentation (@flobacher)

### 1.1.3-RC (2015/03/28 01:58 +00:00)
- [541df26](https://github.com/flobacher/SVGInjector2/commit/541df26a9bf1c7ac4081824d405a3d60ef9dd7de) update version number for bower (@flobacher)
- [d728414](https://github.com/flobacher/SVGInjector2/commit/d7284140d1fbaa7604dba622dd4005b653c6cf92) add example for symbol and view referencing via fragment-ids
- [a9840d8](https://github.com/flobacher/SVGInjector2/commit/a9840d89aac57890efb519779cc4a0990665d8c2) add support for fragment-ids specifying views or symbols
- [e84f9b4](https://github.com/flobacher/SVGInjector2/commit/e84f9b47eadb501e68a4d0d5b6593935e8d25c19) version bump for RC 1.1.3 testing (@protodave)
- [fae3a70](https://github.com/flobacher/SVGInjector2/commit/fae3a704af7283277051bd038760a656fff3a37f) Workaround/Fix for IE not using style tags from injected SVG files. Ref: issue #23 - Internet Explorer 11 svg images appears all black (@protodave)
- [2b209bb](https://github.com/flobacher/SVGInjector2/commit/2b209bbc0de09ce9257cf55b582ebf859f444d8b) Added npm install details (@protodave)
- [9f25052](https://github.com/flobacher/SVGInjector2/commit/9f25052fcc815aa719ba86506470b6ac2003612a) Updated author info in prep for npm publishing (@protodave)
- [db7f1e7](https://github.com/flobacher/SVGInjector2/commit/db7f1e7d2c1ecbf00e0abc2cd81dc07b631f8d08) Added CORS test in prep for adding XDomainRequest for IE9 (@protodave)
- [77ce693](https://github.com/flobacher/SVGInjector2/commit/77ce693181ba059714081ead83b598e70ebed162) Added keyword (@protodave)
- [d00ef1f](https://github.com/flobacher/SVGInjector2/commit/d00ef1f0d8ddfff7e61147ca48955ef740d3a226) updated svg/png assets and js library for examples and tests (@protodave)
- [e01b63e](https://github.com/flobacher/SVGInjector2/commit/e01b63e586b8ab61203eb58e1d94b3b2626873ec) changelog update (@protodave)

### 1.1.2 (2014/10/27 21:50 +00:00)
- [7266bcf](https://github.com/flobacher/SVGInjector2/commit/7266bcf7eeda3e4c33d2fa15bc9365ea57985959) updated changelog (@protodave)
- [eae8b22](https://github.com/flobacher/SVGInjector2/commit/eae8b2268f5cc3a1430f76a318b7eac3c31fdc3d) New build and version bump (@protodave)
- [e498e03](https://github.com/flobacher/SVGInjector2/commit/e498e03eb2c40d3907c5cddb035a1705bfa5f384) Make sure any mask ids and their references are unique so we can safely use the same SVG multiple times on the same page (like we already do for clipPaths) (@protodave)
- [8da3cfb](https://github.com/flobacher/SVGInjector2/commit/8da3cfbf239b286c6046f7cd1f80261690ad9a5d) changelog update (@protodave)

### 1.1.1 (2014/10/15 21:08 +00:00)
- [0b76f3b](https://github.com/flobacher/SVGInjector2/commit/0b76f3b82529757508d0fb7a9fba582089f16abe) version bump, v1.1.1 (@protodave)
- [55ac808](https://github.com/flobacher/SVGInjector2/commit/55ac808b03bf691d69230359d2436156def0d0bd) Fix for issue #17 - "SVG Injector doesn't work if there is a URL parameter". Updated the regex that was matching for an svg file extension to allow for query strings. (@protodave)

### 1.1.0 (2014/07/01 21:01 +00:00)
- [173dc9b](https://github.com/flobacher/SVGInjector2/commit/173dc9b9c205c8ff1441391d3fb70e7172caf162) update version in bower.json (@protodave)
- [0e1cce5](https://github.com/flobacher/SVGInjector2/commit/0e1cce5e792358bc0ce4ac3158cd3e77e10c5245) Updated CHANGELOG for 1.1.0 release (@protodave)
- [fe70317](https://github.com/flobacher/SVGInjector2/commit/fe703175448b3ba2768b8425eebf7f01ee3ae2c8) updated min/map dist build (@protodave)
- [e2e2438](https://github.com/flobacher/SVGInjector2/commit/e2e24383f97a60adbc64cfe546f21813964f9bd9) Unlink elements var to aid GC and avoid detacted DOM elements (@protodave)
- [9be5041](https://github.com/flobacher/SVGInjector2/commit/9be50413b67bff29d9fc799c0553dbee06fb2fad) min/map dist build and updated lib in examples and tests (@protodave)
- [ce1eaa8](https://github.com/flobacher/SVGInjector2/commit/ce1eaa84eef55776926799818c4f8fcdbe43725a) Move the use of injectOf() until _after_ the check for SVG support during injection so we can avoid adding the extra code for an IE8 indexOf() polyfill (@protodave)
- [f3e1bfb](https://github.com/flobacher/SVGInjector2/commit/f3e1bfb77358ca6404c3aeffea9aae316cc5d919) Clean up references to the replaced elements during injection, which end up as detached DOM elements, so they can be GC'd (@protodave)
- [96cb187](https://github.com/flobacher/SVGInjector2/commit/96cb187a14e14dfda303612d1b66d8477643d9c8) Updated build and examples svg-injector.min.js files (@protodave)
- [67c2355](https://github.com/flobacher/SVGInjector2/commit/67c2355f260c8f277efa9983ceeb01160c48e56a) Added test for race condition during injection, Issue #12 (@protodave)
- [2ee9f87](https://github.com/flobacher/SVGInjector2/commit/2ee9f87c8ba0a8c97eddfcb8d64006c603a7bbf5) Address Issue #12 - Injection race condition (@protodave)
- [f37d0ad](https://github.com/flobacher/SVGInjector2/commit/f37d0adafc1ecc90e3e6cf0cca4525b752276321) added "examples" to bower.json ignore (@protodave)
- [10c2a24](https://github.com/flobacher/SVGInjector2/commit/10c2a244e50a1680001ad657803cfcd92b76f055) removed some extra classes that were added for testing in the all-the-things examples (@protodave)
- [26545d9](https://github.com/flobacher/SVGInjector2/commit/26545d96dc3a889c35350a79f98a89ed2473f1d4) readme update (@protodave)
- [88778d7](https://github.com/flobacher/SVGInjector2/commit/88778d7a9491af523d48ece8595c6abd8f8e8430) new dist build and examples updates (@protodave)
- [f6eb3a7](https://github.com/flobacher/SVGInjector2/commit/f6eb3a740dc2884d96a1b97156b1926933544ac1) reverted the isFunction() and isDefined() refactor PR since you can't pass undefined/undeclared vars to functions in JS (@protodave)
- [fd321d6](https://github.com/flobacher/SVGInjector2/commit/fd321d61f8108fedb49c34d3b6bfb6c7ae65ca16) to explain why this merge is necessary, (@protodave)
- [8f04917](https://github.com/flobacher/SVGInjector2/commit/8f04917452f0ad18903ea0281c4be04716f5977b) Conflicts: 	svg-injector.js (@protodave)
- [70ec72e](https://github.com/flobacher/SVGInjector2/commit/70ec72e1901e33c3687d25b1ce93af6632a0f1a0) updated dist build and examples (@protodave)
- [fa118b0](https://github.com/flobacher/SVGInjector2/commit/fa118b0f8df40885ebe0c2698f1749ad36b46a75) Merge branch 'stryju-patch-1' (@protodave)
- [56d22c0](https://github.com/flobacher/SVGInjector2/commit/56d22c06b02cfc6faae090a2943f38a060e07eff) Conflicts: 	svg-injector.js (@protodave)
- [8066bf6](https://github.com/flobacher/SVGInjector2/commit/8066bf60026ec8c98af36d30a2cd3f1c3cbb65a2) updated dist build and examples svg-injector.min.js files (@protodave)
- [4350111](https://github.com/flobacher/SVGInjector2/commit/43501118d127c678dbe5adb951ec7b88d4f7ff5b) Simplified class merging (@protodave)
- [#11](https://github.com/flobacher/SVGInjector2/pull/11) TODO: don't add class dups (@stryju)
- [1f09fd9](https://github.com/flobacher/SVGInjector2/commit/1f09fd944b32071cf6cb00448806085fda474e87) Added per-element PNG fallback functionality via setting a data-fallback or data-png attribute. (@protodave)
- [1814600](https://github.com/flobacher/SVGInjector2/commit/18146006fc751a484aff0ecba473b0d7ef276a7d) TODO: don't add dups (@stryju)
- [207dee9](https://github.com/flobacher/SVGInjector2/commit/207dee91f44423c8396d8c8f157c22d37834bb72) small cleanup (@stryju)
- [972fdf6](https://github.com/flobacher/SVGInjector2/commit/972fdf62f98ee2c68c8c8f132c2e2f64867581ff) different forEach approach (@stryju)
- [e2d6d62](https://github.com/flobacher/SVGInjector2/commit/e2d6d626560911154257367d629e6a59d6e239b2) Updated bower package name in the install command (@protodave)

### 1.0.1 (2014/05/08 22:31 +00:00)
- [fbb6fce](https://github.com/flobacher/SVGInjector2/commit/fbb6fce1c9670c160f2c23638e759ed6fa304225) updated changelog (@protodave)
- [b0c055c](https://github.com/flobacher/SVGInjector2/commit/b0c055c778430878e8a12ce14389c9812fbe9ffc) Bump to v1.0.1 (@protodave)
- [#5](https://github.com/flobacher/SVGInjector2/pull/5) Bower (@hoetmaaiers)
- [7d78660](https://github.com/flobacher/SVGInjector2/commit/7d786602a1b62c327a21cbaaf9a9bef36e772fe6) add install with bower to README (@hoetmaaiers)
- [52b0483](https://github.com/flobacher/SVGInjector2/commit/52b0483e913fe89c1aeafefd6d3399ab75f77b07) init bower (@hoetmaaiers)
- [c5a7fb4](https://github.com/flobacher/SVGInjector2/commit/c5a7fb40e379b566c7577f0f3b9b1c00d2c7278c) Fixed a link in the README (@protodave)
- [4fc172a](https://github.com/flobacher/SVGInjector2/commit/4fc172a2d54b7ed02e5dd42165b970db398bb4ff) Added examples (@protodave)
- [7adef6e](https://github.com/flobacher/SVGInjector2/commit/7adef6e409bef6e490524f33b831eab2089e39eb) Updated documentation (@protodave)
- [172e267](https://github.com/flobacher/SVGInjector2/commit/172e267b7cd119728070003675e0a6453df32442) Update README.md (@protodave)
- [#2](https://github.com/flobacher/SVGInjector2/pull/2) Missing a closing `)` on example console.log (@FStop)
- [60c74dc](https://github.com/flobacher/SVGInjector2/commit/60c74dc119c24e6ae160c86031be0128da625979) Missing a closing `)` on example console.log (@FStop)
- [f40df63](https://github.com/flobacher/SVGInjector2/commit/f40df632f1e413eb1bdcfa2a036ad845edba7af3) Update README.md (@protodave)
- [9a4a8ba](https://github.com/flobacher/SVGInjector2/commit/9a4a8ba8910fc991a76ac889b43bbf1993571321) Updated CHANGELOG (@protodave)
- [f61e766](https://github.com/flobacher/SVGInjector2/commit/f61e766220e3c70e98704b265d653977a96344a7) created first min/map dist build (@protodave)
- [3c69267](https://github.com/flobacher/SVGInjector2/commit/3c692679056e3270b97e0718d50255983b05e8e5) added a package.json and .gitignore (@protodave)
- [13a2af6](https://github.com/flobacher/SVGInjector2/commit/13a2af6af1bd61dab6b1ff34c84c7d6f6fd79dcf) Added jshintrc and some jshint wrapper rules to svg-injector.js (@protodave)

### 1.0.0 (2014/03/31 17:33 +00:00)
- [9aeec36](https://github.com/flobacher/SVGInjector2/commit/9aeec3623a33770ddebdfbe54c6585e0d63a60e3) copy header update (@protodave)
- [af53074](https://github.com/flobacher/SVGInjector2/commit/af530747f8039ddabb41d5238a5cd120d4989a51) code format fixes (@protodave)
- [495f468](https://github.com/flobacher/SVGInjector2/commit/495f4681485831140d417003eac7b734430ab388) spelling fix (@protodave)
- [ff3b341](https://github.com/flobacher/SVGInjector2/commit/ff3b34194cab2a4655463c7d2f3cabbd242fcb28) copy formatting update (@protodave)
- [49adbde](https://github.com/flobacher/SVGInjector2/commit/49adbde371b3d9d7fcdaab411d01a976a46ef41c) first code commit (@protodave)
- [0280954](https://github.com/flobacher/SVGInjector2/commit/02809541241ab8ebf88135124bac2be27d9e2538) Initial commit (@protodave)