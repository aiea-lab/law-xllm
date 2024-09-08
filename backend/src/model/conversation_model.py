from bson.errors import InvalidId
from bson.json_util import dumps
from bson.objectid import ObjectId
from src import mongo

CONV_COLLECTION = mongo.db.conversations


def is_valid_objectid(object_id) -> bool:
    try:
        ObjectId(object_id)
        return True
    except InvalidId:
        return False

def get_conversation(conv_id):
    try:
        print(conv_id)
        conversation = CONV_COLLECTION.find_one(ObjectId(conv_id))
        print(conversation["_id"])
        print(conversation)
        try:
            return conversation_to_json(conversation)
        except:
            print("HERE")
            return False
    except:
        return False
    

def add_conversation(user_id, text, time):
    conversation_id = CONV_COLLECTION.insert_one(
        {"user_id": ObjectId(user_id), "text": text, "time": time}
    ).inserted_id
    return conversation_id


def get_all_conversations():
    conversations = CONV_COLLECTION.find()
    return [conversation_to_json(conversation) for conversation in conversations]


def conversation_to_json(conversation):
    conversation["_id"] = str(conversation["_id"])
    return conversation


def update_conversation_by_id(conv_id, updates):
    try:
        result = CONV_COLLECTION.update_one(
            {"_id": ObjectId(conv_id)}, {"$set": updates}
        )
        return result.matched_count > 0
    except InvalidId:
        return False


def delete_conversation_by_id(conv_id):
    try:
        result = CONV_COLLECTION.delete_one({"_id": ObjectId(conv_id)})
        return result.deleted_count > 0
    except InvalidId:
        return False
