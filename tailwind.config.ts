import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [nextui(
    {
      themes: {
        light: {
          extend: "light",
          colors: {
            background: "#ffff",
            white:"#fff",
            primary: {
              DEFAULT: "#37248f",
                

 

  50: '#edeaff',
  100: '#ccc1f4',
  200: '#ac99e7',
  300: '#8d71dc',
  400: '#7248d0',
  500: '#502fb7',
  600: '#37248f',
  700: '#211968',
  800: '#110f40',
  900: '#04031b',


            },
            secondary: {
              DEFAULT: "#626d84",
              

              
                50: '#e8f0ff',
                100: '#cfd6e3',
                200: '#b5bccc',
                300: '#97a2b4',
                400: '#7b899d',
                500: '#626d84',
                600: '#4b5368',
                700: '#343a4b',
                800: '#1e2030',
                900: '#070718',
              
            },
            focus: "#F182F6",
            content1: "#1A1920",
            content2: "#383645",
            darkLight: "transparent"
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "8px",
              medium: "12px",
              large: "16px"
            }
          }
        }
      }
    }
  )],
};
export default config;
