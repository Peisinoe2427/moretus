import "./css/reset.css";
import "./css/style.css";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

let tapCount = 0;
let tapTimer = null;
const closedDoor = document.querySelector(".js-door-closed");
const openDoor = document.querySelector(".js-door-open");
const closedDoorImg = closedDoor?.querySelector("img");
const sectionP1 = document.querySelector(".ch5__p1");
const crownImg = document.querySelector(".img_crown");
const textBlock = document.querySelector(".ch5__text");

const resetFeedback= (message, type = 'neutral') =>{
    const feedback = document.querySelector('.feedback');
    feedback.innerHTML = message;
    feedback.className = `feedback feedback--${type}`;
}

const setDisplayResponsive = (el, largeDisplay = "grid", smallDisplay = "block") => {
    const isLargeScreen = window.matchMedia("(min-width: 41em)").matches;
    el.style.display = isLargeScreen ? largeDisplay : smallDisplay;
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
// GSAP
const  animateIfVisible = (el, config) =>{
    if (el && el.offsetParent !== null) {
        gsap.from(el, config);
    }
}

const bubbles = ()=>{
    gsap.utils.toArray('.bubble').forEach((bubble, i) => {
        gsap.from(bubble, {
            scrollTrigger: {
                trigger: bubble,
                start: 'top 50%',
                toggleActions: 'play none none none',
            },
        opacity: 0,
        rotate: gsap.utils.random(-3, 3),
        yPercent: -10,
        duration: 0.6,
        ease: 'power1.out',
        delay: i * 0.05,
        });
    });
}
const lines = () => {
    gsap.utils.toArray('.lineText').forEach((lineText, i) => {
        gsap.fromTo(lineText,
        { opacity: 0, scaleX: 0, transformOrigin: "left" },
        {
            opacity: 1,
            scaleX: 1,
            duration: 0.6,
            ease: 'back.out(1.4)',
            delay: i * 0.05,
            scrollTrigger: {
            trigger: lineText,
            start: 'top 70%',
            toggleActions: 'play none none none',
            },
        }
        );
    });
};

// HERO
const heroAnimation = ()=>{
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(".hero_city", 
        { y: -100, opacity: 0 }, 
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

// CHAPTER 1
const ch1 =()=>{
    gsap.from(".ch1", {
        y: '50%',
        opacity: 0,
        duration: 2,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".hero",
            start: "bottom 85%",
            toggleActions: "play none none none"
        }
    });
}
const ch1Pt2 =()=>{
    const tl = gsap.timeline({ 
        scrollTrigger: {
            trigger: ".ch1__text",
            start: "top 75%",
            toggleActions: "play none none none"
        }
    });

    tl.from(".ch1_pt2_text", { 
        x: "-10vw",
        duration: 1.5,
        opacity: 0,
        ease: "power2.out"
        }
    , 0)

    tl.from(".img_angel-read", { 
        opacity: 0,
        scale: 1.8,
        rotation: 10,
        ease: "back.inOut(1.7)",
        duration: 1,
        }
    , 0)

    return tl;
}

// CHAPTER 2
const titleUnion= ()=>{
    gsap.from(".img_lovers", {
        opacity: 0,
        scale: 1.8,
        rotation: 10,
        ease: "back.inOut(1.7)",
        duration: 1,
        scrollTrigger: {
            trigger: ".ch1-part2",
            start: "bottom 70%",
            toggleActions: "restart none restart none",
            scrub: false,
        }
    }),0;
}
const unionAnimation = ()=>{
    const tl = gsap.timeline({ 
    scrollTrigger: {
        trigger: ".ch2",
        start: "top center",
        end: "center center",
        scrub: 2,
    },defaults: { ease: "sine.out", duration: 3 } });

    tl.fromTo(".ch2__title--margin", 
        { letterSpacing: "1em", opacity: 0 },
        {
            letterSpacing: "0.05em",
            opacity: 1,
            duration: 2,
            ease: "power2.out"
    }, 0);


    tl.from(".img_hand-m", { 
        x: '-40%',
        }
    , 0)

    tl.from(".img_hand-j", {
        x: '40%',
    }, 0)

    tl.from(".ch2__martina", {
        x: '-50%',
        opacity: 0,
        scale: 0.9,
    }, 1)

    tl.from(".ch2__jan", {
        x: '50%',
        opacity: 0,
        scale: 0.9,
    }, 1)

    return tl;
}
const cupidAnimation = ()=>{
    gsap.to(".img_arrow", {
        x: '-120vw',
        scrollTrigger: {
            trigger: ".ch2__text",
            start: "top center",
            toggleActions: "restart none reset none",
            scrub: false,
        },
        duration: 2,
    });
}

// CHAPTER 4
const infoBible = () => {
    gsap.utils.toArray(".ch4__listItem").forEach((item, i) => {
        const number = item.querySelector(".ch4_number");
        const text = item.querySelector(".ch4_infoText");

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "restart none none none"
            },
            delay: i * 0.2 
        });

        tl.from(item, {
            x: "-3rem",
            opacity: 0,
            duration: 0.4,
            ease: "power2.out"
        })

        .from(number, {
            opacity: 0,
            y: "1rem",
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.2")

        .from(text, {
            opacity: 0,
            y: "1rem",
            duration: 0.4,
            ease: "power2.out"
        }, "-=0.3");
    });
};
const bibleImg = () =>{
    animateIfVisible(document.querySelector(".img_book"), {
        xPercent: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".ch4__text",
            start: "center 50%",
            toggleActions: "restart none none none"
        }
    });

    animateIfVisible(document.querySelector(".img_elephantComplete"), {
        xPercent: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".ch4__text",
            start: "center 50%",
            toggleActions: "restart none none none"
        }
    });
}
const ctaCh4 = ()=>{
    animateIfVisible(document.querySelector(".ch4_CTABigger"), {
        x: "-3rem",
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".ch4__section1",
            start: "bottom 10%",
            toggleActions: "play none none none"
        }
    });

    animateIfVisible(document.querySelector(".ch4_CTAMobile"), {
        y: "2rem",
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".ch4_CTAMobile",
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
}

// CHAPTER 5
const wiggleDoor = (element) => {
    gsap.fromTo(
        element,
        { x: "-0.4rem" },
        {
            x: "0.4rem",
            duration: 0.08,
            repeat: 5,
            yoyo: true,
            ease: "power1.inOut",
            overwrite: true,
            clearProps: "x"
        }
    );
};

const transitionIntoCh5 = () => {
    const titleCh5 = document.querySelector(".ch5__title1");
    const bubble = document.querySelector(".bubble--door");
    const doorGroup = document.querySelector(".ch5__doors");

    setDisplayResponsive(sectionP1);
    crownImg.style.display = "block";
    textBlock.style.display = "block";

    const tl = gsap.timeline();
    tl.to([titleCh5, bubble], {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            titleCh5.style.display = "none";
            bubble.style.display = "none";
        }
    })
    .to(openDoor, {
        scale: 4,
        opacity: 0,
        duration: 1.4,
        ease: "power2.out",
        transformOrigin: "center center",
    }, "<")
    
    .to(doorGroup, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
            doorGroup.style.display = "none";
        }
    }, "-=0.6")

    .fromTo([sectionP1, crownImg, textBlock],
        { opacity: 0, y: 20 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            stagger: 0.2,
        }
    );
};

const hideWithJs=()=>{
    crownImg.style.display = "none";
    textBlock.style.display = "none";
    sectionP1.style.display = "none";
}

const init = () =>{
    window.addEventListener("load", () => {
        gsap.registerPlugin(ScrollTrigger,ScrollToPlugin,TextPlugin);

        heroAnimation();
        bubbles();
        lines();
        ch1();
        ch1Pt2();
        titleUnion();
        unionAnimation();
        cupidAnimation();
        infoBible();
        bibleImg();
        ctaCh4();
    });

    hideWithJs();
    initInkGame();
    initDoorInteraction();
}

init();