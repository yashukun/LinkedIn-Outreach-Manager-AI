from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime

# Database Connection URL
URL_DATABASE = 'postgresql://yash@localhost:5432/linkedin_outreach'

# Create database engine
engine = create_engine(URL_DATABASE)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


class Contact(Base):
    """Enhanced contact model with LinkedIn integration"""
    __tablename__ = 'contacts'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=True, index=True)
    phone_number = Column(String, nullable=True)
    company = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True, unique=True)
    industry = Column(String, nullable=True)
    location = Column(String, nullable=True)
    # active, archived, hot_lead, candidate, etc.
    status = Column(String, default='active')
    tags = Column(String, nullable=True)  # comma-separated tags
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)

    # Relationships
    engagements = relationship(
        "Engagement", back_populates="contact", cascade="all, delete-orphan")


class Engagement(Base):
    """Track LinkedIn engagement history"""
    __tablename__ = 'engagements'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    contact_id = Column(Integer, ForeignKey('contacts.id'), nullable=False)
    post_url = Column(String, nullable=False)
    post_caption = Column(Text, nullable=True)
    generated_comment = Column(Text, nullable=False)
    # pending, posted, failed
    comment_posted = Column(String, default='pending')
    engagement_date = Column(DateTime, default=datetime.utcnow)
    ai_provider = Column(String, nullable=True)  # openai, hf

    # Relationships
    contact = relationship("Contact", back_populates="engagements")


class Campaign(Base):
    """Manage outreach campaigns"""
    __tablename__ = 'campaigns'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default='active')  # active, paused, completed
    contact_ids = Column(String, nullable=True)  # comma-separated contact IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)


class AIPreference(Base):
    """Store AI provider preferences"""
    __tablename__ = 'ai_preferences'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    provider = Column(String, nullable=False)  # openai, hf
    api_token = Column(String, nullable=False)
    model_name = Column(String, nullable=True)
    is_default = Column(String, default='false')
    created_at = Column(DateTime, default=datetime.utcnow)


# Create all tables
Base.metadata.create_all(bind=engine)
