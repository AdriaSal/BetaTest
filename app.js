/**
 * Adriatica Salumi - UI & Abruzzo Landscape Animation
 */

// ==========================================
// 1. LOGICA UI (Accordion & Svanimento su scroll)
// ==========================================

window.toggleProductDetails = function(element) {
    const allCards = document.querySelectorAll('.product-card');
    const isActive = element.classList.contains('active');
    
    allCards.forEach(card => {
        card.classList.remove('active');
        card.querySelector('.toggle-icon').textContent = '+';
    });
    
    if (!isActive) {
        element.classList.add('active');
        element.querySelector('.toggle-icon').textContent = '−';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-up, .fade-in').forEach(el => observer.observe(el));

    // Svanimento del disegno allo scroll (per dare respiro al testo)
    const landscapeContainer = document.getElementById('landscape-container');
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        let opacity = 1 - (scrollY / 500); // Svanisce dolcemente scrollando
        if (opacity <= 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        landscapeContainer.style.opacity = opacity;
    });

    // Avvia l'animazione del paesaggio
    initAbruzzoLandscape();
});

// ==========================================
// 2. ABBRUZZO LANDSCAPE ANIMATION
// ==========================================
function initAbruzzoLandscape() {
    const container = document.getElementById('landscape-container');
    if (!container) return;

    // Questa è la coordinata del disegno (M=Muoviti, L=Linea dritta, C/S=Curve morbide)
    // Parte da Sinistra (Gran Sasso), va al Centro (Colline) e finisce a Destra (Mare Adriatico)
    const landscapePathData = `
        M -50 250 
        L 50 250 
        L 150 120 
        L 200 180 
        L 280 80 
        L 360 220 
        C 420 250, 480 200, 560 210 
        S 700 240, 800 230 
        S 950 260, 1050 255 
        S 1150 265, 1250 260
    `;

    // Creiamo il codice SVG HTML da inserire dinamicamente
    container.innerHTML = `
        <svg class="landscape-svg" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
            
            <!-- Definizione della sfumatura/ombra dorata (Il dettaglio discreto) -->
            <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#c3a372" stop-opacity="1" />
                    <stop offset="100%" stop-color="#121415" stop-opacity="0" /> <!-- Svanisce nel colore di sfondo -->
                </linearGradient>
            </defs>

            <!-- Il Sole o Luna debole all'orizzonte (Sopra il mare a destra) -->
            <circle class="landscape-sun" cx="1000" cy="180" r="30" />

            <!-- La forma chiusa per riempire l'ombra sotto le montagne -->
            <path class="fill-shadow" d="${landscapePathData} L 1250 350 L -50 350 Z"></path>

            <!-- La linea che verrà animata e disegnata (Solo bordo) -->
            <path class="draw-line" id="animated-line" d="${landscapePathData}"></path>
            
        </svg>
    `;

    // Selezioniamo gli elementi appena creati
    const path = document.getElementById('animated-line');
    const fillShadow = document.querySelector('.fill-shadow');
    const sun = document.querySelector('.landscape-sun');

    // 1. Calcoliamo la lunghezza esatta della curva per poterla "srotolare"
    const length = path.getTotalLength();

    // 2. Impostiamo il bordo dell'SVG per essere invisibile all'inizio
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // 3. Forziamo il browser a registrare lo stato iniziale prima di animare
    path.getBoundingClientRect();

    // 4. Avviamo l'animazione della linea (Dura 3 secondi, accelerando e frenando morbidamente)
    path.style.transition = 'stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 0.5)';
    path.style.strokeDashoffset = '0'; // Tira la linea a 0 svelandola!

    // 5. Dopo che la linea è quasi finita di disegnare (es. 2.5 secondi), sveliamo le ombre e i dettagli
    setTimeout(() => {
        fillShadow.classList.add('show');
        sun.classList.add('show');
    }, 2500);
}