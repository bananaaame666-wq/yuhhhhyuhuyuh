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
    id: 'mateo',
    name: 'Mateo',
    age: 25,
    city: 'Bogotá',
    country: 'Colombia',
    flag: '🇨🇴',
    nativeLanguage: 'Spanish (Native)',
    learningLanguage: 'English',
    level: 'Elementary (A2)',
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-300',
    avatarEmoji: '☕',
    bio: 'Specialty coffee barista & mountain hiker. Learning English to connect with international travelers and origin roasters.',
    interests: ['Filter Coffee', 'Andean Trails', 'Cycling', 'Podcasts'],
    greeting: '¡Hola amigo! Let’s exchange stories—you practice your Spanish with me, and I’ll practice my English with you.',
  },
  {
    id: 'lucia',
    name: 'Lucía',
    age: 28,
    city: 'Seville',
    country: 'Spain',
    flag: '🇪🇸',
    nativeLanguage: 'Spanish (Native)',
    learningLanguage: 'English',
    level: 'Upper Intermediate (B2)',
    avatarBg: 'bg-rose-100 text-rose-800 border-rose-300',
    avatarEmoji: '🏛️',
    bio: 'Architectural heritage researcher & acoustic guitarist. Learning English to present at European symposiums.',
    interests: ['Mudejar Plazas', 'Flamenco Guitar', 'Photography', 'Tapas'],
    greeting: '¡Buenas tardes! Practicing together makes language learning feel natural rather than like a grammar exam.',
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
  mateo: [
    {
      id: 'mat-seed-1',
      sender: 'buddy',
      buddyId: 'mateo',
      text: '¡Hola! I just brewed a fresh pour-over coffee here in Bogotá. Are you having a good day so far?',
      language: 'en',
      translation: '¡Hola! Acabo de preparar un café filtrado aquí en Bogotá. ¿Estás teniendo un buen día hasta ahora?',
      timestamp: '09:30 AM',
    },
    {
      id: 'mat-seed-2',
      sender: 'user',
      buddyId: 'mateo',
      text: '¡Hola Mateo! Sí, hoy hace buen tiempo y estoy practicando un poco de español.',
      language: 'es',
      translation: "Demo translation · your buddy can help you polish it: 'Hello Mateo! Yes, the weather is nice today and I am practicing a bit of Spanish.'",
      timestamp: '09:34 AM',
    },
    {
      id: 'mat-seed-3',
      sender: 'buddy',
      buddyId: 'mateo',
      text: 'That is awesome! Coffee and language practice are the best morning ritual. What is your favorite morning drink?',
      language: 'en',
      translation: '¡Eso es genial! El café y la práctica de idiomas son el mejor ritual matutino. ¿Cuál es tu bebida matutina favorita?',
      timestamp: '09:36 AM',
    },
  ],
  lucia: [
    {
      id: 'luc-seed-1',
      sender: 'buddy',
      buddyId: 'lucia',
      text: '¡Buenas tardes! I am taking a short break from drafting historic arches in Seville. How is your day going?',
      language: 'en',
      translation: '¡Buenas tardes! Me estoy tomando un pequeño descanso de dibujar arcos históricos en Sevilla. ¿Cómo va tu día?',
      timestamp: '11:05 AM',
    },
    {
      id: 'luc-seed-2',
      sender: 'user',
      buddyId: 'lucia',
      text: '¡Hola Lucía! Todo bien por aquí. Me gusta mucho la arquitectura tradicional de España.',
      language: 'es',
      translation: "Demo translation · your buddy can help you polish it: 'Hello Lucía! All good around here. I really like traditional Spanish architecture.'",
      timestamp: '11:08 AM',
    },
    {
      id: 'luc-seed-3',
      sender: 'buddy',
      buddyId: 'lucia',
      text: 'Thank you! The historic courtyards here have so much character. Do you enjoy visiting historic buildings or nature spots more?',
      language: 'en',
      translation: '¡Gracias! Los patios históricos de aquí tienen mucho carácter. ¿Disfrutas más visitando edificios históricos o lugares en la naturaleza?',
      timestamp: '11:11 AM',
    },
  ],
};

export const CONVERSATION_STARTERS = [
  '¿Qué canción has escuchado mucho últimamente?',
  '¿Tienes alguna mascota o qué animal te gustaría tener?',
  '¿Cuál fue la comida más rica que probaste esta semana?',
  '¿Qué planes tienes para el próximo fin de semana?',
  '¿Qué lugar de tu país me recomiendas visitar algún día?',
  '¿Prefieres tomar café por la mañana o té por la tarde?',
];

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
    lower.includes('cantar')
  ) {
    return {
      text: `Music is honestly the most fun way to pick up slang and cadence! I've been looping Spanish acoustic playlists while working. What other music genres do you enjoy?`,
      translation: `¡La música es sinceramente la forma más divertida de aprender modismos y ritmo! He estado escuchando listas acústicas en español mientras trabajo. ¿Qué otros géneros musicales disfrutas?`,
    };
  }

  // 2. Pets / Animals topic
  if (
    lower.includes('perro') ||
    lower.includes('gato') ||
    lower.includes('mascota') ||
    lower.includes('animal') ||
    lower.includes('canelo')
  ) {
    return {
      text: `Pets bring so much positive energy into a home! Whenever I sit down to practice my English verbs, my pet curls up right next to me. Do they know any funny habits or tricks?`,
      translation: `¡Las mascotas traen tanta energía positiva al hogar! Cada vez que me siento a practicar mis verbos en inglés, mi mascota se acurruca justo a mi lado. ¿Tienen alguna costumbre o truco divertido?`,
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
    lower.includes('dia')
  ) {
    return {
      text: `¡Hola! It’s really great to chat with you today! The weather here in ${buddy.city} has been lovely. How is everything where you are?`,
      translation: `¡Hola! ¡Es realmente genial charlar contigo hoy! El clima aquí en ${buddy.city} ha estado encantador. ¿Cómo está todo por donde tú estás?`,
    };
  }

  // 4. Questions / Curiosity topic
  if (
    lower.includes('que') ||
    lower.includes('donde') ||
    lower.includes('por que') ||
    lower.includes('cual') ||
    lower.includes('quien') ||
    lower.includes('?')
  ) {
    return {
      text: `That is such a thoughtful question! In my hometown we have a saying: "Preguntando se llega a Roma" (asking questions leads you anywhere). I love how curious you are!`,
      translation: `¡Esa es una pregunta muy considerada! En mi tierra tenemos un dicho: "Preguntando se llega a Roma". ¡Me encanta lo curioso que eres!`,
    };
  }

  // 5. Food / Cooking topic
  if (
    lower.includes('comida') ||
    lower.includes('comer') ||
    lower.includes('tacos') ||
    lower.includes('cafe') ||
    lower.includes('cocinar') ||
    lower.includes('restaurante') ||
    lower.includes('cena') ||
    lower.includes('desayuno')
  ) {
    return {
      text: `Now you are making me hungry! Food is such a huge part of our culture here in ${buddy.country}. What is your go-to comfort meal when you want something delicious?`,
      translation: `¡Ahora me estás dando hambre! La comida es una parte enorme de nuestra cultura aquí en ${buddy.country}. ¿Cuál es tu comida reconfortante favorita cuando quieres algo delicioso?`,
    };
  }

  // 6. Weekend / Hobbies / Books / Travel
  if (
    lower.includes('fin de semana') ||
    lower.includes('sabado') ||
    lower.includes('domingo') ||
    lower.includes('viajar') ||
    lower.includes('libro') ||
    lower.includes('pelicula') ||
    lower.includes('parque')
  ) {
    return {
      text: `That sounds like a wonderful way to recharge. It takes courage to practice conversational Spanish after a long day, so kudos to you for showing up!`,
      translation: `Eso suena como una maravillosa forma de recargar energías. Se necesita valentía para practicar español conversacional después de un largo día, ¡así que felicitaciones por estar aquí!`,
    };
  }

  // 7. General Friendly Fallback
  return {
    text: `¡Muchas gracias! Your Spanish sentence came across clearly and naturally. Keep this momentum going—practicing a little bit every single day really adds up fast!`,
    translation: `¡Muchas gracias! Tu frase en español se entendió clara y naturalmente. ¡Mantén este ritmo; practicar un poquito cada día realmente suma rápido!`,
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
