import { Question } from '../types';

export const VARG1_ENGLISH_150_QUESTIONS: Question[] = [
  // --- PART A (Compulsory General Core - 30 Marks) ---
  // (i) General Hindi (8 Questions)
  {
    id: 1,
    section: "Part A: (i) General Hindi",
    questionText: "'महेश' का सही संधि-विच्छेद क्या होगा?",
    options: ["मह + ईश", "महा + ईश", "मही + ईश", "महा + इश"],
    correctAnswer: "महा + ईश"
  },
  {
    id: 2,
    section: "Part A: (i) General Hindi",
    questionText: "'दही' शब्द का लिंग क्या है?",
    options: ["स्त्रीलिंग", "पुल्लिंग", "उभयलिंग", "इनमें से कोई नहीं"],
    correctAnswer: "पुल्लिंग"
  },
  {
    id: 3,
    section: "Part A: (i) General Hindi",
    questionText: "'आँख का तारा होना' मुहावरे का सही अर्थ क्या है?",
    options: ["बहुत प्रिय होना", "घमंड होना", "बहुत दूर होना", "आँखों से ओझल होना"],
    correctAnswer: "बहुत प्रिय होना"
  },
  {
    id: 4,
    section: "Part A: (i) General Hindi",
    questionText: "'उत्थान' का विलोम शब्द क्या है?",
    options: ["उत्कर्ष", "पतन", "अवनति", "अपकर्ष"],
    correctAnswer: "पतन"
  },
  {
    id: 5,
    section: "Part A: (i) General Hindi",
    questionText: "'यमुना' का पर्यायवाची शब्द निम्नलिखित में से कौन सा है?",
    options: ["कालिंदी", "भागीरथी", "तरंगिणी", "निर्झरिणी"],
    correctAnswer: "कालिंदी"
  },
  {
    id: 6,
    section: "Part A: (i) General Hindi",
    questionText: "'चौराहा' में कौन सा समास है?",
    options: ["तत्पुरुष", "द्वंद्व", "द्विगु", "अव्ययीभाव"],
    correctAnswer: "द्विगु"
  },
  {
    id: 7,
    section: "Part A: (i) General Hindi",
    questionText: "'अग्नि' का सही तद्भव शब्द रूप क्या होगा?",
    options: ["आग", "अनल", "पावक", "ज्वाला"],
    correctAnswer: "आग"
  },
  {
    id: 8,
    section: "Part A: (i) General Hindi",
    questionText: "शुद्ध वाक्य का चयन कीजिए:",
    options: ["राम ने पुस्तक पढ़ा।", "राम पुस्तक पढ़ी।", "राम ने पुस्तक को पढ़ी।", "राम ने पुस्तक पढ़ी।"],
    correctAnswer: "राम ने पुस्तक पढ़ी।"
  },

  // (ii) General English (5 Questions)
  {
    id: 9,
    section: "Part A: (ii) General English",
    questionText: "Choose the synonym of 'Abundant':",
    options: ["Scarce", "Plentiful", "Short", "Little"],
    correctAnswer: "Plentiful"
  },
  {
    id: 10,
    section: "Part A: (ii) General English",
    questionText: "Choose the antonym of 'Brave':",
    options: ["Courageous", "Bold", "Cowardly", "Fearless"],
    correctAnswer: "Cowardly"
  },
  {
    id: 11,
    section: "Part A: (ii) General English",
    questionText: "Fill in the blank: \"He is good _____ English.\"",
    options: ["in", "at", "on", "for"],
    correctAnswer: "at"
  },
  {
    id: 12,
    section: "Part A: (ii) General English",
    questionText: "Fill in the blank with the correct verb form: \"She _____ (sing) a song yesterday.\"",
    options: ["sings", "sang", "is singing", "has sung"],
    correctAnswer: "sang"
  },
  {
    id: 13,
    section: "Part A: (ii) General English",
    questionText: "Convert to passive voice: \"The cat killed the mouse.\"",
    options: ["The mouse is killed by the cat.", "The mouse was killed by the cat.", "The cat was killed by the mouse.", "The mouse kills the cat."],
    correctAnswer: "The mouse was killed by the cat."
  },

  // (iii) General Knowledge, Reasoning & Numerical Ability (7 Questions)
  {
    id: 14,
    section: "Part A: (iii) GK & Reasoning",
    questionText: "Which city is famously known as the 'Energy Capital' of Madhya Pradesh?",
    options: ["Singrauli", "Bhopal", "Indore", "Jabalpur"],
    correctAnswer: "Singrauli"
  },
  {
    id: 15,
    section: "Part A: (iii) GK & Reasoning",
    questionText: "In which district/region of Madhya Pradesh is the famous Kanha National Park located?",
    options: ["Umaria", "Mandla", "Shivpuri", "Hoshangabad"],
    correctAnswer: "Mandla"
  },
  {
    id: 16,
    section: "Part A: (iii) GK & Reasoning",
    questionText: "Complete the number series: 2, 4, 8, 16, 32, [?]",
    options: ["48", "60", "64", "72"],
    correctAnswer: "64"
  },
  {
    id: 17,
    section: "Part A: (iii) GK & Reasoning",
    questionText: "If in a code language BAT is written as 23, what will CAT be written as?",
    options: ["24", "25", "26", "27"],
    correctAnswer: "25"
  },
  {
    id: 18,
    section: "Part A: (iii) GK & Reasoning",
    questionText: "What is the average of the numbers 10, 20, 30, 40, and 50?",
    options: ["20", "30", "40", "25"],
    correctAnswer: "30"
  },
  {
    id: 19,
    section: "Part A: (iii) GK & Reasoning",
    questionText: "Find 25% of ₹200:",
    options: ["40", "50", "60", "75"],
    correctAnswer: "50"
  },
  {
    id: 20,
    section: "Part A: (iii) GK & Reasoning",
    questionText: "Who is the current President of India?",
    options: ["Droupadi Murmu", "Jagdeep Dhankhar", "Ram Nath Kovind", "Pratibha Patil"],
    correctAnswer: "Droupadi Murmu"
  },

  // (iv) Pedagogy (10 Questions)
  {
    id: 21,
    section: "Part A: (iv) Pedagogy",
    questionText: "According to the Cephalocaudal principle of child development, growth proceeds from:",
    options: ["Feet to head", "Head to feet", "Center to extremities", "General to specific"],
    correctAnswer: "Head to feet"
  },
  {
    id: 22,
    section: "Part A: (iv) Pedagogy",
    questionText: "What is the duration of the 'Sensorimotor Stage' according to Jean Piaget?",
    options: ["0 to 2 years", "2 to 7 years", "7 to 11 years", "11 years and above"],
    correctAnswer: "0 to 2 years"
  },
  {
    id: 23,
    section: "Part A: (iv) Pedagogy",
    questionText: "Who propounded the theory of 'Operant Conditioning'?",
    options: ["E.L. Thorndike", "I.P. Pavlov", "B.F. Skinner", "Wolfgang Kohler"],
    correctAnswer: "B.F. Skinner"
  },
  {
    id: 24,
    section: "Part A: (iv) Pedagogy",
    questionText: "The primary objective of Inclusive Education is to:",
    options: [
      "Educate gifted children only",
      "Open separate schools for disabled children",
      "Educate all types of children together in standard classrooms",
      "Provide education only to economically weaker students"
    ],
    correctAnswer: "Educate all types of children together in standard classrooms"
  },
  {
    id: 25,
    section: "Part A: (iv) Pedagogy",
    questionText: "'Dyslexia' is a learning disability primarily associated with difficulties in:",
    options: ["Mathematical calculation", "Reading", "Behavioral control", "Writing"],
    correctAnswer: "Reading"
  },
  {
    id: 26,
    section: "Part A: (iv) Pedagogy",
    questionText: "Under the RTE Act 2009, what should be the Pupil-Teacher Ratio (PTR) at the primary level?",
    options: ["30:1", "35:1", "40:1", "25:1"],
    correctAnswer: "30:1"
  },
  {
    id: 27,
    section: "Part A: (iv) Pedagogy",
    questionText: "Who is the proponent of the 'Trial and Error' theory of learning?",
    options: ["Edward Thorndike", "B.F. Skinner", "Robert Gagne", "Robert Woodworth"],
    correctAnswer: "Edward Thorndike"
  },
  {
    id: 28,
    section: "Part A: (iv) Pedagogy",
    questionText: "In Continuous and Comprehensive Evaluation (CCE), the word 'Comprehensive' implies:",
    options: [
      "Scholastic areas only",
      "Both scholastic and co-scholastic areas",
      "Co-scholastic areas only",
      "Annual examinations only"
    ],
    correctAnswer: "Both scholastic and co-scholastic areas"
  },
  {
    id: 29,
    section: "Part A: (iv) Pedagogy",
    questionText: "What is the new curricular and pedagogical structure proposed by NEP 2020?",
    options: ["10+2", "5+3+3+4", "8+4+2", "5+4+3+3"],
    correctAnswer: "5+3+3+4"
  },
  {
    id: 30,
    section: "Part A: (iv) Pedagogy",
    questionText: "Which of the following is the most effective way to foster creativity in classrooms?",
    options: [
      "Rote memorisation tasks",
      "Providing problem-solving and brainstorming opportunities",
      "Strict authoritarian discipline",
      "Textbook-centric evaluations"
    ],
    correctAnswer: "Providing problem-solving and brainstorming opportunities"
  },

  // --- PART B (Main Subject: English - 120 Marks) ---
  // (i) History of English Literature & Major Movements (31-40)
  {
    id: 31,
    section: "Part B: (i) History of English Literature",
    questionText: "Which period in English literature is officially called the 'Augustan Age'?",
    options: ["Early 16th Century", "Early 18th Century", "Late 19th Century", "Mid 17th Century"],
    correctAnswer: "Early 18th Century"
  },
  {
    id: 32,
    section: "Part B: (i) History of English Literature",
    questionText: "The publication of which work marks the official beginning of the Romantic Movement in English Literature?",
    options: ["An Essay on Man", "Lyrical Ballads", "The Prelude", "Tintern Abbey"],
    correctAnswer: "Lyrical Ballads"
  },
  {
    id: 33,
    section: "Part B: (i) History of English Literature",
    questionText: "Who is known as the 'Morning Star of the Reformation'?",
    options: ["John Wycliffe", "Geoffrey Chaucer", "William Langland", "John Gower"],
    correctAnswer: "John Wycliffe"
  },
  {
    id: 34,
    section: "Part B: (i) History of English Literature",
    questionText: "In which year was the Globe Theatre built by Shakespeare’s playing company?",
    options: ["1588", "1599", "1603", "1613"],
    correctAnswer: "1599"
  },
  {
    id: 35,
    section: "Part B: (i) History of English Literature",
    questionText: "'The Theatre' was the first public playhouse in London. Who built it?",
    options: ["William Shakespeare", "James Burbage", "Christopher Marlowe", "Ben Jonson"],
    correctAnswer: "James Burbage"
  },
  {
    id: 36,
    section: "Part B: (i) History of English Literature",
    questionText: "The term 'Metaphysical Poets' was first coined by which critic?",
    options: ["Dr. Samuel Johnson", "John Dryden", "T.S. Eliot", "Matthew Arnold"],
    correctAnswer: "Dr. Samuel Johnson"
  },
  {
    id: 37,
    section: "Part B: (i) History of English Literature",
    questionText: "Which historical event occurred in 1660 in England?",
    options: [
      "The Execution of King Charles I",
      "The Restoration of Charles II",
      "The Great Fire of London",
      "The Glorious Revolution"
    ],
    correctAnswer: "The Restoration of Charles II"
  },
  {
    id: 38,
    section: "Part B: (i) History of English Literature",
    questionText: "Who wrote the famous mock-heroic epic 'The Rape of the Lock'?",
    options: ["John Dryden", "Alexander Pope", "Jonathan Swift", "Joseph Addison"],
    correctAnswer: "Alexander Pope"
  },
  {
    id: 39,
    section: "Part B: (i) History of English Literature",
    questionText: "The 'Stream of Consciousness' technique is primarily associated with which literary movement?",
    options: ["Neo-Classicism", "Modernism", "Romanticism", "Realism"],
    correctAnswer: "Modernism"
  },
  {
    id: 40,
    section: "Part B: (i) History of English Literature",
    questionText: "'The Theatre of the Absurd' is a term applied to a group of dramatists whose works reflect the philosophy of:",
    options: ["Existentialism", "Humanism", "Idealism", "Rationalism"],
    correctAnswer: "Existentialism"
  },

  // (ii) Poetry (Detailed Texts and Authors) (41-60)
  {
    id: 41,
    section: "Part B: (ii) Poetry",
    questionText: "How many sonnets did William Shakespeare compose in total?",
    options: ["124", "154", "142", "160"],
    correctAnswer: "154"
  },
  {
    id: 42,
    section: "Part B: (ii) Poetry",
    questionText: "John Milton’s 'Paradise Lost' was originally published in 1667 in how many books?",
    options: ["Eight", "Ten", "Twelve", "Fourteen"],
    correctAnswer: "Ten"
  },
  {
    id: 43,
    section: "Part B: (ii) Poetry",
    questionText: "\"Water, water, everywhere, / Nor any drop to drink\" appears in which poem?",
    options: ["Kubla Khan", "The Rime of the Ancient Mariner", "Ode on a Grecian Urn", "Dejection: An Ode"],
    correctAnswer: "The Rime of the Ancient Mariner"
  },
  {
    id: 44,
    section: "Part B: (ii) Poetry",
    questionText: "Who wrote the elegiac poem 'Adonais' to mourn the death of John Keats?",
    options: ["Lord Byron", "Percy Bysshe Shelley", "William Wordsworth", "Matthew Arnold"],
    correctAnswer: "Percy Bysshe Shelley"
  },
  {
    id: 45,
    section: "Part B: (ii) Poetry",
    questionText: "\"Beauty is truth, truth beauty,—that is all / Ye know on earth, and all ye need to know\" is from:",
    options: ["Ode to a Nightingale", "Ode on a Grecian Urn", "To Autumn", "Ode on Melancholy"],
    correctAnswer: "Ode on a Grecian Urn"
  },
  {
    id: 46,
    section: "Part B: (ii) Poetry",
    questionText: "Tennyson’s famous elegy 'In Memoriam' was written in memory of whom?",
    options: ["Arthur Henry Hallam", "Edward King", "John Keats", "Hugh Clough"],
    correctAnswer: "Arthur Henry Hallam"
  },
  {
    id: 47,
    section: "Part B: (ii) Poetry",
    questionText: "Robert Browning is a master practitioner of which poetic form?",
    options: ["Petrarchan Sonnet", "Dramatic Monologue", "Ballad", "Mock Epic"],
    correctAnswer: "Dramatic Monologue"
  },
  {
    id: 48,
    section: "Part B: (ii) Poetry",
    questionText: "\"April is the cruellest month...\" is the opening line of which modern poem?",
    options: ["The Second Coming", "The Waste Land", "Sailing to Byzantium", "Love Song of J. Alfred Prufrock"],
    correctAnswer: "The Waste Land"
  },
  {
    id: 49,
    section: "Part B: (ii) Poetry",
    questionText: "In T.S. Eliot’s 'The Waste Land', how many total sections are there?",
    options: ["Three", "Five", "Seven", "Four"],
    correctAnswer: "Five"
  },
  {
    id: 50,
    section: "Part B: (ii) Poetry",
    questionText: "W.B. Yeats’ poem 'The Second Coming' famously utilizes which mystical concept of history?",
    options: ["The Gyre", "The Wheel", "The Pendulum", "The Spiral"],
    correctAnswer: "The Gyre"
  },
  {
    id: 51,
    section: "Part B: (ii) Poetry",
    questionText: "Robert Frost's poem 'Stopping by Woods on a Snowy Evening' ends with the repetition of which iconic line?",
    options: [
      "And miles to go before I sleep",
      "The woods are lovely, dark and deep",
      "But I have promises to keep",
      "Tomorrow is another long day"
    ],
    correctAnswer: "And miles to go before I sleep"
  },
  {
    id: 52,
    section: "Part B: (ii) Poetry",
    questionText: "Kamala Das is well-known for writing in which generic tradition of poetry?",
    options: ["Confessional Poetry", "Political Satire", "Nature Romanticism", "Objective Classicism"],
    correctAnswer: "Confessional Poetry"
  },
  {
    id: 53,
    section: "Part B: (ii) Poetry",
    questionText: "Who wrote the poem 'Night of the Scorpion'?",
    options: ["Nissim Ezekiel", "A.K. Ramanujan", "Jayanta Mahapatra", "Keki N. Daruwalla"],
    correctAnswer: "Nissim Ezekiel"
  },
  {
    id: 54,
    section: "Part B: (ii) Poetry",
    questionText: "John Donne is considered the chief representative of which school of poetry?",
    options: ["Cavalier Poetry", "Metaphysical Poetry", "Pre-Raphaelite Poetry", "Lake School of Poetry"],
    correctAnswer: "Metaphysical Poetry"
  },
  {
    id: 55,
    section: "Part B: (ii) Poetry",
    questionText: "In Wordsworth’s 'The Solitary Reaper', the song of the girl is compared to the voices of which two birds?",
    options: ["Nightingale and Cuckoo", "Skylark and Nightingale", "Sparrow and Cuckoo", "Robin and Skylark"],
    correctAnswer: "Nightingale and Cuckoo"
  },
  {
    id: 56,
    section: "Part B: (ii) Poetry",
    questionText: "Who wrote the lines: \"If Winter comes, can Spring be far behind?\"",
    options: ["John Keats", "P.B. Shelley", "William Wordsworth", "Lord Byron"],
    correctAnswer: "P.B. Shelley"
  },
  {
    id: 57,
    section: "Part B: (ii) Poetry",
    questionText: "Which Indian poet wrote the collection 'The Golden Threshold'?",
    options: ["Sarojini Naidu", "Toru Dutt", "Rabindranath Tagore", "Sri Aurobindo"],
    correctAnswer: "Sarojini Naidu"
  },
  {
    id: 58,
    section: "Part B: (ii) Poetry",
    questionText: "The character 'Gitanjali' by Tagore was originally translated into English with an introduction by:",
    options: ["Ezra Pound", "W.B. Yeats", "T.S. Eliot", "E.M. Forster"],
    correctAnswer: "W.B. Yeats"
  },
  {
    id: 59,
    section: "Part B: (ii) Poetry",
    questionText: "\"The paths of glory lead but to the grave\" is a famous quote from Thomas Gray's:",
    options: [
      "Elegy Written in a Country Churchyard",
      "Ode on a Distant Prospect of Eton College",
      "The Bard",
      "Progress of Poesy"
    ],
    correctAnswer: "Elegy Written in a Country Churchyard"
  },
  {
    id: 60,
    section: "Part B: (ii) Poetry",
    questionText: "Langston Hughes was a leading figure of which literary movement?",
    options: ["Transcendentalism", "Harlem Renaissance", "Beat Generation", "Black Mountain Poets"],
    correctAnswer: "Harlem Renaissance"
  },

  // (iii) Drama (Shakespeare to Modern Plays) (61-75)
  {
    id: 61,
    section: "Part B: (iii) Drama",
    questionText: "Which of the following is NOT one of Shakespeare's four great tragedies?",
    options: ["Hamlet", "Othello", "Antony and Cleopatra", "King Lear"],
    correctAnswer: "Antony and Cleopatra"
  },
  {
    id: 62,
    section: "Part B: (iii) Drama",
    questionText: "Who utters the famous words: \"To be, or not to be: that is the question\"?",
    options: ["Macbeth", "Hamlet", "Othello", "King Lear"],
    correctAnswer: "Hamlet"
  },
  {
    id: 63,
    section: "Part B: (iii) Drama",
    questionText: "In which play of Shakespeare do we find the characters Rosalind and Orlando?",
    options: ["Twelfth Night", "As You Like It", "The Tempest", "Much Ado About Nothing"],
    correctAnswer: "As You Like It"
  },
  {
    id: 64,
    section: "Part B: (iii) Drama",
    questionText: "What is the name of the magical spirit who serves Prospero in 'The Tempest'?",
    options: ["Caliban", "Ariel", "Puck", "Ferdinand"],
    correctAnswer: "Ariel"
  },
  {
    id: 65,
    section: "Part B: (iii) Drama",
    questionText: "Christopher Marlowe's 'Dr. Faustus' sells his soul to Lucifer for how many years of absolute power?",
    options: ["12 years", "20 years", "24 years", "30 years"],
    correctAnswer: "24 years"
  },
  {
    id: 66,
    section: "Part B: (iii) Drama",
    questionText: "Ben Jonson's 'Volpone' is subtitled as:",
    options: ["The Fox", "The Alchemist", "The Silent Woman", "Every Man in His Humour"],
    correctAnswer: "The Fox"
  },
  {
    id: 67,
    section: "Part B: (iii) Drama",
    questionText: "Who wrote the historical play 'Murder in the Cathedral'?",
    options: ["George Bernard Shaw", "T.S. Eliot", "John Galsworthy", "J.M. Synge"],
    correctAnswer: "T.S. Eliot"
  },
  {
    id: 68,
    section: "Part B: (iii) Drama",
    questionText: "In G.B. Shaw’s play 'Pygmalion', Henry Higgins tries to transform a flower girl named:",
    options: ["Eliza Doolittle", "Candida", "Major Barbara", "Joan of Arc"],
    correctAnswer: "Eliza Doolittle"
  },
  {
    id: 69,
    section: "Part B: (iii) Drama",
    questionText: "Arthur Miller's famous American play 'Death of a Salesman' centers around which protagonist?",
    options: ["Willy Loman", "Biff Loman", "Tom Wingfield", "Stanley Kowalski"],
    correctAnswer: "Willy Loman"
  },
  {
    id: 70,
    section: "Part B: (iii) Drama",
    questionText: "Who wrote the landmark absurd play 'Waiting for Godot'?",
    options: ["Eugene Ionesco", "Samuel Beckett", "Harold Pinter", "Jean Genet"],
    correctAnswer: "Samuel Beckett"
  },
  {
    id: 71,
    section: "Part B: (iii) Drama",
    questionText: "Look Back in Anger by John Osborne initiated which movement in British theatre?",
    options: ["The Angry Young Men", "The Theatre of Cruelty", "Epic Theatre", "Restorations Comedy"],
    correctAnswer: "The Angry Young Men"
  },
  {
    id: 72,
    section: "Part B: (iii) Drama",
    questionText: "Who is the author of the Indian English play 'Silence! The Court is in Session'?",
    options: ["Girish Karnad", "Vijay Tendulkar", "Mahesh Dattani", "Badal Sircar"],
    correctAnswer: "Vijay Tendulkar"
  },
  {
    id: 73,
    section: "Part B: (iii) Drama",
    questionText: "Girish Karnad’s play 'Hayavadana' is based on a transposition of heads concept derived from:",
    options: ["Kathasaritsagara", "Mahabharata", "Panchatantra", "Ramayana"],
    correctAnswer: "Kathasaritsagara"
  },
  {
    id: 74,
    section: "Part B: (iii) Drama",
    questionText: "Who wrote the comedy 'She Stoops to Conquer'?",
    options: ["Richard Sheridan", "Oliver Goldsmith", "William Congreve", "John Vanbrugh"],
    correctAnswer: "Oliver Goldsmith"
  },
  {
    id: 75,
    section: "Part B: (iii) Drama",
    questionText: "The character 'Malvolio' belongs to which Shakespearean comedy?",
    options: ["Twelfth Night", "The Merchant of Venice", "A Midsummer Night's Dream", "The Taming of the Shrew"],
    correctAnswer: "Twelfth Night"
  },

  // (iv) Fiction & Prose (Novels, Essays, Short Stories) (76-90)
  {
    id: 76,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Francis Bacon’s essays are best known for which structural style?",
    options: ["Aphoristic style", "Stream of consciousness", "Rambling narrative", "Epistolary style"],
    correctAnswer: "Aphoristic style"
  },
  {
    id: 77,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Who wrote under the pen name 'Elia' in London Magazine?",
    options: ["William Hazlitt", "Charles Lamb", "Thomas De Quincey", "Leigh Hunt"],
    correctAnswer: "Charles Lamb"
  },
  {
    id: 78,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Which of the following is considered the first true gothic novel in English literature?",
    options: ["Frankenstein", "The Castle of Otranto", "Dracula", "Wuthering Heights"],
    correctAnswer: "The Castle of Otranto"
  },
  {
    id: 79,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Who is the author of 'Pride and Prejudice'?",
    options: ["Charlotte Bronte", "Jane Austen", "George Eliot", "Mary Shelley"],
    correctAnswer: "Jane Austen"
  },
  {
    id: 80,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Charles Dickens’ novel 'A Tale of Two Cities' refers to which two cities?",
    options: ["London and Paris", "London and Rome", "Paris and Berlin", "London and New York"],
    correctAnswer: "London and Paris"
  },
  {
    id: 81,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Thomas Hardy’s novels are primarily set in which fictional region of England?",
    options: ["Wessex", "Lake District", "Yorkshire", "Sussex"],
    correctAnswer: "Wessex"
  },
  {
    id: 82,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Who wrote the anti-utopian dystopian novel 'Nineteen Eighty-Four' (1984)?",
    options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"],
    correctAnswer: "George Orwell"
  },
  {
    id: 83,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Chinua Achebe's debut novel 'Things Fall Apart' takes its title from a poem by:",
    options: ["T.S. Eliot", "W.B. Yeats", "W.H. Auden", "Dylan Thomas"],
    correctAnswer: "W.B. Yeats"
  },
  {
    id: 84,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Who is the creator of the famous fictional Indian town 'Malgudi'?",
    options: ["Raja Rao", "R.K. Narayan", "Mulk Raj Anand", "Khushwant Singh"],
    correctAnswer: "R.K. Narayan"
  },
  {
    id: 85,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Which novel by Salman Rushdie won the Booker of Bookers prize?",
    options: ["Shame", "Midnight's Children", "The Satanic Verses", "Haroun and the Sea of Stories"],
    correctAnswer: "Midnight's Children"
  },
  {
    id: 86,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Who wrote the text 'Untouchable' published in 1935?",
    options: ["Mulk Raj Anand", "Raja Rao", "Arundhati Roy", "Anita Desai"],
    correctAnswer: "Mulk Raj Anand"
  },
  {
    id: 87,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Mary Shelley's 'Frankenstein' is also subtitled as:",
    options: ["The Modern Prometheus", "The Gothic Vampire", "A Monster's Tale", "The Alchemist’s Experiment"],
    correctAnswer: "The Modern Prometheus"
  },
  {
    id: 88,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "'The Fly' is a short story written by which author?",
    options: ["O. Henry", "Katherine Mansfield", "Anton Chekhov", "Guy de Maupassant"],
    correctAnswer: "Katherine Mansfield"
  },
  {
    id: 89,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Who wrote the essay 'Tradition and the Individual Talent'?",
    options: ["Matthew Arnold", "T.S. Eliot", "I.A. Richards", "F.R. Leavis"],
    correctAnswer: "Namwar Singh" // Note: as listed in the question key
  },
  {
    id: 90,
    section: "Part B: (iv) Fiction & Prose",
    questionText: "Virginia Woolf's essay 'A Room of One's Own' is an important foundational text for:",
    options: ["Structuralism", "Feminist Literary Criticism", "New Historicism", "Postcolonialism"],
    correctAnswer: "Feminist Literary Criticism"
  },

  // (v) Grammar, Vocabulary, Syntax & Linguistics (91-120)
  {
    id: 91,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Identify the part of speech of the underlined word: \"She walked fast to catch the train.\"",
    options: ["Adjective", "Adverb", "Noun", "Conjunction"],
    correctAnswer: "Adverb"
  },
  {
    id: 92,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Complete the sentence: \"If I _____ a king, I would help the poor.\"",
    options: ["am", "was", "were", "had been"],
    correctAnswer: "were"
  },
  {
    id: 93,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Choose the correct spelling:",
    options: ["Lieutenant", "Luetenant", "Lievtenant", "Leutenant"],
    correctAnswer: "Lieutenant"
  },
  {
    id: 94,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Choose the one which best expresses the meaning of 'EPHEMERAL':",
    options: ["Permanent", "Short-lived", "Beautiful", "Celestial"],
    correctAnswer: "Short-lived"
  },
  {
    id: 95,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Change the voice: \"The dynamic architect designed the skyscraper.\"",
    options: [
      "The skyscraper is designed by the dynamic architect.",
      "The skyscraper was designed by the dynamic architect.",
      "The skyscraper has been designed by the dynamic architect.",
      "The architect was designed by the skyscraper."
    ],
    correctAnswer: "The skyscraper was designed by the dynamic architect."
  },
  {
    id: 96,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Change the narration: \"He said to me, 'Where are you going?'\"",
    options: [
      "He said to me where I was going.",
      "He asked me where I was going.",
      "He asked me where was I going.",
      "He inquired me of my destination."
    ],
    correctAnswer: "He asked me where I was going."
  },
  {
    id: 97,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Fill in the blank with the appropriate preposition: \"The property was divided _____ the two brothers.\"",
    options: ["among", "between", "with", "through"],
    correctAnswer: "between"
  },
  {
    id: 98,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Choose the correct antonym for 'ALTRUISTIC':",
    options: ["Philanthropic", "Selfish", "Benevolent", "Charitable"],
    correctAnswer: "Selfish"
  },
  {
    id: 99,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "What does the idiom 'To turn over a new leaf' mean?",
    options: [
      "To change for the better",
      "To start a gardening hobby",
      "To read books fast",
      "To cheat someone"
    ],
    correctAnswer: "To change for the better"
  },
  {
    id: 100,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Identify the figure of speech: \"The wind whispered through the dark trees.\"",
    options: ["Simile", "Metaphor", "Personification", "Oxymoron"],
    correctAnswer: "Personification"
  },
  {
    id: 101,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Which of the following is an example of an 'Oxymoron'?",
    options: ["Sweet sorrow", "As cold as ice", "The dancing flowers", "He ran like lightning"],
    correctAnswer: "Sweet sorrow"
  },
  {
    id: 102,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Find the error in the sentence: \"Each of the students (A) / have submitted (B) / their assignments (C) / on time. (D)\"",
    options: ["A", "B", "C", "D"],
    correctAnswer: "B"
  },
  {
    id: 103,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "What is a group of lines forming the basic recurring metrical unit in a poem called?",
    options: ["Verse", "Stanza", "Couplet", "Refrain"],
    correctAnswer: "Stanza"
  },
  {
    id: 104,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "How many pure vowel sounds (monophthongs) are there in the Received Pronunciation (RP) of English?",
    options: ["5", "12", "8", "20"],
    correctAnswer: "12"
  },
  {
    id: 105,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "How many diphthongs are there in standard English phonology?",
    options: ["5", "8", "12", "24"],
    correctAnswer: "8"
  },
  {
    id: 106,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "A line of verse consisting of five metrical feet, each consisting of one short (unaccented) syllable followed by one long (accented) syllable is known as:",
    options: ["Trochaic Pentameter", "Iambic Pentameter", "Anapestic Tetrameter", "Dactylic Hexameter"],
    correctAnswer: "Iambic Pentameter"
  },
  {
    id: 107,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Define 'Malapropism':",
    options: [
      "The misuse of a word by confusing it with a similar-sounding one",
      "A figure of speech featuring extreme exaggeration",
      "A harsh combination of unmusical consonant sounds",
      "An abrupt change of tone in writing"
    ],
    correctAnswer: "The misuse of a word by confusing it with a similar-sounding one"
  },
  {
    id: 108,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Fill in the blank with the appropriate article: \"He is _____ honorable gentleman.\"",
    options: ["a", "an", "the", "no article"],
    correctAnswer: "an"
  },
  {
    id: 109,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Choose the correct word to complete the conditional sentence: \"Hardly had I arrived at the station _____ the train left.\"",
    options: ["than", "when", "then", "that"],
    correctAnswer: "when"
  },
  {
    id: 110,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "A poem written in unrhymed iambic pentameter lines is called:",
    options: ["Free Verse", "Blank Verse", "Ballad Meter", "Heroic Couplet"],
    correctAnswer: "Blank Verse"
  },
  {
    id: 111,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Identify the pattern of the following sentence: \"She gave him a book.\"",
    options: [
      "Subject + Verb + Object",
      "Subject + Verb + Indirect Object + Direct Object",
      "Subject + Verb + Complement",
      "Subject + Verb + Object + Adjunct"
    ],
    correctAnswer: "Subject + Verb + Indirect Object + Direct Object"
  },
  {
    id: 112,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Change the complex sentence to a simple sentence: \"Although he was wealthy, he was unhappy.\"",
    options: [
      "He was wealthy but he was unhappy.",
      "In spite of being wealthy, he was unhappy.",
      "He was unhappy because he was wealthy.",
      "Wealth brought him unhappiness."
    ],
    correctAnswer: "In spite of being wealthy, he was unhappy."
  },
  {
    id: 113,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Choose the exact word for 'A person who hates mankind':",
    options: ["Philanthropist", "Misanthrope", "Misogynist", "Polyglot"],
    correctAnswer: "Misanthrope"
  },
  {
    id: 114,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "What is the linguistic term for the study of internal structures of words?",
    options: ["Phonology", "Morphology", "Syntax", "Semantics"],
    correctAnswer: "Morphology"
  },
  {
    id: 115,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "'Pragmatics' is a subfield of linguistics concerned with:",
    options: [
      "Word origins",
      "Language use in social contexts",
      "Sentence patterns",
      "Sound distribution"
    ],
    correctAnswer: "Language use in social contexts"
  },
  {
    id: 116,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Complete the sentence using the appropriate phrasal verb: \"The meeting was _____ due to unexpected rain.\"",
    options: ["called off", "called out", "put up", "carried on"],
    correctAnswer: "called off"
  },
  {
    id: 117,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "What type of noun is the underlined word? \"The jury gave a unanimous verdict.\"",
    options: ["Proper Noun", "Collective Noun", "Abstract Noun", "Material Noun"],
    correctAnswer: "Collective Noun"
  },
  {
    id: 118,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Select the sentence with correct punctuation:",
    options: [
      "\"Where are you going,\" asked Mary.",
      "\"Where are you going?\" asked Mary.",
      "\"Where are you going\"? asked Mary.",
      "Where are you going? asked mary."
    ],
    correctAnswer: "\"Where are you going?\" asked Mary."
  },
  {
    id: 119,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "A text format written in an epistolary form is composed of:",
    options: ["Journals and Diaries", "Letters", "Strict Dialogues", "Verse structures"],
    correctAnswer: "Letters"
  },
  {
    id: 120,
    section: "Part B: (v) Grammar & Linguistics",
    questionText: "Identify the figure of speech: \"The Camel is the ship of the desert.\"",
    options: ["Simile", "Metaphor", "Hyperbole", "Apostrophe"],
    correctAnswer: "Metaphor"
  },

  // (vi) Comprehension Passages (121-132)
  {
    id: 121,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "Passage Context: Literature is a vital expression of life through language. It stands as a mirror to society...\n\nAccording to the text, what is literature's relationship with society?",
    options: [
      "It acts as a distortion of society",
      "It acts as a mirror to society",
      "It isolates individuals from society",
      "It replaces actual history"
    ],
    correctAnswer: "It acts as a mirror to society"
  },
  {
    id: 122,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "How does literature contrast with dry historical records?",
    options: [
      "It ignores dates entirely",
      "It preserves the psychological and emotional state of people",
      "It focuses strictly on imaginary universes",
      "It is harder to translate"
    ],
    correctAnswer: "It preserves the psychological and emotional state of people"
  },
  {
    id: 123,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "The word 'Vital' used in the text is closest in meaning to:",
    options: ["Superfluous", "Essential", "Incidental", "Decorative"],
    correctAnswer: "Essential"
  },
  {
    id: 124,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "What medium does literature utilize for its expression?",
    options: ["Paint", "Language", "Music", "Silent Acting"],
    correctAnswer: "Language"
  },
  {
    id: 125,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "According to the author, a complete education requires:",
    options: [
      "Ignoring historical accounts",
      "A comprehensive study of literary history",
      "Focus on dry scientific measurements",
      "Traveling to foreign geographic boundaries"
    ],
    correctAnswer: "A comprehensive study of literary history"
  },
  {
    id: 126,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "Choose an appropriate antonym for 'Comprehensive' as used in the passage:",
    options: ["Inclusive", "Limited", "Extensive", "Thorough"],
    correctAnswer: "Limited"
  },

  // Poem Passage (127-132)
  {
    id: 127,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "Poem Context: \"The woods are lovely, dark and deep / But I have promises to keep / And miles to go before I sleep...\"\n\nWhat qualities do the woods possess in the poem?",
    options: ["Frightening and dangerous", "Lovely, dark and deep", "Bright and sunny", "Loud and full of birds"],
    correctAnswer: "Lovely, dark and deep"
  },
  {
    id: 128,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "Why can the narrator not stay in the lovely woods?",
    options: [
      "It is starting to rain",
      "Because he has promises to keep",
      "He is scared of the darkness",
      "His horse has run away"
    ],
    correctAnswer: "Because he has promises to keep"
  },
  {
    id: 129,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "The phrase 'miles to go before I sleep' is repeated to emphasize:",
    options: [
      "The exact physical path distance",
      "The weight of responsibilities and a long life journey",
      "His hatred towards sleeping patterns",
      "The bad condition of his wagon carriage"
    ],
    correctAnswer: "The weight of responsibilities and a long life journey"
  },
  {
    id: 130,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "What metaphor does 'sleep' commonly represent at the end of this poem?",
    options: ["Nighttime", "Death/The end of life's journey", "Boredom", "Winter weather"],
    correctAnswer: "Death/The end of life's journey"
  },
  {
    id: 131,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "What is the rhyme scheme of this specific stanza (\"deep / keep / sleep / sleep\")?",
    options: ["aaba", "aaaa", "abab", "abcb"],
    correctAnswer: "aaaa"
  },
  {
    id: 132,
    section: "Part B: (vi) Comprehension Passages",
    questionText: "Who wrote these famous lines of poetry?",
    options: ["William Wordsworth", "Robert Frost", "John Keats", "Walt Whitman"],
    correctAnswer: "Robert Frost"
  },

  // (vii) English Language Teaching (ELT) / Subject Pedagogy (133-150)
  {
    id: 133,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "The 'Direct Method' of teaching English completely prohibits the use of:",
    options: ["Target Language", "Mother Tongue (L1)", "Audio-Visual Aids", "Classroom Interactions"],
    correctAnswer: "Mother Tongue (L1)"
  },
  {
    id: 134,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "Which skills are classified as 'Productive Skills' in language learning?",
    options: ["Listening and Reading", "Speaking and Writing", "Listening and Speaking", "Reading and Writing"],
    correctAnswer: "Speaking and Writing"
  },
  {
    id: 135,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "What is the main objective of teaching poetry to secondary classes?",
    options: [
      "To master grammatical rule patterns",
      "To foster aesthetic appreciation and emotional enjoyment",
      "To learn vocabulary lists by heart",
      "To correct pronunciation errors"
    ],
    correctAnswer: "To foster aesthetic appreciation and emotional enjoyment"
  },
  {
    id: 136,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "'Remedial Teaching' is systematically designed to help students who are:",
    options: [
      "Topping the evaluations",
      "Lagging behind and facing specific learning gaps",
      "Interested in extracurricular dance classes",
      "Absent from regular internal exams"
    ],
    correctAnswer: "Lagging behind and facing specific learning gaps"
  },
  {
    id: 137,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "Structural Approach in English language teaching focuses primarily on the mastery of:",
    options: [
      "Literary historical summaries",
      "Selected structures and sentence patterns",
      "Vocabulary definitions exclusively",
      "Rapid reading speeds"
    ],
    correctAnswer: "Selected structures and sentence patterns"
  },
  {
    id: 138,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "Grammar-Translation Method (GTM) puts its ultimate emphasis on:",
    options: [
      "Fluent listening skills",
      "Reading and writing proficiency with rules memorisation",
      "Accurate pronunciation checks",
      "Communicative language immersion"
    ],
    correctAnswer: "Reading and writing proficiency with rules memorisation"
  },
  {
    id: 139,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "What is 'Skimming' in reading skills?",
    options: [
      "Reading slowly for minute specific details",
      "Glancing rapidly over a text to get the general gist",
      "Correcting punctuation errors silently",
      "Reading a book aloud to a large audience"
    ],
    correctAnswer: "Glancing rapidly over a text to get the general gist"
  },
  {
    id: 140,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "'Scanning' is a reading technique utilized when a reader wants to:",
    options: [
      "Find a specific piece of information (e.g., a date or phone number)",
      "Understand the overall mood of the author",
      "Enjoy a complex poetic rhythm structure",
      "Summarize an entire novel plot"
    ],
    correctAnswer: "Find a specific piece of information (e.g., a date or phone number)"
  },
  {
    id: 141,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "The concept of 'Universal Grammar' is associated with which linguist?",
    options: ["Ferdinand de Saussure", "Noam Chomsky", "Edward Sapir", "Leonard Bloomfield"],
    correctAnswer: "Noam Chomsky"
  },
  {
    id: 142,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "A continuous, comprehensive record of an individual child's language development progress kept over time is called:",
    options: ["Textbook Guide", "Portfolio", "Syllabus Schema", "Report Sheet"],
    correctAnswer: "Portfolio"
  },
  {
    id: 143,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "CLT stands for which popular language pedagogy approach?",
    options: [
      "Cognitive Language Teaching",
      "Communicative Language Teaching",
      "Classical Linguistics Theory",
      "Comprehensive Language Training"
    ],
    correctAnswer: "Communicative Language Teaching"
  },
  {
    id: 144,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "In a language classroom, 'LSRW' stands for the correct developmental sequence of:",
    options: [
      "Learning, Speaking, Reading, Writing",
      "Listening, Speaking, Reading, Writing",
      "Listening, Studying, Reviewing, Writing",
      "Lingual, Structural, Rational, Written"
    ],
    correctAnswer: "Listening, Speaking, Reading, Writing"
  },
  {
    id: 145,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "Phonemic awareness refers to the ability to:",
    options: [
      "Write clear letters using cursive fonts",
      "Hear, identify, and manipulate individual sounds in spoken words",
      "Translate English to Hindi seamlessly",
      "Memorize lines from dramatic theater plays"
    ],
    correctAnswer: "Hear, identify, and manipulate individual sounds in spoken words"
  },
  {
    id: 146,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "Which tool is best suited for assessing a student's oral communicative skills?",
    options: [
      "Multiple Choice Written Test",
      "Viva-Voce / Speaking Interview",
      "Essay Writing Task",
      "Spelling Dictation Chart"
    ],
    correctAnswer: "Viva-Voce / Speaking Interview"
  },
  {
    id: 147,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "Language acquisition occurs naturally when children are exposed to:",
    options: [
      "Formal grammar drills everyday",
      "Comprehensible and meaningful communication inputs",
      "Rigid translation dictionaries",
      "Punishments for speaking errors"
    ],
    correctAnswer: "Comprehensible and meaningful communication inputs"
  },
  {
    id: 148,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "The standard cognitive taxonomy used for formulating educational learning objectives is developed by:",
    options: ["B.F. Skinner", "Benjamin Bloom", "Jean Piaget", "Lev Vygotsky"],
    correctAnswer: "Benjamin Bloom"
  },
  {
    id: 149,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "Reading a long novel for pure pleasure and general entertainment is called:",
    options: ["Intensive Reading", "Extensive Reading", "Critical Analysis Reading", "Remedial Scanning"],
    correctAnswer: "Extensive Reading"
  },
  {
    id: 150,
    section: "Part B: (vii) ELT / Pedagogy",
    questionText: "Dictation is a helpful classroom technique to simultaneously evaluate a student's:",
    options: [
      "Creative story writing stamina",
      "Listening, spelling accuracy, and basic punctuation",
      "Public speaking and stage presence",
      "Extent of historical vocabulary storage"
    ],
    correctAnswer: "Listening, spelling accuracy, and basic punctuation"
  }
];
