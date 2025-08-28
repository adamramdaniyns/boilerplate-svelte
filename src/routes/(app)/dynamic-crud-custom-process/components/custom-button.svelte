<script lang="ts">
	import Button from "@/components/ui/button/button.svelte";
	import { showToast } from "../../../../stores/toast";

    /**
     * props will be passed from dynamicCrud component
     * if u want passed another props, u must add here and update the dynamicCrud component
     */
    export let selectedRow: Record<string, unknown> = {};
    export let fields: DefaultType[] = [];
    export let canMultiple: boolean = false;
    export let selectedRows: Record<string, unknown>[] = [];

    // for example here i will create simulation Verify Data
    async function verifyData() {

        /**
         * Handle multiple row selection
         * Verify each selected row
         */
        if(canMultiple) {

            if(selectedRows.length === 0) {
                showToast("Error", "Please select at least one row to verify.", "error");
                return;
            }

            await Promise.all(selectedRows.map(async (row) => {
                await fetch('/api/examples', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: row.name
                    })
                });
            }));

            return showToast("Success!", "Data verified successfully", "success");
        }

        if(!selectedRow) {
            showToast("Error", "Please select a row to verify.", "error");
            return;
        }

        await fetch('/api/examples', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: selectedRow.name
            })
        });
        showToast("Success!", "Data verified successfully", "success");
    }
</script>

<div class="flex gap-4">
  <Button variant="secondary" onclick={verifyData}>
    Process
  </Button>
</div>