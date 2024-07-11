import { inject } from "vue";
import { useVueFlow } from "@vue-flow/core";
import { useVueFlowHelper } from "./helpers/useVueFlowHelper";

export function useNodeDeletion() {
  const allGotoEdgesArray = inject("allGotoEdgesArray");
  const toUpdate = inject("toUpdate");

  const {
    removeNodes,
    addNodes,
    addEdges,
    getIncomers,
    getOutgoers,
    findNode,
    removeEdges,
    getConnectedEdges,
  } = useVueFlow();

  const {
    hasSiblingNode,
    hasMoreThanEqual2Sibling,
    isHandleDirectChild,
    getAllDescendantIds,
    getAllDescendants,
  } = useVueFlowHelper();

  function deleteNode(nodeId) {
    const connectedGotoIds = getConnectedEdges(nodeId)
      .filter((edge) => edge.id.includes("goto"))
      .map((edge) => edge.id);

    //remove all the gotoedge first:
    allGotoEdgesArray.value.forEach((gotoEdge) => removeEdges(gotoEdge?.id));

    const targetOfSelected = getOutgoers(nodeId).map((node) => node.id);
    const sourceOfSelected = getIncomers(nodeId).map((node) => node.id);

    //case-I: there are no sibling nodes of the clicked node.[ie. No multiple node case]
    if (!hasSiblingNode(nodeId)) {
      console.log("descendant of ", nodeId, getAllDescendants(nodeId));

      //1st.0: Remove all connected gotos of that node
      allGotoEdgesArray.value = allGotoEdgesArray.value.filter(
        (edge) => !connectedGotoIds.includes(edge.id)
      );

      toUpdate.value = !toUpdate.value;

      //1st:Redraw every node above previous position wrt nodeId
      getAllDescendants(nodeId)
        .reverse()
        .forEach((node) => {
          const newPositionY = getIncomers(node.id)[0].position.y;
          addNodes({
            ...node,
            position: {
              ...node.position,
              y:
                node.id === "end"
                  ? newPositionY > 400
                    ? newPositionY
                    : 400
                  : newPositionY,
            },
            data: { ...node.data, level: node.data.level - 1 },
          });
        });

      // 2nd: remove the node
      removeNodes([nodeId]);

      // 3rd: connect source and target
      targetOfSelected.forEach((targetId) => {
        const edgeId = (Math.random() * 100).toFixed(4);
        addEdges([
          {
            id: targetOfSelected.includes("end")
              ? "end-edge"
              : `edge-${edgeId}`,
            label: ``,
            source: sourceOfSelected[0], //coz source always gonna be single except for handle
            target: targetId,
            type: targetOfSelected.length > 1 ? "default" : "straight",
          },
        ]);
      });
    }

    //   case-II: There are sibling nodes of the clicked node. [ie. Multple node case]
    if (hasSiblingNode(nodeId)) {
      // case II.1:more than 2 sibling nodes: just remove node.
      if (hasMoreThanEqual2Sibling(nodeId)) {
        if (isHandleDirectChild(nodeId)) {
          // II.1.1: No child in between[handle is direct child]
          removeNodes(nodeId); //no need to track edges
          // II.1.2: Remove the handle child
        } else {
          //II.1.2: there are child in between

          removeNodes(nodeId);
          //connect source and target after removal
          targetOfSelected.map((targetId) => {
            console.log("targetId", targetId);
            const edgeId = (Math.random() * 100).toFixed(4);

            addEdges([
              {
                id: `edge-${edgeId}`,
                label: `edge-${edgeId}`,
                source: sourceOfSelected[0], //coz source always gonna be single except for handle
                target: targetId,
                type: "default",
              },
            ]);
          });
        }
      } else {
        // case-II.2:just 2 sibling nodes: remove both nodes along with handle node. track edges

        if (isHandleDirectChild(nodeId)) {
          // II.2.1: ask for confirmation:
          const removeSiblingNode = prompt(
            `Press\n1 to remove sibling node upto ${targetOfSelected[0]}  \n2 to remove only the clicked node`
          );

          if (removeSiblingNode === "1") {
            const parentNodeId = sourceOfSelected[0]; //always a single parent node for every nodes which can be deleted
            const directHandleNodeId = targetOfSelected[0];

            //calculate outgoing nodes of direct handle node id in order to connect them to parent
            const newTargetIds = getOutgoers(directHandleNodeId).map(
              (node) => node.id
            );

            console.log(newTargetIds);

            const descendantIdsDirectHandleNode =
              getAllDescendantIds(directHandleNodeId);

            // Get all nodes between parentNodeId and directHandleNodeId
            const nodesToRemove = getAllDescendantIds(parentNodeId).filter(
              (node) => !descendantIdsDirectHandleNode.includes(node)
            );

            removeNodes([...nodesToRemove]);

            //connect the parent node to new target node:
            newTargetIds.map((targetId) => {
              const edgeId = (Math.random() * 100).toFixed(4);

              addEdges({
                id: targetId === "end" ? "end-edge" : `edge-${edgeId}`,
                label: ``,
                source: parentNodeId,
                target: targetId,
                animated: targetId === "end" ? false : true,
              });
            });
          } else if (removeSiblingNode === "2") {
            //remove only the clicked node and also the handle node
            removeNodes(nodeId);
            const directHandleId = targetOfSelected[0];

            const idParentNodeToBe = getIncomers(directHandleId).map(
              (node) => node.id
            )[0]; // target always a single in case where the node is direct child

            const idChildrenNodeToBe = getOutgoers(directHandleId).map(
              (node) => node.id
            );
            console.log("id of children node to become", idChildrenNodeToBe);

            removeNodes(directHandleId);

            idChildrenNodeToBe.map((targetId) => {
              const edgeId = (Math.random() * 100).toFixed(4);
              addEdges({
                id: targetId === "end" ? "end-edge" : `edge-${edgeId}`,
                label: ``,
                source: idParentNodeToBe,
                target: targetId,
                animated: targetId === "end" ? false : true,
              });
            });
          } else alert("Enter the correct number");
        } else {
          // 1. remove the clicked node
          removeNodes(nodeId);

          //2. connect new target to the parent node
          targetOfSelected.map((targetId) => {
            const edgeId = (Math.random() * 100).toFixed(4);
            addEdges({
              id: `edge-${edgeId}`,
              label: `edge-${edgeId}`,
              source: sourceOfSelected[0],
              target: targetId,
              animated: true,
            });
          });
        }
      }
    }

    //now add all those edges as they were
    addEdges(allGotoEdgesArray.value);
  }

  return { deleteNode };
}
