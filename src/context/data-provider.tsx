"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import appData from "@/public/data.json";

export interface IDataContextProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

interface IDataProviderProps {
  user: any;
  children: React.ReactNode;
}

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

export const DataContext = createContext<IDataContextProps | undefined>(undefined);

export const DataProvider: React.FC<IDataProviderProps> = ({ children, user }: IDataProviderProps) => {
  const [data, setData] = useState<any>({ ...appData, ...user });
  const [isLoading, setIsLoading] = useState<any>(true);

  useEffect(() => {
    setIsLoading(true);
    const {user: userData, ...rest} = user;
    setData((prevData: any) => ({ ...prevData, ...userData }));
    setIsLoading(false);
  }, [user]);

  if(isLoading) return <>Data Loading....</>;

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};