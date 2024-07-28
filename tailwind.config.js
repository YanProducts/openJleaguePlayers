import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            display:{
                "table-row":"table-row"
            },
            screens:{
                "md":"600px",
                "sm":"400px",
                "xs":"300px",
            },
            keyframes:{
                whenerror_anime:{
                    "0%,99%":{
                      opacity:1,
                      height:"30px"
                    },
                    "100%":{
                      opacity:0,
                      height:"0px",
                    }
                },
                whenright_anime:{
                    "0%,99%":{
                        opacity:1,
                        height:"60px",
                        padding:"8px",
                        margin:"10px auto",
                      },
                      "100%":{
                        opacity:0,
                        height:"0px",
                        margin:"0px",
                        padding:"0px"
                      }
                },
                whenwrong_anime:{
                    "0%,99%":{
                        opacity:1,
                        height:"40px",
                        padding:"6px",
                        margin:"10px auto",
                      },
                      "100%":{
                        opacity:0,
                        height:"0px",
                        margin:"0px",
                        padding:"0px"
                      }
                }
            },
            animation:{
                whenerror:"whenerror_anime 2s 1 normal forwards",
                whenright:"whenright_anime 3s 1 normal forwards",
                whenwrong:"whenwrong_anime 3s 1 normal forwards",
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [
        // カスタムの定義を追加
        function ({ addUtilities }) {
            const newUtilities = {
              '.text-shadow-outline': {
                textShadow: '2px 2px 0 white, -2px -2px 0 white, -2px 2px 0 white, 2px -2px 0 white, 2px 0 0 white, 0 2px 0 white, -2px 0 0 white, 0 -2px 0 white',
              },".text-underline":{
                "text-decoretion":"underline"
              }

            }
            addUtilities(newUtilities, ['responsive', 'hover'])
          },
        forms],
};
