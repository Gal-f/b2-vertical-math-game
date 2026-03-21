import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Trophy, Timer, Star, ArrowLeft, ArrowRight, User, Play, RefreshCcw, XCircle, Map, HelpCircle, X, Download, Lock, CheckCircle2, Home } from 'lucide-react';

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
    bg: 'https://www.novakidschool.com/he/blog/wp-content/uploads/2024/02/%D7%9B%D7%9C-%D7%90%D7%97%D7%93-%D7%9E%D7%94%D7%9E%D7%93%D7%91%D7%A8%D7%99%D7%95%D7%AA-%D7%94%D7%9C%D7%9C%D7%95-%D7%9E%D7%A6%D7%99%D7%92-%D7%A0%D7%95%D7%A3-%D7%A2%D7%95%D7%A6%D7%A8-%D7%A0%D7%A9%D7%99%D7%9E%D7%94-%D7%9C%D7%94%D7%A8%D7%A4%D7%AA%D7%A7%D7%90%D7%95%D7%AA-%D7%90%D7%9A-%D7%94%D7%9D-%D7%92%D7%9D-%D7%9E%D7%AA%D7%9E%D7%95%D7%93%D7%93%D7%99%D7%9D-%D7%A2%D7%9D-%D7%90%D7%AA%D7%92%D7%A8%D7%99%D7%9D-%D7%9C%D7%90-%D7%9E%D7%A2%D7%98%D7%99%D7%9D.-.jpeg',
    avatar: '🐪',
    avatarName: (gender) => gender === 'male' ? 'מלך המדבר' : 'מלכת המדבר',
    prize: '🌵'
  },
  {
    id: 2,
    name: 'חלל',
    bg: 'https://www.lnk.co.il/wp-content/uploads/2015/07/hs-2009-25-f-xlarge_web-compressor.jpg',
    avatar: '👨‍🚀',
    avatarName: (gender) => gender === 'male' ? 'אסטרונאוט' : 'אסטרונאוטית',
    prize: '🚀'
  },
  {
    id: 3,
    name: 'ג׳ונגל',
    bg: 'https://i.natgeofe.com/n/9d4259f8-29a7-47a6-9eeb-28beeeee3f81/13-jungles-hostile-planet-nationalgeographic_2675333.jpg',
    avatar: '🐒',
    avatarName: (gender) => gender === 'male' ? 'קוף הרפתקן' : 'קופה הרפתקנית',
    prize: '🍌'
  },
  {
    id: 4,
    name: 'כדורגל',
    bg: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000',
    avatar: '⚽',
    avatarName: (gender) => gender === 'male' ? 'שחקן כדורגל' : 'שחקנית כדורגל',
    prize: '🏆'
  },
  {
    id: 5,
    name: 'מתחת למים',
    bg: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000',
    avatar: '🤿',
    avatarName: (gender) => gender === 'male' ? 'צוללן' : 'צוללנית',
    prize: '🐬'
  },
  {
    id: 6,
    name: 'עיר עתידנית',
    bg: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1000',
    avatar: '🤖',
    avatarName: (gender) => 'רובוט',
    prize: '⚙️'
  },
  {
    id: 7,
    name: 'חורף מושלג',
    bg: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&q=80&w=1000',
    avatar: '🐧',
    avatarName: (gender) => 'פינגווין',
    prize: '❄️'
  },
  {
    id: 8,
    name: 'ארמון האבירים',
    bg: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1000',
    avatar: '🛡️',
    avatarName: (gender) => gender === 'male' ? 'אביר' : 'אבירה',
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
    <div className="flex flex-col items-center justify-center font-mono text-4xl md:text-5xl text-slate-800" dir="ltr">

      <div className="h-8 text-sm font-sans text-blue-600 mb-2 font-bold transition-opacity text-center w-full" dir="rtl">
        {activeCarry && !isStatic ? t('כתוב כאן את ההמרה של הספרה שכאן למטה 👇🏼', 'כתבי כאן את ההמרה של הספרה שכאן למטה 👇🏼') : ''}
      </div>

      <div className="flex justify-end gap-2 w-48 mb-2 pr-2 relative">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-sans mb-1">המרה</span>
          {!isStatic ? (
            <input
              type="text" maxLength="1"
              value={carryTens}
              onChange={(e) => setCarryTens(e.target.value.replace(/[^0-9]/g, ''))}
              onFocus={() => setActiveCarry('tens')}
              onBlur={() => setActiveCarry(null)}
              className="w-12 h-12 border-2 border-dashed border-blue-300 rounded text-center text-2xl bg-blue-50 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-2xl text-red-600 font-bold border-2 border-red-200 bg-red-50 rounded">
              {displayCarryTens}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-sans mb-1">המרה</span>
          {!isStatic ? (
            <input
              type="text" maxLength="2"
              value={carryOnes}
              onChange={(e) => setCarryOnes(e.target.value.replace(/[^0-9]/g, ''))}
              onFocus={() => setActiveCarry('ones')}
              onBlur={() => setActiveCarry(null)}
              className="w-12 h-12 border-2 border-dashed border-blue-300 rounded text-center text-2xl bg-blue-50 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-2xl text-red-600 font-bold border-2 border-red-200 bg-red-50 rounded">
              {displayCarryOnes}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end border-b-4 border-slate-800 pb-2 w-48 pr-2 relative">
        <span className="absolute left-0 bottom-2 text-5xl">{type}</span>

        <div className="flex gap-2 tracking-widest relative z-10">
          <div className={`w-12 text-center relative ${strikeTens ? "text-slate-400" : ""}`}>
            {n1Tens}
            {strikeTens && <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500 -rotate-12 transform -translate-y-1/2 rounded-full"></div>}
          </div>
          <div className={`w-12 text-center relative ${strikeOnes ? "text-slate-400" : ""}`}>
            {n1Ones}
            {strikeOnes && <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500 -rotate-12 transform -translate-y-1/2 rounded-full"></div>}
          </div>
        </div>

        <div className="flex gap-2 tracking-widest mt-2">
          <div className="w-12 text-center">{n2Tens}</div>
          <div className="w-12 text-center">{n2Ones}</div>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2 w-48 pr-2">
        {!isStatic ? (
          <>
            <input
              ref={tensRef}
              type="text" maxLength="2"
              value={resTens}
              onChange={(e) => {
                setResTens(e.target.value.replace(/[^0-9-]/g, ''));
                if (e.target.value) onesRef.current?.focus();
              }}
              className="w-12 h-14 border-2 border-slate-300 rounded text-center text-4xl bg-white focus:outline-none focus:border-green-500 shadow-inner"
            />
            <input
              ref={onesRef}
              type="text" maxLength="1" autoFocus
              value={resOnes}
              onChange={(e) => {
                setResOnes(e.target.value.replace(/[^0-9]/g, ''));
                if (e.target.value) tensRef.current?.focus();
              }}
              className="w-12 h-14 border-2 border-slate-300 rounded text-center text-4xl bg-white focus:outline-none focus:border-green-500 shadow-inner"
            />
          </>
        ) : (
          <>
            <div className="w-12 h-14 flex items-center justify-center bg-green-50 rounded text-green-600 font-bold border-2 border-green-200">{displayResTens}</div>
            <div className="w-12 h-14 flex items-center justify-center bg-green-50 rounded text-green-600 font-bold border-2 border-green-200">{displayResOnes}</div>
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
  const certificateRef = useRef(null);

  const t = useCallback((m, f) => (gender === 'male' ? m : f), [gender]);

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

      setTimeout(advanceProgress, currentEx.isSpecial ? 3500 : 1200);
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

      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'certificate.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'התעודה שלי',
            text: `ההישגים שלי במשחק של ב׳2! פרסים: ${earnedPrizes.join(' ')}`,
            files: [file]
          });
        }
      }
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

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes drop { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }
      .confetti { position: absolute; animation: drop 3s linear forwards; font-size: 2rem; z-index: 10; pointer-events: none; }
      @keyframes hands { 0% { transform: translateY(-20px); } 100% { transform: translateY(20px); } }
      .anim-hand-left { animation: hands 0.4s infinite alternate; display: inline-block; }
      .anim-hand-right { animation: hands 0.4s infinite alternate-reverse; display: inline-block; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="w-full h-screen max-h-[850px] bg-slate-200 p-2 md:p-6 flex items-center justify-center font-sans overflow-hidden" dir="rtl">
      <div className="w-full h-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col">

        {/* --- WELCOME SCREEN --- */}
        {screen === 'welcome' && (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white relative">
            <Trophy size={80} className="mb-6 animate-bounce text-yellow-300" />
            <h1 className="text-5xl font-bold mb-4">המשחק של ב׳2</h1>
            <p className="text-xl mb-10 max-w-md">ברוכים הבאים לאתגר החשבון הגדול! מוכנים לצאת למסע?</p>
            <button
              onClick={() => setScreen('setup')}
              className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-2xl hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
            >
              מתחילים! <ArrowLeft />
            </button>
          </div>
        )}

        {/* --- SETUP SCREEN --- */}
        {screen === 'setup' && (
          <div className="flex flex-col items-center justify-center flex-1 p-8 bg-white text-slate-800">
            <User size={48} className="text-blue-500 mb-4" />
            <h2 className="text-3xl font-bold mb-8">ספרו לנו עליכם</h2>

            <div className="w-full max-w-sm space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">איך קוראים לך?</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-center text-xl"
                  placeholder="השם שלך כאן"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">אני...</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all font-bold ${gender === 'male' ? 'bg-blue-500 text-white border-blue-500' : 'bg-slate-50 border-slate-200'}`}
                  >שחקן 👦</button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all font-bold ${gender === 'female' ? 'bg-pink-500 text-white border-pink-500' : 'bg-slate-50 border-slate-200'}`}
                  >שחקנית 👧</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">רמת קושי</label>
                <div className="flex gap-2">
                  {['קל', 'בינוני', 'קשה'].map(d => (
                    <button key={d} onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-lg text-sm border-2 font-bold transition-all ${difficulty === d ? 'bg-purple-500 text-white border-purple-500' : 'bg-slate-50 border-slate-200'}`}
                    >{d}</button>
                  ))}
                </div>
              </div>

              <button
                disabled={!userName}
                onClick={() => setScreen('map')}
                className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
              >
                {t('מוכן?', 'מוכנה?')} <ArrowLeft size={24} />
              </button>
            </div>
          </div>
        )}

        {/* --- MAP SCREEN --- */}
        {screen === 'map' && (
          <div className="flex flex-col flex-1 bg-slate-800 text-white relative">
            <div className="p-4 bg-slate-900 flex justify-between items-center shadow-md z-10">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Map /> מפת האתגרים</h2>
              <div className="flex items-center gap-2 text-yellow-400 font-bold bg-slate-800 px-4 py-1 rounded-full border border-slate-700">
                פרסים: {earnedPrizes.length === 0 ? 'אין עדיין' : earnedPrizes.join(' ')}
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4 relative overflow-y-auto">
              <div className="w-2 h-full bg-slate-700 absolute left-1/2 -translate-x-1/2 rounded-full"></div>
              {THEMES.map((th, idx) => {
                const isUnlocked = idx <= challengeIdx;
                const isCurrent = idx === challengeIdx;
                const isDone = idx < challengeIdx;
                return (
                  <div key={th.id} className="relative z-10 w-full max-w-sm">
                    <button
                      onClick={() => isCurrent && setScreen('challengeIntro')}
                      disabled={!isCurrent}
                      className={`w-full p-4 rounded-2xl border-4 transition-all flex items-center gap-4 shadow-xl
                        ${isCurrent ? 'bg-blue-600 border-yellow-400 scale-105 cursor-pointer' :
                          isDone ? 'bg-green-600 border-green-500 opacity-80' :
                            'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed'}`}
                    >
                      <div className="text-4xl">{isDone ? th.prize : isUnlocked ? th.avatar : <Lock className="text-slate-400" />}</div>
                      <div className="flex-1 text-right">
                        <div className="font-bold text-xl">{th.name}</div>
                        <div className="text-sm opacity-80">{isDone ? 'הושלם!' : isCurrent ? 'האתגר הבא שלך' : 'נעול'}</div>
                      </div>
                      {isCurrent && <Play className="text-yellow-400 animate-pulse" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- CHALLENGE INTRO SCREEN --- */}
        {screen === 'challengeIntro' && (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-6 text-white relative bg-cover bg-center" style={{ backgroundImage: `url(${theme.bg})` }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            <button onClick={() => setScreen('map')} className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full transition-colors font-bold border border-white/20">
              <Home size={20} /> חזרה למפה
            </button>

            <div className="relative z-10 bg-white/20 p-10 rounded-3xl border border-white/30 backdrop-blur-md shadow-2xl max-w-lg w-full">
              <div className="text-7xl mb-4">{theme.avatar}</div>
              <h2 className="text-4xl font-bold mb-4">{t('ברוך הבא', 'ברוכה הבאה')} ל{theme.name}!</h2>
              <p className="text-2xl mb-8">
                <span className="font-bold">{userName}</span>, ה{theme.avatarName(gender)} שלנו {theme.avatar}, {t('בוא נראה מה אתה יודע', 'בואי נראה מה את יודעת')}.
              </p>
              <button
                onClick={startNewExercise}
                className="w-full py-4 bg-yellow-400 text-black rounded-full font-bold text-2xl hover:bg-yellow-300 transition-colors shadow-xl"
              >
                {t('התחל אתגר!', 'התחילי אתגר!')}
              </button>
            </div>
          </div>
        )}

        {/* --- TASK TRANSITION SCREEN --- */}
        {screen === 'taskTransition' && (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-white text-center relative bg-cover bg-center" style={{ backgroundImage: `url(${theme.bg})` }}>
            <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm" />

            <button onClick={() => setScreen('map')} className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full transition-colors font-bold border border-white/20">
              <Home size={20} /> חזרה למפה
            </button>

            <div className="relative z-10 flex flex-col items-center">
              <CheckCircle2 size={100} className="text-green-400 mb-6 drop-shadow-lg" />
              <h2 className="text-5xl font-bold mb-4">כל הכבוד!</h2>
              <p className="text-2xl mb-8">סיימת את המשימה הראשונה באתגר ה{theme.name}. {t('מוכן', 'מוכנה')} למשימה השנייה?</p>
              <div className="flex gap-2 mb-10">
                <div className="w-16 h-4 bg-green-400 rounded-full shadow-inner border border-green-300"></div>
                <div className="w-16 h-4 bg-white/30 rounded-full border border-white/20"></div>
              </div>
              <button
                onClick={() => { setExerciseIdx(0); startNewExercise(); }}
                className="px-10 py-4 bg-white text-blue-600 rounded-full font-bold text-2xl hover:scale-105 shadow-xl flex items-center gap-2"
              >
                למשימה השנייה <ArrowLeft />
              </button>
            </div>
          </div>
        )}

        {/* --- CHALLENGE COMPLETE SCREEN --- */}
        {screen === 'challengeComplete' && (
          <div className="flex flex-col items-center justify-center flex-1 p-8 bg-purple-700 text-white text-center relative overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}>{['🎉', '✨', '🏆', '⭐'][Math.floor(Math.random() * 4)]}</span>
            ))}

            <div className="relative z-10 bg-white/10 p-10 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
              <h2 className="text-5xl font-bold mb-4 text-yellow-300">אתגר הושלם!</h2>
              <p className="text-2xl mb-6">כל הכבוד {userName}, סיימת את אתגר ה{theme.name}!</p>

              <div className="bg-white/20 rounded-2xl p-6 mb-8 inline-block shadow-inner border border-white/10">
                <p className="text-lg mb-2">הפרס שלך:</p>
                <div className="text-8xl animate-bounce">{theme.prize}</div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleChallengeCompleteToMap}
                  className="px-8 py-4 bg-green-500 rounded-full font-bold text-xl hover:bg-green-400 shadow-lg flex items-center gap-2"
                >
                  <Map size={24} /> חזרה למפה
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- SHARE CERTIFICATE SCREEN --- */}
        {screen === 'shareCertificate' && (
          <div className="flex flex-col flex-1 bg-slate-100 items-center justify-center p-6 relative overflow-y-auto">
            <div id="certificate-render" className="bg-white p-10 rounded-3xl shadow-2xl border-[10px] border-yellow-400 max-w-lg w-full text-center relative mb-6 relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}></div>
              <Star className="absolute top-6 right-6 text-yellow-400 drop-shadow-md" size={50} fill="yellow" />
              <Star className="absolute top-6 left-6 text-yellow-400 drop-shadow-md" size={50} fill="yellow" />

              <div className="relative z-10">
                <Trophy className="mx-auto mb-4 text-yellow-500" size={60} />
                <h2 className="text-4xl font-bold text-blue-800 mb-2">תעודת הצטיינות</h2>
                <p className="text-2xl text-slate-600 mb-6">ל{gender === 'male' ? 'שחקן' : 'שחקנית'} ה{t('אלוף', 'אלופה')}:</p>
                <h3 className="text-5xl font-extrabold text-purple-600 mb-8 border-b-4 border-purple-200 pb-4 inline-block px-8">{userName}</h3>

                <p className="font-bold text-slate-700 text-xl mb-4">אלו הפרסים שזכיתי בהם במשחק של ב׳2:</p>
                <div className="flex flex-wrap justify-center gap-4 mb-4 bg-slate-50 p-6 rounded-2xl min-h-[100px] border border-slate-200 shadow-inner">
                  {earnedPrizes.length > 0
                    ? earnedPrizes.map((p, i) => <span key={i} className="text-5xl bg-white p-3 rounded-xl shadow">{p}</span>)
                    : <span className="text-slate-400 text-lg flex items-center h-full">עוד אין פרסים, המשיכו לשחק!</span>
                  }
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full max-w-lg">
              <button
                onClick={downloadAndShareCertificate}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={24} /> {t('שתף', 'שתפי')} הישגים
              </button>
              <button
                onClick={() => setScreen('welcome')}
                className="py-4 px-6 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-xl font-bold text-xl transition-colors"
              >
                למסך הראשי
              </button>
            </div>
          </div>
        )}

        {/* --- PLAYING SCREEN --- */}
        {screen === 'playing' && currentEx && (
          <div className="relative flex-1 flex flex-col">
            <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000" style={{ backgroundImage: `url(${theme.bg})` }}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 p-4 flex justify-between items-center text-white bg-black/40 backdrop-blur-md border-b border-white/10 shadow-md">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowInstructions(true)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="הוראות">
                  <HelpCircle size={24} />
                </button>
                <button onClick={() => setScreen('map')} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors flex items-center gap-2 font-bold px-4" title="למפה">
                  <Home size={18} /> מפה
                </button>
                <div className="flex flex-col hidden sm:flex">
                  <span className="text-xs text-blue-200">{theme.name} - אתגר {challengeIdx + 1}/8</span>
                  <span className="font-bold">{userName} ה{theme.avatarName(gender)} {theme.avatar}</span>
                </div>
              </div>
              <div className="flex gap-1 bg-black/30 p-2 rounded-full border border-white/10 shadow-inner">
                {Array(MAX_HEARTS).fill(0).map((_, i) => (
                  <Heart key={i} size={22} fill={i < hearts ? "#f43f5e" : "none"} stroke={i < hearts ? "#f43f5e" : "white"} className={i < hearts ? "drop-shadow-md" : "opacity-30"} />
                ))}
              </div>
            </div>

            <div className="relative z-10 w-full h-2 bg-black/40">
              <div
                className="h-full bg-gradient-to-l from-yellow-300 to-yellow-500 transition-all duration-500 shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                style={{ width: `${((exerciseIdx + (taskIdx * EXERCISES_PER_TASK)) / (EXERCISES_PER_TASK * TASKS_PER_CHALLENGE)) * 100}%` }}
              />
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl border-4 border-blue-400 min-w-[340px] relative">

                <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-100">
                  <div className="text-sm font-bold bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
                    משימה {taskIdx + 1} | תרגיל {exerciseIdx + 1}/8
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${timeLeft < 10 ? 'bg-red-50 border-red-300 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    <Timer size={24} />
                    <span className="text-2xl font-mono font-bold">{timeLeft}</span>
                  </div>
                </div>

                <VerticalProblem
                  num1={currentEx.num1} num2={currentEx.num2} type={currentEx.type}
                  resTens={resTens} setResTens={setResTens} resOnes={resOnes} setResOnes={setResOnes}
                  carryTens={carryTens} setCarryTens={setCarryTens} carryOnes={carryOnes} setCarryOnes={setCarryOnes}
                  gender={gender}
                />

                <button
                  onClick={checkAnswer}
                  disabled={(!resOnes && !resTens) || isChecking}
                  className={`mt-8 w-full py-4 text-white rounded-2xl font-bold text-xl transition-all shadow-lg flex items-center justify-center gap-2
                    ${isSuccessAction ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-gradient-to-l from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                >
                  {isSuccessAction ? 'כל הכבוד! ✅' : t('בדיקה', 'בדיקה')}
                </button>
              </div>
            </div>

            {/* Bonus Logic */}
            {bonusActive && (
              <div
                onClick={handleBonusCatch}
                className="absolute z-50 cursor-pointer transition-all duration-300 hover:scale-125"
                style={{ top: bonusPos.top, left: bonusPos.left }}
              >
                <div className="bg-white/95 p-4 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.6)] backdrop-blur-sm border border-red-200">
                  <Heart fill="#f43f5e" stroke="#f43f5e" size={50} className="animate-bounce drop-shadow-lg" />
                </div>
              </div>
            )}
            {bonusMessageVisible && (
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-40 bg-yellow-400 text-black font-bold px-8 py-4 rounded-full shadow-2xl border-4 border-white text-lg text-center whitespace-nowrap animate-bounce">
                {t('פתרת נכון 4 תרגילים ברצף! יש לך 6 שניות לתפוס את הלב!', 'פתרת נכון 4 תרגילים ברצף! יש לך 6 שניות לתפוס את הלב!')}
              </div>
            )}

            {/* Special Animation 67 */}
            {showSpecialAnim && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="flex items-center gap-6 bg-white p-8 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.6)] border-8 border-yellow-300">
                  <span className="font-extrabold text-7xl text-blue-600 drop-shadow-md">7</span>
                  <div className="flex gap-2 relative top-2">
                    <span className="anim-hand-left text-[80px]">🫱</span>
                    <span className="text-[80px] -mt-4">🤩</span>
                    <span className="anim-hand-right text-[80px]">🫲</span>
                  </div>
                  <span className="font-extrabold text-7xl text-pink-600 drop-shadow-md">6</span>
                </div>
              </div>
            )}

            {/* Instructions */}
            {showInstructions && (
              <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-3xl max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
                  <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"><X size={32} /></button>
                  <h2 className="text-3xl font-bold mb-6 text-blue-600 border-b pb-4">איך משחקים?</h2>
                  <ul className="space-y-4 text-lg text-slate-700">
                    <li className="flex items-start gap-3"><Timer className="text-blue-500 shrink-0 mt-1" /> <div><b>הזמן רץ!</b> פתרו את התרגילים לפני שהשעון יתאפס.</div></li>
                    <li className="flex items-start gap-3"><Heart className="text-red-500 shrink-0 mt-1" fill="#f43f5e" /> <div><b>לבבות:</b> טעות או חריגה מהזמן מורידות לב. נגמרו הלבבות? מתחילים מהתחלה.</div></li>
                    <li className="flex items-start gap-3"><span className="text-2xl shrink-0 leading-none">✍️</span> <div><b>המרות:</b> השתמשו בריבועים העליונים כדי לכתוב המרות (עשרות או אחדות). כשמקלידים המרה, הספרה למטה תימחק בקו!</div></li>
                    <li className="flex items-start gap-3"><span className="text-2xl shrink-0 leading-none">🎁</span> <div><b>בונוס:</b> 4 תשובות נכונות ברצף יעניקו לכם לב מתנה שיופיע על המסך לזמן מוגבל.</div></li>
                  </ul>
                  <button onClick={() => setShowInstructions(false)} className="mt-8 w-full py-4 bg-green-500 text-white rounded-xl font-bold text-xl hover:bg-green-600 shadow-md">הבנתי, בואו נמשיך!</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- FEEDBACK SCREEN --- */}
        {screen === 'feedback' && (
          <div className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-cover bg-center overflow-y-auto" style={{ backgroundImage: `url(${theme.bg})` }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            <button onClick={() => setScreen('map')} className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full transition-colors font-bold border border-white/20">
              <Home size={20} /> חזרה למפה
            </button>

            <div className="relative z-10 p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center bg-white border-t-8 border-red-500 my-auto">

              {feedbackType === 'timeout' && (
                <div className="text-center mb-6">
                  <Timer size={64} className="text-red-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-red-600">אוי, הזמן נגמר!</h2>
                  <p className="text-slate-600 mt-2 font-medium">אל דאגה, בואו נראה איך פותרים את זה:</p>
                </div>
              )}

              {feedbackType === 'error' && (
                <div className="text-center mb-6">
                  <XCircle size={64} className="text-red-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-3xl font-bold text-red-600">{t('לא נורא, תטעה ותלמד!', 'לא נורא, תטעי ותלמדי!')}</h2>
                  {confusedOperation && (
                    <div className="bg-orange-100 text-orange-800 p-3 rounded-xl mt-4 font-bold border border-orange-200 shadow-sm text-sm">
                      נראה שהתבלבלת בין חיבור לחיסור! שימו לב לסימן.
                    </div>
                  )}
                  <p className="text-slate-600 mt-4 font-medium">הנה הפתרון הנכון במאונך:</p>
                </div>
              )}

              <div className="p-4 md:p-6 bg-slate-50 rounded-2xl mb-6 w-full border border-slate-200 shadow-inner flex justify-center">
                <VerticalProblem
                  num1={currentEx.num1} num2={currentEx.num2} type={currentEx.type}
                  isStatic
                  correctData={calculateCorrectSolution(currentEx.num1, currentEx.num2, currentEx.type)}
                  gender={gender}
                />
              </div>

              <div className="flex items-center gap-3 mb-6 bg-red-50 px-6 py-3 rounded-full border border-red-100 w-full justify-center">
                <Heart fill="#f43f5e" stroke="#f43f5e" size={28} className="animate-pulse" />
                <span className="text-xl font-bold text-red-600">נשארו לך {hearts} לבבות</span>
              </div>

              <button
                onClick={advanceProgress}
                className="relative overflow-hidden w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-xl shadow-lg flex items-center justify-center gap-2 group hover:bg-blue-700 transition-colors"
              >
                <div className="absolute left-0 top-0 h-full bg-black/20 transition-all duration-1000 ease-linear" style={{ width: `${(feedbackCountdown / 30) * 100}%` }}></div>
                <span className="relative z-10 flex items-center gap-2">
                  {t('ממשיכים לתרגיל הבא', 'ממשיכות לתרגיל הבא')} <ArrowLeft />
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm shadow-inner">{feedbackCountdown}</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* --- GAME OVER SCREEN --- */}
        {screen === 'gameOver' && (
          <div className="flex flex-col items-center justify-center flex-1 p-8 bg-red-600 text-white text-center relative overflow-hidden">
            <RefreshCcw size={100} className="mb-8 animate-spin-slow opacity-50 absolute -right-10 -top-10" />
            <div className="relative z-10">
              <h2 className="text-6xl font-bold mb-6">אופס, נגמרו הלבבות!</h2>
              <p className="text-2xl mb-12 max-w-lg mx-auto">{userName}, לא קרה כלום. כל {t('גיבור', 'גיבורה')} צריכים להתאמן קצת יותר לפעמים!</p>
              <button
                onClick={resetGame}
                className="px-10 py-5 bg-white text-red-600 rounded-full font-bold text-3xl hover:scale-105 transition-transform shadow-2xl flex items-center gap-4 mx-auto"
              >
                <RefreshCcw size={32} /> מתחילים מההתחלה
              </button>
            </div>
          </div>
        )}

        {/* --- VICTORY SCREEN --- */}
        {screen === 'victory' && (
          <div className="flex flex-col items-center justify-center flex-1 p-8 bg-gradient-to-br from-green-400 to-blue-500 text-white text-center relative overflow-hidden">
            {Array.from({ length: 80 }).map((_, i) => (
              <span key={i} className="confetti" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}>🎉</span>
            ))}
            <div className="relative z-10">
              <Star size={120} fill="yellow" className="text-yellow-400 mb-6 animate-pulse drop-shadow-[0_0_30px_rgba(253,224,71,0.8)] mx-auto" />
              <h2 className="text-6xl font-bold mb-4">ניצחון אדיר! 🏆</h2>
              <p className="text-3xl mb-12 max-w-xl mx-auto leading-relaxed font-medium">כל הכבוד {userName}! סיימת את כל האתגרים של ב'2 והוכחת שאת/ה {t('אלוף', 'אלופה')} אמיתי/ת בחשבון!</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setScreen('shareCertificate')}
                  className="px-8 py-4 bg-purple-600 text-white rounded-full font-bold text-2xl hover:bg-purple-500 transition-colors shadow-xl flex items-center gap-2"
                >
                  <Download /> התעודה שלי
                </button>
                <button
                  onClick={() => setScreen('welcome')}
                  className="px-8 py-4 bg-white text-green-600 rounded-full font-bold text-2xl hover:scale-105 transition-transform shadow-xl"
                >
                  למסך הראשי
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}