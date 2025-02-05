export const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value;
  
  // Return early if empty
  if (!value) {
    e.target.value = '';
    return;
  }

  // Remove non-digits
  value = value.replace(/\D/g, '');

  // Apply CPF mask if length <= 11
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } 
  // Apply CNPJ mask if length > 11
  else {
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }

  e.target.value = value;
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
