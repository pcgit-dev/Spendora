
from sqlalchemy import create_engine
from sqlalchemy.orm import (
    DeclarativeBase,
    sessionmaker
)

from app.config import settings

#Configures database connectivity and connection pooling
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True, #Checks whether a pooled connection is still valid
)

#Creates database sessions
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
)

#Base class for all database entity models
class Base(DeclarativeBase):
    pass

#Provides and closes a database session for each API request
def get_db():

    with SessionLocal() as db:
        yield db
