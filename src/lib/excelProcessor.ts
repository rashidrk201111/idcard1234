import * as XLSX from 'xlsx';
import { IDCardData } from '../types';

export async function parseIDCardExcel(file: File): Promise<IDCardData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(worksheet);

        const mappedData: any[] = json.map((row, index) => ({
          id: String(index),
          fullName: row['Full Name'] || row['Name'] || 'John Doe',
          role: row['Role'] || row['Position'] || 'Employee',
          department: row['Department'] || '',
          employeeId: String(row['Employee ID'] || row['ID'] || index + 1000),
          studentId: String(row['Student ID'] || row['ID'] || index + 1000),
          rollNo: String(row['Roll No'] || row['Roll'] || ''),
          branch: String(row['Branch'] || row['Section'] || row['Class'] || ''),
          bloodGroup: String(row['Blood Group'] || row['Blood'] || ''),
          address: String(row['Address'] || ''),
          dob: String(row['DOB'] || row['Date of Birth'] || ''),
          fathersName: String(row['Father\'s Name'] || row['Father Name'] || ''),
          mothersName: String(row['Mother\'s Name'] || row['Mother Name'] || ''),
          contactNo: String(row['Contact No'] || row['Contact'] || row['Phone'] || ''),
          session: String(row['Session'] || ''),
          institutionName: String(row['Institution Name'] || row['School Name'] || row['College Name'] || ''),
          institutionAddress: String(row['Institution Address'] || ''),
          institutionPhone: String(row['Institution Phone'] || ''),
          showBarcode: true,
          grade: String(row['Grade'] || row['Class'] || ''),
          issueDate: row['Issue Date'] || new Date().toLocaleDateString(),
          expiryDate: row['Expiry Date'] || 'N/A',
          photoUrl: row['Photo URL'] || '',
        }));

        resolve(mappedData as IDCardData[]);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}
