const DEFAULT_WEIGHTS = { squat:20, bench:20, row:20, ohp:20, deadlift:60 };
const INCREMENT = { squat:2.5, bench:2.5, row:2.5, ohp:2.5, deadlift:5 };
const WORKOUT_A = ["squat", "bench", "row"];
const WORKOUT_B = ["squat", "ohp", "deadlift"];
const EXERCISE_NAMES = {
  squat: "스쿼트", bench: "벤치프레스", row: "바벨 로우",
  ohp: "오버헤드프레스", deadlift: "데드리프트"
};

function loadState() {
  const saved = localStorage.getItem("sl5x5_state");
  if (saved) return JSON.parse(saved);
  return {
    sessionCount: 0,
    weights: { ...DEFAULT_WEIGHTS },
    failCount: { squat:0, bench:0, row:0, ohp:0, deadlift:0 },
    history: []
  };
}

function saveState(state) {
  localStorage.setItem("sl5x5_state", JSON.stringify(state));
}

function getTodayWorkout(sessionCount) {
  return sessionCount % 2 === 0 ? WORKOUT_A : WORKOUT_B;
}

function completeSession(results) {
  const state = loadState();
  const today = new Date().toISOString().slice(0, 10);
  const isA = getTodayWorkout(state.sessionCount) === WORKOUT_A;
  const workoutType = isA ? "A" : "B";
  const record = { date: today, workout: workoutType, exercises: [] };

  results.forEach(({ name, success }) => {
    const w = state.weights[name];
    record.exercises.push({ name, weight: w, success });
    if (success) {
      state.failCount[name] = 0;
      state.weights[name] = Math.round((state.weights[name] + INCREMENT[name]) * 10) / 10;
    } else {
      state.failCount[name]++;
      if (state.failCount[name] >= 3) {
        state.weights[name] = Math.round(state.weights[name] * 0.9 / 2.5) * 2.5;
        state.failCount[name] = 0;
      }
    }
  });

  state.history.push(record);
  state.sessionCount++;
  saveState(state);
}