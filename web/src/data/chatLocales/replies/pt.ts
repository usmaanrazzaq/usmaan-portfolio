import { heroLink } from "@/data/heroChat";
import type { LocaleReplies } from "../types";

/**
 * Portuguese replies, Brazilian in tone ("você"). First-person lines avoid
 * gendered words ("obrigado", "sozinho") so they read the same for anyone.
 * Commands suggested here ('sobre', 'contato', ...) must stay in
 * keywords/pt.ts.
 * Review: not yet reviewed by a native speaker.
 */
const pt: LocaleReplies = {
  topics: {
    name: [["Usmaan. Dois a, um m. É o erro de digitação mais comum na minha caixa de entrada."]],
    who: [
      [
        "Sou designer de produto em Nova York. Levo produtos da pesquisa ao design e ao código no ar, normalmente como a única pessoa de design da equipe.",
        "Quer a versão longa?",
      ],
      ["Ainda Usmaan, ainda designer de produto.", "Digite 'sobre' para a história completa."],
    ],
    location: [["Nova York. O relógio embaixo do meu nome é ao vivo, então dá para ver se é hora de dormir por aqui."]],
    background: [
      [
        "Estou fazendo um BFA em Design no Queens College.",
        "Desde 2021 faço design para apps de consumo, organizações sem fins lucrativos e e-commerce, do Rented à Adsum NYC.",
      ],
    ],
    now: [
      [
        "Agora sou designer de produto na Adsum NYC, uma marca de roupas do Brooklyn.",
        "E acabei de concluir o Shifts, um app de escalas para equipes. Quer saber da Adsum?",
      ],
    ],
    process: [
      [
        "De ponta a ponta. Começo pela pesquisa, desenho no Figma e depois construo, por conta própria ou lado a lado com os engenheiros.",
        "Como eu também entrego o código, nada se perde entre o protótipo e o produto.",
      ],
      ["Versão curta: pesquisa, design, construção e de volta à pesquisa quando gente de verdade começa a usar."],
    ],
    research: [
      [
        "Tudo começa pela pesquisa. Para a NMYA conduzi grupos focais com várias idades e funções; para o WCM li centenas de avaliações na App Store.",
        "Quer saber da NMYA?",
      ],
    ],
    code: [
      [
        "Sim, eu programo. Este site é feito em Next.js, TypeScript e Tailwind.",
        "Entreguei uma loja Shopify sob medida para a DPR Studio e construí os sites da NMYA e do Shifts, então os engenheiros nunca precisam adivinhar o que eu quis dizer.",
      ],
    ],
    tools: [
      [
        "Figma para o design. Um editor de código para todo o resto.",
        "Next.js, TypeScript e Tailwind na construção, e Shopify quando tem algo para vender.",
      ],
    ],
    team: [
      [
        "Normalmente sou a única pessoa de design, trabalhando lado a lado com engenheiros e fundadores.",
        "Falar design e código ao mesmo tempo significa menos documentos de handoff que ninguém lê.",
      ],
    ],
    mobile: [
      [
        "Bastante. Rented e Shifts são apps, e o WCM Connect é o redesign de um app para pacientes.",
        "Vamos começar pelo Rented? O estudo de caso tem um protótipo que funciona.",
      ],
    ],
    clients: [
      [
        "Apps de consumo, uma organização nacional sem fins lucrativos e marcas de moda e e-commerce.",
        "Adsum NYC, DPR Studio, Rented e a National Muslim Youth Association, entre outras. Digite 'portfólio' para ver.",
      ],
    ],
    favourite: [
      ["On The Run Studio. É o projeto que construo há mais tempo, desde 2021.", "Quer a história?"],
    ],
    hardest: [
      [
        "NMYA. Muitas partes interessadas, muitas opiniões e um site em WordPress que já não dava conta.",
        "Os grupos focais deram a todo mundo as mesmas evidências para chegar a um acordo. Quer saber como foi?",
      ],
    ],
    inspiration: [
      [
        "Dieter Rams, Massimo Vignelli, Jan Tschichold, John Pawson, Peter Zumthor. Menos, porém melhor.",
        "O resto fica na página References. Quer que eu te leve lá?",
      ],
    ],
    philosophy: [
      [
        "Bom design não é só a aparência. É como funciona e como faz as pessoas se sentirem.",
        "No visual eu puxo para o estilo suíço: grids, contenção e nada que não tenha conquistado o seu lugar.",
      ],
    ],
    explorations: [
      [
        "Em Explorations guardo experimentos pessoais, como um protótipo de onboarding por gêneros para o GoodReads e um redesign da barra lateral do Claude Code.",
        "Quer que eu te leve lá?",
      ],
    ],
    references: [
      [
        "References é uma coleção de imagens que me inspiram no design: um retrato visual de como eu penso design.",
        "Ela vem dos meus canais no Are.na e cresce junto com eles. Quer que eu te leve lá?",
      ],
    ],
    site: [
      [
        "Eu desenhei e construí. Next.js por baixo, contenção suíça por cima.",
        "Este chat é um pequeno roteiro meu, não uma linha direta para o meu celular. Uma pena para a gente.",
      ],
    ],
    bot: [
      [
        "Resposta sincera: você está falando com uma versão roteirizada de mim.",
        "A versão real responde pelo formulário de contato. Digite 'contato' que ele abre.",
      ],
    ],
    hire: [
      [
        "Estou disponível para trabalho em tempo integral, freelance ou por contrato: presencial em Nova York, remoto ou com mudança de cidade.",
        "O formulário de contato chega direto para mim. Quer que eu abra?",
      ],
    ],
    rates: [
      [
        "Depende do projeto, então é mais uma conversa do que um balão de chat.",
        "Quer abrir o formulário de contato e me contar no que você está trabalhando?",
      ],
    ],
    personal: [
      ["Deixo o lado pessoal fora do portfólio.", "Mas falo de design o dia todo, com prazer."],
      ["Continua fora dos registros.", "Que tal perguntar sobre um projeto?"],
    ],
    contact: [["O formulário de contato cai direto na minha caixa de entrada.", "Vou abrir para você."]],
    resume: [["Aqui está.", heroLink("resume")]],
    socials: [
      [
        "Escolha a sua plataforma:",
        heroLink("linkedin"),
        heroLink("instagram"),
        heroLink("github"),
        heroLink("x"),
      ],
    ],
    greeting: [
      [
        "Oi! Valeu por passar aqui.",
        "Pergunte sobre o meu trabalho, o meu processo ou qualquer projeto. Ou digite 'portfólio' para ir direto.",
      ],
      ["Oi de novo.", "O que você gostaria de saber?"],
    ],
    "how-are-you": [
      [
        "Tudo bem, valeu. Entre um arquivo do Figma e um pull request, como sempre.",
        "Como posso ajudar?",
      ],
      ["Ainda bem. Ainda desenhando.", "Quer saber algo sobre o trabalho?"],
    ],
    thanks: [["Quando quiser."], ["Imagina. Valeu por dar uma olhada."]],
    bye: [["Valeu pela visita. Volte logo, quase sempre tem algo novo."]],
    compliment: [
      ["Valeu, isso fez o meu dia.", "Se você gostou, os estudos de caso vão mais fundo."],
      ["Que gentileza. Continue assim que eu começo a acreditar."],
    ],
    critique: [
      [
        "Anotado. Crítica é pesquisa de graça.",
        "Se tiver detalhes, o formulário de contato leva até mim. Digite 'contato'.",
      ],
    ],
    joke: [
      ["Quantos designers são necessários para trocar uma lâmpada?", "Precisa mesmo ser uma lâmpada?"],
      ["Uma vez pedi para um desenvolvedor centralizar uma div.", "A gente ainda se fala. A div, não."],
    ],
    test: [["Teste recebido. Tudo funcionando, inclusive eu."]],
    help: [
      [
        "Pergunte sobre o meu processo, um projeto como Rented ou Adsum, no que estou trabalhando ou como falar comigo.",
        "Ou digite 'portfólio', 'sobre', 'experimentos', 'referências' ou 'contato'.",
      ],
    ],
    work: [["Aqui está o trabalho."]],
    "about-open": [["Levando você para a página About."]],
    "explorations-open": [["Abrindo Explorations."]],
    "references-open": [["Abrindo References."]],
    "contact-open": [["Abrindo o formulário de contato."]],
    affirm: [
      ["Adoro o entusiasmo.", "Pergunte sobre o meu processo, um projeto ou no que estou trabalhando."],
      ["Combinado. Com o quê, não sei bem, mas combinado.", "Tente perguntar sobre um projeto, como 'Rented' ou 'Adsum'."],
    ],
    decline: [["Sem problemas.", "Estou por aqui se você pensar em algo."], ["Justo."]],
  },
  projects: {
    shifts: [
      "Shifts é um app de escalas para equipes: um calendário tranquilo para planejar quem trabalha quando. Eu desenhei e construí, então o protótipo é o produto.",
      "O resultado: uma organização local sem fins lucrativos usou o app por quatro dias para a equipe de segurança de um evento, cerca de 15 pessoas em 3 equipes e de 20 a 30 turnos, e finalmente conseguiu ver a cobertura sem planilha.",
    ],
    rented: [
      "Rented é um app de aluguel entre pessoas para quem mora na cidade. Pegar uma furadeira emprestada em vez de comprar.",
      "Cuidei de todo o design de produto ao lado dos fundadores e engenheiros. Fiz duas rodadas de testes de usabilidade e construí um protótipo funcional, que roda ao vivo no estudo de caso.",
      "O resultado: a conclusão da primeira tarefa foi de 71% para 100% entre as rodadas, o onboarding levava menos de um minuto e os engenheiros receberam mais de 30 telas prontas para desenvolvimento.",
    ],
    nmya: [
      "Para a National Muslim Youth Association liderei o redesign completo do site e migrei tudo de uma instalação WordPress vulnerável a malware para o Webflow.",
      "Conduzi grupos focais com pessoas de várias idades, funções e níveis de conhecimento, e redesenhei e construí o site a partir do que ouvimos.",
      "O resultado: poucos meses depois do lançamento, o tráfego subiu 30%, as visualizações de página 15% e os visitantes recorrentes de 10 a 15%. As páginas principais passaram de cinco ou seis cliques para dois ou três.",
    ],
    adsum: [
      "Adsum NYC é uma marca de roupas do Brooklyn com mais de 25 mil visitantes por mês. Desenho e coloco no ar a loja Shopify com o fundador, além das campanhas e dos e-mails.",
      "O resultado que mais gosto de mostrar: um filtro de tamanho que construí do zero reduziu em 35% os cliques em tamanhos esgotados.",
      "E os e-mails de lançamento que desenho têm taxa de abertura de 43,8%, contra uma média do setor de cerca de 33%.",
    ],
    dpr: [
      "DPR Studio é um estúdio de produção da Califórnia: roupas, identidade de marca, direção criativa.",
      "Redesenhei e construí o site Shopify sob medida deles com o fundador, da pesquisa ao código no ar.",
    ],
    otrs: [
      "On The Run Studio começou em 2021 como a minha conta pessoal de moodboards. Foi ali que a maior parte do meu gosto foi treinada.",
      "O resultado: uma comunidade de 5 mil designers e marcas em um ano e meio, produtos que desenhei vendidos até na França, na Espanha e no Reino Unido e, no fim, um estúdio de design completo.",
    ],
    wcm: [
      "WCM Connect é um conceito próprio: redesenhei o onboarding, o painel e o agendamento de um app real para pacientes.",
      "O briefing veio das avaliações na App Store. Os usuários já tinham feito a pesquisa; eu só li.",
      "O resultado: um onboarding mais simples, um painel construído em torno das tarefas mais comuns dos pacientes e menos atrito para marcar consultas. É um conceito, então não há números de lançamento, mas o estudo de caso explica cada decisão.",
    ],
  },
  misses: [
    ["Hmm, essa não está no meu roteiro.", "Tente perguntar sobre o meu processo, um projeto como Rented ou no que estou trabalhando."],
    ["Sou uma versão roteirizada de mim, então essa passou batido.", "Digite 'ajuda' para ver o que eu sei responder."],
    ["Boa pergunta. Chat errado, porém.", "Tente 'portfólio', 'sobre' ou 'contato'."],
  ],
  handoff: ["Isso parece uma pergunta para a versão real.", "Quer que eu abra o formulário de contato?"],
  ui: {
    offerCase: "Quer ler o estudo de caso?",
    offerSite: "Quer ver o site no ar?",
    openingCase: "Abrindo.",
    hereYouGo: "Aqui está.",
    pageInEnglish: "Só um aviso: as páginas em si estão em inglês.",
    formInEnglish: "O formulário está em inglês, mas pode me escrever em português.",
    hello: "Oi!",
    link: (text) => `Link: ${text}.`,
  },
};

export default pt;
