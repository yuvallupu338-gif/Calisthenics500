import React, { useState, useEffect, useMemo } from 'react';
import { Award, Bell, ChevronRight, ChevronLeft, Lock, Unlock, Apple, TreePine, Home, Check, X, Flame, AlertCircle, Zap, RotateCcw, Clock } from 'lucide-react';

// ==========================================
// DATA
// ==========================================
const QUESTIONS = [
  { id: 'name', type: 'text', q: 'מה השם הפרטי שלך?', placeholder: 'הכנס שם...' },
  { id: 'age', type: 'number', q: 'בן כמה אתה?', placeholder: 'גיל בשנים', min: 10, max: 99 },
  { id: 'height', type: 'number', q: 'מה הגובה שלך? (ס"מ)', placeholder: 'למשל: 178', min: 100, max: 230 },
  { id: 'weight', type: 'number', q: 'מה המשקל הנוכחי שלך? (ק"ג)', placeholder: 'למשל: 75', min: 30, max: 250 },
  { id: 'gender', type: 'choice', q: 'מה המגדר שלך?', options: ['זכר', 'נקבה', 'אחר'] },
  { id: 'goal', type: 'choice', q: 'מה המטרה העיקרית שלך?', options: ['ירידה באחוזי שומן (חיטוב)', 'בניית מסת שריר וכוח'] },
  { id: 'days', type: 'days', q: 'באילו ימים בשבוע תרצה להתאמן?', options: ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'] },
  { id: 'location', type: 'choice', q: 'איפה תבצע את רוב האימונים?', options: ['חדר כושר', 'פארק קליסטניקס', 'בבית', 'סטודיו'] },
  { id: 'equip', type: 'multi', q: 'איזה ציוד זמין לך?', options: ['מוט מתח', 'מקבילים', 'טבעות אולימפיות', 'גומיות התנגדות', 'פרלטס', 'ללא ציוד בכלל'] },
  { id: 'pushups', type: 'choice', q: 'כמה שכיבות סמיכה נקיות ברצף?', options: ['0-5', '6-15', '16-30', '30+'] },
  { id: 'pullups', type: 'choice', q: 'כמה עליות מתח נקיות ברצף?', options: ['0 (לא מצליח)', '1-4', '5-10', '10+'] },
  { id: 'dips', type: 'choice', q: 'כמה מקבילים ברצף?', options: ['0', '1-5', '6-12', '12+'] },
  { id: 'plank', type: 'choice', q: 'כמה זמן פלאנק סטטי?', options: ['פחות מ-30 שניות', 'דקה', '2 דקות', '3 דקות ומעלה'] },
  { id: 'injuries', type: 'multi', q: 'מגבלות או פציעות עבר?', options: ['ללא פציעות', 'כאבי גב תחתון', 'רגישות בכתפיים', 'כאבי ברכיים', 'שורש כף היד'] },
  { id: 'sleep', type: 'choice', q: 'כמה שעות שינה בממוצע?', options: ['פחות מ-5', '5-6 שעות', '7-8 שעות', '9 ומעלה'] },
  { id: 'stress', type: 'choice', q: 'מה רמת הלחץ היומיומית?', options: ['נמוכה (רגוע)', 'בינונית', 'גבוהה - עמוס ולחוץ'] },
  { id: 'water', type: 'choice', q: 'כמה מים ביום?', options: ['פחות מליטר', '1-2 ליטר', '2-3 ליטר', '3 ליטר ומעלה'] },
  { id: 'meals', type: 'choice', q: 'כמה ארוחות ביום?', options: ['1-2 ארוחות', '3 ארוחות', '4-5 ארוחות', 'נשנושים כל היום'] },
  { id: 'diet_pref', type: 'choice', q: 'העדפה תזונתית?', options: ['רגיל (אוכל הכל)', 'צמחוני', 'טבעוני', 'פליאו / קטו'] },
  { id: 'allergies', type: 'multi', q: 'אלרגיות למזון?', options: ['ללא', 'בוטנים', 'אגוזים', 'גלוטן', 'לקטוז', 'דגים', 'סויה'] },
  { id: 'protein', type: 'multi', q: 'מקורות חלבון מועדפים:', options: ['עוף / בקר', 'דגים', 'ביצים', 'טופו / סייטן', 'אבקת חלבון'] },
  { id: 'cardio', type: 'choice', q: 'האם תרצה לשלב אירובי?', options: ['כן, פעמיים בשבוע', 'פעם בשבוע', 'רק לחימום', 'שונא אירובי - רק כוח'] },
  { id: 'time', type: 'choice', q: 'באיזו שעה ביום נוח להתאמן?', options: ['בוקר מוקדם', 'צהריים', 'אחר הצהריים', 'ערב / לילה'] },
  { id: 'music', type: 'choice', q: 'האם אתה מתאמן עם מוזיקה?', options: ['חובה אוזניות', 'רמקול ברקע', 'מעדיף שקט'] },
  { id: 'social', type: 'choice', q: 'איך אתה מעדיף להתאמן?', options: ['לבד (זאב בודד)', 'עם פרטנר', 'בקבוצה קטנה'] },
  { id: 'handstand', type: 'choice', q: 'האם אתה יודע לעמוד על ידיים?', options: ['לא יודע בכלל', 'רק עם קיר', 'חופשי באוויר'] },
  { id: 'flex', type: 'choice', q: 'האם אתה נוגע באצבעות הרגליים (רגליים ישרות)?', options: ['כן בקלות', 'בקושי', 'ממש לא'] },
  { id: 'ready', type: 'choice', q: 'מוכן לשנות את הגוף שלך?', options: ['כן, בוא נשבור את זה!', 'יאללה, תתחיל לחשב.'] }
];

const SKILLS = [
  { id: 'l1', target: 'legs', name: 'סקוואט בסיס', x: 15, y: 5, req: [], desc: 'עמוד ברוחב כתפיים, רד לזווית 90°, שמור על גב ישר.' },
  { id: 'l2', target: 'legs', name: 'לאנג׳ים', x: 15, y: 20, req: ['l1'], desc: 'צעד גדול קדימה, הברך האחורית כמעט נוגעת ברצפה.' },
  { id: 'l3', target: 'legs', name: 'סקוואט קפיצה', x: 15, y: 35, req: ['l2'], desc: 'סקוואט עמוק עם קפיצה פיצוצית, נחיתה רכה על כפות הרגליים.' },
  { id: 'l4', target: 'legs', name: 'פיסטול עם תמיכה', x: 15, y: 55, req: ['l3'], desc: 'סקוואט על רגל אחת בסיוע קיר או TRX לשיווי משקל.' },
  { id: 'l5', target: 'legs', name: 'פיסטול מלא', x: 15, y: 75, req: ['l4'], desc: 'סקוואט מלא על רגל אחת ללא סיוע. פסגת כוח הרגליים.' },
  { id: 'p1', target: 'push', name: 'שכיבות סמיכה', x: 40, y: 5, req: [], desc: 'מרפקים ב-45°, ירד עד שהחזה כמעט נוגע ברצפה.' },
  { id: 'p2', target: 'push', name: 'שכיבות יהלום', x: 40, y: 20, req: ['p1'], desc: 'ידיים צמודות בצורת יהלום, מפעיל טריצפס ופנימי החזה.' },
  { id: 'p3', target: 'push', name: 'מקבילים', x: 40, y: 35, req: ['p2'], desc: 'רד עד זווית 90° במרפקים, דחוף עד יישור מלא.' },
  { id: 'p4', target: 'push', name: 'שכיבות ארצ׳ר', x: 30, y: 55, req: ['p3'], desc: 'יד אחת רחבה ישרה, כל המשקל על יד כפופה. הכנה לחד-יד.' },
  { id: 's1', target: 'shoulders', name: 'עמידת קיר', x: 50, y: 55, req: ['p3'], desc: 'עמידת ידיים עם רגליים על הקיר, חזה כלפי הקיר.' },
  { id: 's2', target: 'shoulders', name: 'HSPU קיר', x: 50, y: 70, req: ['s1'], desc: 'שכיבות סמיכה בעמידת ידיים על הקיר. כוח כתפיים עצום.' },
  { id: 's3', target: 'shoulders', name: 'פלאנץ׳ מכווץ', x: 50, y: 85, req: ['s2'], desc: 'גוף אופקי על ידיים עם רגליים מכווצות לחזה.' },
  { id: 's4', target: 'shoulders', name: 'פלאנץ׳ מלא', x: 50, y: 95, req: ['s3'], desc: 'גוף אופקי מלא על ידיים ישרות. פסגת הקליסטניקס.' },
  { id: 'c1', target: 'core', name: 'פלאנק', x: 65, y: 5, req: [], desc: 'גוף ישר כמו קרש, כיווץ בטן ועכוז, נשימה רגועה.' },
  { id: 'c2', target: 'core', name: 'L-Sit מכווץ', x: 65, y: 20, req: ['c1'], desc: 'ישיבה על ידיים עם ברכיים מכווצות לחזה.' },
  { id: 'c3', target: 'core', name: 'L-Sit מלא', x: 65, y: 35, req: ['c2'], desc: 'ישיבה על ידיים עם רגליים ישרות קדימה - תנוחת L.' },
  { id: 'c4', target: 'core', name: 'V-Sit מתקדם', x: 65, y: 55, req: ['c3'], desc: 'ישיבה על ידיים עם רגליים בזווית V כלפי מעלה.' },
  { id: 'c5', target: 'core', name: 'דגל אנושי', x: 65, y: 75, req: ['c4'], desc: 'גוף אופקי על עמוד אנכי. סמל הקליסטניקס.' },
  { id: 'pl1', target: 'pull', name: 'היתלות סטטית', x: 88, y: 5, req: [], desc: 'תלייה על המוט עם כיווץ שכמות, מבלי לעלות.' },
  { id: 'pl2', target: 'pull', name: 'עליות מתח', x: 88, y: 20, req: ['pl1'], desc: 'עלייה עד שהסנטר מעל המוט, ירידה איטית ומבוקרת.' },
  { id: 'pl3', target: 'pull', name: 'מתח רחב', x: 88, y: 35, req: ['pl2'], desc: 'אחיזה רחבה מרוחב הכתפיים. מפעיל הרחב הגדול.' },
  { id: 'pl4', target: 'pull', name: 'מאסל-אפ שלילי', x: 85, y: 55, req: ['pl3'], desc: 'ירידה מבוקרת ממאסל-אפ. בניית כוח למעבר.' },
  { id: 'pl5', target: 'pull', name: 'מאסל-אפ מלא', x: 85, y: 70, req: ['pl4'], desc: 'מעבר ממתח למקבילים בתנועה אחת רצופה.' },
  { id: 'pl6', target: 'pull', name: 'פרונט לבר', x: 85, y: 85, req: ['pl5'], desc: 'גוף אופקי מול המוט, פנים למעלה. כוח גב עצום.' },
  { id: 'pl7', target: 'pull', name: 'מתח יד אחת', x: 93, y: 55, req: ['pl3'], desc: 'עלייה מלאה עם יד אחת בלבד. אחד האתגרים הגדולים.' }
];

const BASE_WORKOUTS = {
  fbw: [
    { target: 'legs', name: 'סקוואט קלאסי', reps: '15' },
    { target: 'push', name: 'שכיבות סמיכה', reps: '12' },
    { target: 'core', name: 'פלאנק סטטי', reps: '45 שניות' },
    { target: 'pull', name: 'היתלות פסיבית', reps: '30 שניות' }
  ],
  upper: [
    { target: 'pull', name: 'עליות מתח', reps: '8' },
    { target: 'push', name: 'שכיבות סמיכה', reps: '15' },
    { target: 'push', name: 'מקבילים', reps: '10' },
    { target: 'shoulders', name: 'שכיבות פייק', reps: '30 שניות' }
  ],
  lower: [
    { target: 'legs', name: 'סקוואט קפיצה', reps: '15' },
    { target: 'legs', name: 'לאנג׳ים לאחור', reps: '12 לכל רגל' },
    { target: 'core', name: 'גשר אגן', reps: '15' },
    { target: 'legs', name: 'הרמות עקבים', reps: '20' }
  ]
};

const MEAL_PLANS = {
  training: {
    morning: [
      { name: 'שייק חלבון ושיבולת שועל', tags: ['lactose'], ings: 'חלב, סקופ חלבון, בננה, חמאת בוטנים' },
      { name: 'חביתת כוח עם טוסט מלא', tags: ['egg', 'gluten'], ings: 'ביצים שלמות, שמן זית, לחם מלא, אבוקדו' },
      { name: 'קערת יוגורט ופירות יער', tags: ['lactose', 'nuts'], ings: 'יוגורט חלבון 0%, שקדים, פירות יער קפואים' }
    ],
    lunch: [
      { name: 'חזה עוף ואורז', tags: [], ings: 'חזה עוף צלוי, אורז בסמטי, ברוקולי מאודה' },
      { name: 'קציצות בקר ופסטה מלאה', tags: ['gluten'], ings: 'בקר טחון רזה, פסטה מלאה, רוטב עגבניות' },
      { name: 'מוקפץ טופו וירקות', tags: ['soy'], ings: 'טופו קשה, אטריות אורז, שעועית ירוקה, ג׳ינג׳ר' }
    ],
    evening: [
      { name: 'סלט טונה חלבון גבוה', tags: ['fish', 'egg'], ings: 'טונה במים, ביצים קשות, סלט ירוק, טחינה מלאה' },
      { name: 'סטייק וירקות שורש', tags: [], ings: 'סינטה בקר, ירקות קלויים, שמן זית ולימון' },
      { name: 'סלמון אפוי ובטטה', tags: ['fish'], ings: 'פילה סלמון, בטטה, שמן זית, שום וצ׳ילי' }
    ]
  },
  rest: {
    morning: [
      { name: 'דייסת שיבולת שועל', tags: ['gluten'], ings: 'שיבולת שועל, חלב שקדים, קינמון, דבש' },
      { name: 'קערת פירות ואגוזים', tags: ['nuts'], ings: 'תפוח, בננה, אגז, אגוזי מלך קצוצים' },
      { name: 'טוסט אבוקדו', tags: ['egg', 'gluten'], ings: 'לחם מחיטה מלאה, אבוקדו, ביצה עין, לימון' }
    ],
    lunch: [
      { name: 'מרק עדשים שחורות', tags: [], ings: 'עדשים שחורות, גזר, סלרי, בצל, כמון' },
      { name: 'קערת בטטה וחומוס', tags: [], ings: 'בטטה אפויה, גרגירי חומוס, עלי תרד' },
      { name: 'קינואה וירקות קלויים', tags: [], ings: 'קינואה לבנה, קישואים, פלפלים, שמן זית' }
    ],
    evening: [
      { name: 'סלט יווני', tags: ['lactose'], ings: 'גבינה בולגרית 5%, זיתי קלמטה, עגבנייה, מלפפון' },
      { name: 'מרק ירקות עשיר', tags: [], ings: 'קישוא, כרובית, דלעת, שמיר, פטרוזיליה' },
      { name: 'סלט ניצן עם דגים', tags: ['fish'], ings: 'דג לבן מאודה, פירות ים, ירוקים, לימון' }
    ]
  },
  sick: {
    morning: [
      { name: 'תה ועוגיות יבשות', tags: ['gluten'], ings: 'תה נענע, כפית דבש, עוגיות פריכות' },
      { name: 'טוסט עם ריבה', tags: ['lactose', 'gluten'], ings: 'לחם לבן רך, ריבה, מעט חמאה' }
    ],
    lunch: [
      { name: 'מרק עוף של סבתא', tags: [], ings: 'עוף, אטריות דקות, גזר מבושל, נוזלים' },
      { name: 'פירה תפוחי אדמה', tags: ['lactose'], ings: 'תפוחי אדמה מבושלים, מעט חמאה, מלח' }
    ],
    evening: [
      { name: 'דייסת סולת', tags: ['gluten', 'lactose'], ings: 'חלב מחומם, סולת, סוכר חום, קינמון' },
      { name: 'פודינג וניל', tags: ['lactose'], ings: 'פודינג וניל חלק, קל לעיכול' }
    ]
  }
};

const ALLERGY_MAP = {
  'בוטנים': 'peanut', 'אגוזים': 'nuts', 'גלוטן': 'gluten',
  'לקטוז': 'lactose', 'ביצים': 'egg', 'דגים': 'fish', 'סויה': 'soy'
};

const DAYS_HE = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

// ==========================================
// HELPERS
// ==========================================
const calcTDEE = (w, h, a, gender, goal) => {
  const wN = Number(w) || 70;
  const hN = Number(h) || 175;
  const aN = Number(a) || 25;
  const bmr = gender === 'נקבה'
    ? (10 * wN) + (6.25 * hN) - (5 * aN) - 161
    : (10 * wN) + (6.25 * hN) - (5 * aN) + 5;
  const tdee = Math.round(bmr * 1.55);
  return goal?.includes('ירידה') ? tdee - 400 : tdee + 350;
};

const generateWorkout = (type, mastered, duration) => {
  let plan = [...BASE_WORKOUTS[type]];
  mastered.forEach(id => {
    const sk = SKILLS.find(s => s.id === id);
    if (!sk) return;
    const idx = plan.findIndex(e => e.target === sk.target);
    if (idx !== -1) plan[idx] = { ...sk, isMastered: true };
  });
  let exCount = 4, sets = 3;
  if (duration === 45) { exCount = 5; sets = 3; }
  if (duration === 60) { exCount = 5; sets = 4; }
  if (duration === 90) { exCount = 6; sets = 4; }
  if (exCount > plan.length) {
    plan.push(
      { target: 'core', name: 'כפיפות בטן מלאות', reps: '20' },
      { target: 'core', name: 'הרמות רגליים', reps: '15' }
    );
  }
  return plan.slice(0, exCount).map(e => ({ ...e, sets, reps: e.reps || '10' }));
};

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [answers, setAnswers] = useState({});
  const [qIdx, setQIdx] = useState(0);
  const [localInput, setLocalInput] = useState('');
  const [xp, setXp] = useState(0);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);
  const [mastered, setMastered] = useState([]);
  const [toast, setToast] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [scrolledHealth, setScrolledHealth] = useState(false);

  // Persistent storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('flexfit_v2');
      if (saved) {
        const d = JSON.parse(saved);
        setAnswers(d.ans || {});
        setXp(d.xp || 0);
        setCompletedWorkouts(d.workouts || 0);
        setMastered(d.mastered || []);
        setAgreed(true);
        setScreen('app');
      }
    } catch (e) {}
  }, []);

  const saveData = (newXp, newWorkouts, newMastered, newAnswers = answers) => {
    setXp(newXp); setCompletedWorkouts(newWorkouts); setMastered(newMastered);
    try { localStorage.setItem('flexfit_v2', JSON.stringify({ ans: newAnswers, xp: newXp, workouts: newWorkouts, mastered: newMastered })); } catch (e) {}
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const addXP = (n) => { const newXp = xp + n; saveData(newXp, completedWorkouts, mastered); showToast(`+${n} XP 🔥`); };

  const resetApp = () => {
    try { localStorage.removeItem('flexfit_v2'); } catch (e) {}
    setScreen('splash'); setAnswers({}); setQIdx(0); setXp(0); setCompletedWorkouts(0); setMastered([]); setAgreed(false); setScrolledHealth(false);
  };

  // Filter equip question for gym users
  const filteredQ = useMemo(() =>
    QUESTIONS.filter(q => !(q.id === 'equip' && answers.location?.includes('חדר כושר'))),
    [answers.location]
  );

  const activeQ = filteredQ[qIdx];

  useEffect(() => { setLocalInput(answers[activeQ?.id] || ''); }, [qIdx, activeQ?.id]);

  const canProceed = () => {
    if (!activeQ) return false;
    if (activeQ.type === 'text' || activeQ.type === 'number') return localInput.toString().trim() !== '';
    const a = answers[activeQ.id];
    if (Array.isArray(a)) return a.length > 0;
    return !!a;
  };

  const goNext = () => {
    let newAns = { ...answers };
    if (activeQ.type === 'text' || activeQ.type === 'number') newAns[activeQ.id] = localInput;
    setAnswers(newAns);
    if (qIdx < filteredQ.length - 1) setQIdx(qIdx + 1);
    else { saveData(0, 0, [], newAns); setScreen('app'); }
  };

  const setChoiceAnswer = (opt) => {
    let newAns = { ...answers, [activeQ.id]: opt };
    if (activeQ.id === 'location' && opt.includes('חדר כושר')) {
      newAns.equip = ['מוט מתח','מקבילים','טבעות אולימפיות','גומיות התנגדות','פרלטס'];
    }
    setAnswers(newAns);
    if (qIdx < filteredQ.length - 1) setQIdx(qIdx + 1);
    else { saveData(0, 0, [], newAns); setScreen('app'); }
  };

  const toggleMulti = (opt) => {
    const cur = answers[activeQ.id] || [];
    const excl = ['ללא', 'ללא פציעות', 'ללא ציוד בכלל'];
    let next;
    if (excl.includes(opt)) next = [opt];
    else {
      const filtered = cur.filter(x => !excl.includes(x));
      next = filtered.includes(opt) ? filtered.filter(x => x !== opt) : [...filtered, opt];
    }
    setAnswers({ ...answers, [activeQ.id]: next });
  };

  // ==========================================
  // SCREENS
  // ==========================================
  if (screen === 'splash') return (
    <div dir="rtl" className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{fontFamily:'system-ui,sans-serif'}}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600 rounded-full opacity-15 blur-[100px]"/>
      <div className="relative z-10 text-center w-full max-w-sm">
        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/50">
          <Flame className="w-12 h-12 text-white" strokeWidth={2.5}/>
        </div>
        <h1 className="text-6xl font-black text-white mb-3 tracking-tight">FlexFit</h1>
        <p className="text-zinc-400 text-lg mb-12 font-medium">המכונה המושלמת לקליסטניקס.</p>
        <button onClick={() => setScreen('health')} className="w-full bg-white text-black font-black py-5 rounded-2xl text-xl hover:scale-105 transition-transform shadow-2xl">
          התחל איפיון מקיף
        </button>
      </div>
    </div>
  );

  if (screen === 'health') return (
    <div dir="rtl" className="min-h-screen bg-black flex flex-col p-6" style={{fontFamily:'system-ui,sans-serif'}}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col pt-4">
        <div className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-2">מסמך משפטי מחייב</div>
        <h2 className="text-3xl font-black text-white mb-6">בטיחות לפני הכל.</h2>

        <div
          onScroll={e => { if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 20) setScrolledHealth(true); }}
          className="flex-1 bg-zinc-900 rounded-3xl p-6 border border-zinc-800 mb-5 overflow-y-auto max-h-[50vh] space-y-4 text-zinc-300 text-sm leading-relaxed"
        >
          <p><strong className="text-white block mb-1">1. פטור נזיקין מוחלט:</strong>האימונים באחריותך הבלעדית. איננו נושאים באחריות לפציעה או נזק גופני.</p>
          <p><strong className="text-white block mb-1">2. אישור רפואי:</strong>חובה להתייעץ עם גורם רפואי מוסמך טרם תחילת כל תוכנית אימונים.</p>
          <p><strong className="text-white block mb-1">3. אין אגו בקליסטניקס:</strong>הרגשת כאב חד, סחרחורת או בחילה? הפסק מיידית. עבודה על פציעה תחמיר אותה.</p>
          <p><strong className="text-white block mb-1">4. המלצות תזונה:</strong>התפריטים הם המלצה כללית TDEE בלבד. התאמות לאלרגיות ומצבים רפואיים - באחריותך המלאה.</p>
          <p><strong className="text-white block mb-1">5. גיל מינימלי:</strong>האפליקציה מיועדת מגיל 14. מתחת לגיל 18 נדרש אישור הורה.</p>
          <p><strong className="text-white block mb-1">6. הגבלת אחריות:</strong>FlexFit ויוצריה אינם אחראים לכל נזק הנובע משימוש באפליקציה. השימוש מהווה ויתור על כל תביעה.</p>
        </div>

        {!scrolledHealth && (
          <div className="text-center text-xs text-orange-500 font-bold mb-3 animate-pulse">↓ גלול עד הסוף להמשך</div>
        )}

        <button
          type="button"
          onClick={() => scrolledHealth && setAgreed(!agreed)}
          disabled={!scrolledHealth}
          className={`flex justify-between items-center p-5 rounded-2xl border-2 mb-4 transition-all w-full text-right ${!scrolledHealth ? 'opacity-40 cursor-not-allowed border-zinc-800' : agreed ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-700 hover:border-zinc-600 cursor-pointer'}`}
        >
          <div className={`w-6 h-6 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${agreed ? 'bg-orange-500 border-orange-500' : 'border-zinc-500'}`}>
            {agreed && <Check className="w-4 h-4 text-white" strokeWidth={3}/>}
          </div>
          <span className="font-bold text-sm text-white">קראתי, הבנתי ואני מאשר/ת הכל</span>
        </button>

        <button disabled={!agreed} onClick={() => setScreen('q')}
          className={`w-full py-4 rounded-2xl font-black text-xl transition-all ${agreed ? 'bg-white text-black active:scale-95 shadow-xl' : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'}`}>
          המשך לשאלון המקצועי
        </button>
      </div>
    </div>
  );

  if (screen === 'q') return (
    <div dir="rtl" className="min-h-screen bg-black flex flex-col p-6" style={{fontFamily:'system-ui,sans-serif'}}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4 pt-4">
          <button onClick={() => qIdx === 0 ? setScreen('health') : setQIdx(qIdx - 1)} className="text-zinc-500 text-2xl font-black p-2 hover:text-white">›</button>
          <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">שאלה {qIdx + 1} מתוך {filteredQ.length}</div>
        </div>
        <div className="w-full h-1.5 bg-zinc-900 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-gradient-to-l from-orange-500 to-red-600 transition-all duration-300" style={{width:`${((qIdx+1)/filteredQ.length)*100}%`}}/>
        </div>
        <h2 className="text-3xl font-black text-white mb-8 leading-tight">{activeQ.q}</h2>

        <div className="flex-1 overflow-y-auto pb-6 space-y-3">
          {activeQ.type === 'choice' && activeQ.options.map(opt => (
            <button key={opt} onClick={() => setChoiceAnswer(opt)}
              className={`w-full p-5 rounded-2xl border-2 text-right font-bold text-lg transition-all ${answers[activeQ.id] === opt ? 'border-orange-500 bg-orange-500/10 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
              {opt}
            </button>
          ))}
          {(activeQ.type === 'multi' || activeQ.type === 'days') && activeQ.options.map(opt => {
            const sel = (answers[activeQ.id] || []).includes(opt);
            return (
              <button key={opt} onClick={() => toggleMulti(opt)}
                className={`w-full flex justify-between items-center p-5 rounded-2xl border-2 font-bold text-lg transition-all ${sel ? 'bg-orange-500/10 border-orange-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                {sel ? <Check className="w-5 h-5 text-orange-500"/> : <span/>}
                <span>{opt}</span>
              </button>
            );
          })}
          {(activeQ.type === 'text' || activeQ.type === 'number') && (
            <input type={activeQ.type} placeholder={activeQ.placeholder} min={activeQ.min} max={activeQ.max} value={localInput}
              onChange={e => setLocalInput(e.target.value)}
              className="w-full bg-zinc-900 p-5 rounded-2xl border border-zinc-800 text-xl text-white font-bold text-right outline-none focus:border-orange-500 transition-colors" autoFocus/>
          )}
        </div>

        {(activeQ.type === 'multi' || activeQ.type === 'days' || activeQ.type === 'text' || activeQ.type === 'number') && (
          <button disabled={!canProceed()} onClick={goNext}
            className={`w-full py-4 rounded-2xl font-black mt-4 text-xl transition-all ${canProceed() ? 'bg-white text-black active:scale-95 shadow-lg' : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'}`}>
            המשך
          </button>
        )}
      </div>
    </div>
  );

  // MAIN APP
  return (
    <div dir="rtl" className="min-h-screen bg-black" style={{fontFamily:'system-ui,sans-serif'}}>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-3 rounded-full shadow-2xl font-black text-sm tracking-wide">
          {toast}
        </div>
      )}
      <MainApp
        answers={answers} xp={xp} mastered={mastered} completedWorkouts={completedWorkouts}
        saveData={saveData} showToast={showToast} addXP={addXP} resetApp={resetApp}
      />
    </div>
  );
}

// ==========================================
// MAIN APP TABS
// ==========================================
function MainApp({ answers, xp, mastered, completedWorkouts, saveData, showToast, addXP, resetApp }) {
  const [tab, setTab] = useState('home');
  const [workoutDuration, setWorkoutDuration] = useState(null);

  return (
    <div className="max-w-md mx-auto relative">
      <div className="pb-24 min-h-screen">
        {tab === 'home' && !workoutDuration && (
          <Dashboard answers={answers} xp={xp} mastered={mastered} completedWorkouts={completedWorkouts}
            onStart={d => setWorkoutDuration(d)} resetApp={resetApp}/>
        )}
        {tab === 'home' && workoutDuration && (
          <WorkoutPlayer answers={answers} mastered={mastered} duration={workoutDuration}
            onFinish={() => {
              const newXp = xp + 100;
              const newW = completedWorkouts + 1;
              saveData(newXp, newW, mastered);
              showToast('🔥 אימון הושלם בהצלחה! +100 XP');
              setWorkoutDuration(null);
            }}
            onExit={() => setWorkoutDuration(null)}/>
        )}
        {tab === 'skills' && !workoutDuration && (
          <SkillTree xp={xp} mastered={mastered}
            toggleSkill={id => {
              const newM = mastered.includes(id) ? mastered.filter(x => x !== id) : [...mastered, id];
              saveData(xp, completedWorkouts, newM);
              const sk = SKILLS.find(s => s.id === id);
              showToast(mastered.includes(id) ? `${sk.name} הוסר` : `🔥 ${sk.name} יוזרק לאימונים!`);
            }}
            showToast={showToast}/>
        )}
        {tab === 'nutrition' && !workoutDuration && (
          <NutritionView answers={answers}/>
        )}
        {tab === 'notifications' && !workoutDuration && (
          <NotificationsView answers={answers}/>
        )}
      </div>

      {!workoutDuration && (
        <nav className="fixed bottom-0 w-full max-w-md bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-900 flex justify-around p-3 pb-4 rounded-t-3xl z-40">
          <TabBtn active={tab==='home'} onClick={() => setTab('home')} icon="🏠" label="בית"/>
          <TabBtn active={tab==='skills'} onClick={() => setTab('skills')} icon="🌳" label="מיומנויות"/>
          <TabBtn active={tab==='nutrition'} onClick={() => setTab('nutrition')} icon="🥩" label="תזונה"/>
          <TabBtn active={tab==='notifications'} onClick={() => setTab('notifications')} icon="🔔" label="התראות"/>
        </nav>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center transition-all duration-300 ${active ? 'text-white scale-110 -translate-y-1' : 'text-zinc-600 hover:text-zinc-400'}`}>
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-[10px] font-bold tracking-wider">{label}</span>
    </button>
  );
}

// ==========================================
// DASHBOARD
// ==========================================
function Dashboard({ answers, xp, mastered, completedWorkouts, onStart, resetApp }) {
  const todayName = DAYS_HE[new Date().getDay()];
  const isWorkoutDay = answers.days?.includes(todayName);
  const [showModal, setShowModal] = useState(false);

  const daysCount = answers.days?.length || 0;
  let workoutType = 'fbw', workoutTitle = 'פולבאדי (גוף שלם)';
  if (daysCount >= 3 && isWorkoutDay) {
    workoutType = answers.days.indexOf(todayName) % 2 === 0 ? 'upper' : 'lower';
    workoutTitle = workoutType === 'upper' ? 'פלג גוף עליון' : 'פלג גוף תחתון';
  }

  // Preview with mastered skills
  let preview = [...BASE_WORKOUTS[workoutType]];
  mastered.forEach(id => {
    const sk = SKILLS.find(s => s.id === id);
    if (!sk) return;
    const idx = preview.findIndex(e => e.target === sk.target && !e.isMastered);
    if (idx !== -1) preview[idx] = { ...sk, isMastered: true };
  });

  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <div className="p-6 pt-8">
      <div className="flex justify-between items-center mb-8">
        <button onClick={resetApp} className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full font-bold hover:text-red-400 hover:border-red-800 transition-colors">
          איפוס נתונים
        </button>
        <div className="text-right">
          <div className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-1">יום {todayName}</div>
          <h1 className="text-3xl font-black text-white">שלום, {answers.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 rounded-full blur-3xl opacity-20"/>
          <div className="text-5xl font-black text-white">{level}</div>
          <div className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-1">רמה · {xp} XP</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500 rounded-full blur-3xl opacity-20"/>
          <div className="text-5xl font-black text-white">{completedWorkouts}</div>
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">אימונים הושלמו</div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-zinc-500 font-bold">התקדמות לרמה {level+1}</span>
          <span className="text-xs text-orange-500 font-bold">{xpInLevel}/100</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all" style={{width:`${xpInLevel}%`}}/>
        </div>
      </div>

      {isWorkoutDay ? (
        <div className="bg-gradient-to-bl from-orange-600 to-red-700 p-7 rounded-[32px] shadow-2xl shadow-orange-500/30 text-white relative overflow-hidden">
          <div className="absolute -top-4 -left-4 text-8xl font-black italic opacity-20 -rotate-12">⚡</div>
          <div className="relative z-10">
            <div className="text-xs font-black text-orange-200 uppercase tracking-widest mb-2">האימון המחושב להיום</div>
            <h3 className="text-4xl font-black mb-5">{workoutTitle}</h3>

            <div className="bg-black/40 rounded-2xl p-4 mb-6 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-orange-300 mb-2">תצוגה מקדימה:</div>
              {preview.slice(0, 4).map(e => (
                <div key={e.name} className="flex justify-between items-center text-sm pb-2 border-b border-white/10 last:border-0">
                  {e.isMastered ? <span className="text-[9px] bg-white text-orange-600 font-black px-2 py-0.5 rounded-md">🔥 מהעץ</span> : <span/>}
                  <span className={`font-bold ${e.isMastered ? 'text-white' : 'text-zinc-300'}`}>{e.name}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setShowModal(true)} className="w-full bg-white text-black font-black py-4 rounded-2xl text-xl active:scale-95 transition-transform shadow-xl">
              התחל אימון עכשיו
            </button>
          </div>
        </div>
      ) : (
        <div className="p-10 bg-zinc-900 rounded-[32px] border border-zinc-800 text-center">
          <div className="text-7xl mb-5">🔋</div>
          <h3 className="text-3xl font-black text-white mb-3">יום מנוחה מתוכנן</h3>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">השריר נקרע באימון ונבנה בזמן מנוחה. תן לגוף זמן להתאושש.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex justify-center items-center z-50 p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-7 w-full max-w-sm text-right relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 rounded-full blur-3xl opacity-20"/>
            <h3 className="text-3xl font-black text-white mb-2 relative z-10">כמה זמן יש לך?</h3>
            <p className="text-zinc-400 text-sm mb-7 relative z-10">המנוע יחשב את כמות הסטים והתרגילים בהתאם.</p>
            <div className="space-y-3 relative z-10">
              {[
                { d: 30, label: '30 דקות', desc: '3 סטים · 4 תרגילים' },
                { d: 45, label: '45 דקות', desc: '3 סטים · 5 תרגילים · קלאסי', highlight: true },
                { d: 60, label: '60 דקות', desc: '4 סטים · 5 תרגילים · מלא' },
                { d: 90, label: '90 דקות', desc: '4 סטים · 6 תרגילים · נפח מקסימלי' }
              ].map(({ d, label, desc, highlight }) => (
                <button key={d} onClick={() => { setShowModal(false); onStart(d); }}
                  className={`w-full flex justify-between items-center p-4 rounded-2xl font-bold text-lg transition-all ${highlight ? 'bg-orange-500/10 border border-orange-500 text-white' : 'bg-zinc-950 border border-zinc-800 text-white hover:border-orange-500/50'}`}>
                  <span className={`text-sm ${highlight ? 'text-orange-400' : 'text-zinc-500'}`}>{desc}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(false)} className="w-full mt-6 text-zinc-500 font-bold text-sm uppercase tracking-widest hover:text-white transition-colors relative z-10">ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// WORKOUT PLAYER
// ==========================================
function WorkoutPlayer({ answers, mastered, duration, onFinish, onExit }) {
  const todayName = DAYS_HE[new Date().getDay()];
  const daysCount = answers.days?.length || 0;
  let type = 'fbw';
  if (daysCount >= 3 && answers.days?.includes(todayName)) {
    type = answers.days.indexOf(todayName) % 2 === 0 ? 'upper' : 'lower';
  }

  const plan = useMemo(() => generateWorkout(type, mastered, duration), [type, mastered, duration]);
  const restTime = answers.goal?.includes('ירידה') ? 60 : 90;

  const [exIdx, setExIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!resting || timer <= 0) { if (resting && timer === 0) setResting(false); return; }
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resting, timer]);

  const finishSet = () => {
    const ex = plan[exIdx];
    if (setIdx + 1 < ex.sets) {
      setSetIdx(setIdx + 1); setTimer(restTime); setResting(true);
    } else if (exIdx + 1 < plan.length) {
      setExIdx(exIdx + 1); setSetIdx(0); setTimer(restTime); setResting(true);
    } else {
      setDone(true);
    }
  };

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/50">
        <Award className="w-12 h-12 text-white"/>
      </div>
      <h2 className="text-4xl font-black text-white mb-2">כל הכבוד!</h2>
      <p className="text-zinc-400 mb-8">השלמת את האימון בהצלחה</p>
      <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 mb-6 w-full max-w-xs space-y-3">
        <div className="flex justify-between"><span className="text-zinc-400">תרגילים</span><span className="font-black text-white">{plan.length}</span></div>
        <div className="flex justify-between"><span className="text-zinc-400">סטים סה״כ</span><span className="font-black text-white">{plan.reduce((s,e)=>s+e.sets,0)}</span></div>
        <div className="flex justify-between"><span className="text-zinc-400">XP הרווחת</span><span className="font-black text-orange-500">+100</span></div>
      </div>
      <button onClick={() => { onFinish(); }} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 rounded-2xl text-xl max-w-xs">
        סיום ושמירה
      </button>
    </div>
  );

  const ex = plan[exIdx];
  const totalSets = plan.reduce((s,e)=>s+e.sets,0);
  const doneSets = plan.slice(0,exIdx).reduce((s,e)=>s+e.sets,0) + setIdx;
  const progress = (doneSets / totalSets) * 100;

  if (resting) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-orange-600 opacity-5"/>
      <div className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-6 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/30">
        זמן התאוששות שריר חובה
      </div>
      <div className="text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 leading-none tabular-nums">{timer}</div>
      <p className="text-zinc-500 font-bold uppercase mt-6 tracking-widest text-sm">שניות נותרו</p>
      <p className="text-xs text-zinc-700 mt-3 border border-zinc-900 rounded-xl px-4 py-2">⏱️ הטיימר קבוע ולא ניתן לדלג</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 flex flex-col text-center justify-between bg-black">
      <div>
        <div className="flex justify-between items-center mb-3 text-xs text-zinc-500">
          <span>תרגיל {exIdx+1}/{plan.length}</span>
          <span className="text-orange-500 font-bold">{doneSets}/{totalSets} סטים</span>
        </div>
        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mb-12">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all" style={{width:`${progress}%`}}/>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
          סט {setIdx+1} מתוך {ex.sets}
        </div>
        {ex.isMastered && <div className="text-orange-500 font-black text-sm mb-3">🔥 תרגיל מתקדם מהעץ</div>}
        <h2 className="text-5xl font-black text-white mb-8 leading-tight">{ex.name}</h2>
        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-2">{ex.reps}</div>
        <div className="text-zinc-500 font-bold uppercase tracking-widest text-sm">חזרות / זמן</div>
      </div>

      <div>
        <button onClick={finishSet} className="w-full bg-white text-black py-6 rounded-[28px] font-black text-2xl shadow-2xl active:scale-95 transition-transform mb-4">
          סיימתי את הסט ✓
        </button>
        <button onClick={onExit} className="text-zinc-600 font-bold text-sm uppercase tracking-widest hover:text-white transition-colors">
          יציאה מוקדמת
        </button>
      </div>
    </div>
  );
}

// ==========================================
// SKILL TREE
// ==========================================
function SkillTree({ xp, mastered, toggleSkill, showToast }) {
  const [selected, setSelected] = useState(null);

  const isUnlocked = (skill) => {
    if (!skill.req || skill.req.length === 0) return true;
    return skill.req.every(id => mastered.includes(id));
  };

  const handleClick = (skill) => {
    if (!isUnlocked(skill)) { showToast('🔒 השלם את תרגיל הקדם קודם!'); return; }
    toggleSkill(skill.id);
  };

  return (
    <div className="p-6 pt-8">
      <h1 className="text-4xl font-black text-white mb-2">עץ מיומנויות</h1>
      <p className="text-zinc-400 text-sm mb-6">לחץ על תרגיל פתוח כדי להזריק אותו לאימון. <span className="text-orange-500 font-bold">{SKILLS.filter(s => isUnlocked(s)).length}</span> זמינים.</p>

      <div className="bg-zinc-950 rounded-[32px] border border-zinc-900 mb-6 relative overflow-hidden" style={{height: 820}}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{zIndex:0}}>
          {SKILLS.map(skill => skill.req.map(reqId => {
            const parent = SKILLS.find(s => s.id === reqId);
            if (!parent) return null;
            const active = mastered.includes(reqId);
            return (
              <line key={`${parent.id}-${skill.id}`}
                x1={parent.x} y1={100-parent.y} x2={skill.x} y2={100-skill.y}
                stroke={active ? '#f97316' : '#27272a'}
                strokeWidth={active ? '0.8' : '0.4'}
                opacity={active ? 0.9 : 0.5}/>
            );
          }))}
        </svg>

        <div className="relative w-full h-full" style={{zIndex:10}}>
          {SKILLS.map(skill => {
            const isMast = mastered.includes(skill.id);
            const unlocked = isUnlocked(skill);

            if (isMast) return (
              <button key={skill.id} onClick={() => handleClick(skill)}
                className="absolute -translate-x-1/2 translate-y-1/2 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl px-3 py-2 shadow-[0_0_20px_rgba(249,115,22,0.8)] hover:scale-110 transition-transform flex flex-col items-center"
                style={{left:`${skill.x}%`, bottom:`${skill.y}%`}}>
                <span className="text-[11px] font-black text-white whitespace-nowrap">{skill.name}</span>
                <span className="text-[9px] text-black font-black bg-white/90 px-1.5 py-0.5 rounded-full mt-1">✓ הצלחתי</span>
              </button>
            );

            if (unlocked) return (
              <button key={skill.id} onClick={() => { handleClick(skill); setSelected(skill); }}
                className="absolute -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full bg-black border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:scale-110 transition-transform flex flex-col items-center justify-center"
                style={{left:`${skill.x}%`, bottom:`${skill.y}%`}}>
                <span className="text-[9px] font-black text-white text-center px-1 leading-tight">{skill.name}</span>
              </button>
            );

            return (
              <button key={skill.id} onClick={() => handleClick(skill)}
                className="absolute -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full border border-zinc-800 bg-zinc-950 opacity-60 hover:opacity-100 flex flex-col items-center justify-center"
                style={{left:`${skill.x}%`, bottom:`${skill.y}%`}}>
                <span className="text-[10px]">🔒</span>
                <span className="text-[7px] text-zinc-600 font-bold px-1 text-center leading-none">{skill.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
              <div className="text-right">
                <div className="text-xs text-orange-500 font-bold uppercase mb-1">תרגיל מתקדם</div>
                <h3 className="text-2xl font-black text-white">{selected.name}</h3>
              </div>
            </div>
            <div className="bg-black rounded-xl p-4 border border-zinc-800 mb-3">
              <p className="text-sm text-zinc-300 leading-relaxed">{selected.desc}</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 text-xs text-orange-300">
              <strong className="text-orange-400">בטיחות:</strong> עצור מיד אם יש כאב חד. התחל עם חזרות נמוכות.
            </div>
            <button onClick={() => { handleClick(selected); setSelected(null); }}
              className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-3 rounded-xl">
              {mastered.includes(selected.id) ? 'הסר מהאימונים' : '🔥 הוסף לאימון'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// NUTRITION
// ==========================================
function NutritionView({ answers }) {
  const [mood, setMood] = useState('training');
  const [refresh, setRefresh] = useState(0);

  const isCut = answers.goal?.includes('ירידה');
  const tdee = useMemo(() => calcTDEE(answers.weight, answers.height, answers.age, answers.gender, answers.goal), [answers]);
  const scale = tdee / 2500;
  const chickenG = Math.max(100, Math.round(250 * scale));
  const eggsN = Math.max(2, Math.round(4 * scale));

  const userAllergies = answers.allergies || [];
  const noAllergies = !userAllergies.length || userAllergies.includes('ללא');
  const allergySet = new Set(userAllergies.map(a => ALLERGY_MAP[a]).filter(Boolean));

  const getMeal = (time) => {
    const options = (MEAL_PLANS[mood][time] || []).filter(m =>
      noAllergies || !m.tags.some(t => allergySet.has(t))
    );
    if (!options.length) return { name: 'לא נמצאה ארוחה מתאימה', ings: 'נסה לשנות הגדרות אלרגיה.' };
    return options[(refresh + time.length) % options.length];
  };

  return (
    <div className="p-6 pt-8">
      <h1 className="text-4xl font-black text-white mb-1">תזונה חכמה</h1>
      <p className="text-zinc-400 text-sm mb-6">מחושב ל-<span className="text-orange-500 font-bold">{tdee}</span> קל׳ ביום · {isCut ? 'חיטוב' : 'מסה'}</p>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {[
          { k: 'training', label: '⚡ מתאמן היום', color: 'bg-orange-600' },
          { k: 'rest', label: '🧘 מנוחה', color: 'bg-green-700' },
          { k: 'sick', label: '🤒 חולה', color: 'bg-blue-600' }
        ].map(({ k, label, color }) => (
          <button key={k} onClick={() => setMood(k)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all ${mood === k ? `${color} text-white scale-105 shadow-lg` : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}>
            {label}
          </button>
        ))}
      </div>

      <button onClick={() => setRefresh(r => r + 1)}
        className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-2xl mb-6 font-black text-orange-500 active:scale-95 transition-transform flex justify-center items-center gap-3 shadow-sm">
        <RotateCcw className="w-5 h-5"/> ערבב תפריט
      </button>

      {['morning', 'lunch', 'evening'].map(time => {
        const meal = getMeal(time);
        const label = time === 'morning' ? 'ארוחת בוקר' : time === 'lunch' ? 'ארוחת צהריים' : 'ארוחת ערב';
        const kcal = Math.round((time === 'lunch' ? 0.4 : 0.3) * tdee);
        const customIng = meal.ings?.replace(/\d+ג/g, `${chickenG}ג`).replace(/\d+ ביצים/g, `${eggsN} ביצים`) || '';

        return (
          <div key={time} className="bg-zinc-900 p-6 rounded-[24px] border border-zinc-800 mb-5 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-orange-500 to-red-600"/>
            <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">{label}</div>
            <h3 className="text-2xl font-black text-white mb-4">{meal.name}</h3>
            <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-zinc-800">
                <span className="text-orange-500 font-bold text-xs">כמויות אישיות עבורך:</span>
                <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400 font-bold">~{kcal} קק״ל</span>
              </div>
              <span className="text-white/90">{customIng}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// NOTIFICATIONS
// ==========================================
const NOTIF_SLOTS = [
  { id: 'morning',    hour: 7,  min: 0,  icon: '☀️', title: 'בוקר טוב!',      bodyFn: (isW, g, n) => `${n}, היום ${isW ? 'יום אימון 💪' : 'יום מנוחה 🔋'}` },
  { id: 'breakfast',  hour: 8,  min: 30, icon: '🍳', title: 'ארוחת בוקר',     bodyFn: (isW, g) => g === 'מסה' ? 'תזין אנרגיה - שייק + פחמימות!' : 'ארוחה חלבונית להתחלה מנצחת' },
  { id: 'lunch',      hour: 13, min: 0,  icon: '🥗', title: 'ארוחת צהריים',   bodyFn: (isW, g) => `בדוק תפריט ${g} בלשונית תזונה` },
  { id: 'preworkout', hour: 17, min: 30, icon: '💪', title: 'הכנה לאימון',    bodyFn: (isW) => isW ? 'חימום ומים - האימון עוד שעה!' : 'יום מנוחה - מתיחות קלות' },
  { id: 'workout',    hour: 18, min: 0,  icon: '🔥', title: 'זמן אימון!',     bodyFn: (isW, g, n) => isW ? `${n}, FlexFit מחכה לך!` : 'יום מנוחה - הגוף מתחזק' },
  { id: 'dinner',     hour: 19, min: 30, icon: '🍽️', title: 'ארוחת ערב',      bodyFn: (isW, g) => `ארוחת ערב חכמה לתוכנית ${g}` },
  { id: 'sleep',      hour: 22, min: 0,  icon: '😴', title: 'זמן שינה',       bodyFn: (isW, g, n) => `${n}, שינה = בנייה. לך לישון!` },
];

function NotificationsView({ answers }) {
  const isWorkoutToday = answers.days?.includes(DAYS_HE[new Date().getDay()]);
  const goal = answers.goal?.includes('ירידה') ? 'חיטוב' : 'מסה';
  const name = answers.name || '';

  const [perm, setPerm] = useState(() => {
    try { return Notification.permission; } catch { return 'unsupported'; }
  });

  const [enabled, setEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_notifs') || '{}'); } catch { return {}; }
  });

  const saveEnabled = (next) => {
    setEnabled(next);
    try { localStorage.setItem('ff_notifs', JSON.stringify(next)); } catch {}
  };

  // Scheduler - fires every 30s, sends notification if time matches
  useEffect(() => {
    if (perm !== 'granted') return;
    const tick = () => {
      const now = new Date();
      NOTIF_SLOTS.forEach(slot => {
        if (enabled[slot.id] === false) return;
        if (now.getHours() === slot.hour && now.getMinutes() === slot.min && now.getSeconds() < 30) {
          const body = slot.bodyFn(isWorkoutToday, goal, name);
          try { new Notification(`${slot.icon} ${slot.title}`, { body, dir: 'rtl', lang: 'he', tag: slot.id }); } catch {}
        }
      });
    };
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [perm, enabled, isWorkoutToday, goal, name]);

  const requestPerm = async () => {
    try {
      const r = await Notification.requestPermission();
      setPerm(r);
      return r;
    } catch { return 'unsupported'; }
  };

  const ensurePermAndRun = async (fn) => {
    if (perm === 'denied') return;
    const p = perm !== 'granted' ? await requestPerm() : perm;
    if (p === 'granted') fn();
  };

  const sendTest = (slot) => ensurePermAndRun(() => {
    const body = slot.bodyFn(isWorkoutToday, goal, name);
    try { new Notification(`${slot.icon} ${slot.title}`, { body, dir: 'rtl', lang: 'he', tag: slot.id + '_test' }); } catch {}
  });

  const toggleSlot = (id) => ensurePermAndRun(() => {
    saveEnabled({ ...enabled, [id]: enabled[id] === false ? true : false });
  });

  const toggleAll = () => ensurePermAndRun(() => {
    const allOn = NOTIF_SLOTS.every(s => enabled[s.id] !== false);
    const next = {};
    NOTIF_SLOTS.forEach(s => { next[s.id] = !allOn; });
    saveEnabled(next);
  });

  const allOn = NOTIF_SLOTS.every(s => enabled[s.id] !== false);

  const banners = {
    granted:     { text: '✅ הרשאה ניתנה — התראות פעילות',            cls: 'bg-green-500/10 border-green-500/40 text-green-300' },
    denied:      { text: '❌ חסום בדפדפן — שנה בהגדרות הדפדפן לאתר זה', cls: 'bg-red-500/10 border-red-500/40 text-red-300' },
    default:     { text: '⚠️ טרם אושר — לחץ "הפעל" כדי לאשר התראות',  cls: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-300' },
    unsupported: { text: '🚫 הדפדפן אינו תומך בהתראות',                cls: 'bg-zinc-800 border-zinc-700 text-zinc-400' },
  };
  const banner = banners[perm] || banners.default;

  return (
    <div className="p-6 pt-8">
      <h1 className="text-4xl font-black text-white mb-1">התראות</h1>
      <p className="text-zinc-400 text-sm mb-5">שלוט בכל התראה בנפרד</p>

      {/* Permission banner */}
      <div className={`border rounded-2xl p-4 mb-5 flex items-center justify-between gap-3 ${banner.cls}`}>
        <span className="text-xs font-bold leading-snug flex-1 text-right">{banner.text}</span>
        {perm === 'default' && (
          <button onClick={requestPerm}
            className="bg-orange-500 text-white font-black px-4 py-2 rounded-xl text-sm active:scale-95 transition-transform flex-shrink-0">
            הפעל
          </button>
        )}
      </div>

      {/* Master toggle */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-5 flex justify-between items-center">
        <button onClick={toggleAll}
          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${allOn && perm === 'granted' ? 'bg-orange-500' : 'bg-zinc-700'}`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${allOn && perm === 'granted' ? 'right-0.5' : 'left-0.5'}`}/>
        </button>
        <div className="text-right">
          <div className="font-black text-white text-sm">הפעל / כבה הכל</div>
          <div className="text-xs text-zinc-500">{NOTIF_SLOTS.filter(s => enabled[s.id] !== false).length} מתוך {NOTIF_SLOTS.length} פעילות</div>
        </div>
      </div>

      {/* Individual slots */}
      <div className="space-y-3">
        {NOTIF_SLOTS.map(slot => {
          const isOn = enabled[slot.id] !== false;
          const active = isOn && perm === 'granted';
          const body = slot.bodyFn(isWorkoutToday, goal, name);
          return (
            <div key={slot.id} className={`bg-zinc-900 rounded-2xl border transition-all ${active ? 'border-zinc-700' : 'border-zinc-900'}`}>
              <div className="flex items-center gap-3 p-4">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-all ${active ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30' : 'bg-zinc-800'}`}>
                  {slot.icon}
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-xs font-bold tabular-nums ${active ? 'text-orange-400' : 'text-zinc-600'}`}>
                      {String(slot.hour).padStart(2,'0')}:{String(slot.min).padStart(2,'0')}
                    </span>
                    <span className="font-bold text-white text-sm">{slot.title}</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-snug truncate">{body}</p>
                </div>
                <button onClick={() => toggleSlot(slot.id)}
                  className={`w-11 h-6 rounded-full relative transition-all duration-300 flex-shrink-0 ${active ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${active ? 'right-0.5' : 'left-0.5'}`}/>
                </button>
              </div>
              {active && (
                <div className="px-4 pb-3">
                  <button onClick={() => sendTest(slot)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-2 rounded-xl transition-colors active:scale-95">
                    📬 שלח התראת בדיקה עכשיו
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-500 space-y-1.5 leading-relaxed">
        <p className="text-zinc-300 font-bold mb-2">הערות:</p>
        <p>• <strong className="text-zinc-400">Chrome / Edge / Firefox:</strong> עובד גם כשהטאב סגור</p>
        <p>• <strong className="text-zinc-400">Safari Mac:</strong> עובד כשהדפדפן פתוח</p>
        <p>• <strong className="text-zinc-400">iOS:</strong> הוסף לשולחן עבודה ← Share ← Add to Home Screen</p>
        <p>• ההגדרות נשמרות אוטומטית בדפדפן</p>
      </div>
    </div>
  );
}
