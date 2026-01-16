/* ==================== 1. UI & THEME LOGIC ==================== */

/* --- Theme Configuration --- */
const themes = {
    default: {
        particleColor: 'rgba(139, 157, 166, 0.5)', 
        lineColor: '0, 224, 167', // Cyan
        mouseColor: '#00e0a7'     
    },
    red: {
        particleColor: 'rgba(166, 139, 139, 0.5)', 
        lineColor: '255, 46, 99', // Crimson
        mouseColor: '#ff2e63'      
    }
};

let currentTheme = 'default'; 

/* --- Theme Switcher --- */
const themeBtn = document.getElementById('theme-btn');
const themeOptions = document.getElementById('theme-options');
const options = document.querySelectorAll('.theme-option');

if(themeBtn){
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeOptions.classList.toggle('active');
    });
}

// Close dropdown when clicking outside
window.addEventListener('click', () => {
    if(themeOptions) themeOptions.classList.remove('active');
});

// Handle Theme Selection
options.forEach(option => {
    option.addEventListener('click', () => {
        const selectedColor = option.getAttribute('data-color');
        
        // Update CSS variables
        if (selectedColor === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', selectedColor);
        }

        // Update JS State and Reboot Canvas
        currentTheme = selectedColor;
        init(); 
        themeOptions.classList.remove('active');
    });
});

/* --- Mobile Menu Toggle --- */
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

// Close menu when clicking a link
const navLinks = document.querySelectorAll('.nav__link')
const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLinks.forEach(n => n.addEventListener('click', linkAction))


/* ==================== 2. CANVAS ANIMATION LOGIC ==================== */

const canvasBg = document.getElementById("bg-canvas");
const ctxBg = canvasBg.getContext("2d");

const canvasCursor = document.getElementById("cursor-canvas");
const ctxCursor = canvasCursor.getContext("2d");

let particlesArray;
let mouseTrail = []; 

// Setup & Resize
function resizeCanvases() {
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;
    canvasCursor.width = window.innerWidth;
    canvasCursor.height = window.innerHeight;
}
resizeCanvases();

// Mouse State
let mouse = {
    x: undefined,
    y: undefined,
    radius: 120 // Interaction radius for grid effect
}

let smoothMouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function(){
    mouse.x = undefined;
    mouse.y = undefined;
    mouseTrail = [];
});

/* --- Particle Class (Elastic Grid) --- */
class Particle {
    constructor(x, y, size, color) {
        this.x = x;       
        this.y = y;
        this.baseX = x;   // Original position (Anchor)
        this.baseY = y;
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 30) + 1; 
    }

    draw() {
        ctxBg.beginPath();
        ctxBg.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctxBg.fillStyle = this.color; 
        ctxBg.fill();
    }

    update() {
        // Physics Logic: Mouse Repulsion & Elastic Return
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        
        // Force calculation (0 to 1)
        let force = (maxDistance - distance) / maxDistance;
        
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            // Push away from mouse
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // Return to base position (Elasticity)
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10; 
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
        this.draw();
    }
}

/* --- Initialization --- */
function init() {
    particlesArray = [];
    const color = themes[currentTheme].particleColor;
    
    // Grid Settings
    let spacing = 50; 
    
    // Loop creates a grid covering the full screen + buffer
    for (let y = 0; y < canvasBg.height + spacing; y += spacing) {
        for (let x = 0; x < canvasBg.width + spacing; x += spacing) {
            let size = 2;
            particlesArray.push(new Particle(x, y, size, color));
        }
    }
}

/* --- Connection Lines --- */
function connect() {
    const rgbLine = themes[currentTheme].lineColor;
    let opacityValue = 1;

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = dx * dx + dy * dy;

            // Connect if close (3500 roughly matches diagonal of 50px grid)
            if (distance < 3500) { 
                opacityValue = 1 - (distance / 3500);
                
                ctxBg.strokeStyle = `rgba(${rgbLine}, ${opacityValue * 0.3})`;
                ctxBg.lineWidth = 1;
                ctxBg.beginPath();
                ctxBg.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctxBg.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctxBg.stroke();
            }
        }
    }
}

/* --- Main Animation Loop --- */
function animate() {
    requestAnimationFrame(animate);
    
    // Clear frames
    ctxBg.clearRect(0,0, canvasBg.width, canvasBg.height);
    ctxCursor.clearRect(0,0, canvasCursor.width, canvasCursor.height);

    // Update Particles
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();

    // Draw Smooth Mouse Trail
    if(mouse.x !== undefined && mouse.y !== undefined) {
        const glow = themes[currentTheme].mouseColor;
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.15;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.15;

        mouseTrail.push({x: smoothMouse.x, y: smoothMouse.y});
        if (mouseTrail.length > 20) mouseTrail.shift();

        for (let i = 0; i < mouseTrail.length; i++) {
            let opacity = i / mouseTrail.length;
            ctxCursor.beginPath();
            ctxCursor.arc(mouseTrail[i].x, mouseTrail[i].y, 2 + (i * 0.1), 0, Math.PI * 2);
            ctxCursor.fillStyle = hexToRgba(glow, opacity * 0.4);
            ctxCursor.fill();
        }

        ctxCursor.shadowBlur = 10;
        ctxCursor.shadowColor = glow;
        ctxCursor.fillStyle = glow;
        ctxCursor.beginPath();
        ctxCursor.arc(smoothMouse.x, smoothMouse.y, 4, 0, Math.PI * 2);
        ctxCursor.fill();
        ctxCursor.shadowBlur = 0;
    }
}

// Helper: Hex to RGBA conversion
function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Handle Resize
window.addEventListener('resize', function(){
    resizeCanvases();
    init(); // Reboot grid on resize
});

// Start System
init();
animate();


/* ==================== 3. PROJECT DATA POPULATION ==================== */
const projects = [
    {
        title: "Lighting Login Page",
        image: "img/project1.jpg",
        topic: "CSS Design",
        description: "A colorful login page developed for practising different CSS properties and animations.",
        link: "https://ahmed-sakil.github.io/Lighting-login-form/"
    },
    {
        title: "CalcMaster",
        image: "img/project2.jpg",
        topic: "Web App",
        description: "A dynamic toolkit featuring standard, scientific, BMI, and unit-conversion calculators.",
        link: "https://ahmed-sakil.github.io/CalcMuster/"
    },
    {
        title: "SA BMW Shop",
        image: "img/project3.jpg",
        topic: "E-Commerce",
        description: "A car dealership website built to practice dynamic design using HTML, CSS, and JavaScript.",
        link: "https://ahmed-sakil.github.io/SA_BMW_Shop/"
    },
    {
        title: "Airport Management",
        image: "img/project4.jpg",
        topic: "Utility",
        description: "A fast and simple platform to search, book, and manage train and flight tickets online.",
        link: "#"
    },
    {
        title: "Library Bot",
        image: "img/project5.jpg",
        topic: "Automation",
        description: "An automated bot system to manage library books, issues, and returns efficiently.",
        link: "#"
    },
    {
        title: "Weather App",
        image: "img/project3.jpg", 
        topic: "API Integration",
        description: "Real-time weather application fetching data from OpenWeatherMap API with location detection.",
        link: "#"
    }
];

const projectContainer = document.getElementById("project_container");
if(projectContainer) {
    projectContainer.innerHTML = '';
    projects.forEach(project => {
        let html = `
        <article class="project__card">
            <div class="project__img-wrapper">
                <img src="${project.image}" alt="${project.title}" class="project__img">
            </div>
            <div class="project__data">
                <span class="project__topic">${project.topic}</span>
                <h3 class="project__title">${project.title}</h3>
                <p class="project__description">${project.description}</p>
                <a href="${project.link}" target="_blank" class="project__button">
                    Demo <i class="ri-arrow-right-line"></i>
                </a>
            </div>
        </article>
        `;
        projectContainer.insertAdjacentHTML("beforeend", html);
    });
}
