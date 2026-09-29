/* ===========================================================
   Arthur Renard — site internationalization
   English is the markup itself (cached on load); this file holds
   French / Korean / Spanish. Elements carry data-i18n="<key>".
   Language persists in localStorage and applies on every page.
   =========================================================== */
(function () {
  "use strict";

  // fr = Français · ko = 한국어 · es = Español
  const DICT = {
    /* ---- Nav ---- */
    navHome:    { fr: `Accueil`,  ko: `홈`,      es: `Inicio` },
    navAbout:   { fr: `À propos`, ko: `소개`,    es: `Sobre mí` },
    navWork:    { fr: `Projets`,  ko: `프로젝트`, es: `Trabajo` },
    navConnect: { fr: `Contact`,  ko: `연락처`,  es: `Contacto` },

    /* ---- Home · hero ---- */
    heroEyebrow: {
      fr: `UC Berkeley · Maths appliquées & science des données`,
      ko: `UC Berkeley · 응용수학 & 데이터 과학`,
      es: `UC Berkeley · Matemáticas Aplicadas y Ciencia de Datos`,
    },
    heroLine: {
      fr: `Maths <span class="dot">·</span> IA <span class="dot">·</span> Finance<br />Concevoir, analyser, calculer et livrer.`,
      ko: `수학 <span class="dot">·</span> AI <span class="dot">·</span> 금융<br />만들고, 분석하고, 계산하고, 출시합니다.`,
      es: `Matemáticas <span class="dot">·</span> IA <span class="dot">·</span> Finanzas<br />Crear, analizar, computar y entregar.`,
    },
    heroConnect: {
      fr: `Contact <span class="arr">→</span>`,
      ko: `연락하기 <span class="arr">→</span>`,
      es: `Contacto <span class="arr">→</span>`,
    },
    heroSeeWork: { fr: `Voir les projets`, ko: `프로젝트 보기`, es: `Ver el trabajo` },
    badgeClass: {
      fr: `<span class="badge-dot"></span> Promotion 2029`,
      ko: `<span class="badge-dot"></span> 2029년 졸업 예정`,
      es: `<span class="badge-dot"></span> Promoción 2029`,
    },
    scrollWord: { fr: `Défiler`, ko: `스크롤`, es: `Desliza` },

    /* ---- Home · pillars ---- */
    pillarsEyebrow: { fr: `Trois piliers`, ko: `세 가지 축`, es: `Tres pilares` },
    pillarsTitle: {
      fr: `Des domaines différents,<br /><span class="muted">une même curiosité.</span>`,
      ko: `서로 다른 분야,<br /><span class="muted">하나의 호기심.</span>`,
      es: `Campos distintos,<br /><span class="muted">la misma curiosidad.</span>`,
    },
    pillarMath:    { fr: `Maths`,   ko: `수학`, es: `Matemáticas` },
    pillarAI:      { fr: `IA`,      ko: `AI`,   es: `IA` },
    pillarFinance: { fr: `Finance`, ko: `금융`, es: `Finanzas` },
    pillarMathP: {
      fr: `Maths appliquées & science des données à UC Berkeley. Mon objectif est toujours d'atteindre une compréhension fondamentale de tout ce que je fais.`,
      ko: `UC Berkeley에서 응용수학과 데이터 과학을 공부합니다. 제가 하는 모든 일을 근본부터 이해하는 것이 언제나 저의 목표입니다.`,
      es: `Matemáticas Aplicadas y Ciencia de Datos en UC Berkeley. Mi objetivo es siempre alcanzar una comprensión fundamental de todo lo que hago.`,
    },
    pillarAIP: {
      fr: `Créateur AI-native depuis 4 ans et contributeur à la sécurité des enfants. Je livre en m'appuyant sur une base de connaissances que j'enrichis constamment depuis des années.`,
      ko: `4년 차 AI 네이티브 빌더이자 아동 안전 기여자입니다. 지난 몇 년간 꾸준히 쌓아 온 지식을 바탕으로 결과물을 만들어 냅니다.`,
      es: `Creador AI-native desde hace 4 años y colaborador en seguridad infantil. Construyo con la base de conocimiento que he ido ampliando de forma constante en los últimos años.`,
    },
    pillarFinanceP: {
      fr: `DCF, LBO et modélisation. En parallèle de Microfinance à Berkeley et du club de Private Equity, je crée des pipelines de données qui éliminent les tâches répétitives et ont un impact sur de vraies entreprises.`,
      ko: `DCF, LBO, 모델링. Berkeley의 마이크로파이낸스와 사모펀드 동아리 활동과 함께, 반복 업무를 줄이고 실제 기업에 영향을 주는 데이터 파이프라인을 만듭니다.`,
      es: `DCF, LBO y modelado. Junto con Microfinanzas en Berkeley y el club de Private Equity, creo pipelines de datos que eliminan el trabajo tedioso y tienen impacto en empresas reales.`,
    },

    /* ---- Home · intro ---- */
    introEyebrow: {
      fr: `En bref`,
      ko: `요약`,
      es: `En resumen`,
    },
    introText: {
      fr: `Je suis un créateur AI-native en début de carrière, rapide et pluridisciplinaire. Je transforme les mathématiques en modèles, les idées en sites livrés, et les données désordonnées en décisions d'affaires assurées. Curieux, autonome et pragmatique quand il s'agit de concrétiser.`,
      ko: `저는 빠르고 여러 분야를 넘나드는, 커리어 초기의 AI 네이티브 빌더입니다. 수학을 모델로, 아이디어를 출시된 사이트로, 복잡한 데이터를 확신 있는 비즈니스 결정으로 바꿉니다. 호기심 많고, 주도적이며, 실제로 일을 끝내는 데 실용적입니다.`,
      es: `Soy un creador AI-native al inicio de mi carrera, rápido y multidisciplinario. Convierto las matemáticas en modelos, las ideas en sitios publicados y los datos desordenados en decisiones de negocio seguras. Curioso, autónomo y pragmático a la hora de sacar las cosas adelante.`,
    },
    introLink1: {
      fr: `Lire l'histoire complète <span class="arr">→</span>`,
      ko: `전체 이야기 보기 <span class="arr">→</span>`,
      es: `Leer la historia completa <span class="arr">→</span>`,
    },
    introLink2: {
      fr: `Parcourir les projets <span class="arr">→</span>`,
      ko: `프로젝트 둘러보기 <span class="arr">→</span>`,
      es: `Explorar el trabajo <span class="arr">→</span>`,
    },

    /* ---- About ---- */
    aboutEyebrow: { fr: `À propos`, ko: `소개`, es: `Sobre mí` },
    aboutTitle: {
      fr: `Viser l'interdisciplinarité.`,
      ko: `학제 간 사고를 지향합니다.`,
      es: `En busca de ser interdisciplinario.`,
    },
    aboutLead: {
      fr: `Je sais que je suis au début de mon parcours, mais j'ai soif d'en apprendre davantage. J'avance vite, je travaille dans plusieurs domaines et je livre de vraies solutions.`,
      ko: `아직 여정의 초입에 있다는 걸 알지만, 더 배우고자 하는 열망이 큽니다. 빠르게 움직이고, 여러 분야를 넘나들며, 실제 솔루션을 출시합니다.`,
      es: `Sé que estoy al comienzo de mi camino, pero tengo muchas ganas de aprender más. Avanzo rápido, trabajo en distintos campos y entrego soluciones reales.`,
    },
    asideStudying:  { fr: `Études`,    ko: `전공`,   es: `Estudios` },
    asideStudyingV: {
      fr: `Maths appliquées & science des données`,
      ko: `응용수학 & 데이터 과학`,
      es: `Matemáticas Aplicadas y Ciencia de Datos`,
    },
    asideAt:  { fr: `À`, ko: `학교`, es: `En` },
    asideAtV: {
      fr: `UC Berkeley · Promotion 2029`,
      ko: `UC Berkeley · 2029년 졸업 예정`,
      es: `UC Berkeley · Promoción 2029`,
    },
    asideBasedIn:  { fr: `Basé à`, ko: `거주지`, es: `Radicado en` },
    asideBasedInV: { fr: `Berkeley, Californie`, ko: `버클리, 캘리포니아`, es: `Berkeley, California` },
    asideNative:   { fr: `Langues`, ko: `모국어`, es: `Idiomas` },
    asideNativeV:  { fr: `Français & Anglais`, ko: `프랑스어 & 영어`, es: `Francés e Inglés` },

    aboutBigP: {
      fr: `Je travaille à l'intersection des <em>maths, de l'IA et de la finance</em> : les maths m'apportent la rigueur, l'IA le levier, et la finance l'intuition.`,
      ko: `저는 <em>수학, AI, 금융</em>이 만나는 지점에서 일합니다. 수학은 엄밀함을, AI는 지렛대를, 금융은 직관을 줍니다.`,
      es: `Trabajo en la intersección de <em>matemáticas, IA y finanzas</em>, donde las matemáticas me dan el rigor, la IA el apalancamiento y las finanzas la intuición.`,
    },
    aboutP2: {
      fr: `Je suis vraiment AI-native. Je ne me contente pas d'utiliser des outils d'IA ; je construis et je déploie avec eux. Claude, Codex, Ollama et OpenCode font partie de ma façon de passer de l'idée à la livraison, qu'il s'agisse d'un site déployé, d'un pipeline de vision par ordinateur ou d'un jeu d'évaluation pour des modèles de sécurité des enfants.`,
      ko: `저는 진정한 AI 네이티브입니다. AI 도구를 단지 사용하는 데 그치지 않고, 그것으로 만들고 배포합니다. Claude, Codex, Ollama, OpenCode는 아이디어를 출시까지 가져가는 제 방식의 일부이며, 그것이 배포된 사이트든 컴퓨터 비전 파이프라인이든 아동 안전 모델용 평가 세트든 마찬가지입니다.`,
      es: `Soy genuinamente AI-native. No solo uso herramientas de IA; construyo y despliego con ellas. Claude, Codex, Ollama y OpenCode forman parte de cómo llevo las cosas de la idea a la entrega, ya sea un sitio desplegado, un pipeline de visión por computadora o un conjunto de evaluación para modelos de seguridad infantil.`,
    },
    aboutP3: {
      fr: `Derrière tout ce que je fais, il y a une vraie base mathématique et une formation en finance qui me permettent de poser les bonnes questions. J'admire les modèles, les résultats et les chiffres depuis aussi longtemps que je m'en souvienne. J'ai mené des analyses DCF et LBO, créé des pipelines de détection d'objets à partir de zéro, et conseillé plusieurs entreprises via Microfinance à Berkeley.`,
      ko: `제가 하는 모든 일의 바탕에는 진짜 수학적 기반과 올바른 질문을 던지게 해 주는 금융 배경이 있습니다. 기억할 수 있는 한 오래전부터 모델과 결과, 숫자에 매료되어 왔습니다. DCF와 LBO 분석을 수행했고, 객체 탐지 파이프라인을 처음부터 만들었으며, Berkeley의 마이크로파이낸스를 통해 여러 기업을 자문했습니다.`,
      es: `Detrás de todo lo que hago hay una base matemática real y una formación en finanzas que me permiten hacer las preguntas correctas. Admiro los modelos, los resultados y los números desde que tengo memoria. He realizado análisis de DCF y LBO, creado pipelines de detección de objetos desde cero y asesorado a varias empresas a través de Microfinanzas en Berkeley.`,
    },
    aboutP4: {
      fr: `Voici l'essentiel : je ne prétends pas être un ingénieur senior. Je suis un créateur rapide, polyvalent et curieux, qui s'investit dans la tech dès maintenant pour que l'expertise s'accumule ensuite. Je suis pragmatique quant à la livraison, sérieux dans le travail et j'apprends constamment.`,
      ko: `중요한 점은 이것입니다: 저는 시니어 엔지니어라고 주장하지 않습니다. 저는 빠르고, 폭넓고, 호기심 많은 빌더로서 지금 기술에 스스로를 투자해 나중에 전문성이 쌓이도록 합니다. 출시에 실용적이고, 일에 진지하며, 꾸준히 배웁니다.`,
      es: `Esto es lo importante: no pretendo ser un ingeniero senior. Soy un creador rápido, versátil y curioso que está invirtiendo en la tecnología ahora, para que la experiencia se acumule después. Soy pragmático al entregar, serio con el trabajo y aprendo constantemente.`,
    },
    beyondEyebrow: { fr: `Au-delà du travail`, ko: `일 너머`, es: `Más allá del trabajo` },
    beyondTitle: {
      fr: `Les choses qui<br /><span class="muted">ne tiennent pas dans un CV.</span>`,
      ko: `이력서에는<br /><span class="muted">담기지 않는 것들.</span>`,
      es: `Las cosas que<br /><span class="muted">no caben en un currículum.</span>`,
    },
    beyondMusicH: { fr: `Multi-instrumentiste`, ko: `멀티 악기 연주자`, es: `Multiinstrumentista` },
    beyondMusicP: {
      fr: `Basse, guitare, batterie, piano et chant. Depuis mes sept ans, j'ai joué dans plusieurs groupes et enregistré avec Pro Tools. Pour moi, la musique est une belle logique enracinée dans des principes mathématiques.`,
      ko: `베이스, 기타, 드럼, 피아노, 보컬. 일곱 살 때부터 여러 밴드에서 연주하고 Pro Tools로 녹음해 왔습니다. 제게 음악은 수학적 원리에 뿌리를 둔 아름다운 논리입니다.`,
      es: `Bajo, guitarra, batería, piano y voz. Desde los siete años he tocado en varias bandas y grabado con Pro Tools. Para mí, la música es una bella lógica arraigada en principios matemáticos.`,
    },
    beyondValH: { fr: `Major de promotion`, ko: `수석 졸업생`, es: `Mejor de la promoción` },
    beyondValP: {
      fr: `J'ai obtenu des A dans tous mes cours au lycée et en community college.`,
      ko: `고등학교와 커뮤니티 칼리지의 모든 수업에서 전 과목 A를 받았습니다.`,
      es: `Fui un estudiante de sobresalientes en todas mis clases de preparatoria y de community college.`,
    },
    beyondScoutH: { fr: `Chef louveteau`, ko: `컵 스카우트 리더`, es: `Líder de Cub Scouts` },
    beyondScoutP: {
      fr: `J'encadre une unité de 15 enfants, entièrement en français. À parts égales logistique, patience et amusement.`,
      ko: `15명의 아이들로 이루어진 단원을 전부 프랑스어로 이끕니다. 물류, 인내심, 그리고 즐거움이 똑같이 필요합니다.`,
      es: `Dirijo una unidad de 15 niños, completamente en francés. A partes iguales logística, paciencia y diversión.`,
    },
    beyondCelestialH: { fr: `Mécanique céleste`, ko: `천체 역학`, es: `Mecánica celeste` },
    beyondCelestialP: {
      fr: `J'ai une fascination de longue date pour le ciel et pour les mathématiques qui régissent l'univers.`,
      ko: `저는 하늘과 우주 뒤에 숨은 수학에 오랫동안 매료되어 왔습니다.`,
      es: `Tengo una fascinación de toda la vida por el cielo y por las matemáticas detrás del universo.`,
    },
    beyondTreasurerH: { fr: `Trésorier`, ko: `회계 담당`, es: `Tesorero` },
    beyondTreasurerP: {
      fr: `Je suis le trésorier de Phi Delta Theta de UC Berkeley, chapitre California Alpha, pour l'année universitaire 2026–27.`,
      ko: `저는 2026–27학년도 UC Berkeley Phi Delta Theta California Alpha 지부의 회계 담당입니다.`,
      es: `Soy el tesorero de Phi Delta Theta de UC Berkeley, capítulo California Alpha, para el año académico 2026–27.`,
    },
    aboutCtaH: {
      fr: `Envie d'en savoir plus ?`,
      ko: `더 알고 싶으신가요?`,
      es: `¿Quieres saber más?`,
    },
    aboutCtaSub: {
      fr: `Voici ce que j'ai livré, ou comment me contacter directement !`,
      ko: `제가 만든 것들을 보거나, 바로 연락해 주세요!`,
      es: `¡Aquí está lo que he entregado, o cómo puedes contactarme directamente!`,
    },

    /* ---- Shared CTAs ---- */
    ctaViewWork:    { fr: `Voir les projets <span class="arr">→</span>`, ko: `프로젝트 보기 <span class="arr">→</span>`, es: `Ver el trabajo <span class="arr">→</span>` },
    ctaGetInTouch:  { fr: `Me contacter <span class="arr">→</span>`,    ko: `연락하기 <span class="arr">→</span>`,    es: `Ponte en contacto <span class="arr">→</span>` },
    ctaMoreAboutMe: { fr: `En savoir plus sur moi <span class="arr">→</span>`, ko: `나에 대해 더 보기 <span class="arr">→</span>`, es: `Más sobre mí <span class="arr">→</span>` },

    /* ---- Work ---- */
    workEyebrow: { fr: `Projets sélectionnés`, ko: `선별된 작업`, es: `Trabajo seleccionado` },
    workTitle: {
      fr: `Ce que j'ai<br />réellement livré.`,
      ko: `제가 실제로<br />출시한 것들.`,
      es: `Lo que realmente<br />he entregado.`,
    },
    workLead: {
      fr: `À travers l'ingénierie IA, la sécurité de l'IA, la microfinance, le private equity et la robotique, j'ai occupé de vrais rôles et eu un réel impact.`,
      ko: `AI 엔지니어링, AI 안전, 마이크로파이낸스, 프라이빗 에쿼티, 로보틱스에 걸쳐 실제 역할을 맡고 실질적인 영향을 만들었습니다.`,
      es: `En ingeniería de IA, seguridad de IA, microfinanzas, private equity y robótica, he ocupado roles reales y generado un impacto real.`,
    },
    roleYouthAdvisor: { fr: `Conseiller jeunesse`, ko: `청소년 자문위원`, es: `Asesor juvenil` },
    everyoneP: {
      fr: `Je calibre des données pour entraîner des évaluations de sécurité des enfants pour les LLM et les LVM, aidant les modèles à apprendre ce qui convient aux jeunes utilisateurs. J'ai animé des ateliers sur la sécurité de l'IA pour <strong>150+ étudiants</strong>, rédigé et filmé des manifestes présentés au G7, et conçu des présentations en veillant à la cohérence des traductions.`,
      ko: `저는 LLM과 LVM의 아동 안전 평가를 학습시키기 위한 데이터를 보정하며, 모델이 어린 사용자에게 적절한 것을 학습하도록 돕고 있습니다. <strong>150명 이상의 학생</strong>을 대상으로 AI 안전 워크숍을 진행했고, G7에 발표된 선언문을 작성하고 촬영했으며, 번역 일관성을 보장하며 슬라이드 발표 자료를 제작했습니다.`,
      es: `He calibrado datos para entrenar evaluaciones de seguridad infantil para LLM y LVM, ayudando a los modelos a aprender qué es apropiado para usuarios más jóvenes. He impartido talleres de seguridad de IA para <strong>150+ estudiantes</strong>, escrito y filmado manifiestos que se presentaron al G7, y elaborado presentaciones asegurando la coherencia de las traducciones.`,
    },
    chipAISafety:  { fr: `Sécurité de l'IA`, ko: `AI 안전`, es: `Seguridad de IA` },
    chipWorkshops: { fr: `Ateliers`, ko: `워크숍`, es: `Talleres` },
    roleMicrofinance: {
      fr: `Chef de projet & responsable du comité des finances`,
      ko: `프로젝트 매니저 & 재무위원회 위원장`,
      es: `Gerente de Proyecto y Jefe del Comité de Finanzas`,
    },
    microP: {
      fr: `Conseil pour des entreprises de toutes tailles, de la petite à la grande, et soutien au financement participatif KIVA. J'ai automatisé nos pipelines de visualisation de données, réduisant le temps de codage et de débogage sans téléverser de données sensibles vers le moindre LLM.`,
      ko: `소규모부터 대기업까지 모든 규모의 기업을 컨설팅하고 KIVA 크라우드펀딩을 지원합니다. 민감한 데이터를 어떤 LLM에도 업로드하지 않으면서 데이터 시각화 파이프라인을 자동화하여 코딩·디버깅 시간을 줄였습니다.`,
      es: `Consultoría para empresas de todos los tamaños, desde pequeñas hasta corporativas, y apoyo al crowdfunding de KIVA. Automaticé nuestros pipelines de visualización de datos, reduciendo el tiempo de codificación y depuración sin subir datos sensibles a ningún LLM.`,
    },
    microStatLabel: {
      fr: `de temps de codage et de débogage sur les pipelines de reporting`,
      ko: `보고 파이프라인의 코딩·디버깅 시간`,
      es: `de tiempo de codificación y depuración en pipelines de reportes`,
    },
    microFig: {
      fr: `Site de démonstration créé avec Hugging Face et Claude`,
      ko: `Hugging Face와 Claude로 만든 데모 웹사이트`,
      es: `Sitio de demostración creado con Hugging Face y Claude`,
    },
    chipSMB:        { fr: `Conseil PME`, ko: `중소기업 컨설팅`, es: `Consultoría pymes` },
    chipDataViz:    { fr: `Automatisation data viz`, ko: `데이터 시각화 자동화`, es: `Automatización de data viz` },
    roleAnalyst:    { fr: `Analyste`, ko: `애널리스트`, es: `Analista` },
    peP: {
      fr: `Modélisation financière concrète en construisant des analyses DCF et LBO et des modèles de valorisation sous Excel, tout en comprenant les hypothèses qui les sous-tendent.`,
      ko: `Excel에서 DCF와 LBO 분석 및 가치 평가 모델을 구축하며 실전 재무 모델링을 익히고, 그 이면의 가정을 이해해 나가고 있습니다.`,
      es: `Modelado financiero práctico construyendo análisis de DCF y LBO y modelos de valoración en Excel, a la vez que comprendo los supuestos detrás de ellos.`,
    },
    chipFinModeling: { fr: `Modélisation financière`, ko: `재무 모델링`, es: `Modelado financiero` },
    roleScouting: {
      fr: `Capitaine scouting & sécurité`,
      ko: `스카우팅 & 안전 캡틴`,
      es: `Capitán de scouting y seguridad`,
    },
    frcP: {
      fr: `Conception de stratégies de scouting et des flux de données associés, tout en dirigeant une équipe de <strong>15–20 scouts</strong>. Récompensé par le <em>Entrepreneurial Leadership Award</em>.`,
      ko: `<strong>15–20명의 스카우트</strong> 팀을 이끌며 스카우팅 전략과 그 이면의 데이터 워크플로를 구축했습니다. <em>Entrepreneurial Leadership Award</em>를 수상했습니다.`,
      es: `Desarrollé estrategias de scouting y los flujos de datos detrás de ellas mientras lideraba un equipo de <strong>15–20 scouts</strong>. Reconocido con el <em>Entrepreneurial Leadership Award</em>.`,
    },
    chipScoutingSw: { fr: `Logiciel de scouting`, ko: `스카우팅 소프트웨어`, es: `Software de scouting` },
    chipDataWf:     { fr: `Flux de données`, ko: `데이터 워크플로`, es: `Flujos de datos` },
    chipTeamLead:   { fr: `Chef d'équipe`, ko: `팀 리드`, es: `Líder de equipo` },
    hsH: {
      fr: `Club d'investissement du lycée`,
      ko: `고등학교 투자 클럽`,
      es: `Club de inversión del instituto`,
    },
    roleFounder: { fr: `Fondateur`, ko: `창립자`, es: `Fundador` },
    hsP: {
      fr: `J'ai créé et dirigé un club d'investissement à partir de zéro. J'ai bâti le programme, la communauté et l'habitude d'apprendre les marchés grâce à des actions virtuelles.`,
      ko: `투자 클럽을 처음부터 만들고 운영했습니다. 커리큘럼과 커뮤니티, 그리고 가상 주식으로 시장을 배우는 습관을 만들었습니다.`,
      es: `Fundé y dirigí un club de inversión desde cero. Construí el plan de estudios, la comunidad y el hábito de aprender sobre los mercados con acciones virtuales.`,
    },
    chipFounder:   { fr: `Fondateur`, ko: `창립자`, es: `Fundador` },
    chipMarkets:   { fr: `Marchés`, ko: `시장`, es: `Mercados` },
    chipCommunity: { fr: `Communauté`, ko: `커뮤니티`, es: `Comunidad` },
    honorsEyebrow: { fr: `Distinctions`, ko: `수상 및 영예`, es: `Reconocimientos` },
    honorVal: {
      fr: `<span class="honor-ico">★</span> Major de promotion`,
      ko: `<span class="honor-ico">★</span> 수석 졸업생`,
      es: `<span class="honor-ico">★</span> Mejor de la promoción`,
    },
    workCtaH: {
      fr: `J'ai toujours envie de construire :)`,
      ko: `언제나 만드는 게 즐겁습니다 :)`,
      es: `Siempre me emociona construir :)`,
    },
    workCtaSub: {
      fr: `Ouvert aux stages, aux collaborations et aux bonnes conversations !`,
      ko: `인턴십, 협업, 그리고 좋은 대화를 환영합니다!`,
      es: `¡Abierto a prácticas, colaboraciones y buenas conversaciones!`,
    },

    /* ---- Connect ---- */
    connectEyebrow: { fr: `Contact`, ko: `연락처`, es: `Contacto` },
    connectTitle: {
      fr: `Ravi d'échanger !`,
      ko: `이야기 나누고 싶어요!`,
      es: `¡Me encantaría hablar!`,
    },
    connectLead: {
      fr: `Je suis toujours ouvert aux stages, aux collaborations et aux bonnes conversations ! Laissez-moi simplement un message, il arrivera dans ma boîte mail principale. Je lis tout !`,
      ko: `인턴십, 협업, 그리고 좋은 대화는 언제나 환영입니다! 메시지를 남겨 주시면 제 메인 메일함으로 바로 전달됩니다. 저는 모든 메시지를 읽습니다!`,
      es: `¡Siempre estoy abierto a prácticas, colaboraciones y buenas conversaciones! Solo déjame un mensaje y llegará a mi bandeja de entrada principal. ¡Lo leo todo!`,
    },
    formName:  { fr: `Nom`, ko: `이름`, es: `Nombre` },
    formEmail: { fr: `Votre e-mail`, ko: `이메일`, es: `Tu correo` },
    formMessage: { fr: `Message`, ko: `메시지`, es: `Mensaje` },
    formNamePh: { fr: `Jean Dupont`, ko: `홍길동`, es: `Juan Pérez` },
    formEmailPh: { fr: `jean@exemple.com`, ko: `name@example.com`, es: `juan@ejemplo.com` },
    formMessagePh: {
      fr: `Dites-m'en un peu plus sur ce que vous avez en tête…`,
      ko: `어떤 내용인지 간단히 알려 주세요…`,
      es: `Cuéntame un poco sobre lo que tienes en mente…`,
    },
    formEmailHint: {
      fr: `Uniquement pour pouvoir vous répondre. Jamais partagé, jamais affiché publiquement.`,
      ko: `오직 답장을 드리기 위한 용도입니다. 공유하거나 공개하지 않습니다.`,
      es: `Solo para poder responderte. Nunca se comparte ni se muestra públicamente.`,
    },
    formSend:    { fr: `Envoyer le message`, ko: `메시지 보내기`, es: `Enviar mensaje` },
    formSending: { fr: `Envoi…`, ko: `보내는 중…`, es: `Enviando…` },
    formSuccess: {
      fr: `Merci — votre message est en route. Je vous réponds bientôt.`,
      ko: `감사합니다 — 메시지가 전송되었습니다. 곧 답장 드리겠습니다.`,
      es: `Gracias — tu mensaje está en camino. Te responderé pronto.`,
    },
    formError: {
      fr: `Une erreur s'est produite. Réessayez, ou joignez-moi sur LinkedIn.`,
      ko: `문제가 발생했습니다. 다시 시도하거나 LinkedIn으로 연락해 주세요.`,
      es: `Algo salió mal. Inténtalo de nuevo o contáctame por LinkedIn.`,
    },
    formNotConfigured: {
      fr: `Le formulaire n'est pas encore connecté. En attendant, contactez-moi sur LinkedIn.`,
      ko: `양식이 아직 연결되지 않았습니다. 그동안 LinkedIn으로 연락해 주세요.`,
      es: `El formulario aún no está conectado. Mientras tanto, contáctame por LinkedIn.`,
    },
    connectNote: {
      fr: `Répond généralement en un jour ou deux.`,
      ko: `보통 하루 이틀 안에 답장합니다.`,
      es: `Suele responder en uno o dos días.`,
    },
    orbitTitle: {
      fr: `Bac à sable céleste`,
      ko: `천체 샌드박스`,
      es: `Caja de arena celeste`,
    },
    orbitHint: {
      fr: `Cliquez pour lancer une planète · glissez pour la propulser`,
      ko: `클릭하면 행성이 궤도에 · 드래그하면 슬링샷`,
      es: `Haz clic para lanzar un planeta · arrastra para impulsarlo`,
    },
    ccConnect:   { fr: `Se connecter <span class="arr">→</span>`, ko: `연결하기 <span class="arr">→</span>`, es: `Conectar <span class="arr">→</span>` },
    signoffLine: {
      fr: `Basé dans la baie et presque toujours en train de construire quelque chose.`,
      ko: `베이 지역에 거주하며 대개 무언가를 만들고 있습니다.`,
      es: `Radicado en la bahía y casi siempre construyendo algo.`,
    },
    signoffSub: {
      fr: `Maths · IA · Finance. Merci de votre visite.`,
      ko: `수학 · AI · 금융. 방문해 주셔서 감사합니다.`,
      es: `Matemáticas · IA · Finanzas. Gracias por pasar.`,
    },

    /* ---- Home · recommendation (the quote itself stays in English) ---- */
    recRelation: {
      fr: `Collègue senior sur mon projet de vision par ordinateur chez BrightAI`,
      ko: `BrightAI 컴퓨터 비전 프로젝트의 선배 팀원`,
      es: `Compañero sénior en mi proyecto de visión por computadora en BrightAI`,
    },
    recSource: {
      fr: `Recommandation LinkedIn · septembre 2026 <span class="arr">→</span>`,
      ko: `LinkedIn 추천서 · 2026년 9월 <span class="arr">→</span>`,
      es: `Recomendación de LinkedIn · septiembre de 2026 <span class="arr">→</span>`,
    },

    /* ---- Work · Bright.AI ---- */
    roleAIIntern: {
      fr: `Stagiaire en IA`,
      ko: `AI 인턴`,
      es: `Becario de IA`,
    },
    statusCurrent: {
      fr: `<span class="status-dot"></span>En poste actuellement`,
      ko: `<span class="status-dot"></span>현재 근무 중`,
      es: `<span class="status-dot"></span>Trabajando aquí actualmente`,
    },
    brightDates: {
      fr: `Été 2026 · contrat prolongé jusqu'en septembre`,
      ko: `2026년 여름 · 9월까지 계약 연장`,
      es: `Verano de 2026 · contrato extendido hasta septiembre`,
    },
    brightP: {
      fr: `J'ai développé des logiciels qui amènent l'intelligence machine dans le monde réel, des caméras installées au-dessus d'un site industriel jusqu'à un objet connecté pour techniciens de terrain. Après l'été, mon contrat a été prolongé jusqu'en septembre pour que je continue à développer le modèle de vision par ordinateur que j'avais construit à partir de zéro.`,
      ko: `산업 현장 위에 설치된 카메라부터 현장 기술자용 웨어러블까지, 머신 인텔리전스를 현실 세계로 가져오는 소프트웨어를 만들었습니다. 여름 이후에는 제가 처음부터 만든 컴퓨터 비전 모델 개발을 이어가기 위해 계약이 9월까지 연장되었습니다.`,
      es: `Desarrollé software que lleva la inteligencia de las máquinas al mundo real, desde cámaras cenitales en una planta industrial hasta un wearable para técnicos de campo. Después del verano, mi contrato se extendió hasta septiembre para seguir desarrollando el modelo de visión por computadora que había construido desde cero.`,
    },
    brightB1: {
      fr: `Conçu un système complet de vision par ordinateur pour une usine de valorisation énergétique des déchets, à partir d'images brutes non annotées : ingestion des images, annotation automatique avec <strong>SAM3</strong> et fine-tuning de <strong>YOLO11</strong>.`,
      ko: `폐기물 에너지화 시설을 위해 라벨이 없는 원본 영상에서 출발해 엔드투엔드 컴퓨터 비전 시스템을 구축했습니다: 프레임 수집, <strong>SAM3</strong> 자동 라벨링, <strong>YOLO11</strong> 파인튜닝.`,
      es: `Construí un sistema de visión por computadora de extremo a extremo para una planta de conversión de residuos en energía, a partir de video sin etiquetar: ingesta de fotogramas, etiquetado automático con <strong>SAM3</strong> y ajuste fino de <strong>YOLO11</strong>.`,
    },
    brightB2: {
      fr: `Déployé le détecteur avec TensorRT sur un boîtier edge <strong>Jetson Orin</strong> (155 ms/image, aucune image perdue), exécuté en direct en mode shadow, et présenté au client et à notre CTO.`,
      ko: `TensorRT로 탐지 모델을 <strong>Jetson Orin</strong> 엣지 허브에 배포하고(프레임당 155ms, 프레임 손실 0), 섀도 모드로 실시간 운영하며 고객사와 CTO에게 시연했습니다.`,
      es: `Desplegué el detector con TensorRT en un hub edge <strong>Jetson Orin</strong> (155 ms/fotograma, cero fotogramas perdidos), lo ejecuté en vivo en modo sombra y lo presenté al cliente y a nuestro CTO.`,
    },
    brightB3: {
      fr: `Évalué des LLM embarqués pour l'assistant RAG à graphe de connaissances d'un objet connecté industriel, avec un jeu de référence de <strong>377 questions</strong> et un modèle de latence qui a orienté le choix de la taille du modèle.`,
      ko: `산업용 웨어러블의 지식 그래프 RAG 어시스턴트를 위해 온디바이스 LLM을 벤치마킹했습니다. <strong>377개 질문</strong>의 골든 세트와 지연 시간 모델을 활용해 모델 크기 결정을 이끌었습니다.`,
      es: `Evalué LLM en el dispositivo para el asistente RAG con grafo de conocimiento de un wearable industrial, usando un conjunto de referencia de <strong>377 preguntas</strong> y un modelo de latencia que guió la elección del tamaño del modelo.`,
    },
    brightB4: {
      fr: `Indexé une plateforme IoT de <strong>67 dépôts</strong> dans un graphe de connaissances du code interrogeable via MCP, puis mené un audit de sécurité assisté par IA qui a révélé des failles critiques.`,
      ko: `<strong>67개 저장소</strong>로 이루어진 IoT 플랫폼을 MCP 기반의 질의 가능한 코드 지식 그래프로 인덱싱하고, AI 보조 보안 감사를 수행해 치명적인 문제들을 찾아냈습니다.`,
      es: `Indexé una plataforma IoT de <strong>67 repositorios</strong> en un grafo de conocimiento de código consultable mediante MCP y luego realicé una auditoría de seguridad asistida por IA que reveló hallazgos críticos.`,
    },
    brightStatLabel: {
      fr: `de marge temps réel pour le détecteur sur le GPU embarqué`,
      ko: `엣지 GPU에서 탐지 모델의 실시간 처리 여유`,
      es: `de margen en tiempo real para el detector en la GPU edge`,
    },
    chipCV:          { fr: `Vision par ordinateur`, ko: `컴퓨터 비전`, es: `Visión por computadora` },
    chipEdgeAI:      { fr: `IA embarquée`, ko: `엣지 AI`, es: `IA en el edge` },
    chipOnDeviceLLM: { fr: `LLM embarqués`, ko: `온디바이스 LLM`, es: `LLM en el dispositivo` },
    chipKG:          { fr: `Graphes de connaissances`, ko: `지식 그래프`, es: `Grafos de conocimiento` },
    chipWearables:   { fr: `Objets connectés`, ko: `웨어러블`, es: `Wearables` },

    /* ---- Work · Microfinance · Johnson & Johnson ---- */
    microJnJ: {
      fr: `Je suis désormais <strong>chef de projet</strong> pour <strong>Johnson &amp; Johnson</strong>, en conseil en IA : identifier où l'IA peut vraiment faire la différence dans leur travail, quels outils précis conviennent à chaque cas, et éventuellement développer ces outils moi-même.`,
      ko: `현재 <strong>Johnson &amp; Johnson</strong>의 <strong>프로젝트 매니저</strong>로서 AI 컨설팅을 하고 있습니다. AI가 업무에서 실질적인 차이를 만들 수 있는 부분과 각 사례에 맞는 구체적인 도구를 찾아내고, 필요하면 그 도구를 직접 개발할 수도 있습니다.`,
      es: `Ahora soy <strong>Gerente de Proyecto</strong> para <strong>Johnson &amp; Johnson</strong>, haciendo consultoría de IA: identificar dónde la IA puede marcar una diferencia real en su trabajo, qué herramientas concretas encajan en cada caso y, posiblemente, desarrollar esas herramientas yo mismo.`,
    },
    chipAIConsulting: { fr: `Conseil en IA`, ko: `AI 컨설팅`, es: `Consultoría de IA` },

    /* ---- About · guitar ---- */
    beyondGuitarNote: {
      fr: `J'aime aussi modifier les instruments eux-mêmes ! Voici une Strat noire que j'ai transformée en Frankenstrat façon Van Halen et recâblée avec un micro Seymour Duncan.`,
      ko: `악기 자체를 개조하는 것도 좋아합니다! 검은색 Strat을 반 헤일런 스타일의 Frankenstrat으로 다시 칠하고 Seymour Duncan 험버커로 재배선했습니다.`,
      es: `¡También me gusta modificar los instrumentos! Aquí tienes una Strat negra que transformé en una Frankenstrat al estilo Van Halen y recableé con una pastilla Seymour Duncan.`,
    },
    guitarHint: {
      fr: `Cliquez pour voir la transformation de ma guitare`,
      ko: `제 기타의 변신 과정을 보려면 클릭하세요`,
      es: `Haz clic para ver la transformación de mi guitarra`,
    },
    glbEyebrow: {
      fr: `La fabrication de la Frankenstrat`,
      ko: `Frankenstrat 제작기`,
      es: `La construcción de la Frankenstrat`,
    },

    /* ---- About · guitar build steps ---- */
    guitarT1: { fr: `Démontage & ponçage`, ko: `분해 & 샌딩`, es: `Desmontaje y lijado` },
    guitarD1: {
      fr: `J'ai démonté la guitare jusqu'au corps nu — plaque retirée, toute l'électronique sortie — puis poncé l'ancienne finition jusqu'à une surface plane et régulière (en photographiant d'abord le câblage pour que le remontage ne soit pas un jeu de devinettes).`,
      ko: `기타를 맨 몸체까지 분해하고 — 픽가드를 떼고 모든 전자 부품을 꺼낸 뒤 — 기존 마감을 평평하고 고른 표면이 되도록 샌딩했습니다 (재조립이 추측이 되지 않도록 배선을 먼저 촬영했습니다).`,
      es: `Desmonté la guitarra hasta dejar el cuerpo desnudo —golpeador fuera, toda la electrónica afuera— y luego lijé el acabado viejo hasta una superficie plana y uniforme (fotografiando primero el cableado para que el rearmado no fuera adivinanza).`,
    },
    guitarT2: { fr: `Base blanche + masquage`, ko: `흰색 베이스 + 마스킹`, es: `Base blanca y enmascarado` },
    guitarD2: {
      fr: `J'ai pulvérisé une couche de base blanche sur tout le corps, puis masqué à la main le motif de rayures Frankenstrat avec du ruban adhésif. C'est le ruban qui protège le blanc que l'on voit dans le design final.`,
      ko: `몸체 전체에 흰색 베이스 코트를 뿌린 뒤, Frankenstrat 줄무늬 패턴을 테이프로 직접 마스킹했습니다. 이 테이프가 최종 디자인에 보이는 흰색을 지켜 줍니다.`,
      es: `Apliqué una capa base blanca por todo el cuerpo y luego enmascaré a mano el patrón de rayas Frankenstrat con cinta. La cinta es lo que protege el blanco que se ve en el diseño final.`,
    },
    guitarT3: { fr: `Couche noire + paillettes d'or`, ko: `검은색 코트 + 금색 플레이크`, es: `Capa negra y escamas doradas` },
    guitarD3: {
      fr: `J'ai appliqué du noir sur le corps masqué, puis projeté des paillettes d'or sur le dos — une finition unique qu'on ne trouve sur aucune guitare d'usine.`,
      ko: `테이프를 붙인 몸체 위에 검은색을 입힌 뒤, 뒷면에 금색 반점을 흩뿌렸습니다 — 어떤 공장 기타에서도 찾을 수 없는 단 하나뿐인 마감입니다.`,
      es: `Apliqué negro sobre el cuerpo enmascarado y luego salpiqué motas doradas por la parte trasera: un acabado único que no encontrarás en ninguna guitarra de fábrica.`,
    },
    guitarT4: { fr: `Rouge cerise`, ko: `체리 레드`, es: `Rojo cereza` },
    guitarD4: {
      fr: `La couleur finale est appliquée : rouge cerise, pulvérisé sur l'ensemble. Sous tout ce rouge, le ruban maintient encore tout le motif en place.`,
      ko: `마지막 색을 입힙니다: 체리 레드를 전체에 뿌립니다. 그 모든 빨강 아래에서 테이프가 여전히 전체 패턴을 잡아 주고 있습니다.`,
      es: `Va el color final: rojo cereza, rociado sobre todo. Bajo todo ese rojo, la cinta sigue sujetando todo el patrón en su lugar.`,
    },
    guitarT5: { fr: `Retrait du ruban`, ko: `테이프 떼어내기`, es: `Retirar la cinta` },
    guitarD5: {
      fr: `Retirer le ruban révèle les rayures cachées en dessous — le motif Frankenstrat classique rouge, blanc et noir, avec des lignes nettes.`,
      ko: `테이프를 벗겨내면 그 아래 숨어 있던 줄무늬가 드러납니다 — 선명한 라인까지 살린 클래식한 빨강·흰색·검정 Frankenstrat 패턴입니다.`,
      es: `Al retirar la cinta se revelan las rayas escondidas debajo: el clásico patrón Frankenstrat rojo, blanco y negro, con líneas nítidas.`,
    },
    guitarT6: { fr: `Remonté & câblé pour le gros son`, ko: `재조립 & 강력한 배선`, es: `Rearmada y cableada con fuerza` },
    guitarD6: {
      fr: `Remontée avec un humbucker Seymour Duncan SH-4 JB au chevalet, des mécaniques à blocage et des cordes neuves. Un son EVH plus gras, des harmoniques hurlants et bien moins de bruit.`,
      ko: `브리지에 Seymour Duncan SH-4 JB 험버커, 락킹 튜너, 새 줄로 다시 조립했습니다. 더 두툼한 EVH 톤, 비명 지르는 하모닉스, 그리고 훨씬 적은 잡음.`,
      es: `De vuelta armada con una pastilla humbucker Seymour Duncan SH-4 JB en el puente, clavijas de bloqueo y cuerdas nuevas. Un tono EVH más grueso, armónicos chillones y mucho menos zumbido.`,
    },
  };

  const LANGS = [
    { code: "en", label: "English",  short: "EN" },
    { code: "fr", label: "Français", short: "FR" },
    { code: "ko", label: "한국어",    short: "KO" },
    { code: "es", label: "Español",  short: "ES" },
  ];
  const STORE_KEY = "site-lang";

  // Cache each element's English markup once, so switching back is lossless.
  const nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]"));
  nodes.forEach(function (el) { el._en = el.innerHTML; });
  const phNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-ph]"));
  phNodes.forEach(function (el) { el._enPh = el.getAttribute("placeholder") || ""; });
  let currentLang = "en";

  // Expose a tiny helper so other scripts (e.g. contact.js) can localize.
  // Returns undefined for English so callers use their own English fallback.
  window.SiteI18n = {
    str: function (key) {
      if (currentLang === "en") return undefined;
      const entry = DICT[key];
      return entry && entry[currentLang];
    },
    lang: function () { return currentLang; },
  };

  function apply(lang) {
    currentLang = lang;
    nodes.forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (lang === "en") { el.innerHTML = el._en; return; }
      const entry = DICT[key];
      el.innerHTML = (entry && entry[lang]) || el._en;
    });
    // Translate placeholders (data-i18n-ph)
    phNodes.forEach(function (el) {
      const key = el.getAttribute("data-i18n-ph");
      if (lang === "en") { el.setAttribute("placeholder", el._enPh); return; }
      const entry = DICT[key];
      el.setAttribute("placeholder", (entry && entry[lang]) || el._enPh);
    });
    document.documentElement.setAttribute("lang", lang);
    const meta = LANGS.find(function (l) { return l.code === lang; }) || LANGS[0];
    const code = document.querySelector(".lang-code");
    if (code) code.textContent = meta.short;
    document.querySelectorAll(".lang-menu [data-lang]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } })); } catch (e) {}
  }

  // ---- Dropdown wiring ----
  const sw = document.querySelector(".lang-switch");
  if (sw) {
    const btn = sw.querySelector(".lang-btn");
    const menu = sw.querySelector(".lang-menu");
    function close() { sw.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    function open() { sw.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      sw.classList.contains("open") ? close() : open();
    });
    menu.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-lang"));
        close();
      });
    });
    document.addEventListener("click", function (e) { if (!sw.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  let saved = "en";
  try { saved = localStorage.getItem(STORE_KEY) || "en"; } catch (e) {}
  apply(saved);
})();
