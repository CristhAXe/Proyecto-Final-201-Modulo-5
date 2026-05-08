tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "on-primary-fixed-variant": "#004299",
                "on-background": "#191b22",
                "tertiary-fixed-dim": "#ffb597",
                "surface-container": "#ededf6",
                primary: "#003a87",
                "secondary-fixed-dim": "#00e1ab",
                "surface-tint": "#195abf",
                secondary: "#006c50",
                "on-secondary": "#ffffff",
                outline: "#737784",
                "secondary-fixed": "#36ffc4",
                "on-tertiary-fixed-variant": "#7e2c00",
                "primary-fixed": "#d9e2ff",
                "on-primary-container": "#b5caff",
                "surface-bright": "#faf8ff",
                background: "#faf8ff",
                "on-tertiary-fixed": "#360f00",
                "on-error-container": "#93000a",
                "on-surface": "#191b22",
                "on-primary": "#ffffff",
                "on-secondary-fixed-variant": "#00513c",
                surface: "#faf8ff",
                "surface-dim": "#d9d9e2",
                "surface-container-high": "#e7e7f1",
                "secondary-container": "#00fabe",
                "surface-variant": "#e1e2eb",
                "surface-container-highest": "#e1e2eb",
                tertiary: "#6f2600",
                "on-surface-variant": "#424753",
                "error-container": "#ffdad6",
                "inverse-surface": "#2e3037",
                "inverse-primary": "#afc6ff",
                "surface-container-lowest": "#ffffff",
                "inverse-on-surface": "#f0f0f9",
                "primary-container": "#0050b5",
                "on-error": "#ffffff",
                "surface-container-low": "#f3f3fc",
                "outline-variant": "#c3c6d5",
                "primary-fixed-dim": "#afc6ff",
                "on-primary-fixed": "#001944",
                "tertiary-container": "#953600",
                "on-secondary-container": "#006f52",
                "on-tertiary": "#ffffff",
                "on-secondary-fixed": "#002116",
                "tertiary-fixed": "#ffdbcd",
                "on-tertiary-container": "#ffba9e",
                error: "#ba1a1a",
            },

            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px",
            },

            spacing: {
                "stack-md": "12px",
                "stack-lg": "24px",
                gutter: "16px",
                "container-padding": "24px",
                "stack-sm": "4px",
                base: "8px",
            },

            fontFamily: {
                display: ["Plus Jakarta Sans"],
                "headline-md": ["Plus Jakarta Sans"],
                "headline-lg": ["Plus Jakarta Sans"],
                "body-sm": ["Plus Jakarta Sans"],
                "body-lg": ["Plus Jakarta Sans"],
                "label-caps": ["Plus Jakarta Sans"],
            },

            fontSize: {
                display: [
                    "40px",
                    {
                        lineHeight: "48px",
                        letterSpacing: "-0.02em",
                        fontWeight: "800",
                    },
                ],

                "headline-md": [
                    "20px",
                    {
                        lineHeight: "28px",
                        fontWeight: "700",
                    },
                ],

                "headline-lg": [
                    "24px",
                    {
                        lineHeight: "32px",
                        fontWeight: "700",
                    },
                ],

                "body-sm": [
                    "14px",
                    {
                        lineHeight: "20px",
                        fontWeight: "400",
                    },
                ],

                "body-lg": [
                    "16px",
                    {
                        lineHeight: "24px",
                        fontWeight: "500",
                    },
                ],

                "label-caps": [
                    "12px",
                    {
                        lineHeight: "16px",
                        letterSpacing: "0.05em",
                        fontWeight: "700",
                    },
                ],
            },
        },
    },
};