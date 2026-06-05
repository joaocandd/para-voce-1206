const relationshipStart = new Date("2024-06-12T00:00:00-03:00");
const introOverlay = document.getElementById("introOverlay");
const loveSong = document.getElementById("loveSong");
const promiseButton = document.getElementById("promiseButton");
const promiseMessage = document.getElementById("promiseMessage");
const title = document.getElementById("animatedTitle");
const cursor = document.getElementById("cursor");
const floatingLayer = document.getElementById("floatingLayer");
const timerIds = ["years", "months", "days", "hours", "minutes", "seconds"];
const timerEls = Object.fromEntries(timerIds.map((id) => [id, document.getElementById(id)]));

document.body.classList.add("intro-active");

function playLoveSong() {
  if (!loveSong) return;

  loveSong.volume = 0.55;
  loveSong.play().catch(() => {
    document.addEventListener("click", playLoveSong, { once: true });
  });
}

function closeIntro() {
  if (!introOverlay || introOverlay.classList.contains("intro-hide")) return;

  playLoveSong();
  introOverlay.classList.add("intro-hide");
  document.body.classList.remove("intro-active");

  setTimeout(() => {
    introOverlay.remove();
  }, 1200);
}

introOverlay?.addEventListener("click", closeIntro);
window.addEventListener("load", playLoveSong, { once: true });

promiseButton?.addEventListener("click", () => {
  const isOpen = promiseMessage.classList.toggle("open");
  promiseMessage.hidden = false;
  promiseButton.setAttribute("aria-expanded", String(isOpen));
  promiseButton.textContent = isOpen ? "Promessa revelada" : "Revelar promessa";
});

title.innerHTML = [...title.textContent].map((char, index) => {
  const safeChar = char === " " ? "&nbsp;" : char;
  return `<span style="animation-delay:${index * 0.065}s">${safeChar}</span>`;
}).join("");

if (window.particlesJS) {
  particlesJS("particles-js", {
    particles: {
      number: { value: 56, density: { enable: true, value_area: 900 } },
      color: { value: ["#d9ad56", "#fff2d3", "#8e244e"] },
      shape: { type: "circle" },
      opacity: { value: 0.35, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 130, color: "#d9ad56", opacity: 0.16, width: 1 },
      move: { enable: true, speed: 0.75, random: true, straight: false, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "grab" }, resize: true },
      modes: { grab: { distance: 150, line_linked: { opacity: 0.35 } } }
    },
    retina_detect: true
  });
}

function diffFromStart(start, end) {
  let cursorDate = new Date(start);
  let years = end.getFullYear() - cursorDate.getFullYear();
  cursorDate.setFullYear(cursorDate.getFullYear() + years);

  if (cursorDate > end) {
    years--;
    cursorDate = new Date(start);
    cursorDate.setFullYear(cursorDate.getFullYear() + years);
  }

  let months = (end.getFullYear() - cursorDate.getFullYear()) * 12 + end.getMonth() - cursorDate.getMonth();
  const monthProbe = new Date(cursorDate);
  monthProbe.setMonth(monthProbe.getMonth() + months);

  if (monthProbe > end) {
    months--;
  }

  cursorDate.setMonth(cursorDate.getMonth() + months);

  const totalSeconds = Math.max(0, Math.floor((end - cursorDate) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { years, months, days, hours, minutes, seconds };
}

function updateTimer() {
  const parts = diffFromStart(relationshipStart, new Date());
  Object.entries(parts).forEach(([key, value]) => {
    timerEls[key].textContent = value;
  });
}

updateTimer();
setInterval(updateTimer, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const letterText = `Hoje celebramos dois anos do nosso amor, e ainda assim parece que meu coração continua descobrindo novas formas de te escolher.

Obrigado por cada riso, cada abraço, cada conversa longa, cada plano e cada cuidado. Em você eu encontrei carinho, paz e uma vontade bonita de construir dias melhores.

Que este seja apenas mais um capítulo da nossa história. Eu te amo hoje, te amei em cada detalhe desses dois anos e quero continuar te amando em todos os próximos.`;

const letterEl = document.getElementById("typedLetter");
let typedStarted = false;

function typeLetter() {
  if (typedStarted) return;
  typedStarted = true;

  let index = 0;
  const type = () => {
    letterEl.textContent = letterText.slice(0, index);
    index++;

    if (index <= letterText.length) {
      setTimeout(type, index % 9 === 0 ? 42 : 24);
    }
  };

  type();
}

const letterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      typeLetter();
      letterObserver.disconnect();
    }
  });
}, { threshold: 0.35 });

letterObserver.observe(document.querySelector(".letter-paper"));

function createFloatingElements() {
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 180}px`);
    heart.style.animationDuration = `${9 + Math.random() * 12}s`;
    heart.style.animationDelay = `${Math.random() * 10}s`;
    floatingLayer.appendChild(heart);
  }

  for (let i = 0; i < 34; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${(Math.random() - 0.5) * 240}px`);
    petal.style.animationDuration = `${8 + Math.random() * 11}s`;
    petal.style.animationDelay = `${Math.random() * 9}s`;
    floatingLayer.appendChild(petal);
  }
}

createFloatingElements();

window.addEventListener("mousemove", (event) => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;

  const x = (event.clientX / window.innerWidth - 0.5).toFixed(3);
  const y = (event.clientY / window.innerHeight - 0.5).toFixed(3);
  document.documentElement.style.setProperty("--parallax-x", x);
  document.documentElement.style.setProperty("--parallax-y", y);
});

window.addEventListener("scroll", () => {
  const amount = Math.min(window.scrollY / window.innerHeight, 1);
  document.documentElement.style.setProperty("--parallax-y", (amount * 0.35).toFixed(3));
}, { passive: true });
