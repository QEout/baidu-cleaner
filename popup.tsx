import { useEffect, useState } from "react"

// 定义设置类型
interface Settings {
  autoHideHotSearch: boolean
  showControlButton: boolean
  autoHideAd: boolean
}

// 默认设置
const defaultSettings: Settings = {
  autoHideHotSearch: true,
  showControlButton: true,
  autoHideAd: true
}

// 样式对象
const styles = {
  container: {
    padding: "20px",
    width: 320,
    fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
  },
  header: {
    color: "#4e6ef2",
    marginTop: 0,
    marginBottom: 20,
    fontSize: "22px",
    textAlign: "center" as const,
    fontWeight: 600
  },
  optionsContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
  },
  optionLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0"
  },
  optionLabelLast: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0"
  },
  checkbox: {
    marginRight: 10,
    width: 18,
    height: 18,
    accentColor: "#4e6ef2"
  },
  button: {
    backgroundColor: "#4e6ef2",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
    display: "block",
    width: "100%",
    fontSize: "15px",
    fontWeight: 500,
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#3d5bd9"
    }
  },
  status: {
    color: "#4e6ef2",
    textAlign: "center" as const,
    marginTop: 12,
    fontWeight: 500
  },
  footer: {
    fontSize: 12,
    color: "#666",
    textAlign: "center" as const,
    marginTop: 16
  }
}

function IndexPopup() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [status, setStatus] = useState<string>("")

  // 加载保存的设置
  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      setSettings(items as Settings)
    })
  }, [])

  // 更新设置
  const updateSetting = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    chrome.storage.sync.set(newSettings, () => {
      setStatus("设置已更新，刷新页面后生效")
      setTimeout(() => setStatus(""), 2000)
    })
  }

  // 打开选项页面
  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>净化百度</h2>

      <div style={styles.optionsContainer}>
        <label style={styles.optionLabel}>
          <span>自动屏蔽热搜榜</span>
          <input
            type="checkbox"
            checked={settings.autoHideHotSearch}
            onChange={(e) =>
              updateSetting("autoHideHotSearch", e.target.checked)
            }
            style={styles.checkbox}
          />
        </label>
        <label style={styles.optionLabel}>
          <span>自动屏蔽广告</span>
          <input
            type="checkbox"
            checked={settings.autoHideAd}
            onChange={(e) => updateSetting("autoHideAd", e.target.checked)}
            style={styles.checkbox}
          />
        </label>
        <label style={styles.optionLabelLast}>
          <span>显示控制按钮</span>
          <input
            type="checkbox"
            checked={settings.showControlButton}
            onChange={(e) =>
              updateSetting("showControlButton", e.target.checked)
            }
            style={styles.checkbox}
          />
        </label>
      </div>

      <button onClick={openOptions} style={styles.button}>
        高级设置
      </button>

      {status && <p style={styles.status}>{status}</p>}

      <p style={styles.footer}>版本 1.3.0</p>
    </div>
  )
}

export default IndexPopup
