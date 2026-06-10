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
      fr: `<span class="badge-dot"></span> Promotion 2029 · GPA 3,83`,
      ko: `<span class="badge-dot"></span> 2029년 졸업 예정 · GPA 3.83`,
      es: `<span class="badge-dot"></span> Promoción 2029 · GPA 3.83`,
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
      fr: `Maths appliquées & science des données à UC Berkeley. Je travaille avec rigueur pour bâtir une vraie base mathématique sous tout ce que je crée.`,
      ko: `UC Berkeley에서 응용수학과 데이터 과학을 공부합니다. 제가 만드는 모든 것의 토대에 탄탄한 수학적 기반을 쌓기 위해 성실히 노력합니다.`,
      es: `Matemáticas Aplicadas y Ciencia de Datos en UC Berkeley. Trabajo con diligencia para construir una base matemática real bajo todo lo que creo.`,
    },
    pillarAIP: {
      fr: `Créateur AI-native depuis 4 ans et contributeur à la sécurité des enfants. Je livre avec Claude, Codex, Ollama et OpenCode.`,
      ko: `4년간 AI 네이티브 빌더이자 아동 안전 기여자입니다. Claude, Codex, Ollama, OpenCode로 제품을 만듭니다.`,
      es: `Creador AI-native desde hace 4 años y colaborador en seguridad infantil. Construyo con Claude, Codex, Ollama y OpenCode.`,
    },
    pillarFinanceP: {
      fr: `DCF, LBO et modélisation + Microfinance à Berkeley & le club de Private Equity + des pipelines de données qui éliminent les tâches répétitives.`,
      ko: `DCF, LBO, 모델링 + Berkeley의 마이크로파이낸스 & 프라이빗 에쿼티 클럽 + 잡무를 줄이는 데이터 파이프라인.`,
      es: `DCF, LBO y modelado + Microfinanzas en Berkeley y el club de Private Equity + pipelines de datos que eliminan el trabajo tedioso.`,
    },

    /* ---- Home · intro ---- */
    introEyebrow: { fr: `En bref`, ko: `요약하면`, es: `En resumen` },
    introText: {
      fr: `Je suis un créateur AI-native en début de carrière, rapide et pluridisciplinaire. Je transforme les mathématiques en modèles, les idées en sites livrés, et les données désordonnées en décisions d'affaires assurées. Curieux, autonome et pragmatique quand il s'agit de livrer.`,
      ko: `저는 빠르고 여러 분야를 넘나드는, 커리어 초기의 AI 네이티브 빌더입니다. 수학을 모델로, 아이디어를 출시된 사이트로, 복잡한 데이터를 확신 있는 비즈니스 결정으로 바꿉니다. 호기심 많고, 주도적이며, 실제 결과를 내놓는 데 실용적입니다.`,
      es: `Soy un creador AI-native al inicio de mi carrera, rápido y multidisciplinario. Convierto las matemáticas en modelos, las ideas en sitios publicados y los datos desordenados en decisiones de negocio seguras. Curioso, autónomo y pragmático a la hora de entregar.`,
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
      fr: `Je ne choisis pas une seule voie,<br />je les relie.`,
      ko: `한 길만 택하지 않고,<br />그것들을 잇습니다.`,
      es: `No elijo un solo camino,<br />los conecto.`,
    },
    aboutLead: {
      fr: `Je débute mon parcours et j'ai soif d'en apprendre davantage. J'avance vite, je travaille dans plusieurs disciplines et je livre de vraies solutions.`,
      ko: `저는 여정의 초입에 있으며 더 배우고자 하는 열망이 큽니다. 빠르게 움직이고, 여러 분야를 넘나들며, 실제 솔루션을 출시합니다.`,
      es: `Estoy al comienzo del camino y con ganas de aprender más. Avanzo rápido, trabajo en varias disciplinas y entrego soluciones reales.`,
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
      fr: `Je travaille à l'intersection des <em>maths, de l'IA et de la finance</em>. Les maths m'apportent la rigueur, l'IA le levier, et la finance l'application.`,
      ko: `저는 <em>수학, AI, 금융</em>이 만나는 지점에서 일합니다. 수학은 엄밀함을, AI는 지렛대를 주고, 금융은 그 응용입니다.`,
      es: `Trabajo en la intersección de <em>matemáticas, IA y finanzas</em>. Las matemáticas me dan el rigor, la IA el apalancamiento, y las finanzas son la aplicación.`,
    },
    aboutP2: {
      fr: `Je suis vraiment AI-native. Je ne me contente pas d'utiliser des outils d'IA ; je construis et je déploie avec eux. Claude, Codex, Ollama et OpenCode font partie de ma façon de passer de l'idée à la livraison, qu'il s'agisse d'un site déployé, d'un pipeline de visualisation de données ou d'un jeu d'évaluation pour des modèles de sécurité des enfants.`,
      ko: `저는 진정한 AI 네이티브입니다. AI 도구를 단지 사용하는 데 그치지 않고, 그것으로 만들고 배포합니다. Claude, Codex, Ollama, OpenCode는 아이디어를 출시까지 가져가는 제 방식의 일부이며, 그것이 배포된 사이트든 데이터 시각화 파이프라인이든 아동 안전 모델용 평가 세트든 마찬가지입니다.`,
      es: `Soy genuinamente AI-native. No solo uso herramientas de IA; construyo y despliego con ellas. Claude, Codex, Ollama y OpenCode forman parte de cómo llevo las cosas de la idea a la entrega, ya sea un sitio desplegado, un pipeline de visualización de datos o un conjunto de evaluación para modelos de seguridad infantil.`,
    },
    aboutP3: {
      fr: `Sous les outils se trouvent une vraie base mathématique et une formation en finance qui me poussent à poser les questions pratiques. J'ai appris à demander : quel est le modèle, quel est le résultat, qu'est-ce qui fait bouger le chiffre. J'ai mené des analyses DCF et LBO, automatisé des rapports en réduisant de 60 % le temps de codage et de débogage, et conseillé plusieurs entreprises via Microfinance à Berkeley.`,
      ko: `도구 아래에는 진짜 수학적 기반과 금융 배경이 있어, 늘 실용적인 질문을 던지게 합니다. 저는 '모델이 무엇인가, 결과가 무엇인가, 무엇이 숫자를 움직이는가'를 묻도록 훈련되었습니다. DCF와 LBO 분석을 수행했고, 코딩·디버깅 시간을 60% 줄인 보고 자동화를 구축했으며, Berkeley의 마이크로파이낸스를 통해 여러 기업을 자문했습니다.`,
      es: `Bajo las herramientas hay una base matemática real y una formación en finanzas que me hacen plantear las preguntas prácticas. Aprendí a preguntar cuál es el modelo, cuál es el resultado, qué mueve la cifra. He realizado análisis de DCF y LBO, automatizado informes reduciendo en un 60 % el tiempo de codificación y depuración, y asesorado a varias empresas a través de Microfinanzas en Berkeley.`,
    },
    aboutP4: {
      fr: `Voici l'essentiel : je ne prétends pas être un ingénieur senior. Je suis un créateur rapide, polyvalent et curieux, qui acquiert tôt une grande variété d'expériences pour que la profondeur s'accumule ensuite. Pragmatique quant à la livraison, sérieux dans le travail et toujours en train d'apprendre.`,
      ko: `중요한 점은 이것입니다: 저는 시니어 엔지니어라고 주장하지 않습니다. 저는 빠르고, 폭넓고, 호기심 많은 빌더로서 일찍부터 다양한 경험을 쌓아 나중에 깊이가 쌓이도록 합니다. 출시에 실용적이고, 일에 진지하며, 꾸준히 배웁니다.`,
      es: `Esto es lo importante: no pretendo ser un ingeniero senior. Soy un creador rápido, versátil y curioso que reúne amplitud desde temprano, para que la profundidad se acumule después. Pragmático al entregar, serio con el trabajo y siempre aprendiendo.`,
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
      fr: `J'ai obtenu des A dans tout le lycée et dans de nombreux cours de community college.`,
      ko: `고등학교 전 과정과 다수의 커뮤니티 칼리지 수업에서 전 과목 A를 받았습니다.`,
      es: `Fui un estudiante de sobresalientes en toda la preparatoria y en muchas clases de community college.`,
    },
    beyondScoutH: { fr: `Chef louveteau`, ko: `컵 스카우트 리더`, es: `Líder de Cub Scouts` },
    beyondScoutP: {
      fr: `J'encadre une unité de 15 enfants, entièrement en français. À parts égales logistique, patience et amusement.`,
      ko: `15명의 아이들로 이루어진 단원을 전부 프랑스어로 이끕니다. 물류, 인내심, 그리고 즐거움이 똑같이 필요합니다.`,
      es: `Dirijo una unidad de 15 niños, completamente en francés. A partes iguales logística, paciencia y diversión.`,
    },
    beyondCelestialH: { fr: `Mécanique céleste`, ko: `천체 역학`, es: `Mecánica celeste` },
    beyondCelestialP: {
      fr: `J'ai une fascination de longue date pour le ciel et pour les mathématiques qui régissent le mouvement des plus grands objets de l'univers.`,
      ko: `저는 하늘과, 우주에서 가장 거대한 것들이 어떻게 움직이는지를 설명하는 수학에 오랫동안 매료되어 왔습니다.`,
      es: `Tengo una fascinación de toda la vida por el cielo y por las matemáticas detrás de cómo se mueven los objetos más grandes del universo.`,
    },
    beyondTreasurerH: { fr: `Trésorier`, ko: `회계 담당`, es: `Tesorero` },
    beyondTreasurerP: {
      fr: `Je suis le trésorier de Phi Delta Theta de UC Berkeley (chapitre California Alpha) pour l'année universitaire 2026–27.`,
      ko: `저는 2026–27학년도 UC Berkeley Phi Delta Theta(California Alpha 지부)의 회계 담당입니다.`,
      es: `Soy el tesorero de Phi Delta Theta de UC Berkeley (capítulo California Alpha) para el año académico 2026–27.`,
    },
    aboutCtaH: {
      fr: `Vous voulez le tableau complet ?`,
      ko: `전체 그림이 궁금하신가요?`,
      es: `¿Quieres el panorama completo?`,
    },
    aboutCtaSub: {
      fr: `Découvrez ce que j'ai réellement livré, ou contactez-moi directement.`,
      ko: `제가 실제로 만든 것을 보거나, 바로 연락해 주세요.`,
      es: `Mira lo que realmente he entregado, o contáctame directamente.`,
    },

    /* ---- Shared CTAs ---- */
    ctaViewWork:    { fr: `Voir les projets <span class="arr">→</span>`, ko: `프로젝트 보기 <span class="arr">→</span>`, es: `Ver el trabajo <span class="arr">→</span>` },
    ctaGetInTouch:  { fr: `Me contacter <span class="arr">→</span>`,    ko: `연락하기 <span class="arr">→</span>`,    es: `Ponte en contacto <span class="arr">→</span>` },
    ctaMoreAboutMe: { fr: `En savoir plus sur moi <span class="arr">→</span>`, ko: `나에 대해 더 보기 <span class="arr">→</span>`, es: `Más sobre mí <span class="arr">→</span>` },

    /* ---- Work ---- */
    workEyebrow: { fr: `Projets sélectionnés`, ko: `선별된 작업`, es: `Trabajo seleccionado` },
    workTitle: {
      fr: `Des choses que j'ai<br />réellement livrées.`,
      ko: `제가 실제로<br />출시한 것들.`,
      es: `Cosas que realmente<br />he entregado.`,
    },
    workLead: {
      fr: `À travers la sécurité de l'IA, la microfinance, le private equity et la robotique, j'ai occupé de vrais rôles et obtenu de vrais résultats.`,
      ko: `AI 안전, 마이크로파이낸스, 프라이빗 에쿼티, 로보틱스에 걸쳐 실제 역할을 맡고 실제 성과를 만들었습니다.`,
      es: `En seguridad de IA, microfinanzas, private equity y robótica, he ocupado roles reales y logrado resultados reales.`,
    },
    roleYouthAdvisor: { fr: `Conseiller jeunesse`, ko: `청소년 자문위원`, es: `Asesor juvenil` },
    everyoneP: {
      fr: `Je calibre des données pour entraîner des évaluations de sécurité des enfants pour les LLM et les LVM, aidant les modèles à apprendre ce qui convient aux jeunes utilisateurs. J'ai animé des ateliers sur la sécurité de l'IA pour <strong>150+ étudiants</strong>, rédigé et présenté des manifestes au G7, et conçu des présentations en veillant à la cohérence des traductions.`,
      ko: `저는 LLM과 LVM의 아동 안전 평가를 학습시키기 위한 데이터를 보정하며, 모델이 어린 사용자에게 적절한 것을 학습하도록 돕고 있습니다. <strong>150명 이상의 학생</strong>을 대상으로 AI 안전 워크숍을 진행했고, G7에 선언문을 작성·발표했으며, 번역 일관성을 보장하며 슬라이드 발표 자료를 제작했습니다.`,
      es: `He calibrado datos para entrenar evaluaciones de seguridad infantil para LLM y LVM, ayudando a los modelos a aprender qué es apropiado para usuarios más jóvenes. He impartido talleres de seguridad de IA para <strong>150+ estudiantes</strong>, redactado y presentado manifiestos al G7, y elaborado presentaciones asegurando la coherencia de las traducciones.`,
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
      fr: `Modélisation financière concrète — construction d'analyses DCF et LBO et de modèles de valorisation sous Excel, et mise à l'épreuve des hypothèses sous-jacentes.`,
      ko: `실전 재무 모델링 — Excel에서 DCF와 LBO 분석 및 가치 평가 모델을 구축하고, 그 이면의 가정을 철저히 검증합니다.`,
      es: `Modelado financiero práctico: construcción de análisis de DCF y LBO y modelos de valoración en Excel, y puesta a prueba de los supuestos detrás de ellos.`,
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
      fr: `J'ai créé et dirigé un club d'investissement à partir de zéro. J'ai bâti le programme, la communauté et l'habitude d'apprendre les marchés en pratiquant (actions virtuelles).`,
      ko: `투자 클럽을 처음부터 만들고 운영했습니다. 커리큘럼과 커뮤니티, 그리고 (가상 주식으로) 실제로 해보며 시장을 배우는 습관을 만들었습니다.`,
      es: `Fundé y dirigí un club de inversión desde cero. Construí el plan de estudios, la comunidad y el hábito de aprender los mercados haciendo (acciones virtuales).`,
    },
    chipFounder:   { fr: `Fondateur`, ko: `창립자`, es: `Fundador` },
    chipMarkets:   { fr: `Marchés`, ko: `시장`, es: `Mercados` },
    chipCommunity: { fr: `Communauté`, ko: `커뮤니티`, es: `Comunidad` },
    honorsEyebrow: { fr: `Distinctions`, ko: `수상 및 영예`, es: `Reconocimientos` },
    honorsTitle:   { fr: `Quelques-unes en chemin.`, ko: `그동안의 몇 가지.`, es: `Algunas en el camino.` },
    honorVal: {
      fr: `<span class="honor-ico">★</span> Major de promotion`,
      ko: `<span class="honor-ico">★</span> 수석 졸업생`,
      es: `<span class="honor-ico">★</span> Mejor de la promoción`,
    },
    workCtaH:   { fr: `Construisons quelque chose.`, ko: `무언가 함께 만들어요.`, es: `Construyamos algo.` },
    workCtaSub: {
      fr: `Ouvert aux stages, aux collaborations et aux bonnes conversations.`,
      ko: `인턴십, 협업, 그리고 좋은 대화를 환영합니다.`,
      es: `Abierto a prácticas, colaboraciones y buenas conversaciones.`,
    },

    /* ---- Connect ---- */
    connectEyebrow: { fr: `Contact`, ko: `연락처`, es: `Contacto` },
    connectTitle:   { fr: `Parlons.`, ko: `이야기해요.`, es: `Hablemos.` },
    connectLead: {
      fr: `Ouvert aux stages, aux collaborations et aux bonnes conversations. Laissez-moi un message ci-dessous, et il arrivera directement dans ma boîte mail. Je lis tout !`,
      ko: `인턴십, 협업, 그리고 좋은 대화를 환영합니다. 아래에 메시지를 남겨 주세요. 제 메일함으로 바로 전달됩니다. 저는 모든 메시지를 읽습니다!`,
      es: `Abierto a prácticas, colaboraciones y buenas conversaciones. Déjame un mensaje abajo y llegará directo a mi bandeja de entrada. ¡Lo leo todo!`,
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
      fr: `Pour que je puisse répondre — jamais partagé, jamais affiché publiquement.`,
      ko: `답장을 드리기 위함입니다 — 공유하거나 공개하지 않습니다.`,
      es: `Para poder responderte — nunca se comparte ni se muestra públicamente.`,
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
