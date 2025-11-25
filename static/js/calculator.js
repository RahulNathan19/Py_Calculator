class Calculator {
    constructor() {
        this.currentExpression = '';
        this.currentResult = '0';
        this.history = [];
        this.mode = 'basic';
        this.historyVisible = true;
        this.parenthesisOpen = 0;

        this.initializeElements();
        this.bindEvents();
        this.loadHistory();
        this.updateDisplay();
    }

    initializeElements() {
        // Display elements
        this.display = document.getElementById('display');
        this.expression = document.getElementById('expression');
        this.error = document.getElementById('error');
        this.textInput = document.getElementById('text-input');
        this.calculateBtn = document.getElementById('calculate-btn');

        // Mode buttons
        this.basicModeBtn = document.getElementById('basic-mode');
        this.scientificModeBtn = document.getElementById('scientific-mode');
        this.programmingModeBtn = document.getElementById('programming-mode');

        // Button grids
        this.basicButtons = document.getElementById('basic-buttons');
        this.scientificButtons = document.getElementById('scientific-buttons');
        this.programmingButtons = document.getElementById('programming-buttons');

        // History elements
        this.historyPanel = document.getElementById('history-panel');
        this.historyToggle = document.getElementById('toggle-history');
        this.historyArrow = document.getElementById('history-arrow');
        this.historyClear = document.getElementById('clear-history');
        this.historyContent = document.getElementById('history-content');
        this.historyEmpty = document.getElementById('history-empty');
        this.historyList = document.getElementById('history-list');

        // Loading
        this.loading = document.getElementById('loading');
    }

    bindEvents() {
        // Button click events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('button')) {
                this.handleButtonClick(e.target);
            }
        });

        // Text input events
        this.textInput.addEventListener('input', (e) => {
            this.currentExpression = e.target.value;
            this.updateDisplay();
        });

        this.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculate();
            }
        });

        // Calculate button
        this.calculateBtn.addEventListener('click', () => {
            this.calculate();
        });

        // Mode switching
        this.basicModeBtn.addEventListener('click', () => this.switchMode('basic'));
        this.scientificModeBtn.addEventListener('click', () => this.switchMode('scientific'));
        this.programmingModeBtn.addEventListener('click', () => this.switchMode('programming'));

        // History controls
        this.historyToggle.addEventListener('click', () => this.toggleHistory());
        this.historyClear.addEventListener('click', () => this.clearHistory());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Prevent zoom on double tap for mobile
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
    }

    handleButtonClick(button) {
        // Clear any existing errors
        this.hideError();

        // Handle different button types
        if (button.dataset.number !== undefined) {
            this.appendNumber(button.dataset.number);
        } else if (button.dataset.operator !== undefined) {
            this.appendOperator(button.dataset.operator);
        } else if (button.dataset.function !== undefined) {
            this.appendFunction(button.dataset.function);
        } else if (button.dataset.action !== undefined) {
            this.handleAction(button.dataset.action);
        }

        this.updateDisplay();
        this.updateTextInput();
    }

    appendNumber(number) {
        if (this.currentExpression === '0') {
            this.currentExpression = number;
        } else {
            this.currentExpression += number;
        }
    }

    appendOperator(operator) {
        // Don't allow operator at the start
        if (this.currentExpression === '' || this.currentExpression === '0') {
            return;
        }

        // Don't allow consecutive operators
        const lastChar = this.currentExpression.slice(-1);
        if (['+', '-', '*', '/', '%', '^', '&', '|', '<<', '>>'].includes(lastChar)) {
            // Replace the last operator
            this.currentExpression = this.currentExpression.slice(0, -1) + operator;
        } else {
            this.currentExpression += operator;
        }
    }

    appendFunction(func) {
        if (func === 'pi') {
            this.currentExpression += 'pi';
        } else if (func === 'exp') {
            this.currentExpression += 'e^';
        } else if (func === 'sqrt') {
            this.currentExpression += 'sqrt(';
            this.parenthesisOpen++;
        } else if (func === 'abs') {
            this.currentExpression += 'abs(';
            this.parenthesisOpen++;
        } else if (func === 'floor') {
            this.currentExpression += 'floor(';
            this.parenthesisOpen++;
        } else if (func === 'ceil') {
            this.currentExpression += 'ceil(';
            this.parenthesisOpen++;
        } else if (func === 'hex' && this.mode === 'programming') {
            // Handle hex letters (A-F)
            const letter = func.toUpperCase();
            if (this.currentExpression === '0') {
                this.currentExpression = letter;
            } else {
                this.currentExpression += letter;
            }
        } else {
            this.currentExpression += func + '(';
            this.parenthesisOpen++;
        }
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'parenthesis':
                this.addParenthesis();
                break;
            case 'decimal':
                this.addDecimal();
                break;
            case 'negate':
                this.negate();
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }

    clear() {
        this.currentExpression = '';
        this.currentResult = '0';
        this.hideError();
        this.updateDisplay();
        this.updateTextInput();
    }

    backspace() {
        if (this.currentExpression.length > 0) {
            this.currentExpression = this.currentExpression.slice(0, -1);
            if (this.currentExpression === '') {
                this.currentResult = '0';
            }
        }
    }

    addParenthesis() {
        if (this.parenthesisOpen > 0) {
            this.currentExpression += ')';
            this.parenthesisOpen--;
        } else {
            this.currentExpression += '(';
            this.parenthesisOpen++;
        }
    }

    addDecimal() {
        // Find the last number to see if it already has a decimal
        const parts = this.currentExpression.split(/[\+\-\*\/\%^\(\)]/);
        const lastPart = parts[parts.length - 1];

        if (!lastPart.includes('.')) {
            if (lastPart === '' || this.currentExpression === '') {
                this.currentExpression += '0.';
            } else {
                this.currentExpression += '.';
            }
        }
    }

    negate() {
        if (this.currentExpression === '' || this.currentExpression === '0') {
            this.currentExpression = '-';
        } else if (this.currentExpression === '-') {
            this.currentExpression = '';
        } else {
            // Add negation at the beginning
            this.currentExpression = '-(' + this.currentExpression + ')';
        }
    }

    async calculate() {
        if (!this.currentExpression.trim()) {
            this.showError('Please enter an expression');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    expression: this.currentExpression
                })
            });

            const data = await response.json();

            if (data.error) {
                this.showError(data.error);
            } else {
                this.currentResult = data.result;

                // Add to history
                this.addToHistory(this.currentExpression, data.result);

                // Update expression for the calculation
                this.expression.textContent = this.currentExpression + ' =';

                // Clear current expression for next calculation
                this.currentExpression = '';

                // Reset parenthesis count
                this.parenthesisOpen = 0;
            }

            this.updateDisplay();
            this.updateTextInput();

        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    switchMode(newMode) {
        this.mode = newMode;

        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Hide all button grids
        this.basicButtons.style.display = 'none';
        this.scientificButtons.style.display = 'none';
        this.programmingButtons.style.display = 'none';

        // Show appropriate buttons and activate mode button
        switch (newMode) {
            case 'basic':
                this.basicButtons.style.display = 'grid';
                this.basicModeBtn.classList.add('active');
                break;
            case 'scientific':
                this.scientificButtons.style.display = 'grid';
                this.scientificModeBtn.classList.add('active');
                break;
            case 'programming':
                this.programmingButtons.style.display = 'grid';
                this.programmingModeBtn.classList.add('active');
                break;
        }
    }

    handleKeyboard(event) {
        // Ignore if focus is on text input
        if (document.activeElement === this.textInput) {
            return;
        }

        const key = event.key;

        // Prevent default for calculator keys
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '(', ')', '=', 'Enter', 'Escape', 'Backspace'].includes(key)) {
            event.preventDefault();
        }

        // Handle different keys
        if (key >= '0' && key <= '9') {
            this.appendNumber(key);
        } else if (['+', '-', '*', '/', '%', '^'].includes(key)) {
            this.appendOperator(key);
        } else if (key === '.') {
            this.addDecimal();
        } else if (key === '(' || key === ')') {
            this.addParenthesis();
        } else if (key === '=' || key === 'Enter') {
            this.calculate();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === 'Backspace') {
            this.backspace();
        }

        this.updateDisplay();
        this.updateTextInput();
    }

    updateDisplay() {
        this.display.textContent = this.currentResult;
        this.expression.textContent = this.currentExpression;
    }

    updateTextInput() {
        this.textInput.value = this.currentExpression;
    }

    showError(message) {
        this.error.textContent = message;
        this.error.style.display = 'block';
    }

    hideError() {
        this.error.style.display = 'none';
        this.error.textContent = '';
    }

    showLoading() {
        this.loading.style.display = 'flex';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    // History methods
    toggleHistory() {
        this.historyVisible = !this.historyVisible;

        if (this.historyVisible) {
            this.historyContent.style.display = 'block';
            this.historyArrow.textContent = '▼';
        } else {
            this.historyContent.style.display = 'none';
            this.historyArrow.textContent = '▶';
        }
    }

    async clearHistory() {
        try {
            const response = await fetch('/history', {
                method: 'DELETE'
            });

            if (response.ok) {
                this.history = [];
                this.updateHistoryDisplay();
                localStorage.removeItem('calculatorHistory');
            }
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    }

    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: result,
            timestamp: new Date().toISOString()
        };

        this.history.unshift(historyItem);

        // Keep only last 50 items
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }

        this.updateHistoryDisplay();
        this.saveHistory();
    }

    updateHistoryDisplay() {
        if (this.history.length === 0) {
            this.historyEmpty.style.display = 'block';
            this.historyList.style.display = 'none';
        } else {
            this.historyEmpty.style.display = 'none';
            this.historyList.style.display = 'block';

            // Clear existing items
            this.historyList.innerHTML = '';

            // Add history items
            this.history.forEach((item, index) => {
                const historyElement = document.createElement('div');
                historyElement.className = 'history-item';
                historyElement.innerHTML = `
                    <div class="history-expression">${item.expression}</div>
                    <div class="history-result">= ${item.result}</div>
                `;

                historyElement.addEventListener('click', () => {
                    this.currentExpression = item.expression;
                    this.currentResult = item.result;
                    this.updateDisplay();
                    this.updateTextInput();
                });

                this.historyList.appendChild(historyElement);
            });
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('calculatorHistory');
            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
                this.updateHistoryDisplay();
            }
        } catch (error) {
            console.error('Error loading history:', error);
            this.history = [];
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
});

// Add service worker registration for PWA support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}