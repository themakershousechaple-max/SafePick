import { QRCodeSVG } from 'qrcode.react'

export default function QR({ value }: { value: string }) {
  return (
    <div className="p-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded">
      <QRCodeSVG value={value} size={192} includeMargin />
    </div>
  )
}
