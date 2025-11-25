import re
import math
import operator
from typing import Union, List, Tuple

class CalculatorError(Exception):
    """Custom exception for calculator errors"""
    pass

class Calculator:
    def __init__(self):
        self.history = []
        self.memory = 0

        # Define mathematical constants
        self.constants = {
            'pi': math.pi,
            'e': math.e
        }

        # Define basic operations
        self.operators = {
            '+': operator.add,
            '-': operator.sub,
            '*': operator.mul,
            '/': operator.truediv,
            '%': operator.mod,
            '^': operator.pow,
            '**': operator.pow
        }

        # Define scientific functions
        self.scientific_functions = {
            'sin': math.sin,
            'cos': math.cos,
            'tan': math.tan,
            'log': math.log10,  # base 10
            'ln': math.log,     # base e
            'sqrt': math.sqrt,
            'abs': abs,
            'floor': math.floor,
            'ceil': math.ceil,
            'round': round
        }

        # Define programming functions
        self.programming_functions = {
            'bin': lambda x: bin(int(x))[2:],
            'hex': lambda x: hex(int(x))[2:],
            'oct': lambda x: oct(int(x))[2:],
            'int': int,
            'float': float
        }

        # Define bitwise operators
        self.bitwise_operators = {
            '&': operator.and_,
            '|': operator.or_,
            '^': operator.xor,
            '<<': operator.lshift,
            '>>': operator.rshift
        }

    def evaluate_expression(self, expression: str) -> Union[float, int, str]:
        """
        Safely evaluate a mathematical expression
        """
        try:
            # Clean and preprocess the expression
            expression = self._preprocess_expression(expression)

            if not expression.strip():
                return 0

            # Tokenize the expression
            tokens = self._tokenize(expression)

            # Validate tokens
            self._validate_tokens(tokens)

            # Convert to postfix notation (shunting-yard algorithm)
            postfix = self._shunting_yard(tokens)

            # Evaluate postfix expression
            result = self._evaluate_postfix(postfix)

            # Add to history
            self.history.append((expression, result))

            return result

        except CalculatorError:
            raise
        except Exception as e:
            raise CalculatorError(f"Invalid expression: {str(e)}")

    def _preprocess_expression(self, expression: str) -> str:
        """Clean and preprocess the input expression"""
        # Remove whitespace
        expression = expression.strip()

        # Replace constants
        for const, value in self.constants.items():
            expression = re.sub(r'\b' + const + r'\b', str(value), expression, flags=re.IGNORECASE)

        # Handle implicit multiplication (e.g., "2pi" -> "2*pi")
        expression = re.sub(r'(\d)([a-zA-Z\(])', r'\1*\2', expression)
        expression = re.sub(r'(\))(\d)', r'\1*\2', expression)
        expression = re.sub(r'(\))(\()', r'\1*\2', expression)

        return expression

    def _tokenize(self, expression: str) -> List[str]:
        """Tokenize the expression into numbers, operators, and functions"""
        # Pattern to match numbers, operators, functions, parentheses
        pattern = r'''
            (?P<number>\d+\.?\d*|\.\d+)|
            (?P<operator>[+\-*/%^&|^~<>]|<<|>>|\*\*)|
            (?P<function>[a-zA-Z_][a-zA-Z0-9_]*)|
            (?P<parenthesis>[()])|
            (?P<whitespace>\s+)
        '''

        tokens = []
        for match in re.finditer(pattern, expression, re.VERBOSE):
            if match.group('whitespace'):
                continue
            elif match.group('number'):
                tokens.append(match.group('number'))
            elif match.group('operator'):
                tokens.append(match.group('operator'))
            elif match.group('function'):
                tokens.append(match.group('function'))
            elif match.group('parenthesis'):
                tokens.append(match.group('parenthesis'))

        return tokens

    def _validate_tokens(self, tokens: List[str]) -> None:
        """Validate all tokens in the expression"""
        # Check for blacklisted patterns
        blacklist = ['import', 'exec', 'eval', 'open', 'file', '__', 'class', 'def', 'lambda']
        token_str = ' '.join(tokens).lower()

        for bad in blacklist:
            if bad in token_str:
                raise CalculatorError("Invalid expression: contains prohibited content")

        # Validate functions and operators
        for token in tokens:
            if token.isalpha() and token not in self.scientific_functions and token not in self.programming_functions and token not in self.constants:
                # Check if it might be a variable or unknown function
                if len(token) > 1:  # Single letters might be variables
                    raise CalculatorError(f"Unknown function: {token}")

    def _shunting_yard(self, tokens: List[str]) -> List[str]:
        """Convert infix tokens to postfix notation using shunting-yard algorithm"""
        output = []
        operators = []

        # Define operator precedence
        precedence = {
            '^': 4, '**': 4,
            '*': 3, '/': 3, '%': 3,
            '+': 2, '-': 2,
            '&': 1,
            '|': 1, '^': 0,  # Note: ^ is also XOR in bitwise context
            '<<': 0, '>>': 0
        }

        # Define associativity
        left_associative = {
            '^': False, '**': False,  # Right associative
            '*': True, '/': True, '%': True,
            '+': True, '-': True,
            '&': True, '|': True,
            '<<': True, '>>': True
        }

        i = 0
        while i < len(tokens):
            token = tokens[i]

            # Handle numbers
            if re.match(r'\d+\.?\d*', token):
                output.append(token)

            # Handle functions
            elif token in self.scientific_functions or token in self.programming_functions:
                operators.append(token)

            # Handle parentheses
            elif token == '(':
                operators.append(token)
            elif token == ')':
                while operators and operators[-1] != '(':
                    output.append(operators.pop())
                if not operators:
                    raise CalculatorError("Mismatched parentheses")
                operators.pop()  # Remove '('

                # If there's a function before the parentheses, add it to output
                if operators and (operators[-1] in self.scientific_functions or operators[-1] in self.programming_functions):
                    output.append(operators.pop())

            # Handle operators
            elif token in self.operators or token in self.bitwise_operators:
                while (operators and operators[-1] != '(' and
                       ((left_associative.get(token, True) and
                         precedence.get(token, 0) <= precedence.get(operators[-1], 0)) or
                        (not left_associative.get(token, True) and
                         precedence.get(token, 0) < precedence.get(operators[-1], 0)))):
                    output.append(operators.pop())
                operators.append(token)

            i += 1

        # Add remaining operators to output
        while operators:
            if operators[-1] in ['(', ')']:
                raise CalculatorError("Mismatched parentheses")
            output.append(operators.pop())

        return output

    def _evaluate_postfix(self, postfix: List[str]) -> Union[float, int, str]:
        """Evaluate postfix expression"""
        stack = []

        for token in postfix:
            if re.match(r'\d+\.?\d*', token):
                # Handle numbers
                if '.' in token:
                    stack.append(float(token))
                else:
                    stack.append(int(token))

            elif token in self.scientific_functions:
                # Handle scientific functions
                if len(stack) < 1:
                    raise CalculatorError(f"Insufficient arguments for {token}")

                arg = stack.pop()
                if token in ['sin', 'cos', 'tan']:
                    # Convert degrees to radians for trigonometric functions
                    arg = math.radians(arg)

                try:
                    result = self.scientific_functions[token](arg)
                    stack.append(result)
                except (ValueError, OverflowError) as e:
                    raise CalculatorError(f"Error in {token}({arg}): {str(e)}")

            elif token in self.programming_functions:
                # Handle programming functions
                if len(stack) < 1:
                    raise CalculatorError(f"Insufficient arguments for {token}")

                arg = stack.pop()
                try:
                    result = self.programming_functions[token](arg)
                    if token in ['bin', 'hex', 'oct']:
                        result = str(result)
                    stack.append(result)
                except (ValueError, OverflowError) as e:
                    raise CalculatorError(f"Error in {token}({arg}): {str(e)}")

            elif token in self.operators:
                # Handle basic arithmetic operators
                if len(stack) < 2:
                    raise CalculatorError(f"Insufficient arguments for {token}")

                b = stack.pop()
                a = stack.pop()

                if token == '/' and b == 0:
                    raise CalculatorError("Division by zero")

                try:
                    result = self.operators[token](a, b)
                    stack.append(result)
                except (ValueError, OverflowError, ZeroDivisionError) as e:
                    raise CalculatorError(f"Error in {a} {token} {b}: {str(e)}")

            elif token in self.bitwise_operators:
                # Handle bitwise operators
                if len(stack) < 2:
                    raise CalculatorError(f"Insufficient arguments for {token}")

                b = stack.pop()
                a = stack.pop()

                try:
                    # Convert to integers for bitwise operations
                    a_int = int(a)
                    b_int = int(b)
                    result = self.bitwise_operators[token](a_int, b_int)
                    stack.append(result)
                except (ValueError, TypeError) as e:
                    raise CalculatorError(f"Error in {a} {token} {b}: {str(e)}")

        if len(stack) != 1:
            raise CalculatorError("Invalid expression")

        result = stack[0]

        # Clean up the result (remove trailing .0 for integers)
        if isinstance(result, float) and result.is_integer():
            result = int(result)

        return result

    def clear_history(self):
        """Clear calculation history"""
        self.history = []

    def get_history(self) -> List[Tuple[str, Union[float, int, str]]]:
        """Get calculation history"""
        return self.history.copy()

    def set_memory(self, value: Union[float, int]):
        """Set memory value"""
        self.memory = value

    def get_memory(self) -> Union[float, int]:
        """Get memory value"""
        return self.memory

    def clear_memory(self):
        """Clear memory"""
        self.memory = 0

# Global calculator instance
calculator = Calculator()

def evaluate_expression(expression: str) -> Union[float, int, str]:
    """Convenience function to evaluate an expression"""
    return calculator.evaluate_expression(expression)

def get_history() -> List[Tuple[str, Union[float, int, str]]]:
    """Get calculation history"""
    return calculator.get_history()

def clear_history():
    """Clear calculation history"""
    calculator.clear_history()