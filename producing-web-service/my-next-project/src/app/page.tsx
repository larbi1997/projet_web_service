"use client";

import React, { useState } from 'react';
import axios from 'axios';
import styles from "./page.module.css";
import { parseStringPromise } from "xml2js";
import AffichagePays from './components/affichagePays';

interface CountryData {
  name: string;
  population: number;
  capital: string;
  currency: string;
}

const constructXMLPayload = (title: string): string => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:gs="http://spring.io/guides/gs-producing-web-service">
      <soapenv:Header/>
      <soapenv:Body>
        <gs:getCountryRequest>
          <gs:name>${title}</gs:name>
        </gs:getCountryRequest>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
};

const fetchAndParseCountryData = async (title: string): Promise<CountryData | null> => {
  try {
    const xmlPayload = constructXMLPayload(title);
    const response = await axios.post("http://localhost:8080/ws", xmlPayload, {
      headers: { "Content-Type": "text/xml" }
    });

    const result = await parseStringPromise(response.data, { explicitArray: false, ignoreAttrs: true });
    console.log("Full SOAP response:", result); // Log the full response

    const parsedData = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['ns2:getCountryResponse']['ns2:country'];
    
    const countryData: CountryData = {
      name: parsedData['ns2:name'],
      population: parseInt(parsedData['ns2:population'], 10),
      capital: parsedData['ns2:capital'],
      currency: parsedData['ns2:currency']
    };

    return countryData;
  } catch (error) {
    console.error("Error fetching or parsing country data:", error);
    if (axios.isAxiosError(error)) {
      console.error("Error details:", error.response?.data || error.message);
    }
    return null;
  }
};

const Page = () => {
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (countryName: string) => {
    if (!countryName) {
      setError('Please enter a country name.');
      return;
    }
    setLoading(true);
    setError('');
    
    const data = await fetchAndParseCountryData(countryName);
    setCountryData(data);
    setLoading(false);
    if (!data) {
      setError('An error occurred while fetching the data.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Country Information Finder</h1>
      <AffichagePays onSubmit={handleSubmit} />
      
      {loading && <p className={styles.loadingMessage}>Loading...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {countryData && (
        <div className={styles.countryInfo}>
          <p>Country Name: {countryData.name}</p>
          <p>Population: {countryData.population}</p>
          <p>Capital: {countryData.capital}</p>
          <p>Currency: {countryData.currency}</p>
        </div>
      )}
    </div>
  );
};

export default Page;
