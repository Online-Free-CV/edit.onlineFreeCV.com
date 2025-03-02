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

    // ✅ Extract token from URL parameters after Google redirects back to "/"
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
      redirect_uri: "https://edit.onlinefreecv.com", // ✅ Redirecting to the homepage
      response_type: "token",
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/photoslibrary.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ].join(" "),
      include_granted_scopes: "true",
      prompt: "consent",
    });

    window.location.href = `${oauth2Endpoint}?${params.toString()}`;
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      console.log("✅ User Info:", userData);

      localStorage.setItem("google_oauth_token", JSON.stringify({ token }));

      onLoginSuccess({ ...userData, access_token: token });

      // ✅ Redirect user to home page after successful login
      router.push("/");
    } catch (error) {
      console.error("❌ Failed to fetch user info:", error);
    }
  };

  return null;
};

export default GoogleLoginRedirect;
