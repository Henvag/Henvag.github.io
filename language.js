document.addEventListener('DOMContentLoaded', () => {
    // Initialize language to English if not set
    let currentLanguage = localStorage.getItem('siteLanguage');
    if (!currentLanguage) {
        currentLanguage = 'english';
        localStorage.setItem('siteLanguage', currentLanguage);
    }

    const languageSwitch = document.getElementById('language-switcher');
    const originalContent = document.querySelector('.main-content').innerHTML;

    const dropdownProjects = document.getElementById('dropdown-projects');
    const mainContent = document.querySelector('.main-content');
    let isProjectsPage = false;

    // Set initial state
    languageSwitch.checked = (currentLanguage === 'norsk');
    updateContent();


    function updateContent() {
        const button = document.querySelector('.projects-button');
        const dropdownProject = document.querySelector('#dropdown-projects');
        const isProjectsPage = document.querySelector('.project-info');
        const noText = document.getElementById('language-label');
        const enText = document.getElementById('language-label-en');

        // Update button and dropdown text
        if (button && dropdownProject) {
            const buttonAttr = isProjectsPage ?
                (currentLanguage === 'english' ? 'data-en-home' : 'data-no-home') :
                (currentLanguage === 'english' ? 'data-en-projects' : 'data-no-projects');
            button.textContent = button.getAttribute(buttonAttr);
            dropdownProject.textContent = button.getAttribute(buttonAttr);
        }

        // Update other elements
        document.querySelectorAll('[data-en]').forEach(element => {
            element.innerHTML = element.getAttribute(currentLanguage === 'english' ? 'data-en' : 'data-no');
        });

        // Update language labels and ensure correct flag display
        if (currentLanguage === 'norsk') {
            noText.style.display = 'none';
            enText.style.display = 'block';
            languageSwitch.checked = true;
        } else {
            noText.style.display = 'block';
            enText.style.display = 'none';
            languageSwitch.checked = false;
        }
    }


    document.getElementById('dropdown-projects').addEventListener('click', function(event) {
        event.preventDefault();
        handleProjectsClick(originalContent);
    });
function handleProjectsClick(originalContent) {
        const isProjectsPage = document.querySelector('.project-info');
        const mainContent = document.querySelector('.main-content');

        if (mainContent.classList.contains('fade-out') || mainContent.classList.contains('fade-in')) {
            return;
        }

        mainContent.classList.add('fade-out');

        setTimeout(() => {
            if (isProjectsPage) {
                mainContent.innerHTML = originalContent;
                updateContent();
            } else {
                fetch('projects.html')
                    .then(response => response.text())
                    .then(data => {
                        mainContent.innerHTML = data;
                        updateContent();
                    });
            }

            mainContent.classList.remove('fade-out');

            requestAnimationFrame(() => {
                mainContent.classList.add('fade-in');
                setTimeout(() => {
                    mainContent.classList.remove('fade-in');
                }, 500);
            });
        }, 500);
    }



    languageSwitch.addEventListener('change', function() {
        currentLanguage = this.checked ? 'norsk' : 'english';
        localStorage.setItem('siteLanguage', currentLanguage);
        updateContent();
    });

    document.querySelector('.projects-button').addEventListener('click', function(event) {
        event.preventDefault();
        handleProjectsClick(originalContent);
    });

    function handleProjectsClick(originalContent) {
        const isProjectsPage = document.querySelector('.project-info');
        const mainContent = document.querySelector('.main-content');

        if (mainContent.classList.contains('fade-out') || mainContent.classList.contains('fade-in')) {
            return;
        }

        mainContent.classList.add('fade-out');

        setTimeout(() => {
            if (isProjectsPage) {
                mainContent.innerHTML = originalContent;
                updateContent();
            } else {
                fetch('projects.html')
                    .then(response => response.text())
                    .then(data => {
                        mainContent.innerHTML = data;
                        updateContent();
                    });
            }

            mainContent.classList.remove('fade-out');

            requestAnimationFrame(() => {
                mainContent.classList.add('fade-in');
                setTimeout(() => {
                    mainContent.classList.remove('fade-in');
                }, 500);
            });
        }, 500);
    }
});