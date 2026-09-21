import { validateVacancy } from './index.js';

export function validateSourceRecord(record = {}) {
  return validateVacancy(record);
}
