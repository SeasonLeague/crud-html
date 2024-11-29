import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Connection
client = MongoClient("mongodb+srv://mongotesting:rigorigo123@cluster0.xmy5g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["todo_db"]
collection = db["tasks"]

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = list(collection.find())
    # Convert ObjectId to string
    for task in tasks:
        task['_id'] = str(task['_id'])
    return jsonify(tasks), 200

@app.route('/api/tasks', methods=['POST'])
def add_task():
    task_data = request.json
    if not task_data or 'task' not in task_data:
        return jsonify({"error": "Task text is required"}), 400
    
    # Generate a new UUID
    task_id = str(uuid.uuid4())
    
    # Insert task with UUID
    task_to_insert = {
        "_id": task_id,
        "task": task_data['task']
    }
    
    result = collection.insert_one(task_to_insert)
    return jsonify({
        "message": "Task added successfully", 
        "_id": task_id
    }), 201

@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    try:
        task = collection.find_one({"_id": task_id})
        if task:
            task['_id'] = str(task['_id'])
            return jsonify(task), 200
        return jsonify({"error": "Task not found"}), 404
    except:
        return jsonify({"error": "Invalid task ID"}), 400

@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task_data = request.json
        if not task_data or 'task' not in task_data:
            return jsonify({"error": "Task text is required"}), 400
        
        result = collection.update_one(
            {"_id": task_id},
            {"$set": {"task": task_data['task']}}
        )
        
        if result.modified_count:
            return jsonify({"message": "Task updated successfully"}), 200
        return jsonify({"error": "Task not found"}), 404
    except:
        return jsonify({"error": "Invalid task ID"}), 400

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        result = collection.delete_one({"_id": task_id})
        if result.deleted_count:
            return jsonify({"message": "Task deleted successfully"}), 200
        return jsonify({"error": "Task not found"}), 404
    except:
        return jsonify({"error": "Invalid task ID"}), 400

if __name__ == '__main__':
    app.run(debug=True)
