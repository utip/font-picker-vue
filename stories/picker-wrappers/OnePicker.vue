<template>
	<div class="wrapper">
		<font-picker :api-key="apiKey"
				:active-font="activeFont"
				:options="options"
				@change="onChange"></font-picker>

		<p :class="`apply-font${this.pickerSuffix}`">
			The font will be applied to this text.
		</p>
	</div>
</template>

<script>
    import FontPicker from '../../lib/FontPicker';

    export default {
        props: ['defaultFont', 'options'],

		components: {
            'font-picker': FontPicker,
		},

        mounted() {
            if (this.options && this.options.name) {
                this.pickerSuffix = `-${this.options.name}`;
            } else {
                this.pickerSuffix = '';
            }
        },

		data() {
            return {
                apiKey: 'AIzaSyAOkdDlx49HCSBdu86oe8AD1Q7piIxlR6k',
                pickerSuffix: '',
				activeFont: this.defaultFont,
			};
		},

		methods: {
            onChange(nextFont) {
				this.activeFont = nextFont.family;
			},
		},
    }
</script>
