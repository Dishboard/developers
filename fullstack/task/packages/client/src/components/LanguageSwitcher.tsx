import { Dispatch, FC, SetStateAction } from "react"

type LanguageSwitcherProps = {
  selectedLanguage: string
  setSelectedLanguage: Dispatch<SetStateAction<"EN" | "CZ">>
}

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  selectedLanguage,
  setSelectedLanguage
}) => {
  return (
    <div className="flex flex-row justify-center select-none">
      <div className="flex flex-row items-center right-1 ">
        <button className={`border-rounded-lg p-2 flex flex-row items-center border border-gray-300 text-sm font-medium text-gray-700 ${selectedLanguage === "EN" ? "bg-gray-700 text-black" : ""} hover:bg-gray-700 focus:bg-gray-700 focus:outline-none `}
          onClick={() => setSelectedLanguage("EN")}
        >
          <span className="text-md text-white">EN</span>
          <span className="ml-1"><img src="https://img.icons8.com/?size=512&id=t3NE3BsOAQwq&format=png" className="w-5 h-5" /></span>
        </button>
        <button className={`p-2 flex flex-row items-center border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none hover:text-black ${selectedLanguage === "CZ" ? "bg-gray-700 text-black" : ""}`}
          onClick={() => setSelectedLanguage("CZ")}
        >
          <span className="text-md text-white">CZ</span>
          <span className="ml-1"> <img src="https://img.icons8.com/?size=100&id=UkXHA2CvYpf3&format=png&color=000000" className="w-5 h-5" /></span>
        </button>
      </div>
    </div>
  )
}

export default LanguageSwitcher