export const KF_ACCENT_DEEP = '#d4714e'
export const KF_ACCENT = '#e88d6e'
export const KF_BG_CREAM = '#efe9dd'
export const KF_BG_DEEP = '#1d3f3a'
export const KF_TEXT_DARK = '#1a3530'
export const KF_TEXT_MUTED = '#6e6855'

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function renderRich(text: string) {
  return escapeHtml(text)
    .replace(/\{([^}]+)\}/g, `<span style="color:${KF_ACCENT_DEEP}">$1</span>`)
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}
