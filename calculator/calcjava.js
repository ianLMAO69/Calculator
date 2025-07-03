const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clear = document.getElementById('clear');
const equals = document.getElementById('equals');

let currentInput = '';
let resultDisplayed = false;

// Handle number, operator, and dot button clicks
buttons.forEach(button => {
  const value = button.getAttribute('data-value');

  if (value !== null) {
    button.addEventListener('click', () => {
      if (resultDisplayed && !isNaN(value)) {
        currentInput = '';
        resultDisplayed = false;
      }

      const lastChar = currentInput.slice(-1);
      if (['+', '-', '*', '/'].includes(lastChar) &&
          ['+', '-', '*', '/'].includes(value)) {
        currentInput = currentInput.slice(0, -1);
      }

      currentInput += value;
      display.innerText = currentInput;
    });
  }
});

// Clear the input
clear.addEventListener('click', () => {
  currentInput = '';
  display.innerText = '0';
  resultDisplayed = false;
});

// Evaluate the expression safely
equals.addEventListener('click', () => {
  try {
    if (currentInput.trim() === '') {
      display.innerText = '0';
      return;
    }

    const result = calculate(currentInput);
    display.innerText = result;
    currentInput = result.toString();
    resultDisplayed = true;
  } catch (error) {
    display.innerText = 'Error';
    currentInput = '';
  }
});

// Simple safe expression evaluator (supports + - * /)
function calculate(expr) {
  const tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);
  if (!tokens) throw new Error('Invalid expression');

  const numbers = [];
  const operators = [];

  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  const applyOperator = () => {
    const b = numbers.pop();
    const a = numbers.pop();
    const op = operators.pop();
    if (op === '+') numbers.push(a + b);
    if (op === '-') numbers.push(a - b);
    if (op === '*') numbers.push(a * b);
    if (op === '/') numbers.push(a / b);
  };

  tokens.forEach(token => {
    if (!isNaN(token)) {
      numbers.push(parseFloat(token));
    } else if (['+', '-', '*', '/'].includes(token)) {
      while (
        operators.length &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        applyOperator();
      }
      operators.push(token);
    }
  });

  while (operators.length) {
    applyOperator();
  }

  return numbers[0];
}
