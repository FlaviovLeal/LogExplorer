import logging
import logging.handlers
from pythonjsonlogger import jsonlogger
import datetime
import os
import time
import random

os.remove("./example_file/logs.log")

logger = logging.getLogger()
logger.setLevel(10)
class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        if not log_record.get('timestamp'):
            # this doesn't use record.created, so it is slightly off
            now = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%S.%fZ')
            log_record['timestamp'] = now
        if log_record.get('level'):
            log_record['level'] = log_record['level'].upper()
        else:
            log_record['level'] = record.levelname

logHandler = logging.handlers.RotatingFileHandler("./example_file/logs.log")
formatter = CustomJsonFormatter()
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)

while True:
    time.sleep(2)
    if random.random() >0.5:
        logger.error("message", extra={"traceback":"erroaoragarga"})
    logger.info("message")