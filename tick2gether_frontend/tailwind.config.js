module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        blueCustom: {
          light: 'rgba(3, 116, 250, 0.15)',
          DEFAULT: '#0374FA',
        },
        pinkCustom: {
          light: 'rgba(255, 98, 230, 0.15)',
          DEFAULT: '#FF62E6',
        },
        grayCustom: {
          light: '#0000000D',
          dark: '#54595D',
        },
        highlightCustom: {
          light: '#DCDEE1'
        },
        redCustom: {
          light: 'rgba(252, 94, 94, 0.15)',
          DEFAULT: '#FC5E5E',
        },
      },
      borderRadius: {
        custom: '15px',
        large: '20px',
      },
      boxShadow: {
        custom: '0px 4px 30px 0px #0000000D',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};