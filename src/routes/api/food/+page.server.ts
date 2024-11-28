import {
	addJunkfoodLog,
	deleteJunkfoodLog,
	getAllJunkfoodLogs,
	type Food
} from '$lib/server/queries/foodLog';
import { json } from '@sveltejs/kit';

export async function GET() {
	const data = await getAllJunkfoodLogs();
	return json(data);
}

export async function POST(food: Food) {
	await addJunkfoodLog(food);
}

export async function DELETE(food: Food) {
	await deleteJunkfoodLog(food);
}
