import React, { useState } from 'react';
import styles from "../page.module.css"; 

interface AffichagePaysProps {
  onSubmit: (countryName: string) => void;
}

const AffichagePays: React.FC<AffichagePaysProps> = ({ onSubmit }) => {
  const [countryName, setCountryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(countryName);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <label>
        Country Name:
        <input
          type="text"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          className={styles.inputField}
        />
      </label>
      <button type="submit" className={styles.submitButton}>Submit</button>
    </form>
  );
};

export default AffichagePays;
