"use client";
import { useEffect, useState } from "react";
import { Header, ProfileCard, Sections } from "@/components";
import { Navbar } from "@/components/sections/navbar";
import { DataProvider, useDataContext } from "@/context/data-provider";
import "@onlinefreecv/design-system/style.css"; // ✅ Import global styles
import { bodyStyle, containerStyle, mainStyle, sectionStyle } from "@/styles";
import GoogleLoginRedirect from "@/components/GoogleLoginRedirect";
import { Appform } from "@/components/form/Appform";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
});

const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { data } = useDataContext();

  return (
    <Appform
      initialValues={data}
      onSubmit={(values, actions) => {
        console.log("Form submitted with:", values);
        actions.setSubmitting(false);
      }}
      validationSchema={validationSchema}
    >
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
    </Appform>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(false);
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

  return (
    <html lang="en">
      <body className={bodyStyle}>
        {!user ? (
          <GoogleLoginRedirect onLoginSuccess={handleLoginSuccess} />
        ) : (
          <DataProvider user={user}>
            <AppContent>{children}</AppContent>
          </DataProvider>
        )}
      </body>
    </html>
  );
}