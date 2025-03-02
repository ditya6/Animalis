const colors = [
    "#ff6f91",
    "#fcff71",
    "#5fff6e",
    "#71f3f9",
    "#ff4cf1",
    "#ffffff"
];
const letters = "✨❤I LOVE YOU❤✨";
const nameLine1 = "Happy Birthday";
const nameLine2 = "Pitriyani";
let letterIndex = 0;

// Muat suara
const launchSound = new Audio('launch.mp3');
const explosionSound = new Audio('explosion.mp3');

window.addEventListener('DOMContentLoaded', () => {
    const audio = document.querySelector('audio');
    audio.play().catch(error => {
      console.error("Autoplay gagal:", error);
    });
});

function getRandomLetter() {
    const letter = letters.charAt(letterIndex);
    letterIndex = (letterIndex + 1) % letters.length;
    return letter;
}

function createFirework(x, y) {
    const launchHeight = Math.random() * (window.innerHeight / 8) + window.innerHeight / 8;
    const projectile = document.createElement("div");
    projectile.classList.add("projectile");
    document.body.appendChild(projectile);

    projectile.style.left = `${x}px`;
    projectile.style.top = `${y}px`;

    // Mainkan suara meluncur
    launchSound.currentTime = 0;
    launchSound.play();

    const smokeInterval = setInterval(() => {
        const rect = projectile.getBoundingClientRect();
        createRocketSmoke(rect.left + rect.width / 2, rect.top + rect.height);
    }, 50);

    anime({
        targets: projectile,
        translateY: -launchHeight,
        duration: 1200,
        easing: "easeOutQuart",
        update: (anim) => {
            const progress = anim.progress;
            const currentY = y - (progress / 100) * launchHeight;
            projectile.style.top = `${currentY}px`;
        },
        complete: () => {
            clearInterval(smokeInterval);
            projectile.remove();
            createBurst(x, y - launchHeight);

            // Mainkan suara ledakan
            explosionSound.currentTime = 0;
            explosionSound.play();
        }
    });
}

function createRocketSmoke(x, y) {
    const smoke = document.createElement("div");
    const Xsmoke = x - 5;
    const Ysmoke = y - 6;
    smoke.classList.add("smoke");
    smoke.style.left = `${Xsmoke}px`;
    smoke.style.top = `${Ysmoke}px`;
    document.body.appendChild(smoke);

    anime({
        targets: smoke,
        translateY: anime.random(5, 15),
        scale: [0.6, 0.6],
        opacity: [1, 0],
        duration: 800,
        easing: "easeOutCubic",
        complete: () => smoke.remove()
    });
}

function createBurst(x, y) {
    const numLetters = 15;
    const numSparkles = 50;

    for (let i = 0; i < numLetters; i++) {
        createParticle(x, y, false);
    }

    for (let i = 0; i < numSparkles; i++) {
        createParticle(x, y, true);
    }

    createNameText(x, y);
}

function createParticle(x, y, isSparkle) {
    const el = document.createElement("div");
    el.classList.add(isSparkle ? "sparkle" : "particule");
    const instruction = document.querySelector('.instructions').style.display = 'none';

    if (!isSparkle) {
        el.textContent = getRandomLetter();
        el.style.color = colors[Math.floor(Math.random() * colors.length)];
    } else {
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    }

    const Ypar = y - 140;
    el.style.left = `${x}px`;
    el.style.top = `${Ypar}px`;
    document.body.appendChild(el);

    animateParticle(el, isSparkle);
}

function createNameText(x, y) {
    const nameContainer = document.createElement("div");
    nameContainer.classList.add("name-container");

    const nameLine1El = document.createElement("div");
    nameLine1El.classList.add("name-line");
    nameLine1El.textContent = nameLine1;

    const nameLine2El = document.createElement("div");
    nameLine2El.classList.add("name-line");
    nameLine2El.textContent = nameLine2;

    nameContainer.appendChild(nameLine1El);
    nameContainer.appendChild(nameLine2El);

    const Xname = x - 90;
    const Yname = y - 160;
    nameContainer.style.left = `${Xname}px`;
    nameContainer.style.top = `${Yname}px`;

    document.body.appendChild(nameContainer);

    anime({
        targets: nameContainer,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 1000,
        easing: "easeOutExpo",
        complete: () => {
            anime({
                targets: nameContainer,
                opacity: [1, 0],
                duration: 800,
                easing: "easeInCubic",
                complete: () => nameContainer.remove()
            });
        }
    });
}

function animateParticle(el, isSparkle) {
    const angle = Math.random() * Math.PI * 2;
    const distance = anime.random(100, 200);
    const duration = anime.random(1200, 2000);
    const fallDistance = anime.random(40, 80);
    const scale = isSparkle ? Math.random() * 0.5 + 0.5 : Math.random() * 1 + 0.5;

    anime
        .timeline({
            targets: el,
            easing: "easeOutExpo",
            duration: duration,
            complete: () => el.remove()
        })
        .add({
            translateX: Math.cos(angle) * distance,
            translateY: Math.sin(angle) * distance,
            scale: [0, scale],
            opacity: [1, 0.9]
        })
        .add({
            translateY: `+=${fallDistance}px`,
            opacity: [0.9, 0],
            easing: "easeInCubic",
            duration: duration / 2
        });
}

document.addEventListener("click", (e) => {
    createFirework(e.clientX, e.clientY);
});

window.onload = function () {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    createFirework(centerX, centerY);
};