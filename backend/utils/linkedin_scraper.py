"""
LinkedIn post caption extractor using Selenium with stealth mode
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time


def get_linkedin_post_caption(post_url: str, headless: bool = True) -> str:
    """
    Extract caption/text from a LinkedIn post URL

    Args:
        post_url: LinkedIn post URL
        headless: Run browser in headless mode

    Returns:
        Extracted post caption text
    """
    chrome_options = Options()

    if headless:
        chrome_options.add_argument("--headless")

    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument(
        "--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option(
        "excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)

    driver = None

    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.execute_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        driver.get(post_url)
        time.sleep(3)  # Wait for page to load

        # Try multiple selectors for post content
        selectors = [
            "div.feed-shared-update-v2__description",
            "div.feed-shared-text",
            "span.break-words",
            "div[class*='update-components-text']",
        ]

        caption_text = ""

        for selector in selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    caption_text = elements[0].text.strip()
                    if caption_text:
                        break
            except Exception as e:
                continue

        if not caption_text:
            # Fallback: get all visible text
            body = driver.find_element(By.TAG_NAME, "body")
            caption_text = body.text[:500]  # Limit to first 500 chars

        return caption_text if caption_text else "Could not extract post caption"

    except Exception as e:
        return f"Error extracting caption: {str(e)}"

    finally:
        if driver:
            driver.quit()


def get_linkedin_profile_info(profile_url: str) -> dict:
    """
    Extract basic profile information from LinkedIn profile

    Args:
        profile_url: LinkedIn profile URL

    Returns:
        Dictionary with profile information
    """
    # This is a placeholder for future enhancement
    # Would require authentication to access full profiles
    return {
        "name": "",
        "headline": "",
        "company": "",
        "location": ""
    }
