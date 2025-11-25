# Python Web Calculator

A fast, simple, and easy-to-use web-based calculator built with Flask. Features both visual button interface and text input support, handling basic arithmetic, scientific functions, and programming operations.

## Features

### 🧮 **Calculation Modes**
- **Basic Mode**: Standard arithmetic operations (+, -, *, /, %, power)
- **Scientific Mode**: Trigonometric functions, logarithms, square roots, and more
- **Programming Mode**: Binary/Hex/Octal conversions and bitwise operations

### 💻 **Input Methods**
- **Visual Interface**: Large, touch-friendly buttons
- **Text Input**: Type expressions directly (e.g., `2+3*4`)
- **Keyboard Support**: Full keyboard shortcuts for efficient use
- **Hybrid Approach**: Seamlessly switch between button and text input

### 📱 **Responsive Design**
- Mobile-optimized with touch gestures
- Tablet and desktop friendly layouts
- Adaptive button sizing for different screens
- High contrast and dark mode support

### 🧠 **Smart Features**
- Real-time expression validation
- Calculation history with local storage
- Error handling with helpful messages
- Parentheses balancing
- Memory functions

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Setup Instructions

1. **Clone or navigate to the Py_Calculator directory:**
   ```bash
   cd Py_Calculator
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**

   **On Windows:**
   ```bash
   venv\Scripts\activate
   ```

   **On macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

4. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application:**
   ```bash
   python app.py
   ```

6. **Open your web browser and navigate to:**
   ```
   http://localhost:5000
   ```

## Usage

### Basic Operations
- **Numbers**: Click number buttons or use keyboard (0-9)
- **Operations**: Use +, -, *, /, % buttons or keyboard
- **Equals**: Press = button or Enter key
- **Clear**: Press C button or Escape key
- **Backspace**: Press ⌫ button or Backspace key

### Scientific Functions
- **Trigonometric**: sin(), cos(), tan() (angles in degrees)
- **Logarithmic**: log() (base 10), ln() (base e)
- **Power**: ^ operator or x^y button
- **Roots**: sqrt() for square root
- **Constants**: π (pi), e (Euler's number)
- **Other**: abs() (absolute value), floor(), ceil(), round()

### Programming Functions
- **Base Conversion**: bin(), hex(), oct() - convert numbers to different bases
- **Bitwise Operations**: AND (&), OR (|), XOR (^), NOT (~)
- **Bit Shifts**: Left shift (<<), right shift (>>)
- **Integer Operations**: INT() converts to integer

### Expression Examples

**Basic Arithmetic:**
```
2 + 3 * 4        # Result: 14
(5 + 3) * 2      # Result: 16
10 / 2 + 3       # Result: 8
2 ^ 3            # Result: 8 (power)
```

**Scientific Calculations:**
```
sin(30)          # Result: 0.5
cos(60)          # Result: 0.5
sqrt(16)         # Result: 4
log(100)         # Result: 2
pi * 2^2         # Result: 12.566...
```

**Programming Operations:**
```
bin(10)          # Result: "1010"
hex(255)         # Result: "ff"
oct(8)           # Result: "10"
5 & 3            # Result: 1 (bitwise AND)
4 << 2           # Result: 16 (left shift)
```

### Keyboard Shortcuts

| Key | Function |
|-----|----------|
| 0-9 | Numbers |
| + - * / | Basic operations |
| ( ) | Parentheses |
| ^ | Power operation |
| . | Decimal point |
| Enter | Calculate result |
| Escape | Clear display |
| Backspace | Delete last character |

## Project Structure

```
Py_Calculator/
├── app.py                    # Main Flask application
├── calculator.py             # Core calculation engine
├── requirements.txt          # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css         # Calculator styling
│   └── js/
│       └── calculator.js     # Frontend functionality
├── templates/
│   └── calculator.html       # Main calculator interface
└── README.md                # This file
```

## Technical Details

### Safety Features
- **No eval() usage**: Safe expression parsing with custom tokenizer
- **Input validation**: Comprehensive sanitization and validation
- **Error handling**: Graceful error recovery with user-friendly messages
- **Rate limiting**: Built-in protection against excessive requests

### Performance
- **Fast calculations**: Optimized expression evaluation
- **Responsive design**: Minimal DOM manipulation
- **Local storage**: Persistent calculation history
- **Efficient caching**: Smart result formatting

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

### Running in Development Mode
The application runs in debug mode by default, providing:
- Auto-reload on file changes
- Detailed error pages
- Console logging

### Adding New Features
To add new mathematical functions:

1. **Add to `calculator.py`:**
   - Update the appropriate function dictionary
   - Add validation rules if needed

2. **Update frontend (optional):**
   - Add buttons to `calculator.html`
   - Update CSS styling in `style.css`
   - Handle new functions in `calculator.js`

### Customization
- **Styling**: Modify `static/css/style.css`
- **Layout**: Update `templates/calculator.html`
- **Functionality**: Extend `calculator.py` and `static/js/calculator.js`

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill any existing Python processes on port 5000
lsof -ti:5000 | xargs kill
# Or run on a different port
python app.py  # Change port in app.py if needed
```

**Dependencies not found:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Calculator not loading:**
- Check that Flask is running without errors
- Verify browser console for JavaScript errors
- Ensure all files are in the correct directories

### Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure you're using Python 3.7+
4. Check that the virtual environment is activated

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.