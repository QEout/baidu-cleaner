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

// 选项页面样式
const styles = {
  container: {
    fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
    maxWidth: '700px',
    margin: '0 auto',
    padding: '30px 20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  header: {
    color: '#4e6ef2',
    textAlign: 'center' as const,
    fontSize: '28px',
    fontWeight: 600,
    marginBottom: '30px'
  },
  optionContainer: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '30px',
    border: '1px solid #eaeaea'
  },
  optionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  optionRowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 0'
  },
  optionContent: {
    flex: 1
  },
  optionTitle: {
    margin: '0 0 6px 0',
    fontSize: '18px',
    fontWeight: 500,
    color: '#333'
  },
  optionDescription: {
    margin: 0,
    color: '#666',
    fontSize: '14px'
  },
  buttonContainer: {
    textAlign: 'center' as const,
    marginBottom: '20px'
  },
  button: {
    backgroundColor: '#4e6ef2',
    color: 'white',
    border: 'none',
    padding: '12px 22px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(78, 110, 242, 0.3)'
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '30px',
    color: '#888',
    fontSize: '13px',
    padding: '10px 0',
    borderTop: '1px solid #eee'
  },
  status: {
    color: '#4e6ef2',
    textAlign: 'center' as const,
    marginTop: '15px',
    fontSize: '15px',
    fontWeight: 500,
    animation: 'fadeIn 0.5s'
  },
  logo: {
    textAlign: 'center' as const,
    marginBottom: '15px'
  },
  logoImg: {
    width: '64px',
    height: '64px'
  }
}

// 开关组件
function Switch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label style={{
      position: 'relative',
      display: 'inline-block',
      width: '56px',
      height: '28px'
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          opacity: 0,
          width: 0,
          height: 0
        }}
      />
      <span style={{
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? '#4e6ef2' : '#ccc',
        transition: '.3s',
        borderRadius: '28px',
        boxShadow: checked ? '0 0 5px rgba(78, 110, 242, 0.5)' : 'none'
      }}>
        <span style={{
          position: 'absolute',
          content: '""',
          height: '20px',
          width: '20px',
          left: checked ? '32px' : '4px',
          bottom: '4px',
          backgroundColor: 'white',
          transition: '.3s',
          borderRadius: '50%',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
        }} />
      </span>
    </label>
  )
}

// 选项页面组件
function OptionsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [saveStatus, setSaveStatus] = useState<string>("")

  // 加载保存的设置
  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      setSettings(items as Settings)
    })
  }, [])

  // 保存设置
  const saveSettings = () => {
    chrome.storage.sync.set(settings, () => {
      setSaveStatus("✅ 设置已保存")
      setTimeout(() => setSaveStatus(""), 2000)
    })
  }

  // 更新设置
  const updateSetting = (key: keyof Settings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>百度搜索净化器</h1>
      
      <div style={styles.optionContainer}>
        <div style={styles.optionRow}>
          <div style={styles.optionContent}>
            <h3 style={styles.optionTitle}>自动屏蔽热搜榜</h3>
            <p style={styles.optionDescription}>访问百度时自动隐藏右侧热搜榜</p>
          </div>
          <Switch 
            checked={settings.autoHideHotSearch} 
            onChange={(checked) => updateSetting('autoHideHotSearch', checked)} 
          />
        </div>
        
        <div style={styles.optionRow}>
          <div style={styles.optionContent}>
            <h3 style={styles.optionTitle}>自动屏蔽广告</h3>
            <p style={styles.optionDescription}>自动隐藏百度搜索结果中的广告</p>
          </div>
          <Switch
            checked={settings.autoHideAd}
            onChange={(checked) => updateSetting('autoHideAd', checked)}
          />
        </div>
        
        <div style={styles.optionRowLast}>
          <div style={styles.optionContent}>
            <h3 style={styles.optionTitle}>显示控制按钮</h3>
            <p style={styles.optionDescription}>在页面右下角显示开关按钮</p>
          </div>
          <Switch 
            checked={settings.showControlButton} 
            onChange={(checked) => updateSetting('showControlButton', checked)} 
          />
        </div>
      </div>
      
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={saveSettings}>
          保存设置
        </button>
        {saveStatus && <p style={styles.status}>{saveStatus}</p>}
      </div>
      
      <div style={styles.footer}>
        <p>净化百度 v1.3.0 | 让你专注于搜索结果</p>
      </div>
    </div>
  )
}

export default OptionsPage 