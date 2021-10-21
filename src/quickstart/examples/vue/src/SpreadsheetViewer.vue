<template>
	<div ref="sv"></div>
</template>

<style scoped>
	div {
	  height: 600px;
    width: 100%;
    border: 2px dashed #6c82dc;
	}
</style>

<script>
	import {SpreadsheetViewer} from '../../../spreadsheet-viewer/client-library/clientLibrary'

	export default {
		mounted() {
			SpreadsheetViewer({
				container: this.$refs.sv,
				assetsUrl: '../../../spreadsheet-viewer/sv/index.html'
			}).then(instance => {
				instance.configure({
					license: 'evaluation'
				})
				instance.loadWorkbook('../../../common/workbooks/sample-file.xlsx', 0)
			}).catch(console.error)
		}
	}
</script>
