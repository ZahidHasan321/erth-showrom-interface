import type { Customer } from '../types/customer';
import { getRecords, getRecordById, searchRecords } from './baseApi';

const TABLE_NAME = 'CUSTOMER';

export const getCustomers = () => getRecords<Customer>(TABLE_NAME);

export const getCustomerById = (id: string) => getRecordById<Customer>(TABLE_NAME, id);

export const searchCustomerByPhone = (phone: string) => {
  return searchRecords<Customer>(TABLE_NAME, { PHONE: phone });
};

// getCustomers result
// {
//   "status": "success",
//   "table_name": "CUSTOMER",
//   "count": 10,
//   "records": [
//     {
//       "id": "rec03VxOaL0ChTQ3P",
//       "createdTime": "2025-07-28T05:16:41.000Z",
//       "fields": {
//         "PHONE": "51058074",
//         "NAME": "HADI MUTERI",
//         "ORDERS": [
//           "rec9h9xjYSFxnQAea",
//           "recfAh5Fq2GYY1lWH"
//         ],
//         "ID": 816,
//         "ID GARMENT": [
//           "recyeT2z0J7yf2UOY",
//           "recyeT2z0J7yf2UOY"
//         ],
//         "1 ST LETTER": "H",
//         "ID MEAS": [
//           "rectYxVZpVpakAm1Y",
//           "rectYxVZpVpakAm1Y"
//         ],
//         "NBRE OF PIECES": 2,
//         "NBRE OF PIECES copy": [
//           "0823",
//           "0823"
//         ],
//         "NBRE OF FATOURA": 1
//       }
//     },
//     {
//       "id": "rec04du30MGSSdcQt",
//       "createdTime": "2024-11-30T07:17:32.000Z",
//       "fields": {
//         "PHONE": "50800555",
//         "NAME": "TAMIR AL JUMMOUR",
//         "ID": 69,
//         "1 ST LETTER": "T",
//         "NBRE OF PIECES": 0,
//         "NBRE OF FATOURA": 0
//       }
//     },
//     {
//       "id": "rec09CXgt4vIClr7u",
//       "createdTime": "2025-02-21T13:52:58.000Z",
//       "fields": {
//         "PHONE": "50167566",
//         "NAME": "YAKOUB",
//         "ORDERS": [
//           "reck1oUjCbumM9z5f",
//           "recDTkNVWK4hnvrDA",
//           "recyNOTr2mJGxqrn9"
//         ],
//         "ID": 266,
//         "ID GARMENT": [
//           "recmmbu5KLbjoS0cY",
//           "recmmbu5KLbjoS0cY",
//           "recmmbu5KLbjoS0cY"
//         ],
//         "1 ST LETTER": "Y",
//         "ID MEAS": [
//           "recR19ByouzEOVEw6",
//           "recR19ByouzEOVEw6",
//           "recR19ByouzEOVEw6"
//         ],
//         "NBRE OF PIECES": 3,
//         "NBRE OF PIECES copy": [
//           "0018",
//           "0018",
//           "0018"
//         ],
//         "NBRE OF FATOURA": 1
//       }
//     },
//     {
//       "id": "rec0FUdPO1JZMM7Lx",
//       "createdTime": "2025-04-16T06:32:52.000Z",
//       "fields": {
//         "PHONE": "99862376",
//         "NAME": "FAIZ AL MUTERI",
//         "ORDERS": [
//           "recYQooW0u5mVrvAh",
//           "rec0P3K8OR4kRYv5W",
//           "recJMnkeHuT2iJAZ4",
//           "rec5IRRcHUhI0jo6i",
//           "receTd8UbW3SzTORn",
//           "recBgEOsqs0ZgE2It",
//           "recBMwBKITH611xDq",
//           "recStJhMOg1wuOl7z",
//           "recW9EFLcPQ7KosIG",
//           "recsmtMClTJ5RKI76",
//           "recvW3hxgFVR2Bw35"
//         ],
//         "ID": 540,
//         "ID GARMENT": [
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE",
//           "rec09yURJJaHtztqE"
//         ],
//         "1 ST LETTER": "F",
//         "ID MEAS": [
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX",
//           "recaoVYJ3PCe32DZX"
//         ],
//         "NBRE OF PIECES": 11,
//         "NBRE OF PIECES copy": [
//           "0400",
//           "0400",
//           "0400",
//           "0400",
//           "0400",
//           "0400",
//           "0400",
//           "0400",
//           "0400",
//           "0400",
//           "0400"
//         ],
//         "NBRE OF FATOURA": 1
//       }
//     },
//     {
//       "id": "rec0JxTzr0NLzTa0e",
//       "createdTime": "2025-05-27T06:13:14.000Z",
//       "fields": {
//         "PHONE": "98704932",
//         "NAME": "MISHAL AL MUTERI",
//         "ORDERS": [
//           "recas8odyHEZH2VRh",
//           "recGm03ISM39kn1p1"
//         ],
//         "ID": 649,
//         "ID GARMENT": [
//           "reczX8aZWGLjvnI6d",
//           "recrPP9ioCwYxHxup"
//         ],
//         "1 ST LETTER": "M",
//         "ID MEAS": [
//           "recHpMi7v3VUj17KB",
//           "recHpMi7v3VUj17KB"
//         ],
//         "NBRE OF PIECES": 2,
//         "NBRE OF PIECES copy": [
//           "0612",
//           "0612"
//         ],
//         "NBRE OF FATOURA": 1
//       }
//     },
//     {
//       "id": "rec0SHtVNMkkxVqCZ",
//       "createdTime": "2025-03-13T10:08:32.000Z",
//       "fields": {
//         "PHONE": "97949424",
//         "NAME": "SULEMAN",
//         "ORDERS": [
//           "rec09Pzoqzvfsr6DT",
//           "rec55hFlvEptnzgrj",
//           "recBauumEjPAl537O",
//           "recPFFQXoetUJZGDF"
//         ],
//         "ID": 425,
//         "ID GARMENT": [
//           "recGCpVWlseqcaHu7",
//           "recFwpjR4tqvXDcQh",
//           "recGCpVWlseqcaHu7",
//           "recFwpjR4tqvXDcQh"
//         ],
//         "1 ST LETTER": "S",
//         "ID MEAS": [
//           "recwHOpFTGMAAc6Vq",
//           "recwHOpFTGMAAc6Vq",
//           "recwHOpFTGMAAc6Vq",
//           "recwHOpFTGMAAc6Vq"
//         ],
//         "NBRE OF PIECES": 4,
//         "NBRE OF PIECES copy": [
//           "0219 OLD",
//           "0219 OLD",
//           "0219 OLD",
//           "0219 OLD"
//         ],
//         "NBRE OF FATOURA": 1
//       }
//     },
//     {
//       "id": "rec0YseN9I7wRvbSR",
//       "createdTime": "2024-11-22T11:11:44.000Z",
//       "fields": {
//         "PHONE": "56665425",
//         "NAME": "AMMAR MYKYAL",
//         "ID": 4,
//         "1 ST LETTER": "A",
//         "NBRE OF PIECES": 0,
//         "NBRE OF FATOURA": 0
//       }
//     },
//     {
//       "id": "rec0aRPctyTVS92fP",
//       "createdTime": "2025-06-01T04:47:34.000Z",
//       "fields": {
//         "PHONE": "66662099",
//         "NAME": "SAAD HAMAD",
//         "ORDERS": [
//           "rec3HpB4lJ66DjI2F",
//           "recfqSn9cZ3hkp1eX",
//           "rec5VV47EQFGlm2aW"
//         ],
//         "ID": 668,
//         "ID GARMENT": [
//           "recLUjGWqr25MrfP9",
//           "recLUjGWqr25MrfP9",
//           "recLUjGWqr25MrfP9"
//         ],
//         "1 ST LETTER": "S",
//         "ID MEAS": [
//           "recpSWk7mQyOrrSHf",
//           "recpSWk7mQyOrrSHf",
//           "recpSWk7mQyOrrSHf"
//         ],
//         "NBRE OF PIECES": 3,
//         "NBRE OF PIECES copy": [
//           "0642",
//           "0642",
//           "0642"
//         ],
//         "NBRE OF FATOURA": 1
//       }
//     },
//     {
//       "id": "rec0ckN3PddT9G32B",
//       "createdTime": "2025-04-23T07:02:10.000Z",
//       "fields": {
//         "PHONE": "99239990",
//         "NAME": "AHEMAD A SHAMARI",
//         "ORDERS": [
//           "recKJkfxuZvjUPxki",
//           "rec7S8pr1kYsir46m",
//           "rec1fk69CsPHXLjDC",
//           "recOxNHubfq1XtzJK"
//         ],
//         "ID": 553,
//         "ID GARMENT": [
//           "recCnBZRTaMwM3sz7",
//           "recCnBZRTaMwM3sz7",
//           "recCnBZRTaMwM3sz7",
//           "recCnBZRTaMwM3sz7"
//         ],
//         "1 ST LETTER": "A",
//         "ID MEAS": [
//           "recL2DPmp0iSeyHDY",
//           "recL2DPmp0iSeyHDY",
//           "recL2DPmp0iSeyHDY",
//           "recL2DPmp0iSeyHDY"
//         ],
//         "NBRE OF PIECES": 4,
//         "NBRE OF PIECES copy": [
//           "0431",
//           "0431",
//           "0431",
//           "0431"
//         ],
//         "NBRE OF FATOURA": 1
//       }
//     },
//     {
//       "id": "rec0qQGvBVusi0NeL",
//       "createdTime": "2025-07-09T05:46:41.000Z",
//       "fields": {
//         "PHONE": "51055594",
//         "NAME": "ABDULLAH AL AJMI",
//         "ORDERS": [
//           "recP7Qvvg2yYNqs88",
//           "rec7saG8CKVKj9M3p",
//           "recoIdD8pC0cEuVRQ",
//           "recO6MQDF7GYlbo7F",
//           "recwIRQVfysyzcKDp",
//           "recIcO3xS94C6P9Xv"
//         ],
//         "ID": 769,
//         "ID GARMENT": [
//           "recQswI3n7CTAOSJO",
//           "recQswI3n7CTAOSJO",
//           "recQswI3n7CTAOSJO",
//           "recQswI3n7CTAOSJO",
//           "recQswI3n7CTAOSJO",
//           "recQswI3n7CTAOSJO"
//         ],
//         "1 ST LETTER": "A",
//         "ID MEAS": [
//           "recvCWsbO6HRJlCZy",
//           "recvCWsbO6HRJlCZy",
//           "recvCWsbO6HRJlCZy",
//           "recvCWsbO6HRJlCZy",
//           "recvCWsbO6HRJlCZy",
//           "recvCWsbO6HRJlCZy"
//         ],
//         "NBRE OF PIECES": 6,
//         "NBRE OF PIECES copy": [
//           "0765",
//           "0765",
//           "0765",
//           "0765",
//           "0765",
//           "0765"
//         ],
//         "NBRE OF FATOURA": 1
//       }
//     }
//   ]
// }