module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2015, // ES6
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    extends: [
        'standard', // javascript 표준 규칙 검사
        'plugin:vue/essential' // vue 규칙 설정
    ],
    plugins: [
        'vue'
    ],
    rules: {
        'no-new': 0
    }
}