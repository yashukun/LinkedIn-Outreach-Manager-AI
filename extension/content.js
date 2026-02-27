// Content script injected into LinkedIn pages
console.log('LinkedIn Outreach Manager content script loaded');

// Function to extract profile information from current page
function extractProfileInfo() {
  const profileData = {
    name: '',
    headline: '',
    company: '',
    location: '',
    profileUrl: window.location.href
  };

  // Try to extract profile name
  const nameElement = document.querySelector('h1.text-heading-xlarge');
  if (nameElement) {
    profileData.name = nameElement.textContent.trim();
  }

  // Try to extract headline
  const headlineElement = document.querySelector('.text-body-medium.break-words');
  if (headlineElement) {
    profileData.headline = headlineElement.textContent.trim();
  }

  // Try to extract location
  const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words');
  if (locationElement) {
    profileData.location = locationElement.textContent.trim();
  }

  return profileData;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EXTRACT_PROFILE') {
    const profileData = extractProfileInfo();
    sendResponse({ success: true, data: profileData });
  }
  
  return true;
});

// Add a visual indicator when hovering over LinkedIn posts
function addCommentButton() {
  const posts = document.querySelectorAll('.feed-shared-update-v2');
  
  posts.forEach(post => {
    if (post.querySelector('.lom-quick-comment')) return; // Already added
    
    const actionsBar = post.querySelector('.feed-shared-social-action-bar');
    if (actionsBar) {
      const button = document.createElement('button');
      button.className = 'lom-quick-comment';
      button.textContent = '✨ Quick Comment';
      button.style.cssText = `
        background: #3b82f6;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 12px;
        cursor: pointer;
        margin-left: 8px;
        font-weight: 600;
      `;
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Get post URL
        const postLink = post.querySelector('a[href*="/posts/"]');
        if (postLink) {
          const postUrl = postLink.href;
          // Send message to background script to open popup with this URL
          chrome.runtime.sendMessage({
            type: 'OPEN_POPUP_WITH_URL',
            url: postUrl
          });
        }
      });
      
      actionsBar.appendChild(button);
    }
  });
}

// Run on page load and when new content is added
if (window.location.hostname.includes('linkedin.com')) {
  setTimeout(addCommentButton, 2000);
  
  // Watch for new posts being added to the feed
  const observer = new MutationObserver(() => {
    addCommentButton();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
