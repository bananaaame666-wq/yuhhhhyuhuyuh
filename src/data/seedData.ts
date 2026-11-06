import { Buddy, ChatMessage, DramaBeat, EscapeClue, ImprovScenario } from '../types';

export const BUDDY_PROFILES: Buddy[] = [
  {
    id: 'camila',
    name: 'Camila',
    age: 22,
    city: 'Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    nativeLanguage: 'Spanish (Native)',
    learningLanguage: 'English',
    level: 'Intermediate (B1)',
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    avatarEmoji: '👩🏻‍🎨',
    bio: 'Graphic design student & cafe hopper. Practicing English for portfolio reviews and international creative studios!',
    interests: ['Indie Rock', 'Street Tacos', 'Ceramics', 'Design'],
    greeting: '¡Hola! I love sharing Mexican culture while improving my English conversational flow with friendly pals.',
  },
  {
    id: 'jun',
    name: 'Jun',
    age: 24,
    city: 'Shanghai',
    country: 'China',
    flag: '🇨🇳',
    nativeLanguage: 'Mandarin Chinese (Native)',
    learningLanguage: 'English',
    level: 'Intermediate (B1)',
    avatarBg: 'bg-sky-100 text-sky-800 border-sky-300',
    avatarEmoji: '👨🏻‍💻',
    bio: 'Software engineer & tea culture enthusiast from Shanghai. Practicing conversational English while sharing Chinese language & culture!',
    interests: ['Longjing Tea', 'Dim Sum', 'Indie Games', 'Bouldering'],
    greeting: 'Nǐ hǎo! Let’s exchange stories—you practice with me, and I practice my conversational English with you.',
  },
  {
    id: 'minho',
    name: 'Minho',
    age: 25,
    city: 'Seoul',
    country: 'South Korea',
    flag: '🇰🇷',
    nativeLanguage: 'Korean (Native)',
    learningLanguage: 'English',
    level: 'Upper Elementary (A2)',
    avatarBg: 'bg-violet-100 text-violet-800 border-violet-300',
    avatarEmoji: '🎧',
    bio: 'Music producer & street photographer from Seoul. Learning conversational English to collaborate with global creators!',
    interests: ['K-Indie Music', 'Film Photography', 'Spicy Ramyun', 'Han River Walks'],
    greeting: 'Annyeonghaseyo! Practicing daily conversation makes language stick way faster than memorizing flashcards.',
  },
];

export const INITIAL_MESSAGES_BY_BUDDY: Record<string, ChatMessage[]> = {
  camila: [
    {
      id: 'cam-seed-1',
      sender: 'buddy',
      buddyId: 'camila',
      text: '¡Hola! Good morning! How was your weekend? Did you do anything fun?',
      language: 'en',
      translation: '¡Hola! ¡Buenos días! ¿Cómo estuvo tu fin de semana? ¿Hiciste algo divertido?',
      timestamp: '10:14 AM',
    },
    {
      id: 'cam-seed-2',
      sender: 'user',
      buddyId: 'camila',
      text: '¡Hola Camila! Estuvo muy tranquilo. Fui al parque con mi perro y leí un libro.',
      language: 'es',
      translation: "Demo translation · your buddy can help you polish it: 'Hello Camila! It was very quiet. I went to the park with my dog and read a book.'",
      timestamp: '10:17 AM',
    },
    {
      id: 'cam-seed-3',
      sender: 'buddy',
      buddyId: 'camila',
      text: 'Aw, I love dogs! What breed is your dog? I have a golden retriever named Canelo who loves chasing tennis balls.',
      language: 'en',
      translation: '¡Ay, me encantan los perros! ¿Qué raza es tu perro? Yo tengo un golden retriever que se llama Canelo y le encanta perseguir pelotas de tenis.',
      timestamp: '10:19 AM',
    },
  ],
  jun: [
    {
      id: 'jun-seed-1',
      sender: 'buddy',
      buddyId: 'jun',
      text: 'Nǐ hǎo! Good morning! I just brewed a fresh pot of Longjing green tea here in Shanghai. How is your day going?',
      language: 'en',
      translation: '¡Hola! ¡Buenos días! Acabo de preparar una tetera de té verde Longjing aquí en Shanghái. ¿Cómo va tu día? (你好！)',
      timestamp: '09:30 AM',
    },
    {
      id: 'jun-seed-2',
      sender: 'user',
      buddyId: 'jun',
      text: '¡Hola Jun! Todo bien por aquí. Me gusta mucho la cultura del té y quiero practicar.',
      language: 'es',
      translation: "Demo translation · your buddy can help you polish it: 'Hello Jun! All good here. I really like tea culture and want to practice.'",
      timestamp: '09:34 AM',
    },
    {
      id: 'jun-seed-3',
      sender: 'buddy',
      buddyId: 'jun',
      text: 'That is awesome! In China we say "循序渐进" (step by step brings great mastery). What kind of tea or drinks do you like having in the morning?',
      language: 'en',
      translation: '¡Eso es genial! En China decimos "paso a paso se logra la maestría". ¿Qué tipo de té o bebidas te gusta tomar en la mañana?',
      timestamp: '09:36 AM',
    },
  ],
  minho: [
    {
      id: 'min-seed-1',
      sender: 'buddy',
      buddyId: 'minho',
      text: 'Annyeonghaseyo! Hey there! I just wrapped up a sound recording session in Hongdae, Seoul. Did you have a good week?',
      language: 'en',
      translation: '¡Hola! ¡Qué tal! Acabo de terminar una sesión de grabación de sonido en Hongdae, Seúl. ¿Tuviste una buena semana? (안녕하세요!)',
      timestamp: '11:05 AM',
    },
    {
      id: 'min-seed-2',
      sender: 'user',
      buddyId: 'minho',
      text: '¡Hola Minho! Sí, estuvo genial. Escuché mucha música y descansé con amigos.',
      language: 'es',
      translation: "Demo translation · your buddy can help you polish it: 'Hello Minho! Yes, it was great. I listened to a lot of music and rested with friends.'",
      timestamp: '11:08 AM',
    },
    {
      id: 'min-seed-3',
      sender: 'buddy',
      buddyId: 'minho',
      text: 'Sounds so relaxing! Music is our universal language, and practicing conversation brings everyone together. What songs are on your playlist lately?',
      language: 'en',
      translation: '¡Suena muy relajante! La música es nuestro idioma universal, y practicar conversación une a todos. ¿Qué canciones están en tu lista últimamente?',
      timestamp: '11:11 AM',
    },
  ],
  mateo: [
    {
      id: 'mat-seed-1',
      sender: 'buddy',
      buddyId: 'mateo',
      text: '¡Hola! I just brewed a fresh pour-over coffee. Are you having a good day so far?',
      language: 'en',
      translation: '¡Hola! Acabo de preparar un café filtrado. ¿Estás teniendo un buen día hasta ahora?',
      timestamp: '09:30 AM',
    },
    {
      id: 'mat-seed-2',
      sender: 'user',
      buddyId: 'mateo',
      text: '¡Hola! Sí, hoy hace buen tiempo y estoy practicando.',
      language: 'es',
      translation: "Demo translation: 'Hello! Yes, the weather is nice today and I am practicing.'",
      timestamp: '09:34 AM',
    },
  ],
  lucia: [
    {
      id: 'luc-seed-1',
      sender: 'buddy',
      buddyId: 'lucia',
      text: '¡Buenas tardes! How is your day going?',
      language: 'en',
      translation: '¡Buenas tardes! ¿Cómo va tu día?',
      timestamp: '11:05 AM',
    },
  ],
};

export const CONVERSATION_STARTERS_BY_BUDDY: Record<string, string[]> = {
  camila: [
    '¿Qué canción has escuchado mucho últimamente?',
    '¿Tienes alguna mascota o qué animal te gustaría tener?',
    '¿Cuál fue la comida más rica que probaste esta semana?',
    '¿Qué planes tienes para el próximo fin de semana?',
    '¿Qué lugar de la Ciudad de México me recomiendas visitar?',
    '¿Prefieres tomar café por la mañana o té por la tarde?',
  ],
  jun: [
    '你好！今天过得怎么样？ (Nǐ hǎo! How is your day going?)',
    '你最喜欢喝什么中国茶？ (What Chinese tea do you like most?)',
    '上海现在的天气怎么样？ (How is the weather in Shanghai?)',
    '周末你一般做什么好玩的？ (What fun things do you do on weekends?)',
    '推荐一家上海好吃的点心店吧！ (Recommend a good dim sum spot in Shanghai!)',
    '你正在开发什么有趣的软件项目？ (What software projects are you coding?)',
  ],
  minho: [
    '안녕하세요! 오늘 하루 어땠어요? (Annyeonghaseyo! How was your day?)',
    '요즘 자주 듣는 노래 추천해 주세요! (Recommend a song you listen to often!)',
    '서울에서 가장 좋아하는 장소가 어디예요? (What is your favorite place in Seoul?)',
    '홍대 스튜디오에서 어떤 음악을 만들어요? (What music are you producing in Hongdae?)',
    '주말에 보통 뭐 하고 지내요? (What do you usually do on weekends?)',
    '라면이나 매운 음식 좋아해요? (Do you like spicy ramyun or Korean street food?)',
  ],
};

export const CONVERSATION_STARTERS = CONVERSATION_STARTERS_BY_BUDDY.camila;

export interface ScriptedReply {
  text: string;
  translation: string;
}

export function generateScriptedBuddyReply(
  userText: string,
  buddy: Buddy
): ScriptedReply {
  const lower = userText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Music / Song topic
  if (
    lower.includes('cancion') ||
    lower.includes('musica') ||
    lower.includes('escuch') ||
    lower.includes('artista') ||
    lower.includes('banda') ||
    lower.includes('rock') ||
    lower.includes('pop') ||
    lower.includes('cantar') ||
    lower.includes('song') ||
    lower.includes('music') ||
    userText.includes('歌') ||
    userText.includes('音乐') ||
    userText.includes('노래') ||
    userText.includes('음악')
  ) {
    if (buddy.id === 'minho') {
      return {
        text: `Music is my entire world! I've been experimenting with K-indie synth textures in my Hongdae studio this week. What artists have been in your headphones today?`,
        translation: `¡La música es todo mi mundo! Esta semana estuve experimentando con texturas sintéticas de K-indie en mi estudio de Hongdae. ¿Qué artistas has estado escuchando hoy?`,
      };
    }
    if (buddy.id === 'jun') {
      return {
        text: `Music keeps me focused when coding long algorithms! I listen to ambient lo-fi and guzheng instrumentals. Do you enjoy instrumental or vocal tracks more?`,
        translation: `¡La música me mantiene concentrado cuando programo algoritmos largos! Escucho lo-fi ambiental e instrumentales de guzheng. ¿Te gustan más las pistas instrumentales o con voces?`,
      };
    }
    return {
      text: `Music is honestly the most fun way to pick up slang and cadence! I've been looping acoustic playlists while sketching. What music genres do you enjoy most?`,
      translation: `¡La música es sinceramente la forma más divertida de aprender modismos y ritmo! He estado escuchando listas acústicas mientras dibujo. ¿Qué géneros musicales disfrutas más?`,
    };
  }

  // 2. Pets / Animals topic
  if (
    lower.includes('perro') ||
    lower.includes('gato') ||
    lower.includes('mascota') ||
    lower.includes('animal') ||
    lower.includes('canelo') ||
    lower.includes('dog') ||
    lower.includes('cat') ||
    lower.includes('pet') ||
    userText.includes('狗') ||
    userText.includes('猫') ||
    userText.includes('宠物') ||
    userText.includes('강아지') ||
    userText.includes('고양이')
  ) {
    return {
      text: `Pets bring so much positive energy into our daily lives! Whenever I sit down to practice my conversational English, having a furry friend nearby makes learning completely stress-free. Do you have any funny pet stories?`,
      translation: `¡Las mascotas traen tanta energía positiva a nuestras vidas diarias! Cada vez que me siento a practicar mi inglés conversacional, tener a un amigo peludo cerca hace que aprender sea sin estrés. ¿Tienes alguna anécdota divertida con mascotas?`,
    };
  }

  // 3. Greetings / How are you / Day topic
  if (
    lower.includes('hola') ||
    lower.includes('buenos dias') ||
    lower.includes('buenas tardes') ||
    lower.includes('como estas') ||
    lower.includes('que tal') ||
    lower.includes('bien') ||
    lower.includes('hoy') ||
    lower.includes('dia') ||
    lower.includes('hello') ||
    lower.includes('hi') ||
    userText.includes('你好') ||
    userText.includes('早') ||
    userText.includes('안녕')
  ) {
    if (buddy.id === 'jun') {
      return {
        text: `Nǐ hǎo! It’s awesome to chat with you today! The weather here in Shanghai is nice, and I just stepped out for some fresh air along the Bund. How is your day starting out?`,
        translation: `¡Hola (你好)! ¡Es genial charlar contigo hoy! El clima aquí en Shanghái está agradable y salí a tomar aire fresco por el Bund. ¿Cómo va comenzando tu día?`,
      };
    }
    if (buddy.id === 'minho') {
      return {
        text: `Annyeonghaseyo! Great to connect with you! I took a refreshing morning walk near the Han River before hitting the music studio. How has your week been treating you?`,
        translation: `¡Hola (안녕하세요)! ¡Qué alegría conectar contigo! Di un paseo matutino refrescante cerca del río Han antes de ir al estudio de música. ¿Cómo te ha tratado la semana?`,
      };
    }
    return {
      text: `¡Hola! It’s really great to chat with you today! The weather here in Mexico City has been lovely and warm. How is everything where you are?`,
      translation: `¡Hola! ¡Es realmente genial charlar contigo hoy! El clima aquí en la Ciudad de México ha estado encantador y cálido. ¿Cómo está todo por donde tú estás?`,
    };
  }

  // 4. Food / Cooking / Tea / Coffee
  if (
    lower.includes('comida') ||
    lower.includes('comer') ||
    lower.includes('tacos') ||
    lower.includes('cafe') ||
    lower.includes('te') ||
    lower.includes('cocinar') ||
    lower.includes('restaurante') ||
    lower.includes('food') ||
    lower.includes('tea') ||
    lower.includes('coffee') ||
    userText.includes('茶') ||
    userText.includes('吃') ||
    userText.includes('点心') ||
    userText.includes('밥') ||
    userText.includes('라면') ||
    userText.includes('떡볶이')
  ) {
    if (buddy.id === 'jun') {
      return {
        text: `Now you're speaking my language! Tea and food culture are huge here in Shanghai—we love hot xiaolongbao soup dumplings with fresh Longjing green tea. What is your favorite treat when you want comfort food?`,
        translation: `¡Ahora sí estás hablando mi idioma! La cultura del té y la comida es enorme en Shanghái: nos encantan los dumplings de sopa xiaolongbao con té verde Longjing fresco. ¿Cuál es tu comida reconfortante favorita?`,
      };
    }
    if (buddy.id === 'minho') {
      return {
        text: `Food is life in Seoul! After late night recording sessions, a steaming bowl of spicy ramyun or crispy tteokbokki is unbeatable. What's your go-to comfort meal after a long day?`,
        translation: `¡La comida es vida en Seúl! Después de grabar hasta tarde, un tazón humeante de ramen picante o tteokbokki crujiente es insuperable. ¿Cuál es tu comida favorita tras un largo día?`,
      };
    }
    return {
      text: `Now you are making me hungry! Food is such a huge part of Mexican culture—from street tacos al pastor to warm churros. What is your favorite dish when you want something delicious?`,
      translation: `¡Ahora me estás dando hambre! La comida es una parte enorme de la cultura mexicana, desde tacos al pastor hasta churros calientes. ¿Cuál es tu platillo favorito cuando quieres algo delicioso?`,
    };
  }

  // 5. General Friendly Fallback
  return {
    text: `That was communicated so clearly and naturally! In our exchange, practicing a few spoken sentences every single day builds lasting conversational confidence. What else are you planning today?`,
    translation: `¡Eso se comunicó de forma tan clara y natural! En nuestro intercambio, practicar unas cuantas frases habladas cada día construye confianza conversacional duradera. ¿Qué más tienes planeado hoy?`,
  };
}

export const DRAMA_BEATS: DramaBeat[] = [
  {
    id: 1,
    sceneTitle: 'Act 1: The Airport Terminal Encounter',
    context: 'You are waiting at the boarding gate in Mexico City when you bump into Mateo, your childhood best friend who vanished 3 years ago!',
    buddyPrompt: 'Mateo drops his passport, gasps, and stares in disbelief: "¡¿Tú?! ¡No puede ser posible!" How do you react with dramatic emotion?',
    options: [
      {
        id: '1a',
        textSpanish: '¡Alejandro! ¿De verdad eres tú después de tres años sin decir una palabra?',
        textEnglish: 'Alejandro! Is it really you after three years without saying a single word?!',
        isCorrect: true,
        explanation: 'Perfect! Dramatic, personal, and immediately drives the story forward.',
      },
      {
        id: '1b',
        textSpanish: 'Disculpe señor, ¿sabe a qué hora sale el autobús al centro comercial?',
        textEnglish: 'Excuse me sir, do you know what time the bus leaves for the shopping mall?',
        isCorrect: false,
        explanation: 'Too mundane! He is your vanished best friend, not an airport transit clerk.',
      },
      {
        id: '1c',
        textSpanish: 'Tengo que comprar una botella de agua sin gas en la tienda de regalos.',
        textEnglish: 'I need to buy a bottle of still water at the gift shop.',
        isCorrect: false,
        explanation: 'Hydration is important, but a dramatic reunion demands some emotional fireworks!',
      },
    ],
  },
  {
    id: 2,
    sceneTitle: 'Act 2: The Mysterious Silver Envelope',
    context: 'Mateo pulls out a heavy silver envelope stamped with a red wax seal and says with a trembling voice: "Tenía prohibido buscarte... pero tienes que abrir esto ahora mismo."',
    buddyPrompt: 'He hands you the envelope. The terminal crowd is watching. What do you say to demand the truth?',
    options: [
      {
        id: '2a',
        textSpanish: '¡Dime la verdad ahora mismo! ¿Por qué te fuiste y qué significa esta carta?',
        textEnglish: 'Tell me the truth right now! Why did you leave and what does this letter mean?!',
        isCorrect: true,
        explanation: '¡Excelente! Pure telenovela intensity with righteous passion.',
      },
      {
        id: '2b',
        textSpanish: 'El sobre plateado hace buen juego con el color de mis calcetines.',
        textEnglish: 'The silver envelope matches nicely with the color of my socks.',
        isCorrect: false,
        explanation: 'A bit too fashion-focused when your friend is holding a sealed mystery!',
      },
      {
        id: '2c',
        textSpanish: 'Creo que olvidé revisar si cerré la puerta con llave antes de salir.',
        textEnglish: 'I think I forgot to check if I locked the front door before leaving.',
        isCorrect: false,
        explanation: 'Classic everyday worry, but don’t abandon the mystery just yet!',
      },
    ],
  },
  {
    id: 3,
    sceneTitle: 'Act 3: The Grand Reveal & Resolution',
    context: 'You tear open the wax seal. Inside is not a ransom or a secret mission, but two VIP concert tickets to see your favorite Spanish band in Madrid—plus a handwritten note apologizing for being gone while preparing this surprise tour!',
    buddyPrompt: 'Mateo smiles with tears in his eyes: "¡Nunca me olvidé de nuestra promesa!" How do you conclude the scene?',
    options: [
      {
        id: '3a',
        textSpanish: '¡Eres el mejor amigo del mundo! ¡Perdóname por haber dudado de ti, nos vamos a Madrid!',
        textEnglish: 'You are the best friend in the world! Forgive me for doubting you, we are going to Madrid!',
        isCorrect: true,
        explanation: '¡Qué gran final! Heartwarming resolution, tears of joy, and a shared adventure.',
      },
      {
        id: '3b',
        textSpanish: 'No me gusta la música en vivo, prefiero escuchar podcasts en mi sala.',
        textEnglish: 'I don’t like live music, I prefer listening to podcasts in my living room.',
        isCorrect: false,
        explanation: 'Total buzzkill! Poor Mateo spent three years planning this surprise trip!',
      },
      {
        id: '3c',
        textSpanish: '¿Me puedes transferir diez pesos para pagar el estacionamiento del aeropuerto?',
        textEnglish: 'Can you transfer me ten pesos to pay for airport parking?',
        isCorrect: false,
        explanation: 'Very practical, but leaves your dramatic partner hanging on the emotional crescendo!',
      },
    ],
  },
];

export const ESCAPE_ROOM_CLUES: EscapeClue[] = [
  {
    id: 1,
    title: 'Clue 1: The Librarian’s Secret Folio',
    clueSpanish: '«Para desbloquear el primer candado, busca el libro azul que descansa justo debajo del reloj antiguo de madera en la pared norte.»',
    hint: 'Notice key vocabulary: "libro azul" (blue book) and "reloj antiguo de madera" (antique wooden clock).',
    question: 'Where is the hidden key mechanism?',
    targetVoiceCommandSpanish: 'Buscar el libro azul debajo del reloj',
    alternateKeywords: ['libro azul', 'reloj', 'azul', 'debajo del reloj'],
    options: [
      {
        id: 'clue1-correct',
        text: 'The blue book resting directly beneath the antique wooden clock',
        isCorrect: true,
        feedback: '¡Exacto! You slide the blue book out, and a small brass key clicks into place.',
      },
      {
        id: 'clue1-wrong1',
        text: 'The red leather dictionary beside the brass telescope',
        isCorrect: false,
        feedback: 'Not quite! Look for "libro azul" (blue book) and "reloj" (clock).',
      },
      {
        id: 'clue1-wrong2',
        text: 'The green journal locked inside the iron safe',
        isCorrect: false,
        feedback: 'Check the clue again: "debajo del reloj" means underneath the clock.',
      },
    ],
  },
  {
    id: 2,
    title: 'Clue 2: The Silent Owl Statuette',
    clueSpanish: '«Gira la pequeña estatua del búho hacia el norte exactamente tres veces hasta escuchar un chasquido suave.»',
    hint: '"Estatua del búho" means owl statue, and "tres veces" means three times.',
    question: 'What physical action must you take to open the stone bookcase?',
    targetVoiceCommandSpanish: 'Girar la estatua del búho tres veces',
    alternateKeywords: ['girar', 'buho', 'estatua', 'tres veces', 'norte'],
    options: [
      {
        id: 'clue2-correct',
        text: 'Rotate the small owl statue toward the north exactly three times',
        isCorrect: true,
        feedback: '¡Excelente! You rotate the owl three times. Clack! The stone shelf slides open.',
      },
      {
        id: 'clue2-wrong1',
        text: 'Pull the golden lion lever down twice until the bell rings',
        isCorrect: false,
        feedback: 'Remember: "búho" is an owl, not a lion ("león"). Try again!',
      },
      {
        id: 'clue2-wrong2',
        text: 'Tap the antique globe five times with the wooden cane',
        isCorrect: false,
        feedback: '"Girar" means to turn or rotate, and "tres" is 3. Look for the owl statue!',
      },
    ],
  },
  {
    id: 3,
    title: 'Clue 3: The Illuminated Exit Terminal',
    clueSpanish: '«Introduce la palabra secreta: "LIBERTAD" en el panel luminoso para desactivar la alarma final y abrir la gran puerta.»',
    hint: '"Palabra secreta" is secret word, and "panel luminoso" is the illuminated keypad.',
    question: 'How do you bypass the final security threshold?',
    targetVoiceCommandSpanish: 'LIBERTAD',
    alternateKeywords: ['libertad', 'palabra libertad', 'codigo libertad'],
    options: [
      {
        id: 'clue3-correct',
        text: 'Type the password "LIBERTAD" into the glowing keypad',
        isCorrect: true,
        feedback: '¡Puerta abierta! The heavy oak doors swing outward into the sunny courtyard. You escaped!',
      },
      {
        id: 'clue3-wrong1',
        text: 'Cut the green wire behind the emergency exit sign',
        isCorrect: false,
        feedback: 'No wire cutting required! The clue says: "introduce la palabra secreta".',
      },
      {
        id: 'clue3-wrong2',
        text: 'Scan your library card against the barcode reader',
        isCorrect: false,
        feedback: 'The clue specifies entering "LIBERTAD" on the glowing panel.',
      },
    ],
  },
];

export const IMPROV_SCENARIOS: ImprovScenario[] = [
  {
    id: 'scen-cake',
    title: 'The Green Cake on Live TV',
    emoji: '🎂',
    situationSpanish: '¡Estamos transmitiendo en vivo en televisión nacional! Tu pastel de cumpleaños salió completamente verde fluorescente y el famoso juez chef te mira con asombro.',
    situationEnglish: 'You are live on national television! Your birthday cake turned out bright neon green and the celebrity chef judge is staring at you in shock.',
    promptSpeaker: 'Chef Ramirez',
    promptQuestion: '«¡Por favor explícame qué hiciste! ¿Por qué este pastel parece de otro planeta?»',
    helpfulWords: [
      { es: 'Es una receta secreta', en: 'It is a secret recipe' },
      { es: 'Colorante natural de espinaca', en: 'Natural spinach coloring' },
      { es: 'Sabe muy delicioso', en: 'It tastes very delicious' },
      { es: 'Inspiración moderna', en: 'Modern inspiration' },
    ],
  },
  {
    id: 'scen-dragon',
    title: 'A Baby Dragon in Your Backpack',
    emoji: '🐉',
    situationSpanish: 'Abres tu mochila en la biblioteca de la universidad y encuentras un dragón bebé del tamaño de una manzana comiéndose tus galletas.',
    situationEnglish: 'You open your backpack in the library and find an apple-sized baby dragon munching on your snack crackers.',
    promptSpeaker: 'El Bibliotecario / Dragón',
    promptQuestion: 'El bibliotecario se acerca murmurando: «¿Qué tienes haciendo ruido dentro de tu mochila?»',
    helpfulWords: [
      { es: 'Es un juguete electrónico', en: 'It is an electronic toy' },
      { es: 'No hace fuego todavía', en: 'He does not breathe fire yet' },
      { es: 'Es muy cariñoso', en: 'He is very affectionate' },
      { es: 'Ya nos vamos afuera', en: 'We are leaving outside now' },
    ],
  },
  {
    id: 'scen-wedding',
    title: 'Accidental Guest at the Head Table',
    emoji: '🥂',
    situationSpanish: 'Entraste al salón de eventos equivocado por accidente y ahora estás sentado en la mesa de honor de una boda elegante donde no conoces a nadie.',
    situationEnglish: 'You accidentally entered the wrong banquet hall and are now sitting at the head table of an elegant wedding where you know no one.',
    promptSpeaker: 'El Padre de la Novia',
    promptQuestion: 'Te pasa el micrófono sonriendo: «¡Y ahora, unas palabras especiales de nuestro invitado de honor!»',
    helpfulWords: [
      { es: '¡Que vivan los novios!', en: 'Long live the newlyweds!' },
      { es: 'Les deseo mucho amor', en: 'I wish you both much love' },
      { es: 'Una boda inolvidable', en: 'An unforgettable wedding' },
      { es: '¡Salud por el futuro!', en: 'Cheers to the future!' },
    ],
  },
  {
    id: 'scen-dog',
    title: 'The Talking Neighborhood Dog',
    emoji: '🐕',
    situationSpanish: 'Estás esperando el semáforo en la esquina cuando el perro golden retriever del vecino te mira fijamente y te habla en español perfecto.',
    situationEnglish: 'You are waiting at the crosswalk when your neighbor’s golden retriever looks straight at you and speaks in fluent Spanish.',
    promptSpeaker: 'El Perro Canelo',
    promptQuestion: '«Hola amigo, mi dueño siempre camina muy despacio. ¿Tienes planes divertidos este fin de semana?»',
    helpfulWords: [
      { es: '¡No puedo creer que hables!', en: 'I cannot believe you speak!' },
      { es: 'Voy a pasear al parque', en: 'I am going to walk in the park' },
      { es: 'Te traigo una pelota', en: 'I will bring you a ball' },
      { es: '¿A tu dueño le gusta el café?', en: 'Does your owner like coffee?' },
    ],
  },
];
