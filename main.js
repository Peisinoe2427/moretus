import "./css/reset.css";
import "./css/style.css";


let selectedLanguage = null;

const inkButtons = document.querySelectorAll('.ink-btn');
const columns = document.querySelectorAll('.column');
const feedback = document.querySelector('.feedback');


// INK GAME
// When user clicks an ink bottle
inkButtons.forEach(btn => {
    btn.addEventListener('click', () => {
    selectedLanguage = btn.dataset.language;
    feedback.textContent = `You selected: ${selectedLanguage}`;
    });
});

// When user clicks a column
columns.forEach(col => {
    col.addEventListener('click', () => {
        if (!selectedLanguage) {
            feedback.textContent = "Choose an ink first!";
            return;
        }

        if (col.dataset.language === selectedLanguage) {
            col.classList.add('inked');
            feedback.textContent = `Correct! You inked the ${selectedLanguage} script.`;
        } else {
            feedback.textContent = `Oops, that's not the ${selectedLanguage} script. Try again!`;
        }

        selectedLanguage = null;
    });
});