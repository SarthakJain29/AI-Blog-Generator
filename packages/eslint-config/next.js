import baseConfig from './base.js';
import react from 'eslint-plugin-react';

export default [
    ...baseConfig,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react,
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
