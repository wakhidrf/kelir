import { Questionnaire } from "./questionnaire";

// Type-test negatif (§6/§6b STYLE.md): JSX langsung + nilai literal.
// Questionnaire: questions QuestionnaireQuestion[] (title TEKS) + value
// Record + onChange/onComplete Record semantik.
export function questionnaireContractChecks() {
  const ok = (
    <Questionnaire
      questions={[{ id: "q1", type: "freeform", title: "Nama?" }]}
    />
  );

  const noNodeTitle = (
    <Questionnaire
      questions={[
        {
          id: "q1",
          type: "freeform",
          // @ts-expect-error - title node bukan kontrak QuestionnaireQuestion
          title: <b>Nama?</b>,
        },
      ]}
    />
  );
  const noEventChange = (
    <Questionnaire
      questions={[{ id: "q1", type: "freeform", title: "Nama?" }]}
      // @ts-expect-error - onChange event haram (pakai Record)
      onChange={(_e: unknown, _x: unknown) => {}}
    />
  );
  const noStyle = (
    <Questionnaire
      questions={[{ id: "q1", type: "freeform", title: "Nama?" }]}
      // @ts-expect-error - style milik kit
      style={{ margin: 4 }}
    />
  );
  return { ok, noNodeTitle, noEventChange, noStyle };
}
