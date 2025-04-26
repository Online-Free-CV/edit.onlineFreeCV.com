import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GOOGLE_CLIENT_ID, REDIRECTION_URL  } from "@/configs/env";

const GoogleLoginRedirect = ({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) => {
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      onLoginSuccess(JSON.parse(storedUser));
      return;
    }

    // ✅ Extract token from URL parameters after Google redirects back to "/"
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");

    if (accessToken) {
      fetchUserInfo(accessToken);
    } else {
      redirectToGoogle();
    }
  }, [onLoginSuccess, router]);

  const redirectToGoogle = () => {
    if (!GOOGLE_CLIENT_ID || !REDIRECTION_URL) {
      console.error("❌ GOOGLE_CLIENT_ID or REDIRECTION_URL is not defined");
      return;
    }
    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/auth";
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      redirect_uri: REDIRECTION_URL!, // ✅ Redirecting to the homepage
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
