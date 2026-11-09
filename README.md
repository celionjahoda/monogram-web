# Monogram – web kapely

Statický web (čisté HTML, CSS a JS). Nepotřebuje žádný server, databázi ani build. Stačí nahrát celý obsah složky na hosting.

## Struktura

| Stránka | Soubor |
| --- | --- |
| Úvod | `index.html` |
| Vystoupení | `vystoupeni.html` |
| O kapele (+ členové) | `o-kapele.html` |
| Hudba | `hudba.html` |
| Video | `video.html` |
| Fotogalerie | `fotogalerie.html` |
| Obchod | `obchod.html` |
| Kontakt (+ ke stažení) | `kontakt.html` |

`assets/css/style.css` obsahuje styly, `assets/js/main.js` chování stránek a `assets/js/koncerty.js` seznam koncertů.
Ve složce `assets/img`, `assets/audio` a `assets/files` jsou fotky, ukázky a PDF.

## Časté úpravy

**Přidat koncert:** otevřete `assets/js/koncerty.js` a nahoru do seznamu přidejte řádek, třeba:

```js
{ date: "2027-03-14", title: "Koncert Monogramu", place: "Praha", venue: "Malostranská beseda", time: "19:30" },
```

Web si podle data sám pozná, jestli koncert patří mezi nadcházející, nebo odehrané. Nejbližší koncert se zobrazí i na úvodní stránce.

**Logo:** uložte ho jako `assets/img/logo.svg` (případně `.png`). V každém HTML souboru je v hlavičce komentář `<!-- LOGO: ... -->`. Dva řádky pod ním nahraďte za `<img src="assets/img/logo.svg" alt="Monogram">`.

**Objednávky CD:** formulář zatím otevře e-mailového klienta s předvyplněnou objednávkou pro jahod250@gmail.com. Pokud mají objednávky chodit přímo bez e-mailového klienta, založte si zdarma formulář třeba na formspree.io a jeho adresu vložte do `obchod.html` do atributu `data-endpoint="..."`.

## Spuštění na počítači

Soubory jdou otevřít rovnou v prohlížeči. Přehrávač a některé prohlížeče ale fungují spolehlivěji přes lokální server:

```bash
npx serve .
```

## Zveřejnění

Hodí se jakýkoli statický hosting, třeba GitHub Pages, Netlify, Cloudflare Pages nebo běžný webhosting přes FTP. Až bude doména, nasměrujte ji na hosting. Odkazy na sociální sítě (`og:image`) počítají s adresou `https://monogram.cz/`.
