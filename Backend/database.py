import mysql.connector
import configparser
import os.path

# check for dev config settings or user 
# config settings.
config_file = None
if (os.path.isfile('./Backend/dev.cfg')):
    config_file = './Backend/dev.cfg'
else:
    config_file = './Backend/settings.cfg'

# Read from the configuration file
config = configparser.ConfigParser()
config.read(config_file)


mydb = mysql.connector.connect(
    host=config['DATABASE']['HOST'],
    user=config['DATABASE']['USER'],
    password=config['DATABASE']['PASSWORD']
)




