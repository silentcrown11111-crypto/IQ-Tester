/**
 * Nexus IQ Assessment Logic
 * Handles questions, state, timer, scoring, and UI updates.
 */

// --- STATE MANAGEMENT ---
const AppState = {
    currentQuestionIndex: 0,
    score: 0,
    speedBonus: 0,
    totalTimeSpent: 0,
    answers: [], // store { qId, selectedOption, isCorrect, timeSpent }
    timerInterval: null,
    timeRemaining: 0,
    isTransitioning: false,
    currentLang: 'en', // Default language

    // Config
    baseScorePerQuestion: 10,
    maxTimePerQuestion: 30, // seconds

    reset() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.speedBonus = 0;
        this.totalTimeSpent = 0;
        this.answers = [];
        this.timeRemaining = this.maxTimePerQuestion;
        this.isTransitioning = false;
        clearInterval(this.timerInterval);
    }
};

// --- DATA: TRANSLATIONS & QUESTIONS ---
const translations = {
    en: {
        dir: 'ltr',
        'landing-desc': 'Test your logical reasoning, pattern recognition, math, and verbal skills in this advanced 15-question cognitive challenge.',
        '15-questions': '15 Questions',
        'timed-challenge': 'Timed Challenge',
        'detailed-analytics': 'Detailed Analytics',
        'start-assessment': 'Start Assessment',
        'abandon-assessment': 'Abandon Assessment',
        'assessment-complete': 'Assessment Complete',
        'cognitive-profile': 'Your Cognitive Profile',
        'iq-score-est': 'Estimated IQ Score',
        'performance-breakdown': 'Performance Breakdown',
        'accuracy': 'Accuracy',
        'avg-speed': 'Avg. Speed',
        'speed-bonus-pts': 'Speed Bonus Points',
        'category-analysis': 'Category Analysis',
        'retake-test': 'Retake Test',
        'share-result': 'Share Result',
        'share-genius': 'Share Your Genius',
        'twitter': 'Twitter',
        'linkedin': 'LinkedIn',
        'copy': 'Copy',
        'copied': 'Link copied to clipboard!',
        'share-template': 'I just scored an IQ of {iq} ({badge}) on Nexus IQ Assessment! 🧠✨ Think you can beat me?',
        'q-counter': 'Q {current} / {total}',
        'footer-about-title': 'About Nexus IQ',
        'footer-about-text': 'An advanced cognitive assessment platform designed to test logical reasoning, pattern recognition, math, and verbal skills through an interactive and timed 15-question challenge.',
        'footer-links-title': 'Quick Links',
        'footer-home': 'Home',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Terms of Service',
        'footer-social-title': 'Connect With Us',
        'badges': {
            'Visionary Genius': 'Visionary Genius',
            'Intellectual Elite': 'Intellectual Elite',
            'Advanced Thinker': 'Advanced Thinker',
            'Bright Mind': 'Bright Mind',
            'Sharp Analyst': 'Sharp Analyst',
            'Curious Explorer': 'Curious Explorer'
        }
    },
    ur: {
        dir: 'rtl',
        'landing-desc': 'اس اعلی درجے کے 15 سوالات کے علمی چیلنج میں اپنی منطقی استدلال، پیٹرن کی شناخت، ریاضی اور زبانی مہارتوں کی جانچ کریں۔',
        '15-questions': '15 سوالات',
        'timed-challenge': 'وقت کی پابندی',
        'detailed-analytics': 'تفصیلی تجزیہ',
        'start-assessment': 'ٹیسٹ شروع کریں',
        'abandon-assessment': 'ٹیسٹ چھوڑ دیں',
        'assessment-complete': 'ٹیسٹ مکمل',
        'cognitive-profile': 'آپ کا ذہنی پروفائل',
        'iq-score-est': 'متوقع آئی کیو سکور',
        'performance-breakdown': 'کارکردگی کی تفصیل',
        'accuracy': 'درستگی',
        'avg-speed': 'اوسط رفتار',
        'speed-bonus-pts': 'رفتار کے بونس پوائنٹس',
        'category-analysis': 'زمرہ وار تجزیہ',
        'retake-test': 'دوبارہ ٹیسٹ دیں',
        'share-result': 'نتائج شیئر کریں',
        'share-genius': 'اپنی ذہانت شیئر کریں',
        'twitter': 'ٹویٹر',
        'linkedin': 'لنکڈ ان',
        'copy': 'کاپی',
        'copied': 'لنک کاپی ہو گیا!',
        'share-template': 'میں نے Nexus IQ ٹیسٹ میں {iq} ({badge}) آئی کیو سکور کیا ہے! 🧠✨ کیا آپ مجھے ہرا سکتے ہیں؟',
        'q-counter': 'سوال {current} / {total}',
        'footer-about-title': 'Nexus IQ کے بارے میں',
        'footer-about-text': 'ایک جدید علمی تجزیاتی پلیٹ فارم جو منطقی استدلال، پیٹرن کی شناخت، ریاضی اور زبانی مہارتوں کو 15 سوالات کے ایک انٹرایکٹو اور مخصوص وقت والے چیلنج کے ذریعے جانچنے کے لیے بنایا گیا ہے۔',
        'footer-links-title': 'اہم لنکس',
        'footer-home': 'ہوم',
        'footer-privacy': 'پرائیویسی پالیسی',
        'footer-terms': 'سروس کی شرائط',
        'footer-social-title': 'ہمارے ساتھ جڑیں',
        'badges': {
            'Visionary Genius': 'بصیرت والا جینئس',
            'Intellectual Elite': 'دانشورانہ اشرافیہ',
            'Advanced Thinker': 'اعلیٰ سوچ رکھنے والا',
            'Bright Mind': 'ذہین دماغ',
            'Sharp Analyst': 'تیز تجزیہ کار',
            'Curious Explorer': 'متجسس مہم جو'
        }
    },
    ar: {
        dir: 'rtl',
        'landing-desc': 'اختبر تفكيرك المنطقي، والتعرف على الأنماط، والرياضيات، والمهارات اللفظية في هذا التحدي المعرفي المتقدم المكون من 15 سؤالاً.',
        '15-questions': '15 سؤالاً',
        'timed-challenge': 'تحدي موقوت',
        'detailed-analytics': 'تحليلات مفصلة',
        'start-assessment': 'ابدأ التقييم',
        'abandon-assessment': 'تخلى عن التقييم',
        'assessment-complete': 'اكتمل التقييم',
        'cognitive-profile': 'ملفك المعرفي',
        'iq-score-est': 'درجة الذكاء المقدرة',
        'performance-breakdown': 'تفصيل الأداء',
        'accuracy': 'دقة',
        'avg-speed': 'متوسط السرعة',
        'speed-bonus-pts': 'نقاط مكافأة السرعة',
        'category-analysis': 'تحليل الفئات',
        'retake-test': 'إعادة الاختبار',
        'share-result': 'مشاركة النتيجة',
        'share-genius': 'شارك عبقريتك',
        'twitter': 'تويتر',
        'linkedin': 'لينكد إن',
        'copy': 'نسخ',
        'copied': 'تم نسخ الرابط!',
        'share-template': 'لقد حصلت للتو على درجة ذكاء {iq} ({badge}) في تقييم Nexus IQ! 🧠✨ هل تعتقد أنك تستطيع هزيمتي؟',
        'q-counter': 'سؤال {current} / {total}',
        'footer-about-title': 'حول Nexus IQ',
        'footer-about-text': 'منصة تقييم معرفي متقدمة مصممة لاختبار التفكير المنطقي، والتعرف على الأنماط، والرياضيات، والمهارات اللفظية من خلال تحدٍ تفاعلي وموقوت مكون من 15 سؤالاً.',
        'footer-links-title': 'روابط سريعة',
        'footer-home': 'الرئيسية',
        'footer-privacy': 'سياسة الخصوصية',
        'footer-terms': 'شروط الخدمة',
        'footer-social-title': 'تواصل معنا',
        'badges': {
            'Visionary Genius': 'عبقري صاحب رؤية',
            'Intellectual Elite': 'النخبة الفكرية',
            'Advanced Thinker': 'مفكر متقدم',
            'Bright Mind': 'عقل نير',
            'Sharp Analyst': 'محلل حاد',
            'Curious Explorer': 'مستكشف فضولي'
        }
    }
};

const questions = [
    {
        id: 1,
        category: { en: "Logical Reasoning", ur: "منطقی استدلال", ar: "منطق استدلالي" },
        text: {
            en: "If some Smurfs are Snarks, and all Snarks are Yabs, which of the following MUST be true?",
            ur: "اگر کچھ سمرفز سنارکس ہیں، اور تمام سنارکس یابس ہیں، تو درج ذیل میں سے کون سا سچ ہونا چاہیے؟",
            ar: "إذا كان بعض السنافر سناركس ، وجميع السناركس يابس ، فأي مما يلي يجب أن يكون صحيحًا؟"
        },
        options: {
            en: ["All Smurfs are Yabs", "Some Yabs are Smurfs", "All Yabs are Snarks", "No Yabs are Smurfs"],
            ur: ["تمام سمرفز یابس ہیں", "کچھ یابس سمرفز ہیں", "تمام یابس سنارکس ہیں", "کوئی یابس سمرف نہیں ہے"],
            ar: ["كل السنافر ياب", "بعض اليابس سنافر", "كل اليابس سناركس", "لا يوجد يابس سنافر"]
        },
        correctAnswer: 1, // index of option
        timeLimit: 30
    },
    {
        id: 2,
        category: { en: "Pattern Recognition", ur: "پیٹرن کی پہچان", ar: "التعرف على الأنماط" },
        text: {
            en: "What comes next in the sequence: 2, 6, 12, 20, 30, ...?",
            ur: "تسلسل میں آگے کیا آتا ہے: 2، 6، 12، 20، 30، ...؟",
            ar: "ماذا ياتي بعد في التسلسل: 2 ، 6 ، 12 ، 20 ، 30 ، ...؟"
        },
        options: {
            en: ["40", "42", "44", "48"],
            ur: ["40", "42", "44", "48"],
            ar: ["40", "42", "44", "48"]
        },
        correctAnswer: 1, // +4, +6, +8, +10, +12 -> 42
        timeLimit: 25
    },
    {
        id: 3,
        category: { en: "Math", ur: "ریاضی", ar: "الرياضيات" },
        text: {
            en: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
            ur: "ایک بیٹ اور بال کی کل قیمت 1.10 ڈالر ہے۔ بیٹ بال سے 1.00 ڈالر مہنگا ہے۔ بال کی قیمت کتنی ہے؟",
            ar: "تبلغ تكلفة المضرب والكرة 1.10 دولارًا في المجموع. تبلغ تكلفة المضرب 1.00 دولار أكثر من الكرة. فكم ثمن الكرة؟"
        },
        options: {
            en: ["$0.05", "$0.10", "$0.15", "$0.20"],
            ur: ["0.05 ڈالر", "0.10 ڈالر", "0.15 ڈالر", "0.20 ڈالر"],
            ar: ["$0.05", "$0.10", "$0.15", "$0.20"]
        },
        correctAnswer: 0, // 0.05 + 1.05 = 1.10
        timeLimit: 20
    },
    {
        id: 4,
        category: { en: "Verbal", ur: "زبانی", ar: "لفظي" },
        text: {
            en: "Which word is the odd one out?",
            ur: "کون سا لفظ سب سے مختلف ہے؟",
            ar: "أي كلمة هي الغريبة؟"
        },
        options: {
            en: ["Apple", "Banana", "Carrot", "Mango"],
            ur: ["سیب", "کیلا", "گاجر", "آم"],
            ar: ["تفاحة", "موزة", "جزرة", "مانجو"]
        },
        correctAnswer: 2, // Carrot is a vegetable
        timeLimit: 15
    },
    {
        id: 5,
        category: { en: "Logical Reasoning", ur: "منطقی استدلال", ar: "منطق استدلالي" },
        text: {
            en: "If you rearrange the letters 'CIFAIPC', you would have the name of a(n):",
            ur: "اگر آپ حروف 'CIFAIPC' کو ترتیب دیں، تو آپ کے پاس ایک نام ہوگا:",
            ar: "إذا قمت بإعادة ترتيب الحروف 'CIFAIPC' ، فسيكون لديك اسم لـ:"
        },
        options: {
            en: ["City", "Animal", "Ocean", "River"],
            ur: ["شہر", "جانور", "سمندر", "دریا"],
            ar: ["مدينة", "حيوان", "محيط", "نهر"]
        },
        correctAnswer: 2, // PACIFIC (Ocean)
        timeLimit: 25
    },
    {
        id: 6,
        category: { en: "Math", ur: "ریاضی", ar: "الرياضيات" },
        text: {
            en: "If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?",
            ur: "اگر 5 مشینیں 5 وجیٹس بنانے میں 5 منٹ لیتی ہیں، تو 100 مشینیں 100 وجیٹس بنانے میں کتنا وقت لیں گی؟",
            ar: "إذا استغرقت 5 آلات 5 دقائق لصنع 5 أدوات ، فكم من الوقت ستستغرق 100 آلة لصنع 100 أداة؟"
        },
        options: {
            en: ["100 minutes", "50 minutes", "5 minutes", "1 minute"],
            ur: ["100 منٹ", "50 منٹ", "5 منٹ", "1 منٹ"],
            ar: ["100 دقيقة", "50 دقيقة", "5 دقائق", "دقيقة واحدة"]
        },
        correctAnswer: 2, // 1 machine takes 5 mins for 1 widget
        timeLimit: 20
    },
    {
        id: 7,
        category: { en: "Pattern Recognition", ur: "پیٹرن کی پہچان", ar: "التعرف على الأنماط" },
        text: {
            en: "O, T, T, F, F, S, S, E, ... What comes next?",
            ur: "O, T, T, F, F, S, S, E, ... آگے کیا آتا ہے؟",
            ar: "O، T، T، F، F، S، S، E، ... ماذا ياتي بعد؟"
        },
        options: {
            en: ["E", "N", "T", "S"],
            ur: ["E", "N", "T", "S"],
            ar: ["E", "N", "T", "S"]
        },
        correctAnswer: 1, // One, Two, Three, Four... Nine
        timeLimit: 25
    },
    {
        id: 8,
        category: { en: "Spatial Reasoning", ur: "فضائی استدلال", ar: "تفكير مكاني" },
        text: {
            en: "How many cubes are in a 3x3x3 larger cube where the center column has been removed completely?",
            ur: "3x3x3 کے بڑے مکعب میں کتنے مکعب باقی رہ گئے ہیں جہاں سے درمیانی کالم مکمل طور پر ہٹا دیا گیا ہے؟",
            ar: "كم عدد المكعبات الموجودة في مكعب أكبر 3x3x3 حيث تمت إزالة العمود الأوسط بالكامل؟"
        },
        options: {
            en: ["27", "26", "24", "20"],
            ur: ["27", "26", "24", "20"],
            ar: ["27", "26", "24", "20"]
        },
        correctAnswer: 2, // 27 total - 3 center column = 24
        timeLimit: 40
    },
    {
        id: 9,
        category: { en: "Verbal", ur: "زبانی", ar: "لفظي" },
        text: {
            en: "Analogies: OBTUSE is to ANGLE as INEPT is to:",
            ur: "تمثیلات: OBTUSE کا تعلق ANGLE سے ہے جیسا کہ INEPT کا تعلق اس سے ہے:",
            ar: "التشبيهات: منفرجة للزاوية مثلما غير كفء لـ:"
        },
        options: {
            en: ["Clever", "Skill", "Shape", "Failure"],
            ur: ["چالاک", "مہارت", "شکل", "ناکامی"],
            ar: ["ذكاء", "مهارة", "شكل", "فشل"]
        },
        correctAnswer: 1, // Obtuse describes an angle; Inept describes skill (or lack thereof)
        timeLimit: 30
    },
    {
        id: 10,
        category: { en: "Logical Reasoning", ur: "منطقی استدلال", ar: "منطق استدلالي" },
        text: {
            en: "Mary's father has five daughters: Nana, Nene, Nini, Nono, and...",
            ur: "میری کے والد کی پانچ بیٹیاں ہیں: نانا، نینے، نینی، نونو، اور...",
            ar: "والد ماري لديه خمس بنات: نانا ، نيني ، نيني ، نونو ، و ..."
        },
        options: {
            en: ["Nunu", "Nina", "Mary", "None"],
            ur: ["نونو", "نینا", "میری", "کوئی نہیں"],
            ar: ["نونو", "نينا", "ماري", "لا أحد"]
        },
        correctAnswer: 2, // The fifth daughter is Mary herself
        timeLimit: 15
    },
    {
        id: 11,
        category: { en: "Math", ur: "ریاضی", ar: "الرياضيات" },
        text: {
            en: "What is half of 2 plus 2?",
            ur: "2 کا آدھا پلس 2 کتنا ہے؟",
            ar: "ما هو نصف 2 زائد 2؟"
        },
        options: {
            en: ["2", "3", "4", "1.5"],
            ur: ["2", "3", "4", "1.5"],
            ar: ["2", "3", "4", "1.5"]
        },
        correctAnswer: 1, // Follow BEDMAS: (Half of 2 = 1) + 2 = 3
        timeLimit: 20
    },
    {
        id: 12,
        category: { en: "Spatial Reasoning", ur: "فضائی استدلال", ar: "تفكير مكاني" },
        text: {
            en: "If you look at a standard clock face and the time is 3:15, what is the angle between the hour and the minute hands?",
            ur: "اگر آپ ایک معیاری گھڑی کو دیکھیں اور وقت 3:15 ہو، تو گھنٹہ اور منٹ کی سوئیوں کے درمیان زاویہ کیا ہے؟",
            ar: "إذا نظرت إلى وجه ساعة قياسي وكان الوقت 3:15 ، فما هي الزاوية بين عقربي الساعات والدقائق؟"
        },
        options: {
            en: ["0 degrees", "7.5 degrees", "15 degrees", "10 degrees"],
            ur: ["0 ڈگری", "7.5 ڈگری", "15 ڈگری", "10 ڈگری"],
            ar: ["0 درجة", "7.5 درجة", "15 درجة", "10 درجات"]
        },
        correctAnswer: 1, // Minute hand at exactly 3. Hour hand has moved 15/60 (1/4) of the way between 3 and 4. 360/12 = 30 deg per hour. 1/4 of 30 = 7.5
        timeLimit: 45
    },
    {
        id: 13,
        category: { en: "Pattern Recognition", ur: "پیٹرن کی پہچان", ar: "التعرف على الأنماط" },
        text: {
            en: "1, 1, 2, 3, 5, 8, 13, ... What is the 10th number in this sequence?",
            ur: "1، 1، 2، 3، 5، 8، 13، ... اس تسلسل میں 10واں عدد کیا ہے؟",
            ar: "1 ، 1 ، 2 ، 3 ، 5 ، 8 ، 13 ، ... ما هو الرقم العاشر في هذا التسلسل؟"
        },
        options: {
            en: ["21", "34", "55", "89"],
            ur: ["21", "34", "55", "89"],
            ar: ["21", "34", "55", "89"]
        },
        correctAnswer: 2, // Fibonacci: 1st=1, 2nd=1, 3rd=2, 4th=3, 5th=5, 6th=8, 7th=13, 8th=21, 9th=34, 10th=55
        timeLimit: 30
    },
    {
        id: 14,
        category: { en: "Verbal", ur: "زبانی", ar: "لفظي" },
        text: {
            en: "Which of the following proverbs means 'people with similar interests or personalities tend to congregate'?",
            ur: "درج ذیل میں سے کس کہاوت کا مطلب ہے کہ 'ایک جیسی دلچسپی رکھنے والے لوگ اکٹھے ہوتے ہیں'؟",
            ar: "أي من الأمثال التالية يعني 'الأشخاص الذين لديهم اهتمامات أو شخصيات متشابهة يميلون إلى التجمع'؟"
        },
        options: {
            en: [
                "Familiarity breeds contempt",
                "A rolling stone gathers no moss",
                "Birds of a feather flock together",
                "Two heads are better than one"
            ],
            ur: [
                "واقفیت حقارت پیدا کرتی ہے",
                "ایک گھومتا ہوا پتھر کائی جمع نہیں کرتا",
                "ایک جیسے پرندے اکٹھے اڑتے ہیں",
                "دو سر ایک سے بہتر ہیں"
            ],
            ar: [
                "الألفة تولد الازدراء",
                "الحجر المتدحرج لا يجمع طحالب",
                "الطيور على أشكالها تقع",
                "عقلان أفضل من عقل واحد"
            ]
        },
        correctAnswer: 2,
        timeLimit: 20
    },
    {
        id: 15,
        category: { en: "Logic / Math", ur: "منطق / ریاضی", ar: "منطق / رياضيات" },
        text: {
            en: "There is a patch of lily pads on a lake. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take to cover half the lake?",
            ur: "ایک جھیل پر للی پیڈز کا ایک پیچ ہے۔ ہر روز پیچ سائز میں دوگنا ہو جاتا ہے۔ اگر پورے جھیل کو ڈھانپنے میں 48 دن لگتے ہیں، تو آدھی جھیل کو ڈھانپنے میں کتنا وقت لگے گا؟",
            ar: "توجد رقعة من زنابق الماء في بحيرة. كل يوم ، يتضاعف حجم الرقعة. إذا استغرق الأمر 48 يومًا حتى تغطي الرقعة البحيرة بالكامل ، فكم من الوقت سيستغرق تغطية نصف البحيرة؟"
        },
        options: {
            en: ["24 days", "12 days", "47 days", "36 days"],
            ur: ["24 دن", "12 دن", "47 دن", "36 دن"],
            ar: ["24 يومًا", "12 يومًا", "47 يومًا", "36 يومًا"]
        },
        correctAnswer: 2, // It doubles every day, so the day before the 48th day (the 47th day) it was half the size.
        timeLimit: 20
    }
];

// --- DOM ELEMENTS ---
const Elements = {
    pages: {
        landing: document.getElementById('landing-page'),
        quiz: document.getElementById('quiz-page'),
        results: document.getElementById('results-page')
    },
    btns: {
        start: document.getElementById('start-btn'),
        cancel: document.getElementById('cancel-btn'),
        restart: document.getElementById('restart-btn'),
        share: document.getElementById('share-btn'),
        closeModal: document.getElementById('close-modal-btn'),
        copyLink: document.getElementById('copy-link-btn')
    },
    quiz: {
        progressBar: document.getElementById('progress-bar'),
        counter: document.getElementById('question-counter'),
        category: document.getElementById('category-badge'),
        timeDisplay: document.getElementById('time-display'),
        timerCircle: document.getElementById('timer-circle'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container')
    },
    results: {
        score: document.getElementById('final-score'),
        badgeTitle: document.getElementById('badge-title'),
        accuracy: document.getElementById('accuracy-stat'),
        speed: document.getElementById('speed-stat'),
        bonus: document.getElementById('bonus-stat'),
        categoryStats: document.getElementById('category-stats')
    },
    modals: {
        share: document.getElementById('share-modal'),
        shareContent: document.getElementById('share-modal-content'),
        shareText: document.getElementById('share-text-preview'),
        toast: document.getElementById('toast'),
        langSelect: document.getElementById('lang-select')
    }
};

// --- INITIALIZATION ---
function init() {
    bindEvents();

    // Default language logic
    AppState.currentLang = Elements.langSelect.value || 'en';
    switchLanguage(AppState.currentLang);

    // Explicitly show the landing page to trigger animations and ensure visibility
    showPage('landing');
}

function bindEvents() {
    Elements.btns.start.addEventListener('click', startAssessment);
    Elements.btns.cancel.addEventListener('click', () => showPage('landing'));
    Elements.btns.restart.addEventListener('click', () => {
        AppState.reset();
        showPage('landing');
    });

    // Language Selector
    Elements.langSelect.addEventListener('change', (e) => {
        switchLanguage(e.target.value);
    });

    // Share functionality
    Elements.btns.share.addEventListener('click', openShareModal);
    Elements.btns.closeModal.addEventListener('click', closeShareModal);
    Elements.btns.copyLink.addEventListener('click', copyShareText);

    // Close modal on outside click
    Elements.modals.share.addEventListener('click', (e) => {
        if (e.target === Elements.modals.share) closeShareModal();
    });
}

function switchLanguage(lang) {
    if (!translations[lang]) return;
    AppState.currentLang = lang;

    // Update HTML dir
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;

    // Translate static UI elements
    translateUI();

    // If in quiz, refresh current question
    if (Elements.pages.quiz.classList.contains('active')) {
        loadQuestion(AppState.currentQuestionIndex);
    }
}

function translateUI() {
    const langData = translations[AppState.currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            el.textContent = langData[key];
        }
    });

    // Update icons and visual direction if needed
    const isRtl = langData.dir === 'rtl';
    const startIcon = document.getElementById('start-btn-icon');
    const cancelIcon = document.getElementById('cancel-btn-icon');
    const restartIcon = document.getElementById('restart-btn-icon');
    const shareIcon = document.getElementById('share-btn-icon');

    if (startIcon) startIcon.className = isRtl ? 'fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform' : 'fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform';
    if (cancelIcon) cancelIcon.className = isRtl ? 'fa-solid fa-times ml-2' : 'fa-solid fa-times mr-2';
    if (restartIcon) restartIcon.className = isRtl ? 'fa-solid fa-rotate-right ml-2' : 'fa-solid fa-rotate-right mr-2';
    if (shareIcon) shareIcon.className = isRtl ? 'fa-solid fa-arrow-up-left-from-square ml-2' : 'fa-solid fa-arrow-up-right-from-square mr-2';
}

// --- CORE APP LOGIC ---

function showPage(pageName) {
    // Hide all
    Object.values(Elements.pages).forEach(page => {
        page.classList.remove('fade-in');
        setTimeout(() => {
            page.classList.remove('active');
            page.classList.add('hidden');
        }, 50); // slight delay for smooth transition
    });

    // Show requested
    setTimeout(() => {
        const target = Elements.pages[pageName];
        target.classList.remove('hidden');
        target.classList.add('active');

        // Trigger generic animation reflow
        void target.offsetWidth;

        target.classList.add('fade-in');
    }, 60);
}

function startAssessment() {
    AppState.reset();
    showPage('quiz');
    loadQuestion(AppState.currentQuestionIndex);
}

function loadQuestion(index) {
    if (index >= questions.length) {
        finishAssessment();
        return;
    }

    const question = questions[index];
    AppState.timeRemaining = question.timeLimit;

    // Update UI
    Elements.quiz.counter.textContent = `Q ${index + 1} / ${questions.length}`;
    Elements.quiz.category.textContent = question.category;

    const q = questions[index];
    const lang = AppState.currentLang;

    // Update counter
    const counterText = translations[lang]['q-counter']
        .replace('{current}', index + 1)
        .replace('{total}', questions.length);
    Elements.quiz.counter.textContent = counterText;

    // Update category
    Elements.quiz.category.textContent = q.category[lang];

    // Apply enter animation
    Elements.quiz.questionText.style.opacity = '0';
    Elements.quiz.optionsContainer.style.opacity = '0';

    setTimeout(() => {
        // Update question text
        Elements.quiz.questionText.textContent = q.text[lang];

        // Reset and start timer
        AppState.timeRemaining = q.timeLimit || AppState.maxTimePerQuestion;
        startTimer(AppState.timeRemaining); // Pass duration to startTimer

        // Render options
        renderOptions(q, lang);

        // Update progress bar
        updateProgressBar();

        Elements.quiz.questionText.style.transition = 'opacity 0.4s ease';
        Elements.quiz.optionsContainer.style.transition = 'opacity 0.4s ease';
        Elements.quiz.questionText.style.opacity = '1';
        Elements.quiz.optionsContainer.style.opacity = '1';

        AppState.isTransitioning = false;
    }, 300);
}

function renderOptions(question, lang) {
    Elements.quiz.optionsContainer.innerHTML = '';

    const options = question.options[lang];
    options.forEach((optionText, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn group flex items-center justify-between w-full p-4 mb-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 text-left';

        // Handle RTL alignment for option buttons if needed
        if (translations[lang].dir === 'rtl') {
            button.classList.add('text-right');
            button.classList.remove('text-left');
        }

        button.innerHTML = `
            <span class="text-white/90 group-hover:text-white transition-colors">${optionText}</span>
            <div class="option-indicator w-6 h-6 rounded-full border-2 border-white/20 group-hover:border-cyan-500/50 transition-all"></div>
        `;

        button.addEventListener('click', () => handleAnswer(index)); // Changed handleOptionSelect to handleAnswer
        Elements.quiz.optionsContainer.appendChild(button);
    });
}

function startTimer(duration) {
    clearInterval(AppState.timerInterval);

    const circle = Elements.quiz.timerCircle;
    const circumference = 2 * Math.PI * 24; // r=24

    // Reset ring
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = 0;
    circle.style.stroke = 'var(--neon-cyan)';

    Elements.quiz.timeDisplay.textContent = duration;

    AppState.timerInterval = setInterval(() => {
        AppState.timeRemaining--;
        Elements.quiz.timeDisplay.textContent = AppState.timeRemaining;

        // Update Ring
        const offset = circumference - (AppState.timeRemaining / duration) * circumference;
        circle.style.strokeDashoffset = offset;

        // Color change based on time
        if (AppState.timeRemaining <= 10 && AppState.timeRemaining > 5) {
            circle.style.stroke = '#f59e0b'; // warning orange
            Elements.quiz.timeDisplay.classList.add('text-orange-400');
        } else if (AppState.timeRemaining <= 5) {
            circle.style.stroke = '#ef4444'; // danger red
            Elements.quiz.timeDisplay.classList.remove('text-orange-400');
            Elements.quiz.timeDisplay.classList.add('text-red-500');

            // Add pulse effect
            if (AppState.timeRemaining % 2 !== 0) {
                Elements.quiz.timeDisplay.classList.add('scale-110');
            } else {
                Elements.quiz.timeDisplay.classList.remove('scale-110');
            }
        }

        if (AppState.timeRemaining <= 0) {
            clearInterval(AppState.timerInterval);
            handleAnswer(-1); // -1 means timeout/no answer
        }
    }, 1000);
}

function handleAnswer(selectedIndex) {
    if (AppState.isTransitioning) return;
    AppState.isTransitioning = true;

    clearInterval(AppState.timerInterval);
    Elements.quiz.timeDisplay.classList.remove('text-orange-400', 'text-red-500', 'scale-110');

    const question = questions[AppState.currentQuestionIndex];
    const isCorrect = selectedIndex === question.correctAnswer;
    const timeSpent = question.timeLimit - AppState.timeRemaining;

    // Save answer
    AppState.answers.push({
        qId: question.id,
        category: question.category,
        selectedIndex,
        isCorrect,
        timeSpent
    });

    AppState.totalTimeSpent += timeSpent;

    // Visual feedback
    const btns = Elements.quiz.optionsContainer.children;

    // Show correct answer
    if (btns[question.correctAnswer]) {
        btns[question.correctAnswer].classList.add('correct');
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-check ml-auto text-green-400';
        btns[question.correctAnswer].appendChild(icon);
    }

    // Show incorrect answer if user selected wrong
    if (!isCorrect && selectedIndex !== -1 && btns[selectedIndex]) {
        btns[selectedIndex].classList.add('incorrect');
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-xmark ml-auto text-red-400';
        btns[selectedIndex].appendChild(icon);
    }

    // Next Question
    setTimeout(() => {
        AppState.currentQuestionIndex++;
        loadQuestion(AppState.currentQuestionIndex);
    }, 1500);
}

function updateProgressBar() {
    const progress = ((AppState.currentQuestionIndex) / questions.length) * 100;
    Elements.quiz.progressBar.style.width = `${progress}%`;
}


// --- SCORING & RESULTS ---

function calculateFinalScore() {
    let rawScore = 0;
    let correctCount = 0;
    let totalSpeedBonus = 0;

    const categoryStatsMap = {};

    AppState.answers.forEach(ans => {
        // init category
        if (!categoryStatsMap[ans.category]) {
            categoryStatsMap[ans.category] = { correct: 0, total: 0 };
        }
        categoryStatsMap[ans.category].total++;

        if (ans.isCorrect) {
            correctCount++;
            rawScore += AppState.baseScorePerQuestion;

            // Speed Bonus Logic: Max bonus is 50% of base score if answered instantly. Minimum is 0.
            const qData = questions.find(q => q.id === ans.qId);
            const timeRatio = Math.max(0, 1 - (ans.timeSpent / qData.timeLimit));
            const bonus = Math.round((AppState.baseScorePerQuestion * 0.5) * timeRatio);
            totalSpeedBonus += bonus;

            categoryStatsMap[ans.category].correct++;
        }
    });

    AppState.score = rawScore + totalSpeedBonus;
    AppState.speedBonus = totalSpeedBonus;

    // Base IQ concept scoring (Arbitrary for fun app)
    // Max theoretical score: (15 * 10) + (15 * 5) = 225
    // Let's normalize to a typical IQ range 70 - 160

    const maxPossiblePoints = questions.length * (AppState.baseScorePerQuestion * 1.5);
    const scorePercentage = AppState.score / maxPossiblePoints;

    // Base IQ starts at 80. Max IQ is 160.
    const calculatedIQ = 80 + Math.round(scorePercentage * 80);

    return {
        iq: calculatedIQ,
        correctCount,
        accuracyPercent: Math.round((correctCount / questions.length) * 100),
        avgSpeed: (AppState.totalTimeSpent / questions.length).toFixed(1),
        categoryStatsMap
    };
}

function determineBadge(iq) {
    if (iq >= 140) return { id: "Visionary Genius", color: "text-neon-cyan", icon: "fa-solid fa-brain" };
    if (iq >= 130) return { id: "Intellectual Elite", color: "text-neon-purple", icon: "fa-solid fa-chess-knight" };
    if (iq >= 120) return { id: "Advanced Thinker", color: "text-blue-400", icon: "fa-solid fa-gem" };
    if (iq >= 110) return { id: "Bright Mind", color: "text-green-400", icon: "fa-solid fa-lightbulb" };
    if (iq >= 100) return { id: "Sharp Analyst", color: "text-yellow-400", icon: "fa-solid fa-eye" };
    return { id: "Curious Explorer", color: "text-gray-300", icon: "fa-solid fa-compass" };
}

function finishAssessment() {
    const stats = calculateFinalScore();
    const badgeData = determineBadge(stats.iq);
    const lang = AppState.currentLang;
    const translatedBadge = translations[lang]['badges'][badgeData.id];

    // Update DOM
    Elements.results.score.textContent = stats.iq;

    Elements.results.badgeTitle.innerHTML = `<i class="${badgeData.icon} ${lang === 'en' ? 'mr-2' : 'ml-2'}"></i>${translatedBadge}`;
    Elements.results.badgeTitle.className = `text-2xl font-bold mt-3 ${badgeData.color} drop-shadow-md`;

    Elements.results.accuracy.textContent = `${stats.accuracyPercent}%`;
    Elements.results.speed.textContent = `${stats.avgSpeed}s / Q`;
    Elements.results.bonus.textContent = `+${AppState.speedBonus}`;

    // Render Category Breakdowns
    const catContainer = Elements.results.categoryStats;
    catContainer.innerHTML = '';

    Object.entries(stats.categoryStatsMap).forEach(([catKey, data]) => {
        const percent = Math.round((data.correct / data.total) * 100);
        let colorClass = percent >= 80 ? 'text-green-400' : (percent >= 50 ? 'text-yellow-400' : 'text-red-400');

        // catKey is an object {en, ur, ar}
        const translatedCat = typeof catKey === 'object' ? catKey[lang] : catKey;

        catContainer.innerHTML += `
            <div class="flex flex-col items-center bg-black/20 rounded-xl p-3 border border-white/5">
                <span class="text-xs text-gray-400 text-center block h-8 mb-1 leading-tight">${translatedCat}</span>
                <span class="text-xl font-bold ${colorClass}">${data.correct}/${data.total}</span>
            </div>
        `;
    });

    // Save to LocalStorage
    saveSession(stats, badgeData.id);

    // Prepare Share Text
    const shareTpl = translations[lang]['share-template']
        .replace('{iq}', stats.iq)
        .replace('{badge}', translatedBadge);
    Elements.modals.shareText.textContent = shareTpl;

    // Show Results
    showPage('results');

    // Animate Score Counter
    animateValue(Elements.results.score, 0, stats.iq, 2000);
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing function: easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Apply gradient class once done
            obj.className = "text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-neon-cyan to-neon-purple mb-2 filter drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]";
        }
    };
    window.requestAnimationFrame(step);
}

function saveSession(stats, badgeId) {
    const sessionData = {
        date: new Date().toISOString(),
        score: stats.iq,
        badgeId: badgeId,
        accuracy: stats.accuracyPercent
    };
    localStorage.setItem('nexus_iq_last_run', JSON.stringify(sessionData));
}

// --- SHARE MODAL ---
function openShareModal() {
    const modal = Elements.modals.share;
    modal.classList.remove('hidden');
    // Trigger reflow
    void modal.offsetWidth;
    modal.classList.remove('opacity-0');
    Elements.modals.shareContent.classList.remove('scale-95');
    Elements.modals.shareContent.classList.add('scale-100');
}

function closeShareModal() {
    const modal = Elements.modals.share;
    modal.classList.add('opacity-0');
    Elements.modals.shareContent.classList.remove('scale-100');
    Elements.modals.shareContent.classList.add('scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function copyShareText() {
    const text = Elements.modals.shareText.textContent;
    const url = window.location.href;
    const lang = AppState.currentLang;
    const successMsg = translations[lang]['copied'];

    navigator.clipboard.writeText(`${text} \n\nTake the test: ${url}`).then(() => {
        showToast(successMsg);
        closeShareModal();
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast("Failed to copy. Please copy manually.");
    });
}

function showToast(msg) {
    const toast = Elements.modals.toast;
    Elements.modals.toastMsg.textContent = msg;

    toast.classList.remove('translate-y-[150%]', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-[150%]', 'opacity-0');
    }, 3000);
}

// On Load
document.addEventListener('DOMContentLoaded', init);
