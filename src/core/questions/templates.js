import { pick, randInt, shuffle, divisors, roundTidy } from '../random/rng.js';
import { formatNum, CONTEXT_NAMES } from './distractors.js';

/**
 * Question Templates QT01 - QT41
 */
export const TEMPLATES = {
  // === W1: Table Tunnel (Guided) ===
  QT01: {
    id: 'QT01',
    ruleTag: '+ CONSTANT RATIO RULE',
    tier: 1,
    visual: 'ratioTable',
    generate(rng) {
      const k = pick(rng, [3, 4, 5, 6, 7, 8]);
      const xs = [2, 3, 4, 5];
      const correctYs = xs.map(x => x * k);
      const student = pick(rng, CONTEXT_NAMES);

      return {
        stem: `Which pair of values shows that y is directly proportional to x with constant ratio k = ${k}?`,
        visualData: { headers: ['x', 'y'], rows: xs.map((x, i) => [x, correctYs[i]]) },
        answer: `x = 6, y = ${6 * k}`,
        answerLabel: `x = 6, y = ${6 * k}`,
        distractors: [
          { label: `x = 6, y = ${6 * k + 2}`, misconception: 'M1' },
          { label: `x = 6, y = ${6 + k}`, misconception: 'M1' },
          { label: `x = 6, y = ${6 * (k - 1)}`, misconception: 'M8' }
        ],
        solve: () => `x = 6, y = ${6 * k}`,
        hints: [
          'In direct proportion, divide y by x for every pair (y ÷ x = k).',
          `Here the constant is k = ${k}.`,
          `When x = 6, y must be 6 × ${k} = ${6 * k}.`
        ],
        solution: [
          `Direct proportion means y ÷ x = k for every pair.`,
          `Since k = ${k}, for x = 6 we get y = 6 × ${k} = ${6 * k}.`
        ]
      };
    }
  },

  QT02: {
    id: 'QT02',
    ruleTag: '+ CONSTANT RATIO RULE',
    tier: 1,
    visual: 'ratioTable',
    generate(rng) {
      const k = pick(rng, [2, 3, 4, 5, 8, 10]);
      const xs = [2, 4, 6, 8];
      const ys = xs.map(x => x * k);
      const missingIndex = pick(rng, [1, 2, 3]);
      const answer = ys[missingIndex];

      return {
        stem: `In the ratio table below, y is directly proportional to x. Find the missing value (?).`,
        visualData: {
          headers: ['x', 'y'],
          rows: xs.map((x, i) => [x, i === missingIndex ? '?' : ys[i]])
        },
        answer: answer,
        answerLabel: `${answer}`,
        distractors: [
          { label: `${answer + xs[missingIndex]}`, misconception: 'M1' },
          { label: `${answer - k}`, misconception: 'M1' },
          { label: `${xs[missingIndex] + k}`, misconception: 'M1' }
        ],
        solve: () => xs[missingIndex] * k,
        hints: [
          `Find the constant k by dividing y by x from the first row: ${ys[0]} ÷ ${xs[0]}.`,
          `k = ${k}. Both quantities grow by the same multiplier!`,
          `Multiply x = ${xs[missingIndex]} by ${k}.`
        ],
        solution: [
          `First find k: ${ys[0]} ÷ ${xs[0]} = ${k}.`,
          `For the missing row: y = ${xs[missingIndex]} × ${k} = ${answer}.`
        ]
      };
    }
  },

  QT03: {
    id: 'QT03',
    ruleTag: '+ CONSTANT RATIO RULE',
    tier: 1,
    visual: 'none',
    generate(rng) {
      return {
        stem: "Which of the following statements correctly describes two quantities in direct proportion?",
        answer: "When one quantity doubles, the other quantity also doubles.",
        answerLabel: "When one quantity doubles, the other quantity also doubles.",
        distractors: [
          { label: "When one quantity increases by 5, the other increases by 5.", misconception: 'M1' },
          { label: "When one quantity doubles, the other quantity is halved.", misconception: 'M3' },
          { label: "The product of the two quantities is always constant.", misconception: 'M2' }
        ],
        solve: () => "When one quantity doubles, the other quantity also doubles.",
        hints: [
          "Direct proportion is multiplicative, not additive.",
          "Both quantities grow or shrink in the exact same ratio.",
          "If one doubles (×2), the other must also double (×2)!"
        ],
        solution: [
          "Direct proportion means both quantities scale by the exact same factor.",
          "When one doubles, the other also doubles, keeping y ÷ x constant."
        ]
      };
    }
  },

  QT04: {
    id: 'QT04',
    ruleTag: '+ CONSTANT RATIO RULE',
    tier: 1,
    visual: 'none',
    generate(rng) {
      const factor = pick(rng, [3, 4, 5]);
      const word = factor === 3 ? 'tripled' : factor === 4 ? 'quadrupled' : 'multiplied by 5';
      const initialY = pick(rng, [6, 8, 10, 12]);
      const answer = initialY * factor;

      return {
        stem: `Two variables x and y are in direct proportion. When x = 2, y = ${initialY}. If x is ${word}, what is the new value of y?`,
        answer: answer,
        answerLabel: `${answer}`,
        distractors: [
          { label: `${initialY + factor}`, misconception: 'M1' },
          { label: `${roundTidy(initialY / factor)}`, misconception: 'M4' },
          { label: `${initialY * 2}`, misconception: 'M8' }
        ],
        solve: () => initialY * factor,
        hints: [
          `In direct proportion, whatever factor multiplies x also multiplies y.`,
          `Since x is ${word} (×${factor}), y must also be multiplied by ${factor}.`,
          `Calculate ${initialY} × ${factor}.`
        ],
        solution: [
          `Because y is directly proportional to x, multiplying x by ${factor} multiplies y by ${factor}.`,
          `New y = ${initialY} × ${factor} = ${answer}.`
        ]
      };
    }
  },

  // === W2: Constant Cove (Guided) ===
  QT05: {
    id: 'QT05',
    ruleTag: '+ FIND THE CONSTANT',
    tier: 1,
    visual: 'none',
    generate(rng) {
      const k = pick(rng, [2.5, 3, 4, 5, 6, 7.5, 9]);
      const x = pick(rng, [2, 4, 6, 8]);
      const y = roundTidy(x * k);

      return {
        stem: `Given that y is directly proportional to x, and y = ${y} when x = ${x}, find the constant of proportionality, k.`,
        answer: k,
        answerLabel: `k = ${k}`,
        distractors: [
          { label: `k = ${roundTidy(x / y)}`, misconception: 'M4' },
          { label: `k = ${roundTidy(y - x)}`, misconception: 'M1' },
          { label: `k = ${roundTidy(x * y)}`, misconception: 'M3' }
        ],
        solve: () => k,
        hints: [
          "The formula for direct proportion is y = kx.",
          "Rearrange to solve for the constant: k = y ÷ x.",
          `Calculate ${y} ÷ ${x}.`
        ],
        solution: [
          `In direct proportion, k = y ÷ x.`,
          `k = ${y} ÷ ${x} = ${k}.`
        ]
      };
    }
  },

  QT06: {
    id: 'QT06',
    ruleTag: '+ y = kx',
    tier: 1,
    visual: 'none',
    generate(rng) {
      const k = pick(rng, [3, 4, 5, 7, 8, 12]);
      const x = pick(rng, [2, 3, 5]);
      const y = x * k;

      return {
        stem: `The cost y (in S$) of buying x books is directly proportional to x. If 3 books cost S$${3 * k}, write the equation connecting y and x.`,
        answer: `y = ${k}x`,
        answerLabel: `y = ${k}x`,
        distractors: [
          { label: `y = ${k} / x`, misconception: 'M3' },
          { label: `y = x + ${k}`, misconception: 'M1' },
          { label: `y = ${k * 3}x`, misconception: 'M8' }
        ],
        solve: () => `y = ${k}x`,
        hints: [
          "Direct proportion equations always take the form y = kx.",
          `Find k = y ÷ x = ${3 * k} ÷ 3 = ${k}.`,
          `Substitute k into y = kx.`
        ],
        solution: [
          `First find k = ${3 * k} ÷ 3 = ${k}.`,
          `The equation connecting y and x is y = ${k}x.`
        ]
      };
    }
  },

  QT07: {
    id: 'QT07',
    ruleTag: '+ y = kx',
    tier: 1,
    visual: 'none',
    generate(rng) {
      const k = pick(rng, [4, 6, 7, 8, 9]);
      const x1 = 3;
      const y1 = x1 * k;
      const targetX = pick(rng, [5, 6, 7, 8]);
      const answer = targetX * k;

      return {
        stem: `y is directly proportional to x. When x = ${x1}, y = ${y1}. Find the value of y when x = ${targetX}.`,
        answer: answer,
        answerLabel: `${answer}`,
        distractors: [
          { label: `${y1 + (targetX - x1)}`, misconception: 'M1' },
          { label: `${roundTidy(targetX * (k - 1))}`, misconception: 'M8' },
          { label: `${roundTidy(y1 * targetX)}`, misconception: 'M4' }
        ],
        solve: () => targetX * k,
        hints: [
          `Find k first: k = ${y1} ÷ ${x1}.`,
          `k = ${k}, so the rule is y = ${k}x.`,
          `Substitute x = ${targetX}: y = ${k} × ${targetX}.`
        ],
        solution: [
          `Constant k = ${y1} ÷ ${x1} = ${k}.`,
          `When x = ${targetX}, y = ${k} × ${targetX} = ${answer}.`
        ]
      };
    }
  },

  QT08: {
    id: 'QT08',
    ruleTag: '+ y = kx',
    tier: 1,
    visual: 'none',
    generate(rng) {
      const k = pick(rng, [4, 5, 6, 8, 10]);
      const answerX = pick(rng, [6, 7, 8, 9]);
      const targetY = answerX * k;

      return {
        stem: `Given y = ${k}x, find the value of x when y = ${targetY}.`,
        answer: answerX,
        answerLabel: `x = ${answerX}`,
        distractors: [
          { label: `x = ${targetY - k}`, misconception: 'M1' },
          { label: `x = ${targetY * k}`, misconception: 'M4' },
          { label: `x = ${answerX + 2}`, misconception: 'M8' }
        ],
        solve: () => answerX,
        hints: [
          `Use the equation y = ${k}x.`,
          `Substitute y = ${targetY}: ${targetY} = ${k}x.`,
          `Divide both sides by ${k} to find x.`
        ],
        solution: [
          `From y = ${k}x, we have ${targetY} = ${k}x.`,
          `x = ${targetY} ÷ ${k} = ${answerX}.`
        ]
      };
    }
  },

  // === W3: Graph Galaxy (Independent) ===
  QT09: {
    id: 'QT09',
    ruleTag: '+ STRAIGHT LINE THROUGH ORIGIN',
    tier: 2,
    visual: 'graph',
    generate(rng) {
      return {
        stem: "Which graph correctly represents a direct proportion relationship between y and x?",
        visualData: { kind: 'direct', k: 2 },
        answer: "A straight line passing through the origin (0, 0)",
        answerLabel: "A straight line passing through the origin (0, 0)",
        distractors: [
          { label: "A straight line that cuts the vertical axis above zero", misconception: 'M5' },
          { label: "A curved line that bends toward the axes", misconception: 'M6' },
          { label: "A horizontal line parallel to the x-axis", misconception: 'M8' }
        ],
        solve: () => "A straight line passing through the origin (0, 0)",
        hints: [
          "When x = 0 in direct proportion (y = kx), what must y be?",
          "0 lanterns means 0 lights, so the graph must pass through (0, 0).",
          "The relationship is linear, so it must be a straight line!"
        ],
        solution: [
          "Direct proportion is modeled by y = kx.",
          "Its graph is always a straight line passing through the origin (0, 0)."
        ]
      };
    }
  },

  QT10: {
    id: 'QT10',
    ruleTag: '+ STRAIGHT LINE THROUGH ORIGIN',
    tier: 2,
    visual: 'graph',
    generate(rng) {
      const k = pick(rng, [2, 3, 4]);
      const x = pick(rng, [3, 4, 5]);
      const y = x * k;

      return {
        stem: `A line representing direct proportion passes through (0,0) and (2, ${2 * k}). What is the value of y when x = ${x}?`,
        visualData: { kind: 'direct', k },
        answer: y,
        answerLabel: `${y}`,
        distractors: [
          { label: `${2 * k + (x - 2)}`, misconception: 'M1' },
          { label: `${y + 2}`, misconception: 'M8' },
          { label: `${roundTidy(y / 2)}`, misconception: 'M4' }
        ],
        solve: () => y,
        hints: [
          `Find the gradient/constant: k = ${2 * k} ÷ 2 = ${k}.`,
          `The equation is y = ${k}x.`,
          `Read or calculate y at x = ${x}: ${k} × ${x}.`
        ],
        solution: [
          `Gradient k = ${2 * k} ÷ 2 = ${k}.`,
          `At x = ${x}, y = ${k} × ${x} = ${y}.`
        ]
      };
    }
  },

  QT11: {
    id: 'QT11',
    ruleTag: '+ FIND THE CONSTANT',
    tier: 2,
    visual: 'graph',
    generate(rng) {
      const k = pick(rng, [1.5, 2, 2.5, 3, 4, 5]);
      const x = pick(rng, [2, 4]);
      const y = roundTidy(x * k);

      return {
        stem: `The straight line for direct proportion passes through the point (${x}, ${y}) and the origin. What is the constant of proportionality, k?`,
        visualData: { kind: 'direct', k },
        answer: k,
        answerLabel: `k = ${k}`,
        distractors: [
          { label: `k = ${roundTidy(x / y)}`, misconception: 'M4' },
          { label: `k = ${roundTidy(y - x)}`, misconception: 'M1' },
          { label: `k = ${roundTidy(x * y)}`, misconception: 'M3' }
        ],
        solve: () => k,
        hints: [
          "For a line through the origin, k is the gradient (rise ÷ run).",
          `Divide the y-coordinate by the x-coordinate: ${y} ÷ ${x}.`,
          `Calculate ${y} ÷ ${x}.`
        ],
        solution: [
          `Constant k = y ÷ x.`,
          `k = ${y} ÷ ${x} = ${k}.`
        ]
      };
    }
  },

  QT12: {
    id: 'QT12',
    ruleTag: '+ STRAIGHT LINE THROUGH ORIGIN',
    tier: 2,
    visual: 'graph',
    generate(rng) {
      const kA = pick(rng, [4, 5, 6]);
      const kB = pick(rng, [2, 3]);

      return {
        stem: `Line A represents y = ${kA}x and Line B represents y = ${kB}x. Which statement is correct?`,
        visualData: { kind: 'direct', k: kA },
        answer: `Line A is steeper than Line B because ${kA} > ${kB}`,
        answerLabel: `Line A is steeper than Line B because ${kA} > ${kB}`,
        distractors: [
          { label: `Line B is steeper than Line A because ${kB} < ${kA}`, misconception: 'M8' },
          { label: "Both lines have the same steepness", misconception: 'M8' },
          { label: "Line A is curved while Line B is straight", misconception: 'M6' }
        ],
        solve: () => `Line A is steeper than Line B because ${kA} > ${kB}`,
        hints: [
          "In y = kx, the constant k represents the steepness (gradient) of the line.",
          `Compare the two constants: ${kA} vs ${kB}.`,
          "A larger k means the line climbs faster and is steeper."
        ],
        solution: [
          `The constant k gives the gradient of the direct proportion line.`,
          `Since ${kA} > ${kB}, Line A is steeper than Line B.`
        ]
      };
    }
  },

  // === W4: Unit Valley (Independent) ===
  QT13: {
    id: 'QT13',
    ruleTag: '+ UNITARY METHOD',
    tier: 2,
    visual: 'none',
    generate(rng) {
      const unitPrice = pick(rng, [3, 4, 5, 6, 7]);
      const initialCount = pick(rng, [3, 4, 5]);
      const initialCost = initialCount * unitPrice;
      const targetCount = pick(rng, [7, 8, 9, 12]);
      const answer = targetCount * unitPrice;
      const student = pick(rng, CONTEXT_NAMES);

      return {
        stem: `${student} buys ${initialCount} bubble tea cups for S$${initialCost}. How much will ${targetCount} cups cost at the same rate?`,
        answer: answer,
        answerLabel: `S$${answer}`,
        distractors: [
          { label: `S$${initialCost + (targetCount - initialCount)}`, misconception: 'M1' },
          { label: `S$${answer + unitPrice}`, misconception: 'M8' },
          { label: `S$${roundTidy(initialCost * targetCount)}`, misconception: 'M4' }
        ],
        solve: () => targetCount * unitPrice,
        hints: [
          "Use the unitary method: find the cost of 1 cup first.",
          `1 cup = S$${initialCost} ÷ ${initialCount} = S$${unitPrice}.`,
          `Multiply by ${targetCount}: ${targetCount} × S$${unitPrice}.`
        ],
        solution: [
          `Unit price: S$${initialCost} ÷ ${initialCount} = S$${unitPrice} per cup.`,
          `Cost for ${targetCount} cups: ${targetCount} × S$${unitPrice} = S$${answer}.`
        ]
      };
    }
  },

  QT14: {
    id: 'QT14',
    ruleTag: '+ EXCHANGE RATE',
    tier: 2,
    visual: 'none',
    generate(rng) {
      const rate = 3.5; // S$1 = RM 3.50
      const sgd = pick(rng, [20, 40, 50, 60]);
      const rm = sgd * rate;

      return {
        stem: `The currency exchange rate is S$1 = RM 3.50. How many Malaysian Ringgit (RM) will you receive for S$${sgd}?`,
        answer: rm,
        answerLabel: `RM ${rm}`,
        distractors: [
          { label: `RM ${sgd + 3.5}`, misconception: 'M1' },
          { label: `RM ${roundTidy(sgd / 3.5)}`, misconception: 'M4' },
          { label: `RM ${rm + 10}`, misconception: 'M8' }
        ],
        solve: () => sgd * rate,
        hints: [
          "Currency exchange is a direct proportion problem.",
          "Multiply your Singapore dollars by the exchange rate.",
          `Calculate ${sgd} × 3.50.`
        ],
        solution: [
          `Direct proportion equation: RM = ${sgd} × 3.50.`,
          `Total received = RM ${rm}.`
        ]
      };
    }
  },

  QT15: {
    id: 'QT15',
    ruleTag: '+ UNITARY METHOD',
    tier: 2,
    visual: 'none',
    generate(rng) {
      const perPerson = pick(rng, [50, 60, 75, 80]);
      const basePeople = 4;
      const baseFlour = basePeople * perPerson;
      const targetPeople = 6;
      const answer = targetPeople * perPerson;

      return {
        stem: `A pancake recipe requires ${baseFlour}g of flour for ${basePeople} people. How much flour is needed for ${targetPeople} people?`,
        answer: answer,
        answerLabel: `${answer}g`,
        distractors: [
          { label: `${baseFlour + (targetPeople - basePeople)}g`, misconception: 'M1' },
          { label: `${answer - perPerson}g`, misconception: 'M8' },
          { label: `${baseFlour * 2}g`, misconception: 'M8' }
        ],
        solve: () => targetPeople * perPerson,
        hints: [
          `Find the amount of flour per person: ${baseFlour} ÷ ${basePeople}.`,
          `Each person needs ${perPerson}g of flour.`,
          `Multiply for ${targetPeople} people: ${targetPeople} × ${perPerson}g.`
        ],
        solution: [
          `Flour per person = ${baseFlour}g ÷ ${basePeople} = ${perPerson}g.`,
          `For ${targetPeople} people: ${targetPeople} × ${perPerson}g = ${answer}g.`
        ]
      };
    }
  },

  QT16: {
    id: 'QT16',
    ruleTag: '+ SCALE',
    tier: 2,
    visual: 'scaleBar',
    generate(rng) {
      const kmPerCm = pick(rng, [2, 3, 4, 5]);
      const mapCm = pick(rng, [4, 6, 7, 8]);
      const answerKm = mapCm * kmPerCm;

      return {
        stem: `On a map of Singapore, 1 cm represents an actual distance of ${kmPerCm} km. If two MRT stations are ${mapCm} cm apart on the map, what is the actual distance?`,
        visualData: { cm: 1, km: kmPerCm },
        answer: answerKm,
        answerLabel: `${answerKm} km`,
        distractors: [
          { label: `${mapCm + kmPerCm} km`, misconception: 'M1' },
          { label: `${roundTidy(mapCm / kmPerCm)} km`, misconception: 'M4' },
          { label: `${answerKm + kmPerCm} km`, misconception: 'M8' }
        ],
        solve: () => mapCm * kmPerCm,
        hints: [
          `Map scale is direct proportion: actual distance = map distance × ${kmPerCm}.`,
          `Each 1 cm on the map equals ${kmPerCm} km in reality.`,
          `Multiply ${mapCm} × ${kmPerCm}.`
        ],
        solution: [
          `Scale factor: 1 cm : ${kmPerCm} km.`,
          `Actual distance = ${mapCm} × ${kmPerCm} = ${answerKm} km.`
        ]
      };
    }
  },

  QT17: {
    id: 'QT17',
    ruleTag: '+ UNITARY METHOD',
    tier: 2,
    visual: 'none',
    generate(rng) {
      const ratePerHour = pick(rng, [12, 14, 15, 16]);
      const hours = pick(rng, [5, 6, 8]);
      const totalEarned = hours * ratePerHour;
      const targetHours = hours + 3;
      const answer = targetHours * ratePerHour;
      const student = pick(rng, CONTEXT_NAMES);

      return {
        stem: `${student} earns S$${totalEarned} for working ${hours} hours at a community library. How much will ${student} earn for working ${targetHours} hours?`,
        answer: answer,
        answerLabel: `S$${answer}`,
        distractors: [
          { label: `S$${totalEarned + 3}`, misconception: 'M1' },
          { label: `S$${answer - ratePerHour}`, misconception: 'M8' },
          { label: `S$${totalEarned * 2}`, misconception: 'M8' }
        ],
        solve: () => targetHours * ratePerHour,
        hints: [
          `Find the hourly pay rate: S$${totalEarned} ÷ ${hours}.`,
          `Hourly rate = S$${ratePerHour}/hour.`,
          `Multiply: ${targetHours} × S$${ratePerHour}.`
        ],
        solution: [
          `Hourly rate = S$${totalEarned} ÷ ${hours} = S$${ratePerHour}/h.`,
          `For ${targetHours} hours: ${targetHours} × S$${ratePerHour} = S$${answer}.`
        ]
      };
    }
  },

  // === W5: Flip Factory (Independent) ===
  QT18: {
    id: 'QT18',
    ruleTag: '+ CONSTANT PRODUCT RULE',
    tier: 2,
    visual: 'ratioTable',
    generate(rng) {
      const k = pick(rng, [36, 48, 60, 72]);
      const xs = [2, 3, 4, 6];
      const ys = xs.map(x => k / x);

      return {
        stem: "Which table shows that y is inversely proportional to x?",
        visualData: { headers: ['x', 'y'], rows: xs.map((x, i) => [x, ys[i]]) },
        answer: `The table where x × y = ${k} for every row`,
        answerLabel: `The table where x × y = ${k} for every row`,
        distractors: [
          { label: `A table where y ÷ x = ${k} for every row`, misconception: 'M3' },
          { label: "A table where y = x + 10 for every row", misconception: 'M1' },
          { label: "A table where x + y = 20 for every row", misconception: 'M2' }
        ],
        solve: () => `The table where x × y = ${k} for every row`,
        hints: [
          "In inverse proportion, use the multiply test: x × y = k.",
          "When one quantity increases, the other decreases so their product stays constant.",
          `Look for the table with constant product ${k}.`
        ],
        solution: [
          "Inverse proportion requires a constant product (x × y = k).",
          "For every row in this table, x × y gives the exact same product."
        ]
      };
    }
  },

  QT19: {
    id: 'QT19',
    ruleTag: '+ CONSTANT PRODUCT RULE',
    tier: 2,
    visual: 'ratioTable',
    generate(rng) {
      const k = pick(rng, [24, 36, 48, 60, 72, 90, 120]);
      const validDivs = divisors(k).filter(d => d >= 2 && d <= 24);
      const xs = shuffle(rng, validDivs).slice(0, 4).sort((a, b) => a - b);
      const ys = xs.map(x => k / x);
      const hideIndex = pick(rng, [1, 2, 3]);
      const answer = ys[hideIndex];

      return {
        stem: `The table shows an inverse proportion relationship (xy = ${k}). Find the missing value (?).`,
        visualData: {
          headers: ['x', 'y'],
          rows: xs.map((x, i) => [x, i === hideIndex ? '?' : ys[i]])
        },
        answer: answer,
        answerLabel: `${answer}`,
        distractors: [
          { label: `${roundTidy(ys[0] * xs[hideIndex] / xs[0])}`, misconception: 'M4' }, // direct answer
          { label: `${roundTidy(ys[0] - (xs[hideIndex] - xs[0]))}`, misconception: 'M1' }, // additive
          { label: `${roundTidy(answer + 2)}`, misconception: 'M8' }
        ],
        solve: () => k / xs[hideIndex],
        hints: [
          `Multiply the known pair to find the constant product: ${xs[0]} × ${ys[0]} = ${k}.`,
          `For the missing row: ${xs[hideIndex]} × ? = ${k}.`,
          `Divide: ${k} ÷ ${xs[hideIndex]}.`
        ],
        solution: [
          `In inverse proportion, the product is constant: ${xs[0]} × ${ys[0]} = ${k}.`,
          `Missing value = ${k} ÷ ${xs[hideIndex]} = ${answer}.`
        ]
      };
    }
  },

  QT20: {
    id: 'QT20',
    ruleTag: '+ CONSTANT PRODUCT RULE',
    tier: 2,
    visual: 'none',
    generate(rng) {
      const factor = pick(rng, [2, 3, 4]);
      const initialY = pick(rng, [12, 18, 24, 36]);
      const answer = initialY / factor;
      const word = factor === 2 ? 'doubled' : factor === 3 ? 'tripled' : 'quadrupled';

      return {
        stem: `If y is inversely proportional to x, and y = ${initialY} when x = 3, what happens to y when x is ${word}?`,
        answer: answer,
        answerLabel: `y becomes ${answer} (divided by ${factor})`,
        distractors: [
          { label: `y becomes ${initialY * factor} (multiplied by ${factor})`, misconception: 'M3' },
          { label: `y becomes ${initialY - factor} (decreases by ${factor})`, misconception: 'M1' },
          { label: `y becomes ${initialY} (stays the same)`, misconception: 'M8' }
        ],
        solve: () => answer,
        hints: [
          "Inverse proportion is 'the flip'!",
          `When x is multiplied by ${factor}, y must be divided by ${factor}.`,
          `Calculate ${initialY} ÷ ${factor}.`
        ],
        solution: [
          `Because y is inversely proportional to x, multiplying x by ${factor} divides y by ${factor}.`,
          `New y = ${initialY} ÷ ${factor} = ${answer}.`
        ]
      };
    }
  },

  QT21: {
    id: 'QT21',
    ruleTag: '+ CONSTANT PRODUCT RULE',
    tier: 2,
    visual: 'none',
    generate(rng) {
      const x = pick(rng, [4, 6, 8, 9, 10]);
      const y = pick(rng, [5, 6, 8, 12, 15]);
      const k = x * y;

      return {
        stem: `The variables x and y are in inverse proportion. When x = ${x}, y = ${y}. What is the constant of proportionality k (where xy = k)?`,
        answer: k,
        answerLabel: `k = ${k}`,
        distractors: [
          { label: `k = ${roundTidy(y / x)}`, misconception: 'M4' },
          { label: `k = ${roundTidy(x + y)}`, misconception: 'M1' },
          { label: `k = ${roundTidy(Math.abs(x - y))}`, misconception: 'M1' }
        ],
        solve: () => k,
        hints: [
          "For inverse proportion, the constant k is the product of x and y.",
          "Formula: k = x × y.",
          `Calculate ${x} × ${y}.`
        ],
        solution: [
          `In inverse proportion, k = xy.`,
          `k = ${x} × ${y} = ${k}.`
        ]
      };
    }
  },

  // === W6: Mirror Bay (Independent) ===
  QT22: {
    id: 'QT22',
    ruleTag: '+ y = k/x',
    tier: 3,
    visual: 'none',
    generate(rng) {
      const k = pick(rng, [24, 36, 48, 60, 72]);
      const x = pick(rng, [3, 4, 6]);
      const y = k / x;

      return {
        stem: `y is inversely proportional to x. When x = ${x}, y = ${y}. Write the equation relating y and x.`,
        answer: `y = ${k}/x`,
        answerLabel: `y = ${k}/x`,
        distractors: [
          { label: `y = ${k}x`, misconception: 'M3' },
          { label: `y = ${k} - x`, misconception: 'M1' },
          { label: `y = ${x}/x`, misconception: 'M8' }
        ],
        solve: () => `y = ${k}/x`,
        hints: [
          "Inverse proportion equations take the form y = k/x.",
          `Find k = x × y = ${x} × ${y} = ${k}.`,
          `Substitute k into y = k/x.`
        ],
        solution: [
          `Constant k = ${x} × ${y} = ${k}.`,
          `The equation is y = ${k}/x.`
        ]
      };
    }
  },

  QT23: {
    id: 'QT23',
    ruleTag: '+ y = k/x',
    tier: 3,
    visual: 'none',
    generate(rng) {
      const k = pick(rng, [36, 48, 60, 72, 96, 120]);
      const targetX = pick(rng, [4, 6, 8, 12]);
      const answerY = k / targetX;

      return {
        stem: `Given the inverse proportion equation y = ${k}/x, find the value of y when x = ${targetX}.`,
        answer: answerY,
        answerLabel: `y = ${answerY}`,
        distractors: [
          { label: `y = ${k * targetX}`, misconception: 'M4' },
          { label: `y = ${k - targetX}`, misconception: 'M1' },
          { label: `y = ${answerY + 2}`, misconception: 'M8' }
        ],
        solve: () => k / targetX,
        hints: [
          `Substitute x = ${targetX} directly into y = ${k}/x.`,
          `Calculate ${k} ÷ ${targetX}.`,
          `y = ${answerY}.`
        ],
        solution: [
          `Using y = ${k}/x with x = ${targetX}:`,
          `y = ${k} ÷ ${targetX} = ${answerY}.`
        ]
      };
    }
  },

  QT24: {
    id: 'QT24',
    ruleTag: '+ CURVE THAT NEVER TOUCHES AXES',
    tier: 3,
    visual: 'graph',
    generate(rng) {
      return {
        stem: "Which shape represents the graph of an inverse proportion relationship (y = k/x for x > 0)?",
        visualData: { kind: 'inverse', k: 24 },
        answer: "A smooth curve that slopes downward and never touches the axes",
        answerLabel: "A smooth curve that slopes downward and never touches the axes",
        distractors: [
          { label: "A straight line sloping downwards to touch the horizontal axis", misconception: 'M6' },
          { label: "A straight line passing through the origin (0, 0)", misconception: 'M3' },
          { label: "A vertical straight line", misconception: 'M8' }
        ],
        solve: () => "A smooth curve that slopes downward and never touches the axes",
        hints: [
          "Can x or y ever be 0 if x × y = k (a non-zero number)?",
          "No! So the graph can NEVER touch the x-axis or y-axis.",
          "As x grows larger, y gets closer to 0 in a gentle curve."
        ],
        solution: [
          "The graph of y = k/x is a hyperbola curve.",
          "It curves downward and never touches either axis because neither variable can be zero."
        ]
      };
    }
  },

  QT25: {
    id: 'QT25',
    ruleTag: '+ CURVE THAT NEVER TOUCHES AXES',
    tier: 3,
    visual: 'graph',
    generate(rng) {
      const k = pick(rng, [24, 36, 48]);
      const x = pick(rng, [4, 6]);
      const y = k / x;

      return {
        stem: `An inverse proportion curve y = ${k}/x passes through the point (${x}, y). What is the y-coordinate?`,
        visualData: { kind: 'inverse', k },
        answer: y,
        answerLabel: `${y}`,
        distractors: [
          { label: `${k * x}`, misconception: 'M4' },
          { label: `${k - x}`, misconception: 'M1' },
          { label: `${y + 3}`, misconception: 'M8' }
        ],
        solve: () => y,
        hints: [
          `Every point on the curve satisfies x × y = ${k}.`,
          `Substitute x = ${x}: ${x} × y = ${k}.`,
          `y = ${k} ÷ ${x} = ${y}.`
        ],
        solution: [
          `Since xy = ${k}, at x = ${x}:`,
          `y = ${k} ÷ ${x} = ${y}.`
        ]
      };
    }
  },

  // === W7: Worker Workshop (Independent) ===
  QT26: {
    id: 'QT26',
    ruleTag: '+ PERSON-HOURS',
    tier: 3,
    visual: 'areaModel',
    generate(rng) {
      const w1 = pick(rng, [3, 4, 6]);
      const d1 = pick(rng, [8, 10, 12]);
      const totalWork = w1 * d1;
      const w2 = pick(rng, divisors(totalWork).filter(d => d !== w1 && d >= 2 && d <= 12));
      const answer = totalWork / w2;

      return {
        stem: `${w1} painters can paint a school wall in ${d1} days. How many days will ${w2} painters take to paint the same wall?`,
        visualData: { w: w1, h: d1, k: totalWork },
        answer: answer,
        answerLabel: `${answer} days`,
        distractors: [
          { label: `${roundTidy(d1 * w2 / w1)} days`, misconception: 'M4' }, // direct error
          { label: `${d1 - (w2 - w1)} days`, misconception: 'M1' }, // additive error
          { label: `${totalWork} days`, misconception: 'M8' }
        ],
        solve: () => totalWork / w2,
        hints: [
          "More workers means LESS time! This is inverse proportion.",
          `Calculate total painter-days: ${w1} × ${d1} = ${totalWork}.`,
          `Divide total work by ${w2} painters: ${totalWork} ÷ ${w2}.`
        ],
        solution: [
          `Total work = ${w1} painters × ${d1} days = ${totalWork} painter-days.`,
          `With ${w2} painters: ${totalWork} ÷ ${w2} = ${answer} days.`
        ]
      };
    }
  },

  QT27: {
    id: 'QT27',
    ruleTag: '+ CONSTANT PRODUCT RULE',
    tier: 3,
    visual: 'areaModel',
    generate(rng) {
      const t1 = pick(rng, [4, 5, 6]);
      const m1 = pick(rng, [15, 20, 30]);
      const totalTapMinutes = t1 * m1;
      const t2 = pick(rng, divisors(totalTapMinutes).filter(d => d !== t1 && d >= 2 && d <= 12));
      const answer = totalTapMinutes / t2;

      return {
        stem: `${t1} water taps fill a tank in ${m1} minutes. How long will ${t2} taps take to fill the same tank?`,
        visualData: { w: t1, h: m1, k: totalTapMinutes },
        answer: answer,
        answerLabel: `${answer} minutes`,
        distractors: [
          { label: `${roundTidy(m1 * t2 / t1)} minutes`, misconception: 'M4' },
          { label: `${m1 - (t2 - t1)} minutes`, misconception: 'M1' },
          { label: `${roundTidy(totalTapMinutes * t2)} minutes`, misconception: 'M8' }
        ],
        solve: () => totalTapMinutes / t2,
        hints: [
          "More taps running together fill the tank faster (less time).",
          `Total tap-minutes = ${t1} × ${m1} = ${totalTapMinutes}.`,
          `With ${t2} taps: ${totalTapMinutes} ÷ ${t2}.`
        ],
        solution: [
          `Total capacity = ${t1} taps × ${m1} min = ${totalTapMinutes} tap-minutes.`,
          `For ${t2} taps: ${totalTapMinutes} ÷ ${t2} = ${answer} minutes.`
        ]
      };
    }
  },

  QT28: {
    id: 'QT28',
    ruleTag: '+ CONSTANT PRODUCT RULE',
    tier: 3,
    visual: 'machine',
    generate(rng) {
      const m1 = pick(rng, [3, 4, 6]);
      const h1 = pick(rng, [6, 8, 12]);
      const totalHours = m1 * h1;
      const m2 = pick(rng, divisors(totalHours).filter(d => d !== m1 && d >= 2 && d <= 12));
      const answer = totalHours / m2;

      return {
        stem: `${m1} identical 3D printers complete a production run of robot parts in ${h1} hours. How many hours will ${m2} printers take?`,
        visualData: { inLabel: `${m1} printers`, outLabel: `${h1} hrs`, factor: totalHours },
        answer: answer,
        answerLabel: `${answer} hours`,
        distractors: [
          { label: `${roundTidy(h1 * m2 / m1)} hours`, misconception: 'M4' },
          { label: `${h1 - (m2 - m1)} hours`, misconception: 'M1' },
          { label: `${totalHours} hours`, misconception: 'M8' }
        ],
        solve: () => totalHours / m2,
        hints: [
          "The job requires a fixed number of machine-hours.",
          `Total machine-hours = ${m1} × ${h1} = ${totalHours}.`,
          `Divide by ${m2} machines: ${totalHours} ÷ ${m2}.`
        ],
        solution: [
          `Total work = ${m1} × ${h1} = ${totalHours} machine-hours.`,
          `Time with ${m2} printers = ${totalHours} ÷ ${m2} = ${answer} hours.`
        ]
      };
    }
  },

  QT29: {
    id: 'QT29',
    ruleTag: '+ PERSON-HOURS',
    tier: 3,
    visual: 'none',
    generate(rng) {
      // 8 workers can finish in 10 days. After 2 days, 4 more workers join.
      const initialW = 8;
      const initialD = 10;
      const passedD = 2;
      const addedW = 4;
      const remainingWork = initialW * (initialD - passedD); // 8 * 8 = 64
      const newW = initialW + addedW; // 12 -> let's make it integer
      // Let's use clean numbers: 6 workers for 10 days. After 2 days (work left = 6 * 8 = 48), 2 more workers join (total 8). 48 / 8 = 6 days.
      const wA = 6;
      const dA = 10;
      const dElapsed = 2;
      const wJoin = 2;
      const workLeft = wA * (dA - dElapsed); // 48
      const totalW = wA + wJoin; // 8
      const answer = workLeft / totalW; // 6

      return {
        stem: `${wA} workers can pave a path in ${dA} days. After ${dElapsed} days of work, ${wJoin} more workers join the team. How many more days will it take to finish the path?`,
        answer: answer,
        answerLabel: `${answer} more days`,
        distractors: [
          { label: `${dA - dElapsed} more days`, misconception: 'M8' },
          { label: `${roundTidy(workLeft / wA)} more days`, misconception: 'M8' },
          { label: `${answer + 2} more days`, misconception: 'M1' }
        ],
        solve: () => workLeft / totalW,
        hints: [
          `Calculate work remaining after ${dElapsed} days: ${wA} workers × (${dA} - ${dElapsed}) days = ${workLeft} worker-days.`,
          `The new team has ${wA} + ${wJoin} = ${totalW} workers.`,
          `Divide remaining work by new team size: ${workLeft} ÷ ${totalW}.`
        ],
        solution: [
          `Work remaining = ${wA} × (${dA} - ${dElapsed}) = ${workLeft} worker-days.`,
          `New team size = ${totalW} workers.`,
          `Remaining days = ${workLeft} ÷ ${totalW} = ${answer} days.`
        ]
      };
    }
  },

  // === W8: Speed Station (Timed) ===
  QT30: {
    id: 'QT30',
    ruleTag: '+ SPEED × TIME',
    tier: 3,
    visual: 'none',
    generate(rng) {
      const s1 = pick(rng, [60, 80, 90]);
      const t1 = pick(rng, [2, 3, 4]);
      const distance = s1 * t1;
      const s2 = pick(rng, [40, 50, 75, 100, 120].filter(s => s !== s1 && distance % s === 0));
      const answer = distance / s2;

      return {
        stem: `A delivery van travels a fixed distance at ${s1} km/h in ${t1} hours. How long will the trip take at ${s2} km/h?`,
        answer: answer,
        answerLabel: `${answer} hours`,
        distractors: [
          { label: `${roundTidy(t1 * s2 / s1)} hours`, misconception: 'M4' },
          { label: `${t1 - (s2 - s1)} hours`, misconception: 'M1' },
          { label: `${roundTidy(distance / 2)} hours`, misconception: 'M8' }
        ],
        solve: () => distance / s2,
        hints: [
          "Fixed distance means speed × time = constant.",
          `Calculate distance: ${s1} × ${t1} = ${distance} km.`,
          `Divide by new speed: ${distance} ÷ ${s2}.`
        ],
        solution: [
          `Distance = speed × time = ${s1} × ${t1} = ${distance} km.`,
          `Time at ${s2} km/h = ${distance} ÷ ${s2} = ${answer} hours.`
        ]
      };
    }
  },

  QT31: {
    id: 'QT31',
    ruleTag: '+ CONSTANT PRODUCT RULE',
    tier: 3,
    visual: 'none',
    generate(rng) {
      const people1 = pick(rng, [4, 5, 6]);
      const days1 = pick(rng, [12, 15, 20]);
      const totalMeals = people1 * days1;
      const people2 = pick(rng, divisors(totalMeals).filter(d => d !== people1 && d >= 2 && d <= 12));
      const answer = totalMeals / people2;

      return {
        stem: `A campsite food supply can feed ${people1} campers for ${days1} days. If ${people2} campers attend, how many days will the food last?`,
        answer: answer,
        answerLabel: `${answer} days`,
        distractors: [
          { label: `${roundTidy(days1 * people2 / people1)} days`, misconception: 'M4' },
          { label: `${days1 - (people2 - people1)} days`, misconception: 'M1' },
          { label: `${answer + 2} days`, misconception: 'M8' }
        ],
        solve: () => totalMeals / people2,
        hints: [
          "More campers eating means the food finishes sooner (inverse proportion).",
          `Total camper-days of food = ${people1} × ${days1} = ${totalMeals}.`,
          `For ${people2} campers: ${totalMeals} ÷ ${people2}.`
        ],
        solution: [
          `Total rations = ${people1} × ${days1} = ${totalMeals} camper-days.`,
          `With ${people2} campers, days = ${totalMeals} ÷ ${people2} = ${answer} days.`
        ]
      };
    }
  },

  QT32: {
    id: 'QT32',
    ruleTag: '+ CONSTANT PRODUCT RULE',
    tier: 3,
    visual: 'gears',
    generate(rng) {
      const teethA = pick(rng, [20, 24, 30]);
      const turnsA = pick(rng, [6, 8, 10]);
      const totalTeeth = teethA * turnsA;
      const teethB = pick(rng, divisors(totalTeeth).filter(d => d !== teethA && d >= 10 && d <= 60));
      const answer = totalTeeth / teethB;

      return {
        stem: `Gear A with ${teethA} teeth turns ${turnsA} times. It is meshed with Gear B which has ${teethB} teeth. How many turns does Gear B make?`,
        visualData: { teethA, teethB, turnsA },
        answer: answer,
        answerLabel: `${answer} turns`,
        distractors: [
          { label: `${roundTidy(turnsA * teethB / teethA)} turns`, misconception: 'M4' },
          { label: `${turnsA - (teethB - teethA)} turns`, misconception: 'M1' },
          { label: `${totalTeeth} turns`, misconception: 'M8' }
        ],
        solve: () => totalTeeth / teethB,
        hints: [
          "Meshed gears share the same total teeth passing: teeth × turns = constant.",
          `Total teeth passing = ${teethA} × ${turnsA} = ${totalTeeth}.`,
          `Turns of Gear B = ${totalTeeth} ÷ ${teethB}.`
        ],
        solution: [
          `Constant: teeth × turns = ${teethA} × ${turnsA} = ${totalTeeth}.`,
          `Turns for Gear B = ${totalTeeth} ÷ ${teethB} = ${answer} turns.`
        ]
      };
    }
  },

  QT33: {
    id: 'QT33',
    ruleTag: '+ SPEED × TIME',
    tier: 3,
    visual: 'none',
    generate(rng) {
      // 60 km/h takes 45 min. How long at 90 km/h? -> 30 min
      const s1 = 60;
      const m1 = 45;
      const s2 = 90;
      const answerMin = (s1 * m1) / s2; // 30 min

      return {
        stem: `Traveling at ${s1} km/h, a trip takes ${m1} minutes. How many minutes will the trip take at ${s2} km/h?`,
        answer: answerMin,
        answerLabel: `${answerMin} minutes`,
        distractors: [
          { label: `${roundTidy(m1 * s2 / s1)} minutes`, misconception: 'M4' }, // 67.5 min (direct trap)
          { label: `${m1 - (s2 - s1)} minutes`, misconception: 'M1' },
          { label: `${answerMin + 15} minutes`, misconception: 'M8' }
        ],
        solve: () => answerMin,
        hints: [
          "Higher speed means LESS time!",
          `Multiply speed and time: ${s1} × ${m1} = ${s1 * m1}.`,
          `Divide by new speed: ${s1 * m1} ÷ ${s2}.`
        ],
        solution: [
          `Speed × time is constant: ${s1} × ${m1} = ${s1 * m1}.`,
          `Time at ${s2} km/h = ${s1 * m1} ÷ ${s2} = ${answerMin} minutes.`
        ]
      };
    }
  },

  // === W9: Detective District (Timed) ===
  QT34: {
    id: 'QT34',
    ruleTag: '+ TEST BOTH WAYS',
    tier: 4,
    visual: 'none',
    generate(rng) {
      const scenarios = [
        {
          story: "The number of workers on a construction site and the time taken to complete the building.",
          ans: "Inverse proportion",
          reason: "More workers divide the time, so workers × time is constant."
        },
        {
          story: "The number of identical notebooks bought and the total cost in S$.",
          ans: "Direct proportion",
          reason: "Each notebook costs a fixed price, so cost ÷ quantity is constant."
        },
        {
          story: "A child's age in years and their shoe size.",
          ans: "Neither direct nor inverse",
          reason: "Shoe size does not double when age doubles, and their product is not constant."
        },
        {
          story: "The remaining battery percentage of a smartphone and the hours spent playing a game.",
          ans: "Neither direct nor inverse",
          reason: "As time goes up, battery decreases additively, not by a constant product."
        }
      ];
      const pickItem = pick(rng, scenarios);

      return {
        stem: `Classify this relationship: "${pickItem.story}"`,
        answer: pickItem.ans,
        answerLabel: pickItem.ans,
        distractors: [
          "Direct proportion",
          "Inverse proportion",
          "Neither direct nor inverse",
          "Both direct and inverse"
        ].filter(opt => opt !== pickItem.ans).slice(0, 3).map(label => ({ label, misconception: 'M2' })),
        solve: () => pickItem.ans,
        hints: [
          "Apply the Two Detective Tests: ÷ Test (direct) and × Test (inverse).",
          "Does doubling one quantity double the other? Or halve the other? Or neither?",
          pickItem.reason
        ],
        solution: [
          `This situation is: ${pickItem.ans}.`,
          pickItem.reason
        ]
      };
    }
  },

  QT35: {
    id: 'QT35',
    ruleTag: '+ NOT PROPORTION',
    tier: 4,
    visual: 'none',
    generate(rng) {
      return {
        stem: "A taxi ride costs a base flag-down fare of S$4 plus S$0.50 per kilometre. Is the total fare directly proportional to the distance traveled?",
        answer: "No, because the graph does not pass through the origin (0, 0)",
        answerLabel: "No, because the graph does not pass through the origin (0, 0)",
        distractors: [
          { label: "Yes, because as distance increases, total fare increases", misconception: 'M2' },
          { label: "Yes, because it is represented by a straight line", misconception: 'M5' },
          { label: "No, because it is an inverse proportion", misconception: 'M3' }
        ],
        solve: () => "No, because the graph does not pass through the origin (0, 0)",
        hints: [
          "Check what happens when distance = 0 km. Is the fare S$0?",
          "No, there is a base fare of S$4 (y = 0.5x + 4).",
          "Direct proportion must start at (0, 0) and have a constant ratio y ÷ x."
        ],
        solution: [
          "The equation is y = 0.5x + 4.",
          "Because y ÷ x is not constant (and the line does not start at 0), this is NOT direct proportion."
        ]
      };
    }
  },

  QT36: {
    id: 'QT36',
    ruleTag: '+ TEST BOTH WAYS',
    tier: 4,
    visual: 'ratioTable',
    generate(rng) {
      // Additive table: x = [1, 2, 3, 4], y = [5, 6, 7, 8] (y = x + 4)
      return {
        stem: "Look at the table: x = [1, 2, 3, 4] and y = [5, 6, 7, 8]. Which detective test confirms that y is NOT in proportion with x?",
        visualData: { headers: ['x', 'y'], rows: [[1, 5], [2, 6], [3, 7], [4, 8]] },
        answer: "Both the ÷ test and × test fail: ratios and products both change",
        answerLabel: "Both the ÷ test and × test fail: ratios and products both change",
        distractors: [
          { label: "The ÷ test passes because both numbers increase by 1", misconception: 'M1' },
          { label: "The × test passes because both variables are positive", misconception: 'M8' },
          { label: "It is direct proportion because 6 > 5 and 7 > 6", misconception: 'M2' }
        ],
        solve: () => "Both the ÷ test and × test fail: ratios and products both change",
        hints: [
          "Check y ÷ x: 5÷1 = 5, but 6÷2 = 3 (Not direct!).",
          "Check x × y: 1×5 = 5, but 2×6 = 12 (Not inverse!).",
          "This is an additive relationship (y = x + 4), not a proportion!"
        ],
        solution: [
          "Divide test: 5/1 ≠ 6/2, so it is not direct.",
          "Multiply test: 1×5 ≠ 2×6, so it is not inverse.",
          "Both tests fail, proving it is neither."
        ]
      };
    }
  },

  QT37: {
    id: 'QT37',
    ruleTag: '+ TEST BOTH WAYS',
    tier: 4,
    visual: 'none',
    generate(rng) {
      return {
        stem: "A student solves: '3 workers take 6 hours, so 6 workers will take 12 hours.' What is the student's misconception?",
        answer: "They applied direct proportion instead of inverse proportion",
        answerLabel: "They applied direct proportion instead of inverse proportion",
        distractors: [
          { label: "They forgot to add 3 to both sides", misconception: 'M1' },
          { label: "They calculated the area model incorrectly", misconception: 'M8' },
          { label: "Their answer is correct because workers doubled", misconception: 'M3' }
        ],
        solve: () => "They applied direct proportion instead of inverse proportion",
        hints: [
          "Does adding more workers make a job take LONGER?",
          "No! More workers share the load, so time should decrease to 3 hours.",
          "The student doubled time instead of halving it."
        ],
        solution: [
          "Work-rate is inversely proportional: more workers means less time.",
          "Doubling workers (3 to 6) should halve the time (6 to 3 hours). The student mistakenly treated it as direct proportion."
        ]
      };
    }
  },

  // === W10: Proportion Peak (Boss) ===
  QT38: {
    id: 'QT38',
    ruleTag: '+ COMBINED PROPORTION',
    tier: 4,
    visual: 'machine',
    generate(rng) {
      // 6 machines make 360 toys in 5 hours.
      // Rate per machine per hour = 360 / (6 * 5) = 12 toys/machine-hour.
      // How many toys can 8 machines make in 3 hours? -> 8 * 3 * 12 = 288 toys.
      const m1 = 6;
      const h1 = 5;
      const rate = 12;
      const out1 = m1 * h1 * rate; // 360
      const m2 = 8;
      const h2 = 3;
      const answer = m2 * h2 * rate; // 288

      return {
        stem: `${m1} machines manufacture ${out1} festival toys in ${h1} hours. How many toys can ${m2} machines manufacture in ${h2} hours?`,
        visualData: { inLabel: `${m1} machines, ${h1}h`, outLabel: `${out1} toys`, factor: rate },
        answer: answer,
        answerLabel: `${answer} toys`,
        distractors: [
          { label: `${out1}`, misconception: 'M8' },
          { label: `240 toys`, misconception: 'M4' },
          { label: `320 toys`, misconception: 'M8' }
        ],
        solve: () => answer,
        hints: [
          `Toys is directly proportional to both machines AND hours (Output = k × machines × hours).`,
          `Find rate per machine-hour: ${out1} ÷ (${m1} × ${h1}) = ${rate} toys/hour.`,
          `Calculate for new scenario: ${m2} × ${h2} × ${rate}.`
        ],
        solution: [
          `Rate = ${out1} ÷ (${m1} × ${h1}) = ${rate} toys per machine-hour.`,
          `Output = ${m2} machines × ${h2} hours × ${rate} = ${answer} toys.`
        ]
      };
    }
  },

  QT39: {
    id: 'QT39',
    ruleTag: '+ UNITARY METHOD',
    tier: 4,
    numeric: true, // Boss numeric entry with NumberPad
    visual: 'none',
    generate(rng) {
      const unitPrice = pick(rng, [5, 6, 8, 10]);
      const qty = pick(rng, [4, 5, 8]);
      const subtotal = qty * unitPrice;
      const gstRate = 0.09; // Singapore 9% GST
      const totalWithGst = roundTidy(subtotal * (1 + gstRate));

      return {
        stem: `Each festival lantern costs S$${unitPrice} before tax. Find the total cost (in S$) for ${qty} lanterns inclusive of 9% GST.`,
        answer: totalWithGst,
        answerLabel: `S$${totalWithGst}`,
        distractors: [
          { label: `S$${subtotal}`, misconception: 'M8' },
          { label: `S$${subtotal + 9}`, misconception: 'M1' },
          { label: `S$${roundTidy(subtotal * 1.08)}`, misconception: 'M8' }
        ],
        solve: () => totalWithGst,
        hints: [
          `Calculate subtotal: ${qty} × S$${unitPrice} = S$${subtotal}.`,
          `Add 9% GST: S$${subtotal} × 1.09.`,
          `Total = S$${totalWithGst}.`
        ],
        solution: [
          `Subtotal = ${qty} × S$${unitPrice} = S$${subtotal}.`,
          `With 9% GST: ${subtotal} × 1.09 = S$${totalWithGst}.`
        ]
      };
    }
  },

  QT40: {
    id: 'QT40',
    ruleTag: '+ y = kx',
    tier: 4,
    visual: 'graph',
    generate(rng) {
      const k = pick(rng, [3, 4, 5, 6]);
      const x = pick(rng, [4, 5, 6]);
      const answer = x * k;

      return {
        stem: `The graph shows a direct proportion line passing through (2, ${2 * k}). Using its equation y = kx, calculate the value of y when x = ${x}.`,
        visualData: { kind: 'direct', k },
        answer: answer,
        answerLabel: `${answer}`,
        distractors: [
          { label: `${2 * k + (x - 2)}`, misconception: 'M1' },
          { label: `${answer + k}`, misconception: 'M8' },
          { label: `${roundTidy(answer / 2)}`, misconception: 'M4' }
        ],
        solve: () => answer,
        hints: [
          `Read the gradient k from (2, ${2 * k}): k = ${2 * k} ÷ 2 = ${k}.`,
          `The equation is y = ${k}x.`,
          `Substitute x = ${x}: y = ${k} × ${x}.`
        ],
        solution: [
          `From the graph, k = ${2 * k} ÷ 2 = ${k}.`,
          `At x = ${x}, y = ${k} × ${x} = ${answer}.`
        ]
      };
    }
  },

  QT41: {
    id: 'QT41',
    ruleTag: '+ COMBINED PROPORTION',
    tier: 4,
    numeric: true, // Boss numeric entry with NumberPad
    visual: 'none',
    generate(rng) {
      // Two stage: 4 craftspeople fold 240 lanterns in 6 hours.
      // Lanterns per person-hour = 240 / (4 * 6) = 10.
      // How many hours will 5 craftspeople take to fold 300 lanterns?
      // Time = 300 / (5 * 10) = 6 hours.
      const p1 = 4;
      const h1 = 6;
      const l1 = 240;
      const rate = l1 / (p1 * h1); // 10
      const p2 = 5;
      const l2 = 300;
      const answer = l2 / (p2 * rate); // 6

      return {
        stem: `${p1} artisans fold ${l1} lanterns in ${h1} hours. How many hours will it take ${p2} artisans to fold ${l2} lanterns at the same speed?`,
        answer: answer,
        answerLabel: `${answer} hours`,
        distractors: [
          { label: `${answer + 2} hours`, misconception: 'M8' },
          { label: `${roundTidy(h1 * p2 / p1)} hours`, misconception: 'M4' },
          { label: `${answer - 1} hours`, misconception: 'M1' }
        ],
        solve: () => answer,
        hints: [
          `Find the folding rate per artisan per hour: ${l1} ÷ (${p1} × ${h1}) = ${rate} lanterns/person-hour.`,
          `Together, ${p2} artisans fold ${p2} × ${rate} = ${p2 * rate} lanterns per hour.`,
          `Divide target lanterns by hourly rate: ${l2} ÷ ${p2 * rate}.`
        ],
        solution: [
          `Rate = ${l1} ÷ (${p1} × ${h1}) = ${rate} lanterns per person-hour.`,
          `Team speed = ${p2} × ${rate} = ${p2 * rate} lanterns/h.`,
          `Time required = ${l2} ÷ ${p2 * rate} = ${answer} hours.`
        ]
      };
    }
  }
};
