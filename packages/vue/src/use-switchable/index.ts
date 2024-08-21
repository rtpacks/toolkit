import { ref } from "vue";

export function useSwitchable(initValue = false) {
  const switchable = ref(initValue);
  const setSwitchable = (value: boolean) => {
    switchable.value = value;
  };
  const toggle = () => {
    switchable.value = !switchable.value;
  };
  return {
    switchable,
    setSwitchable,
    toggle,
  };
}
