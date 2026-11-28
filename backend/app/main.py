
from typing import Annotated

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.modules.master_data.routes import (
    router as master_data_router
)

app = FastAPI(
    title=settings.app_name,
    description="Corporate Spend Management Platform",
    version="0.1.0",
)

app.include_router(
    master_data_router,
    prefix=settings.api_prefix
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Checks whether the backend application is running
@app.get("/health")
def health_check():

    return {
        "status": "UP",
        "service": "spendora-api"
    }

#Checks whether the application can communicate with PostgreSQL
@app.get("/ready")
def readiness_check(
    db: Annotated[Session, Depends(get_db)]
):

    try:

        db.execute(text("SELECT 1"))

        return {
            "status": "READY",
            "database": "CONNECTED"
        }

    except SQLAlchemyError:

        raise HTTPException(
            status_code=503,
            detail="Database unavailable"
        )
