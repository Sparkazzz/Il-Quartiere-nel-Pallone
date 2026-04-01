const QUIZ_STORAGE_KEY = "il-quartiere-nel-pallone-completed";

const questions = [
  {
    question: "Quale club ha vinto la prima Coppa dei Campioni della storia nel 1956?",
    answers: ["Barcellona", "Real Madrid", "Milan", "Benfica"],
    correct: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Alfredo_Di_St%C3%A9fano_1963.jpg",
    caption: "Risposta corretta: Real Madrid"
  },
  {
    question: "Chi è tuttora l’unico portiere ad aver vinto il Pallone d’Oro?",
    answers: ["Dino Zoff", "Gianluigi Buffon", "Lev Yashin", "Manuel Neuer"],
    correct: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/1/19/Lev_Yashin_1965.jpg",
    caption: "Risposta corretta: Lev Yashin"
  },
  {
    question: "Chi detiene il record di gol segnati in una singola edizione dei Mondiali?",
    answers: ["Miroslav Klose", "Just Fontaine", "Pelé", "Ronaldo Nazário"],
    correct: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Just_Fontaine_1970.jpg",
    caption: "Risposta corretta: Just Fontaine"
  },
  {
    question: "Chi è il più giovane marcatore in una finale di Coppa del Mondo?",
    answers: ["Kylian Mbappé", "Pelé", "Gerd Müller", "Lionel Messi"],
    correct: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_Brasil_%281970%29.jpg",
    caption: "Risposta corretta: Pelé"
  },
  {
    question: "Chi è stato il primo calciatore a segnare in cinque Mondiali diversi?",
    answers: ["Miroslav Klose", "Pelé", "Cristiano Ronaldo", "Lionel Messi"],
    correct: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg",
    caption: "Risposta corretta: Cristiano Ronaldo"
  },
  {
    question: "Chi ha realizzato la tripletta più veloce nella storia della Premier League?",
    answers: ["Sadio Mané", "Sergio Agüero", "Alan Shearer", "Mohamed Salah"],
    correct: 0,
    image: "https://upload.wikimedia.org/wikipedia/commons/9/96/Sadio_Man%C3%A9_2018.jpg",
    caption: "Risposta corretta: Sadio Mané"
  },
  {
    question: "Quale squadra è rimasta imbattuta per tutta una stagione di Premier League nel 2003-04?",
    answers: ["Chelsea", "Manchester United", "Arsenal", "Liverpool"],
    correct: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Thierry_Henry_2012.jpg",
    caption: "Risposta corretta: Arsenal"
  },
  {
    question: "Chi è il marcatore più anziano della storia della Champions League?",
    answers: ["Zlatan Ibrahimović", "Francesco Totti", "Pepe", "Ryan Giggs"],
    correct: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Pepe_2018.jpg",
    caption: "Risposta corretta: Pepe"
  },
  {
    question: "Quale club inglese è stato il primo a vincere campionato, FA Cup e Champions League nella stessa stagione?",
    answers: ["Liverpool", "Chelsea", "Manchester United", "Manchester City"],
    correct: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/5/56/Ryan_Giggs_testimonial_match.jpg",
    caption: "Risposta corretta: Manchester United"
  },
  {
    question: "Quale nazionale ha partecipato a tutte le edizioni dei Mondiali di calcio?",
    answers: ["Germania", "Italia", "Argentina", "Brasile"],
    correct: 3,
    image: "https://upload.wikimedia.org/wikipedia/commons/0/05/Cafu_2013.jpg",
    caption: "Risposta corretta: Brasile"
  }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");
const lockedScreen = document.getElementById("locked-screen");

const startBtn = document.getElementById("start-btn");
const questionCounter = document.getElementById("question-counter");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const feedback = document.getElementById("feedback");
const feedbackText = document.getElementById("feedback-text");
const imageBox = document.getElementById("image-box");
const answerImage = document.getElementById("answer-image");
const imageCaption = document.getElementById("image-caption");
const nextBtn = document.getElementById("next-btn");
const finalScore = document.getElementById("final-score");

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer = null;
let answered = false;

function init() {
  const alreadyCompleted = localStorage.getItem(QUIZ_STORAGE_KEY);

  if (alreadyCompleted === "true") {
    startScreen.classList.add("hidden");
    quizScreen.classList.add("hidden");
    endScreen.classList.add("hidden");
    lockedScreen.classList.remove("hidden");
    return;
  }

  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", goNextQuestion);
}

function startQuiz() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  resetState();

  const q = questions[currentQuestionIndex];
  questionCounter.textContent = `Domanda ${currentQuestionIndex + 1} / ${questions.length}`;
  progressFill.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
  questionText.textContent = q.question;

  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer;
    btn.addEventListener("click", () => selectAnswer(index));
    answersContainer.appendChild(btn);
  });

  startTimer();
}

function resetState() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = timeLeft;
  answered = false;
  answersContainer.innerHTML = "";
  feedback.classList.add("hidden");
  imageBox.classList.add("hidden");
  answerImage.src = "";
  imageCaption.textContent = "";
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeOut();
    }
  }, 1000);
}

function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;
  clearInterval(timer);

  const q = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === q.correct) {
      btn.classList.add("correct");
    } else if (index === selectedIndex) {
      btn.classList.add("wrong");
    }
  });

  if (selectedIndex === q.correct) {
    score++;
    feedbackText.textContent = "Risposta corretta.";
    showCorrectImage(q);
  } else {
    feedbackText.textContent = `Risposta sbagliata. Quella corretta era: ${q.answers[q.correct]}.`;
  }

  feedback.classList.remove("hidden");
}

function handleTimeOut() {
  if (answered) return;

  answered = true;

  const q = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === q.correct) {
      btn.classList.add("correct");
    }
  });

  feedbackText.textContent = `Tempo scaduto. La risposta corretta era: ${q.answers[q.correct]}.`;
  feedback.classList.remove("hidden");
}

function showCorrectImage(question) {
  answerImage.src = question.image;
  answerImage.alt = question.caption;
  imageCaption.textContent = question.caption;
  imageBox.classList.remove("hidden");
}

function goNextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    finishQuiz();
    return;
  }

  showQuestion();
}

function finishQuiz() {
  localStorage.setItem(QUIZ_STORAGE_KEY, "true");

  quizScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");
  progressFill.style.width = "100%";
  finalScore.textContent = `Punteggio finale: ${score} su ${questions.length}.`;
}

init();
