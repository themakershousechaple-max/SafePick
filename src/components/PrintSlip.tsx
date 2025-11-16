type Props = { code: string, childName: string, parentName: string, serviceTime?: string }

export default function PrintSlip({ code, childName, parentName, serviceTime }: Props) {
  return (
    <div className="w-64 p-4 border rounded bg-white">
      <div className="text-center text-2xl font-bold">{code}</div>
      <div className="mt-3 text-sm">Child: {childName}</div>
      <div className="text-sm">Parent: {parentName}</div>
      <div className="text-sm">Service: {serviceTime || '-'}</div>
    </div>
  )
}