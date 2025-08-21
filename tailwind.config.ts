import type { Config } from 'tailwindcss'
const config: Config = { content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { brand: { black: '#0a0a0a', gold: '#d4b36c', offwhite: '#f5e9c8', red: '#e23d3d', sand: '#c9a76d', }, }, borderColor: { subtle: '#2a2a2a' }, boxShadow: { gold: '0 0 0 1px #2a2a2a, 0 10px 30px rgba(0,0,0,.35)' }, fontFamily: { sans: ['ui-sans-serif','system-ui','Inter','Segoe UI','Roboto','Helvetica','Arial','Apple Color Emoji','Segoe UI Emoji'] } } }, plugins: [], }
export default config;
