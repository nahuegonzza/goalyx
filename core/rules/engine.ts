import type { Event, Rule } from '@types';

interface RuleResult {
  ruleId: string;
  adjustment: number;
  reason: string;
}

function evaluateRuleCondition(rule: Rule, event: Event): boolean {
  if (!rule.active) return false;
  if (rule.target !== 'all' && rule.target !== event.type) return false;
  if (!rule.condition || rule.condition === 'always') return true;
  if (rule.condition.startsWith('value>')) {
    const threshold = Number(rule.condition.replace('value>', '').trim());
    return event.value > threshold;
  }
  if (rule.condition.startsWith('value<')) {
    const threshold = Number(rule.condition.replace('value<', '').trim());
    return event.value < threshold;
  }
  return rule.condition === event.type || rule.condition === 'true';
}

function resolveAction(rule: Rule, event: Event): number {
  const multiplier = Number(rule.config?.multiplier ?? 1);
  const base = Number(rule.config?.base ?? event.value);
  const thresholdRaw = rule.config?.threshold;
  const threshold = typeof thresholdRaw === 'number' ? thresholdRaw : Number(thresholdRaw ?? 3);

  if (rule.action.startsWith('add')) {
    return base * multiplier;
  }

  if (rule.action.startsWith('subtract')) {
    return -Math.abs(base * multiplier);
  }

  if (rule.action.startsWith('custom:')) {
    const raw = rule.action.replace('custom:', '').trim();
    if (raw === 'progressive') {
      if (event.value <= threshold) {
        return -0.5 * event.value;
      }
      return -0.5 * threshold + -1 * (event.value - threshold);
    }
  }

  return 0;
}

export function applyRulesToEvent(event: Event, rules: Rule[]): RuleResult[] {
  return rules
    .filter((rule) => evaluateRuleCondition(rule, event))
    .map((rule) => ({
      ruleId: rule.id,
      adjustment: resolveAction(rule, event),
      reason: `Regla ${rule.id} aplicada a ${event.type}`
    }));
}
