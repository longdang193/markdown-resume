import type { ResumeStyles } from '~/types'
import defaultResumeMarkdown from '~/assets/default-resume.md?raw'
import defaultCvCss from '~/assets/css/default-cv.css?raw'
import { SYSTEM_CJK_FONT_FAMILY } from './data'

export const DEFAULT_NAME = 'My Resume'

export const DEFAULT_STYLES = {
  marginV: 45,
  marginH: 35,
  lineHeight: 1.25,
  paragraphSpace: 10,
  themeColor: '#377BB5',
  fontCJK: {
    name: 'System CJK',
    fontFamily: SYSTEM_CJK_FONT_FAMILY,
  },
  fontEN: {
    name: 'Inter',
    fontFamily: 'Inter',
  },
  fontSize: 12,
  paper: 'A4',
} as ResumeStyles

export const DEFAULT_MD_CONTENT = defaultResumeMarkdown

export const PREVIEW_SELECTOR = '#vue-smart-pages-preview'

export const DEFAULT_CSS_CONTENT = defaultCvCss
