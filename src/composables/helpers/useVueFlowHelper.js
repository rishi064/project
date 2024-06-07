import { useVueFlow } from "@vue-flow/core";

export function useVueFlowHelper() {
  const { getIncomers, getOutgoers } = useVueFlow();

  //   1.
  function hasSiblingNode(nodeID) {
    const parentnodeID = getIncomers(nodeID)?.[0]?.id; //no nodes contain more than 1 parent node except handle node
    return getOutgoers(parentnodeID).length > 1;
  }

  //   2.
  function hasMoreThanEqual2Sibling(nodeID) {
    const parentnodeID = getIncomers(nodeID)[0].id;
    return getOutgoers(parentnodeID).length > 2;
  }

  //   3.
  function getAllSiblings(nodeID) {
    const parentnodeID = getIncomers(nodeID)[0]?.id;
    return getOutgoers(parentnodeID);
  }

  //   4.
  function isHandleDirectChild(id) {
    const childTypes = getOutgoers(id).map((node) => node.type);
    return childTypes.includes("handle");
  }

  //   5.
  function getAllDescendants(nodeID) {
    let descendants = [];
    const children = getOutgoers(nodeID);

    children.forEach((child) => {
      descendants.push(child.id);
      descendants = descendants.concat(getAllDescendants(child.id));
    });

    return [...new Set(descendants)];
  }

  return {
    hasSiblingNode,
    hasMoreThanEqual2Sibling,
    getAllSiblings,
    isHandleDirectChild,
    getAllDescendants,
  };
}
