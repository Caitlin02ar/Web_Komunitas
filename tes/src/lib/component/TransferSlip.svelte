<script lang="ts">
    // @ts-nocheck
    import { createEventDispatcher } from "svelte"; // Import dispatcher
    export let title = "Transfer Slip";
    import upload_icon from '$lib/images/upload-icon.svg';
    
    let file: File | null = null; // Initialize file as null
    let previewUrl: string = ''; // Initialize preview URL
    const dispatch = createEventDispatcher(); // Create dispatcher
    
    /**
     * @param {{ target: { files: any[]; }; }} event
     */
     function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const selectedFile = input.files?.[0]; // Get the selected file
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            file = selectedFile;
            previewUrl = URL.createObjectURL(file); // Create a preview URL
            dispatch('fileSelected', file); // Dispatch the selected file
        } else {
            alert('Please select a PNG or JPG image.');
        }
    }
    
    /**
     * @param {{ preventDefault: () => void; dataTransfer: { files: any[]; }; }} event
     */
    function handleDrop(event: DragEvent) {
        event.preventDefault();
        const droppedFile = event.dataTransfer?.files[0]; // Get the dropped file
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            file = droppedFile;
            previewUrl = URL.createObjectURL(file); // Create a preview URL
            dispatch('fileSelected', file); // Dispatch the dropped file
        } else {
            alert('Please drop a PNG or JPG image.');
        }
    }
    
    /**
     * @param {{ preventDefault: () => void; }} event
     */
    function handleDragOver(event: DragEvent) {
        event.preventDefault(); // Allow the drop action
    }
    </script>
    
    <div class="transfer-slip">
        <h2>{title}</h2>
        <p>You can upload your transfer slip as proof of payment.</p>
        <div class="upload-section">
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="upload-box">
                <p class="upload-title">Upload your files</p>
                <p class="upload-subtitle">The file should be in PNG or JPG format.</p>
    
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="dropzone" on:drop={handleDrop} on:dragover={handleDragOver}>
                    {#if previewUrl}
                        <!-- svelte-ignore a11y-img-redundant-alt -->
                        <img src={previewUrl} alt="Image preview" class="image-preview" />
                    {:else}
                        <img src="{upload_icon}" alt="Upload icon" class="upload-icon">
                        <p>Drag and drop your files</p>
                    {/if}
                </div>
    
                <input type="file" id="file-upload" accept="image/*" on:change={handleFileChange} style="display:none;" />
                <button class="choose-file" on:click={() => document.getElementById('file-upload').click()}>Choose file</button>
            </div>
        </div>
    </div>

<style>
    .transfer-slip {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        width: 50%; 
        margin-left: 20px;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 10px;
    }

    p {
        margin-bottom: 20px;
        color: #666;
    }

    .upload-section {
        text-align: center;
    }

    .upload-box {
        border: 2px dashed #bbb;
        border-radius: 10px;
        padding: 20px;
        background-color: #f9f9f9;
    }

    .upload-title {
        font-weight: bold;
        font-size: 1.2rem;
        margin-bottom: 5px;
    }

    .upload-subtitle {
        color: #999;
        font-size: 0.9rem;
        margin-bottom: 15px;
    }

    .dropzone {
        border: 2px dashed #999;
        padding: 30px;
        border-radius: 8px;
        margin-bottom: 20px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .dropzone p {
        margin: 0;
        font-size: 1rem;
        color: #999;
    }

    .upload-icon {
        width: 40px;
        height: 40px;
        margin-top: 10px;
    }

    .image-preview {
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
    }

    .choose-file {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    .choose-file:hover {
        background-color: #0056b3;
    }

    input[type="file"] {
        display: none;
    }
</style>
