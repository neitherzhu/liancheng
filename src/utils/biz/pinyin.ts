import {
  YM_LIST,
  SM_LIST,
  ZT_LIST,
  DOUBLE_BLACK_MAP,
  JM_LIST,
  TRIPLE_WITH_MAP
} from '@/constants/py'

export const genrateRandomPinyinQuestions = ({
  ym,
  sm,
  zt,
  dpy,
  tpy,
  count = 30
}: {
  ym: boolean
  sm: boolean
  zt: boolean
  dpy: boolean
  tpy: boolean
  count: number
}) => {
  const questions = []
  const m: Record<string, boolean> = {}
  while (questions.length < count) {
    const r = Math.random()
    let list
    let q = ''
    if (ym && r < 0.2) {
      list = YM_LIST[Math.floor(Math.random() * YM_LIST.length)]
      q = list[Math.floor(Math.random() * list.length)]
    } else if (sm && r < 0.4) {
      q = SM_LIST[Math.floor(Math.random() * SM_LIST.length)]
    } else if (zt && r < 0.6) {
      list = ZT_LIST[Math.floor(Math.random() * ZT_LIST.length)]
      q = list[Math.floor(Math.random() * list.length)]
    } else if (dpy && r < 0.8) {
      q = genrateRandomDoublePinyinQuestions()
    } else if (tpy && r < 1) {
      q = genrateRandomTruplePinyinAnswer()
    }

    if (!m[q]) {
      m[q] = true
      questions.push(q)
    }
  }

  return questions
}

// 双拼音节
export const genrateRandomDoublePinyinQuestions = () => {
  let question = ''
  const ymList = YM_LIST.map(x => x[0])
  // 随机生成一个声母
  const sm = SM_LIST[Math.floor(Math.random() * SM_LIST.length)]
  while (!question) {
    const ymIndex = Math.floor(Math.random() * ymList.length)
    const ym = ymList[ymIndex]
    if (!DOUBLE_BLACK_MAP[sm]?.includes(ym)) {
      const ymArr = YM_LIST[ymIndex]
      question =
        sm + ymArr[Math.max(1, Math.floor(Math.random() * ymArr.length))]
    }
  }

  return question
}

// 三拼音节
export const genrateRandomTruplePinyinAnswer = () => {
  let question = ''
  const jm = JM_LIST[Math.floor(Math.random() * JM_LIST.length)]

  if (!TRIPLE_WITH_MAP[jm]) return question

  const map = TRIPLE_WITH_MAP[jm]
  const ymList = Object.keys(map)
  const ym = ymList[Math.floor(Math.random() * ymList.length)]
  const sm = map[ym][Math.floor(Math.random() * map[ym].length)]
  const ymWithToneList = YM_LIST.find(x => x[0] === ym)!.slice(1)
  const finalYm =
    ymWithToneList[Math.floor(Math.random() * ymWithToneList.length)]

  return sm + jm + finalYm
}
