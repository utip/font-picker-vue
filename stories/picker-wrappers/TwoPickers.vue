<template>
	<div>
		<div class="wrapper">
			<font-picker
					:api-key="apiKey"
					:active-font="activeFont1"
					:options="{ name: '5' }"
					@change="nextFont => this.activeFont1 = nextFont.family"></font-picker>
			<p class="apply-font-5">
				The first font will be applied to this text.
			</p>
		</div>
		<div class="wrapper">
			<font-picker
					:api-key="apiKey"
					:active-font="activeFont2"
					:options="{ name: '6' }"
					@change="nextFont => this.activeFont2 = nextFont.family"></font-picker>
			<p class="apply-font-6">
				The second font will be applied to this text.
			</p>
		</div>
	</div>
</template>

<script>
    import FontPicker from '../../lib/FontPicker';

    export default {
        components: {
            'font-picker': FontPicker,
        },

        data() {
            return {
                apiKey: 'AIzaSyAOkdDlx49HCSBdu86oe8AD1Q7piIxlR6k',
                activeFont1: 'Open Sans',
                activeFont2: 'Barlow',
            };
        },
    }
</script>
