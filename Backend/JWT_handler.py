import time
import jwt
import os
import configparser

# check for dev config settings or user config settings.
config_file = None
if (os.path.isfile('dev.cfg')):
    config_file = 'dev.cfg'
else:
    config_file = 'settings.cfg'
        
# Read from the configuration file
config = configparser.ConfigParser()
config.read(config_file)

JWT_secret = config['JWT']['secret']
JWT_algorithm = config['JWT']['algorithm']

# returns the generated tokens (JWT)
def token_response(token: str):
    return { "token" : token }

# creates a token (JWT)
def signJWT(username: str, administrator: int):
    payload = {
        "username" : username,
        "administrator" : administrator,
        "expire" : int(time.time()) + (60 * 60)
    }
    token = jwt.encode(payload, JWT_secret, algorithm=JWT_algorithm)
    # decode = jwt.decode(token, JWT_secret, JWT_algorithm)
    # print('Inside sign jwt: ', decode)
    return token_response(token)

# decodes the JWT token, returns whether its expired or not
def decodeJWT(token: str):
    # print('Decode before: ', token)
    try:
        decode_token = jwt.decode(token, JWT_secret, JWT_algorithm)
        return decode_token if decode_token['expire'] >= time.time() else None
    except:
        return {}