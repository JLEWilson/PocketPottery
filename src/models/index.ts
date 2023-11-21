export type PotteryItem = {
  potteryItemId: number
  dateCreated: string 
  dateEdited: string
  projectTitle: string
  projectNotes: string
  displayPicturePath: string
};

export type PotteryItemPictures = {
  pictureId: number
  potteryItemID: number
  picturePath: string
}

export type PotteryItemClays = {
  clayId: number
  potteryItemId: number
  name: string
  manufacturer: string
  notes: string
}

export type PotteryItemGlazes = {
  clayId: number
  potteryItemId: number
  name: string
  manufacturer: string
  notes: string
}

export type PotteryItemtMeasurements = {
  measurementId: number
  projectID: number
  name: string
  scale: number
  type : string
}

export type PotteryItemBisqueFireTemp = {
  bisqueFireTempID: number
  potteryItemId: number
  FireType: string // either Cone or Raku
  coneNumber: number
}

export type PotteryItemGlazeFireTemp = {
  glazeFireTempID: number
  potteryItemId: number
  FireType: string // either Cone or Raku
  coneNumber: number
}

export type PotteryItemTechniques = {
  techniqueId: number
  potteryItemId: number
  techniqueName: string
}

export type commissionData = {
  potteryItemId: number
  dateOrdered: string
  dateDue: string
  clientNotes: string
  quantity: number
  materialCost: number
  salePrice: number
}