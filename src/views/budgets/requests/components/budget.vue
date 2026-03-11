<template>
	<UiParentCard>
		<template #action>
			<div class="text-subtitle-2 text-medium-emphasis" v-if="department">
				Departamento: {{ department }}
			</div>
		</template>

		<v-table density="comfortable">
			<thead>
				<tr>
					<th class="text-left">Rubro</th>
					<th class="text-end">Monto asignado</th>
					<th class="text-end">Monto solicitado</th>
					<th class="text-end">Diferencia</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in rows" :key="row.category">
					<td>{{ row.category }}</td>
					<td class="text-end">{{ formatAmount(row.assigned) }}</td>
					<td class="text-end">{{ formatAmount(row.requested) }}</td>
					<td :class="['text-end', row.difference < 0 ? 'text-error' : 'text-success']">
						{{ formatAmount(row.difference) }}
					</td>
				</tr>
				<tr class="font-weight-medium bg-grey-lighten-4">
					<td>Total</td>
					<td class="text-end">{{ formatAmount(totals.assigned) }}</td>
					<td class="text-end">{{ formatAmount(totals.requested) }}</td>
					<td :class="['text-end', totals.difference < 0 ? 'text-error' : 'text-success']">
						{{ formatAmount(totals.difference) }}
					</td>
				</tr>
			</tbody>
		</v-table>
	</UiParentCard>
</template>

<script setup lang="ts">
import { computed } from "vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import { normalizeAmount, formatAmount } from "@/utils/numberFormat";

type BudgetRow = {
	category: string;
	assigned_amount: number | string;
	requested_amount: number | string;
};

const props = defineProps<{ department?: string; items: BudgetRow[] }>();

const rows = computed(() =>
	(props.items || []).map((item) => {
		const assigned = normalizeAmount(item.assigned_amount);
		const requested = normalizeAmount(item.requested_amount);
		return {
			category: item.category,
			assigned,
			requested,
			difference: assigned - requested,
		};
	})
);

const totals = computed(() => rows.value.reduce(
	(acc, row) => {
		acc.assigned += row.assigned;
		acc.requested += row.requested;
		acc.difference += row.difference;
		return acc;
	},
	{ assigned: 0, requested: 0, difference: 0 }
));
</script>
