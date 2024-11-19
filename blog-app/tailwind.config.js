/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'register-back': "url('./images/reg-back.png')",
        'profile-back': "url('./images/cosmos.jpg')"
      },
      backgroundColor: {
        'back-color': 'rgba(255, 255, 255, 0.8)'
      },
      height: {
        'vh': '100vh'
      },
      borderRadius: {
        '4xl': '40px'
      },
      backgroundSize: {
        'full-size': '100% 100%;'
      },
      boxShadow: {
        'custom': '0 0 10px rgba(0, 0, 0, 0.5)',
        'blue': '12px 0 15px 0px rgba(58, 164, 226, 0.808), -12px 0 8px -4px rgba(31, 73, 125, 0.8);',
        'white-2xl': '0 0px 20px 0px rgba(255, 255, 255, 0.8)',
        'white-xl': '0 25px 50px -12px rgba(255, 255, 255, 0.8), 10px 3px 5px 0px rgba(255, 255, 255, 0.7)',
        'white-sm': '0 0px 15px 0px rgba(255, 255, 255, 0.6)',
        'custom-rounded': '0 15px 36px rgba(0, 0, 0, 0.1)'
      },
      fontSize: {
        'sm': '19px'
      },
      translate: {
        'center': 'translate(-50%, -50%);'
      }
    },
  },
  plugins: [],
}

