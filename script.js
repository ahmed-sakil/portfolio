console.log("Initializing Script...");

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close'),
      navLinks = document.querySelectorAll('.nav__link');

/* Menu show */
if(navToggle){
   navToggle.addEventListener('click', () =>{
      navMenu.classList.add('show-menu')
   })
}

/* Menu hidden */
if(navClose){
   navClose.addEventListener('click', () =>{
      navMenu.classList.remove('show-menu')
   })
}
/* Close menu when any nav link is clicked */
navLinks.forEach(link => {
   link.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
   });
});

const projects = {
    project1: {title: "Lighting Login Page",image: "img/project1.jpg",topic: "web development",description: "A fast and simple platform to search, book, and manage train tickets online.", link: "https://ahmed-sakil.github.io/Lighting-login-form/"},
    project2: {title: "CalcMaster",image: "img/project2.jpg",topic: "web development (HTML, CSS, JavaScript)",description: "A dynamic toolkit featuring standard, scientific, BMI, and unit-conversion calculators with theme switching and intuitive design.", link: "https://ahmed-sakil.github.io/CalcMuster/"},
    project3: {title: "Weather Application",image: "img/project3.jpg",topic: "web development",description: "A fast and simple platform to search, book, and manage train tickets online."},
    project4: {title: "Shahajalal International Airport",image: "img/project4.jpg",topic: "web development",description: "A fast and simple platform to search, book, and manage train tickets online."},
    project5: {title: "Library Mennagement Bot",image: "img/project5.jpg",topic: "web development",description: "A fast and simple platform to search, book, and manage train tickets online."},
    project6: {title: "Weather Application",image: "img/project3.jpg",topic: "web development",description: "A fast and simple platform to search, book, and manage train tickets online."},
}

Object.values(projects).forEach(project => {
    
    let new_project = `<div class="item_container">
                    <div class="project_img">
                        <img src="${project.image}" alt="p1" width="400">
                    </div>
                    <div class="project_topic">${project.topic}</div>
                    <h2 class="project_name">${project.title}</h2>
                    <p class="project_description">${project.description}</p>
                    <a href="${project.link}" class="project_button">Explore Project <i class="fa-solid fa-arrow-right"></i></a>
                </div>`
    
    let project_container = document.getElementById("project_container")
    project_container.insertAdjacentHTML("beforeend", new_project)
});
