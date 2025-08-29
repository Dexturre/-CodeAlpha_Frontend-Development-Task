let currentInput = '';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;

const display = document.getElementById('display');

function appendToDisplay(value) {
    if (shouldResetScreen) {
        display.value = '';
        shouldResetScreen = false;
    }
    
    // Prevent multiple decimal points
    if (value === '.' && display.value.includes('.')) {
        return;
    }
    
    // Prevent multiple operators in a row
    if (['+', '-', '*', '/'].includes(value)) {
        if (['+', '-', '*', '/'].includes(display.value.slice(-1))) {
            display.value = display.value.slice(0, -1) + value;
            return;
        }
    }
    
    display.value += value;
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    previousInput = '';
    operation = null;
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    if (!display.value) return;
    
    try {
        // Replace × with * for calculation
        let expression = display.value.replace(/×/g, '*');
        
        // Use Function constructor for safe evaluation
        const result = Function('"use strict"; return (' + expression + ')')();
        
        // Handle division by zero
        if (!isFinite(result)) {
            display.value = 'Error';
            return;
        }
        
        display.value = parseFloat(result.toFixed(10)).toString();
        shouldResetScreen = true;
    } catch (error) {
        display.value = 'Error';
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    }
    // Decimal point
    else if (key === '.') {
        appendToDisplay('.');
    }
    // Operators
    else if (key === '+') {
        appendToDisplay('+');
    }
    else if (key === '-') {
        appendToDisplay('-');
    }
    else if (key === '*') {
        appendToDisplay('×');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendToDisplay('/');
    }
    // Enter or = for calculation
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Escape for clear
    else if (key === 'Escape') {
        clearDisplay();
    }
    // Backspace for delete
    else if (key === 'Backspace') {
        deleteLast();
    }
});

// Prevent default behavior for calculator keys
document.addEventListener('keydown', function(event) {
    const keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                 '.', '+', '-', '*', '/', 'Enter', '=', 'Escape', 'Backspace'];
    
    if (keys.includes(event.key)) {
        event.preventDefault();
    }
});

// Initialize calculator
clearDisplay();
