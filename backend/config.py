class Config:

    SECRET_KEY = "secret123"

    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = "jwt-secret-key"
    MONGO_URI ="mongodb+srv://movieadmin:12345@moviecollabapp.d1tnzti.mongodb.net/?appName=moviecollabapp"