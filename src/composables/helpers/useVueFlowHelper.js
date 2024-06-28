import { useHandleConnections, useVueFlow, useNodeId } from "@vue-flow/core";

export function useVueFlowHelper(nodes, edges) {
  const { getIncomers, getOutgoers, toObject } = useVueFlow();

  // Calculation for hasMoreThanEqual2ChildNoGoTo() function
  const nodeId = useNodeId();
  const outgoingEdgesOfClickedNode = useHandleConnections({
    type: "source",
    nodeId,
  });

  //   1.
  function hasSiblingNode(nodeID) {
    const parentnodeID = getIncomers(nodeID)?.[0]?.id; //no nodes contain more than 1 parent node except handle node
    return parentnodeID ? getOutgoers(parentnodeID)?.length > 1 : null;
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
  function getAllDescendantIds(nodeID) {
    let descendants = [];
    const children = getOutgoers(nodeID);

    children.forEach((child) => {
      descendants.push(child.id);
      descendants = descendants.concat(getAllDescendantIds(child.id));
    });
    return [...new Set(descendants)];
  }

  //5.1
  function getAllDescendants(nodeID) {
    let descendants = [];
    const children = getOutgoers(nodeID);

    children.forEach((child) => {
      descendants.push(child);
      descendants = descendants.concat(getAllDescendants(child));
    });
    return [...new Set(descendants)];
  }

  // 6.
  function saveFlowchart() {
    const nodes = [];
    const edges = [];

    toObject().nodes.map((node) => nodes.push(node));
    toObject().edges.map((edge) => edges.push(edge));

    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    console.log("saved");
  }

  // 7.
  function restoreFromLocal() {
    nodes.value = JSON.parse(localStorage.getItem("nodes"));
    edges.value = JSON.parse(localStorage.getItem("edges"));
  }

  // 8.
  function hasMoreThanEqual2ChildNoGoTo(nodeID) {
    const outgoerNoGoTo = outgoingEdgesOfClickedNode.value.filter(
      (edge) => !edge.edgeId.includes("goto")
    );
    return outgoerNoGoTo.length >= 2;
  }

  return {
    hasSiblingNode,
    hasMoreThanEqual2Sibling,
    getAllSiblings,
    isHandleDirectChild,
    getAllDescendantIds,
    getAllDescendants,
    saveFlowchart,
    restoreFromLocal,
    hasMoreThanEqual2ChildNoGoTo,
  };
}
