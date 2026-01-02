import '../shared/theme.css'
import './styles.css'
import appsData from './apps.json'

interface App {
  id: string
  name: string
  description: string
  icon: string
  path: string
}

function createAppCard(app: App): HTMLElement {
  const card = document.createElement('a')
  card.href = app.path
  card.className = 'app-card card'

  card.innerHTML = `
    <span class="app-icon">${app.icon}</span>
    <h2 class="app-name">${app.name}</h2>
    <p class="app-description">${app.description}</p>
    <span class="app-link">Mở app →</span>
  `

  return card
}

function renderApps(): void {
  const grid = document.getElementById('apps-grid')
  if (!grid) return

  const apps = appsData.apps as App[]

  if (apps.length === 0) {
    grid.innerHTML = '<p class="no-apps">Chưa có app nào.</p>'
    return
  }

  apps.forEach((app) => {
    grid.appendChild(createAppCard(app))
  })
}

// Initialize
renderApps()
