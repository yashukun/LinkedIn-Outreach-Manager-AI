from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    linkedin_url: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = "active"
    tags: Optional[str] = None
    notes: Optional[str] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    linkedin_url: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[str] = None
    notes: Optional[str] = None


class ContactResponse(ContactBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EngagementCreate(BaseModel):
    contact_id: int
    post_url: str
    post_caption: Optional[str] = None
    generated_comment: str
    comment_posted: Optional[str] = "pending"
    ai_provider: Optional[str] = None


class EngagementResponse(BaseModel):
    id: int
    contact_id: int
    post_url: str
    post_caption: Optional[str]
    generated_comment: str
    comment_posted: str
    engagement_date: datetime
    ai_provider: Optional[str]

    class Config:
        from_attributes = True


class CampaignCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "active"
    contact_ids: Optional[str] = None


class CampaignResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: str
    contact_ids: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AIPreferenceCreate(BaseModel):
    provider: str
    api_token: str
    model_name: Optional[str] = None
    is_default: Optional[str] = "false"


class AIPreferenceResponse(BaseModel):
    id: int
    provider: str
    model_name: Optional[str]
    is_default: str
    created_at: datetime

    class Config:
        from_attributes = True


class CommentGenerateRequest(BaseModel):
    post_url: str
    contact_id: Optional[int] = None
    provider: Optional[str] = "openai"
    token: Optional[str] = None


class CommentGenerateResponse(BaseModel):
    suggested_comment: str
    post_caption: Optional[str] = None
    contact_context: Optional[str] = None
