<template>
	<FileManager v-if="isLoggedIn" />
	<Login class="mt-4" v-else/>
</template>

<script>

// Components
import Login from './auth';
import FileManager from './FileManager';

export default {
	name: 'App',
	components: {
		FileManager,
		Login,
	},
	props: {
	},
	created() {
		
	},
	destroyed() {
	},
	computed: {
		isLoggedIn(){
			return this.$store.state.fm.auth.loggedIn;
		},
	},
	methods: {
	},
};
</script>

