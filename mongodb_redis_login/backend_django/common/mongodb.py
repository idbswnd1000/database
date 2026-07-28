import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

client = MongoClient(
    os.getenv("MONGO_URL")
)

db = client[
    os.getenv("MONGO_DB", "mydb")
]

user_collection = db["users"]
sales_collection = db["sales"]