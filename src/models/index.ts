export type PotteryItem = {
  potteryItemId: string
  dateCreated: string
  dateEdited: string
  projectTitle: string
  projectNotes: string
  displayPicturePath: string
  series?: string
  startDate?: string
  greenwareDate?: string
  bisqueDate?: string
  glazeDate?: string
}

export type PotteryItemPictures = {
  pictureId: string
  potteryItemId: string
  picturePath: string
}

export type Clay = {
  clayId: string
  name: string
  manufacturer: string
  notes: string
  type?: string
  firingRange?: string
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
  type?: string
  idCode?: string
}

export type PotteryItemGlazes = {
  glazeId: string
  potteryItemId: string
}

export type PotteryItemMeasurements = {
  measurementId: string
  potteryItemId: string
  name: string
  system: string
  scale: number
}

export type PotteryItemFirings = {
  firingId: string
  potteryItemId: string
  fireStyle: string //Cone or Raku
  fireType: string //bisque or glaze
  cone: string
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
