# 与上游 Nutlope/self.so 的对比与合并指南

## 当前状态（对比结果）

- **上游 remote**：已添加为 `upstream`（https://github.com/Nutlope/self.so.git）
- **提交关系**：
  - 上游 `main` 比你多 **17 个提交**（你还没有的更新）
  - 你的 `main` 比上游多 **16 个提交**（你的独有修改，如 aimorpher 重命名、R2、README 等）

## 上游 main 里你还没有的更新（17 个提交）

| 提交 | 说明 |
|------|------|
| 0eb5da0 | Update test.yml |
| 063a33a | Add GitHub Actions workflow for running tests with Node.js 20.x |
| 38dbf45 | Improve WorkExperience formatting and update AI API config |
| c3a0540 | fix: Can't Edit Website and Incorrect User Social Links |
| d9e7e0b | Update contact and work experience fields to be nullable in resume schema |
| 6930039 | fix build |
| ed92e79 | feat: Update LLM model to Qwen Next and add Together AI referral link |
| a5f54c2 | Update AI resume processing and testing infrastructure |
| 55640d9 | Update resume object prompt for stricter JSON structure |
| e8406f5 | Update AI model to Qwen3-Coder-480B-A35B-Instruct-FP8 with 2 retries |
| aaae299 | Update AI resume generation logic and dependencies in Next.js project |
| 037fbab | Merge RSC CVE fix (PR #38) |
| 3a7b8b3 | Fix React Server Components CVE vulnerabilities |
| 8a67f28 | framer |
| 74e26d9 | Update tsconfig.json |
| 410ad29 | "next": "16.0.7" |

## 你的独有修改（16 个提交）

包括：项目重命名为 aimorpher、迁移到 Cloudflare R2、README 中英文更新（geekskai666）、依赖升级（React 19、Next 15）、RSC CVE 修复（你的 PR）、page.tsx 与 PDF 处理等。

## 文件级差异概览

与 `upstream/main` 相比，你这边有改动的涉及约 44 个文件，包括：

- `app/page.tsx`、多个 `components/*`、`lib/resume.ts`、`lib/server/ai/*`
- 你删除了 R2 相关：`hooks/useR2Upload.tsx`、`lib/server/deleteR2File.ts`、`lib/server/r2Client.ts` 等；上游仍使用 S3（`lib/server/deleteS3File.ts`）
- `package.json`、`pnpm-lock.yaml`、`next.config.mjs`、`tsconfig.json`、`vitest.config.ts`、`middleware.ts` → `proxy.ts`、`public/logo.svg` 等

合并时需要重点处理：**存储（R2 vs S3）**、**依赖版本（Next 15 vs 16）**、**CVE 修复的重复/冲突**。

---

## 合并上游代码的几种方式

### 方式一：直接合并 upstream/main 到当前 main（推荐先备份）

```bash
# 确保在 main 且工作区干净
git checkout main
git status   # 如有未提交修改，先 commit 或 stash

# 合并上游 main
git merge upstream/main
```

若有冲突，Git 会列出文件，你需要在编辑器里解决冲突后：

```bash
git add .
git commit -m "Merge upstream/main into aimorpher"
```

**注意**：很可能在以下位置出现冲突，需要你手动决定保留“你的 R2/aimorpher 逻辑”还是“上游的 S3/新功能”：

- `lib/server/*`（R2 vs S3）
- `package.json` / `pnpm-lock.yaml`
- `components/*`、`lib/resume.ts`、`lib/server/ai/*`

---

### 方式二：先在上游更新上开分支，再合并到 main（便于回滚）

```bash
git fetch upstream
git checkout -b merge-upstream-main
git merge upstream/main
# 解决冲突后
git add . && git commit -m "Merge upstream/main"
git checkout main
git merge merge-upstream-main
```

这样若合并结果不满意，可以暂时不用 `merge-upstream-main`，保持 `main` 不变。

---

### 方式三：变基（让你的提交“接在”上游最新提交之后）

```bash
git checkout main
git rebase upstream/main
# 若有冲突，每解决一个就：git add . && git rebase --continue
# 若想放弃变基：git rebase --abort
```

变基会改写你本地的 16 个提交历史，若已经 push 过 main，之后需要 `git push --force-with-lease`，请谨慎使用。

---

## 建议流程（兼顾合并与保留你的修改）

1. **备份当前分支**
   ```bash
   git branch backup-main-before-merge
   ```

2. **更新上游并合并**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

3. **解决冲突时优先保留**
   - 存储与部署：你的 **R2** 与相关配置（如 `useR2Upload`、`r2Client`、`deleteR2File`）
   - 项目名与文档：**aimorpher**、README 中 geekskai666 等
   - 功能与 bug 修复：可尽量采纳上游的 **AI 配置、WorkExperience、可编辑 Website、nullable 字段、测试 workflow** 等

4. **合并后检查**
   ```bash
   pnpm install
   pnpm build
   # 再跑你的测试或本地试跑
   ```

5. **若合并结果不满意**
   ```bash
   git checkout main
   git reset --hard backup-main-before-merge
   ```

---

## 仅查看差异、不合并

- 查看上游与你之间的提交差异：
  ```bash
  git log main..upstream/main --oneline
  git log upstream/main..main --oneline
  ```

- 查看某文件与上游的差异：
  ```bash
  git diff main upstream/main -- -- <文件路径>
  ```

- 之后若上游有更新，先拉取再比较：
  ```bash
  git fetch upstream
  git log main..upstream/main --oneline
  ```

---

**总结**：当前项目与 Nutlope/self.so 的差异 = 上游 17 个新提交 vs 你的 16 个独有提交；合并时以“保留 R2 + aimorpher 品牌，吸收上游功能与修复”为原则处理冲突即可。若你告诉我更倾向“尽量少改”还是“尽量跟上游一致”，可以再细化冲突文件的取舍建议。
