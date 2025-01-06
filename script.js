// Array com os nomes dos aliens
const aliens = [
    "chama",
    "diamante",
    "besta",
    "massa-cinzenta",
    "quatro-bracos",
    "xlr8",
    "bala-de-canhao",
    "insectoide",
    "aquatico",
    "ultra-t",
    "cipo-selvagem",
    "fantasmatico",
    "franksben",
    "glutao",
    "idem",
    "iguana-artica",
    "lobisben",
    "mumia",
];

// Índice atual do alien no carrossel
let currentIndex = 0;

// Elementos HTML
const watch = document.getElementById("watch");
const arrows = document.querySelectorAll(".arrow");

// Inicialização do display
let isListening = false;

watch.addEventListener("click", () => {
    setTimeout(() => {
        watch.classList.remove("charged");
    }, 700);

    arrows.forEach((arrow) => {
        arrow.classList.add("active");
        setTimeout(() => {
            arrow.classList.add("to-select");
        }, 500);
    });

    setTimeout(() => {
        // Ativa/desativa o carrossel
        isListening = !isListening;
        if (isListening) {
            updateCarousel(); // Atualiza o carrossel ao iniciar
        }
    }, 1000);
});

// Controlador para gerenciar os eventos de toque/mouse
let isInteracting = false;
let lastInteractionX = 0;

// Função para iniciar interação (mousedown/touchstart)
function handleStart(event) {
    if (!isListening) return;

    isInteracting = true;

    // Captura a posição inicial do toque ou clique
    lastInteractionX = event.touches ? event.touches[0].clientX : event.clientX;

    // Adiciona o listener de movimento
    document.addEventListener(event.touches ? "touchmove" : "mousemove", handleMove);
}

// Função para capturar o movimento (mousemove/touchmove)
function handleMove(event) {
    if (!isInteracting) return;

    const currentX = event.touches ? event.touches[0].clientX : event.clientX;
    const deltaX = currentX - lastInteractionX;

    if (Math.abs(deltaX) > 50) {
        // Altera o alien com base na direção do movimento
        changeAlien(deltaX > 0 ? -1 : 1);
        console.log(`Índice atual do alien: ${currentIndex}`); // Printa o índice atual
        lastInteractionX = currentX; // Atualiza a posição de interação
    }
}

// Função para encerrar interação (mouseup/touchend)
function handleEnd() {
    isInteracting = false;

    // Remove os listeners de movimento
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("touchmove", handleMove);
}

// Adiciona os eventos de interação para mouse e toque
document.addEventListener("mousedown", handleStart);
document.addEventListener("touchstart", handleStart);
document.addEventListener("mouseup", handleEnd);
document.addEventListener("touchend", handleEnd);

// Função para criar um elemento alien
function createAlienElement(alienName) {
    const alienContainer = document.createElement("div");
    const alienView = document.createElement("div");
    alienContainer.classList.add("alien--container");
    alienView.setAttribute("id", "alien-view");
    alienView.classList.add("active");

    alienContainer.appendChild(alienView);

    // const currentElement = document.getElementsByClassName("alien--container")[0];
    // if (currentElement) {
    //     currentElement.classList.remove("enter");
    //     currentElement.classList.add("exit");
    // }


    const alien = document.createElement("div");
    const currentAlien = `./assets/aliens/${alienName}.webp`;
    alien.setAttribute("id", "alien-tile");
    alien.style.backgroundImage = `url('${currentAlien}')`;
    // alienContainer.classList.add("enter");
    alienView.appendChild(alien);
    return alienContainer;
}

// Função para atualizar o carrossel
function updateCarousel() {
    watch.appendChild(createAlienElement(aliens[currentIndex]));
}

// Função para mudar o alien no carrossel
function changeAlien(direction) {
    currentIndex += direction;

    // Garante que o índice seja circular
    if (currentIndex < 0) currentIndex = aliens.length - 1;
    if (currentIndex >= aliens.length) currentIndex = 0;

    updateCarousel();
}
