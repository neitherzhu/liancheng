export type Question = {
  id: number
  question: string
  answer: number | string
}

// { label: '1+1=', value: 1 },
// { label: '( )+1=2', value: 2 },
// { label: '1+( )=2', value: 3 },
// { label: '1○1=2', value: 4 },
// { label: '1○1=2○0', value: 5 },
// { label: '最小能填几', value: 6 },
// { label: '最大能填几', value: 7 },
export type QuestionType = 1 | 2 | 3 | 4 | 5 | 6 | 7

const getValidateFormula = ({
  maxScore,
  mixCount
}: {
  maxScore: number
  mixCount: number
}): { numbers: number[]; operators: string[]; answer: number | string } => {
  const num1 = Math.floor(Math.random() * maxScore) + 1
  let numbers = [num1]
  let operators = []
  let i = 1
  let answer: string | number = num1

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

  return { numbers, operators, answer }
}

const getFormulaByAnswer = ({
  maxScore,
  answer
}: {
  maxScore: number
  answer: number
}): { numbers: number[]; operators: string[] } => {
  while (true) {
    let numbers = []
    let operators = []
    const num1 = Math.floor(Math.random() * maxScore) + 1
    let operator = ''
    let num2
    if (answer > num1) {
      operator = '+'
      num2 = answer - num1
    } else {
      operator = '-'
      num2 = num1 - answer
    }

    const r = getAnswer(operator, num1, num2, maxScore)

    if (r.valid) {
      numbers = [num1, num2]
      operators = [operator]
      return { numbers, operators }
    }
  }
}

const genrateCircle = ({
  numbers,
  operators
}: {
  numbers: number[]
  operators: string[]
}) => {
  let str = ''
  numbers.forEach((num, i) => {
    if (i === 0) {
      str += `${num} ○ `
    } else if (i === numbers.length - 1) {
      str += `${num}`
    } else {
      str += `${num} ${operators[i]} `
    }
  })

  return str
}

export const genrateRandomMathQuestions = ({
  maxScore, // 最大结果
  count = 100, // 生成数量
  mixCount = 2, // 混合数量
  type = 1 // 题型
}: {
  maxScore: number
  count?: number
  mixCount?: number
  type?: QuestionType
}): Question[] => {
  const questions = []
  let c = 0
  while (c < count) {
    let { numbers, operators, answer } = getValidateFormula({
      maxScore,
      mixCount
    })

    let q = ''
    const params = { numbers, operators, answer, maxScore }
    if (type === 1) {
      q = genrateNormalQuestion(params)
    } else if (type === 2) {
      q = genrateLeftBracketsQuestion(params)
      answer = numbers[0]
    } else if (type === 3) {
      q = genrateRightBracketsQuestion(params)
      answer = numbers[numbers.length - 1]
    } else if (type === 4) {
      q = genrateLeftCirckeQuestion(params)
      answer = operators[0]
    } else if (type === 5) {
      q = genrateBothCirckeQuestion(params)
      answer = operators[0]
    } else if (type === 6) {
      q = genrateMinQuestion(params)
    } else if (type === 7) {
      q = genrateMaxQuestion(params)
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
  } else if (result.answer < 0) {
    result.valid = false
    return result
  }

  return result
}

type GenrateQuestionParam = {
  numbers: number[]
  operators: string[]
  answer: number | string
  maxScore: number
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

const genrateLeftCirckeQuestion = ({
  numbers,
  operators,
  answer
}: GenrateQuestionParam): string => {
  let str = ''

  numbers.forEach((num, i) => {
    if (i === 0) {
      str += `${num} ○ `
    } else if (i === numbers.length - 1) {
      str += `${num} = ${answer}`
    } else {
      str += `${num} ${operators[i]} `
    }
  })
  return str
}

const genrateBothCirckeQuestion = ({
  numbers,
  operators,
  answer,
  maxScore
}: GenrateQuestionParam): string => {
  const { numbers: rightNumbers, operators: rightOperators } =
    getFormulaByAnswer({ maxScore, answer: answer as number })
  let left = genrateCircle({ numbers, operators })
  let right = genrateCircle({
    numbers: rightNumbers,
    operators: rightOperators
  })

  return left + ' = ' + right
}

const genrateMinQuestion = ({
  numbers,
  operators,
  answer
}: GenrateQuestionParam): string => {
  let str = ''

  if (operators[0] === '+') {
    str = `${numbers[0]} + ○ > ${answer}`
  } else if (operators[0] === '-') {
    str = `${numbers[0]} -  ○ < ${answer}`
  }
  return str
}

const genrateMaxQuestion = ({
  numbers,
  operators,
  answer
}: GenrateQuestionParam): string => {
  let str = ''

  if (operators[0] === '+') {
    str = `${numbers[0]} + ○ < ${answer}`
  } else if (operators[0] === '-') {
    str = `${numbers[0]} -  ○ > ${answer}`
  }
  return str
}

export const isValidNumber = (n: string | number) => {
  const num = Number(n)
  return num && !isNaN(num)
}
