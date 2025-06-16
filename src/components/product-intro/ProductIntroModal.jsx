import BannerImage from '../../assets/BannerImage.png'
import Navbar from '../navbar/Navbar'

const ProductIntroModal = ({ onGetStarted, onExplore }) => {
  return (
    <div>
      <Navbar />
          <div className="h-screen w-full flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="w-full max-w-[90rem] px-2 flex flex-row items-center justify-between m-10">
        {/* Left side - Text content */}
        <div className="w-1/2 text-left">
          <h1 className="text-6xl font-bold mb-8 text-gray-800 leading-tight">
            Emotions guide you.
            Toweel help you listen.
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Sometimes, it's hard to put your feelings into words. Talk to Towheel, name, and understand what you're feeling.
          </p>

          <div className="flex flex-row gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-lg"
            >
              Talk to Toweel
            </button>
            <button
              onClick={onExplore}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-lg"
            >
              Let me Explore
            </button>
          </div>
        </div>

        {/* Right side - Banner Image */}
        <div className="w-2/3 flex justify-center">
          <img 
            src={BannerImage} 
            alt="Emotion Wheel Banner" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
    </div>
  )
}

export default ProductIntroModal 