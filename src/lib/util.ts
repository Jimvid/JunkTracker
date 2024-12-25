import { addDays, differenceInDays, endOfYear, format, startOfYear } from 'date-fns';
import type { JunkLog } from './server/db/schema';

export const getColor = (contributions: number | null): string => {
	if (contributions === null) return '#fafafa';
	if (contributions === 0) return '#fafafa';
	if (contributions < 3) return '#e99b9b';
	if (contributions < 5) return '#d36a6a';
	if (contributions < 9) return '#a13030';
	return '#fc0303';
};

export type ContributionData = {
	[date: string]: JunkLog[] | null;
};

export type YearContributions = {
	[year: string]: ContributionData;
};

export function generateYearContributions(logs: JunkLog[], year: number): YearContributions {
	const data: ContributionData = {};
	const startYear = startOfYear(new Date(year, 0, 1));
	const endYear = endOfYear(new Date(year, 11, 31));
	const daysInYear = differenceInDays(endYear, startYear) + 1;

	// Efficiently group logs by date
	const logsByDate = new Map<string, JunkLog[]>();
	logs.forEach((log) => {
		if (!logsByDate.has(log.date)) {
			logsByDate.set(log.date, []);
		}
		logsByDate.get(log.date)!.push(log);
	});

	for (let i = 0; i < daysInYear; i++) {
		const date = format(addDays(startYear, i), 'yyyy-MM-dd');
		data[date] = logsByDate.get(date) || null;
	}

	return { [year]: data };
}
