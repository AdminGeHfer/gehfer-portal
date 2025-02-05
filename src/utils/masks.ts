export const handleDocumentChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  let value = e.target.value.replace(/\D/g, '');
  
  // Limit to 14 digits
  value = value.slice(0, 14);
  
  if (value.length <= 11) {
    // CPF Format
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    // CNPJ Format
    value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  onChange(value);
};

export const handlePhoneChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  let value = e.target.value.replace(/\D/g, '');
  
  // Limit to 11 digits
  value = value.slice(0, 11);
  
  if (value.length <= 10) {
    // Format: (99) 9999-9999
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    // Format: (99) 99999-9999
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  onChange(value);
};

export const handleWeightChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: number) => void
) => {
  // Remove any non-digit characters
  const value = e.target.value.replace(/\D/g, '');
  
  // Convert to number format (divide by 100 to get decimal places)
  const numericValue = value ? parseFloat(value) / 100 : 0;
  
  // Format for display (e.g., "1,50")
  const formattedValue = value 
    ? (numericValue).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : '';

  // Update the input value for display
  e.target.value = formattedValue;
  
  // Pass the numeric value to the form
  onChange(numericValue);
};
