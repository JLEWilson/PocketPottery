import { PotteryItem } from "../models";

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

  export const CompletionStatus = {
    NOT_STARTED: "Not Started",
    GREENWARE_IN_PROGRESS: "Greenware In Progress",
    GREENWARE_DONE: "Greenware Done",
    BISQUE_FIRED: "Bisque Fired",
    COMPLETED: "Completed",
  } as const;

  export const StatusOrder = {
  [CompletionStatus.NOT_STARTED]: 0,
  [CompletionStatus.GREENWARE_IN_PROGRESS]: 1,
  [CompletionStatus.GREENWARE_DONE]: 2,
  [CompletionStatus.BISQUE_FIRED]: 3,
  [CompletionStatus.COMPLETED]: 4,
} as const;
  
  export const getStatus = (item: Pick<PotteryItem, "startDate" | "greenwareDate" | "bisqueDate" | "glazeDate">) => {
    return item.glazeDate
      ? "Completed"
      : item.bisqueDate
      ? "Bisque Fired"
      : item.greenwareDate
      ? "Greenware Done"
      : item.startDate
      ? "Greenware In Progress"
      : "Not Started";
  };

  export const getStatusKey = (status: string) => {
    return Object.keys(CompletionStatus).find(key => CompletionStatus[key as keyof typeof CompletionStatus] === status) ?? '';
  };
  export const sortPotteryItemsByStatus = (items: PotteryItem[]) => {
    const statusSortedItems = items.sort((a, b) => {
      const statusA = getStatus(a);
      const statusB = getStatus(b);
      
      return StatusOrder[statusA] - StatusOrder[statusB];
    })
    return statusSortedItems
}
export const groupBy = <T, K extends string>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};