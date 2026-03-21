import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Trophy, Timer, Star, ArrowLeft, ArrowRight, User, Play, RefreshCcw, XCircle, Map, HelpCircle, X, Download, Lock, CheckCircle2, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- Constants & Data ---
const TOTAL_CHALLENGES = 8;
const TASKS_PER_CHALLENGE = 2;
const EXERCISES_PER_TASK = 8;
const MAX_HEARTS = 7;
const INITIAL_HEARTS = 5;

const THEMES = [
  {
    id: 1,
    name: 'מדבר',
    bg: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=2000',
    avatar: '🐪',
    avatarName: (gender) => gender === 'male' ? 'מלך המדבר' : 'מלכת המדבר',
    prize: '🌵'
  },
  {
    id: 2,
    name: 'חלל',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000',
    avatar: '👨‍🚀',
    avatarName: (gender) => gender === 'male' ? 'האסטרונאוט' : 'האסטרונאוטית',
    prize: '🚀'
  },
  {
    id: 3,
    name: 'ג׳ונגל',
    bg: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=2000',
    avatar: '🐒',
    avatarName: (gender) => gender === 'male' ? 'קוף הרפתקן' : 'קופה הרפתקנית',
    prize: '🍌'
  },
  {
    id: 4,
    name: 'כדורגל',
    bg: 'https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80&w=2000',
    avatar: '⚽',
    avatarName: (gender) => gender === 'male' ? 'שחקן הכדורגל' : 'שחקנית הכדורגל',
    prize: '🏆'
  },
  {
    id: 5,
    name: 'מתחת למים',
    bg: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=2000',
    avatar: '🤿',
    avatarName: (gender) => gender === 'male' ? 'הצולל' : 'הצוללת',
    prize: '🐬'
  },
  {
    id: 6,
    name: 'עיר עתידנית',
    bg: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000',
    avatar: '🤖',
    avatarName: (gender) => gender === 'male' ? 'הרובוט' : 'הרובוטית',
    prize: '⚙️'
  },
  {
    id: 7,
    name: 'חורף מושלג',
    bg: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&q=80&w=2000',
    avatar: '🐧',
    avatarName: (gender) => gender === 'male' ? 'הפינגווין' : 'הפינגווינית',
    prize: '❄️'
  },
  {
    id: 8,
    name: 'ארמון האבירים',
    bg: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=2000',
    avatar: '🛡️',
    avatarName: (gender) => gender === 'male' ? 'האביר' : 'האבירה',
    prize: '👑'
  }
];

// --- Utilities ---
const generateExercise = (challengeIdx, difficulty, taskIdx, exerciseIdx) => {
  if (taskIdx === 0 && exerciseIdx === 3) {
    return { num1: 31, num2: 36, type: '+', result: 67, isSpecial: true };
  }

  const isAddition = Math.random() > 0.5;
  const noCarry = challengeIdx === 0;

  let num1, num2, result;

  if (isAddition) {
    if (noCarry) {
      const d1_1 = Math.floor(Math.random() * 5) + 1;
      const d1_2 = Math.floor(Math.random() * (9 - d1_1));
      const d10_1 = Math.floor(Math.random() * 4) + 1;
      const d10_2 = Math.floor(Math.random() * (9 - d10_1));
      num1 = d10_1 * 10 + d1_1;
      num2 = d10_2 * 10 + d1_2;
    } else {
      num1 = Math.floor(Math.random() * 70) + 10;
      num2 = Math.floor(Math.random() * (99 - num1)) + 1;
    }
    result = num1 + num2;
  } else {
    num1 = Math.floor(Math.random() * 80) + 20;
    if (noCarry) {
      const d1_1 = num1 % 10;
      const d1_2 = Math.floor(Math.random() * (d1_1 + 1));
      const d10_1 = Math.floor(num1 / 10);
      const d10_2 = Math.floor(Math.random() * d10_1) + 1;
      num2 = d10_2 * 10 + d1_2;
    } else {
      num2 = Math.floor(Math.random() * (num1 - 5)) + 1;
    }
    result = num1 - num2;
  }

  if (result === 67) return generateExercise(challengeIdx, difficulty, taskIdx, exerciseIdx);

  return { num1, num2, type: isAddition ? '+' : '-', result, isSpecial: false };
};

const getDifficultySettings = (diff, challengeIdx) => {
  const baseTime = diff === 'קל' ? 45 : diff === 'בינוני' ? 30 : 20;
  const reduction = challengeIdx * 2;
  return { time: Math.max(10, baseTime - reduction) };
};

const calculateCorrectSolution = (num1, num2, type) => {
  if (type === '+') {
    const hasCarry = (num1 % 10) + (num2 % 10) >= 10;
    return {
      carryTens: hasCarry ? '1' : '',
      carryOnes: '',
      resTens: Math.floor((num1 + num2) / 10).toString(),
      resOnes: ((num1 + num2) % 10).toString()
    };
  } else {
    const hasBorrow = (num1 % 10) < (num2 % 10);
    return {
      carryTens: hasBorrow ? (Math.floor(num1 / 10) - 1).toString() : '',
      carryOnes: hasBorrow ? ((num1 % 10) + 10).toString() : '',
      resTens: Math.floor((num1 - num2) / 10).toString(),
      resOnes: ((num1 - num2) % 10).toString()
    };
  }
};

// --- Framer Motion Variants ---
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.2 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

// --- Components ---
const VerticalProblem = ({
  num1, num2, type,
  resTens, setResTens, resOnes, setResOnes,
  carryTens, setCarryTens, carryOnes, setCarryOnes,
  isStatic = false, correctData = null,
  gender = 'male'
}) => {
  const n1Tens = Math.floor(num1 / 10);
  const n1Ones = num1 % 10;
  const n2Tens = Math.floor(num2 / 10) || ' ';
  const n2Ones = num2 % 10;

  const [activeCarry, setActiveCarry] = useState(null);

  const tensRef = useRef(null);
  const onesRef = useRef(null);

  const displayCarryTens = isStatic ? correctData?.carryTens : carryTens;
  const displayCarryOnes = isStatic ? correctData?.carryOnes : carryOnes;
  const displayResTens = isStatic ? correctData?.resTens : resTens;
  const displayResOnes = isStatic ? correctData?.resOnes : resOnes;

  const strikeTens = displayCarryTens !== '' && displayCarryTens !== undefined;
  const strikeOnes = displayCarryOnes !== '' && displayCarryOnes !== undefined;

  const t = (m, f) => gender === 'male' ? m : f;

  return (
    <div className="flex flex-col items-center justify-center font-mono text-4xl md:text-6xl text-slate-800 shrink-0" dir="ltr">

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, h: 0 }}
          animate={{ opacity: 1, h: 'auto' }}
          className="min-h-[1.5rem] md:min-h-[2rem] text-[10px] md:text-[14px] font-sans text-slate-500 mb-1 md:mb-3 font-bold transition-opacity text-center w-full" dir="rtl"
        >
          {activeCarry && !isStatic ? t('כתוב המרה 👇🏼', 'כתבי המרה 👇🏼') : ''}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end gap-2 md:gap-4 w-48 md:w-72 mb-2 md:mb-4 pr-2 relative">
        <div className="flex flex-col items-center">
          <span className="text-[10px] md:text-[12px] text-slate-400 font-sans mb-1 uppercase tracking-wider">המרה</span>
          {!isStatic ? (
            <motion.input
              whileFocus={{ scale: 1.1, borderColor: '#3b82f6' }}
              type="text" maxLength="1"
              value={carryTens}
              onChange={(e) => setCarryTens(e.target.value.replace(/[^0-9]/g, ''))}
              onFocus={() => setActiveCarry('tens')}
              onBlur={() => setActiveCarry(null)}
              className="w-10 h-10 md:w-14 md:h-14 border-2 border-dashed border-blue-300 rounded-lg md:rounded-xl text-center text-lg md:text-2xl bg-blue-50/50 focus:outline-none focus:bg-white shadow-sm transition-colors"
            />
          ) : (
            <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-2xl text-red-600 font-bold border-2 border-red-200 bg-red-50 rounded-lg md:rounded-xl shadow-sm">
              {displayCarryTens}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] md:text-[12px] text-slate-400 font-sans mb-1 uppercase tracking-wider">המרה</span>
          {!isStatic ? (
            <motion.input
              whileFocus={{ scale: 1.1, borderColor: '#3b82f6' }}
              type="text" maxLength="2"
              value={carryOnes}
              onChange={(e) => setCarryOnes(e.target.value.replace(/[^0-9]/g, ''))}
              onFocus={() => setActiveCarry('ones')}
              onBlur={() => setActiveCarry(null)}
              className="w-10 h-10 md:w-14 md:h-14 border-2 border-dashed border-blue-300 rounded-lg md:rounded-xl text-center text-lg md:text-2xl bg-blue-50/50 focus:outline-none focus:bg-white shadow-sm transition-colors"
            />
          ) : (
            <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-2xl text-red-600 font-bold border-2 border-red-200 bg-red-50 rounded-lg md:rounded-xl shadow-sm">
              {displayCarryOnes}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end border-b-4 md:border-b-[6px] border-slate-800 pb-2 md:pb-4 w-48 md:w-72 pr-2 relative bg-slate-50 rounded-t-xl md:rounded-t-2xl p-2 md:p-4 shadow-inner">
        <span className="absolute left-2 md:left-4 bottom-2 md:bottom-4 text-4xl md:text-6xl text-slate-300 font-black">{type}</span>

        <div className="flex gap-2 md:gap-4 tracking-widest relative z-10">
          <div className={`w-10 md:w-14 text-center relative ${strikeTens ? "text-slate-400" : "text-slate-700"}`}>
            {n1Tens}
            {strikeTens && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute top-1/2 left-0 h-1 md:h-1.5 bg-red-500 -rotate-12 transform -translate-y-1/2 rounded-full"></motion.div>}
          </div>
          <div className={`w-10 md:w-14 text-center relative ${strikeOnes ? "text-slate-400" : "text-slate-700"}`}>
            {n1Ones}
            {strikeOnes && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="absolute top-1/2 left-0 h-1 md:h-1.5 bg-red-500 -rotate-12 transform -translate-y-1/2 rounded-full"></motion.div>}
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 tracking-widest mt-1 md:mt-3 text-slate-700">
          <div className="w-10 md:w-14 text-center">{n2Tens}</div>
          <div className="w-10 md:w-14 text-center">{n2Ones}</div>
        </div>
      </div>

      <div className="mt-3 md:mt-6 flex justify-end gap-2 md:gap-4 w-48 md:w-72 pr-2">
        {!isStatic ? (
          <>
            <motion.input
              whileFocus={{ y: -3, boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)' }}
              ref={tensRef}
              type="text" maxLength="2"
              value={resTens}
              onChange={(e) => {
                setResTens(e.target.value.replace(/[^0-9-]/g, ''));
                if (e.target.value) onesRef.current?.focus();
              }}
              className="w-10 h-12 md:w-16 md:h-16 border-2 border-slate-300 rounded-lg md:rounded-xl text-center text-2xl md:text-4xl bg-white focus:outline-none focus:border-green-500 shadow-inner text-slate-800 font-bold transition-all"
            />
            <motion.input
              whileFocus={{ y: -3, boxShadow: '0 8px 15px -3px rgba(0, 0, 0, 0.1)' }}
              ref={onesRef}
              type="text" maxLength="1" autoFocus
              value={resOnes}
              onChange={(e) => {
                setResOnes(e.target.value.replace(/[^0-9]/g, ''));
                if (e.target.value) tensRef.current?.focus();
              }}
              className="w-10 h-12 md:w-16 md:h-16 border-2 border-slate-300 rounded-lg md:rounded-xl text-center text-2xl md:text-4xl bg-white focus:outline-none focus:border-green-500 shadow-inner text-slate-800 font-bold transition-all"
            />
          </>
        ) : (
          <>
            <div className="w-10 h-12 md:w-16 md:h-16 flex items-center justify-center bg-green-100 rounded-lg md:rounded-xl text-green-700 font-extrabold border-2 border-green-300 shadow-sm text-2xl md:text-4xl">{displayResTens}</div>
            <div className="w-10 h-12 md:w-16 md:h-16 flex items-center justify-center bg-green-100 rounded-lg md:rounded-xl text-green-700 font-extrabold border-2 border-green-300 shadow-sm text-2xl md:text-4xl">{displayResOnes}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('male');
  const [difficulty, setDifficulty] = useState('בינוני');

  const [challengeIdx, setChallengeIdx] = useState(0);
  const [taskIdx, setTaskIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [hearts, setHearts] = useState(INITIAL_HEARTS);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [earnedPrizes, setEarnedPrizes] = useState([]);

  const [currentEx, setCurrentEx] = useState(null);
  const [resTens, setResTens] = useState('');
  const [resOnes, setResOnes] = useState('');
  const [carryTens, setCarryTens] = useState('');
  const [carryOnes, setCarryOnes] = useState('');

  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccessAction, setIsSuccessAction] = useState(false);

  const [bonusActive, setBonusActive] = useState(false);
  const [bonusMessageVisible, setBonusMessageVisible] = useState(false);
  const [bonusPos, setBonusPos] = useState({ top: '50%', left: '50%' });
  const [feedbackType, setFeedbackType] = useState('success');
  const [showSpecialAnim, setShowSpecialAnim] = useState(false);
  const [feedbackCountdown, setFeedbackCountdown] = useState(30);
  const [showInstructions, setShowInstructions] = useState(false);
  const [confusedOperation, setConfusedOperation] = useState(false);

  const timerRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  const t = useCallback((m, f) => (gender === 'male' ? m : f), [gender]);

  // CONFETTI HIERARCHY
  const fireSmallConfetti = () => {
    confetti({ particleCount: 35, spread: 40, scalar: 0.6, origin: { y: 0.6 }, colors: ['#22c55e', '#3b82f6', '#fbbf24'] });
  };

  const fireTaskCompleteConfetti = () => {
    confetti({ particleCount: 100, spread: 70, scalar: 0.9, origin: { y: 0.6 } });
  };

  const fireChallengeCompleteConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#fbbf24', '#f43f5e', '#8b5cf6'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#fbbf24', '#f43f5e', '#8b5cf6'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const fireVictoryConfetti = () => {
    const duration = 8 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 60 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, scalar: 1.2, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const startNewExercise = useCallback(() => {
    const ex = generateExercise(challengeIdx, difficulty, taskIdx, exerciseIdx);
    setCurrentEx(ex);
    setResTens('');
    setResOnes('');
    setCarryTens('');
    setCarryOnes('');
    setIsChecking(false);
    setIsSuccessAction(false);

    const settings = getDifficultySettings(difficulty, challengeIdx);
    setTimeLeft(settings.time);
    setTimerActive(true);
    setScreen('playing');
  }, [challengeIdx, difficulty, taskIdx, exerciseIdx]);

  useEffect(() => {
    if (timerActive && !showInstructions && !isChecking && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive && !isChecking) {
      handleTimeout();
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timeLeft, showInstructions, isChecking]);

  useEffect(() => {
    if (screen === 'feedback') {
      setFeedbackCountdown(30);
      feedbackTimerRef.current = setInterval(() => {
        setFeedbackCountdown(prev => {
          if (prev <= 1) {
            clearInterval(feedbackTimerRef.current);
            advanceProgress();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(feedbackTimerRef.current);
  }, [screen]);

  useEffect(() => {
    if (screen === 'victory') fireVictoryConfetti();
    if (screen === 'taskTransition') fireTaskCompleteConfetti();
    if (screen === 'challengeComplete') fireChallengeCompleteConfetti();
  }, [screen]);

  const handleTimeout = () => {
    setTimerActive(false);
    setFeedbackType('timeout');
    setConfusedOperation(false);
    setHearts(h => h - 1);
    setConsecutiveCorrect(0);
    setScreen('feedback');
  };

  const handleBonusCatch = () => {
    if (hearts < MAX_HEARTS) setHearts(h => h + 1);
    setBonusActive(false);
    setBonusMessageVisible(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: parseFloat(bonusPos.top) / 100, x: parseFloat(bonusPos.left) / 100 } });
  };

  const checkAnswer = () => {
    if (isChecking) return;
    setIsChecking(true);
    setTimerActive(false);

    const rOnes = resOnes || '0';
    const rTens = resTens || '';
    const numericInput = parseInt(rTens + rOnes);

    const isCorrect = numericInput === currentEx.result;

    let confused = false;
    if (!isCorrect) {
      const oppResult = currentEx.type === '+' ? currentEx.num1 - currentEx.num2 : currentEx.num1 + currentEx.num2;
      if (numericInput === oppResult) confused = true;
    }

    if (isCorrect) {
      fireSmallConfetti();
      if (currentEx.isSpecial) {
        setShowSpecialAnim(true);
        setTimeout(() => setShowSpecialAnim(false), 3000);
      }

      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);
      setFeedbackType('success');
      setIsSuccessAction(true);

      const isVeryLast = (challengeIdx === TOTAL_CHALLENGES - 1 && taskIdx === TASKS_PER_CHALLENGE - 1 && exerciseIdx === EXERCISES_PER_TASK - 1);
      if (newConsecutive > 0 && newConsecutive % 4 === 0 && !isVeryLast) {
        setBonusActive(true);
        setBonusMessageVisible(true);
        setBonusPos({
          top: Math.random() * 50 + 20 + '%',
          left: Math.random() * 50 + 20 + '%'
        });
        setTimeout(() => {
          setBonusActive(false);
          setBonusMessageVisible(false);
        }, 6000);
      }

      setTimeout(advanceProgress, currentEx.isSpecial ? 3500 : 1500);
    } else {
      setHearts(h => h - 1);
      setConsecutiveCorrect(0);
      setFeedbackType('error');
      setConfusedOperation(confused);
      setScreen('feedback');
    }
  };

  const advanceProgress = () => {
    clearInterval(feedbackTimerRef.current);
    if (exerciseIdx < EXERCISES_PER_TASK - 1) {
      setExerciseIdx(e => e + 1);
      setTimeout(() => startNewExercise(), 100);
    } else if (taskIdx < TASKS_PER_CHALLENGE - 1) {
      setTaskIdx(t => t + 1);
      setExerciseIdx(0);
      setScreen('taskTransition');
    } else {
      const currentTheme = THEMES[challengeIdx];
      if (!earnedPrizes.includes(currentTheme.prize)) {
        setEarnedPrizes([...earnedPrizes, currentTheme.prize]);
      }
      setScreen('challengeComplete');
    }
  };

  const handleChallengeCompleteToMap = () => {
    if (challengeIdx < TOTAL_CHALLENGES - 1) {
      setChallengeIdx(c => c + 1);
    }
    setTaskIdx(0);
    setExerciseIdx(0);
    setScreen(challengeIdx < TOTAL_CHALLENGES - 1 ? 'map' : 'victory');
  };

  const downloadAndShareCertificate = async () => {
    const node = document.getElementById('certificate-render');
    if (!node) return;

    try {
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const canvas = await window.html2canvas(node, { scale: 2, backgroundColor: '#f8fafc' });
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = `התעודה_של_${userName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error creating image', err);
    }
  };

  useEffect(() => {
    if (hearts <= 0 && screen !== 'gameOver') setScreen('gameOver');
  }, [hearts, screen]);

  const resetGame = () => {
    setHearts(INITIAL_HEARTS);
    setChallengeIdx(0);
    setTaskIdx(0);
    setExerciseIdx(0);
    setConsecutiveCorrect(0);
    setEarnedPrizes([]);
    setScreen('map');
  };

  const theme = THEMES[challengeIdx] || THEMES[0];

  // Dynamic Root Background Image
  const getRootBackground = () => {
    if (screen === 'welcome' || screen === 'setup') return 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=2000';
    if (screen === 'map') return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000';
    if (screen === 'shareCertificate' || screen === 'victory') return 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&q=80&w=2000';
    if (screen === 'gameOver') return '';
    return theme.bg;
  };

  // Global Styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');
      .game-font { font-family: 'Varela Round', sans-serif !important; }
      @keyframes hands { 0% { transform: translateY(-20px); } 100% { transform: translateY(20px); } }
      .anim-hand-left { animation: hands 0.4s infinite alternate; display: inline-block; }
      .anim-hand-right { animation: hands 0.4s infinite alternate-reverse; display: inline-block; }
      /* Custom Scrollbar for overflow areas */
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 10px; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.4); border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.6); }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    // ABSOLUTE ROOT WRAPPER - using dvh to handle mobile address bars properly
    <div
      className="fixed inset-0 w-screen h-[100dvh] flex items-center justify-center font-sans game-font bg-cover bg-center transition-all duration-700 bg-slate-900 overflow-hidden"
      dir="rtl"
      style={{ backgroundImage: `url(${getRootBackground()})` }}
    >
      {/* Subtle darkening overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      {/* MAIN APP CONTAINER - Responsive bounds, min-h-0 prevents flex blowout */}
      <div className="w-full h-full md:w-[95vw] md:h-[95dvh] max-w-7xl relative flex flex-col md:rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 min-h-0">

        <AnimatePresence mode="wait">

          {/* --- WELCOME SCREEN --- */}
          {screen === 'welcome' && (
            <motion.div key="welcome" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center flex-1 text-center p-4 md:p-6 relative overflow-y-auto w-full h-full">
              <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}>
                <Trophy className="mb-4 md:mb-6 w-20 h-20 md:w-32 md:h-32 text-yellow-300 drop-shadow-[0_0_25px_rgba(253,224,71,0.8)]" />
              </motion.div>
              <h1 className="text-5xl md:text-8xl font-black mb-4 md:mb-6 drop-shadow-2xl text-white tracking-wide">המשחק של ב׳2</h1>
              <p className="text-xl md:text-3xl mb-8 md:mb-10 max-w-2xl text-white font-medium drop-shadow-md">ברוכים הבאים לאתגר החשבון הגדול! מוכנים לצאת למסע?</p>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setScreen('setup')}
                className="px-8 md:px-14 py-4 md:py-6 bg-white/90 backdrop-blur-md text-indigo-700 rounded-full font-black text-2xl md:text-4xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] flex items-center gap-3 md:gap-4 hover:bg-white transition-colors border-2 border-white/50 shrink-0"
              >
                מתחילים! <ArrowLeft strokeWidth={4} className="w-6 h-6 md:w-10 md:h-10" />
              </motion.button>
            </motion.div>
          )}

          {/* --- SETUP SCREEN --- */}
          {screen === 'setup' && (
            <motion.div key="setup" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center flex-1 p-4 md:p-8 overflow-y-auto w-full h-full">
              <div className="bg-white/85 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-white/50 w-full max-w-sm md:max-w-xl text-center my-auto shrink-0">
                <User size={48} className="text-indigo-600 mb-4 md:mb-6 drop-shadow-md mx-auto md:w-[56px] md:h-[56px]" />
                <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 text-slate-800 tracking-wide">ספרו לנו עליכם</h2>

                <div className="space-y-4 md:space-y-6 text-right">
                  <motion.div variants={staggerItem}>
                    <label className="block text-base md:text-xl font-bold mb-2 md:mb-3 text-slate-700">איך קוראים לך?</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full p-3 md:p-4 border-4 border-white/50 bg-white/60 rounded-xl md:rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 outline-none text-center text-xl md:text-3xl font-bold transition-all shadow-inner"
                      placeholder="השם שלך כאן"
                    />
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <label className="block text-base md:text-xl font-bold mb-2 md:mb-3 text-slate-700">אני...</label>
                    <div className="flex flex-row gap-2 md:gap-5">
                      <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setGender('male')}
                        className={`flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl border-4 transition-all font-black text-lg md:text-2xl flex flex-col items-center gap-1 md:gap-2 ${gender === 'male' ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white/60 text-slate-600 border-white/50 hover:bg-white'}`}
                      >
                        <span className="text-2xl md:text-4xl">👦</span> שחקן
                      </motion.button>
                      <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setGender('female')}
                        className={`flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl border-4 transition-all font-black text-lg md:text-2xl flex flex-col items-center gap-1 md:gap-2 ${gender === 'female' ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg' : 'bg-white/60 text-slate-600 border-white/50 hover:bg-white'}`}
                      >
                        <span className="text-2xl md:text-4xl">👧</span> שחקנית
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <label className="block text-base md:text-xl font-bold mb-2 md:mb-3 text-slate-700">רמת קושי</label>
                    <div className="flex gap-2 bg-white/60 p-1 md:p-2 rounded-xl md:rounded-2xl border-4 border-white/50 shadow-inner">
                      {['קל', 'בינוני', 'קשה'].map(d => (
                        <button key={d} onClick={() => setDifficulty(d)}
                          className={`flex-1 py-2 md:py-3 rounded-lg md:rounded-xl text-base md:text-xl font-bold transition-all ${difficulty === d ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-white'}`}
                        >{d}</button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.button whileHover={{ scale: userName ? 1.05 : 1 }} whileTap={{ scale: userName ? 0.95 : 1 }}
                    disabled={!userName}
                    onClick={() => setScreen('map')}
                    className="w-full py-4 md:py-5 mt-2 md:mt-4 bg-emerald-500 text-white rounded-xl md:rounded-2xl font-black text-xl md:text-3xl disabled:opacity-50 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-[0_8px_25px_-5px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2 md:gap-3 transition-all border-b-4 border-emerald-700"
                  >
                    {t('מוכן?', 'מוכנה?')} <ArrowLeft strokeWidth={4} className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- MAP SCREEN --- */}
          {screen === 'map' && (
            <motion.div key="map" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col flex-1 relative overflow-hidden text-white w-full h-full min-h-0">
              <div className="p-4 md:p-6 bg-black/40 backdrop-blur-md flex justify-between items-center shadow-xl z-20 border-b border-white/10 shrink-0">
                <h2 className="text-xl md:text-4xl font-black flex items-center gap-2 md:gap-4 drop-shadow-md"><Map className="text-indigo-300 w-6 h-6 md:w-10 md:h-10" /> מפת האתגרים</h2>
                <div className="flex items-center gap-2 md:gap-3 text-yellow-300 font-bold bg-black/40 px-3 py-1.5 md:px-6 md:py-3 text-sm md:text-xl rounded-full border border-white/20 shadow-inner backdrop-blur-sm">
                  <Trophy className="w-4 h-4 md:w-6 md:h-6" /> {earnedPrizes.length === 0 ? 'אין' : earnedPrizes.join(' ')}
                </div>
              </div>

              <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-start gap-4 md:gap-8 relative overflow-y-auto pb-12 md:pb-20">
                <div className="w-2 md:w-4 h-full bg-white/20 backdrop-blur-sm absolute left-1/2 -translate-x-1/2 rounded-full shadow-inner border-x border-white/10"></div>

                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full flex flex-col items-center gap-4 md:gap-8">
                  {THEMES.map((th, idx) => {
                    const isUnlocked = idx <= challengeIdx;
                    const isCurrent = idx === challengeIdx;
                    const isDone = idx < challengeIdx;
                    return (
                      <motion.div variants={staggerItem} key={th.id} className="relative z-10 w-full max-w-sm md:max-w-2xl shrink-0">
                        <motion.button whileHover={isCurrent ? { scale: 1.05 } : {}} whileTap={isCurrent ? { scale: 0.98 } : {}}
                          onClick={() => isCurrent && setScreen('challengeIntro')}
                          disabled={!isCurrent}
                          className={`w-full p-4 md:p-6 rounded-2xl md:rounded-[3rem] border-4 transition-all flex items-center gap-3 md:gap-8 relative overflow-hidden backdrop-blur-xl
                          ${isCurrent ? 'bg-indigo-600/80 border-yellow-400 shadow-[0_0_50px_rgba(253,224,71,0.4)] cursor-pointer' :
                              isDone ? 'bg-emerald-600/80 border-emerald-300 opacity-95' :
                                'bg-slate-900/60 border-slate-600/50 opacity-60 cursor-not-allowed'}`}
                        >
                          {isCurrent && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>}

                          <div className="text-4xl md:text-7xl bg-black/30 p-3 md:p-6 rounded-xl md:rounded-3xl shadow-inner backdrop-blur-sm border border-white/10">
                            {isDone ? th.prize : isUnlocked ? th.avatar : <Lock className="text-white/40 w-8 h-8 md:w-16 md:h-16" />}
                          </div>
                          <div className="flex-1 text-right">
                            <div className="font-black text-xl md:text-4xl mb-1 md:mb-2 tracking-wide drop-shadow-md">{th.name}</div>
                            <div className="text-xs md:text-lg font-bold opacity-90 bg-black/40 inline-block px-3 py-1 md:px-5 md:py-2 rounded-full border border-white/10">
                              {isDone ? 'הושלם! 🎉' : isCurrent ? 'האתגר הבא שלך' : 'נעול'}
                            </div>
                          </div>
                          {isCurrent && <Play className="text-yellow-300 ml-1 md:ml-2 w-6 h-6 md:w-14 md:h-14 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" fill="currentColor" />}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* --- CHALLENGE INTRO SCREEN --- */}
          {screen === 'challengeIntro' && (
            <motion.div key="intro" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center flex-1 text-center p-4 md:p-6 text-white relative overflow-y-auto w-full h-full">
              <button onClick={() => setScreen('map')} className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex items-center gap-2 md:gap-3 bg-black/50 hover:bg-black/70 px-4 py-2 md:px-6 md:py-3 rounded-full transition-colors font-bold text-sm md:text-lg border border-white/20 backdrop-blur-md">
                <Home size={20} className="md:w-[22px] md:h-[22px]" /> למפה
              </button>

              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} className="relative z-10 bg-black/40 p-6 md:p-14 rounded-3xl md:rounded-[3rem] border border-white/30 backdrop-blur-xl shadow-2xl max-w-sm md:max-w-2xl w-full my-auto shrink-0">
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4 }} className="text-[5rem] md:text-[8rem] mb-4 md:mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] leading-none">
                  {theme.avatar}
                </motion.div>
                <h2 className="text-3xl md:text-6xl font-black mb-3 md:mb-6 drop-shadow-lg">{t('ברוך הבא', 'ברוכה הבאה')} ל{theme.name}!</h2>
                <p className="text-lg md:text-3xl mb-8 md:mb-12 text-white/95 leading-relaxed font-medium">
                  <span className="font-black text-yellow-300 drop-shadow-md">{userName}</span>, {theme.avatarName(gender)} שלנו {theme.avatar},<br />{t('בוא נראה מה אתה יודע', 'בואי נראה מה את יודעת')}.
                </p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={startNewExercise}
                  className="w-full py-4 md:py-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-full font-black text-xl md:text-4xl shadow-[0_10px_35px_-5px_rgba(253,224,71,0.6)] border-4 border-yellow-200"
                >
                  {t('התחל אתגר!', 'התחילי אתגר!')}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* --- TASK TRANSITION SCREEN --- */}
          {screen === 'taskTransition' && (
            <motion.div key="taskTransition" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center flex-1 p-4 md:p-8 text-white text-center relative overflow-y-auto w-full h-full">
              <button onClick={() => setScreen('map')} className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex items-center gap-2 md:gap-3 bg-black/50 hover:bg-black/70 px-4 py-2 md:px-6 md:py-3 rounded-full transition-colors font-bold text-sm md:text-lg border border-white/20 backdrop-blur-md">
                <Home size={20} className="md:w-[22px] md:h-[22px]" /> למפה
              </button>

              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 flex flex-col items-center bg-black/40 p-6 md:p-14 rounded-3xl md:rounded-[3rem] backdrop-blur-xl border border-white/20 w-full max-w-sm md:max-w-2xl my-auto shrink-0">
                <CheckCircle2 className="w-20 h-20 md:w-32 md:h-32 text-emerald-400 mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]" />
                <h2 className="text-4xl md:text-6xl font-black mb-3 md:mb-4 tracking-wide drop-shadow-lg">כל הכבוד!</h2>
                <p className="text-xl md:text-3xl mb-8 md:mb-10 font-medium text-white/90 leading-relaxed">סיימת את המשימה הראשונה באתגר ה{theme.name}.<br /><br />{t('מוכן', 'מוכנה')} למשימה השנייה?</p>

                <div className="flex gap-3 md:gap-4 mb-8 md:mb-10">
                  <div className="w-16 h-4 md:w-20 md:h-5 bg-emerald-400 rounded-full shadow-inner border-2 border-emerald-200"></div>
                  <div className="w-16 h-4 md:w-20 md:h-5 bg-white/20 rounded-full border-2 border-white/30 backdrop-blur-sm"></div>
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setExerciseIdx(0); startNewExercise(); }}
                  className="px-8 py-4 md:px-12 md:py-6 bg-white text-indigo-700 rounded-full font-black text-xl md:text-3xl shadow-[0_15px_35px_-5px_rgba(255,255,255,0.4)] flex items-center gap-3 md:gap-4 w-full justify-center md:w-auto hover:bg-slate-50 transition-colors"
                >
                  למשימה השנייה <ArrowLeft strokeWidth={4} className="w-6 h-6 md:w-8 md:h-8" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* --- PLAYING SCREEN --- */}
          {screen === 'playing' && currentEx && (
            <motion.div key="playing" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative flex-1 flex flex-col min-h-0 w-full h-full">

              {/* Top Bar - Glassmorphism */}
              <div className="relative z-20 p-2 md:p-4 flex justify-between items-center bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm shrink-0">
                <div className="flex items-center gap-2 md:gap-4">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowInstructions(true)} className="p-2 md:p-3 bg-white/60 text-indigo-900 hover:bg-white rounded-lg md:rounded-xl transition-colors border border-white/50 shadow-sm" title="הוראות">
                    <HelpCircle className="w-5 h-5 md:w-7 md:h-7" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setScreen('map')} className="p-2 md:p-3 bg-white/60 text-indigo-900 hover:bg-white rounded-lg md:rounded-xl transition-colors border border-white/50 shadow-sm" title="למפה">
                    <Home className="w-5 h-5 md:w-7 md:h-7" />
                  </motion.button>
                  <div className="flex flex-col bg-white/50 px-3 md:px-5 py-1 md:py-2 rounded-lg md:rounded-xl border border-white/50 shadow-sm">
                    <span className="text-[10px] md:text-xs font-bold text-indigo-600 uppercase tracking-wider">{theme.name} - משימה {taskIdx + 1}/2</span>
                    <span className="text-xs md:text-lg font-black text-slate-900">{userName} {theme.avatar}</span>
                  </div>
                </div>
                <div className="flex gap-1 md:gap-2 bg-white/50 p-1.5 md:p-2.5 rounded-lg md:rounded-xl border border-white/50 shadow-sm overflow-x-auto max-w-[40%] md:max-w-none">
                  {Array(MAX_HEARTS).fill(0).map((_, i) => (
                    <motion.div key={i} animate={i < hearts ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }} className="shrink-0">
                      <Heart className="w-4 h-4 md:w-6 md:h-6" fill={i < hearts ? "#f43f5e" : "transparent"} stroke={i < hearts ? "#f43f5e" : "#94a3b8"} strokeWidth={i < hearts ? 2 : 1.5} style={i < hearts ? { filter: 'drop-shadow(0 2px 4px rgba(244,63,94,0.4))' } : {}} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10 w-full h-2 md:h-3 bg-black/20 backdrop-blur-sm shrink-0">
                <motion.div
                  className="h-full bg-gradient-to-l from-yellow-400 to-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] rounded-r-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((exerciseIdx + (taskIdx * EXERCISES_PER_TASK)) / (EXERCISES_PER_TASK * TASKS_PER_CHALLENGE)) * 100}%` }}
                  transition={{ duration: 0.5, type: "spring" }}
                />
              </div>

              {/* Main Math Container */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-start md:justify-center p-4 min-h-0 overflow-y-auto">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/85 backdrop-blur-2xl p-4 md:p-10 rounded-2xl md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/60 w-full max-w-sm md:max-w-2xl relative my-auto shrink-0">

                  <div className="flex justify-between items-center mb-4 md:mb-8 pb-3 md:pb-5 border-b-2 border-slate-200/50">
                    <div className="text-xs md:text-lg font-black bg-indigo-100 text-indigo-700 px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl border border-indigo-200 tracking-wide">
                      תרגיל {exerciseIdx + 1}/8
                    </div>
                    <motion.div animate={timeLeft < 10 ? { scale: [1, 1.1, 1], color: ['#ef4444', '#b91c1c', '#ef4444'] } : {}} transition={{ repeat: Infinity, duration: 0.5 }} className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl border-2 font-mono font-black text-xl md:text-3xl shadow-sm ${timeLeft < 10 ? 'bg-red-100 border-red-300 text-red-600' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                      <Timer className="w-5 h-5 md:w-7 md:h-7" /> {timeLeft}
                    </motion.div>
                  </div>

                  <VerticalProblem
                    num1={currentEx.num1} num2={currentEx.num2} type={currentEx.type}
                    resTens={resTens} setResTens={setResTens} resOnes={resOnes} setResOnes={setResOnes}
                    carryTens={carryTens} setCarryTens={setCarryTens} carryOnes={carryOnes} setCarryOnes={setCarryOnes}
                    gender={gender}
                  />

                  <motion.button whileHover={{ scale: (!resOnes && !resTens) || isChecking ? 1 : 1.05 }} whileTap={{ scale: (!resOnes && !resTens) || isChecking ? 1 : 0.95 }}
                    onClick={checkAnswer}
                    disabled={(!resOnes && !resTens) || isChecking}
                    className={`mt-6 md:mt-10 w-full py-4 md:py-5 text-white rounded-xl md:rounded-2xl font-black text-xl md:text-3xl transition-all shadow-xl flex items-center justify-center gap-2 md:gap-3 border-b-4 md:border-b-[6px] 
                    ${isSuccessAction ? 'bg-emerald-500 border-emerald-700 shadow-[0_0_30px_rgba(16,185,129,0.6)]' : 'bg-indigo-600 border-indigo-800 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:border-slate-500'}`}
                  >
                    {isSuccessAction ? 'כל הכבוד! ✨' : t('בדיקה', 'בדיקה')}
                  </motion.button>
                </motion.div>
              </div>

              {/* Bonus Logic */}
              <AnimatePresence>
                {bonusActive && (
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0 }}
                    onClick={handleBonusCatch}
                    className="absolute z-50 cursor-pointer"
                    style={{ top: bonusPos.top, left: bonusPos.left }}
                  >
                    <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1.5 }} className="bg-white/95 p-3 md:p-5 rounded-full shadow-[0_0_50px_rgba(244,63,94,0.8)] backdrop-blur-md border-4 border-rose-200">
                      <Heart fill="#f43f5e" stroke="#f43f5e" className="w-10 h-10 md:w-16 md:h-16 animate-pulse drop-shadow-xl" />
                    </motion.div>
                  </motion.div>
                )}
                {bonusMessageVisible && (
                  <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="absolute top-[15%] left-1/2 -translate-x-1/2 z-40 bg-yellow-400 text-slate-900 font-black px-4 py-2 md:px-8 md:py-4 rounded-full shadow-2xl border-4 border-white text-sm md:text-xl text-center whitespace-nowrap">
                    {t('פתרת נכון 4 תרגילים ברצף! תפוס את הלב!', 'פתרת נכון 4 תרגילים ברצף! תפסי את הלב!')}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Special Animation 67 */}
              <AnimatePresence>
                {showSpecialAnim && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
                    <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="flex items-center gap-3 md:gap-6 bg-white p-6 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-[0_0_100px_rgba(255,255,255,0.8)] border-[8px] md:border-[12px] border-yellow-400">
                      <span className="font-black text-6xl md:text-[10rem] text-indigo-600 drop-shadow-lg leading-none">7</span>
                      <div className="flex gap-1 md:gap-2 relative top-1 md:top-4">
                        <span className="anim-hand-left text-[50px] md:text-[100px] leading-none">🫱</span>
                        <span className="text-[50px] md:text-[100px] leading-none -mt-3 md:-mt-6">🤩</span>
                        <span className="anim-hand-right text-[50px] md:text-[100px] leading-none">🫲</span>
                      </div>
                      <span className="font-black text-6xl md:text-[10rem] text-pink-500 drop-shadow-lg leading-none">6</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instructions Modal */}
              <AnimatePresence>
                {showInstructions && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 md:p-6 backdrop-blur-md">
                    <motion.div initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.9 }} className="bg-white/95 backdrop-blur-xl p-6 md:p-10 rounded-2xl md:rounded-[3rem] max-w-sm md:max-w-xl w-full relative shadow-2xl border border-white/50 max-h-[90vh] overflow-y-auto">
                      <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 md:p-2 rounded-full"><X className="w-5 h-5 md:w-7 md:h-7" /></button>
                      <h2 className="text-2xl md:text-4xl font-black mb-6 md:mb-8 text-indigo-700 border-b-4 border-indigo-100 pb-3 md:pb-4">איך משחקים?</h2>
                      <ul className="space-y-4 md:space-y-6 text-base md:text-xl text-slate-800 font-medium">
                        <li className="flex items-start gap-3 md:gap-4 bg-slate-100/50 p-3 md:p-4 rounded-xl md:rounded-2xl"><Timer className="text-indigo-600 shrink-0 mt-0.5 md:mt-1 w-6 h-6 md:w-8 md:h-8" /> <div><b className="text-slate-900">הזמן רץ!</b> פתרו את התרגילים לפני שהשעון יתאפס.</div></li>
                        <li className="flex items-start gap-3 md:gap-4 bg-rose-50 p-3 md:p-4 rounded-xl md:rounded-2xl"><Heart className="text-rose-500 shrink-0 mt-0.5 md:mt-1 w-6 h-6 md:w-8 md:h-8" fill="#f43f5e" /> <div><b className="text-slate-900">לבבות:</b> טעות או חריגה מהזמן מורידות לב. נגמרו הלבבות? מתחילים מהתחלה.</div></li>
                        <li className="flex items-start gap-3 md:gap-4 bg-blue-50 p-3 md:p-4 rounded-xl md:rounded-2xl"><span className="text-2xl md:text-3xl shrink-0 leading-none">✍️</span> <div><b className="text-slate-900">המרות:</b> השתמשו בריבועים העליונים כדי לכתוב המרות. הספרה שהוחלפה תימחק בקו!</div></li>
                        <li className="flex items-start gap-3 md:gap-4 bg-yellow-50 p-3 md:p-4 rounded-xl md:rounded-2xl"><span className="text-2xl md:text-3xl shrink-0 leading-none">🎁</span> <div><b className="text-slate-900">בונוס:</b> 4 תשובות נכונות ברצף יעניקו לכם לב מתנה שיופיע על המסך.</div></li>
                      </ul>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowInstructions(false)} className="mt-6 md:mt-10 w-full py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-xl md:text-2xl shadow-xl">הבנתי, בואו נמשיך!</motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* --- FEEDBACK SCREEN (Unified Mobile + 2-Column Desktop) --- */}
          {screen === 'feedback' && (
            <motion.div key="feedback" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto w-full h-full">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />

              <button onClick={() => setScreen('map')} className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex items-center gap-2 md:gap-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-colors font-bold text-sm md:text-base border border-white/20 backdrop-blur-md">
                <Home size={18} className="md:w-[20px] md:h-[20px]" /> למפה
              </button>

              {/* Changed from max-w-xl to max-w-4xl, implemented flex-col md:flex-row */}
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative z-10 p-5 md:p-8 rounded-3xl md:rounded-[3rem] shadow-2xl w-full max-w-sm md:max-w-4xl flex flex-col md:flex-row gap-5 md:gap-10 items-center bg-white/95 backdrop-blur-xl border-t-[8px] md:border-t-[12px] border-rose-500 my-auto shrink-0">

                {/* Left Column (or Top on Mobile): Text, Hearts, Continue Button */}
                <div className="flex-1 flex flex-col items-center justify-center w-full text-center">
                  {feedbackType === 'timeout' ? (
                    <div className="mb-4 md:mb-6">
                      <motion.div animate={{ rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1 }}>
                        <Timer className="text-rose-500 mx-auto mb-2 md:mb-4 drop-shadow-md w-14 h-14 md:w-20 md:h-20" />
                      </motion.div>
                      <h2 className="text-3xl md:text-4xl font-black text-rose-600">אוי, הזמן נגמר!</h2>
                    </div>
                  ) : (
                    <div className="mb-4 md:mb-6">
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <XCircle className="text-rose-500 mx-auto mb-2 md:mb-4 drop-shadow-md w-14 h-14 md:w-20 md:h-20" />
                      </motion.div>
                      <h2 className="text-3xl md:text-4xl font-black text-rose-600">{t('לא נורא, תטעה ותלמד!', 'לא נורא, תטעי ותלמדי!')}</h2>
                      {confusedOperation && (
                        <div className="bg-orange-100 text-orange-800 p-3 md:p-4 rounded-xl md:rounded-2xl mt-3 md:mt-4 font-black border-2 border-orange-200 shadow-sm text-sm md:text-lg">
                          נראה שהתבלבלת בין חיבור לחיסור! שימו לב לסימן.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6 bg-rose-50 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border-2 border-rose-200 w-full max-w-sm justify-center shadow-sm">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      <Heart fill="#f43f5e" stroke="#f43f5e" className="w-6 h-6 md:w-8 md:h-8 drop-shadow-sm" />
                    </motion.div>
                    <span className="text-xl md:text-2xl font-black text-rose-600">נשארו לך {hearts} לבבות</span>
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={advanceProgress}
                    className="relative overflow-hidden w-full max-w-sm py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-xl md:text-2xl shadow-xl flex items-center justify-center gap-2 md:gap-3 group border-b-4 border-indigo-800"
                  >
                    <div className="absolute left-0 top-0 h-full bg-white/20 transition-all duration-1000 ease-linear" style={{ width: `${(feedbackCountdown / 30) * 100}%` }}></div>
                    <span className="relative z-10 flex items-center gap-2 md:gap-3">
                      {t('ממשיכים לתרגיל הבא', 'ממשיכות לתרגיל הבא')} <ArrowLeft strokeWidth={3} className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="bg-black/20 px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl text-sm md:text-lg shadow-inner border border-white/10">{feedbackCountdown}</span>
                    </span>
                  </motion.button>
                </div>

                {/* Right Column (or Bottom on Mobile): The Correct Math Problem */}
                <div className="flex-1 w-full flex flex-col items-center justify-center border-t-2 md:border-t-0 md:border-r-2 border-slate-200 pt-5 md:pt-0 md:pr-8">
                  <p className="text-slate-600 mb-3 md:mb-5 text-lg md:text-xl font-medium hidden md:block">כך פותרים נכון במאונך:</p>
                  <div className="p-4 md:p-6 bg-slate-50/80 rounded-2xl md:rounded-[2rem] w-full max-w-sm border-4 border-slate-200 shadow-inner flex justify-center">
                    <div className="transform scale-90 sm:scale-100 origin-top">
                      <VerticalProblem
                        num1={currentEx.num1} num2={currentEx.num2} type={currentEx.type}
                        isStatic
                        correctData={calculateCorrectSolution(currentEx.num1, currentEx.num2, currentEx.type)}
                        gender={gender}
                      />
                    </div>
                  </div>
                  <p className="text-slate-600 mt-3 font-bold md:hidden">הפתרון הנכון</p>
                </div>

              </motion.div>
            </motion.div>
          )}

          {/* --- CHALLENGE COMPLETE SCREEN --- */}
          {screen === 'challengeComplete' && (
            <motion.div key="challengeComplete" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center flex-1 p-4 md:p-8 text-white text-center relative overflow-y-auto w-full h-full">

              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="relative z-10 bg-black/40 p-8 md:p-14 rounded-3xl md:rounded-[3rem] backdrop-blur-xl border border-white/30 shadow-2xl max-w-sm md:max-w-xl w-full my-auto shrink-0">
                <h2 className="text-5xl md:text-7xl font-black mb-4 md:mb-6 text-yellow-300 drop-shadow-lg">אתגר הושלם!</h2>
                <p className="text-xl md:text-3xl mb-6 md:mb-8 font-medium text-indigo-50">כל הכבוד <span className="font-black text-white">{userName}</span>, סיימת את אתגר ה{theme.name}!</p>

                <div className="bg-white/10 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 mb-8 md:mb-10 inline-block shadow-inner border border-white/20 backdrop-blur-md">
                  <p className="text-lg md:text-xl font-bold mb-3 md:mb-4 opacity-90">הפרס החדש שלך:</p>
                  <motion.div animate={{ y: [-10, 10, -10], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="text-7xl md:text-[8rem] drop-shadow-2xl leading-none">
                    {theme.prize}
                  </motion.div>
                </div>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleChallengeCompleteToMap}
                  className="px-8 py-4 md:px-12 md:py-5 bg-emerald-500 rounded-full font-black text-xl md:text-2xl shadow-[0_15px_35px_-5px_rgba(16,185,129,0.5)] flex items-center gap-2 md:gap-3 border-4 border-emerald-300 w-full justify-center"
                >
                  <Map className="w-6 h-6 md:w-8 md:h-8" /> חזרה למפה
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* --- SHARE CERTIFICATE SCREEN --- */}
          {screen === 'shareCertificate' && (
            <motion.div key="certificate" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col flex-1 items-center justify-center p-4 md:p-8 relative overflow-y-auto w-full h-full">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>

              <div className="my-auto w-full flex flex-col items-center shrink-0">
                <motion.div initial={{ y: -20 }} animate={{ y: 0 }} id="certificate-render" className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[3rem] shadow-2xl border-[8px] md:border-[12px] border-yellow-400 max-w-sm md:max-w-2xl w-full text-center relative mb-6 md:mb-8">
                  <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none rounded-[2rem]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}></div>
                  <Star className="absolute top-4 right-4 md:top-8 md:right-8 text-yellow-400 drop-shadow-md w-10 h-10 md:w-16 md:h-16" fill="yellow" />
                  <Star className="absolute top-4 left-4 md:top-8 md:left-8 text-yellow-400 drop-shadow-md w-10 h-10 md:w-16 md:h-16" fill="yellow" />

                  <div className="relative z-10 mt-2 md:mt-0">
                    <Trophy className="mx-auto mb-4 md:mb-6 text-yellow-500 drop-shadow-lg w-16 h-16 md:w-24 md:h-24" />
                    <h2 className="text-4xl md:text-5xl font-black text-indigo-800 mb-2 md:mb-4 tracking-tight">תעודת הצטיינות</h2>
                    <p className="text-xl md:text-2xl text-slate-500 mb-6 md:mb-8 font-medium">ל{gender === 'male' ? 'שחקן' : 'שחקנית'} ה{t('אלוף', 'אלופה')}:</p>
                    <div className="inline-block relative mb-8 md:mb-10">
                      <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 px-6 md:px-10 pb-2 md:pb-4 relative z-10 leading-tight">{userName}</h3>
                      <div className="absolute bottom-0 left-0 w-full h-3 md:h-4 bg-yellow-300 rounded-full opacity-50 transform -skew-x-12"></div>
                    </div>

                    <p className="font-black text-slate-700 text-lg md:text-xl mb-4 md:mb-6">אלו הפרסים שזכיתי בהם במשחק של ב׳2:</p>
                    <div className="flex flex-wrap justify-center gap-3 md:gap-5 bg-slate-50 p-4 md:p-8 rounded-2xl md:rounded-[2rem] min-h-[100px] md:min-h-[140px] border-4 border-slate-100 shadow-inner">
                      {earnedPrizes.length > 0
                        ? earnedPrizes.map((p, i) => <span key={i} className="text-4xl md:text-5xl bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-md border border-slate-100">{p}</span>)
                        : <span className="text-slate-400 text-base md:text-lg font-bold flex items-center h-full text-center">עוד אין פרסים, המשיכו לשחק!</span>
                      }
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-5 w-full max-w-sm md:max-w-2xl relative z-10">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={downloadAndShareCertificate}
                    className="flex-1 py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-[0_15px_30px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 md:gap-3 border-b-4 md:border-b-[6px] border-indigo-800"
                  >
                    <Download className="w-6 h-6 md:w-8 md:h-8" /> {t('שתף', 'שתפי')} הישגים
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setScreen('welcome')}
                    className="py-4 md:py-5 px-6 md:px-10 bg-white text-slate-700 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-xl border-b-4 md:border-b-[6px] border-slate-200"
                  >
                    למסך הראשי
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- GAME OVER SCREEN --- */}
          {screen === 'gameOver' && (
            <motion.div key="gameOver" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center flex-1 p-4 md:p-8 text-white text-center relative overflow-y-auto w-full h-full">
              <div className="absolute inset-0 bg-rose-600/90 backdrop-blur-md"></div>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute -right-10 -top-10 md:-right-20 md:-top-20 opacity-20">
                <RefreshCcw className="w-48 h-48 md:w-[300px] md:h-[300px]" />
              </motion.div>

              <div className="relative z-10 bg-black/30 p-8 md:p-14 rounded-3xl md:rounded-[3rem] backdrop-blur-xl border border-white/20 shadow-2xl max-w-sm md:max-w-xl my-auto shrink-0">
                <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6 drop-shadow-md">אופס, נגמרו הלבבות!</h2>
                <p className="text-xl md:text-3xl mb-8 md:mb-12 opacity-95 font-medium">{userName}, לא קרה כלום.<br /><br />כל {t('גיבור', 'גיבורה')} צריכים להתאמן קצת יותר לפעמים!</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="px-6 py-4 md:px-10 md:py-5 bg-white text-rose-600 rounded-full font-black text-xl md:text-3xl shadow-2xl flex items-center justify-center gap-3 md:gap-4 mx-auto w-full"
                >
                  <RefreshCcw strokeWidth={3} className="w-6 h-6 md:w-8 md:h-8" /> מתחילים מההתחלה
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* --- VICTORY SCREEN --- */}
          {screen === 'victory' && (
            <motion.div key="victory" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center flex-1 p-4 md:p-8 text-white text-center relative overflow-y-auto w-full h-full">
              <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm"></div>

              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="relative z-10 bg-black/40 p-8 md:p-14 rounded-3xl md:rounded-[3rem] backdrop-blur-2xl border border-white/30 shadow-2xl max-w-sm md:max-w-3xl w-full my-auto shrink-0">
                <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Star fill="yellow" className="text-yellow-400 mb-8 md:mb-10 drop-shadow-[0_0_50px_rgba(253,224,71,0.9)] mx-auto w-32 h-32 md:w-[180px] md:h-[180px]" />
                </motion.div>
                <h2 className="text-6xl md:text-8xl font-black mb-6 md:mb-8 tracking-tight drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-200">ניצחון אדיר! 🏆</h2>
                <p className="text-2xl md:text-4xl mb-12 md:mb-16 leading-relaxed font-bold text-white/90">כל הכבוד <span className="text-yellow-300 drop-shadow-md">{userName}</span>!<br />סיימת את כל האתגרים של ב'2 והוכחת שאת/ה {t('אלוף', 'אלופה')} אמיתי/ת בחשבון!</p>

                <div className="flex flex-col sm:flex-row gap-5 md:gap-6 justify-center">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setScreen('shareCertificate')}
                    className="px-10 py-5 md:px-12 md:py-6 bg-purple-600 text-white rounded-2xl md:rounded-full font-black text-2xl md:text-3xl shadow-[0_15px_35px_-5px_rgba(147,51,234,0.6)] flex items-center justify-center gap-3 md:gap-4 border-4 border-purple-400"
                  >
                    <Download strokeWidth={3} className="w-6 h-6 md:w-8 md:h-8" /> התעודה שלי
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setScreen('welcome')}
                    className="px-10 py-5 md:px-12 md:py-6 bg-white text-indigo-800 rounded-2xl md:rounded-full font-black text-2xl md:text-3xl shadow-xl border-4 border-white/50 hover:bg-slate-50"
                  >
                    למסך הראשי
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}