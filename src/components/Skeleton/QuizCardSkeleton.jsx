
const SkeletonCard = ({ delay }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    >
      <div className="p-6 pb-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gray-200 rounded-xl w-14 h-14"></div>
          <div className="bg-gray-200 rounded-lg w-8 h-8"></div>
        </div>

        <div className="mb-3">
          <div className="bg-gray-200 rounded h-5 w-3/4 mb-2"></div>
          <div className="bg-gray-200 rounded h-4 w-1/2"></div>
        </div>

        <div className="bg-gray-200 rounded h-4 w-2/3 mb-4"></div>
        <div className="bg-gray-200 rounded-lg h-7 w-24 mb-4"></div>

        <div className="mb-4 flex-grow">
          <div className="bg-gray-200 rounded h-4 w-1/3 mb-2"></div>
          <div className="bg-gray-200 rounded-full h-2 w-full"></div>
        </div>

        <div className="bg-gray-200 rounded h-4 w-1/2"></div>
      </div>

      <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-200 rounded-lg h-10"></div>
          <div className="flex-1 bg-gray-200 rounded-lg h-10"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard