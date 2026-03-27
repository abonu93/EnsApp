(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.HemorrhagicEligibilityRules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function fastest(input) {
    const baseCriteriaMet =
      input.ltsw <= 2 &&
      input.premrs <= 2 &&
      input.age >= 18 &&
      input.age <= 80;

    const extraMissing =
      !input.brainstem ||
      !input.procoagulant ||
      !input.ecg ||
      !input.thrombosis ||
      !input.pregnancy ||
      !input.angioplasty ||
      !input.ivhScore;

    const criteriaMet =
      input.gcs >= 8 &&
      input.hemVolume >= 2 &&
      input.hemVolume < 60 &&
      input.brainstem === "no" &&
      input.procoagulant === "no" &&
      input.ecg === "no" &&
      input.thrombosis === "no" &&
      input.pregnancy === "no" &&
      input.angioplasty === "no" &&
      input.ivhScore === "yes" &&
      input.anticoag === "none";

    return {
      baseCriteriaMet,
      extraMissing,
      eligible: baseCriteriaMet && !extraMissing && criteriaMet,
    };
  }

  function tich3(input) {
    return (
      input.ltsw < 4.5 &&
      input.hemVolume < 60 &&
      input.ivh === "no" &&
      input.gcs >= 5 &&
      input.seizure === "no" &&
      input.secondaryCause === "None"
    );
  }

  return {
    fastest,
    tich3,
  };
});
