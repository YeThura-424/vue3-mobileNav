<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeMenu" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-[#8B50FF]/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full justify-center items-end">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-fit max-w-md transform overflow-hidden transition-all absolute bottom-[90px]">
              <div class="upper_menu_wrapper flex justify-center gap-x-24">
                <div class="income_menu">
                  <router-links to="/transfer" class="focus:outline-none">
                    <button class="bg-[#0077FF] flex items-center justify-center rounded-full w-14 h-14">
                      <IconTransform class="text-3xl text-[#fff]" />
                    </button>
                  </router-links>
                </div>
              </div>
              <div class="lower_menu_wrapper flex justify-center gap-x-24">
                <div class="income_menu">
                  <router-links to="/income">
                    <button class="bg-[#00A86B] flex items-center justify-center rounded-full w-14 h-14">
                      <IconTransferIn class="text-3xl text-[#fff]" />
                    </button>
                  </router-links>
                </div>
                <div class="expense_menu">
                  <router-links to="/expense">
                    <button class="bg-[#FD3C4A] flex items-center justify-center rounded-full w-14 h-14">
                      <IconTransferOut class="text-3xl text-[#fff]" />
                    </button>
                  </router-links>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

import { IconTransferIn, IconTransferOut } from "@tabler/icons-vue";
import { ref, watch } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  verticalAlign: {
    type: String,
    default: "items-center",
  },
});
const emit = defineEmits(["dismiss"]);

const isOpen = ref(false);

watch(
  () => props.visible,
  (updateVisible) => {
    isOpen.value = updateVisible;
  }
);

function closeMenu() {
  isOpen.value = false;
  emit("dismiss", isOpen.value);
}
</script>
