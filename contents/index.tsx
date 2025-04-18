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
}

// 默认设置
const defaultSettings: Settings = {
  autoHideHotSearch: true,
  showControlButton: true
}

// 内容脚本主组件
function HotSearchBlocker() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [hotSearchVisible, setHotSearchVisible] = useState(false)

  // 隐藏热搜榜元素
  const hideHotSearchElements = () => {
    // 通用选择器
    const selectors = [
      '#con-ar'
    ]
    
    // 查找并隐藏符合选择器的元素
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        ;(element as HTMLElement).style.display = 'none'
      })
    })
  }

  // 显示热搜榜元素
  const showHotSearchElements = () => {
    document.querySelectorAll('#con-ar').forEach(el => {
      ;(el as HTMLElement).style.display = ''
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

  // 监听DOM变化
  const observeDOMChanges = () => {
    const observer = new MutationObserver(() => {
      if (settings.autoHideHotSearch && !hotSearchVisible) {
        hideHotSearchElements()
      } else if (hotSearchVisible) {
        showHotSearchElements()
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    // 清理函数
    return () => observer.disconnect()
  }

  // 初始化热搜屏蔽功能
  const initHotSearchBlocker = () => {
    // 根据当前状态决定是隐藏还是显示热搜榜
    if (settings.autoHideHotSearch && !hotSearchVisible) {
      hideHotSearchElements()
    } else if (hotSearchVisible) {
      showHotSearchElements()
    }
    
    // 定期检查新加载的元素
    const interval = setInterval(() => {
      if (settings.autoHideHotSearch && !hotSearchVisible) {
        hideHotSearchElements()
      } else if (hotSearchVisible) {
        showHotSearchElements()
      }
    }, 1000)
    
    // 清理函数
    return () => clearInterval(interval)
  }

  // 加载设置
  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      setSettings(items as Settings)
      setHotSearchVisible(!items.autoHideHotSearch)
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
  }, [settings, hotSearchVisible])

  // 渲染控制按钮
  if (!settings.showControlButton) return null

  return (
    <button
      onClick={toggleHotSearch}
      style={{
        position: 'fixed',
        right: '10px',
        bottom: '10px',
        zIndex: 9999,
        padding: '5px 10px',
        backgroundColor: '#4e6ef2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif"
      }}>
      {hotSearchVisible ? '隐藏热搜' : '显示热搜'}
    </button>
  )
}

export default HotSearchBlocker 