export const sortObjectsByProperty = <T extends object>(
    array: T[],
    property: keyof T
  ): T[] => {
    const extractNumber = (str: string): number | null => {
      const match = str.match(/^\d+/); // Match leading numbers
      return match ? parseInt(match[0], 10) : null;
    };
  
    return array.sort((a, b) => {
      const valueA = a[property];
      const valueB = b[property];
  
      // Convert values to strings for processing
      const strA = typeof valueA === "string" ? valueA : String(valueA);
      const strB = typeof valueB === "string" ? valueB : String(valueB);
  
      const numA = extractNumber(strA);
      const numB = extractNumber(strB);
  
      if (numA !== null && numB !== null) {
        // Both properties have leading numbers, sort numerically
        if (numA === numB) {
          // If numbers are equal, sort alphabetically
          return strA.localeCompare(strB);
        }
        return numA - numB;
      }
  
      if (numA !== null) return -1; // Values with numbers come first
      if (numB !== null) return 1;  // Values without numbers come later
  
      // Sort alphabetically if neither starts with a number
      return strA.localeCompare(strB);
    });
  };