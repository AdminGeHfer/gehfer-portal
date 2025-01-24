import { ChangeEvent } from 'react';

export const formatDocument = (value: string) => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Check if it's CPF (11 digits) or CNPJ (14 digits)
  if (numbers.length === 11) {
    // Format as CPF (XXX.XXX.XXX-XX)
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (numbers.length === 14) {
    // Format as CNPJ (XX.XXX.XXX/XXXX-XX)
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return value;
};

export const formatPhone = (value: string) => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Check if it's a 10 or 11 digit phone number
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return value;
};

export const handleDocumentChange = (
  e: ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  const value = e.target.value;
  const formattedValue = formatDocument(value);
  e.target.value = formattedValue;
  onChange(formattedValue);
};

export const handlePhoneChange = (
  e: ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  const value = e.target.value;
  const formattedValue = formatPhone(value);
  e.target.value = formattedValue;
  onChange(formattedValue);
};