document.addEventListener('DOMContentLoaded', () => {
    const quizBox = document.getElementById('quiz-box');
    const resultBox = document.getElementById('result-box');
    const questionEl = document.getElementById('question');
    const answersEl = document.getElementById('answers');
    const progressTextEl = document.getElementById('progress-text');

    let questions = [];
    let currentQuestionId = 1;
    let userScores = {};
    let questionCount = 0;

    // JSON 데이터 로드
    fetch('heartpigeon_DB.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            startQuiz();
        })
        .catch(error => {
            console.error('DB 파일을 불러오는 데 실패했습니다:', error);
            questionEl.textContent = '질문을 불러오는 데 실패했습니다. 파일을 확인해주세요.';
        });

    function startQuiz() {
        showQuestion(currentQuestionId);
    }

    function showQuestion(id) {
        const question = questions.find(q => q.question_id === id);
        if (!question) {
            showResult();
            return;
        }

        questionCount++;
        progressTextEl.textContent = `Q${questionCount}`;
        questionEl.textContent = question.question_text;
        answersEl.innerHTML = '';

        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.answer_text;
            button.addEventListener('click', () => selectAnswer(answer));
            answersEl.appendChild(button);
        });
    }

    function selectAnswer(answer) {
        // 점수 합산
        for (const type in answer.score) {
            if (userScores[type]) {
                userScores[type] += answer.score[type];
            } else {
                userScores[type] = answer.score[type];
            }
        }

        // 다음 질문으로 이동
        if (answer.next_question_id) {
            showQuestion(answer.next_question_id);
        } else {
            showResult();
        }
    }

    function showResult() {
        quizBox.classList.add('hidden');
        resultBox.classList.remove('hidden');

        // 최고 점수 유형 찾기
        let resultType = '';
        let maxScore = -1;
        const mainTypes = ['실용형', '취향형', '감성형', '경험형'];

        mainTypes.forEach(type => {
            if (userScores[type] > maxScore) {
                maxScore = userScores[type];
                resultType = type;
            }
        });

        document.getElementById('result-type').textContent = resultType;
        document.getElementById('result-scores').textContent = JSON.stringify(userScores, null, 2);
    }
});
