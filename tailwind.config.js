// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/*/.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Oxygen-Sans"',
          'Ubuntu',
          'Cantarell',
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          'Helvetica',
          '"ヒラギノ角ゴ Pro W3"',
          '"Hiragino Kaku Gothic Pro"',
          'メイリオ',
          'Meiryo',
          '"ＭＳ Ｐゴシック"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
      },
    },
  },
};
