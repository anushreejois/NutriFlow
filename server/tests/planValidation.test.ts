import assert from "node:assert/strict";
import { test } from "node:test";
import { withModelFallback } from "../src/services/modelFallback";
import {
  parseNutritionPlan,
  parseWellnessProfile,
  PlanValidationError,
} from "../src/services/planValidation";

const profile = {
  age: "24",
  weight: "68",
  height: "178",
  gender: "female",
  cyclePhase: "follicular",
  activityLevel: "moderate",
  goal: "balance",
  dietary: "vegetarian",
  condition: "pcos",
  allergies: "peanuts",
};

const validPlan = {
  summary: "A balanced routine with regular meals and comfortable movement.",
  meals: {
    breakfast: { item: "Oats and berries", calories: 400, benefits: "Provides fiber." },
    lunch: { item: "Lentil bowl", calories: 600, benefits: "Provides protein." },
    dinner: { item: "Vegetable curry", calories: 500, benefits: "Provides varied vegetables." },
    snack: { item: "Apple", calories: 150, benefits: "A convenient fruit option." },
  },
  workout: {
    type: "Walking",
    duration: "30 minutes",
    focus: "Move at a comfortable pace and stop if you feel unwell.",
  },
};

test("normalizes valid profile values and preserves allergy constraints", () => {
  assert.deepEqual(parseWellnessProfile(profile), {
    age: 24,
    weight: 68,
    height: 178,
    gender: "female",
    cyclePhase: "follicular",
    activityLevel: "moderate",
    goal: "balance",
    dietary: "vegetarian",
    condition: "pcos",
    allergies: "peanuts",
  });
});

test("rejects out-of-range measurements and unsupported profile options", () => {
  assert.throws(
    () => parseWellnessProfile({ ...profile, age: "12" }),
    PlanValidationError,
  );
  assert.throws(
    () => parseWellnessProfile({ ...profile, dietary: "unrestricted" }),
    PlanValidationError,
  );
});

test("parses a complete plan and strips unrecognized fields", () => {
  assert.deepEqual(
    parseNutritionPlan(JSON.stringify({ ...validPlan, medicalDiagnosis: "not allowed" })),
    validPlan,
  );
});

test("rejects malformed plans and unsafe numeric output", () => {
  assert.throws(() => parseNutritionPlan("not JSON"), /valid JSON/);
  assert.throws(
    () => parseNutritionPlan({ ...validPlan, meals: { ...validPlan.meals, breakfast: undefined } }),
    /meal object/,
  );
  assert.throws(
    () => parseNutritionPlan({
      ...validPlan,
      meals: {
        ...validPlan.meals,
        breakfast: { ...validPlan.meals.breakfast, calories: 9000 },
      },
    }),
    /between 1 and 2000/,
  );
});

test("tries the next model when the first response fails plan validation", async () => {
  const attemptedModels: string[] = [];
  const responses = ["{}", JSON.stringify(validPlan)];

  const result = await withModelFallback(["primary", "fallback"], async (model) => {
    attemptedModels.push(model);
    return parseNutritionPlan(responses.shift());
  });

  assert.deepEqual(result, validPlan);
  assert.deepEqual(attemptedModels, ["primary", "fallback"]);
});
