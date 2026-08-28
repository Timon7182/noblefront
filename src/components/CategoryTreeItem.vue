<template>
  <div class="category-item">
    <!-- Category Button -->
    <button v-if="hasSubCategories" @click="toggleDropdown" ref="trigger"
      :class="['dropdown-button', { 'is-subcategory': level > 1 }]">
      {{ category.name }}
      <!-- Show the ">" symbol only on subcategories of subcategories (level > 1) -->
      <span v-if="level > 1 && hasSubCategories" class="indicator">
        &gt;
      </span>
    </button>

    <!-- If no subcategories, show as a link -->
    <a v-else :href="`/catalogue?categoryId=${category.id}`"
      :class="['dropdown-link', { 'is-subcategory': level > 1 }]">
      {{ category.name }}
    </a>

    <!-- Dropdown menu for subcategories -->
    <Teleport to="body" v-if="isOpen && hasSubCategories">
      <div :class="dropdownClasses" :style="dropdownPosition">

        <a v-if="category.name === 'Бренд'" :href="`/brands?parentId=${category.id}`" class="dropdown-link is-subcategory all-categories-link">
          Все
        </a>
        <a v-else :href="`/catalogue?categoryId=${category.id}`"
          class="dropdown-link is-subcategory all-categories-link">
          Все
        </a>

        <!-- Recursive subcategory rendering -->
        <div class="subcategory-container">
          <category-tree-item v-for="subCategory in category.subCategoryPojoList" :key="subCategory.id"
            :category="subCategory" :is-open="subOpenCategory === subCategory.id" :level="level + 1"
            @toggle="toggleSubCategory(subCategory.id)" @close-all-dropdowns="closeAllDropdowns" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { Teleport, defineAsyncComponent } from 'vue';

// Должна совпадать с .category-dropdown в стилях ниже
const DROPDOWN_WIDTH = 260;

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
    onWindowMove() {
      if (this.isOpen) {
        this.checkSpace();
        this.calculateDropdownPosition();
      }
    },
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
      this.shouldOpenLeft = rect.right + DROPDOWN_WIDTH > viewportWidth;
    },
    calculateDropdownPosition() {
      const triggerEl = this.$refs.trigger;
      const rect = triggerEl.getBoundingClientRect();

      // Compute viewport‑relative coordinates
      let top, left;
      if (this.level === 1) {
        top = rect.bottom;
        left = rect.left;
      } else {
        top = rect.top;
        left = this.shouldOpenLeft
          ? rect.left - DROPDOWN_WIDTH
          : rect.right;
      }

      // Use fixed instead of absolute
      this.dropdownPosition = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 999
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
  position: absolute;
  width: 260px;
  background-color: #FAF7F2;
  border: 1px solid #E5DFD4;
  padding: 8px 0;
  box-shadow: 0 18px 40px rgba(26, 26, 24, 0.08);
  z-index: 999;
}

/* Scrolling for second level */
.category-dropdown.open-down {
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;
}
.category-dropdown.open-down:hover {
  scrollbar-color: #D8D2C6 transparent;
}
.category-dropdown::-webkit-scrollbar {
  width: 4px;
}
.category-dropdown::-webkit-scrollbar-track {
  background: transparent;
}
.category-dropdown::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 999px;
}
.category-dropdown:hover::-webkit-scrollbar-thumb {
  background: #D8D2C6;
}

/* "Все" (All) link styling */
.all-categories-link {
  font-size: 13px;
  padding: 10px 20px;
  display: block;
  color: #6B655C;
  border-bottom: 1px solid #E5DFD4;
  margin-bottom: 4px;
}

.all-categories-link:hover {
  color: #1A1A18;
  background-color: #F2EDE5;
}

/* Category buttons: верхний уровень — тихие капители */
.dropdown-button {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1A1A18;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  position: relative;
  white-space: nowrap;
  transition: color 0.25s ease;
}

/* Длинные названия брендов переносятся, а не обрезаются */
.is-subcategory {
  font-size: 14px;
  letter-spacing: 0;
  text-transform: none;
  white-space: normal;
  line-height: 1.35;
  overflow-wrap: anywhere;
  align-items: flex-start;
}

/* Links for categories without subcategories */
.dropdown-link {
  display: block;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1A1A18;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.25s ease;
}

.is-subcategory.dropdown-link {
  font-size: 14px;
  letter-spacing: 0;
  text-transform: none;
  padding: 9px 20px;
  color: #6B655C;
  white-space: normal;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

/* Indicator for subcategories with further subcategories */
.indicator {
  font-size: 13px;
  color: #6B655C;
}

/* Hover effects */
.dropdown-button:hover,
.dropdown-link:hover {
  color: #9A6B4F;
}

.category-dropdown .dropdown-button,
.category-dropdown .dropdown-link {
  color: #6B655C;
}

.category-dropdown .dropdown-button:hover,
.category-dropdown .dropdown-link:hover {
  color: #1A1A18;
  background-color: #F2EDE5;
}
</style>
