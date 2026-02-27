from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import pandas as pd
from io import StringIO
from typing import List, Optional

from database import SessionLocal, Contact, Engagement, Campaign, AIPreference
from models import (
    ContactCreate, ContactUpdate, ContactResponse,
    EngagementCreate, EngagementResponse,
    CampaignCreate, CampaignResponse,
    AIPreferenceCreate, AIPreferenceResponse,
    CommentGenerateRequest, CommentGenerateResponse
)
from utils.linkedin_scraper import get_linkedin_post_caption
from utils.ai_generator import (
    generate_comment_openai,
    generate_comment_hf,
    build_contact_context
)

app = FastAPI(title="LinkedIn Outreach Manager", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============= CONTACT ENDPOINTS =============

@app.get('/api/contacts', response_model=List[ContactResponse])
def get_contacts(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all contacts with optional filtering"""
    query = db.query(Contact)

    if status:
        query = query.filter(Contact.status == status)

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Contact.first_name.ilike(search_filter)) |
            (Contact.last_name.ilike(search_filter)) |
            (Contact.email.ilike(search_filter)) |
            (Contact.company.ilike(search_filter))
        )

    contacts = query.offset(skip).limit(limit).all()
    return contacts


@app.get('/api/contacts/{contact_id}', response_model=ContactResponse)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    """Get a specific contact by ID"""
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@app.post('/api/contacts', response_model=ContactResponse)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    """Create a new contact"""
    try:
        db_contact = Contact(**contact.dict())
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return db_contact
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


@app.put('/api/contacts/{contact_id}', response_model=ContactResponse)
def update_contact(
    contact_id: int,
    contact: ContactUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing contact"""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    update_data = contact.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_contact, key, value)

    try:
        db.commit()
        db.refresh(db_contact)
        return db_contact
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


@app.delete('/api/contacts/{contact_id}')
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    """Delete a contact"""
    db_contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    try:
        db.delete(db_contact)
        db.commit()
        return {"message": "Contact deleted successfully"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


@app.post('/api/contacts/upload-csv')
async def upload_contacts_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Bulk upload contacts from CSV file"""
    try:
        contents = await file.read()
        df = pd.read_csv(StringIO(contents.decode('utf-8')))

        # Map CSV columns to Contact model
        # Expected columns: first_name, last_name, email, phone_number, company, job_title, linkedin_url, etc.
        contacts = []

        for _, row in df.iterrows():
            contact_data = {
                'first_name': str(row.get('first_name', row.get('FIRST_NAME', ''))),
                'last_name': str(row.get('last_name', row.get('LAST_NAME', ''))),
                'email': str(row.get('email', row.get('EMAIL', ''))) if pd.notna(row.get('email', row.get('EMAIL'))) else None,
                'phone_number': str(row.get('phone_number', row.get('PHONE_NUMBER', ''))) if pd.notna(row.get('phone_number', row.get('PHONE_NUMBER'))) else None,
                'company': str(row.get('company', row.get('COMPANY', ''))) if pd.notna(row.get('company', row.get('COMPANY'))) else None,
                'job_title': str(row.get('job_title', row.get('JOB_TITLE', ''))) if pd.notna(row.get('job_title', row.get('JOB_TITLE'))) else None,
                'linkedin_url': str(row.get('linkedin_url', row.get('LINKEDIN_URL', ''))) if pd.notna(row.get('linkedin_url', row.get('LINKEDIN_URL'))) else None,
                'industry': str(row.get('industry', row.get('INDUSTRY', ''))) if pd.notna(row.get('industry', row.get('INDUSTRY'))) else None,
                'location': str(row.get('location', row.get('LOCATION', ''))) if pd.notna(row.get('location', row.get('LOCATION'))) else None,
                'status': str(row.get('status', 'active')),
                'tags': str(row.get('tags', '')) if pd.notna(row.get('tags')) else None,
                'notes': str(row.get('notes', '')) if pd.notna(row.get('notes')) else None,
            }
            contacts.append(Contact(**contact_data))

        db.bulk_save_objects(contacts)
        db.commit()

        return {
            "message": f"Successfully uploaded {len(contacts)} contacts",
            "count": len(contacts)
        }

    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ============= ENGAGEMENT ENDPOINTS =============

@app.get('/api/engagements', response_model=List[EngagementResponse])
def get_engagements(
    contact_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get engagement history"""
    query = db.query(Engagement)

    if contact_id:
        query = query.filter(Engagement.contact_id == contact_id)

    engagements = query.order_by(
        Engagement.engagement_date.desc()).offset(skip).limit(limit).all()
    return engagements


@app.post('/api/engagements', response_model=EngagementResponse)
def create_engagement(engagement: EngagementCreate, db: Session = Depends(get_db)):
    """Log a new engagement"""
    try:
        db_engagement = Engagement(**engagement.dict())
        db.add(db_engagement)
        db.commit()
        db.refresh(db_engagement)
        return db_engagement
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


@app.get('/api/contacts/{contact_id}/engagements', response_model=List[EngagementResponse])
def get_contact_engagements(contact_id: int, db: Session = Depends(get_db)):
    """Get all engagements for a specific contact"""
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    return contact.engagements


# ============= COMMENT GENERATION ENDPOINT =============

@app.post('/api/generate-comment', response_model=CommentGenerateResponse)
def generate_comment(request: CommentGenerateRequest, db: Session = Depends(get_db)):
    """Generate AI-powered LinkedIn comment with optional contact context"""
    try:
        # Extract post caption
        post_caption = get_linkedin_post_caption(request.post_url)

        # Get contact context if contact_id provided
        contact_context = None
        contact = None

        if request.contact_id:
            contact = db.query(Contact).filter(
                Contact.id == request.contact_id).first()
            if contact:
                contact_dict = {
                    'first_name': contact.first_name,
                    'last_name': contact.last_name,
                    'job_title': contact.job_title,
                    'company': contact.company,
                    'industry': contact.industry,
                    'tags': contact.tags
                }
                contact_context = build_contact_context(contact_dict)

        # Get API token (from request or from saved preferences)
        api_token = request.token
        provider = request.provider or "openai"

        if not api_token:
            # Try to get from saved preferences
            pref = db.query(AIPreference).filter(
                AIPreference.provider == provider,
                AIPreference.is_default == "true"
            ).first()

            if pref:
                api_token = pref.api_token
            else:
                raise HTTPException(
                    status_code=400,
                    detail="No API token provided and no default preference found"
                )

        # Generate comment
        if provider == "openai":
            comment = generate_comment_openai(
                post_caption, api_token, contact_context)
        elif provider == "hf":
            comment = generate_comment_hf(
                post_caption, api_token, contact_context)
        else:
            raise HTTPException(
                status_code=400, detail="Invalid provider. Use 'openai' or 'hf'")

        # Log the engagement if contact_id provided
        if request.contact_id:
            engagement = Engagement(
                contact_id=request.contact_id,
                post_url=request.post_url,
                post_caption=post_caption,
                generated_comment=comment,
                comment_posted='pending',
                ai_provider=provider
            )
            db.add(engagement)
            db.commit()

        return CommentGenerateResponse(
            suggested_comment=comment,
            post_caption=post_caption,
            contact_context=contact_context
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating comment: {str(e)}")


# ============= CAMPAIGN ENDPOINTS =============

@app.get('/api/campaigns', response_model=List[CampaignResponse])
def get_campaigns(db: Session = Depends(get_db)):
    """Get all campaigns"""
    campaigns = db.query(Campaign).all()
    return campaigns


@app.post('/api/campaigns', response_model=CampaignResponse)
def create_campaign(campaign: CampaignCreate, db: Session = Depends(get_db)):
    """Create a new campaign"""
    try:
        db_campaign = Campaign(**campaign.dict())
        db.add(db_campaign)
        db.commit()
        db.refresh(db_campaign)
        return db_campaign
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


# ============= AI PREFERENCE ENDPOINTS =============

@app.get('/api/ai-preferences', response_model=List[AIPreferenceResponse])
def get_ai_preferences(db: Session = Depends(get_db)):
    """Get all AI preferences"""
    preferences = db.query(AIPreference).all()
    # Don't return API tokens in list view
    return preferences


@app.post('/api/ai-preferences', response_model=AIPreferenceResponse)
def create_ai_preference(preference: AIPreferenceCreate, db: Session = Depends(get_db)):
    """Save AI provider preference"""
    try:
        # If this is set as default, unset other defaults for this provider
        if preference.is_default == "true":
            db.query(AIPreference).filter(
                AIPreference.provider == preference.provider,
                AIPreference.is_default == "true"
            ).update({"is_default": "false"})

        db_preference = AIPreference(**preference.dict())
        db.add(db_preference)
        db.commit()
        db.refresh(db_preference)
        return db_preference
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Database error: {str(e)}")


# ============= STATS ENDPOINT =============

@app.get('/api/stats')
def get_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    total_contacts = db.query(Contact).count()
    total_engagements = db.query(Engagement).count()
    total_campaigns = db.query(Campaign).count()

    # Contacts by status
    active_contacts = db.query(Contact).filter(
        Contact.status == 'active').count()
    hot_leads = db.query(Contact).filter(Contact.status == 'hot_lead').count()

    # Recent engagements
    pending_engagements = db.query(Engagement).filter(
        Engagement.comment_posted == 'pending').count()
    posted_engagements = db.query(Engagement).filter(
        Engagement.comment_posted == 'posted').count()

    return {
        "total_contacts": total_contacts,
        "active_contacts": active_contacts,
        "hot_leads": hot_leads,
        "total_engagements": total_engagements,
        "pending_engagements": pending_engagements,
        "posted_engagements": posted_engagements,
        "total_campaigns": total_campaigns
    }


@app.get('/')
def root():
    """Health check endpoint"""
    return {
        "message": "LinkedIn Outreach Manager API",
        "version": "1.0.0",
        "status": "active"
    }
