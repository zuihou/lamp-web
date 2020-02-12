import commonApi from '@/api/Common'
import dictionaryItemApi from '@/api/DictionaryItem'

export const loadEnums = (codes, enums = {}, service = 'authority') => {
  if (typeof (codes) === 'string') {
    codes = [codes]
  }

  if (codes && codes.length > 0) {
    commonApi.enums({codes: codes}, service).then(response => {
      const res = response.data
      for (const code of codes) {
        enums[code] = res.data[code]
      }
    })
  }
}

export const initEnums = (codes, enums = {}) => {
  loadEnums(codes, enums, 'authority')
}

export const initFileEnums = (codes, enums = {}) => {
  loadEnums(codes, enums, 'file')
}
export const initMsgsEnums = (codes, enums = {}) => {
  loadEnums(codes, enums, 'msgs')
}

export const initDicts = (codes, dicts = {}) => {
  if (typeof (codes) === 'string') {
    codes = [codes]
  }

  if (codes && codes.length > 0) {
    dictionaryItemApi.list({codes: codes}).then(response => {
      const res = response.data
      for (const code of codes) {
        dicts[code] = res.data[code]
      }
    })
  }
}
