import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";


let inkStep = 0;
let isAnimating = false;
const maxSteps = 4;

const inkBall = document.querySelector(".img_ball img");
const lettersImg = document.querySelector(".img_ink0 img");
const inkLayers = [
    document.querySelector(".img_ink1"),
    document.querySelector(".img_ink2"),
    document.querySelector(".img_ink3"),
    document.querySelector(".img_ink4")
];
const inkTargets = [
    { position: "top-right" },
    { position: "top-left" },
    { position: "center" },
    { position: "bottom-center" }
];


// UTILITY
const  animateIfVisible = (el, config) =>{
    if (el && el.offsetParent !== null) {
        gsap.from(el, config);
    }
}
const setDisplayResponsive = (el, largeDisplay = "grid", smallDisplay = "block") => {
    const isLargeScreen = window.matchMedia("(min-width: 41em)").matches;
    el.style.display = isLargeScreen ? largeDisplay : smallDisplay;
};
const getTargetPosition = (position, rect) =>{
    // I had to look online and at our old pj5 assignements to figure out some calculations.  I do not take credit for these.
    const isSmallScreen = window.innerWidth <= 768;

    const coords = {
        "top-right": {
            x: isSmallScreen ? rect.left + rect.width * 0.78 : rect.left + rect.width * 0.85,
            y: isSmallScreen ? rect.top + rect.height * 0.17 : rect.top + rect.height * 0.25
        },
        "top-left": {
            x: isSmallScreen ? rect.left + rect.width * 0.6 : rect.left + rect.width * 0.7,
            y: isSmallScreen ? rect.top + rect.height * 0.17 : rect.top + rect.height * 0.25
        },
        "center": {
            x: isSmallScreen ? rect.left + rect.width * 0.6 : rect.left + rect.width * 0.7,
            y: isSmallScreen ? rect.top + rect.height * 0.3 : rect.top + rect.height * 0.35
        },
        "bottom-center": {
            x: rect.left + rect.width * 0.5,
            y: isSmallScreen ? rect.top + rect.height * 0.4 : rect.top + rect.height * 0.5
        }
    };
    return coords[position] || {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

//GENERAL
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
                start: 'top 80%',
                toggleActions: 'play none none none',
                once: true,
                immediateRender: false
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
        { y: 0, opacity: 0.5, duration: 3 }
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

    return tl;
}
export const handleButtonHero = ()=>{
    gsap.to(window, {
        duration: 1.2,
        scrollTo: {
            y: ".ch1"
        },
        ease: "power2.inOut"
    });
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
export const animateInkStep = () => {
    if (
        !inkBall ||
        !lettersImg ||
        inkLayers.some(layer => layer === null)
    ) {
        console.warn("Missing ink elements");
        return;
    }

    if (isAnimating || inkStep >= maxSteps) return;
    isAnimating = true;

    const lettersRect = lettersImg.getBoundingClientRect();
    const ballRect = inkBall.getBoundingClientRect();
    const target = getTargetPosition(inkTargets[inkStep].position, lettersRect);

    const deltaX = target.x - (ballRect.left + ballRect.width / 2);
    const deltaY = target.y - (ballRect.top + ballRect.height / 2);

    const tl = gsap.timeline({
        onComplete: () => {
        isAnimating = false;
        }
    });

    tl.fromTo(inkBall,  
        { rotation: 0 },
        {
        rotation: -20,
        duration: 0.25,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 2,
        transformOrigin: "center bottom"
        }
    )
    .to(inkBall, {
        x: `+=${deltaX}`,
        y: `+=${deltaY}`,
        duration: 0.5,
        ease: "power1.inOut"
    }, ">")
    .to(inkBall, {
        y: "+=1rem",
        rotation: 0,
        duration: 0.25,
        ease: "power2.in"
    }, "+=0.2")
    .to(inkLayers[inkStep], {
        opacity: 1,
        duration: 0.4
    }, "<")
    .to(inkBall, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        clearProps: "transform"
    }, "+=0.2");

    if (inkStep === maxSteps - 1) {
        tl.to(".img_inking", {
        opacity: 1,
        duration: 0.3
        }, ">")
        .to(".img_inked", {
        opacity: 1,
        duration: 0.3
        }, "+=1.2");
    }

    inkStep++;
};

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
    }, 0)

    .from(".img_hand-m", { 
        x: '-40%',
        }
    , 0)

    .from(".img_hand-j", {
        x: '40%',
    }, 0)

    .from(".ch2__martina", {
        x: '-50%',
        opacity: 0,
        scale: 0.9,
    }, 1)

    .from(".ch2__jan", {
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

//CHAPTER 3
const glow =()=>{
    gsap.to(".img_rays", {
        opacity: 0.6,
        scale: 1.05,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });
}
const errorAnimation = ()=>{
    const tl = gsap.timeline({ 
    scrollTrigger: {
        trigger: ".ch3__martina",
        start: "bottom 50%",
    }});

    tl.from(".ch3_error_interaction", { 
        x: '-80%',
        opacity:0,
        duration: 1,
        ease: "power2.out"
        }
    , 0)

    .from(".ch3__errorText", {
        x: '-40%',
        opacity:0,
        duration: 1,
        ease: "power2.out"
    }, "<")

    return tl;
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
export const wiggleDoor = (element) => {
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
export const transitionIntoCh5 = () => {
    const titleCh5 = document.querySelector(".ch5__title1");
    const bubble = document.querySelector(".bubble--door");
    const doorGroup = document.querySelector(".ch5__doors");
    const sectionP1 = document.querySelector(".ch5__p1");
    const crownImg = document.querySelector(".img_crown");
    const textBlock = document.querySelector(".ch5__text");

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
    .to(".js-door-open", {
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

//CHAPTER 6
const cannonBall=()=>{
    const ball = document.querySelector(".img_ballCanon");
    const smoke = document.querySelector(".img_smoke");

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".ch6",
            start: "top 45%",
            toggleActions: "play none none none",
        }
    });
    tl.fromTo(ball, 
        { 
            x: "0rem",
            y: "0rem",
            scale:0,
            opacity:1
        },
        {
            x: "10rem",
            y: "-5rem",
            scale:0.5,
            opacity:0,
            duration: 0.7,
            ease: "power2.out",
            onComplete: () => {
                gsap.set(ball, {
                    clearProps: "all"
                });
                gsap.set(ball, {
                    opacity: 0
                });
            }
        }
    )
    .fromTo(smoke,
        { opacity: 0 },
        {
            opacity: 1,
            duration: 0.6,
            ease: "sine.inOut"
        }, 
    "<")

    .to(smoke, {
        opacity: 0,
        duration: 2,
        ease: "sine.out"
    }, "+=0.5");
}

//CHAPTER 7
export const revealNextSection=()=> {
    const tl = gsap.timeline();
    gsap.set(".ch8", {
        display: "grid",
        opacity: 0,
        y: 100,
    });
    gsap.set([".ch8__section1", ".ch8__section2"], {
        autoAlpha: 0,
        y: "-40%",
    });
    gsap.set(".ch7", {
        paddingBlockEnd: "6rem",
    });

    tl.to(window, {
        scrollTo: {
            y: () => document.querySelector(".ch8").offsetTop - 40,
        },
        duration: 0.8,
        ease: "power2.inOut"
    }, 0)

    .to(".ch8", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    })

    .from(".ch8__text", {
        opacity: 0,
        y: "-40%",
        duration: 1,
        ease: "power2.out"
    }, "<+0.2")

    .to(".ch8__section1", {
        autoAlpha: 1,
        duration: 1,
        y:0,
        ease: "power2.out"
    }, "+=0.3")

    .to(".ch8__section2", {
        autoAlpha: 1,
        duration: 1,
        y:0,
        ease: "power2.out"
    }, "+=0.3")
    
    .call(() => {
        ScrollTrigger.refresh();
    });

    return tl;
}

export const initAnimations= ()=>{
    gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

    heroAnimation();
    bubbles();
    lines();
    ch1();
    ch1Pt2();
    titleUnion();
    unionAnimation();
    cupidAnimation();
    glow();
    errorAnimation();
    infoBible();
    bibleImg();
    ctaCh4();
    cannonBall();
}