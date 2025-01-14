import { ChangeEvent } from 'react';

export const formatCNPJ = (value: string) => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Apply CNPJ mask (XX.XXX.XXX/XXXX-XX)
  return numbers.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, 
    '$1.$2.$3/$4-$5'
  ).substring(0, 18);
};

export const unformatCNPJ = (value: string) => {
  return value.replace(/\D/g, '');
};

export const handleCNPJChange = (
  e: ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  const value = e.target.value;
  
  // Store cursor position
  const cursorPosition = e.target.selectionStart;
  const unformattedValue = unformatCNPJ(value);
  
  // Format the value
  const formattedValue = formatCNPJ(value);
  
  // Update the input value
  e.target.value = formattedValue;
  
  // Calculate new cursor position
  const newCursorPosition = cursorPosition + 
    (formattedValue.length - value.length);
  
  // Restore cursor position
  e.target.setSelectionRange(newCursorPosition, newCursorPosition);
  
  // Call the original onChange with unformatted value
  onChange(unformattedValue);
};