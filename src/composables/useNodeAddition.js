import { useVueFlow, MarkerType } from "@vue-flow/core";
import { useVueFlowHelper } from "./helpers/useVueFlowHelper";
import { inject } from "vue";

export function useNodeAddition() {
  const {
    getNodes,
    getEdges,
    addNodes,
    addEdges,
    removeEdges,
    getOutgoers,
    updateNodeData,
    findNode,
    setViewport,
  } = useVueFlow();

  const allGotoEdgesArray = inject("allGotoEdgesArray");
  const nodes = inject("nodes");
  const edges = inject("edges");

  function updateEndNodePosition(newYPosition) {
    addNodes({
      id: "end",
      type: "startend",
      label: "Stop",
      position: { x: 498, y: newYPosition },
    });
  }

  const { getAllDescendantIds, updateView } = useVueFlowHelper();

  // 1.
  function addOneChild(nodeId, outgoingEdgesOfClickedNode, offset, props) {
    console.log("level", props.data.level);
    //remove all the gotoedge first:
    allGotoEdgesArray.value.forEach((gotoEdge) => removeEdges(gotoEdge?.id));

    //perform addition:

    const outgoerIds = getOutgoers(nodeId).map((node) => node.id);

    const outgoingEdgesId = outgoingEdgesOfClickedNode.value
      .filter((edge) => !edge.edgeId.includes("goto"))
      .map((edge) => edge.edgeId);

    const endNode = getNodes.value.find((node) => node.id === "end");
    const endNodeYPosition = endNode.position.y;

    if (outgoerIds.includes("end")) {
      removeEdges([...outgoingEdgesId]);

      offset.value = endNodeYPosition - props.position.y;

      if (offset.value < 351) {
        updateEndNodePosition(endNodeYPosition + 250);
      }

      const newChildNodeId = (Math.random() * 100).toFixed(2);
      addNodes({
        id: `node-${newChildNodeId}`,
        label: "Manager Approval",
        type: "process",
        data: {
          showQuestion: true,
          assignedTo: "",
          level: props.data.level + 1,
        },
        position: {
          x:
            findNode(nodeId).type === "handle"
              ? props.position.x - 147
              : props.position.x,
          y: props.position.y + 250,
        },
      });

      addEdges([
        {
          id: `edge-${(Math.random() * 1000).toFixed(3)}`,
          label: ``,
          type: "default",
          source: nodeId,
          target: `node-${newChildNodeId}`,
        },
        {
          id: `end-edge`,
          label: "",
          type: "straight",
          source: `node-${newChildNodeId}`,
          target: "end",
        },
      ]);
    } else {
      const newChildNodeId = (Math.random() * 100).toFixed(2);

      const parentHandleDataIdHandleToAddMultiple =
        findNode(nodeId).data.idHandleToAddMultiple;
      console.log(
        "parentHandleDataIdHandleToAddMultiple",
        parentHandleDataIdHandleToAddMultiple
      );

      const newNode = {
        id: `node-${newChildNodeId}`,
        label: "Manager Approval",
        type: "process",
        data: {
          showQuestion: false,
          assignedTo: "",
          level: props.data.level + 1,
          ...(parentHandleDataIdHandleToAddMultiple !== undefined && {
            idHandleToAddMultiple: parentHandleDataIdHandleToAddMultiple,
          }),
        },
        position: {
          x:
            findNode(nodeId).type === "handle"
              ? props.position.x - 147
              : props.position.x,
          y: props.position.y + 250,
        },
        // data: {
        //   ...(parentHandleDataIdHandleToAddMultiple !== undefined && {
        //     idHandleToAddMultiple: parentHandleDataIdHandleToAddMultiple,
        //   }),
        // },
      };

      addNodes(newNode);

      addEdges([
        {
          id: `edge-${(Math.random() * 1000).toFixed(3)}`,
          label: ``,
          source: nodeId,
          type: "default",
          target: `node-${newChildNodeId}`,
        },
      ]);

      if (!outgoerIds.includes("end")) {
        outgoerIds.forEach((value) => {
          addEdges({
            id: `edge-${(Math.random() * 1000).toFixed(5)}`,
            label: ``,
            source: `node-${newChildNodeId}`,
            target: value,
            type: "default",
          });
        });
      }

      removeEdges([...outgoingEdgesId]);

      const idsNodeToShift = getAllDescendantIds(nodeId).filter(
        (id) => id !== `node-${newChildNodeId}`
      );

      console.log("nodeID to shift", idsNodeToShift);

      const shouldUpdateNodeData =
        !(
          findNode(`node-${newChildNodeId}`).data.level <=
          findNode(idsNodeToShift[0]).data.level
        ) || findNode(idsNodeToShift[0]).type !== "handle";
      console.log(shouldUpdateNodeData);

      idsNodeToShift.forEach((id) => {
        const tempNode = findNode(id);

        addNodes({
          id: tempNode.id,
          label: tempNode.label,
          type: tempNode.type,
          position: { x: tempNode.position.x, y: tempNode.position.y + 250 },
        });

        if (shouldUpdateNodeData)
          updateNodeData(tempNode.id, { level: tempNode.data.level + 1 });
      });
    }

    //we udpate node value in order to use dagre library effectively before adding those gotoEdges array
    nodes.value = getNodes.value;
    edges.value = getEdges.value;

    //now add all those edges as they were
    addEdges(allGotoEdgesArray.value);

    // update;
    // setViewport(
    //   { x: 0, y: 400 - endNodeYPosition, zoom: 1 },
    //   { duration: 800 }
    // );
  }

  //2.
  function addMultipleChild(outgoingEdgesOfClickedNode, nodeId, props) {
    console.log(props.data.level);
    //remove all goto edges first
    allGotoEdgesArray.value.forEach((gotoEdge) => {
      console.log(gotoEdge);
      removeEdges(gotoEdge.id);
    });

    //then add the multiple child
    const outgoingEdgesOfClickedNodeIds = outgoingEdgesOfClickedNode.value.map(
      (edge) => edge.edgeId
    );

    const outgoerIds = getOutgoers(nodeId).map((element) => element.id);

    if (outgoerIds.length < 2) {
      outgoerIds.includes("end")
        ? removeEdges(["end-edge"])
        : removeEdges([...outgoingEdgesOfClickedNodeIds]);

      const nodeIdForNewChildNode1 = (Math.random() * 1000).toFixed(3);
      const nodeIdForNewChildNode2 = (Math.random() * 1000).toFixed(3);
      const nodeIdForNewHandleNode = (Math.random() * 1000).toFixed(3);

      addNodes([
        {
          id: `node-${nodeIdForNewChildNode1}`,
          type: "managerbranch",
          position: { x: props.position.x - 350, y: props.position.y + 225 },
          data: {
            hasSibling: true,
            branchName: "",
            level: props.data.level + 1,
          },
        },
        {
          id: `node-${nodeIdForNewChildNode2}`,
          type: "managerbranch",
          position: { x: props.position.x + 400, y: props.position.y + 225 },
          data: {
            hasSibling: true,
            branchName: "",
            level: props.data.level + 1,
          },
        },
        {
          id: `handle-${nodeIdForNewHandleNode}`,
          label: `+`,
          type: "handle",
          position: {
            x:
              props.type === "handle"
                ? props.position.x
                : props.position.x + 147,
            y: props.position.y + 450,
          },
          data: { level: props.data.level + 1 },
        },
      ]);

      updateNodeData(nodeId, {
        idHandleToAddMultiple: `handle-${nodeIdForNewHandleNode}`,
      });

      const endNodeYPosition = findNode("end").position.y;
      const handleNodePositionY = getNodes.value.find(
        (node) => node.id === `handle-${nodeIdForNewHandleNode}`
      ).position.y;
      const offset = endNodeYPosition - handleNodePositionY;

      //it would re-render the node. won't have to worry of first removing the node before doing it.
      offset < 351 &&
        addNodes({
          id: "end",
          type: "startend",
          label: "Stop",
          position: { x: 498, y: handleNodePositionY + 250 },
        });

      const edgeIdForNewEdge1 = (Math.random() * 1000).toFixed(4);
      const edgeIdForNewEdge2 = (Math.random() * 1000).toFixed(4);

      const edgeIdForNewEndEdge1 = (Math.random() * 1000).toFixed(5);
      const edgeIdForNewEndEdge2 = (Math.random() * 1000).toFixed(5);

      addEdges([
        //first childnode to current node
        {
          id: `edge-${edgeIdForNewEdge1}`,
          label: ``,
          type: "default",
          source: nodeId,
          target: `node-${nodeIdForNewChildNode1}`,
        },
        //second childnode to current node
        {
          id: `edge-${edgeIdForNewEdge2}`,
          label: ``,
          type: "default",
          source: nodeId,
          target: `node-${nodeIdForNewChildNode2}`,
        },
        //first childnode to handle node
        {
          id: `handle-edge-${edgeIdForNewEndEdge1}`,
          label: ``,
          type: "default",
          source: `node-${nodeIdForNewChildNode1}`,
          target: `handle-${nodeIdForNewHandleNode}`,
        },
        //second childnode to handle node
        {
          id: `handle-edge-${edgeIdForNewEndEdge2}`,
          label: ``,
          type: "default",
          source: `node-${nodeIdForNewChildNode2}`,
          target: `handle-${nodeIdForNewHandleNode}`,
        },
        //handlenode to end node. addEdge isn't over-written so no need to worry about removing it if the node clicked isn't parent of end edge
        {
          id: "end-edge",
          type: "straight",
          source: `handle-${nodeIdForNewHandleNode}`,
          target: "end",
        },
      ]);

      // console.log(outgoerIds, outgoerIds.includes("end"));

      if (!outgoerIds.includes("end")) {
        outgoerIds.forEach((value) => {
          const newEdgeHandle = (Math.random() * 1000).toFixed(5);

          addEdges({
            id: `edge-${newEdgeHandle}`,
            label: ``,
            type: "straight",
            source: `handle-${nodeIdForNewHandleNode}`,
            target: value,
          });
        });

        //Logic of redrawing every child[Outgoing] node further down
        let goerIds = getNodes.value
          .filter((node) => node.id === `handle-${nodeIdForNewHandleNode}`)
          .map((node) => node.id);
        console.log("executed");

        // console.log(findNode(`handle-${nodeIdForNewHandleNode}`).data.level);
        // console.log(
        //   getOutgoers(`handle-${nodeIdForNewHandleNode}`)[0].data.level,
        //   getOutgoers(`handle-${nodeIdForNewHandleNode}`)[0].type
        // );

        const dontIncreaseLevel =
          getOutgoers(`handle-${nodeIdForNewHandleNode}`)[0].type ===
            "handle" &&
          findNode(`handle-${nodeIdForNewHandleNode}`).data.level <=
            getOutgoers(`handle-${nodeIdForNewHandleNode}`)[0].data.level;

        console.log("increaseLeve", dontIncreaseLevel);

        while (!goerIds.includes("end")) {
          const tempNodes = getOutgoers(goerIds[0]); //0 coz numHandle always gonna be 1

          tempNodes.map((tempNode) => {
            //redrawing of nodes(not edges) coz edges will arrange w.r.t. nodes
            addNodes({
              id: tempNode.id,
              label: tempNode.label,
              type: tempNode.type,
              position: {
                x: tempNode.position.x,
                y: tempNode.position.y + 250,
              },
              data: {
                ...tempNode.data,
                level: dontIncreaseLevel
                  ? tempNode.data.level
                  : tempNode.data.level + 1,
              },
            });

            goerIds[0] = tempNode.id;
          });
        }
      }
    } else {
      console.log("multiple outgoers po xan ta");
      const handleIdToBeConnected = findNode(nodeId).data.idHandleToAddMultiple;
      console.log(findNode(nodeId).data);
      console.log("handleId", handleIdToBeConnected);
      const newNode = (Math.random() * 1000).toFixed(4);

      const referenceNode = getOutgoers(nodeId)[getOutgoers(nodeId).length - 1];
      console.log("reference node", referenceNode);

      addNodes({
        id: `node-${newNode}`,
        type: "managerbranch",
        position: {
          x: referenceNode.position.x + 420,
          y: referenceNode.position.y,
        },
        data: {
          hasSibling: true,
          branchName: "",
          level: referenceNode.data.level,
        },
      });

      const edgeNewtoCur = (Math.random() * 10000).toFixed(2);
      const curToHandle = (Math.random() * 10000).toFixed(2);

      addEdges([
        {
          id: `edge-${edgeNewtoCur}`,
          label: ``,
          type: "default",
          source: nodeId,
          target: `node-${newNode}`,
        },
        {
          id: `edge-${curToHandle}`,
          label: ``,
          type: "default",
          source: `node-${newNode}`,
          target: handleIdToBeConnected,
        },
      ]);
    }

    //we udpate node value in order to use dagre library effectively before adding those gotoEdges array
    nodes.value = getNodes.value;
    edges.value = getEdges.value;

    //now redraw those edges as they are
    addEdges(allGotoEdgesArray.value);

    //now update view
    //update
    // setViewport(
    //   { x: 0, y: 500 - findNode("end").position.y, zoom: 1 },
    //   { duration: 800 }
    // );
  }

  return { addOneChild, addMultipleChild };
}
