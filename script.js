const launchSound = new Audio('./firework-launch.mp3');
const explodeSound = new Audio('./firework-explode.mp3');

const settings = {
    colors: [
        "#ff6f91", "#ff9671", "#ffc75f", "#f9f871",
        "#ff4c4c", "#ffcc00", "#6a5acd", "#ff1493",
        "#ff4500", "#00bfff", "#ff69b4", "#32cd32",
        "#8a2be2", "#ff6347", "#ff1493", "#ffdf00"
    ],
    letters: "✨I LOVE YOU✨",
    fireworkLaunchHeight: 350,
    fireworkBurstSize: 100
};

function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        nameLine1: urlParams.get('ucapan') || "Happy Birthday",
        nameLine2: urlParams.get('nama') || "Pitriyani",
        fontSize: urlParams.get('fs') || "20px"
    };
}


const { nameLine1, nameLine2, fontSize } = getQueryParams();
settings.nameLine1 = nameLine1;
settings.nameLine2 = nameLine2;
settings.fontSize = fontSize;

let letterIndex = 0;

function getRandomLetter() {
    const letter = settings.letters.charAt(letterIndex);
    letterIndex = (letterIndex + 1) % settings.letters.length;
    return letter;
}


function createFirework(x, y) {
    const launchHeight = Math.random() * (settings.fireworkLaunchHeight / 2) + settings.fireworkLaunchHeight / 4;
    const projectile = document.createElement("div");
    projectile.classList.add("projectile");
    document.body.appendChild(projectile);
    projectile.style.left = `${x}px`;
    projectile.style.top = `${y}px`;

    createTrail(x, y);

    launchSound.play();

    anime({
        targets: projectile,
        translateX: [
            { value: anime.random(-20, 20), duration: 300 },
            { value: anime.random(-30, 30), duration: 300 },
        ],
        translateY: -launchHeight,
        duration: 1500,
        easing: "easeOutCubic",
        update: (anim) => {
            const fireworkPos = projectile.getBoundingClientRect();
            createTrail(fireworkPos.left + fireworkPos.width / 3, fireworkPos.top + fireworkPos.height / 2);
        },
        complete: () => {

            launchSound.pause();
            launchSound.currentTime = 0; 
            explodeSound.play();

            projectile.remove();
            createBurst(x, y - launchHeight);
            createGlow(x, y - launchHeight);
            createNameText(x, y - launchHeight);
        }
    });
}

function createTrail(x, y) {
    const trail = document.createElement("div");
    trail.classList.add("trail");
    trail.style.left = `${x - 3}px`;
    trail.style.top = `${y - 3}px`;
    document.body.appendChild(trail);

    const angle = Math.random() * Math.PI * 2;
    const distance = anime.random(5, 15);
    const duration = anime.random(500, 1000);

    anime({
        targets: trail,
        translateX: Math.cos(angle) * distance,
        translateY: Math.sin(angle) * distance,
        opacity: [1, 0],
        scale: [1, 0],
        duration: duration,
        easing: "easeOutQuad",
        complete: () => trail.remove()
    });
}


function createGlow(x, y) {
    const glow = document.createElement("div");
    glow.classList.add("glow-circle");
    glow.style.left = `${x - 50}px`;
    glow.style.top = `${y - 50}px`;
    document.body.appendChild(glow);

    anime({
        targets: glow,
        scale: [0, 3],
        opacity: [0.8, 0],
        duration: 1500,
        easing: "easeOutCubic",
        complete: () => glow.remove()
    });
}

// Create a burst of particles and text
function createBurst(x, y) {
    const numLetters = 20; 
    const numSparkles = 60; 

    const burstSize = settings.fireworkBurstSize;

    for (let i = 0; i < numLetters; i++) {
        createParticle(x, y, false, burstSize);
    }

    for (let i = 0; i < numSparkles; i++) {
        createParticle(x, y, true, burstSize);
    }
}

function createParticle(x, y, isSparkle, burstSize) {
    const el = document.createElement("div");
    el.classList.add(isSparkle ? "sparkle" : "particule");
    if (!isSparkle) {
        el.textContent = getRandomLetter();
        el.style.color = settings.colors[Math.floor(Math.random() * settings.colors.length)];
    } else {
        el.style.backgroundColor = settings.colors[Math.floor(Math.random() * settings.colors.length)];
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    animateParticle(el, isSparkle, burstSize);
}

// Animate the particles
function animateParticle(el, isSparkle, burstSize) {
    const angle = Math.random() * Math.PI * 2;
    const distance = anime.random(burstSize, burstSize * 2); 
    const duration = anime.random(1500, 2500);
    const fallDistance = anime.random(30, 100);
    const scale = isSparkle ? Math.random() * 0.5 + 0.5 : Math.random() * 1 + 0.8;

    anime
        .timeline({
            targets: el,
            easing: "easeOutCubic",
            duration: duration,
            complete: () => el.remove()
        })
        .add({
            translateX: Math.cos(angle) * distance,
            translateY: Math.sin(angle) * distance,
            scale: [0, scale],
            opacity: [1, 0.8]
        })
        .add({
            translateY: `+=${fallDistance}px`,
            opacity: [0.8, 0],
            easing: "easeInCubic",
            duration: duration / 2
        });
}

function createNameText(x, y) {
    const Name = document.createElement("div");
    Name.classList.add("Name-text");

    const line1 = document.createElement("div");
    line1.textContent = settings.nameLine1; // Use the configurable text
    line1.style.fontSize = settings.fontSize; // Apply the configurable font size
    Name.appendChild(line1);

    const line2 = document.createElement("div");
    line2.textContent = settings.nameLine2; // Use the configurable text
    line2.style.fontSize = settings.fontSize; // Apply the configurable font size
    Name.appendChild(line2);

    document.body.appendChild(Name);

    setTimeout(() => {
        const NameWidth = Name.offsetWidth;
        const NameHeight = Name.offsetHeight;

        // Center the text
        Name.style.left = `${x - NameWidth / 2}px`;
        Name.style.top = `${y - NameHeight / 2}px`;
    }, 0);


    anime({
        targets: Name,
        scale: [0, 1.5],
        opacity: [0, 1],
        rotation: [0, anime.random(-15, 15)],
        easing: "easeOutCubic",
        duration: 2000,
        complete: () => Name.remove()
    });
}


document.addEventListener("click", (e) => {
    createFirework(e.clientX, e.clientY);
});
