/*
const IMAGE_WIDTH = 512;

const COLS_SIZE = 8;
const ROWS_SIZE = 8;

const TOTAL_ALIENS = ROWS_SIZE * COLS_SIZE;

const TILE_SIZE = IMAGE_WIDTH / COLS_SIZE;

const INDEX_TILE = 0;

// const col = INDEX_TILE % COLS_SIZE;
// const row = Math.floor(INDEX_TILE / COLS_SIZE);

const posX = -(col * TILE_SIZE);
const posY = -(row * TILE_SIZE);

const displayElement = document.querySelector('.display-aliens');
const alienDiv = document.createElement('div');
alienDiv.classList.add('alien-tile');
displayElement.append(alienDiv);

alienDiv.style.width = `${TILE_SIZE}px`;
alienDiv.style.height = `${TILE_SIZE}px`;
alienDiv.style.backgroundPosition = `${posX}px ${posY}px`;

// alienDiv.classList.add('active'); // somente quanto ele estiver no topo
*/

const displayElement = document.querySelector('.display-aliens');

const IMAGE_WIDTH = 512;
const COLS_SIZE = 8;
const ROWS_SIZE = 8;
const TOTAL_ALIENS = ROWS_SIZE * COLS_SIZE;
const TILE_SIZE = IMAGE_WIDTH / COLS_SIZE;

const RADIUS = '37.5vh'; 
const ANGLE_STEP = 25; 

const tiles = [];

let currentPosition = 0; 
let isDragging = false;
let startX = 0;
let startPosition = 0;
const SENSITIVITY = 0.015; 

function initCarousel() {
    displayElement.innerHTML = ''; 
    
    for (let i = 0; i < TOTAL_ALIENS; i++) {
        const col = i % COLS_SIZE;
        const row = Math.floor(i / COLS_SIZE);
        const posX = -(col * TILE_SIZE);
        const posY = -(row * TILE_SIZE);

        const tile = document.createElement('div');
        tile.classList.add('alien-tile');
        tile.style.width = `${TILE_SIZE}px`;
        tile.style.height = `${TILE_SIZE}px`;
        tile.style.backgroundPosition = `${posX}px ${posY}px`;
        
        tile.style.opacity = '0';
        tile.style.pointerEvents = 'none'; 
        
        displayElement.append(tile);
        tiles.push(tile); 
    }
}

function updateCarousel() {
    tiles.forEach((tile, index) => {
        let diff = index - currentPosition;
        
        // Loop infinito para sempre encontrar o caminho mais curto
        while (diff > TOTAL_ALIENS / 2) diff -= TOTAL_ALIENS;
        while (diff < -TOTAL_ALIENS / 2) diff += TOTAL_ALIENS;

        const absDiff = Math.abs(diff);

        // ==========================================
        // CÁLCULO PARA TODOS
        // ==========================================
        
        const angle = diff * ANGLE_STEP; 
        
        let scale = 1;
        let opacity = 0;
        let blur = 0;

        if (absDiff <= 4.5) {
            // DE VOLTA À GLÓRIA: O item no centro cresce e fica 100% visível!
            if (absDiff <= 1) {
                scale = 1.5 - (absDiff * 0.3); // O Alien ativo fica GIGANTE no topo
            } else {
                scale = 1.2 - ((absDiff - 1) * 0.08); // Os outros vão diminuindo nas laterais
            }
            
            // Opacidade 1 no centro, sumindo gradativamente nas pontas
            opacity = Math.max(0, 1 - (absDiff * 0.2)); 
            
            // Desfoque apenas para os que estão na posição 2 em diante
            blur = absDiff >= 2 ? (absDiff - 1.5) * 2 : 0;
        } else {
            // Itens da parte de baixo da roda (escondidos perfeitamente)
            opacity = 0;
        }

        // Blindagem do CSS e o bug da esquerda (${-angle}deg) devidamente aplicados
        tile.style.setProperty(
            'transform', 
            `rotate(${angle}deg) translateY(-${RADIUS}) rotate(${-angle}deg) scale(${scale})`,
            'important'
        );
        
        tile.style.opacity = opacity.toString();
        tile.style.filter = `blur(${blur}px)`;
        tile.style.zIndex = Math.round(100 - (absDiff * 10));
        
        tile.style.pointerEvents = (opacity > 0.1) ? 'auto' : 'none';

        // O Glow verde glorioso quando ele para exatamente no topo!
        if (absDiff < 0.05 && !isDragging) {
            tile.classList.add('active');
        } else {
            tile.classList.remove('active');
        }
    });
}

let isRingActive = false; 
let lastClosedTime = 0; // Previne que o click de fechar abra o relógio acidentalmente na mesma hora

// Funções de Toggle do Ring
function openRing() {
    isRingActive = true;
    displayElement.classList.add('open');
}

function closeRing() {
    isRingActive = false;
    displayElement.classList.remove('open');
    lastClosedTime = Date.now(); // Marca a hora que fechou
}

// Escuta cliques em qualquer lugar da tela para ATIVAR o relógio
document.addEventListener('click', () => {
    // Só abre se estiver fechado E se passou mais de 300ms desde a última vez que fechou
    if (!isRingActive && (Date.now() - lastClosedTime > 300)) {
        openRing();
    }
});

// ==========================================
// EVENTOS DE DRAG (Com Swipe Down para Fechar)
// ==========================================
let startY = 0; // NOVO: Precisamos rastrear o eixo Y agora

function handleDragStart(e) {
    if (!isRingActive) return; // Trava o drag se o ring estiver invisível

    isDragging = true;
    displayElement.classList.add('dragging'); 
    
    // Captura o X e o Y inicial
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    startY = e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
    
    startPosition = currentPosition;
}

// function handleDragStart(e) {
//     isDragging = true;
//     displayElement.classList.add('dragging'); 
//     startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
//     startPosition = currentPosition;
// }

function handleDragMove(e) {
    // Adicionado o !isRingActive aqui também por segurança!
    if (!isDragging || !isRingActive) return; 
    
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const currentY = e.type.includes('mouse') ? e.pageY : e.touches[0].clientY; // <-- FALTAVA ISSO
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY; // <-- FALTAVA ISSO

    // ==========================================
    // NOVA LÓGICA: SWIPE DOWN PARA FECHAR
    // ==========================================
    // Se o usuário puxou para BAIXO (> 80px) E o movimento vertical foi mais forte que o horizontal
    if (deltaY > 80 && Math.abs(deltaY) > Math.abs(deltaX)) {
        closeRing();
        isDragging = false;
        displayElement.classList.remove('dragging');
        return; // Interrompe a função para não girar o disco
    }
    
    currentPosition = startPosition - (deltaX * SENSITIVITY);
    
    if (currentPosition < 0) currentPosition += TOTAL_ALIENS;
    currentPosition %= TOTAL_ALIENS;

    updateCarousel();
}

function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    displayElement.classList.remove('dragging'); 
    
    currentPosition = Math.round(currentPosition);
    if (currentPosition === TOTAL_ALIENS) currentPosition = 0;

    updateCarousel(); 
}

displayElement.addEventListener('mousedown', handleDragStart);
window.addEventListener('mousemove', handleDragMove);
window.addEventListener('mouseup', handleDragEnd); 
window.addEventListener('mouseleave', handleDragEnd);

displayElement.addEventListener('touchstart', handleDragStart, { passive: false });
window.addEventListener('touchmove', handleDragMove, { passive: false });
window.addEventListener('touchend', handleDragEnd);

initCarousel();
updateCarousel();