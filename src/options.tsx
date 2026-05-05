import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"
import { authenticate, removeCachedAuthToken } from "~utils/googleAuth"
import "~style.css"

function OptionsIndex() {
  const [quoteLang, setQuoteLang] = useStorage("quoteLang", "vn")
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    authenticate(false).then((t) => {
      if (t) setToken(t);
    });
  }, []);

  const handleLogin = async () => {
    const t = await authenticate(true);
    if (t) setToken(t);
  };

  const handleLogout = async () => {
    if (token) {
      await removeCachedAuthToken(token);
      setToken(null);
    }
  };

  return (
    <div className="plasmo-p-8 plasmo-min-h-screen bg-2">
      <div className="plasmo-max-w-2xl plasmo-mx-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-xl plasmo-shadow">
        <h1 className="plasmo-text-2xl plasmo-font-bold text-color-1 plasmo-mb-6">
          Cài đặt (Settings)
        </h1>
        
        <div className="plasmo-space-y-6">
          <div>
            <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3 text-color-2">
              Ngôn ngữ trích dẫn (Quote Language)
            </h2>
            <div className="plasmo-flex plasmo-flex-col plasmo-gap-3">
              <label className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-cursor-pointer">
                <input 
                  type="radio" 
                  name="quoteLang" 
                  value="vn" 
                  checked={quoteLang === "vn"} 
                  onChange={(e) => setQuoteLang(e.target.value)}
                  className="plasmo-w-4 plasmo-h-4 plasmo-accent-[#c01800]"
                />
                <span className="plasmo-text-gray-700">Tiếng Việt</span>
              </label>
              <label className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-cursor-pointer">
                <input 
                  type="radio" 
                  name="quoteLang" 
                  value="en" 
                  checked={quoteLang === "en"} 
                  onChange={(e) => setQuoteLang(e.target.value)}
                  className="plasmo-w-4 plasmo-h-4 plasmo-accent-[#c01800]"
                />
                <span className="plasmo-text-gray-700">English</span>
              </label>
              <label className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-cursor-pointer">
                <input 
                  type="radio" 
                  name="quoteLang" 
                  value="cn" 
                  checked={quoteLang === "cn"} 
                  onChange={(e) => setQuoteLang(e.target.value)}
                  className="plasmo-w-4 plasmo-h-4 plasmo-accent-[#c01800]"
                />
                <span className="plasmo-text-gray-700">中文 (Chinese)</span>
              </label>
            </div>
          </div>

          <div className="plasmo-border-t plasmo-border-gray-200 plasmo-pt-6">
            <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-3 text-color-2">
              Tài khoản Google Calendar
            </h2>
            <div className="plasmo-flex plasmo-items-center plasmo-gap-4">
              {token ? (
                <>
                  <span className="plasmo-text-green-600 plasmo-font-medium">Đã kết nối</span>
                  <button 
                    onClick={handleLogout}
                    className="plasmo-bg-red-500 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-lg hover:plasmo-bg-red-600 plasmo-transition-colors"
                  >
                    Ngắt kết nối
                  </button>
                </>
              ) : (
                <>
                  <span className="plasmo-text-gray-500">Chưa kết nối</span>
                  <button 
                    onClick={handleLogin}
                    className="plasmo-bg-blue-500 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded-lg hover:plasmo-bg-blue-600 plasmo-transition-colors"
                  >
                    Kết nối ngay
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default OptionsIndex
