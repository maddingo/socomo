module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 2018,
		'sourceType': 'module'
	},
	'rules': {
		'indent': ['error','tab'],
		'quotes': ['error','single'],
		'semi': ['error','always'],
		'no-console': 'off'
	}
};
