import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const generatedPath = resolve(root, "app/generated-build.ts");
const ignored = new Set(["app/generated-build.ts"]);

const gitLines = (...args) => {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
};

const files = [...new Set([
  ...gitLines("ls-files"),
  ...gitLines("ls-files", "--others", "--exclude-standard"),
])].filter((file) => !ignored.has(file) && !file.startsWith("dist/") && !file.startsWith("node_modules/") && existsSync(resolve(root, file))).sort();

const hash = createHash("sha256");
for (const file of files) {
  hash.update(file);
  hash.update(readFileSync(resolve(root, file)));
}
const id = hash.digest("hex").slice(0, 16);

const changed = [...new Set([
  ...gitLines("diff", "--name-only", "HEAD"),
  ...gitLines("ls-files", "--others", "--exclude-standard"),
])].filter((file) => file !== relative(root, generatedPath));

const areas = [];
if (changed.some((file) => file === "app/layout.tsx" || file === "app/manifest.ts" || file.startsWith("public/"))) areas.push("브랜드");
if (changed.some((file) => file.startsWith("app/admin/") || file.startsWith("lib/development-history") || file.startsWith("db/"))) areas.push("관리자");
if (changed.some((file) => file.includes("calculator") || file.startsWith("app/[tool]"))) areas.push("계산기");
if (changed.some((file) => file.includes("analytics"))) areas.push("통계");
if (!areas.length) areas.push("사이트");

const isCurrentFeature = areas.includes("브랜드") && areas.includes("관리자");
const title = isCurrentFeature ? "브랜드 아이콘·개발 이력 관리 개선" : `${areas.join("·")} 업데이트 반영`;
const description = isCurrentFeature
  ? "즐겨찾기와 모바일 홈 화면에서 오늘계산 로고가 보이도록 아이콘 체계를 정비하고, 관리자 개발·수정 이력 메뉴와 자동 기록 기능을 추가했습니다."
  : `${areas.join(", ")} 관련 기능과 콘텐츠의 변경사항을 새 사이트 버전에 반영했습니다.`;
const category = isCurrentFeature ? "기능 개선" : "자동 업데이트";

const output = `// This file is refreshed automatically before every production build.\nexport const generatedBuild = ${JSON.stringify({
  id: `build-${id}`,
  builtAt: new Date().toISOString(),
  title,
  description,
  category,
  changedAreas: areas,
}, null, 2)} as const;\n`;

writeFileSync(generatedPath, output);
