<script lang="ts">
	import Button from "@/components/ui/button/button.svelte";
	import { showToast } from "../../../stores/toast";

    /**
     * props will be passed from dynamicCrud component
     * if u want passed another props, u must add here and update the dynamicCrud component
     */
    export let selectedRow: Record<string, unknown> = {};
    export let fields: DefaultType[] = [];

    // for example here i will create simulation Verify Data
    async function verifyData() {

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