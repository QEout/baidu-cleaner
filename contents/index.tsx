import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

// 限制内容脚本只在百度搜索页面执行
export const config: PlasmoCSConfig = {
  matches: ["*://www.baidu.com/*"],
  all_frames: true
}

// 定义设置类型
interface Settings {
  autoHideHotSearch: boolean
  showControlButton: boolean
  autoHideAd: boolean
}

// 按钮样式
const buttonStyle = {
  position: "fixed",
  bottom: "10px",
  zIndex: 9999,
  padding: "5px 10px",
  backgroundColor: "#4e6ef2",
  color: "#fff",
  boxShadow: "0 0 6px 0 rgba(0, 0, 0, 0.2)",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",

} as const

// 默认设置
const defaultSettings: Settings = {
  autoHideHotSearch: true,
  showControlButton: true,
  autoHideAd: true
}

// 内容脚本主组件
function HotSearchBlocker() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [hotSearchVisible, setHotSearchVisible] = useState(false)
  const [adVisible, setAdVisible] = useState(false)

  // 隐藏热搜榜元素
  const hideHotSearchElements = () => {
    // 通用选择器
    const selectors = ["#con-ar"]

    // 查找并隐藏符合选择器的元素
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element) => {
        ;(element as HTMLElement).style.display = "none"
      })
    })
  }

  // 显示热搜榜元素
  const showHotSearchElements = () => {
    document.querySelectorAll("#con-ar").forEach((el) => {
      ;(el as HTMLElement).style.display = ""
    })
  }

  // 切换热搜榜显示状态
  const toggleHotSearch = () => {
    const newVisibility = !hotSearchVisible
    setHotSearchVisible(newVisibility)

    if (newVisibility) {
      showHotSearchElements()
    } else {
      hideHotSearchElements()
    }
  }

  // 切换广告显示状态
  const toggleAd = () => {
    const newVisibility = !adVisible
    setAdVisible(newVisibility)

    if (newVisibility) {
      showAdElements()
    } else {
      hideAdElements()
    }
  }

  // 显示广告元素
  const showAdElements = () => {
    // 广告相关的选择器
    const adSelectors = [
      ".new-pmd .ec-tuiguang",
      ".ec_ad_results",
      ".ec_wise_ad",
      ".ec_wise_ad_results",
      ".ec_wise_ad_results_top",
      ".ec_wise_ad_results_bottom"
    ]

    adSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element) => {
        const container = element.closest(".new-pmd")
        if (container) {
          ;(container as HTMLElement).style.display = ""
        }
      })
    })
  }

  // 隐藏广告元素
  const hideAdElements = () => {
    // 广告相关的选择器
    const adSelectors = [
      ".new-pmd .ec-tuiguang",
      ".ec_ad_results",
      ".ec_wise_ad",
      ".ec_wise_ad_results",
      ".ec_wise_ad_results_top",
      ".ec_wise_ad_results_bottom"
    ]

    adSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element) => {
        const container = element.closest(".new-pmd")
        if (container) {
          ;(container as HTMLElement).style.display = "none"
        }
      })
    })
  }

  // 更新元素显示状态
  const updateElementsVisibility = () => {
    if (settings.autoHideHotSearch && !hotSearchVisible) {
      hideHotSearchElements()
    } else if (hotSearchVisible) {
      showHotSearchElements()
    }
    if (settings.autoHideAd && !adVisible) {
      hideAdElements()
    } else if (adVisible) {
      showAdElements()
    }
  }

  // 初始化热搜屏蔽功能
  const initHotSearchBlocker = () => {
    updateElementsVisibility()
    const interval = setInterval(updateElementsVisibility, 3000)
    return () => clearInterval(interval)
  }

  // 监听DOM变化
  const observeDOMChanges = () => {
    const observer = new MutationObserver(updateElementsVisibility)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    return () => observer.disconnect()
  }

  // 加载设置
  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      setSettings(items as Settings)
      setHotSearchVisible(!items.autoHideHotSearch)
      setAdVisible(!items.autoHideAd)
    })
  }, [])

  // 初始化和监听DOM变化
  useEffect(() => {
    const cleanupBlocker = initHotSearchBlocker()
    const cleanupObserver = observeDOMChanges()

    return () => {
      cleanupBlocker()
      cleanupObserver()
    }
  }, [settings, hotSearchVisible, adVisible])

  // 渲染控制按钮
  if (!settings.showControlButton) return null

  return (
    <div>
      <button
        onClick={toggleAd}
        style={{
          ...buttonStyle,
          right: "80px"
        }}>
        {adVisible ? "广告√" : "广告×"}
      </button>
      <button
        onClick={toggleHotSearch}
        style={{
          ...buttonStyle,
          right: "10px"
        }}>
        {hotSearchVisible ? "热搜√" : "热搜×"}
      </button>
    </div>
  )
}

export default HotSearchBlocker
