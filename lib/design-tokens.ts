export const DESIGN_TOKENS = {
    colors: {
        primary: {
            100: '#1D4ED8',
            80: '#2563EB', // Main Brand Color
            60: '#3B82F6',
            40: '#60A5FA',
            20: '#DBEAFE',
            10: '#D0D5DF',
            DEFAULT: '#2563EB',
        },
        neutral: {
            100: '#111827', // Main Text
            90: '#1F2937',
            80: '#374151',
            70: '#4B5563',
            60: '#6B7280', // Secondary Text
            50: '#9CA3AF',
            40: '#D1D5DB',
            30: '#E5E7EB', // Borders
            20: '#F3F4F6', // Light Backgrounds
            white: '#FFFFFF',
        },
        semantic: {
            success: '#10B981',
            warning: '#F59E0B',
            danger: '#EF4444',
        }
    },

    typography: {
        fontFamily: 'Manrope, sans-serif',
        headings: {
            h1: { fontSize: '48px', lineHeight: '66px', fontWeight: '600' },
            h2: { fontSize: '40px', lineHeight: '55px', fontWeight: '600' },
            h3: { fontSize: '32px', lineHeight: '44px', fontWeight: '600' },
            h4: { fontSize: '24px', lineHeight: '33px', fontWeight: '600' },
            h5: { fontSize: '20px', lineHeight: '27px', fontWeight: '600' },
            h6: { fontSize: '18px', lineHeight: '25px', fontWeight: '600' },
        },
        body: {
            large: { fontSize: '18px', lineHeight: '25px' },
            medium: { fontSize: '16px', lineHeight: '22px' }, // Default
            small: { fontSize: '14px', lineHeight: '19px' },
        }
    },

    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '10px', // As seen in "border-radius: 10px" in the spec
        xl: '16px',
        full: '9999px',
    },

    shadows: {
        card: '0px 4px 4px rgba(0, 0, 0, 0.25)', // As seen in the spec
    }
};
