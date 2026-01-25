const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

function setTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
        localStorage.setItem('color-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleDarkIcon.classList.remove('hidden');
        themeToggleLightIcon.classList.add('hidden');
        localStorage.setItem('color-theme', 'light');
    }
}

const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('color-theme');

if (storedTheme === 'dark' || (!storedTheme && userPrefersDark)) {
    setTheme(true);
} else {
    setTheme(false);
}

themeToggleBtn.addEventListener('click', function () {
    const isDarkNow = document.documentElement.classList.contains('dark');
    setTheme(!isDarkNow);
});
