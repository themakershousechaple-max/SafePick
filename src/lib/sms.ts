export function sendSMSMessage(phone: string, message: string): void {
  // Remove any non-digit characters from phone number
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message)
  
  // Create SMS URL - try different formats for better compatibility
  let smsUrl: string
  
  // Try with body parameter first (works on most modern devices)
  if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    // iOS format - use & instead of ? for iOS
    smsUrl = `sms:${cleanPhone}&body=${encodedMessage}`
  } else if (navigator.userAgent.match(/Android/i)) {
    // Android format
    smsUrl = `sms:${cleanPhone}?body=${encodedMessage}`
  } else {
    // Generic format
    smsUrl = `sms:${cleanPhone}?body=${encodedMessage}`
  }
  
  // Try to open SMS app
  try {
    // Method 1: Try location.href (works best on mobile)
    window.location.href = smsUrl
    
    // Method 2: Fallback - create and click a link
    setTimeout(() => {
      if (document.hasFocus()) {
        // If we're still focused, the SMS app might not have opened
        const link = document.createElement('a')
        link.href = smsUrl
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }, 500)
    
  } catch (error) {
    // Final fallback
    console.error('Failed to open SMS:', error)
    // Try copying to clipboard as last resort
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${cleanPhone} - ${message}`)
        .then(() => alert('Phone and message copied to clipboard. Please paste in your SMS app.'))
        .catch(() => alert('Could not open SMS app. Please manually text the code.'))
    }
  }
}

export async function sendSMSWithQRCode(phone: string, childName: string, code: string, qrCodeDataUrl: string): Promise<void> {
  // For SMS, we'll send the QR code as a data URL in the message
  // Since most SMS apps don't support images, we'll provide a link to view the QR code
  
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Create a simple text message with the code and instructions
  const message = `TMHT Childrens Ministry: ${childName} - Pickup Code: ${code}\n\nQR Code: ${qrCodeDataUrl}\n\nSave this code to pick up your child.`
  
  // For better user experience, we'll also try to create a shareable link
  // that opens the QR code image in a browser
  let shareableMessage = message
  
  try {
    // Try to create a blob URL for the QR code image
    const response = await fetch(qrCodeDataUrl)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    
    // Create a shorter message with the blob URL
    shareableMessage = `TMHT Childrens Ministry: ${childName} - Pickup Code: ${code}\n\nView QR Code: ${blobUrl}\n\nSave this code to pick up your child.`
    
    // Clean up the blob URL after a delay to prevent memory leaks
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000) // Revoke after 1 minute
  } catch (error) {
    console.warn('Could not create blob URL for QR code, using data URL instead:', error)
  }
  
  const encodedMessage = encodeURIComponent(shareableMessage)
  
  // Determine SMS URL format based on device
  let smsUrl: string
  if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    smsUrl = `sms:${cleanPhone}&body=${encodedMessage}`
  } else {
    smsUrl = `sms:${cleanPhone}?body=${encodedMessage}`
  }
  
  // Try to open SMS app
  try {
    window.location.href = smsUrl
    
    // Fallback method
    setTimeout(() => {
      if (document.hasFocus()) {
        const link = document.createElement('a')
        link.href = smsUrl
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }, 500)
    
  } catch (error) {
    console.error('Failed to open SMS with QR code:', error)
    // Fallback to regular SMS
    sendSMSMessage(phone, generateSMSMessage(childName, code))
  }
}

export function generateSMSMessage(childName: string, code: string): string {
  return `TMHT Childrens Ministry: ${childName} checked in successfully! Pickup Code: ${code}. Save this code to pick up your child. Questions? Contact the ministry team.`
}