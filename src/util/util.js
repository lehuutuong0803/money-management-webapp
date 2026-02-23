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

export const prepareLineChartData = (transactions) => {
    if (!transactions) return null;
    // Group transactions by date
    const groupedByDate =transactions.reduce((acc, transaction) => {
        const date = transaction.date;
        
        if (!acc[date]) {
            acc[date] = {
                date: date,
                totalAmount: 0,
                items: []
            };
        }
        
        acc[date].totalAmount += transaction.amount;
        acc[date].items.push(transaction);
        
        return acc;
    }, {});
    
    // Convert to array and add formatted month
    const result = Object.values(groupedByDate).map(group => {
        const dateObj = new Date(group.date);
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'short' });
        
        return {
            date: group.date,
            totalAmount: group.totalAmount,
            items: group.items,
            month: `${day}${getDaySuffix(day)} ${month}`
        };
    });
    
    // Sort by date (oldest to newest)
    return result.sort((a, b) => new Date(a.date) - new Date(b.date));
};

// Helper function to get day suffix (st, nd, rd, th)
const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
};