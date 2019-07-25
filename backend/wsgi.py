from server import app, logging_config

logging_config()

if __name__ == '__main__':
    app.run()
