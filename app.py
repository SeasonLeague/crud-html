from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import uuid

app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient("mongodb+srv://mongotesting:rigorigo123@cluster0.xmy5g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["todo_db"]
collection = db["tasks"]

# Create (POST)
@app.route('/create_task', methods=['POST'])
def create_task():
    task_data = request.json
    task_data['_id'] = str(uuid.uuid4())
    collection.insert_one(task_data)
    return jsonify(task_data), 201

# Read (GET)
@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    tasks = list(collection.find())
    for task in tasks:
        task['_id'] = str(task['_id'])
    return jsonify(tasks), 200

# Update (PUT)
@app.route('/update_task/<task_id>', methods=['PUT'])
def update_task(task_id):
    update_data = request.json
    collection.update_one(
        {"_id": task_id}, 
        {"$set": update_data}
    )
    return jsonify({"message": "Task updated"}), 200

# Delete (DELETE)
@app.route('/delete_task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    collection.delete_one({"_id": task_id})
    return jsonify({"message": "Task deleted"}), 200

# Serve the index.html
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
