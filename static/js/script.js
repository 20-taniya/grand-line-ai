// ==============================
// CARD FLIP (Single Click)
// ==============================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("click", function () {

        this.classList.toggle("flipped");

    });

});
cards.forEach(card => {

    card.addEventListener("dblclick", () => {

        if(card.classList.contains("luffy")){

            window.location.href="/chat/luffy";

        }

        else if(card.classList.contains("zoro")){

            window.location.href="/chat/zoro";

        }

        else if(card.classList.contains("nami")){

            window.location.href="/chat/nami";

        }

        else if(card.classList.contains("sanji")){

            window.location.href="/chat/sanji";

        }

    });

});


// ==============================
// SCROLL ANIMATION
// ==============================

const crewSections = document.querySelectorAll(".crew-container");

function revealSections() {

    crewSections.forEach(section => {

        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {

            section.classList.add("show");

        }
    }

)};


window.addEventListener("scroll", revealSections);

revealSections();
// ===========================
// HOME PAGE PARTICLES
// ===========================

const particleContainer=document.getElementById("particles");

const colors=[

"#ffffff",

"#ff3131",

"#ffd966"

];

for(let i=0;i<45;i++){

    const p=document.createElement("div");

    p.className="particle";

    const size=Math.random()*6+2;

    p.style.width=size+"px";

    p.style.height=size+"px";

    p.style.left=Math.random()*100+"%";

    p.style.background=colors[Math.floor(Math.random()*colors.length)];

    p.style.animationDuration=(Math.random()*8+8)+"s";

    p.style.animationDelay=(Math.random()*10)+"s";

    particleContainer.appendChild(p);

}
//==========================
// HOME SMOKE
//==========================

const smoke=document.getElementById("smoke");

for(let i=0;i<12;i++){

    const cloud=document.createElement("div");

    cloud.className="smoke";

    cloud.style.left=Math.random()*100+"%";

    cloud.style.animationDuration=(20+Math.random()*10)+"s";

    cloud.style.animationDelay=(Math.random()*15)+"s";

    smoke.appendChild(cloud);

}