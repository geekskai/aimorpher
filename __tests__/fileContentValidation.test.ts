import { describe, expect, it } from 'vitest';
import {
  assessFileContent,
  isFileContentBad,
} from '@/lib/server/ai/isFileContentBad';

describe('resume PDF text quality', () => {
  it.each([
    `Alex Chen\nSenior Software Engineer\nToronto, Canada\nBuilt TypeScript and React products at Northstar Labs from 2022 to present. Led reliability work, mentored engineers, and shipped customer-facing workflow tools.`,
    `María García\nIngeniera de software\nMadrid, España\nExperiencia desarrollando aplicaciones web con TypeScript, React y PostgreSQL. Responsable de arquitectura, pruebas automatizadas y entrega continua.`,
    `陈晨\n高级软件工程师\n中国上海\n负责企业级前端平台、自动化测试和持续交付。使用 TypeScript、React 和 PostgreSQL 构建可靠产品，并带领团队完成多个客户项目。`,
  ])('accepts readable multilingual resume content', async (content) => {
    expect(assessFileContent(content)).toEqual({ valid: true });
    await expect(isFileContentBad(content)).resolves.toBe(false);
  });

  it.each([
    ['', 'empty'],
    ['Alex Chen\nEngineer', 'too_short'],
    [`${'experience '.repeat(50)}`, 'repetitive'],
    [`${'\u0000\u0001\u0002'.repeat(80)}`, 'unreadable'],
  ])('rejects unusable extracted text: %s', async (content, reason) => {
    expect(assessFileContent(content)).toEqual({ valid: false, reason });
    await expect(isFileContentBad(content)).resolves.toBe(true);
  });
});
