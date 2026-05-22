export default function Wordmark({ size = 'md' }) {
  const dims = size === 'lg' ? { w: 180, h: 36 } : { w: 140, h: 28 }
  return (
    <div className="flex items-center select-none cursor-pointer hover:opacity-90 transition-opacity">
      <img
        src="/Shramik-Logo.png"
        alt="Shramik"
        width={dims.w}
        height={dims.h}
        className="object-contain"
      />
    </div>
  )
}
