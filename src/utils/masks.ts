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