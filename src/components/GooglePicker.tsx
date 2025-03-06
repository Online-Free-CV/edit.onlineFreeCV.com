import { useEffect, useState } from "react";
import { refreshAccessToken } from "@/utils/refreshAccessToken";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

interface GooglePickerProps {
  setImageUrl: (url: string) => void;
  accessToken: string | null;
}

const GooglePicker: React.FC<GooglePickerProps> = ({ setImageUrl }) => {
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => setPickerLoaded(true);
    document.body.appendChild(script);

    const getAccessToken = async () => {
        
      let token = localStorage.getItem("google_oauth_token") && JSON.parse(localStorage.getItem("google_oauth_token")!).token;

      if (!token) {
        console.error("❌ No OAuth Token found. Please log in.");
        return;
      }

      // Refresh token if expired
      token = await refreshAccessToken() || token;
      setAccessToken(token);
    };

    getAccessToken();
  }, []);

  const openPicker = () => {
    if (!accessToken) {
      console.error("❌ No Google Access Token found. Please log in first.");
      return;
    }

    console.log("🔵 Using OAuth Token for Picker:", accessToken);
    window.gapi.load("picker", { callback: createPicker });
  };

  const createPicker = () => {
    if (pickerLoaded && accessToken) {
      console.log("📤 Initializing Google Picker with OAuth Token...");
      const picker = new window.google.picker.PickerBuilder()
        .addView(new window.google.picker.View(window.google.picker.ViewId.PHOTOS)) // ✅ Use Google Photos Picker
        .setOAuthToken(accessToken) // ✅ Use OAuth Token
        .setDeveloperKey(API_KEY) // ✅ Use API Key
        .setOrigin(window.location.protocol + "//" + window.location.host) // ✅ Ensures correct origin
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
  };

  const pickerCallback = (data: any) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const file = data.docs[0];
      console.log("📸 Selected Image:", file);
      setImageUrl(file.url);
    } else {
      console.error("❌ Google Picker closed or failed.", data);
    }
  };

  return (
    <button onClick={openPicker} disabled={!pickerLoaded}>
      📸 Select Google Photo
    </button>
  );
};

export default GooglePicker;
