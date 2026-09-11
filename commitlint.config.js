export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Keep the existing Spanish imperative voice and paragraph bodies.
    "subject-case": [0],
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
