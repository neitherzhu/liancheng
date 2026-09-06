export interface Question {
  id: number;
  question: string;
  answer: number | string;
  mixCount?: number;
  isInteger?: boolean;
}

// { label: '1+1=', value: 1 },
// { label: '( )+1=2', value: 2 },
// { label: '1○1=2', value: 4 },
// { label: '1○1=2○0', value: 5 },
// { label: '最小能填几', value: 6 },
// { label: '最大能填几', value: 7 },
//  { label: '1x2', value: 8 },
//  { label: '81/9', value: 9 },
//  { label: '( )x2=6', value: 10 },
//  { label: '1+2x3=', value: 11 },
export type QuestionType = 1 | 2 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// 3-9 乘法/除法唯一题数量上限（7×7）
export const TIMES_TABLE_MAX_COUNT = 7 * 7;

const getValidateFormula = ({
  maxScore,
  mixCount,
  isInteger,
}: {
  maxScore: number;
  mixCount: number;
  isInteger: boolean;
}): { numbers: number[]; operators: string[]; answer: number | string } => {
  const num1 = Math.floor(Math.random() * maxScore) + 1;
  let numbers = [num1];
  const operators = [];
  let i = 1;
  let answer: string | number = num1;

  while (i < mixCount) {
    const num = Math.floor(Math.random() * maxScore) + 1;
    const operator = Math.random() < 0.5 ? '+' : '-';
    const r = getAnswer(operator, answer, num, maxScore);

    if (!r.valid) continue;

    numbers.push(num);
    operators.push(operator);
    answer = r.answer;
    i++;
  }

  if (isInteger) {
    const count = 10 ** (Math.floor(Math.random() * 2) + 1);
    // 给数字后面随机增加1到2位的0，增加难度
    numbers = numbers.map(num => num * count);
    answer = (answer as number) * count;
  }

  return { numbers, operators, answer };
};

const getFormulaByAnswer = ({
  maxScore,
  answer,
}: {
  maxScore: number;
  answer: number;
}): { numbers: number[]; operators: string[] } => {
  while (true) {
    let numbers = [];
    let operators = [];
    const num1 = Math.floor(Math.random() * maxScore) + 1;
    let operator = '';
    let num2;
    if (answer > num1) {
      operator = '+';
      num2 = answer - num1;
    }
    else {
      operator = '-';
      num2 = num1 - answer;
    }

    const r = getAnswer(operator, num1, num2, maxScore);

    if (r.valid) {
      numbers = [num1, num2];
      operators = [operator];
      return { numbers, operators };
    }
  }
};

const genrateCircle = ({
  numbers,
  operators,
}: {
  numbers: number[];
  operators: string[];
}) => {
  let str = '';
  numbers.forEach((num, i) => {
    if (i === 0) {
      str += `${num} ○ `;
    }
    else if (i === numbers.length - 1) {
      str += `${num}`;
    }
    else {
      str += `${num} ${operators[i]} `;
    }
  });

  return str;
};

export const genrateRandomMathQuestions = ({
  maxScore, // 最大结果
  count = 100, // 生成数量
  mixCount = 2, // 混合数量
  type = 1, // 题型
  isInteger = false, // 是否整数题
}: {
  maxScore: number;
  count?: number;
  mixCount?: number;
  type?: QuestionType;
  isInteger?: boolean;
}): Question[] => {
  const questions: Question[] = [];
  let c = 0;
  // 3-9 乘除法唯一题有限，避免去重导致死循环
  const targetCount
    = type === 8 || type === 9 ? Math.min(count, TIMES_TABLE_MAX_COUNT) : count;
  while (c < targetCount) {
    let { numbers, operators, answer } = getValidateFormula({
      maxScore,
      mixCount,
      isInteger,
    });

    let q = '';

    try {
      if (type === 8) {
        console.log('乘法运算');
        // 乘法运算
        q = genrateMultiQuestion();
      }
      else if (type === 9) {
        console.log('除法运算');
        // 除法运算
        q = genrateDivisionQuestion();
      }
      else if (type === 10) {
        console.log('乘除括号运算');
        // 乘除括号运算（随机左/右括号）
        const md = genrateMultiDivisionFormula();
        if (Math.random() < 0.5) {
          q = genrateLeftBracketsQuestion({ ...md, maxScore });
          answer = md.numbers[0];
        }
        else {
          q = genrateRightBracketsQuestion({ ...md, maxScore });
          answer = md.numbers[md.numbers.length - 1];
        }
      }
      else if (type === 11) {
        console.log('混合运算');
        // 混合运算
        const mixed = genrateMixedQuestion(maxScore);
        q = mixed.question;
        answer = mixed.answer;
      }
      else {
        const params = { numbers, operators, answer, maxScore };
        if (type === 1) {
          q = genrateNormalQuestion(params);
        }
        else if (type === 2) {
          // 加减括号运算（随机左/右括号）
          if (Math.random() < 0.5) {
            q = genrateLeftBracketsQuestion(params);
            answer = numbers[0];
          }
          else {
            q = genrateRightBracketsQuestion(params);
            answer = numbers[numbers.length - 1];
          }
        }
        else if (type === 4) {
          q = genrateLeftCirckeQuestion(params);
          answer = operators[0];
        }
        else if (type === 5) {
          q = genrateBothCirckeQuestion(params);
          answer = operators[0];
        }
        else if (type === 6) {
          q = genrateMinQuestion(params);
        }
        else if (type === 7) {
          q = genrateMaxQuestion(params);
        }
      }
    }
    catch (error) {
      console.log(error);
    }

    if (questions.find(x => x.question === q)) {
      continue;
    }
    const question = {
      id: c + 1,
      question: q,
      answer,
      isInteger,
    };
    questions.push(question);

    c++;
  }

  return questions;
};

const getAnswer = (
  operator: string,
  num1: number,
  num2: number,
  maxScore: number,
): { valid: boolean; answer: number } => {
  const result = {
    valid: true,
    answer: 0,
  };
  // 排除小数减大数
  if (operator === '-' && num1 < num2) {
    result.valid = false;
    return result;
  }

  if (operator === '-') {
    result.answer = num1 - num2;
  }
  else if (operator === '+') {
    result.answer = num1 + num2;
  }
  else {
    result.valid = false;
    return result;
  }

  // 排除计算结果大于maxScore
  if (result.answer > maxScore) {
    result.valid = false;
    return result;
  }
  else if (result.answer < 0) {
    result.valid = false;
    return result;
  }

  return result;
};

interface GenrateQuestionParam {
  numbers: number[];
  operators: string[];
  answer: number | string;
  maxScore: number;
}
const genrateNormalQuestion = ({
  numbers,
  operators,
}: GenrateQuestionParam): string => {
  let str = '';

  numbers.forEach((num, i) => {
    // 最后一个
    if (i === numbers.length - 1) {
      str += `${num} =   `;
    }
    else {
      str += `${num} ${operators[i]} `;
    }
  });
  return str;
};

const genrateLeftBracketsQuestion = ({
  numbers,
  operators,
  answer,
}: GenrateQuestionParam): string => {
  let str = '';

  numbers.forEach((num, i) => {
    if (i === 0) {
      str += `(  ) ${operators[i]} `;
    }
    else if (i === numbers.length - 1) {
      str += `${num} = ${answer}`;
    }
    else {
      str += `${num} ${operators[i]} `;
    }
  });
  return str;
};

const genrateRightBracketsQuestion = ({
  numbers,
  operators,
  answer,
}: GenrateQuestionParam): string => {
  let str = '';

  numbers.forEach((num, i) => {
    if (i === numbers.length - 1) {
      str += `(  ) = ${answer}`;
    }
    else {
      str += `${num} ${operators[i]} `;
    }
  });
  return str;
};

const genrateLeftCirckeQuestion = ({
  numbers,
  operators,
  answer,
}: GenrateQuestionParam): string => {
  let str = '';

  numbers.forEach((num, i) => {
    if (i === 0) {
      str += `${num} ○ `;
    }
    else if (i === numbers.length - 1) {
      str += `${num} = ${answer}`;
    }
    else {
      str += `${num} ${operators[i]} `;
    }
  });
  return str;
};

const genrateBothCirckeQuestion = ({
  numbers,
  operators,
  answer,
  maxScore,
}: GenrateQuestionParam): string => {
  const { numbers: rightNumbers, operators: rightOperators }
    = getFormulaByAnswer({ maxScore, answer: answer as number });
  const left = genrateCircle({ numbers, operators });
  const right = genrateCircle({
    numbers: rightNumbers,
    operators: rightOperators,
  });

  return `${left} = ${right}`;
};

const genrateMinQuestion = ({
  numbers,
  operators,
  answer,
}: GenrateQuestionParam): string => {
  let str = '';

  if (operators[0] === '+') {
    str = `${numbers[0]} + ○ > ${answer}`;
  }
  else if (operators[0] === '-') {
    str = `${numbers[0]} -  ○ < ${answer}`;
  }
  return str;
};

const genrateMaxQuestion = ({
  numbers,
  operators,
  answer,
}: GenrateQuestionParam): string => {
  let str = '';

  if (operators[0] === '+') {
    str = `${numbers[0]} + ○ < ${answer}`;
  }
  else if (operators[0] === '-') {
    str = `${numbers[0]} -  ○ > ${answer}`;
  }
  return str;
};

const genrateMultiQuestion = (): string => {
  let str = '';
  //  随机生成3-9的乘法运算
  const num1 = Math.floor(Math.random() * 7) + 3;
  const num2 = Math.floor(Math.random() * 7) + 3;
  str = `${num1} x ${num2} =   `;
  return str;
};

const genrateDivisionQuestion = (): string => {
  let str = '';
  // 随机生成3-9的除法运算，确保结果为整数
  const divisor = Math.floor(Math.random() * 7) + 3; // 除数
  const quotient = Math.floor(Math.random() * 7) + 3; // 商
  const dividend = divisor * quotient; // 被除数
  str = `${dividend} ÷ ${divisor} =   `;
  return str;
};

const genrateMultiDivisionFormula = (): {
  numbers: number[];
  operators: string[];
  answer: number;
} => {
  if (Math.random() < 0.5) {
    // 乘法：3-9
    const num1 = Math.floor(Math.random() * 7) + 3;
    const num2 = Math.floor(Math.random() * 7) + 3;
    return {
      numbers: [num1, num2],
      operators: ['x'],
      answer: num1 * num2,
    };
  }
  // 除法：确保结果为整数
  const divisor = Math.floor(Math.random() * 7) + 3;
  const quotient = Math.floor(Math.random() * 7) + 3;
  const dividend = divisor * quotient;
  return {
    numbers: [dividend, divisor],
    operators: ['÷'],
    answer: quotient,
  };
};

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const calcOp = (op: string, a: number, b: number): number | null => {
  // 加减乘除的数都不能小于3
  if (a < 3 || b < 3) return null;
  if (op === '+') return a + b;
  if (op === '-') return a >= b ? a - b : null;
  if (op === 'x') return a * b;
  if (op === '÷') {
    if (a % b !== 0) return null;
    const result = a / b;
    if (result === 1) return null;
    return result;
  }
  return null;
};

const isValidMixedAnswer = (n: number | null, maxScore: number): n is number =>
  n !== null && Number.isInteger(n) && n >= 0 && n <= maxScore;

// 混合运算：1+(3-2)= / 1+2x3= / (1+2)÷3=
const genrateMixedQuestion = (
  maxScore: number,
): { question: string; answer: number } => {
  const minNum = 3;
  const max = Math.max(minNum, Number(maxScore) || 10);
  let attempts = 0;

  while (attempts++ < 300) {
    const kind = Math.floor(Math.random() * 3);

    if (kind === 0) {
      // a op (b ± c)
      const b = randInt(minNum, max);
      const c = randInt(minNum, max);
      const opInner = Math.random() < 0.5 ? '+' : '-';
      const inner = calcOp(opInner, b, c);
      if (inner === null) continue;

      const a = randInt(minNum, max);
      const outerRoll = Math.random();
      const opOuter
        = outerRoll < 0.4
          ? Math.random() < 0.5
            ? '+'
            : '-'
          : outerRoll < 0.7
            ? 'x'
            : '÷';
      const answer = calcOp(opOuter, a, inner);
      if (!isValidMixedAnswer(answer, max)) continue;

      return {
        question: `${a} ${opOuter} (${b} ${opInner} ${c}) =   `,
        answer,
      };
    }

    if (kind === 1) {
      // a ± b ×÷ c（先乘除后加减）
      const a = randInt(minNum, max);
      const b = randInt(minNum, Math.min(9, max));
      const c = randInt(minNum, Math.min(9, max));
      const op1 = Math.random() < 0.5 ? '+' : '-';
      const op2 = Math.random() < 0.5 ? 'x' : '÷';
      const mid = calcOp(op2, b, c);
      if (mid === null) continue;
      const answer = calcOp(op1, a, mid);
      if (!isValidMixedAnswer(answer, max)) continue;

      return {
        question: `${a} ${op1} ${b} ${op2} ${c} =   `,
        answer,
      };
    }

    // (a ± b) ×÷ c
    const a = randInt(minNum, max);
    const b = randInt(minNum, max);
    const op1 = Math.random() < 0.5 ? '+' : '-';
    const left = calcOp(op1, a, b);
    if (left === null) continue;

    const c = randInt(minNum, Math.min(9, max));
    const op2 = Math.random() < 0.5 ? 'x' : '÷';
    const answer = calcOp(op2, left, c);
    if (!isValidMixedAnswer(answer, max)) continue;

    return {
      question: `(${a} ${op1} ${b}) ${op2} ${c} =   `,
      answer,
    };
  }

  // 兜底
  return { question: `3 + (6 - 3) =   `, answer: 6 };
};

export const isValidNumber = (n: string | number) => {
  const num = Number(n);
  return num && !Number.isNaN(num);
};
