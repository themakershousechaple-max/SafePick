import { QRCodeSVG } from 'qrcode.react'

export default function QR({ value }: { value: string }) {
  return (
    <div className="p-2 bg-white border rounded">
      <QRCodeSVG value={value} size={192} includeMargin />
    </div>
  )
}