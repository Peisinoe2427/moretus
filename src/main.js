import "./css/reset.css";
import "./css/style.css";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

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
}

init();