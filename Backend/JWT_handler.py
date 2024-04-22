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
        
# read the data from the config file
config = configparser.ConfigParser()
config.read(config_file)

# grab the secret and algorithm
JWT_secret = config['JWT']['secret']
JWT_algorithm = config['JWT']['algorithm']

# returns the generated token (JWT)
def token_response(token: str):
    return { "token" : token }

def signJWT(username: str, administrator: int):
    """Creates a token with a specified payload (JWT)

    Args:
        username (str): The username of the user
        administrator (int): Whether that user is an administrator (1) or not (0)

    Returns:
        dict: Contains a key called token, and the value of the token
    """
    payload = {
        "username" : username,
        "administrator" : administrator,
        "expire" : int(time.time()) + (60 * 60)
    }
    token = jwt.encode(payload, JWT_secret, algorithm=JWT_algorithm)
    return token_response(token)

def decodeJWT(token: str):
    """Decodes the JWT token and returns the decoded information if the
    token is not expired.

    Args:
        token (str): The token to decode

    Returns:
        dict: An empty dictionary or a dictionary with the decoded information
    """
    try:
        decode_token = jwt.decode(token, JWT_secret, JWT_algorithm)
        return decode_token if decode_token['expire'] >= time.time() else None
    except:
        return {}