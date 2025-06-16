import LogoImage1 from '../assets/LogoImage1.png'
import LogoImage4 from '../assets/LogoImage4.png'
import Eleanor from '../assets/Eleanor.png'
import Lizard from '../assets/Lizard.png'
import Qing from '../assets/Qing.png'
import Navbar from '../components/navbar/Navbar'

function Info() {
  return (
    <div>
      <Navbar />
      {/* About Section */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <img src={LogoImage4} alt="Illustration" className="mb-8 w-80 h-auto" />
          <h2 className="text-2xl font-bold mb-4">About toweel</h2>
          <p className="text-gray-700 text-base leading-relaxed max-w-xl text-center">
            Every emotion carries meaning, even the messy, confusing, or quiet ones. When you pause to listen, reflect, and name what you're feeling, you begin to understand yourself more deeply.
          </p>
        </div>
        <div className="text-gray-700 text-base leading-relaxed space-y-4 max-w-2xl mx-auto">
          <p>
            Toweel helps you do just that.
          </p>
          <p>
            Using our interactive Emotion Wheel, AI-assisted emotion discovery, and a growing library of emotion cards, Toweel supports you in exploring what's really going on beneath the surface. Whether you're feeling overwhelmed, uncertain, or simply curious, Toweel meets you where you are.
          </p>
          <p>
            Toweel isn't about fixing how you feel. It's about listening, naming, and finding your own way forward — one emotion at a time.
          </p>

          <p className="font-semibold">Disclaimer</p>
          <p>
            Toweel is not a medical or mental health service. The content, tools, and suggestions provided by Toweel are designed to support emotional reflection and self-awareness — not to diagnose, treat, or manage any mental health condition.
          </p>
          <p>
            If you are experiencing intense emotional distress, harmful thoughts, or a mental health crisis, please seek help from a qualified healthcare professional or contact your local emergency services or crisis support line.
          </p>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <img src={LogoImage1} alt="Illustration" className="mx-auto mb-8 w-100 h-auto" />
          <h2 className="text-2xl font-bold mb-6">Who We Are</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 text-center">
            <div>
              <img src={Eleanor} alt="Jingchang" className="mx-auto mb-2 w-40 h-40 object-cover" />
              <p className="font-semibold">Jingchang</p>
              <p className="text-sm text-gray-600">Back-end Engineer</p>
            </div>
            <div>
              <img src={Lizard} alt="Yufei" className="mx-auto mb-2 w-40 h-40 object-cover" />
              <p className="font-semibold">Yufei</p>
              <p className="text-sm text-gray-600">Front-end Engineer</p>
            </div>
            <div>
              <img src={Qing} alt="Qing" className="mx-auto mb-2 w-40 h-40 object-cover" />
              <p className="font-semibold">Qing</p>
              <p className="text-sm text-gray-600">Product Designer</p>
            </div>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            We're a small, independent team of girls based across Europe, building Toweel with care, empathy, and a deep belief in the power of emotional understanding.
            <br /><br />
            We're currently exploring job and collaboration opportunities in tech, mental wellness, AI application, and creative technology.
            <br /><br />
            If our work resonates with you, or if you have any questions or suggestions, we'd love to hear from you.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Info