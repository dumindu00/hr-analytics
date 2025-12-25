from pydantic import BaseModel,Field

class UserCreate(BaseModel):
    username: str
    company_name: str
    password: str = Field(..., min_length=8, max_length=64)

class UserLogin(BaseModel):
    username: str
    password: str = Field(..., min_length=8, max_length=64)

class UserOut(BaseModel):
    id: int
    username: str
    company_name: str

    class Config:
        orm_mode = True
