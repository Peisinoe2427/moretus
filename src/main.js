import "./css/reset.css";
import "./css/style.css";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

// INK LANGUGAGES GAMES
const resetFeedback= (message, type = 'neutral') =>{
    const feedback = document.querySelector('.feedback');
    feedback.innerHTML = message;
    feedback.className = `feedback feedback--${type}`;
}

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
                resetFeedback("&#10004;<br>That's a match!", 'correct');

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



// GSAP
// gsap.to(".hidden", {
//   opacity: 1,
//   scale: 1,
//   pointerEvents: "auto",
//   visibility: "visible",
//   duration: 1
// });
const heroAnimation = ()=>{
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(".hero_city", 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 0.75, duration: 3 }
    , 0)

    tl.from(".hero__text", {
        y: 80,
        opacity: 0,
        duration: 2,
    }, 0.1)

    .fromTo(".hero_cloud-back",
        { x: 200, opacity: 0 },
        { x: 0, opacity: 0.7, duration: 3}
    , 0.3)

    tl.from(".hero_jan", {
        y: 100,
        opacity: 0,
        scale: 0.95,
        duration: 2.2,
    }, 0.4)

    .fromTo(".hero_cloud-front", 
        { x: -150, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.5 }
    , 0.5)

    .fromTo(".hero_cloud-big", 
        { x: -250, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 3.5}
    ,0.6)

    tl.from(".hero__title", {
        y: -80,
        opacity: 0,
        duration: 1.8,
    }, 0.6)

    // .to(".h2__intro", {
    //     duration:3,
    //     ease: "power2.out",
    //     text:{
    //         value: "A Journey From Paws To Pixels",
    //         oldClass: "h2Start",
    //         newClass: "h2End",    
    //     }
    // }, 0);

    return tl;
}

const init = () =>{
    window.addEventListener("load", () => {
        gsap.registerPlugin(ScrollTrigger,ScrollToPlugin,TextPlugin);

        heroAnimation();
    });

    initInkGame();
}

init();