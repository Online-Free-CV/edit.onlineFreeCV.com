"use client";
import { useEffect, useState } from "react";
import { Header, ProfileCard, Sections } from "@/components";
import { Navbar } from "@/components/sections/navbar";
import { DataProvider } from "@/context/data-provider";
import { bodyStyle, containerStyle, mainStyle, sectionStyle } from "@/styles";
import GoogleLoginRedirect from "@/components/GoogleLoginRedirect";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>({});
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    console.log("🔵 Logged in User:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData); // Save user data
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted with:", user);
  };

  return (
    <html lang="en">
      <body className={bodyStyle}>
        {!user ? (
          <GoogleLoginRedirect onLoginSuccess={handleLoginSuccess} />
        ) : (
          <form onSubmit={handleSubmit}>
            <DataProvider user={user}>
              <main className={mainStyle}>
                <Header />
                <div className={containerStyle}>
                  <ProfileCard />
                  <div className={sectionStyle}>
                    <Navbar />
                    {children}
                  </div>
                </div>
              </main>
            </DataProvider>
            <button type="submit">Submit</button>
          </form>
        )}
      </body>
    </html>
  );
}
