export const addThousandSeparator = (amount) =>  {
  // Handle null, undefined, or empty values
  if (amount === null || amount === undefined || amount === '') {
    return '';
  }
  
  // Convert to string and handle negative numbers
  const numStr = String(amount);
  const isNegative = numStr.startsWith('-');
  const absNumStr = isNegative ? numStr.slice(1) : numStr;
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = absNumStr.split('.');
  
  // Add thousand separators to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Combine back with decimal part if exists
  const result = decimalPart !== undefined 
    ? `${formattedInteger}.${decimalPart}` 
    : formattedInteger;
  
  // Add negative sign back if needed
  return isNegative ? `-${result}` : result;
}