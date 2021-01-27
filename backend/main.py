from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS, cross_origin

# App setup
app = Flask(__name__)

CORS(app)

app.secret_key = 'azsffaopjadmaaozd'
app.config['SESSION_TYPE'] = 'filesystem'
sess = Session()
sess.init_app(app)

# Routes
@app.route('/', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_stack():
    """
    retrieves the stack in user session
    """
    stack = session.get('stack', [])
    return jsonify(stack)
    

@app.route('/append', methods=['POST'])
@cross_origin(supports_credentials=True)
def append():
    """
    append the value as a float to the stack
    """    
    # try to convert value to float
    try:
        value = float(request.get_json().get('value'))
    except ValueError:
        return { "error": "You must pass a number"}, 400
    
    stack = session.get('stack', [])
    stack.append(value)
    session['stack'] = stack
    session.modified = True
    return jsonify(stack)


@app.route('/<operation>', methods=['GET'])
@cross_origin(supports_credentials=True)
def do_operation(operation):
    """
    Do operations over last two items of the stack
    operations : clean, add, substract, multiply, divide
    """
    # Check parameter operation
    if operation == 'clean':
        # clear stack and return empty list
        session['stack'] = []
        session.modified = True
        return jsonify([])

    if operation not in ['add', 'substract', 'multiply', 'divide']:
        return {"error": "Bad operation"}, 400
    
    stack = session.get('stack', [])
    # check stack length
    if len(stack) < 2:
        return {"error": "Stack must be longe than 1 to add"}, 400
    if operation == 'divide' and stack[-1] == 0:
        return {"error": "you cannot divide by 0"}, 400
    
    # pop last item
    last = stack.pop()
    # update last item
    if operation == "add":
        stack[-1] += last
    elif operation == "substract":
        stack[-1] -= last
    elif operation == "multiply":
        stack[-1] *= last
    elif operation == "divide":
        stack[-1] /= last

    # update stack
    session['stack'] = stack
    session.modified = True
    return jsonify(stack)


if __name__ == '__main__':
    app.run()

