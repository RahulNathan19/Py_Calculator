from flask import Flask, render_template, request, jsonify
from calculator import evaluate_expression, get_history, clear_history, CalculatorError
import json
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'calculator-secret-key-change-in-production'
app.config['DEBUG'] = True

@app.route('/')
def index():
    """Serve the main calculator interface"""
    return render_template('calculator.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """Handle calculation requests"""
    try:
        data = request.get_json()

        if not data or 'expression' not in data:
            return jsonify({
                'error': 'No expression provided'
            }), 400

        expression = data['expression'].strip()

        if not expression:
            return jsonify({
                'result': 0,
                'error': None,
                'history': get_history()
            })

        # Evaluate the expression
        result = evaluate_expression(expression)

        # Format result for display
        if isinstance(result, (int, float)):
            # Handle very large numbers
            if abs(result) > 1e10:
                formatted_result = f"{result:.2e}"
            else:
                formatted_result = f"{result}"
        else:
            formatted_result = str(result)

        return jsonify({
            'result': formatted_result,
            'error': None,
            'history': get_history()[-10:]  # Return last 10 items
        })

    except CalculatorError as e:
        return jsonify({
            'result': None,
            'error': str(e),
            'history': get_history()[-10:]
        })

    except Exception as e:
        # Log the error for debugging
        app.logger.error(f"Unexpected error: {str(e)}")

        return jsonify({
            'result': None,
            'error': 'An unexpected error occurred',
            'history': get_history()[-10:]
        }), 500

@app.route('/history', methods=['GET'])
def history():
    """Get calculation history"""
    try:
        return jsonify({
            'history': get_history(),
            'count': len(get_history())
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['DELETE'])
def clear_history_route():
    """Clear calculation history"""
    try:
        clear_history()
        return jsonify({
            'message': 'History cleared successfully',
            'history': []
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)