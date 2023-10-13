import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'custom-duration',
	name: 'Duration',
	icon: 'box',
	description: 'Duration of time',
	component: InterfaceComponent,
	options: null,
	types: ['integer'],
});
