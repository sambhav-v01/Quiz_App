const questionParent = document.querySelector(".questions-container");
const optionsParent = document.querySelector(".options-container");
const nextBtn = document.querySelector(".next");
const quitBtn = document.querySelector(".quit");
const quizCategory = document.querySelector(".quiz-category");
const scoreContiner = document.querySelector(".cur-score");
const rules = document.querySelector(".rule-book");
const quizBook = document.querySelector(".quiz");
const playBtn = document.querySelector(".play-btn");
const qnsCount = document.querySelector(".qns-count");
const result = document.querySelector(".result");
const resultText = document.querySelector(".result-text");
const homeBtn = document.querySelector(".home-btn");


let quizzes = [];
let currentQuestion = 0;
let score = 0;

const getJson = async () => {
  try {
    const {
      data: { results },
    } = await axios.get(
      "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
    );
    return results;
  } catch (err) {
    console.log("Fetch Error:", err);
  }
};

const getData = async () => {
  quizzes = await getJson();
};

playBtn.addEventListener("click", async () => {
  if (quizzes.length === 0) {
    await getData();
  }

  if (quizzes.length > 0) {
    currentQuestion = 0;
    score = 0;
    questionParent.innerText = "";
    optionsParent.innerText = "";
    createQuestionAndOptions(quizzes, currentQuestion);
    quizBook.classList.remove("hide");
    rules.classList.add("hide");
  } else {
    alert("Could not load quiz. Try again.");
  }
});

function createQuestionAndOptions(quizzes, currentQuestion) {
  qnsCount.innerText = `Q${currentQuestion + 1}/${quizzes.length}`;
  scoreContiner.innerText = `Score: ${score}`;
  quizCategory.innerText = quizzes[currentQuestion].category;
  const questionEle = document.createElement("p");
  questionEle.innerText = `Q${currentQuestion + 1}: ${
    quizzes[currentQuestion].question
  }`;
  questionParent.appendChild(questionEle);

  const options = [
    quizzes[currentQuestion].correct_answer,
    ...quizzes[currentQuestion].incorrect_answers,
  ].sort(() => Math.random() - 0.5);

  for (let option of options) {
    const optionBtn = document.createElement("button");
    optionBtn.classList.add("button");
    optionBtn.setAttribute("name", option);
    optionBtn.innerText = option;
    optionsParent.appendChild(optionBtn);
  }
}

nextBtn.addEventListener("click", () => {
  if (nextBtn.innerText === "Next") {
    currentQuestion++;
    questionParent.innerText = "";
    optionsParent.innerText = "";
    createQuestionAndOptions(quizzes, currentQuestion);
    qnsCount.innerText = `Q${currentQuestion + 1}/${quizzes.length}`;
    if (currentQuestion === quizzes.length - 1) {
      nextBtn.innerText = "Submit";
    }
  } else if (nextBtn.innerText === "Submit") {
    quizBook.classList.add("hide");
   result.classList.remove("hide");
resultText.innerText = `Your Score : ${score}`;

  }
});

quitBtn.addEventListener("click", () => {
  currentQuestion = 0;
  questionParent.innerText = "";
  optionsParent.innerText = "";
  score = 0;
  rules.classList.remove("hide");
  quizBook.classList.add("hide");
  nextBtn.innerText = "Next";
});

function disableOptions() {
  document
    .querySelectorAll(".button")
    .forEach((button) => button.setAttribute("disabled", true));
}

optionsParent.addEventListener("click", (e) => {
  if (e.target.name === quizzes[currentQuestion].correct_answer) {
    e.target.classList.add("success");
    disableOptions();
    score++;
    scoreContiner.innerText = `Score: ${score}`;
  } else {
    e.target.classList.add("error");
    disableOptions();
  }
});
homeBtn.addEventListener("click", () => {
  // Reset everything
  currentQuestion = 0;
  score = 0;
  questionParent.innerText = "";
  optionsParent.innerText = "";
  quizBook.classList.add("hide");
  result.classList.add("hide");
  nextBtn.innerText = "Next";
  rules.classList.remove("hide");
});

