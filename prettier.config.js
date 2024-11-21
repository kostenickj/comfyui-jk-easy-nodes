
/** @type { PrettierConfig | SortImportsConfig | TailwindConfig } */
const config = {
   
    singleQuote: true,
    tabWidth: 4,
    useTabs: false,
    jsxSingleQuote: false,
    printWidth: 160,
    trailingComma: 'none',
    braceStyle: 'allman',
    overrides: [
        {
            files: '*.json.hbs',
            options: {
                parser: 'json'
            }
        },
        {
            files: '*.js.hbs',
            options: {
                parser: 'babel'
            }
        }
    ]
};

module.exports = config;
