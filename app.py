from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or os.urandom(24)
app.config['UPLOAD_FOLDER'] = '/mnt/nfs'
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024 # 1024 MB max upload size

@app.route('/')
def index():
    return render_template('index.html')


def sanitize_filename(filename):
    """
    Sanitizes a filename by adding a timestamp and ensuring it's a valid and secure name,
    without cutting words in the middle.
    """
    timestamp = datetime.now().strftime("%y%m%d-%H%M%S")
    secure_name = secure_filename(filename)
    
    new_filename = f"{timestamp}-{secure_name}"
    
    # Limit the total filename length to 64 bytes
    while len(new_filename.encode('utf-8')) > 64:
        # If the name is too long, remove the last word (or part of it)
        # and try again. This is a simple way to not cut in the middle of a word.
        if '-' in secure_name:
            # Find the last hyphen and cut the name before it
            secure_name = secure_name.rsplit('-', 1)[0]
        else:
            # If no hyphen, just truncate the name
            secure_name = secure_name[:-5] # remove 5 chars to make sure it will be smaller
        
        new_filename = f"{timestamp}-{secure_name}"

    return new_filename

@app.route('/<string:filename>', methods=['GET', 'PUT'])
def handle_file(filename):
    if request.method == 'PUT':
        sanitized_filename = sanitize_filename(filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], sanitized_filename)
        
        with open(file_path, 'wb') as f:
            f.write(request.data)
        
        return f"File uploaded successfully: {sanitized_filename}\n"
    elif request.method == 'GET':
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(url_for('index'))
    file = request.files['file']
    if file.filename == '':
        return redirect(url_for('index'))
    if file:
        try:
            filename = sanitize_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        except Exception as e:
            pass # No flash messages are displayed, so just pass
        return redirect(url_for('index'))
    
    # This line is technically now unreachable but kept for safety.
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
