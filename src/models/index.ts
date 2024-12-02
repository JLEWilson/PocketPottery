export type PotteryItem = {
  potteryItemId: string
  dateCreated: string
  dateEdited: string
  projectTitle: string
  projectNotes: string
  displayPicturePath: string
}

export type PotteryItemPictures = {
  pictureId: string
  potteryItemId: string
  picturePath: string
}

export type Clay = {
  // clayId: string
  name: string
  manufacturer: string
  notes: string
}

export type PotteryItemClays = {
  potteryItemId: string
  clayId: string
}

export type Glaze = {
  glazeId: string
  name: string
  manufacturer: string
  notes: string
}

export type PotteryItemGlazes = {
  glazeId: string
  potteryItemId: string
}

export type PotteryItemMeasurements = {
  measurementId: string
  projectID: string
  name: string
  scale: number
  type: string
}

export type PotteryItemBisqueFireTemp = {
  bisqueFireTempID: string
  potteryItemId: string
  FireType: string // either Cone or Raku
  coneNumber: number
}

export type PotteryItemGlazeFireTemp = {
  glazeFireTempID: string
  potteryItemId: string
  FireType: string // either Cone or Raku
  coneNumber: number
}

export type PotteryItemTechniques = {
  techniqueId: string
  potteryItemId: string
  techniqueName: string
}

export type commissionData = {
  potteryItemId: string
  dateOrdered: string
  dateDue: string
  clientNotes: string
  quantity: number
  materialCost: number
  salePrice: number
}
