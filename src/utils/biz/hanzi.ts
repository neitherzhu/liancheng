import { FIRST_GRADE_TEXT } from '@/constants/hanzi'

export const genrateRandomHanziQuestions = ({
  count,
  cache
}: {
  count: number
  cache: string
}) => {
  const questions = []
  const len = FIRST_GRADE_TEXT.length
  let m: Record<string, number> = {}

  if (cache) {
    m = cache.split('').reduce((o, x) => {
      o[x] = 1
      return o
    }, m)
  }

  debugger
  while (questions.length < count) {
    const i = Math.floor(Math.random() * len)
    const t = FIRST_GRADE_TEXT[i]

    if (!m[t]) {
      questions.push(t)
      m[t] = 1
    }
  }

  debugger

  return questions
}
