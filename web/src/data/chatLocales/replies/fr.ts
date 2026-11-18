import { heroLink } from "@/data/heroChat";
import type { LocaleReplies } from "../types";

/**
 * French replies. "Tu", as the English is casual. First-person lines avoid
 * gendered adjectives ("seul", "fier") so they read the same for anyone.
 * Commands suggested here ('à propos', 'contact', ...) must stay in
 * keywords/fr.ts.
 * Review: not yet reviewed by a native speaker.
 */
const fr: LocaleReplies = {
  topics: {
    name: [["Usmaan. Deux a, un m. C'est la faute de frappe la plus courante dans ma boîte mail."]],
    who: [
      [
        "Je suis designer produit à New York. J'emmène les produits de la recherche au design jusqu'au code en production, souvent comme seule personne au design dans l'équipe.",
        "Tu veux la version longue ?",
      ],
      ["Toujours Usmaan, toujours designer produit.", "Écris 'à propos' pour toute l'histoire."],
    ],
    location: [["New York. L'horloge sous mon nom est en direct, tu peux donc voir s'il est l'heure de dormir chez moi."]],
    background: [
      [
        "Je prépare un BFA en design au Queens College.",
        "Depuis 2021, je conçois pour des applis grand public, des associations et l'e-commerce, de Rented à Adsum NYC.",
      ],
    ],
    now: [
      [
        "En ce moment, je suis designer produit chez Adsum NYC, une marque de vêtements de Brooklyn.",
        "Et je viens de terminer Shifts, une appli de planning pour les équipes. Tu veux que je te parle d'Adsum ?",
      ],
    ],
    process: [
      [
        "De bout en bout. Je commence par la recherche, je dessine dans Figma, puis je développe moi-même ou aux côtés des ingénieurs.",
        "Comme je livre aussi le code, rien ne se perd entre la maquette et le produit.",
      ],
      ["Version courte : recherche, design, développement, puis retour à la recherche dès que de vraies personnes l'utilisent."],
    ],
    research: [
      [
        "Tout commence par la recherche. Pour NMYA, j'ai animé des groupes de discussion de tous âges et de tous rôles ; pour WCM, j'ai lu des centaines d'avis sur l'App Store.",
        "Tu veux que je te parle de NMYA ?",
      ],
    ],
    code: [
      [
        "Oui, je code. Ce site est fait avec Next.js, TypeScript et Tailwind.",
        "J'ai livré une boutique Shopify sur mesure pour DPR Studio et développé les sites de NMYA et de Shifts. Les ingénieurs n'ont jamais à deviner ce que je voulais dire.",
      ],
    ],
    tools: [
      [
        "Figma pour le design. Un éditeur de code pour tout le reste.",
        "Next.js, TypeScript et Tailwind côté développement, et Shopify quand il y a quelque chose à vendre.",
      ],
    ],
    team: [
      [
        "Je suis souvent la seule personne au design, juste à côté des ingénieurs et des fondateurs.",
        "Parler à la fois design et code, c'est moins de documents de passation que personne ne lit.",
      ],
    ],
    mobile: [
      [
        "Beaucoup. Rented et Shifts sont deux applis, et WCM Connect est la refonte d'une appli patient.",
        "On commence par Rented ? L'étude de cas contient un prototype fonctionnel.",
      ],
    ],
    clients: [
      [
        "Des applis grand public, une association nationale, et des marques de mode et d'e-commerce.",
        "Adsum NYC, DPR Studio, Rented et la National Muslim Youth Association, entre autres. Écris 'portfolio' pour les voir.",
      ],
    ],
    favourite: [
      ["On The Run Studio. C'est le projet que je construis depuis le plus longtemps, depuis 2021.", "Tu veux l'histoire ?"],
    ],
    hardest: [
      [
        "NMYA. Beaucoup de parties prenantes, beaucoup d'avis, et un site WordPress qui avait fait son temps.",
        "Les groupes de discussion ont donné à tout le monde les mêmes faits pour se mettre d'accord. Tu veux savoir comment ça s'est passé ?",
      ],
    ],
    inspiration: [
      [
        "Dieter Rams, Massimo Vignelli, Jan Tschichold, John Pawson, Peter Zumthor. Moins, mais mieux.",
        "Le reste est sur la page References. Je t'y emmène ?",
      ],
    ],
    philosophy: [
      [
        "Un bon design, ce n'est pas seulement l'apparence. C'est la façon dont ça marche et ce que ça fait ressentir.",
        "Visuellement, je penche pour le style suisse : des grilles, de la retenue, et rien qui n'ait mérité sa place.",
      ],
    ],
    explorations: [
      [
        "Explorations rassemble mes expériences personnelles, comme un prototype d'onboarding par genre pour GoodReads et une refonte de la barre latérale de Claude Code.",
        "Je t'y emmène ?",
      ],
    ],
    references: [
      [
        "References est une collection d'images qui m'inspirent : un portrait visuel de ma façon de penser le design.",
        "Elle vient de mes chaînes Are.na et grandit avec elles. Je t'y emmène ?",
      ],
    ],
    site: [
      [
        "Je l'ai conçu et développé. Next.js sous le capot, retenue suisse par-dessus.",
        "Ce chat est un petit script à moi, pas une ligne directe vers mon téléphone. Dommage pour nous deux.",
      ],
    ],
    bot: [
      [
        "Pour être honnête : tu parles à une version scriptée de moi.",
        "L'original répond via le formulaire de contact. Écris 'contact' et il s'ouvrira.",
      ],
    ],
    hire: [
      [
        "Je suis disponible pour un poste à temps plein, en freelance ou en contrat : sur place à New York, à distance, ou avec un déménagement.",
        "Le formulaire de contact arrive directement chez moi. Je l'ouvre ?",
      ],
    ],
    rates: [
      [
        "Ça dépend du projet, donc c'est plutôt une conversation qu'une bulle de chat.",
        "J'ouvre le formulaire de contact pour que tu me parles de ton projet ?",
      ],
    ],
    personal: [
      ["Je garde le côté personnel hors du portfolio.", "Mais je parle design toute la journée avec plaisir."],
      ["Toujours confidentiel.", "Et si tu me demandais plutôt un projet ?"],
    ],
    contact: [["Le formulaire de contact arrive directement dans ma boîte mail.", "Je te l'ouvre."]],
    resume: [["Le voici.", heroLink("resume")]],
    socials: [
      [
        "Choisis ta plateforme :",
        heroLink("linkedin"),
        heroLink("instagram"),
        heroLink("github"),
        heroLink("x"),
      ],
    ],
    greeting: [
      [
        "Salut ! Merci de passer.",
        "Demande-moi mon travail, ma méthode ou n'importe quel projet. Ou écris 'portfolio' pour y aller directement.",
      ],
      ["Re-bonjour.", "Qu'est-ce que tu aimerais savoir ?"],
    ],
    "how-are-you": [
      [
        "Ça va bien, merci. Quelque part entre un fichier Figma et une pull request, comme d'habitude.",
        "Je peux t'aider avec quoi ?",
      ],
      ["Toujours bien. Toujours en train de designer.", "Tu veux savoir quelque chose sur mon travail ?"],
    ],
    thanks: [["Avec plaisir."], ["Bien sûr. Merci d'avoir jeté un œil."]],
    bye: [["Merci de ta visite. Reviens vite, il y a souvent du nouveau."]],
    compliment: [
      ["Merci, ça me fait vraiment plaisir.", "Si ça t'a plu, les études de cas vont plus loin."],
      ["C'est trop gentil. Continue et je vais finir par y croire."],
    ],
    critique: [
      [
        "C'est noté. La critique, c'est de la recherche gratuite.",
        "Si tu as des détails, le formulaire de contact me les transmet. Écris 'contact'.",
      ],
    ],
    joke: [
      ["Combien de designers faut-il pour changer une ampoule ?", "Est-ce que ça doit vraiment être une ampoule ?"],
      ["Un jour, j'ai demandé à un développeur de centrer une div.", "On est toujours en contact. La div, non."],
    ],
    test: [["Test bien reçu. Tout fonctionne, moi compris."]],
    help: [
      [
        "Demande-moi ma méthode, un projet comme Rented ou Adsum, ce sur quoi je travaille, ou comment me joindre.",
        "Ou écris 'portfolio', 'à propos', 'explorations', 'références' ou 'contact'.",
      ],
    ],
    work: [["Voici le travail."]],
    "about-open": [["Je t'emmène sur la page About."]],
    "explorations-open": [["J'ouvre Explorations."]],
    "references-open": [["J'ouvre References."]],
    "contact-open": [["J'ouvre le formulaire de contact."]],
    affirm: [
      ["J'adore l'enthousiasme.", "Demande-moi ma méthode, un projet, ou ce sur quoi je travaille."],
      ["D'accord. Sur quoi, je ne sais pas trop, mais d'accord.", "Essaie de me demander un projet, comme 'Rented' ou 'Adsum'."],
    ],
    decline: [["Pas de souci.", "Je suis là si une question te vient."], ["Très bien."]],
  },
  projects: {
    shifts: [
      "Shifts est une appli de planning d'équipe : un calendrier calme pour organiser qui travaille quand. Je l'ai conçue et développée, donc le prototype est le produit.",
      "Le résultat : une association locale a géré son équipe de sécurité dessus pendant quatre jours, environ 15 personnes réparties en 3 équipes et 20 à 30 créneaux, et a enfin pu voir les trous du planning sans tableur.",
    ],
    rented: [
      "Rented est une appli de location entre particuliers pour les citadins. Emprunter une perceuse au lieu d'en acheter une.",
      "J'étais la seule personne au design produit, aux côtés des fondateurs et des ingénieurs. J'ai mené deux séries de tests utilisateurs et construit un prototype fonctionnel, qui tourne en direct dans l'étude de cas.",
      "Le résultat : la réussite de la première tâche est passée de 71 % à 100 % entre les deux séries, l'onboarding prenait moins d'une minute, et les ingénieurs ont reçu plus de 30 écrans prêts à développer.",
    ],
    nmya: [
      "Pour la National Muslim Youth Association, j'ai mené la refonte complète de leur site et je l'ai migré d'une installation WordPress vulnérable aux malwares vers Webflow.",
      "J'ai animé des groupes de discussion mêlant âges, rôles et niveaux de connaissance, puis j'ai repensé et développé le site à partir de ce qu'on a entendu.",
      "Le résultat : quelques mois après le lancement, le trafic a augmenté de 30 %, les pages vues de 15 % et les visiteurs récurrents de 10 à 15 %. Les pages clés sont passées de cinq ou six clics à deux ou trois.",
    ],
    adsum: [
      "Adsum NYC est une marque de vêtements de Brooklyn avec plus de 25 000 visiteurs par mois. Je conçois et livre la boutique Shopify avec le fondateur, ainsi que les campagnes et les e-mails.",
      "Le résultat que je cite le plus : un filtre de taille que j'ai construit de zéro a réduit de 35 % les clics sur des tailles épuisées.",
      "Et les e-mails de lancement que je conçois ont un taux d'ouverture de 43,8 %, contre environ 33 % en moyenne dans le secteur.",
    ],
    dpr: [
      "DPR Studio est un studio de production californien : vêtements, identité de marque, direction créative.",
      "J'ai repensé et développé leur site Shopify sur mesure avec le fondateur, de la recherche au code en production.",
    ],
    otrs: [
      "On The Run Studio a commencé en 2021 comme mon compte de moodboard personnel. C'est là que mon goût s'est en grande partie formé.",
      "Le résultat : une communauté de 5 000 designers et marques en un an et demi, du merch que j'ai dessiné vendu jusqu'en France, en Espagne et au Royaume-Uni, et finalement un vrai studio de design.",
    ],
    wcm: [
      "WCM Connect est un concept personnel : j'ai repensé l'onboarding, le tableau de bord et la prise de rendez-vous d'une vraie appli patient.",
      "Le brief venait des avis de l'App Store. Les utilisateurs avaient déjà fait la recherche ; je n'avais qu'à la lire.",
      "Le résultat : un onboarding plus simple, un tableau de bord construit autour des tâches les plus courantes des patients, et moins de friction pour prendre rendez-vous. C'est un concept, donc pas de chiffres de lancement, mais l'étude de cas détaille chaque décision.",
    ],
  },
  misses: [
    ["Hmm, celle-là n'est pas dans mon script.", "Demande-moi ma méthode, un projet comme Rented, ou ce sur quoi je travaille."],
    ["Je suis une version scriptée de moi, alors ça m'est passé au-dessus.", "Écris 'aide' pour voir ce à quoi je sais répondre."],
    ["Bonne question. Mauvais chat, par contre.", "Essaie 'portfolio', 'à propos' ou 'contact'."],
  ],
  handoff: ["Ça ressemble à une question pour l'original.", "Tu veux que j'ouvre le formulaire de contact ?"],
  ui: {
    offerCase: "Tu veux lire l'étude de cas ?",
    offerSite: "Tu veux voir le site en ligne ?",
    openingCase: "Je l'ouvre.",
    hereYouGo: "Voilà.",
    pageInEnglish: "Petite précision : les pages elles-mêmes sont en anglais.",
    formInEnglish: "Le formulaire est en anglais, mais tu peux m'écrire en français.",
    hello: "Salut !",
    link: (text) => `Lien : ${text}.`,
  },
};

export default fr;
