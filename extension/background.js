// Background service worker for the extension
console.log('LinkedIn Outreach Manager extension loaded');

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  if (request.type === 'GET_PAGE_INFO') {
    // Handle page info requests
    sendResponse({ success: true });
  }
  
  return true;
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    // Open welcome page or setup
    chrome.tabs.create({
      url: 'http://localhost:3000'
    });
  }
});
