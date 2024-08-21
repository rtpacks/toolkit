import { ref, computed, Ref } from "vue";

export interface ICheckableTrait {
  _check?: boolean;
  curr?: boolean;
}

export type Item = ICheckableTrait & Record<string, unknown>;

export function useSelect<T extends Item = Item>(
  initValue: T[] = [],
  options = { id: "id", all: [] as T[] },
) {
  const idKey = options.id;
  const allItems = ref(
    options.all.map((x) => ({
      ...x,
      _check: initValue.map((v) => v[idKey]).includes(x[idKey]),
    })) || [],
  ) as Ref<T[]>;
  const selected = computed(() => {
    return allItems.value.filter((x) => x._check === true);
  });
  const selectedIds = computed(() => {
    return selected.value.map((el) => el[idKey]);
  });

  const select = (value: T) => {
    value._check = true;
  };
  const unselect = (value: T) => {
    value._check = false;
  };
  const toggleSelect = (flag: boolean, value: T) => {
    if (flag) {
      select(value);
    } else {
      unselect(value);
    }
  };

  const isSelected = (value: T) => {
    return selectedIds.value.includes(value[idKey]);
  };

  const setSelect = (v: boolean) => {
    allItems.value.forEach((item) => {
      item._check = v;
    });
  };
  const setSelectAll = setSelect;

  const sortItems = (newIndex: number, oldIndex: number) => {
    const item = allItems.value.splice(oldIndex, 1);
    allItems.value.splice(newIndex, 0, ...item);
  };

  const resetItems = (value: T[]) => {
    const keySet = new Set(value.map((x) => x[idKey]));
    allItems.value.forEach((v) => {
      v._check = keySet.has(v[idKey]);
    });
  };

  const pruneUncheckedItems = () => {
    allItems.value = allItems.value.filter((x) => x._check === true);
  };

  const pushItems = (value: T[]) => {
    // 保证唯一性
    const newItemsMap = value.reduce((target, item) => {
      target.set(item[idKey], item);
      return target;
    }, new Map());
    // index数据
    const oldItemsIndexMap = allItems.value.reduce((target, item, index) => {
      target.set(item[idKey], index);
      return target;
    }, new Map());

    newItemsMap.forEach((item, key) => {
      const oldIndex = oldItemsIndexMap.get(key);
      if (Number.isInteger(oldIndex)) {
        allItems.value[oldIndex] = {
          ...allItems.value[oldIndex],
          ...item,
        };
      } else {
        allItems.value.push({ ...item, _check: item._check || false });
      }
    });

    // trigger
    allItems.value = [...allItems.value];
  };

  const groupItems = () => {
    allItems.value.sort((a, b) => {
      return Number(b._check) - Number(a._check);
    });
  };

  const setAllItems = (value: T[]) => {
    allItems.value = value;
  };

  return {
    allItems,
    selected,
    selectedIds,
    setSelect,
    setSelectAll,
    select,
    unselect,
    toggleSelect,
    isSelected,
    sortItems,
    resetItems,
    pruneUncheckedItems,
    pushItems,
    groupItems,
    setAllItems,
  };
}
