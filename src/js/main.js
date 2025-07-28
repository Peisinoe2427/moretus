import { initAnimations, handleButtonHero } from "./animations.js";
import { initInteractions } from "./interactions.js";

const init = () =>{
    window.addEventListener("load", () => {
        initAnimations();
        initInteractions();      
    });
    document.querySelector(".heroButton").addEventListener("click", (e) => {
        e.preventDefault();
        handleButtonHero();
    });
}

init();