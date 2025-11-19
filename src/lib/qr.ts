import QRCode from 'qrcode'

export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw error
  }
}

export async function generateChildQRCode(childData: {
  childName: string
  code: string
  classroom?: string
  parentName?: string
  timestamp?: string
}): Promise<string> {
  const qrData = `🙏 TMHT CHILDREN'S MINISTRY

👶 CHILD: ${childData.childName}
📋 PICKUP CODE: ${childData.code}
${childData.classroom ? `🏫 CLASSROOM: ${childData.classroom}` : ''}
${childData.parentName ? `👨‍👩‍👧‍👦 PARENT: ${childData.parentName}` : ''}
${childData.timestamp ? `⏰ CHECKED IN: ${childData.timestamp}` : ''}

✅ PRESENT THIS CODE FOR PICKUP
❗ KEEP THIS CODE SECURE`

  return await generateQRCode(qrData)
}

export function generatePickupMessage(childName: string, code: string, qrCodeUrl: string): string {
  return `🙏 ${childName} has been checked in safely!

📋 Pickup Code: ${code}
📱 Show this QR code at pickup: ${qrCodeUrl}

Please keep this code secure and present it when picking up your child.

- TMHT Children's Ministry`
}