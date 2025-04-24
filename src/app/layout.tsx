"use client";
import { Header, ProfileCard, Switch } from "@/components";
import { FloatingPublishBar } from "@/components/FloatingPublishBar";
import GoogleLoginRedirect from "@/components/GoogleLoginRedirect";
import { Appform } from "@/components/form/Appform";
import { Navbar } from "@/components/sections/navbar";
import { DataProvider, useDataContext } from "@/context/data-provider";
import { bodyStyle, containerStyle, mainStyle, sectionStyle } from "@/styles";
import "@onlinefreecv/design-system/style.css"; // ✅ Import global styles
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "@/configs/env";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  full_name: Yup.string().required("Full Name is required"),
  current_position: Yup.string().required("Current Position is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string().required("Phone Number is required"),
  summary: Yup.string().required("Summary is required"),
  about_me: Yup.string().required("About Me is required"),
  direction: Yup.string().required("Direction is required"),
  website_name: Yup.string().required("Website Name is required"),
  // picture: Yup.string().required("Picture is required"),
});

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { data } = useDataContext();

  const handleSubmit = async (values: any, actions: any) => {
    try {
      actions.setSubmitting(true);
      if (!API_URL) {
        throw new Error("NEXT_API_URL is not defined");
      }

      const googleOAuthToken = localStorage.getItem("user");
      if (!googleOAuthToken) {
        throw new Error("Google OAuth token is not available in localStorage");
      }
      const token = JSON.parse(googleOAuthToken).access_token;
      if (!token) {
        throw new Error("Google OAuth token is not available in localStorage");
      }

      const { user, auth, ...rest } = values;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: rest,
          auth: token,
          action: "save"
        })
      });
      const data = await response.json();
      actions.setSubmitting(false);
    } catch (error) {
      actions.setSubmitting(false);
    }
  };

  return (
    <Appform
      initialValues={data}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}

    >
      <main className={mainStyle}>

        <Switch />
        <Header />
        <div className={containerStyle}>
          <ProfileCard />
          <div className={sectionStyle}>
            <Navbar />
            {children}
          </div>
        </div>
      </main>
    </Appform>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(false);
  const [isLoading, setIsLoading] = useState<any>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchUserDetails = async (userData: any) => {
    try {
      if (!API_URL) {
        throw new Error("NEXT_API_URL is not defined");
      }

      setIsLoading(true);

      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          auth: userData.access_token,
          action: "fetch",
          data: {
            email: userData.email,
          }
        })
      });

      if (response.ok) {
        let responseJson = await response.json();
        if (responseJson.error) {
          let { access_token, ...user } = userData;
          responseJson = {
            email: user.email,
            first_name: user.given_name,
            last_name: user?.family_name ?? "",
            current_position: user?.current_position ?? "",
            summary: user?.summary ?? "",
            about_me: user?.about_me ?? "",
            full_name: user.name,
            profile_picture: user.picture,
          };

        }

        if (responseJson.success) {
          let { user } = responseJson;
          responseJson = {
            ...user,
            profile_picture: userData.picture,
          }
        }

        setUser(responseJson);
        setIsLoading(false);

      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleLoginSuccess = useCallback((userData: any) => {
    localStorage.setItem("user", JSON.stringify(userData));
    fetchUserDetails(userData); // Fetch user details after login
  }, [fetchUserDetails]);

  return (
    <html lang="en">
      <body className={bodyStyle}>
        {!user ? (
          <GoogleLoginRedirect onLoginSuccess={handleLoginSuccess} />
        ) : (
          isLoading ? (
            <div>Loading...</div>
          ) : (
            <DataProvider user={user}>
              <AppContent>{children}</AppContent>
            </DataProvider>
          )
        )}
      </body>
    </html>
  );
}
