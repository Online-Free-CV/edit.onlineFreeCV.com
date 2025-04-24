export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("google_refresh_token");
    if (!refreshToken) {
      console.error("❌ No refresh token found. User must log in again.");
      return null;
    }
  
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!, // Store securely!
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });
  
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem("google_oauth_token", data.access_token);
        return data.access_token;
      } else {
        console.error("❌ Failed to refresh token:", data);
        return null;
      }
    } catch (error) {
      console.error("❌ Error refreshing token:", error);
      return null;
    }
  };
  