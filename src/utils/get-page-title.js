import i18n from '@/lang'
import { title } from '@/settings'

const t = title

export default function getPageTitle(key) {
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${t}`
  }
  return `${t}`
}
