export type Question = {
  id: number
  question: string
  answer: number
}

export const genrateRandomMathQuestions = ({
  maxScore, // 最大结果
  count = 100, // 生成数量
  upset = false, // 是否打乱
  mixCount = 2, // 混合数量
  normal = false // 正常模式
}: {
  maxScore: number
  count?: number
  upset?: boolean
  mixCount?: number
  normal?: boolean
}): Question[] => {
  const questions = []
  let c = 0
  while (c < count) {
    const num1 = Math.floor(Math.random() * maxScore) + 1
    let numbers = [num1]
    let operators = []
    let i = 1
    let answer = num1

    while (i < mixCount) {
      const num = Math.floor(Math.random() * maxScore) + 1
      const operator = Math.random() < 0.5 ? '+' : '-'
      const r = getAnswer(operator, answer, num, maxScore)

      if (!r.valid) continue

      numbers.push(num)
      operators.push(operator)
      answer = r.answer
      i++
    }

    let q = ''

    if (normal) {
      q = genrateNormalQuestion({ numbers, operators, answer })
    } else {
      const r = Math.random()

      if (upset ? r < 0.5 : c < count * 0.6) {
        q = genrateNormalQuestion({ numbers, operators, answer })
      } else if (upset ? r < 0.7 : c < count * 0.8) {
        q = genrateLeftBracketsQuestion({ numbers, operators, answer })
        answer = numbers[0]
      } else {
        q = genrateRightBracketsQuestion({ numbers, operators, answer })
        answer = numbers[numbers.length - 1]
      }
    }

    const question = {
      id: c + 1,
      question: q,
      answer
    }
    questions.push(question)

    c++
  }

  return questions
}

const getAnswer = (
  operator: string,
  num1: number,
  num2: number,
  maxScore: number
): { valid: boolean; answer: number } => {
  const result = {
    valid: true,
    answer: 0
  }
  // 排除小数减大数
  if (operator === '-' && num1 < num2) {
    result.valid = false
    return result
  }

  if (operator === '-') {
    result.answer = num1 - num2
  } else if (operator === '+') {
    result.answer = num1 + num2
  } else {
    result.valid = false
    return result
  }

  // 排除计算结果大于maxScore
  if (result.answer > maxScore) {
    result.valid = false
    return result
  }

  return result
}

type GenrateQuestionParam = {
  numbers: number[]
  operators: string[]
  answer: number
}
const genrateNormalQuestion = ({
  numbers,
  operators
}: GenrateQuestionParam): string => {
  let str = ''

  numbers.forEach((num, i) => {
    // 最后一个
    if (i === numbers.length - 1) {
      str += `${num} =   `
    } else {
      str += `${num} ${operators[i]} `
    }
  })
  return str
}

const genrateLeftBracketsQuestion = ({
  numbers,
  operators,
  answer
}: GenrateQuestionParam): string => {
  let str = ''

  numbers.forEach((num, i) => {
    if (i === 0) {
      str += `(  ) ${operators[i]} `
    } else if (i === numbers.length - 1) {
      str += `${num} = ${answer}`
    } else {
      str += `${num} ${operators[i]} `
    }
  })
  return str
}

const genrateRightBracketsQuestion = ({
  numbers,
  operators,
  answer
}: GenrateQuestionParam): string => {
  let str = ''

  numbers.forEach((num, i) => {
    if (i === numbers.length - 1) {
      str += `(  ) = ${answer}`
    } else {
      str += `${num} ${operators[i]} `
    }
  })
  return str
}

export const isValidNumber = (n: string | number) => {
  const num = Number(n)
  return num && !isNaN(num)
}
