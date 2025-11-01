import type { Employee } from '../types/employee';
import { getRecords } from './baseApi';

const TABLE_NAME = 'EMPLOYEES';

export const getEmployees = () => getRecords<Employee>(TABLE_NAME);
