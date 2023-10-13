from datetime import datetime, timedelta
from jose import JWTError, jwt
# from main import TokenData
import main
import config_env

#change to environment file
#file which decribes access token creation and verification function
SECRET_KEY = config_env.SECRET_KEY2
ALGORITHM = config_env.ALGORITHM2
ACCESS_TOKEN_EXPIRE_MINUTES = config_env.ACCESS_TOKEN_EXPIRE_MINUTES2

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token:str,credentials_exception):
	try:
		payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
		username: str = payload.get("sub")
		if username is None:
			raise credentials_exception
		token_data = main.TokenData(username=username)
	except JWTError:
	    raise credentials_exception