/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./*.html",
        "./js/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                primary: '#06b6d4', // Cyan 500
                'primary-dark': '#0891b2', // Cyan 600
                dark: '#0f172a', // Slate 900
                'dark-card': '#1e293b', // Slate 800
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Exo 2', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            }
        }
    },
    plugins: [],
}
