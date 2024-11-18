<template>
  <div class="category-item">
    <!-- Category Button -->
    <button
      v-if="hasSubCategories"
      @click="toggleDropdown"
      ref="trigger"
      :class="['dropdown-button', { 'is-subcategory': level > 1 }]"
    >
      {{ category.name }}
      <!-- Show the ">" symbol only on subcategories of subcategories (level > 1) -->
      <span
        v-if="level > 1 && hasSubCategories"
        class="indicator"
      >
        &gt;
      </span>
    </button>

    <!-- If no subcategories, show as a link -->
    <a
      v-else
      :href="`/catalogue?categoryId=${category.id}`"
      :class="['dropdown-link', { 'is-subcategory': level > 1 }]"
    >
      {{ category.name }}
    </a>

    <!-- Dropdown menu for subcategories -->
    <Teleport to="body" v-if="isOpen && hasSubCategories">
      <div
        :class="dropdownClasses"
        :style="dropdownPosition"
      >
        <!-- "Все" (All) styled with gray background -->
        <a
          :href="`/catalogue?categoryId=${category.id}`"
          class="dropdown-link is-subcategory all-categories-link"
        >
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
            @close-all-dropdowns="closeAllDropdowns"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { Teleport, defineAsyncComponent } from 'vue';

export default {
  name: 'CategoryTreeItem',
  components: {
    Teleport,
    CategoryTreeItem: defineAsyncComponent(() => import('./CategoryTreeItem.vue')), // Lazy-load the component to resolve circular dependency
  },
  props: {
    category: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    level: {
      type: Number,
      default: 1, // Start at level 1 for top-level categories
    },
  },
  data() {
    return {
      subOpenCategory: null, // Track which subcategory is open
      shouldOpenLeft: false, // Determine if subcategories should open to the left
      dropdownPosition: {}, // Style object for positioning dropdown
    };
  },
  computed: {
    hasSubCategories() {
      return (
        this.category.subCategoryPojoList &&
        this.category.subCategoryPojoList.length > 0
      );
    },
    dropdownClasses() {
      return [
        'category-dropdown',
        {
          'open-down': this.level === 1,
          'open-left': this.shouldOpenLeft,
          'open-right': !this.shouldOpenLeft && this.level > 1,
        },
      ];
    },
  },
  methods: {
    toggleDropdown() {
      this.$emit('toggle'); // Emit event to parent to toggle category
    },
    toggleSubCategory(subCategoryId) {
      // Toggle the selected subcategory, close others
      this.subOpenCategory =
        this.subOpenCategory === subCategoryId ? null : subCategoryId;
    },
    checkSpace() {
      const triggerEl = this.$refs.trigger;
      const rect = triggerEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Check if there is enough space on the right, if not, open to the left
      this.shouldOpenLeft = rect.right + 220 > viewportWidth;
    },
    calculateDropdownPosition() {
      const triggerEl = this.$refs.trigger;
      const rect = triggerEl.getBoundingClientRect();

      let top, left;
      if (this.level === 1) {
        // For top-level categories, open downwards
        top = rect.bottom;
        left = rect.left;
      } else {
        // For subcategories, open to the side
        top = rect.top;
        left = this.shouldOpenLeft ? rect.left - 220 : rect.right;
      }

      this.dropdownPosition = {
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 999, // Ensure dropdown appears above other elements
      };
    },
    closeAllDropdowns() {
      // Close current dropdown
      this.subOpenCategory = null;
      this.$emit('close-all-dropdowns'); // Emit event to parent
    },
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.checkSpace();
          this.calculateDropdownPosition();
        });
      }
    },
  },
};
</script>


<style scoped>
/* General dropdown styling */
.category-item {
  position: relative;
}

/* Dropdown styles */
.category-dropdown {
  position: absolute; /* Now relative to the viewport */
  width: 220px;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

/* Scrolling for second level */
.category-dropdown.open-down {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
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

/* Subcategory container for subcategories */
.subcategory-container {
  /* No changes needed */
}
</style>
