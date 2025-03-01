import { useEffect } from "react";
import { useRouter } from "next/navigation";

const GoogleLoginRedirect = ({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) => {
  const router = useRouter();

useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        onLoginSuccess(JSON.parse(storedUser));
        return;
    }
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
        console.log("🔵 Google Access Token:", accessToken);
        fetchUserInfo(accessToken);
    } else {
        redirectToGoogle();
    }
}, [onLoginSuccess, router]);

const redirectToGoogle = () => {
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/auth";
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    redirect_uri: "http://localhost:3000", // Change this for production
    response_type: "token",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/photoslibrary.readonly", // ✅ Required for Google Photos Picker
      "https://www.googleapis.com/auth/drive.readonly", // ✅ Required for Google Picker (Drive)
    ].join(" "),
    include_granted_scopes: "true",
    prompt: "consent", // Forces Google Consent Screen every time
  });

  window.location.href = `${oauth2Endpoint}?${params.toString()}`;
};

const fetchUserInfo = async (token: string) => {
  try {
    debugger;
    // Use the correct API endpoint to avoid CORS & 404 issues
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userData = await response.json();
    console.log("✅ User Info:", userData);

    // Store the access token for later use
    localStorage.setItem("google_oauth_token", JSON.stringify({token}));

    // Proceed with login success
    onLoginSuccess({ ...userData, access_token: token });
  } catch (error) {
    console.error("❌ Failed to fetch user info:", error);
  }
};

  return null; // No UI needed since we auto-redirect
};

export default GoogleLoginRedirect;
