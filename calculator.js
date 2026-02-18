let currentInput = '';
let operation = '';

function appendNumber(number) {
    currentInput += number;
    document.getElementById('result').value = currentInput;
}

function setOperation(op) {
    if (currentInput === '') return;
    // If input ends with space + operator, replace it; otherwise append
    if (/\s[+\-\*\/]\s$/.test(currentInput)) {
        currentInput = currentInput.replace(/\s[+\-\*\/]\s$/, ' ' + op + ' ');
    } else {
        currentInput += ' ' + op + ' ';
    }
    operation = op;
    document.getElementById('result').value = currentInput;
}

function calculate() {
    if (!currentInput.trim()) return;
    try {
        // Parse and evaluate expression respecting order of operations
        const result = evaluateExpression(currentInput);
        document.getElementById('result').value = result;
        currentInput = result.toString();
        operation = '';
    } catch (e) {
        document.getElementById('result').value = 'Error';
        currentInput = '';
        operation = '';
    }
}

function evaluateExpression(expr) {
    // Remove leading/trailing whitespace and split by operators
    expr = expr.trim();
    // First pass: handle * and /
    let tokens = expr.split(/\s+/);
    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === '*') {
            const result = parseFloat(tokens[i - 1]) * parseFloat(tokens[i + 1]);
            tokens.splice(i - 1, 3, result.toString());
            i -= 2;
        } else if (tokens[i] === '/') {
            const divisor = parseFloat(tokens[i + 1]);
            if (divisor === 0) throw new Error('Division by zero');
            const result = parseFloat(tokens[i - 1]) / divisor;
            tokens.splice(i - 1, 3, result.toString());
            i -= 2;
        }
    }
    // Second pass: handle + and -
    let result = parseFloat(tokens[0]);
    for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const nextNum = parseFloat(tokens[i + 1]);
        if (op === '+') result += nextNum;
        else if (op === '-') result -= nextNum;
    }
    return result;
}

function clearResult() {
    currentInput = '';
    operation = '';
    document.getElementById('result').value = '';
}

function backspace() {
    if (!currentInput) return;
    currentInput = currentInput.slice(0, -1);
    // trim trailing whitespace and operators
    currentInput = currentInput.replace(/\s+$/, '').replace(/\s[+\-\*\/]\s*$/, '');
    // detect last operation (if any)
    const opMatches = currentInput.match(/\s([+\-\*\/])\s/g);
    operation = opMatches ? opMatches[opMatches.length - 1].trim().split(/\s/)[1] : '';
    document.getElementById('result').value = currentInput;
}

// Keyboard support: digits, dot, operators, Enter(=), Backspace, Escape or 'c' to clear
document.addEventListener('keydown', function (e) {
    const k = e.key;
    if ((k >= '0' && k <= '9') || k === '.') {
        e.preventDefault();
        appendNumber(k);
        return;
    }
    if (k === '+' || k === '-' || k === '*' || k === '/') {
        e.preventDefault();
        setOperation(k);
        return;
    }
    if (k === 'Enter' || k === '=') {
        e.preventDefault();
        calculate();
        return;
    }
    if (k === 'Backspace') {
        e.preventDefault();
        backspace();
        return;
    }
    if (k === 'Escape' || k.toLowerCase() === 'c') {
        e.preventDefault();
        clearResult();
        return;
    }
});
