import { useHandleConnections, useVueFlow, useNodeId } from "@vue-flow/core";
import { ref } from "vue";

export function useVueFlowHelper(nodes, edges) {
  const { getIncomers, getOutgoers, toObject, getNodes, findNode } =
    useVueFlow();

  //for tracking the viewport position:
  const viewportPositionY = ref(0);

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

  //   5. same as getAllChiildrenIds(nodeID)
  function getAllDescendantIds(nodeID) {
    let descendants = [];
    const children = getOutgoers(nodeID);

    children.forEach((child) => {
      descendants.push(child.id);
      descendants = descendants.concat(getAllDescendantIds(child.id));
    });
    return [...new Set(descendants)];
  }

  //5.1 same as getAllChildren(nodeID)
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

  // 9.
  function getImmediateParents(nodeID) {
    let immediateParents = [];

    function findParents(nodeId) {
      let parents = getIncomers(nodeId);

      parents.forEach((parent) => {
        if (parent.type !== "handle") {
          immediateParents.push(parent);
        } else {
          // If the parent is of type 'handle', we need to find its parents
          findParents(parent.id);
        }
      });
    }

    findParents(nodeID);
    return immediateParents;
  }

  //10.
  function getImmediateChildren(nodeID) {
    let immediateChildren = [];

    function findChildren(nodeId) {
      let children = getOutgoers(nodeId);

      children.forEach((child) => {
        if (child.type !== "handle") {
          immediateChildren.push(child);
        } else {
          // If the child is of type 'handle', we need to find its childs
          findChildren(child.id);
        }
      });
    }

    findChildren(nodeID);
    return immediateChildren;
  }

  // 11.
  function getAllNodeIdsExcept(nodeID) {
    return getNodes.value.filter(
      (node) =>
        ![nodeID, "start", "end"].includes(node.id) && node.type !== "handle"
    );
  }

  // 12.
  function getAllParents(nodeID) {
    let allParents = [];
    const parents = getIncomers(nodeID);

    parents.forEach((child) => {
      allParents.push(child);
      allParents = allParents.concat(getAllParents(child));
    });
    return [...new Set(allParents)];
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
    getImmediateParents,
    getImmediateChildren,
    getAllNodeIdsExcept,
    getAllParents,
  };
}
