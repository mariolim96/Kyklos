import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
        "./utils/**/*.{ts,tsx}",
    ],
    prefix: "",
    daisyui: {
        themes: [
            {
                light: {
                    primary: "#68AA2F",
                    "primary-content": "#ffffff",
                    secondary: "#2F5C3B",
                    "secondary-content": "black",
                    accent: "#68AA2F",
                    "accent-content": "#ffffff",
                    neutral: "#F0F6EA",
                    "neutral-content": "#ffffff",
                    "base-100": "#ffffff",
                    "base-200": "#F0F6EA",
                    "base-300": "#68AA2F",
                    "base-content": "#ffffff",
                    info: "#68AA2F",
                    success: "#34EEB6",
                    warning: "#FFCF72",
                    error: "#FF8863",

                    "--rounded-btn": "0.3rem",

                    ".tooltip": {
                        "--tooltip-tail": "6px",
                    },
                    ".link": {
                        textUnderlineOffset: "2px",
                    },
                    ".link:hover": {
                        opacity: "80%",
                    },
                },
            },
            {
                dark: {
                    primary: "#68AA2F",
                    "primary-content": "#ffffff",
                    secondary: "#2F5C3B",
                    "secondary-content": "black",
                    accent: "#68AA2F",
                    "accent-content": "#ffffff",
                    neutral: "#F0F6EA",
                    "neutral-content": "#ffffff",
                    "base-100": "#ffffff",
                    "base-200": "#F0F6EA",
                    "base-300": "#68AA2F",
                    "base-content": "#ffffff",
                    info: "#68AA2F",
                    success: "#34EEB6",
                    warning: "#FFCF72",
                    error: "#FF8863",

                    "--rounded-btn": "0.3rem",

                    ".tooltip": {
                        "--tooltip-tail": "6px",
                    },
                    ".link": {
                        textUnderlineOffset: "2px",
                    },
                    ".link:hover": {
                        opacity: "80%",
                    },
                },
            },
        ],
    },
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
            },

            colors: {
                base: {
                    DEFAULT: "hsl(var(--base))",
                    focus: "hsl(var(--base-focus))",
                    2: "hsl(var(--base-2))",
                    "2-focus": "hsl(var(--base-2-focus))",
                    content: "hsl(var(--base-content))",
                    "content-2": "hsl(var(--base-content-2))",
                    "content-3": "hsl(var(--base-content-3))",
                    "content-4": "hsl(var(--base-content-4))",
                },
                overlay: {
                    DEFAULT: "hsl(var(--overlay))",
                    focus: "hsl(var(--overlay-focus))",
                    2: "hsl(var(--overlay-2))",
                    "2-focus": "hsl(var(--overlay-2-focus))",
                    content: "hsl(var(--overlay-content))",
                    "content-2": "hsl(var(--overlay-2-content))",
                    "content-3": "hsl(var(--overlay-3-content))",
                },
                line: {
                    DEFAULT: "hsl(var(--line))",
                    focus: "hsl(var(--line-focus))",
                },
                input: {
                    DEFAULT: "hsl(var(--input))",
                    focus: "hsl(var(--input-focus))",
                    content: "hsl(var(--input-content))",
                    "content-2": "hsl(var(--input-2-content))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    focus: "hsl(var(--primary-focus))",
                    subtle: "hsl(var(--primary-subtle))",
                    content: "hsl(var(--primary-content))",
                    "subtle-content": "hsl(var(--primary-subtle-content))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    focus: "hsl(var(--secondary-focus))",
                    subtle: "hsl(var(--secondary-subtle))",
                    "subtle-content": "hsl(var(--secondary-subtle-content))",
                    content: "hsl(var(--secondary-content))",
                },
                info: {
                    DEFAULT: "hsl(var(--info))",
                    focus: "hsl(var(--info-focus))",
                    subtle: "hsl(var(--info-subtle))",
                    "subtle-content": "hsl(var(--info-subtle-content))",
                    content: "hsl(var(--info-content))",
                },
                danger: {
                    DEFAULT: "hsl(var(--danger))",
                    focus: "hsl(var(--danger-focus))",
                    subtle: "hsl(var(--danger-subtle))",
                    "subtle-content": "hsl(var(--danger-subtle-content))",
                    content: "hsl(var(--danger-content))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    focus: "hsl(var(--success-focus))",
                    subtle: "hsl(var(--success-subtle))",
                    "subtle-content": "hsl(var(--success-subtle-content))",
                    "content-2": "hsl(var(--success-2-content))",
                    content: "hsl(var(--success-content))",
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    focus: "hsl(var(--warning-focus))",
                    subtle: "hsl(var(--warning-subtle))",
                    "subtle-content": "hsl(var(--warning-subtle-content))",
                    content: "hsl(var(--warning-content))",
                },

                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            boxShadow: {
                center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
            },
            animation: {
                "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("daisyui")],
};
