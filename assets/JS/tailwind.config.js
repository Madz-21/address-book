tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#0f0f0f",
        glass: {
          bg: "rgba(30, 30, 30, 0.6)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        text: {
          primary: "#ffffff",
          secondary: "#bbbbbb",
        },
      },
      fontFamily: {
        sans: ["Roboto", "Alan Sans", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      animation: {
        gradient: "gradient 15s ease infinite",
        fadeIn: "fadeIn 0.6s ease-out forwards",
        slideIn: "slideIn 0.5s ease-out forwards",
        slideOut: "slideOut 0.5s ease-in forwards",
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideOut: {
          from: {
            opacity: "1",
            transform: "translateY(0)",
          },
          to: {
            opacity: "0",
            transform: "translateY(30px)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "glass-hover":
          "0 12px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(100, 150, 255, 0.2)",
      },
    },
  },
  plugins: [],
};
