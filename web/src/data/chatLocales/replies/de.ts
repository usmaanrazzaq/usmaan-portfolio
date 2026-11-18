import { heroLink } from "@/data/heroChat";
import type { LocaleReplies } from "../types";

/**
 * German replies. Informal "du", as the English is. Commands suggested here
 * ('über mich', 'Kontakt', ...) must stay in keywords/de.ts.
 * Review: not yet reviewed by a native speaker.
 */
const de: LocaleReplies = {
  topics: {
    name: [["Usmaan. Zwei a, ein m. Der häufigste Tippfehler in meinem Postfach."]],
    who: [
      [
        "Ich bin Product Designer in New York. Ich begleite Produkte von der Recherche über das Design bis zum fertigen Code, meistens allein fürs Design im Team zuständig.",
        "Willst du die lange Version?",
      ],
      ["Immer noch Usmaan, immer noch Product Designer.", "Schreib 'über mich' für die ganze Geschichte."],
    ],
    location: [["New York. Die Uhr unter meinem Namen läuft live, so siehst du, ob ich wach bin."]],
    background: [
      [
        "Ich studiere Design (BFA) am Queens College.",
        "Seit 2021 gestalte ich für Consumer-Apps, gemeinnützige Organisationen und E-Commerce, von Rented bis Adsum NYC.",
      ],
    ],
    now: [
      [
        "Gerade bin ich Product Designer bei Adsum NYC, einer Modemarke aus Brooklyn.",
        "Und ich habe gerade Shifts abgeschlossen, eine Schichtplanungs-App für Teams. Soll ich dir von Adsum erzählen?",
      ],
    ],
    process: [
      [
        "Von Anfang bis Ende. Ich beginne mit Recherche, gestalte in Figma und baue es dann selbst oder direkt mit den Entwicklern.",
        "Weil ich den Code auch selbst ausliefere, geht zwischen Entwurf und Produkt nichts verloren.",
      ],
      ["Kurz gesagt: Recherche, Design, Umsetzung, und zurück zur Recherche, sobald echte Menschen es benutzen."],
    ],
    research: [
      [
        "Mit Recherche fange ich an. Für NMYA habe ich Fokusgruppen über Altersgruppen und Rollen hinweg geleitet, für WCM Hunderte App-Store-Bewertungen gelesen.",
        "Soll ich dir von NMYA erzählen?",
      ],
    ],
    code: [
      [
        "Ja, ich programmiere. Diese Seite ist mit Next.js, TypeScript und Tailwind gebaut.",
        "Ich habe einen individuellen Shopify-Shop für DPR Studio umgesetzt und die Seiten von NMYA und Shifts gebaut. So muss kein Entwickler raten, was ich gemeint habe.",
      ],
    ],
    tools: [
      [
        "Figma fürs Design. Ein Code-Editor für alles danach.",
        "Next.js, TypeScript und Tailwind für die Umsetzung, und Shopify, wenn es etwas zu verkaufen gibt.",
      ],
    ],
    team: [
      [
        "Meistens kümmere ich mich allein ums Design und arbeite direkt mit Entwicklung und Gründungsteam.",
        "Wer Design und Code spricht, braucht weniger Übergabedokumente, die niemand liest.",
      ],
    ],
    mobile: [
      [
        "Jede Menge. Rented und Shifts sind beides Apps, und WCM Connect ist das Redesign einer Patienten-App.",
        "Wollen wir mit Rented anfangen? In der Fallstudie steckt ein funktionierender Prototyp.",
      ],
    ],
    clients: [
      [
        "Consumer-Apps, eine landesweite gemeinnützige Organisation und Mode- und E-Commerce-Marken.",
        "Unter anderem Adsum NYC, DPR Studio, Rented und die National Muslim Youth Association. Schreib 'Portfolio', um sie zu sehen.",
      ],
    ],
    favourite: [
      [
        "On The Run Studio. Daran baue ich am längsten, seit 2021.",
        "Willst du die Geschichte hören?",
      ],
    ],
    hardest: [
      [
        "NMYA. Viele Beteiligte, viele Meinungen und eine WordPress-Seite, die aus allen Nähten platzte.",
        "Die Fokusgruppen gaben allen dieselbe Grundlage, um sich zu einigen. Willst du hören, wie es lief?",
      ],
    ],
    inspiration: [
      [
        "Dieter Rams, Massimo Vignelli, Jan Tschichold, John Pawson, Peter Zumthor. Weniger, aber besser.",
        "Den Rest sammle ich auf der Seite References. Soll ich dich hinbringen?",
      ],
    ],
    philosophy: [
      [
        "Gutes Design ist nicht nur, wie etwas aussieht. Es ist, wie es funktioniert und wie es sich für Menschen anfühlt.",
        "Visuell bin ich eher Schweizer Schule: Raster, Zurückhaltung und nichts, das sich seinen Platz nicht verdient hat.",
      ],
    ],
    explorations: [
      [
        "Unter Explorations sammle ich persönliche Experimente, etwa einen Onboarding-Prototyp für Genres bei GoodReads und ein Redesign der Claude-Code-Seitenleiste.",
        "Soll ich dich hinbringen?",
      ],
    ],
    references: [
      [
        "References ist eine Sammlung von Bildern, die mich beim Gestalten inspirieren: ein Bild davon, wie ich über Design denke.",
        "Sie speist sich aus meinen Are.na-Kanälen und wächst mit ihnen. Soll ich dich hinbringen?",
      ],
    ],
    site: [
      [
        "Ich habe sie gestaltet und gebaut. Unter der Haube Next.js, obendrauf Schweizer Zurückhaltung.",
        "Dieser Chat ist ein kleines Skript von mir, keine Live-Leitung zu meinem Handy. Leider für uns beide.",
      ],
    ],
    bot: [
      [
        "Ehrlich gesagt: Du sprichst mit einer geskripteten Version von mir.",
        "Das Original antwortet über das Kontaktformular. Schreib 'Kontakt', dann öffnet es sich.",
      ],
    ],
    hire: [
      [
        "Ich bin offen für Festanstellung, Freelance oder Projektverträge: vor Ort in New York, remote oder mit Umzug.",
        "Das Kontaktformular landet direkt bei mir. Soll ich es öffnen?",
      ],
    ],
    rates: [
      [
        "Das hängt vom Projekt ab, also eher ein Gespräch als eine Chatblase.",
        "Soll ich das Kontaktformular öffnen, damit du mir erzählst, woran du arbeitest?",
      ],
    ],
    personal: [
      ["Das Private lasse ich aus dem Portfolio raus.", "Über Design rede ich dafür den ganzen Tag."],
      ["Immer noch inoffiziell.", "Frag mich lieber nach einem Projekt?"],
    ],
    contact: [["Das Kontaktformular landet direkt in meinem Postfach.", "Ich öffne es für dich."]],
    resume: [["Bitte schön.", heroLink("resume")]],
    socials: [
      [
        "Such dir eine Plattform aus:",
        heroLink("linkedin"),
        heroLink("instagram"),
        heroLink("github"),
        heroLink("x"),
      ],
    ],
    greeting: [
      [
        "Hallo! Schön, dass du vorbeischaust.",
        "Frag mich nach meiner Arbeit, meinem Prozess oder einem Projekt. Oder schreib 'Portfolio', um direkt hinzuspringen.",
      ],
      ["Hallo nochmal.", "Was möchtest du wissen?"],
    ],
    "how-are-you": [
      [
        "Gut, danke. Irgendwo zwischen einer Figma-Datei und einem Pull Request, wie immer.",
        "Wobei kann ich dir helfen?",
      ],
      ["Immer noch gut. Immer noch am Gestalten.", "Möchtest du etwas über die Arbeit wissen?"],
    ],
    thanks: [["Jederzeit."], ["Gern. Danke, dass du dich umschaust."]],
    bye: [["Danke für den Besuch. Komm bald wieder, meistens gibt es etwas Neues."]],
    compliment: [
      ["Danke, das hat mir wirklich den Tag versüßt.", "Wenn dir das gefällt: Die Fallstudien gehen tiefer."],
      ["Zu freundlich. Mach weiter so, und ich fange an, es zu glauben."],
    ],
    critique: [
      [
        "Notiert. Kritik ist einfach kostenlose Recherche.",
        "Wenn du Details hast, bringt sie das Kontaktformular zu mir. Schreib 'Kontakt'.",
      ],
    ],
    joke: [
      ["Wie viele Designer braucht man, um eine Glühbirne zu wechseln?", "Muss es denn eine Glühbirne sein?"],
      ["Ich habe mal einen Entwickler gebeten, ein Div zu zentrieren.", "Wir sind noch in Kontakt. Das Div nicht."],
    ],
    test: [["Test angekommen. Alles funktioniert, ich auch."]],
    help: [
      [
        "Frag mich nach meinem Prozess, einem Projekt wie Rented oder Adsum, woran ich gerade arbeite oder wie du mich erreichst.",
        "Oder schreib 'Portfolio', 'über mich', 'Experimente', 'Referenzen' oder 'Kontakt'.",
      ],
    ],
    work: [["Hier ist die Arbeit."]],
    "about-open": [["Ich bringe dich zur Seite About."]],
    "explorations-open": [["Ich öffne Explorations."]],
    "references-open": [["Ich öffne References."]],
    "contact-open": [["Ich öffne das Kontaktformular."]],
    affirm: [
      ["Schöne Begeisterung.", "Frag mich nach meinem Prozess, einem Projekt oder woran ich gerade arbeite."],
      ["Einverstanden. Womit, weiß ich nicht genau, aber einverstanden.", "Frag doch nach einem Projekt, etwa 'Rented' oder 'Adsum'."],
    ],
    decline: [["Kein Problem.", "Ich bin hier, falls dir noch etwas einfällt."], ["Alles klar."]],
  },
  projects: {
    shifts: [
      "Shifts ist eine Schichtplanungs-App für Teams: ein ruhiger Kalender, der zeigt, wer wann arbeitet. Ich habe sie gestaltet und gebaut, der Prototyp ist also das Produkt.",
      "Das Ergebnis: Eine lokale gemeinnützige Organisation hat vier Tage lang ihr Sicherheitsteam damit geplant, rund 15 Leute in 3 Teams und 20 bis 30 Schichten, und sah endlich ohne Tabelle, wo jemand fehlt.",
    ],
    rented: [
      "Rented ist eine Peer-to-Peer-Miet-App für Stadtbewohner. Bohrmaschine leihen statt kaufen.",
      "Ich war allein fürs Product Design zuständig, zusammen mit dem Gründungsteam und der Entwicklung. Ich habe zwei Runden Usability-Tests durchgeführt und einen funktionierenden Prototyp gebaut, der live in der Fallstudie läuft.",
      "Das Ergebnis: Die Erfolgsquote bei der ersten Aufgabe stieg zwischen den Runden von 71 % auf 100 %, das Onboarding dauerte unter einer Minute, und die Entwickler bekamen über 30 umsetzungsfertige Screens.",
    ],
    nmya: [
      "Für die National Muslim Youth Association habe ich das komplette Redesign ihrer Website geleitet und sie von einer malwareanfälligen WordPress-Installation zu Webflow umgezogen.",
      "Ich habe Fokusgruppen mit verschiedenen Altersgruppen, Rollen und Vorkenntnissen geleitet und die Seite dann nach dem Gehörten neu gestaltet und gebaut.",
      "Das Ergebnis: Wenige Monate nach dem Launch stiegen die Besuche um 30 %, die Seitenaufrufe um 15 % und die wiederkehrenden Besucher um 10 bis 15 %. Wichtige Seiten waren statt fünf, sechs Klicks nur noch zwei, drei entfernt.",
    ],
    adsum: [
      "Adsum NYC ist eine Modemarke aus Brooklyn mit über 25.000 Besuchern im Monat. Mit dem Gründer gestalte und betreibe ich den Shopify-Shop, dazu Kampagnen und E-Mails.",
      "Das Ergebnis, auf das ich am meisten zeige: Ein Größenfilter, den ich von Grund auf gebaut habe, senkte die Klicks auf ausverkaufte Größen um 35 %.",
      "Und die Launch-E-Mails, die ich gestalte, haben eine Öffnungsrate von 43,8 %, bei einem Branchenschnitt von etwa 33 %.",
    ],
    dpr: [
      "DPR Studio ist ein Produktionsstudio aus Kalifornien: Kleidung, Markenidentität, Art Direction.",
      "Mit dem Gründer habe ich ihren individuellen Shopify-Shop neu gestaltet und gebaut, von der Recherche bis zum fertigen Code.",
    ],
    otrs: [
      "On The Run Studio begann 2021 als mein persönlicher Moodboard-Account. Dort hat sich der Großteil meines Geschmacks geschult.",
      "Das Ergebnis: eine Community von 5.000 Designern und Marken in anderthalb Jahren, von mir gestaltetes Merch, das bis nach Frankreich, Spanien und Großbritannien verkauft wurde, und schließlich ein ganzes Designstudio.",
    ],
    wcm: [
      "WCM Connect ist ein eigenes Konzept: Ich habe Onboarding, Dashboard und Terminbuchung einer echten Patienten-App neu gestaltet.",
      "Das Briefing kam aus den App-Store-Bewertungen. Die Nutzer hatten die Recherche schon gemacht, ich musste sie nur lesen.",
      "Das Ergebnis: ein einfacheres Onboarding, ein Dashboard rund um die häufigsten Aufgaben der Patienten und weniger Reibung bei der Terminbuchung. Es ist ein Konzept, also gibt es keine Launch-Zahlen, aber die Fallstudie erklärt jede Entscheidung.",
    ],
  },
  misses: [
    ["Hm, das steht nicht in meinem Skript.", "Frag mich nach meinem Prozess, einem Projekt wie Rented oder woran ich gerade arbeite."],
    ["Ich bin eine geskriptete Version von mir, das ging an mir vorbei.", "Schreib 'Hilfe', um zu sehen, was ich beantworten kann."],
    ["Gute Frage. Falscher Chat, leider.", "Versuch 'Portfolio', 'über mich' oder 'Kontakt'."],
  ],
  handoff: ["Das klingt nach einer Frage fürs Original.", "Soll ich das Kontaktformular öffnen?"],
  ui: {
    offerCase: "Willst du die Fallstudie lesen?",
    offerSite: "Willst du die Live-Seite sehen?",
    openingCase: "Ich öffne sie.",
    hereYouGo: "Bitte schön.",
    pageInEnglish: "Kurzer Hinweis: Die Seiten selbst sind auf Englisch.",
    formInEnglish: "Das Formular ist auf Englisch, aber schreib mir ruhig auf Deutsch.",
    hello: "Hallo!",
    link: (text) => `Link: ${text}.`,
  },
};

export default de;
