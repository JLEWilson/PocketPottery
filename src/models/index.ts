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

export type Clay = {
  clayId: number
  name: string
  manufacturer: string
  notes: string
}

export type PotteryItemClays = {
  potteryItemId: number
  clayId: number
}

export type Glaze = {
  clayId: number
  name: string
  manufacturer: string
  notes: string
}

export type PotteryItemGlazes = {
  glazeId: number
  potteryItemId: number
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