"""
AI-powered comment generation using OpenAI and HuggingFace
"""
import requests
from openai import OpenAI
from typing import Optional


def generate_comment_openai(
    caption: str,
    token: str,
    contact_context: Optional[str] = None,
    model: str = "gpt-4o-mini"
) -> str:
    """
    Generate LinkedIn comment using OpenAI

    Args:
        caption: Post caption text
        token: OpenAI API token
        contact_context: Additional context about the contact
        model: OpenAI model to use

    Returns:
        Generated comment text
    """
    try:
        client = OpenAI(api_key=token)

        # Build context-aware prompt
        if contact_context:
            prompt = (
                f"Context about the person: {contact_context}\n\n"
                f"Their LinkedIn post: {caption}\n\n"
                "Generate a personalized, professional, and authentic LinkedIn comment "
                "(15-25 words) that shows you read the post and adds value. "
                "Be specific to their industry/role when possible. Avoid generic phrases."
            )
        else:
            prompt = (
                f"LinkedIn post: {caption}\n\n"
                "Generate a thoughtful, professional LinkedIn comment (15-25 words) "
                "that adds value and shows genuine engagement."
            )

        completion = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional LinkedIn user who writes authentic, "
                               "thoughtful comments that build genuine business relationships."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=100
        )

        return completion.choices[0].message.content.strip()

    except Exception as e:
        return f"OpenAI API error: {str(e)}"


def generate_comment_hf(
    caption: str,
    token: str,
    contact_context: Optional[str] = None,
    model_name: str = "mistralai/Mixtral-8x7B-Instruct-v0.1"
) -> str:
    """
    Generate LinkedIn comment using HuggingFace

    Args:
        caption: Post caption text
        token: HuggingFace API token
        contact_context: Additional context about the contact
        model_name: HuggingFace model to use

    Returns:
        Generated comment text
    """
    api_url = f"https://api-inference.huggingface.co/models/{model_name}"
    headers = {"Authorization": f"Bearer {token}"}

    # Build context-aware prompt
    if contact_context:
        prompt = (
            f"Context: {contact_context}\n"
            f"Post: {caption}\n\n"
            "Write a personalized, professional LinkedIn comment (15-25 words) that shows "
            "genuine engagement and adds value.\n\nComment:"
        )
    else:
        prompt = (
            f"Post: {caption}\n\n"
            "Write a thoughtful, professional LinkedIn comment (15-25 words).\n\nComment:"
        )

    data = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 150,
            "temperature": 0.7,
            "top_p": 0.9
        }
    }

    try:
        response = requests.post(
            api_url, headers=headers, json=data, timeout=60)

        if response.status_code == 200:
            result = response.json()

            # Extract generated text
            if isinstance(result, list) and len(result) > 0 and 'generated_text' in result[0]:
                generated = result[0]['generated_text']
            elif isinstance(result, dict) and 'generated_text' in result:
                generated = result['generated_text']
            else:
                return f"Unexpected response format: {result}"

            # Extract only the comment part after 'Comment:'
            if 'Comment:' in generated:
                comment_text = generated.split('Comment:')[-1].strip()
            else:
                comment_text = generated.strip()

            return comment_text
        else:
            return f"HuggingFace API error: {response.text}"

    except Exception as e:
        return f"HuggingFace API error: {str(e)}"


def build_contact_context(contact: dict) -> str:
    """
    Build context string from contact information

    Args:
        contact: Dictionary containing contact information

    Returns:
        Formatted context string
    """
    context_parts = []

    if contact.get('first_name') and contact.get('last_name'):
        context_parts.append(
            f"Name: {contact['first_name']} {contact['last_name']}")

    if contact.get('job_title'):
        context_parts.append(f"Role: {contact['job_title']}")

    if contact.get('company'):
        context_parts.append(f"Company: {contact['company']}")

    if contact.get('industry'):
        context_parts.append(f"Industry: {contact['industry']}")

    if contact.get('tags'):
        context_parts.append(f"Tags: {contact['tags']}")

    return " | ".join(context_parts) if context_parts else None
