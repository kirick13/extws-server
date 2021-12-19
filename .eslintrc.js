
module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		'xo',
		'plugin:import/recommended',
		'plugin:no-use-extend-native/recommended',
		'plugin:node/recommended',
		'plugin:promise/recommended',
		'plugin:unicorn/recommended',
	],
	parserOptions: {
		ecmaVersion: 12,
	},
	plugins: [
		'import',
		'no-use-extend-native',
		'node',
		'promise',
		'unicorn',
	],
	rules: {
		'array-bracket-spacing': [
			'error',
			'always',
			{
				arraysInArrays: false,
				objectsInArrays: false,
			},
		],
		'arrow-parens': 'off',
		'brace-style': [
			'warn',
			'stroustrup',
		],
		'camelcase': 'off',
		'capitalized-comments': 'off',
		'comma-dangle': [
			'warn',
			'always-multiline',
		],
		'complexity': [
			'warn',
			100,
		],
		'computed-property-spacing': 'off',
		'func-names': 'off',
		'indent': 'off',
		'key-spacing': 'off',
		'keyword-spacing': 'warn',
		'max-depth': [
			'warn',
			100,
		],
		'new-cap': [
			'error',
			{
				newIsCap: true,
				capIsNew: false,
			},
		],
		'no-await-in-loop': 'off',
		'no-else-return': 'off',
		'no-lonely-if': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'no-multi-assign': 'off',
		'no-multi-spaces': 'off',
		'no-negated-condition': 'off',
		'no-new': 'off',
		'no-lone-blocks': 'off',
		'no-unused-expressions': [
			'error',
			{
				allowShortCircuit: true,
			},
		],
		'no-unused-vars': 'warn',
		'node/callback-return': 'error',
		'node/global-require': 'error',
		'node/no-missing-require': 'off',
		'node/prefer-global/url': 'error',
		'node/prefer-promises/fs': 'error',
		'object-curly-spacing': 'off',
		'operator-linebreak': [
			'error',
			'before',
		],
		'padding-line-between-statements': 'off',
		'prefer-const': [
			'warn',
			{
				destructuring: 'all',
			},
		],
		'prefer-promise-reject-errors': 'off',
		'promise/param-names': 'off',
		'quote-props': 'off',
		'quotes': [
			'error',
			'single',
			{
				avoidEscape: true,
			},
		],
		'radix': [
			'error',
			'as-needed',
		],
		'space-before-blocks': 'warn',
		'space-before-function-paren': [
			'warn',
			'always',
		],
		'space-infix-ops': 'off',
		'spaced-comment': 'warn',
		'strict': [
			'off',
			'global',
		],
		'yoda': 'off',
		'unicorn/filename-case': 'off',
		'unicorn/no-fn-reference-in-iterator': 'off',
		'unicorn/no-lonely-if': 'off',
		'unicorn/no-null': 'off',
		'unicorn/prefer-spread': 'off',
		'unicorn/prefer-ternary': 'off',
		'unicorn/prefer-type-error': 'off',
		'unicorn/prevent-abbreviations': 'off',
	},
};
