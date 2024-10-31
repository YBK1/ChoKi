module.exports = {
  extends: ["next/core-web-vitals", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  rules: {
    // 선언되지 않은 변수 또는 임포트 구문 정리 규칙
    "no-undef": "error",
  },
};
