(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.AcuteEligibilityRules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function hasVessel(targetVessels, code) {
    return toArray(targetVessels).includes(code);
  }

  function selectedVesselCount(targetVessels) {
    return toArray(targetVessels).length;
  }

  function computeVesselFlags(targetVessels) {
    return {
      vanish: hasVessel(targetVessels, "ica-terminal") || hasVessel(targetVessels, "m1"),
      pivotal:
        hasVessel(targetVessels, "ica-terminal") ||
        hasVessel(targetVessels, "m1") ||
        hasVessel(targetVessels, "basilar"),
      moste:
        hasVessel(targetVessels, "ica-terminal") ||
        hasVessel(targetVessels, "m1") ||
        hasVessel(targetVessels, "m2-any") ||
        hasVessel(targetVessels, "m2-proxdom"),
      twin2win2:
        hasVessel(targetVessels, "ica-terminal") ||
        hasVessel(targetVessels, "m1") ||
        hasVessel(targetVessels, "basilar"),
      artemis:
        hasVessel(targetVessels, "ica-intracranial") ||
        hasVessel(targetVessels, "ica-terminal") ||
        hasVessel(targetVessels, "m1") ||
        hasVessel(targetVessels, "m2-proxdom"),
      hybernia:
        hasVessel(targetVessels, "ica-intracranial") ||
        hasVessel(targetVessels, "ica-terminal") ||
        hasVessel(targetVessels, "m1") ||
        hasVessel(targetVessels, "m2-any") ||
        hasVessel(targetVessels, "m2-proxdom"),
      promise:
        hasVessel(targetVessels, "ica-terminal") ||
        hasVessel(targetVessels, "m1") ||
        hasVessel(targetVessels, "m2-any") ||
        hasVessel(targetVessels, "m2-proxdom"),
      nivo:
        hasVessel(targetVessels, "gt-m2") ||
        hasVessel(targetVessels, "a2") ||
        hasVessel(targetVessels, "gt-a2") ||
        hasVessel(targetVessels, "p1") ||
        hasVessel(targetVessels, "p2") ||
        hasVessel(targetVessels, "gt-p2"),
    };
  }

  function isValidNumber(value) {
    return typeof value === "number" && !Number.isNaN(value);
  }

  function isLvo(lvo) {
    return lvo === "yes";
  }

  function weTrust(input) {
    const wakeupStroke = input.wakeupStroke === true;
    const maxHours = wakeupStroke ? 12 : 6;
    const wakeupSymptomsWithin6h = wakeupStroke ? input.wakeupSymptomsWithin6h === true : true;
    return (
      input.age >= 18 &&
      input.nihss >= 10 &&
      input.premrs <= 2 &&
      input.ltsw <= maxHours &&
      wakeupSymptomsWithin6h &&
      input.angiograph === "yes"
    );
  }

  function athena(input) {
    if (input.tortuosity === "") return false;
    return (
      input.age >= 22 &&
      input.age <= 85 &&
      input.nihss >= 8 &&
      input.premrs <= 2 &&
      input.ltsw <= 24 &&
      isLvo(input.lvo) &&
      input.tandem === "no" &&
      input.tortuosity === "no"
    );
  }

  function vanish(input) {
    const vessels = computeVesselFlags(input.targetVessels);
    return (
      input.age >= 18 &&
      input.premrs <= 1 &&
      input.nihss >= 6 &&
      isLvo(input.lvo) &&
      vessels.vanish
    );
  }

  function pivotal(input) {
    const vessels = computeVesselFlags(input.targetVessels);
    return (
      input.ltsw < 8 &&
      input.age >= 18 &&
      input.age <= 80 &&
      input.premrs <= 1 &&
      input.nihss >= 6 &&
      isLvo(input.lvo) &&
      vessels.pivotal
    );
  }

  function promise(input) {
    const vessels = computeVesselFlags(input.targetVessels);
    return (
      input.ltsw <= 24 &&
      input.age >= 18 &&
      input.premrs <= 2 &&
      input.nihss >= 1 &&
      isLvo(input.lvo) &&
      vessels.promise
    );
  }

  function nivo(input) {
    const vessels = computeVesselFlags(input.targetVessels);
    return (
      input.age >= 18 &&
      input.ltsw <= 24 &&
      input.nihss >= 5 &&
      input.premrs <= 2 &&
      isLvo(input.lvo) &&
      vessels.nivo &&
      selectedVesselCount(input.targetVessels) <= 1 &&
      isValidNumber(input.aspects) &&
      input.aspects >= 6
    );
  }

  function moste(input) {
    const vessels = computeVesselFlags(input.targetVessels);
    return input.ltsw < 23 && input.premrs <= 1 && input.nihss < 6 && isLvo(input.lvo) && vessels.moste;
  }

  function twin2win2(input) {
    const vessels = computeVesselFlags(input.targetVessels);
    return (
      input.ltsw < 24 &&
      input.age > 18 &&
      input.premrs <= 2 &&
      input.nihss >= 6 &&
      isLvo(input.lvo) &&
      vessels.twin2win2
    );
  }

  function artemis(input) {
    const vessels = computeVesselFlags(input.targetVessels);
    return (
      input.ltsw < 24 &&
      input.age >= 18 &&
      input.age <= 85 &&
      input.premrs <= 2 &&
      input.nihss >= 6 &&
      input.nihss <= 25 &&
      isLvo(input.lvo) &&
      vessels.artemis &&
      isValidNumber(input.aspects) &&
      input.aspects > 5
    );
  }

  function hybernia(input) {
    const vessels = computeVesselFlags(input.targetVessels);
    return (
      input.ltsw < 24 &&
      input.age >= 18 &&
      input.age <= 89 &&
      input.premrs <= 1 &&
      input.nihss >= 6 &&
      isLvo(input.lvo) &&
      vessels.hybernia &&
      isValidNumber(input.aspects) &&
      input.aspects > 4
    );
  }

  function doneSymple(input) {
    return (
      input.ltsw >= 24 &&
      input.ltsw <= 72 &&
      input.age >= 18 &&
      input.age <= 80 &&
      input.premrs <= 1 &&
      input.nihss >= 8 &&
      isLvo(input.lvo)
    );
  }

  function shionogi(input) {
    return (
      input.ltsw < 25 &&
      input.age > 18 &&
      input.premrs <= 1 &&
      input.nihss >= 6 &&
      input.nihss <= 22 &&
      input.lesionConfirmed === "yes"
    );
  }

  function sovateltide(input) {
    return (
      input.candidate === "not eligible" &&
      input.ltsw < 24 &&
      input.age >= 18 &&
      input.age <= 80 &&
      input.premrs <= 2 &&
      input.lesionConfirmed === "yes" &&
      input.nihss >= 8 &&
      input.nihss < 20
    );
  }

  function orion(input) {
    return (
      input.ltsw >= 4.5 &&
      input.ltsw <= 24 &&
      input.age >= 18 &&
      input.age <= 90 &&
      input.premrs <= 1 &&
      input.nihss > 5 &&
      selectedVesselCount(input.targetVessels) >= 1 &&
      input.contraTpa === "no"
    );
  }

  function doit(input) {
    return (
      input.age >= 18 &&
      input.ltsw <= 4.5 &&
      input.doac === "yes" &&
      input.ivtCandidate === "eligible"
    );
  }

  function remedy(input) {
    const hasExcludedVessel =
      hasVessel(input.targetVessels, "ica-intracranial") ||
      hasVessel(input.targetVessels, "ica-terminal") ||
      hasVessel(input.targetVessels, "m1") ||
      hasVessel(input.targetVessels, "va") ||
      hasVessel(input.targetVessels, "basilar");

    return (
      input.ltsw < 24 &&
      input.age >= 18 &&
      input.age <= 90 &&
      input.premrs <= 1 &&
      input.nihss >= 5 &&
      input.nihss <= 15 &&
      input.candidate === "not eligible" &&
      !hasExcludedVessel &&
      isValidNumber(input.aspects) &&
      input.aspects >= 6 &&
      input.acei !== "yes"
    );
  }

  return {
    computeVesselFlags,
    weTrust,
    athena,
    vanish,
    pivotal,
    promise,
    nivo,
    moste,
    twin2win2,
    artemis,
    hybernia,
    doneSymple,
    shionogi,
    sovateltide,
    orion,
    doit,
    remedy,
  };
});
