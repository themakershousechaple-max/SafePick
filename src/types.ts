export type RecordItem = {
  id: string
  childName: string
  parentName: string
  phone: string
  serviceTime?: string
  notes?: string
  code: string
  qrUrl: string
  checkInAt: string
  pickUpAt?: string
}

export type RecordInput = {
  childName: string
  parentName: string
  phone: string
  serviceTime?: string
  notes?: string
  code: string
  qrUrl: string
}