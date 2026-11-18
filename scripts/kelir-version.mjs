// Single source for the gate-script version (issue #114).
//
// Versioning policy: bump the MINOR when a rule change adds a significant
// number of new errors, or when the tooling gains a consumer-facing feature
// (e.g. --fix, .kelirrc, kelir-all), so consumers can pin a known-good kit tag;
// bump the PATCH for message, suggestion, or allow-only changes. Consumers can
// print the version from any gate (`kelir-guard`, `kelir-bury`, ...) to confirm
// which rule set they are running.
export const TOOLS_VERSION = "1.2.0";