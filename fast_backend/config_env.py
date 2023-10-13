from fastapi import FastAPI, HTTPException, Depends, Response, status
import aiofiles
from fastapi import Query
from fastapi import FastAPI, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import Optional
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import datetime as datetime
from bson import ObjectId
from datetime import datetime, timedelta
from pydantic import ValidationError
from jose import JWTError, jwt
from passlib.context import CryptContext
from pymongo import MongoClient
from typing import List, Optional
import cloud_orch as cloud
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
import uvicorn


# MongoDB Configuration

client = MongoClient('localhost', 27017)
db = client['leotest']
user_collection = db['users']
experiment_collection = db['jobs']
node_collection = db['nodes']

# JWT Configuration (need to change this to env)

SECRET_KEY = "<secret-key-1>"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 200

SECRET_KEY2 = "<secret-key-2>"
ALGORITHM2 = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES2 = 30

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
grpc_hostname = 'localhost'
grpc_port = '50051'

ip1= ""
ip2= ""
ip3=  "http://0.0.0.0:80"
