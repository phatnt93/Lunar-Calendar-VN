export const authenticate = async (interactive: boolean = false): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!chrome || !chrome.identity) {
      console.warn("chrome.identity is not available");
      resolve(null);
      return;
    }
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (chrome.runtime.lastError) {
        console.error("Auth error:", chrome.runtime.lastError.message);
        resolve(null);
      } else {
        resolve(token || null);
      }
    });
  });
};

export const removeCachedAuthToken = async (token: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!chrome || !chrome.identity) {
      resolve();
      return;
    }
    chrome.identity.removeCachedAuthToken({ token }, () => {
      // Also send a request to Google to revoke the token completely
      fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`)
        .then(() => resolve())
        .catch(() => resolve());
    });
  });
};
