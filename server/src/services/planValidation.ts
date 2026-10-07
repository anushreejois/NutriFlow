export interface WellnessProfile {
  age: number;
  weight: number;
  height: number;
  gender: "female" | "male";
  cyclePhase?: "menstrual" | "follicular" | "ovulation" | "luteal" | "menopause";
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  goal: "balance" | "lose" | "gain" | "maintain";
  dietary: "standard" | "vegetarian" | "vegan" | "pescatarian" | "keto";
  condition:
    | "none"
    | "pcos"
    | "hypothyroidism"
    | "hypertension"
    | "low_testosterone"
    | "insulin_resistance";
  allergies: string;
}

export interface PlanMeal {
  item: string;
  calories: number;
  benefits: string;
}

export interface NutritionPlan {
  summary: string;
  meals: {
    breakfast: PlanMeal;
    lunch: PlanMeal;
    dinner: PlanMeal;
    snack: PlanMeal;
  };
  workout: {
    type: string;
    duration: string;
    focus: string;
  };
}

export class PlanValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanValidationError";
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const boundedString = (
  value: unknown,
  field: string,
  maximumLength: number,
): string => {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > maximumLength) {
    throw new PlanValidationError(`${field} must be a non-empty string no longer than ${maximumLength} characters.`);
  }
  return value.trim();
};

const enumValue = <T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
): T => {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new PlanValidationError(`${field} is not a supported value.`);
  }
  return value as T;
};

const numericValue = (
  value: unknown,
  field: string,
  minimum: number,
  maximum: number,
): number => {
  if (
    typeof value !== "number" &&
    (typeof value !== "string" || value.trim().length === 0)
  ) {
    throw new PlanValidationError(`${field} must be a number.`);
  }
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new PlanValidationError(`${field} must be between ${minimum} and ${maximum}.`);
  }
  return number;
};

export const parseWellnessProfile = (value: unknown): WellnessProfile => {
  if (!isRecord(value)) {
    throw new PlanValidationError("A wellness profile is required.");
  }

  const gender = enumValue(value.gender, "gender", ["female", "male"] as const);
  const cyclePhase = value.cyclePhase === undefined || value.cyclePhase === ""
    ? undefined
    : enumValue(value.cyclePhase, "cyclePhase", [
        "menstrual",
        "follicular",
        "ovulation",
        "luteal",
        "menopause",
      ] as const);
  const allergies = value.allergies === undefined ? "" : value.allergies;

  if (typeof allergies !== "string" || allergies.length > 300) {
    throw new PlanValidationError("allergies must be no longer than 300 characters.");
  }

  return {
    age: numericValue(value.age, "age", 13, 120),
    weight: numericValue(value.weight, "weight", 25, 350),
    height: numericValue(value.height, "height", 100, 250),
    gender,
    ...(gender === "female" && cyclePhase ? { cyclePhase } : {}),
    activityLevel: enumValue(value.activityLevel, "activityLevel", [
      "sedentary",
      "light",
      "moderate",
      "active",
    ] as const),
    goal: enumValue(value.goal, "goal", ["balance", "lose", "gain", "maintain"] as const),
    dietary: enumValue(value.dietary, "dietary", [
      "standard",
      "vegetarian",
      "vegan",
      "pescatarian",
      "keto",
    ] as const),
    condition: enumValue(value.condition ?? "none", "condition", [
      "none",
      "pcos",
      "hypothyroidism",
      "hypertension",
      "low_testosterone",
      "insulin_resistance",
    ] as const),
    allergies: allergies.trim(),
  };
};

const parseMeal = (value: unknown, field: string): PlanMeal => {
  if (!isRecord(value)) {
    throw new PlanValidationError(`${field} must be a meal object.`);
  }

  const calories = numericValue(value.calories, `${field}.calories`, 1, 2000);
  if (!Number.isInteger(calories)) {
    throw new PlanValidationError(`${field}.calories must be a whole number.`);
  }

  return {
    item: boundedString(value.item, `${field}.item`, 300),
    calories,
    benefits: boundedString(value.benefits, `${field}.benefits`, 500),
  };
};

export const parseNutritionPlan = (value: unknown): NutritionPlan => {
  let parsed = value;
  if (typeof value === "string") {
    const cleaned = value.replace(/```(?:json)?/gi, "").trim();
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new PlanValidationError("The generated plan was not valid JSON.");
    }
  }

  if (!isRecord(parsed) || !isRecord(parsed.meals) || !isRecord(parsed.workout)) {
    throw new PlanValidationError("The generated plan is missing required sections.");
  }

  return {
    summary: boundedString(parsed.summary, "summary", 1000),
    meals: {
      breakfast: parseMeal(parsed.meals.breakfast, "meals.breakfast"),
      lunch: parseMeal(parsed.meals.lunch, "meals.lunch"),
      dinner: parseMeal(parsed.meals.dinner, "meals.dinner"),
      snack: parseMeal(parsed.meals.snack, "meals.snack"),
    },
    workout: {
      type: boundedString(parsed.workout.type, "workout.type", 120),
      duration: boundedString(parsed.workout.duration, "workout.duration", 80),
      focus: boundedString(parsed.workout.focus, "workout.focus", 500),
    },
  };
};
