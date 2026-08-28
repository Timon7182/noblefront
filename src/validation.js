/** Казахстанский номер: хранится как +77XXXXXXXXX, показывается как +7 (7XX) XXX-XX-XX. */

export function digitsOf(value) {
  return (value || '').replace(/\D/g, '')
}

/** Приводит любой ввод к 11 цифрам, начинающимся с 7. */
export function normalizePhoneDigits(value) {
  let digits = digitsOf(value)

  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
  if (!digits.startsWith('7')) digits = `7${digits}`

  return digits.slice(0, 11)
}

export function formatPhone(value) {
  const digits = normalizePhoneDigits(value)
  if (digits.length <= 1) return '+7 ('

  const body = digits.slice(1)
  let out = '+7 ('

  out += body.slice(0, 3)
  if (body.length >= 3) out += ') '
  if (body.length > 3) out += body.slice(3, 6)
  if (body.length > 6) out += `-${body.slice(6, 8)}`
  if (body.length > 8) out += `-${body.slice(8, 10)}`

  return out
}

export function isPhoneComplete(value) {
  return normalizePhoneDigits(value).length === 11
}

/** Телефон в виде, который ждёт бэкенд. */
export function phoneForApi(value) {
  return `+${normalizePhoneDigits(value)}`
}

export function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test((value || '').trim())
}

export function isNameValid(value) {
  return (value || '').trim().length >= 2
}
