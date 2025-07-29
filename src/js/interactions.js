import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { animateInkStep, revealNextSection, wiggleDoor, transitionIntoCh5 } from "./animations.js";

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const closedDoor = document.querySelector(".js-door-closed");
const openDoor = document.querySelector(".js-door-open");
const closedDoorImg = closedDoor?.querySelector("img");
const actualErrors = ["possesed", "bookss", "listenn", "earnned"];

let tapCount=0;
let tapTimer = null;
let words = [];
let currentIndex = 0;
let hasDrawn = false;
let isDrawing = false;
let ctx, canvas, blankCanvasData;


// UTILITY
const setDirection =()=>{
    if (!isMobile) {
        document.querySelector(".directionInk").textContent = "Hover up-down the mouse twice to ink the letters";
    }
}
const hideWithJs=()=>{
    document.querySelector(".img_crown").style.display = "none";
    document.querySelector(".ch5__text").style.display = "none";
    document.querySelector(".ch5__p1").style.display = "none";
    document.querySelector(".ch7").style.paddingBlockEnd = "0";
    document.querySelector(".ch8").style.display="none";
}
const resetFeedback= (message, type = 'neutral') =>{
    const feedback = document.querySelector('.feedback');
    feedback.innerHTML = message;
    feedback.className = `feedback feedback--${type}`;
}


// INK THE LETTER
const handleSwipeRightTrigger = (zoneElement) => {
    let startX = null;

    zoneElement.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    zoneElement.addEventListener("touchend", (e) => {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;

        if (endX - startX > 80) {
        animateInkStep();
        }

        startX = null;
    });
};
const handleMouseFlickUpTrigger = (zoneElement) => {
    let lastY = null;
    let flicks = [];
    const flickThreshold = 15;
    const flickWindow = 1000;

    zoneElement.addEventListener("mousemove", (e) => {
        if (lastY === null) {
        lastY = e.clientY;
        return;
        }

        const deltaY = lastY - e.clientY;
        const now = Date.now();

        if (deltaY > flickThreshold) {
        flicks.push(now);
        flicks = flicks.filter(t => now - t < flickWindow);

        if (flicks.length >= 2) {
            animateInkStep();
            flicks = [];
        }
        }

        lastY = e.clientY;
    });
};


// INK LANGUGAGES GAMES
const resetInkSelection =()=> {
    const inkOptions = document.querySelectorAll('.ink-option');
    inkOptions.forEach(option => option.classList.remove('selected'));

    const checkedRadio = document.querySelector('input[name="language"]:checked');
    if (checkedRadio) checkedRadio.checked = false;
}
const checkIfGameComplete =() =>  {
    const disabledInks = document.querySelectorAll('.ink-option[style*="pointer-events: none"]');
    const totalInks = document.querySelectorAll('.ink-option');

    if (disabledInks.length === totalInks.length) {
        resetFeedback("Well done! You&#39;ve unlocked the languages of the Elephant Bible!", 'celebration');
    }
}
const initInkGame =() => {
    let selectedLanguage = null;

    const radios = document.querySelectorAll('input[name="language"]');
    const sampleButtons = document.querySelectorAll('.sample-btn');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            selectedLanguage = radio.dataset.language;
            resetFeedback(`Now pick the text sample you think matches!`, 'neutral');

            resetInkSelection();
            radio.closest('.ink-option').classList.add('selected');
        });
    });

    sampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!selectedLanguage) {
                resetFeedback("&#9888;<br>Choose an ink first!", 'wrong');
                return;
            }

            const chosenSample = btn.dataset.language;

            if (chosenSample === selectedLanguage) {
                resetFeedback("&#10004;<br>Right on! Jan would nod in approval.", 'correct');

                const usedInk = document.querySelector(`input[name="language"][data-language="${selectedLanguage}"]`).closest('.ink-option');
                usedInk.style.opacity = '0.5';
                usedInk.style.pointerEvents = 'none';

                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
                checkIfGameComplete();
            } else {
                resetFeedback("&#10007;<br>Ink spilled! Try another combination.", 'wrong');
                btn.classList.add('wrong');
            }

            selectedLanguage = null;
            resetInkSelection();
        });
    });
}

// DOORS INTERACTION
const initDoorInteraction = () => {
    if (!closedDoor || !openDoor) return;

    closedDoor.addEventListener("click", knockHandler);
    closedDoor.addEventListener("touchstart", knockHandler);
};
const knockHandler = () => {
    tapCount++;
    
    if (tapCount === 1) {
        tapTimer = setTimeout(() => {
            tapCount = 0;
        }, 400);

        wiggleDoor(closedDoorImg);
    }

    if (tapCount === 2) {
        clearTimeout(tapTimer);
        tapCount = 0;

        closedDoor.style.display = "none";
        openDoor.style.display = "block";

        gsap.fromTo(openDoor, {
            scale: 0.9,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                transitionIntoCh5();
            }
        });
    }
};

//FIND THE ERRORS
const initCorrectionGame=()=> {
    const paragraph = document.querySelector(".ch3_error_interaction p");
    const rawWords = paragraph.innerText.split(/\s+/);

    paragraph.innerHTML = rawWords.map((word, i) => {
        const cleanWord = word.replace(/[.,;:!?]/g, "");
        return `<span class="word" data-word="${cleanWord}" data-index="${i}">${word}</span>`;
    }).join(" ");

    words = Array.from(document.querySelectorAll(".word"));

    focusWord(currentIndex);

    document.addEventListener("keydown", handleKeyNavigation);
    document.getElementById("prevError").addEventListener("click", () => handleKeyNavigation(null, "ArrowLeft"));
    document.getElementById("nextError").addEventListener("click", () => handleKeyNavigation(null, "ArrowRight"));
    document.getElementById("markFound").addEventListener("click", () => handleKeyNavigation(null, "mark"));
}
const handleKeyNavigation=(e, source)=> {
    const key = e?.key || source;

    if (key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % words.length;
        focusWord(currentIndex);
    } else if (key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + words.length) % words.length;
        focusWord(currentIndex);
    } else if (key === "Enter" || key === "mark") {
        if (e?.preventDefault) e.preventDefault();
        checkCurrentWord();
    }
}
const focusWord=(index)=> {
    words.forEach(word => word.classList.remove("focused"));
    words[index].classList.add("focused");
}
const checkCurrentWord=() => {
    const span = words[currentIndex];
    if (span.dataset.found === "true") return;

    const word = span.dataset.word;
    if (actualErrors.includes(word)) {
        span.classList.add("correct-flag");
        span.dataset.found = "true";
        span.innerHTML = `${span.innerText} <span class="found-mark">✔️</span>`;
    } else {
        span.classList.add("wrong-flag");
        setTimeout(() => span.classList.remove("wrong-flag"), 1000);
    }

    checkIfAllFound();
}
const checkIfAllFound =()=> {
    const found = words.filter(w => w.dataset.found === "true");

    if (found.length === actualErrors.length) {
        const feedback = document.querySelector(".feedback-text");
        const arrow = document.querySelector(".ch3__errorText svg");

        feedback.textContent = "Well done, you found all the mistakes!";
        arrow.style.display = "none";
    }
}

//SIGN IT
const initSignaturePad = () => {
    canvas = document.querySelector(".signature-pad");
    ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.strokeStyle = "#0451C7";
    ctx.lineWidth = 2;

    blankCanvasData = getBlankCanvasData(canvas);

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", startDrawingTouch);
    canvas.addEventListener("touchmove", drawTouch);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);

    document.getElementById("validate-signature").addEventListener("click", validateSignature);
    document.getElementById("reset-signature").addEventListener("click", resetSignature);
};
const resetSignature=()=> {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn = false;
    blankCanvasData = getBlankCanvasData(canvas);
}
const startDrawing=(e) =>{
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}
const draw=(e)=> {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    hasDrawn = true;
}
const stopDrawing=()=> {
    if (!isDrawing) return;
    isDrawing = false;
}
const startDrawingTouch=(e)=> {
    e.preventDefault(); 
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}
const drawTouch=(e) =>{
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
    hasDrawn = true;
}
const getBlankCanvasData=(canvas)=> {
    const temp = document.createElement("canvas");
    temp.width = canvas.width;
    temp.height = canvas.height;
    return temp.toDataURL();
}
const validateSignature=() =>{
    if (canvas.toDataURL() === blankCanvasData) {
        alert("Please draw your signature before proceeding.");
        return;
    }

    revealNextSection();
}


export const initInteractions = () => {
    gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);
    
    hideWithJs();
    setDirection();
    initInkGame();
    initDoorInteraction();
    initCorrectionGame();
    initSignaturePad();

    document.querySelector(".sayIt__zone").addEventListener("touchend", () => handleInkTrigger());
    if (isMobile) {
        handleSwipeRightTrigger(document.querySelector(".sayIt__zone"));
    } else {
        handleMouseFlickUpTrigger(document.querySelector(".sayIt__zone"));
    }
}