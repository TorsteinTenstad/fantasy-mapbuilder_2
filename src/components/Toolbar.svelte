<script lang="ts">
	import { add_article, add_map } from '$lib/types';
	import { store } from '../store.svelte';
	import dtb from '$lib/dtb';

	function toggleMinimize() {
		store.minimized = !store.minimized;
	}

	async function toggleEditable() {
		store.selected_marker = null;
		store.edit_mode = !store.edit_mode;
		if (store.edit_mode) {
			await dtb.fetch_all();
		}
	}

	function change_text_size(factor: number) {
		store.text_size = store.text_size * factor;
	}

	async function changeMarkerTarget() {
		if (store.selected_marker === null) {
			return;
		}
		dtb.fetch_all();
		const selected_markers = await dtb.get_markers([store.selected_marker]);
		if (selected_markers === undefined || selected_markers.length === 0) {
			return;
		}
		const selected_marker = selected_markers[0];
		switch (selected_marker.type) {
			case 'Informatic':
				store.modal_data = {
					entities: [add_article].concat(
						Object.entries(store.article_cache).map(([id, article]) => {
							return {
								image: article.image ?? '/assets/article_icon.png',
								title: article.title,
								func: () => {
									if (store.selected_marker === null) {
										return;
									}
									dtb.update_marker({
										...selected_marker,
										query_id: +id
									});
								}
							};
						})
					)
				};
				break;
			case 'Map':
				store.modal_data = {
					entities: [add_map].concat(
						Object.entries(store.map_cache).map(([id, map]) => {
							return {
								image: map.image,
								title: map.title,
								func: () => {
									if (store.selected_marker === null) {
										return;
									}
									dtb.update_marker({
										...selected_marker,
										query_id: +id
									});
								}
							};
						})
					)
				};
		}
	}
</script>

<div id="toolbar">
	<button
		onclick={() => dtb.delete_marker(store.selected_marker)}
		class:hidden={!store.edit_mode || store.selected_marker === null}
		style="background-image: url('/assets/delete_marker.png');"
		title="Delete selected marker"
	></button>
	<button
		onclick={() => {
			changeMarkerTarget();
		}}
		style="background-image: url('/assets/change_marker.png');"
		title="Set target of selected marker"
		class:hidden={!store.edit_mode || store.selected_marker === null}
	></button>
	<button
		onclick={(_event: MouseEvent) => dtb.create_and_select_marker_in_current_map()}
		class:hidden={!store.edit_mode}
		style="background-image: url('/assets/add_marker.png');"
		title="Add new marker to map"
	></button>

	<button id="edit_content_button" class:edit_mode={store.edit_mode} onclick={toggleEditable}
	></button>
	<button
		id="increment_text_size_button"
		onclick={() => {
			change_text_size(1.1);
		}}
		style="background-image: url('/assets/plus.png');"
		title="Increase text size"
		class:hidden={store.minimized}
	></button>

	<button
		id="decrement_text_size_button"
		onclick={() => {
			change_text_size(0.9);
		}}
		style="background-image: url('/assets/minus.png');"
		title="Decrease text size"
		class:hidden={store.minimized}
	></button>
	<button
		id="minimize_button"
		onclick={toggleMinimize}
		style="background-image: url('/assets/{store.minimized
			? 'double_arrow_left'
			: 'double_arrow_right'}.png');"
	></button>
</div>

<style>
	#toolbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 50px; /* TODO: Define once */
		background-color: #4b4343;
		color: white;
		display: flex;
		justify-content: flex-end; /* Ensures buttons are at the right end */
		align-items: center;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		z-index: 11;
	}
	#toolbar button {
		aspect-ratio: 4/3; /* Adjust the size as needed */
		height: 80%; /* Adjust the size as needed */
		border: none;
		padding: 10px;
		cursor: pointer;
		background-size: contain;
		background-position: center center;
		background-color: #4b4343;
		background-repeat: no-repeat;
	}

	#toolbar button:hover {
		opacity: 0.8; /* Slight hover effect */
	}

	#edit_content_button {
		background: url('/assets/edit-icon.png');
		margin-left: 10%;
	}

	#edit_content_button.edit_mode {
		background-color: #111;
	}

	#increment_text_size_button {
		margin-left: 5%;
	}

	.hidden {
		display: none;
	}
</style>
