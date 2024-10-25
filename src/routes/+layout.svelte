<script lang=ts>
	import '../app.css';
	import '../fonts.css'
	import { user } from '$auth/stores/UserStore';

	export let data;

	$: user.set(data.user)
</script>

<slot/>
