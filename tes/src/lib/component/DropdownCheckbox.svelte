<script>
    //@ts-nocheck
    export let categories = [];
    export let selectedOptions = []; 
    export let selectedSubcategories = []; 
    export const existingSubcategories = []; 
    let showDropdown = false;

    function toggleDropdown() {
        showDropdown = !showDropdown;
    }

    function handleSelection(category, subcategory) {
        if (selectedSubcategories.includes(subcategory.id)) {
            selectedSubcategories = selectedSubcategories.filter(id => id !== subcategory.id);
            selectedOptions = selectedOptions.filter(opt => opt.subcategoryId !== subcategory.id);
        } else {
            selectedSubcategories = [...selectedSubcategories, subcategory.id];
            selectedOptions = [
                ...selectedOptions,
                {
                    categoryName: category.name,
                    subcategoryName: subcategory.name,
                    subcategoryId: subcategory.id,
                },
            ];
        }
    }
</script>

<div class="dropdown-container">
    <!-- Selected tags -->
    <div class="selected-tags">
        {#each selectedOptions as option}
            <div class="tag">
                {option.categoryName} > {option.subcategoryName}
                <button on:click={() => handleSelection(option.categoryName, option.subcategoryName)}>
                    &times;
                </button>
            </div>
        {/each}
        {#if selectedOptions.length > 0}
            <button class="clear-btn" on:click={() => { selectedOptions = []; selectedSubcategories = []; }}>
                Clear
            </button>
        {/if}
    </div>

    <!-- Dropdown trigger -->
    <button class="dropdown-trigger" on:click={toggleDropdown}>
        Choose Category and Subcategory
        <svg width="24" height="24" viewBox="0 0 24 24" class="arrow-icon" class:rotated={showDropdown}>
            <path fill="none" stroke="black" stroke-width="2" d="M6 9l6 6 6-6" />
        </svg>
    </button>

    <!-- Dropdown content -->
    {#if showDropdown}
        <div class="dropdown-content">
            {#each categories as category}
                <div class="category">
                    <p>{category.name}</p>
                    {#each category.subcategories as subcategory}
                        <div class="subcategory">
                            <input
                                type="checkbox"
                                id={subcategory.id}
                                checked={selectedSubcategories.includes(subcategory.id)}
                                on:change={() => handleSelection(category, subcategory)}
                            />
                            <label for={subcategory.id}>{subcategory.name}</label>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    {/if}
</div>
  
  <style>
    .dropdown-container {
        margin-top: 16px;
        position: relative;
    }
  
    .selected-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
  
    .tag {
        background-color: #f0f0f0;
        padding: 4px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
    }
  
    .tag button {
        margin-left: 4px;
        border: none;
        background: none;
        cursor: pointer;
    }
  
    .clear-btn {
        margin-left: 8px;
        padding: 4px 8px;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
    }
  
    .dropdown-trigger {
        margin-top: 8px;
        padding: 8px;
        border: 1px solid #ccc;
        background-color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 500px;
    }
  
    .arrow-icon {
        transition: transform 0.2s;
    }
  
    .rotated {
        transform: rotate(180deg);
    }
  
    .dropdown-content {
        position: absolute;
        top: 100%;
        z-index: 10;
        margin-top: 8px;
        border: 1px solid #ccc;
        padding: 8px;
        background-color: white;
        border-radius: 4px;
        width: 100%;
        max-width: 500px;
        max-height: 200px;
        overflow-y: auto;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .category {
        margin-bottom: 8px;
    }
  
    .subcategory {
        display: flex;
        align-items: center;
    }
  
    .subcategory input {
        margin-right: 4px;
    }
  </style>
  