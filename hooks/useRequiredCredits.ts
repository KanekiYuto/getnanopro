import { useState, useEffect } from 'react';
import { getRequiredCredits, DEFAULT_CREDITS, type TaskType } from '@/config/ai-generator';

/**
 * 配额消耗计算 Hook
 * @param taskType 任务类型
 * @param model 模型名称
 * @param parameters 请求参数
 * @returns 所需配额数量
 */
export function useRequiredCredits(
  taskType: TaskType,
  model: string,
  parameters: Record<string, any>
): number {
  const [requiredCredits, setRequiredCredits] = useState<number>(DEFAULT_CREDITS);

  useEffect(() => {
    const credits = getRequiredCredits(taskType, model, parameters);
    setRequiredCredits(credits);
  }, [taskType, model, JSON.stringify(parameters)]);

  return requiredCredits;
}
