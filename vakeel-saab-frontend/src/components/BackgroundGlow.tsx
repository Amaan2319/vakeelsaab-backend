export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      <div className="absolute top-[-200px] left-[30%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-200px] right-[30%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]" />

    </div>
  )
}