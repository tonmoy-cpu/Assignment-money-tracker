/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#493D9E',
          secondary: '#B2A5FF',
          bgLight: '#DAD2FF',
          bgAccent: '#FFF2AF',
        },
        dark: {
          primary: '#ECDFCC',
          secondary: '#697565',
          bgDark: '#181C14',
          bgAccent: '#3C3D37',
        },
      },
    },
  },
  plugins: [],
};