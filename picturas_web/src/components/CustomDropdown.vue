<template>
  <div :class="['relative', placement, 'custom-dropdown']" ref="triggerElement">
    <span @click="toggleDropdown" class="cursor-pointer">
      <i v-if="isIcon" :class="trigger"></i>
      <span v-else>{{ trigger }}</span>
    </span>
    <transition name="dropdown">
      <Teleport v-if="appendToBody && isOpen" to="body">
        <div
          :style="dropdownStyle"
          class="absolute bg-blue-50 shadow-md rounded mt-2 border border-gray-200 z-50 text-gray-700"
          ref="dropdownElement"
        >
          <ul>
            <li
              v-for="option in options"
              :key="option.label"
              class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click.stop="handleOptionClick(option)"
            >
              <div
                class="flex items-center gap-2"
                @click="option.action && project && handleClick(option.action, project)"
              >
                <i v-if="option.icon" :class="option.icon"></i>
                <span class="text-gray-700">{{ option.label }}</span>
              </div>
            </li>
          </ul>
        </div>
      </Teleport>
      <div
        v-else-if="isOpen"
        class="absolute bg-[#F5F7FA] shadow-md rounded mt-2 border border-gray-200 z-50"
        ref="dropdownElement"
      >
        <ul>
          <li
            v-for="option in options"
            :key="option.label"
            class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            @click.stop="handleOptionClick(option)"
          >
            <a
              v-if="option.route"
              href="javascript:void(0)"
              @click.prevent="openInNewTab(option)"
              class="flex items-center gap-2"
            >
              <i v-if="option.icon" :class="option.icon"></i>
              <span class="text-gray-700">{{ option.label }}</span>
            </a>
            <div v-else class="flex items-center gap-2">
              <i v-if="option.icon" :class="option.icon"></i>
              <span class="text-gray-700">{{ option.label }}</span>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Project } from "@/types/project";

interface Option {
  label: string;
  icon?: string;
  route?: string;
  target?: "_blank" | "_self";
  action?: () => void;
}

interface Props {
  placement: "right" | "left" | "top" | "bottom";
  trigger: string;
  options: Option[];
  isIcon?: boolean;
  isSidebar?: boolean;
  project?: Project;
  appendToBody?: boolean;
  menuColor?: string;
}

const props = defineProps<Props>();

const placement = props.placement;
const trigger = props.trigger;
const isSidebar = props.isSidebar;
const project = props.project;
const options = props.options;
const isIcon = props.isIcon;
const appendToBody = props.appendToBody;
const menuColor = props.menuColor || "#F5F7FA";

const isOpen = ref(false);
const triggerElement = ref<HTMLElement | null>(null);
const dropdownElement = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});

const toggleDropdown = (event: Event) => {
  event.stopPropagation();
  isOpen.value = !isOpen.value;
  if (isOpen.value && appendToBody) {
    updateDropdownPosition();
  }
};

const updateDropdownPosition = () => {
  if (triggerElement.value) {
    const rect = triggerElement.value.getBoundingClientRect();
    dropdownStyle.value = {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      backgroundColor: menuColor,
    };
  }
};

const emit = defineEmits(["open-new-tab", "rename", "move-to-trash", "edit"]);

const openInNewTab = (option: Option) => {
  if (option.route) {
    window.open(option.route, option.target || "_self");
  }
};

const handleClick = (action: () => void, project: Project) => {
  if (typeof action === "function" && !isSidebar) {
    action();
  } else if (String(action).includes("open-new-tab")) {
    emit("open-new-tab", project._id);
  } else if (String(action).includes("move-to-trash")) {
    emit("move-to-trash", project._id);
  }
};

const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  if (
    dropdownElement.value &&
    !dropdownElement.value.contains(event.target as Node) &&
    !triggerElement.value?.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

const handleOptionClick = (option: Option) => {
  if (option.action && project) {
    handleClick(option.action, project);
  } else if (option.route) {
    openInNewTab(option);
  }
  isOpen.value = false;
};

onMounted(() => {
  window.addEventListener("resize", updateDropdownPosition);
  window.addEventListener("scroll", updateDropdownPosition);
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDropdownPosition);
  window.removeEventListener("scroll", updateDropdownPosition);
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("touchstart", handleClickOutside);
});
</script>

<style scoped>
.relative.bottom .absolute {
  top: calc(100% + 8px);
  left: 0;
}

.relative.top .absolute {
  bottom: calc(100% + 8px);
  left: 0;
}

.relative.left .absolute {
  top: 0;
  right: calc(100% + 8px);
}

.relative.right .absolute {
  top: 0;
  left: calc(100% + 8px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.absolute {
  width: max-content;
}

.absolute ul {
  display: inline-block;
}
</style>
