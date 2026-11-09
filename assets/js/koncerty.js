/*
  SEZNAM VYSTOUPENÍ
  -----------------
  Nový koncert přidejte na začátek seznamu. Web si sám pozná,
  co je nadcházející a co už proběhlo (podle data).

  date   – datum ve tvaru RRRR-MM-DD (povinné)
  end    – poslední den, pokud jde o vícedenní festival (nepovinné)
  title  – název akce (povinné)
  place  – místo / město (povinné)
  venue  – klub, adresa (nepovinné)
  time   – začátek, např. "19:30" (nepovinné)
  note   – krátká poznámka (nepovinné)
  type   – "festival" pro festivaly (nepovinné)
  url    – odkaz na akci nebo vstupenky (nepovinné)
*/

window.KONCERTY = [
  // 2026
  { date: "2026-10-31", title: "Koncert Monogramu", place: "Zlín", venue: "Zelenáčova Šopa" },
  { date: "2026-10-07", title: "Koncert Monogramu", place: "Praha 2", venue: "Pavillon du Vin, Mánesova 87", time: "19:30" },
  { date: "2026-09-06", title: "Bluegrass Theatre", place: "Metylovice", type: "festival" },
  { date: "2026-09-05", title: "Bluegrass na dobrom mieste", place: "Bratislava, Slovensko" },
  { date: "2026-08-28", end: "2026-08-30", title: "Waterford", place: "Irsko", type: "festival" },
  { date: "2026-08-23", title: "Monogram & Pavlína Jíšová", place: "Praha – Troja", venue: "Galerie Trojský kůň, Vodácká 136", time: "19:00" },
  { date: "2026-08-22", title: "Country Kaninafest", place: "Kanina u Kokořína", type: "festival" },
  { date: "2026-08-15", title: "Bluegrass i de Müli", place: "Švýcarsko", type: "festival" },
  { date: "2026-07-31", end: "2026-08-02", title: "La Roche-sur-Foron", place: "Francie", type: "festival" },
  { date: "2026-07-19", title: "Do modra", place: "Praha" },
  { date: "2026-07-18", title: "Varta", place: "Batňovice", type: "festival" },
  { date: "2026-06-27", title: "Porta", place: "Řevnice", type: "festival" },
  { date: "2026-06-20", title: "Gulášek", place: "Kdyně", type: "festival" },
  { date: "2026-06-13", title: "Banjo Jamboree", place: "Čáslav", type: "festival" },

  // 2025
  { date: "2025-10-25", title: "Koncert Monogramu", place: "Zlín", venue: "Zelenáčova Šopa" },
  { date: "2025-09-07", title: "Koncert Monogramu", place: "Praha – Troja", venue: "Galerie Trojský kůň" },
  { date: "2025-09-06", title: "Bluegrass Marathon", place: "Borovany u Tachova", type: "festival" },
  { date: "2025-09-05", title: "Koncert Monogramu", place: "Kodaň, Dánsko" },
  { date: "2025-08-30", title: "Mohelnický folkfest", place: "Mohelnice", type: "festival" },
  { date: "2025-08-23", title: "Rozkošné Ameriky", place: "Autokemp Rozkoš", type: "festival" },
  { date: "2025-08-22", title: "Dobrofest", place: "Trnava, Slovensko", type: "festival" },
  { date: "2025-07-11", end: "2025-07-13", title: "Strenger i Gress", place: "Norsko", type: "festival" },
  { date: "2025-06-25", title: "Koncert Monogramu", place: "Praha", venue: "Malostranská beseda" },
  { date: "2025-05-24", title: "Country Kladivo na Bosně", place: "Třtice, okr. Náchod", type: "festival" },
  { date: "2025-05-10", title: "Čierny Balog", place: "Slovensko", type: "festival" },
  { date: "2025-03-22", title: "Akustické vlny", place: "Praha", venue: "Vinohradský pivovar, Korunní 106", type: "festival" },

  // 2024
  { date: "2024-11-30", title: "Koncert Monogramu", place: "Číměř", venue: "Klub Stodola u Majdy, Potočná 12", time: "20:00" },
  { date: "2024-11-09", title: "Koncert Monogramu", place: "Zlín", venue: "Zelenáčova Šopa" },
  { date: "2024-09-14", title: "Koncert Monogramu", place: "Terezín" },
  { date: "2024-08-03", title: "Country ve stodole", place: "Bělá pod Radbuzou", type: "festival" },
  { date: "2024-07-21", title: "Bluegrass Theatre", place: "Metylovice", type: "festival" },
  { date: "2024-07-19", title: "Bundy zelený", place: "Zádveřice", type: "festival" },
  { date: "2024-06-29", title: "Porta", place: "Řevnice", type: "festival" },
  { date: "2024-06-27", title: "Monogram & Professional Deformation", place: "Praha – Troja", venue: "Galerie Trojský kůň, Vodácká 1", time: "19:30" },
  { date: "2024-06-14", title: "Banjo Jamboree", place: "Čáslav", type: "festival" },
  { date: "2024-06-01", title: "Koncert Monogramu", place: "Mníšek pod Brdy", note: "Dětský den" },
  { date: "2024-05-31", title: "Koncert Monogramu", place: "Praha", venue: "KD Gong", note: "Křest CD kapely Flashback" },
  { date: "2024-04-26", title: "Koncert Monogramu", place: "Praha", venue: "Levitův mlýn" },
  { date: "2024-04-17", title: "Koncert Monogramu", place: "Praha", venue: "Balbínka" }
];
