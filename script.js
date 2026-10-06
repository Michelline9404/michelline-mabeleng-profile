// Toggle between light and dark theme
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    
    // Save theme preference to localStorage
    const isDarkTheme = body.classList.contains('dark-theme');
    localStorage.setItem('cvTheme', isDarkTheme ? 'dark' : 'light');
    
    // Update button text
    updateThemeButton();
}

// Load saved theme preference on page load
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('cvTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateThemeButton();
});

// Update theme button appearance
function updateThemeButton() {
    const themeBtn = document.querySelector('.btn-toggle-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeBtn.textContent = isDark ? '☀️ Light Theme' : '🌙 Dark Theme';
}

// Download CV as PDF (using html2pdf library)
document.getElementById('downloadBtn').addEventListener('click', function() {
    const element = document.querySelector('.container');
    const opt = {
        margin: 10,
        filename: 'Michelline_Mabeleng_CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    // Check if html2pdf library is loaded
    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(element).save();
    } else {
        // Fallback: use browser's print to PDF
        alert('For PDF download, you can use the Print button and select "Save as PDF" from your browser.');
        window.print();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add interactivity to skill items
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.addEventListener('click', function() {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Log CV loaded
console.log('CV loaded successfully!');
console.log('Theme: ' + (document.body.classList.contains('dark-theme') ? 'Dark' : 'Light'));