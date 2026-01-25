const translations = {
    pl: {
        "hero.subtitle": "Inżynieria precyzyjna. Programowanie CNC.<br><span class=\"font-medium text-gray-800 dark:text-gray-100\">Tworzę rozwiązania techniczne i cyfrowe.</span>",
        "btn.projects": "Moje Projekty",
        "btn.contact": "Kontakt",
        "sec.portfolio": "Portfolio & Narzędzia",
        "card.calc.title": "Kalkulator CNC",
        "card.calc.desc": "Parametry skrawania, gwinty i wagi materiałów. PWA Offline.",
        "card.viz.title": "Wizualizer CNC",
        "card.viz.desc": "Symulator 3D G-kodu (Fanuc/ISO). Działa w przeglądarce.",
        "card.site.title": "Firma CNC - Projekt 1",
        "card.site.desc": "Przykład strony internetowej dla nowoczesnej firmy obróbczej.",
        "card.card.title": "Firma CNC - Projekt 2",
        "card.card.desc": "Koncepcja wizytówki online. Minimalistyczny design.",
        "card.mes.title": "System MES",
        "card.mes.desc": "Autorski system zarządzania produkcją. Monitorowanie wydajności i procesów (YouTube).",
        "contact.section": "Kontakt",
        "contact.title": "Rozpocznijmy współpracę",
        "footer.rights": "Wszelkie prawa zastrzeżone.",
        "footer.design": "Designed with Precision.",
        "label.new": "NOWOŚĆ",
        "label.beta": "BETA",
        "label.video": "WIDEO"
    },
    en: {
        "hero.subtitle": "Precision Engineering. CNC Programming.<br><span class=\"font-medium text-gray-800 dark:text-gray-100\">Creating technical and digital solutions.</span>",
        "btn.projects": "My Projects",
        "btn.contact": "Contact",
        "sec.portfolio": "Portfolio & Tools",
        "card.calc.title": "HTML Calculator",
        "card.calc.desc": "Cutting parameters, threads, material weights. Offline PWA.",
        "cart.calc.title": "CNC Calculator",
        "card.calc.desc": "Cutting parameters, threads, material weights. Offline PWA.",
        "card.viz.title": "CNC Visualizer",
        "card.viz.desc": "3D G-Code Simulator (Fanuc/ISO). Browser-based.",
        "card.site.title": "CNC Company - Project 1",
        "card.site.desc": "Example website for a modern manufacturing company.",
        "card.card.title": "CNC Company - Project 2",
        "card.card.desc": "Online business card concept. Minimalist design.",
        "card.mes.title": "MES System",
        "card.mes.desc": "Proprietary Manufacturing Execution System. Performance tracking & monitoring (YouTube).",
        "contact.section": "Contact",
        "contact.title": "Let's work together",
        "footer.rights": "All rights reserved.",
        "footer.design": "Designed with Precision.",
        "label.new": "NEW",
        "label.beta": "BETA",
        "label.video": "VIDEO"
    }
};

function setLanguage(lang) {
    if (!translations[lang]) return;

    // Save preference
    localStorage.setItem('bk_lang', lang);
    document.documentElement.lang = lang;

    // Update texts
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update active button state (visual feedback)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const isActive = btn.getAttribute('onclick').includes(lang);
        if (isActive) {
            btn.classList.add('font-bold', 'opacity-100');
            btn.classList.remove('opacity-50');
        } else {
            btn.classList.add('opacity-50');
            btn.classList.remove('font-bold', 'opacity-100');
        }
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Check browser lang or storage
    const stored = localStorage.getItem('bk_lang');
    const browser = navigator.language.startsWith('pl') ? 'pl' : 'en';
    const lang = stored || browser;

    setLanguage(lang);
});
