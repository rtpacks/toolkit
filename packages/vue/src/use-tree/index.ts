import { ref, computed } from "vue";
import { merge } from "lodash-es";

export type Unit = string | number;

export interface INode {
  id: Unit;
  parent?: INode | null;
  children?: INode[];
  indeterminate?: boolean;
  checked?: boolean;
  [k: string]: unknown;
}

export interface TreeOption {
  fieldNames: {
    /**
     * 节点唯一标识
     */
    id: string;
    /**
     * 父节点标识
     */
    parent: string;
    /**
     * 子节点标识
     */
    children: string;
  };
}

const genDefaultTreeOption = (): TreeOption => ({
  fieldNames: {
    id: "id",
    parent: "parent",
    children: "children",
  },
});

export default function useTree(_nodes: INode[], option: Partial<TreeOption> = genDefaultTreeOption()) {
  option = merge(option, genDefaultTreeOption());
  const { fieldNames } = option as TreeOption;

  /**
   * 辅助函数，获取 keys
   * @param _nodes
   * @param keys
   * @param pass
   * @returns
   */
  const travelKeys = (_nodes: INode[], keys: Unit[], pass: (node: INode) => boolean) => {
    _nodes.forEach((_node) => {
      if (pass(_node)) {
        keys.push(_node[fieldNames.id] as Unit);
      }
      if (_node[fieldNames.children]) {
        travelKeys(_node[fieldNames.children] as INode[], keys, pass);
      }
    });
    return keys;
  };
  const nodes = ref<INode[]>([]);
  const nodeMap = ref<Record<Unit, INode>>({});
  const checkedKeys = computed(() => {
    return travelKeys(nodes.value, [], (node: INode) => !!node.checked);
  });
  const halfCheckedKeys = computed(() => {
    return travelKeys(nodes.value, [], (node: INode) => !!node.indeterminate);
  });

  const setNodes = (_nodes: INode[]) => {
    const travel = (_nodes: INode[], parent: INode | null = null) => {
      _nodes.forEach((_node) => {
        _node.parent = parent;
        nodeMap.value[_node[fieldNames.id] as Unit] = _node;
        const _children = _node[fieldNames.children] as INode[] | undefined;
        if (_children?.length) {
          travel(_children, _node);
        }
      });
      return _nodes;
    };
    nodes.value = travel(_nodes);
  };

  const isIndeterminate = (_node: INode): boolean => {
    return !!nodeMap.value[_node[fieldNames.id] as Unit]?.indeterminate;
  };
  const isChecked = (_node: INode): boolean => {
    return !!nodeMap.value[_node[fieldNames.id] as Unit]?.checked;
  };

  const parentEffect = (_node: INode) => {
    const _parent = nodeMap.value[_node[fieldNames.id] as Unit]?.parent;
    if (_parent) {
      const _children = _parent[fieldNames.children] as INode[];
      const [checkedCount, indeterminateCount] = _children.reduce(
        (target, item) => {
          target[0] += item.checked ? 1 : 0;
          target[1] += item.indeterminate ? 1 : 0;
          return target;
        },
        [0, 0],
      );
      _parent.checked = checkedCount > 0 && checkedCount === _children.length;
      _parent.indeterminate =
        indeterminateCount > 0 || (checkedCount > 0 && checkedCount < _children.length);
      parentEffect(_parent);
    }
  };

  const childrenEffect = (_node: INode, value: boolean) => {
    _node.checked = value;
    const _children = _node[fieldNames.children] as INode[] | undefined;
    if (_children?.length) {
      _children.forEach((item) => {
        item.checked = value;
        childrenEffect(item, value);
      });
    }
  };

  const checkedEffect = (_node: INode) => {
    parentEffect(_node);
    childrenEffect(_node, _node.checked!);
  };
  const handleChecked = (_node: INode, value: boolean) => {
    _node.checked = _node.indeterminate ? true : value;
    if (_node.indeterminate) {
      _node.indeterminate = false;
    }
    checkedEffect(_node);
    console.log(checkedKeys.value);
  };

  const init = () => {
    setNodes(_nodes);
  };
  init();

  return {
    nodes,
    checkedKeys,
    halfCheckedKeys,
    setNodes,
    handleChecked,
    isIndeterminate,
    isChecked,
  };
}
