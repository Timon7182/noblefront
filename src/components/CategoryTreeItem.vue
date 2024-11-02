<template>
  <div class="category-item" ref="dropdown" @mouseover="checkSpace">
    <!-- Category Button -->
    <button v-if="category.subCategoryPojoList && category.subCategoryPojoList.length > 0"
            @click="toggleDropdown"
            :class="['dropdown-button', { 'is-subcategory': level > 1 }]">
      {{ category.name }}
      <!-- Show the ">" symbol only on subcategories of subcategories (level > 1) -->
      <span v-if="level > 1 && category.subCategoryPojoList && category.subCategoryPojoList.length > 0" class="indicator"> &gt; </span>
    </button>

    <!-- If no subcategories, show as a link -->
    <a v-else :href="`/catalogue?categoryId=${category.id}`" 
       :class="['dropdown-link', { 'is-subcategory': level > 1 }]">
      {{ category.name }}
    </a>

    <!-- Dropdown menu for subcategories -->
    <div v-if="isOpen && category.subCategoryPojoList && category.subCategoryPojoList.length > 0"
         :class="['category-dropdown', { 'open-down': level === 1, 'open-left': shouldOpenLeft, 'open-right': !shouldOpenLeft && level > 1 }]">
      <!-- "Все" (All) styled with gray background -->
      <a :href="`/catalogue?categoryId=${category.id}`" class="dropdown-link is-subcategory all-categories-link">
        Все
      </a>

      <!-- Recursive subcategory rendering -->
      <div class="subcategory-container">
        <category-tree-item
          v-for="subCategory in category.subCategoryPojoList"
          :key="subCategory.id"
          :category="subCategory"
          :is-open="subOpenCategory === subCategory.id"
          :level="level + 1"
          @toggle="toggleSubCategory(subCategory.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryTreeItem',
  props: {
    category: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 1 // Start at level 1 for top-level categories
    }
  },
  data() {
    return {
      subOpenCategory: null, // Track which subcategory is open
      shouldOpenLeft: false  // Determine if subcategories should open to the left
    };
  },
  methods: {
    toggleDropdown() {
      this.$emit('toggle'); // Emit event to parent to toggle category
    },
    toggleSubCategory(subCategoryId) {
      // Toggle the selected subcategory, close others
      this.subOpenCategory = this.subOpenCategory === subCategoryId ? null : subCategoryId;
    },
    checkSpace() {
      const dropdown = this.$refs.dropdown;
      const rect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Check if there is enough space on the right, if not, open to the left
      if (rect.right + 220 > viewportWidth) {
        this.shouldOpenLeft = true;
      } else {
        this.shouldOpenLeft = false;
      }
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal && this.level > 1) {
        this.$nextTick(() => {
          this.checkSpace(); // Check space when subcategory opens
        });
      }
    }
  }
};
</script>

<style scoped>
/* General dropdown styling */
.category-item {
  position: relative;
}

/* First-level dropdown styling (open downwards below the button) */
.category-dropdown.open-down {
  position: absolute;
  top: 100%; /* Open downwards for the first level */
  left: 0;
  width: 220px;
  z-index: 999;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Subcategory dropdowns for level > 1 (open right by default) */
.category-dropdown.open-right {
  position: absolute;
  top: 0;
  left: 100%; /* Open to the right by default */
  width: 220px;
  z-index: 999;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Subcategory dropdowns that need to open to the left */
.category-dropdown.open-left {
  position: absolute;
  top: 0;
  right: 100%; /* Open to the left */
  width: 220px;
  z-index: 999;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* Subcategory container for subcategories */
.subcategory-container {
  padding-left: 0px; /* Consistent padding for all items */
}

/* "Все" (All) link styling */
.all-categories-link {
  font-size: 14px;
  padding: 10px 20px;
  display: block;
  color: #333;
  background-color: #e0e0e0;
}

.all-categories-link:hover {
  background-color: #d0d0d0;
}

/* Category buttons */
.dropdown-button {
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.is-subcategory {
  font-size: 14px;
  text-transform: none;
}

/* Links for categories without subcategories */
.dropdown-link {
  display: block;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
}

.is-subcategory.dropdown-link {
  font-size: 14px;
  padding: 10px 20px;
}

/* Indicator for subcategories with further subcategories */
.indicator {
  font-size: 14px;
  color: #333;
}

/* Hover effects */
.dropdown-button:hover,
.dropdown-link:hover {
  background-color: #e0e0e0;
}
</style>
